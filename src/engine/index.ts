/* eslint-disable no-process-exit */
import Pixel from '../models/tetris-pixel.js';
import {
  bingo,
  NEW_LINE,
  replaceAll,
  setGridContent,
  makeUnique,
  getGridContent,
  ROWS,
  GAME_CLOCK,
  COLS,
  initializeGameGrid,
  writeSaveFile,
} from '../constants/index.js';
import chalk from 'chalk';
import {clear as refresh, log as print} from 'console';
import readline from 'readline';

export default class TetrisEngine {
  score = 0;
  active?: Pixel;
  titleTile = '';
  nextPiece = bingo();
  playTetris?: NodeJS.Timeout;

  constructor(titleTile = '') {
    this.inputListener();
    this.titleTile = titleTile;
    this.playTetris = setInterval(this.renderFrames.bind(this), GAME_CLOCK);
  }

  async inputListener() {
    process.openStdin();
    process.stdin.setRawMode(true);
    readline.emitKeypressEvents(process.stdin);
    process.stdin.on('keypress', this.keypress.bind(this));
  }

  keypress(_str: string, key: {ctrl: string; name: string}) {
    if (key.ctrl && key.name === 'c') {
      if (!this.playTetris) process.exit();
    } else if (key.name === 'escape') {
      if (this.playTetris) this.pauseGame();
      else {
        this.playTetris = setInterval(this.renderFrames.bind(this), GAME_CLOCK);
      }
    } else if (this.playTetris) {
      switch (key.name) {
        case 'left':
          this.nextFrame({left: true});
          break;
        case 'right':
          this.nextFrame({right: true});
          break;
        case 'down':
          this.nextFrame({down: true});
          break;
        case 'space':
          this.nextFrame({rotate: true});
          break;
        case 'up':
          this.nextFrame({rotate: true});
          break;
      }
    }
  }

  renderFrames() {
    if (!this.active) {
      this.nextFrame({new: true});
    } else {
      this.nextFrame({down: true});
    }
  }

  private nextFrame(params?: {
    new?: boolean;
    down?: boolean;
    left?: boolean;
    right?: boolean;
    rotate?: boolean;
  }) {
    try {
      if (params?.new) {
        this.active = this.nextPiece;
        this.nextPiece = bingo();
      }
      const active = this.active?.clone();
      if (params?.rotate) active?.rotate();
      if (params?.down) active!.y = active!.y + 1;
      if (params?.left) active!.x = active!.x - 2 <= 0 ? 0 : active!.x - 2;
      if (params?.right)
        active!.x = active!.x + 2 >= COLS ? COLS : active!.x + 2;
      const collision = this.detectCollision(active!);
      if (collision && params?.down) {
        active!.y = active!.y - 1;
        this.active = undefined;
        this.generateFrame({cache: true, active});
      } else if (collision && params?.rotate) {
        this.generateFrame();
      } else if (collision) {
        this.generateFrame();
      } else {
        this.active = active;
        this.generateFrame();
      }
      this.checkScore();
      this.checkGameOver();
    } catch (error) {
      // eslint-disable-next-line no-empty
    }
  }

  private detectCollision(activeShape: Pixel) {
    const {x, y} = activeShape;
    const grid = getGridContent();
    const shape = activeShape.draw();
    for (let yVal = 0; yVal < shape!.length; yVal++) {
      const xRows = shape![yVal];
      if (xRows)
        for (let xVal = 0; xVal < xRows.length; xVal++) {
          const cell = xRows[xVal];
          if (cell !== ' ')
            if (y + yVal >= ROWS) {
              return true;
            } else if (grid[y + yVal]) {
              const gridValue = grid[y + yVal]![x + xVal];
              if (x + xVal >= COLS) {
                return true;
              } else if (gridValue !== ' ') {
                return true;
              }
            }
        }
    }
    return false;
  }

