import Pixel from '../models/game-pixel.js';
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
} from '../constants/index.js';
import chalk from 'chalk';
import {clear as refresh, log as print} from 'console';
import readline from 'readline';

export default class TetrisEngine {
  active?: Pixel;
  titleTile = '';
  playTetris = setInterval(this.renderFrames.bind(this), GAME_CLOCK * 2);

  constructor(titleTile = '') {
    this.inputListener();
    this.titleTile = titleTile;
  }

  async inputListener() {
    this.active = bingo();
    process.stdin.setRawMode(true);
    readline.emitKeypressEvents(process.stdin);
    process.stdin.on('keypress', this.keypress.bind(this));
  }

  keypress(_str: string, key: {ctrl: string; name: string}) {
    try {
      if (key.ctrl && key.name === 'c') {
        throw new Error();
      } else {
        switch (key.name) {
          case 'left':
            this.nextFrame({left: true});
            break;
        }
        switch (key.name) {
          case 'right':
            this.nextFrame({right: true});
            break;
        }
        switch (key.name) {
          case 'down':
            this.nextFrame({down: true});
            break;
        }
        switch (key.name) {
          case 'space':
            this.nextFrame({rotate: true});
            break;
        }
        switch (key.name) {
          case 'up':
            this.nextFrame({rotate: true});
            break;
        }
      }
    } catch (error) {
      print('Bye');
    }
  }

  async renderFrames() {
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
    if (params?.new) {
      this.active = bingo();
    }
    const active = this.active?.clone();
    if (params?.rotate) active?.rotate();
    if (params?.down) active!.y = active!.y + 1;
    if (params?.left) active!.x = active!.x - 2 <= 0 ? 0 : active!.x - 2;
    if (params?.right) active!.x = active!.x + 2 >= COLS ? COLS : active!.x + 2;
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
          console.log(xVal);
          if (cell !== ' ')
            if (y + yVal >= ROWS) {
              return true;
            } else if (grid[y + yVal]) {
              const gridValue = grid[y + yVal]![x + xVal];
              if (x + xVal >= COLS) {
                return true;
              } else if (gridValue !== ' ') {
                console.log(y + yVal, x + xVal);
                return true;
              }
            }
        }
    }
    return false;
  }

  generateFrame(params?: {cache?: boolean; active?: Pixel}) {
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

  printFrame(gridC: string[][], cache?: boolean) {
    refresh();
    if (cache) setGridContent(gridC);
    const gridContent = gridC.map(
      (a, i) =>
        `--${a.join('')}-${i + 1 !== gridC.length && '                    --'}`
    );
    let game = `------------------------------------------------${NEW_LINE}`;
    game = game + game + gridContent.join(NEW_LINE) + NEW_LINE + game;
    game = replaceAll(game, '-', chalk.blue('#'));
    game = replaceAll(game, 'I', chalk.red('#'));
    game = replaceAll(game, 'L', chalk.white('#'));
    game = replaceAll(game, 'J', chalk.green('#'));
    game = replaceAll(game, 'O', chalk.cyan('#'));
    game = replaceAll(game, 'S', chalk.magenta('#'));
    game = replaceAll(game, 'T', chalk.yellow('#'));
    game = replaceAll(game, 'Z', chalk.gray('#'));
    game = `${this.titleTile}${NEW_LINE}${game}`;
    print(game, cache, this.active);
  }
}
