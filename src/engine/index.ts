import {
  bingo,
  NEW_LINE,
  replaceAll,
  makeUnique,
  ROWS,
  COLS,
  writeSaveFile,
  gameGrid,
  setGameGridContent,
  readLine,
  initPlayTetris,
  playTetris,
  clearPlayTetris,
  FOOTER,
} from '../constants/index.js';
import Pixel from '../models/tetris-pixel.js';
import chalk from 'chalk';
import {clear as refresh, log as print} from 'console';
import readline from 'readline';

export default class TetrisEngine {
  score = 0;
  highScore = 0;
  highScoreCache = 0;
  active?: Pixel;
  titleTile = '';
  nextPiece = bingo();

  constructor(titleTile = '', highScore: number, score = 0) {
    this.inputListener();
    this.titleTile = titleTile;
    this.highScore = highScore;
    this.highScoreCache = highScore;
    this.score = score;
    if (score > highScore) this.highScore = score;
    this.renderFrames();
    initPlayTetris(this.renderFrames.bind(this));
  }

  inputListener() {
    process.openStdin();
    if (process.stdin.isTTY) process.stdin.setRawMode(true);
    readline.emitKeypressEvents(process.stdin, readLine);
    process.stdin.on('keypress', this.keypress.bind(this));
  }

  keypress(_str: string, key: {ctrl: string; name: string}) {
    if (key.name === 'escape') {
      if (playTetris) this.pauseGame();
      else {
        initPlayTetris(this.renderFrames.bind(this));
      }
      // eslint-disable-next-line no-process-exit
    } else if (key.ctrl && key.name === 'c' && !playTetris) process.exit();
    else if (playTetris) {
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
    const grid = gameGrid;
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
    const grid = makeUnique(gameGrid);
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
    let grid = makeUnique(gameGrid);
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
  private getHighScore() {
    if (this.score > this.highScore) this.highScore = this.score;
    const score = String(this.highScore).padStart(9, '0');
    return score.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  }

  private checkGameOver() {
    if (
      this.detectCollision(this.active!) &&
      this.detectCollision(this.nextPiece)
    ) {
      refresh();
      clearPlayTetris();
      setGameGridContent();
      writeSaveFile(this.highScore);
      this.score = 0;
      const game = `${this.titleTile + NEW_LINE}GAME OVER!!!!!${
        NEW_LINE + NEW_LINE + NEW_LINE + chalk.green('!')
      } Press ${chalk.bgBlue(' ESC ')} to restart. ${
        NEW_LINE + chalk.green('!')
      } Press ${chalk.bgBlue(' CTRL+C ')} twice to exit.${FOOTER()}`;
      print(game);
    }
  }

  private pauseGame() {
    refresh();
    clearPlayTetris();
    writeSaveFile(this.highScoreCache, `${this.score}`);
    const game = `${this.titleTile + NEW_LINE}GAME PAUSED!!!!!${
      NEW_LINE + NEW_LINE + NEW_LINE + chalk.green('!')
    } Press ${chalk.bgBlue(' ESC ')} to resume.${
      NEW_LINE + chalk.green('!')
    } Press ${chalk.bgBlue(' CTRL+C ')} twice to exit.${FOOTER()}`;
    print(game);
  }

  private printFrame(gridParam: string[][], cache?: boolean) {
    refresh();
    if (cache) setGameGridContent(gridParam);
    const incoming = this.nextPiece.draw();
    const gridContent = gridParam.map((a, i) => {
      const pivot = Math.floor(gridParam.length / 2);
      let row = `--${a.join('')}-`;
      if (i === pivot - 10) {
        row += `      ${chalk.blue('INCOMING')}      --`;
      } else if (incoming[0] && i === pivot - 8) {
        row += this.printNextPiece(incoming[0]) + '--';
      } else if (incoming[1] && i === pivot - 7) {
        row += this.printNextPiece(incoming[1]) + '--';
      } else if (incoming[2] && i === pivot - 6) {
        row += this.printNextPiece(incoming[2]) + '--';
      } else if (incoming[3] && i === pivot - 5) {
        row += this.printNextPiece(incoming[3]) + '--';
      } else if (i === pivot - 1) {
        row += `       ${chalk.blue('SCORE')}        --`;
      } else if (i === pivot + 1) {
        row += `     ${this.getScore()}    --`;
      } else if (i === pivot + 5) {
        row += `     ${chalk.blue('HIGH SCORE')}     --`;
      } else if (i === pivot + 7) {
        row += `     ${this.getHighScore()}    --`;
      } else if (i + 1 !== gridParam.length) {
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
    }${game}${FOOTER()}`;
    print(game);
  }

  private printNextPiece(incoming: string[]) {
    let row = '';
    const val = incoming.join('');
    let add = 20 - incoming.length;
    row += add % 2 === 0 ? '' : ' ';
    add = add % 2 !== 0 ? add - 1 : add;
    add = add / 2;
    const space = new Array(add);
    space.fill(' ');
    return row + space.join('') + val + space.join('');
  }
}