  private generateFrame(params?: {cache?: boolean; active?: Pixel}) {
    const active = params?.active || this.active;
    const x = active!.x;
    const y = active!.y;
    const shape = active!.draw();
    const grid = makeUnique(getGridContent());
    for (let yVal = 0; yVal < shape.length; yVal++) {
      const xRows = shape[yVal];
      if (xRows)
        for (let xVal = 0; xVal < xRows.length; xVal++) {
          const cell = xRows[xVal];
          if (grid[y + yVal]) {
            if (cell !== ' ') {
              grid[y + yVal]![x + xVal] = `${cell}`;
            }
          }
        }
    }
    this.printFrame(grid, params?.cache);
  }

  private checkScore() {
    const score: number[] = [];
    let grid = makeUnique(getGridContent());
    grid.forEach((row, i) => {
      if (i !== grid.length - 1 && !row.join('').includes(' ')) {
        score.push(i);
      }
    });
    if (score.length !== 0) {
      this.score += score.length * score.length;
      score.forEach(row => {
        const add = new Array(COLS);
        add.fill(' ');
        add.push('-');
        grid.splice(row, 1);
        grid = [add].concat(grid);
      });
      this.printFrame(grid, true);
    }
  }

  private getScore() {
    const score = String(this.score).padStart(9, '0');
    return score.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  }

  private checkGameOver() {
    if (
      this.detectCollision(this.active!) &&
      this.detectCollision(this.nextPiece)
    ) {
      refresh();
      clearInterval(this.playTetris);
      setGridContent(initializeGameGrid());
      this.playTetris = undefined;
      const game = `${this.titleTile}${NEW_LINE} Game Over. Press SPACE to restart or ESC to quit?`;
      print(game);
    }
  }
  private pauseGame() {
    refresh();
    writeSaveFile();
    clearInterval(this.playTetris);
    this.playTetris = undefined;
    const game = `${this.titleTile + NEW_LINE}GAME PAUSED!!!!!${
      NEW_LINE + NEW_LINE + NEW_LINE + chalk.green('!')
    } Press ${chalk.bgBlue(' ESC ')} to resume.${
      NEW_LINE + chalk.green('!')
    } Press ${chalk.bgBlue(' CTRL+C ')} twice to exit.`;
    print(game);
  }

  private printFrame(gridC: string[][], cache?: boolean) {
    refresh();
    if (cache) setGridContent(gridC);
    const gridContent = gridC.map((a, i) => {
      const pivot = Math.floor(gridC.length / 2);
      let row = `--${a.join('')}-`;
      if (i === pivot - 10) {
        row += `      ${chalk.blue('INCOMING')}      --`;
      } else if (i === pivot - 1) {
        row += `       ${chalk.blue('SCORE')}        --`;
      } else if (i === pivot + 1) {
        row += `     ${this.getScore()}    --`;
      } else if (i === pivot + 5) {
        row += `     ${chalk.blue('HIGH SCORE')}     --`;
      } else if (i === pivot + 7) {
        row += `     ${this.getScore()}    --`;
      } else if (i + 1 !== gridC.length) {
        row += '                    --';
      }
      return row;
    });
    let game = `------------------------------------------------${NEW_LINE}`;
    game = game + gridContent.join(NEW_LINE) + NEW_LINE;
    game = replaceAll(game, '-', chalk.bgWhite(' '));
    game = `${this.titleTile}${
      NEW_LINE + chalk.green('!')
    } Press ${chalk.bgBlue(' ESC ')} to pause.${
      NEW_LINE + chalk.green('!')
    } Press ${chalk.bgBlue(' UP ')} to rotate tetronome.${
      NEW_LINE + chalk.green('!')
    } Press ${chalk.bgBlue(' LEFT ')} ${chalk.bgBlue(
      ' RIGHT '
    )} or ${chalk.bgBlue(' DOWN ')} to move tetronme.${
      NEW_LINE + NEW_LINE
    }${game}`;
    print(game);
  }
}
