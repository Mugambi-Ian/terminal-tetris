import {clear} from 'console';
import {NEW_LINE, replaceAll} from '../constants/index.js';
import Grid from '../models/game-grid.js';
import Pixel from '../models/game-pixel.js';
import ITetris from '../models/tetris-i.js';
import JTetris from '../models/tetris-j.js';
import LTetris from '../models/tetris-l.js';
import OTetris from '../models/tetris-o.js';
import STetris from '../models/tetris-s.js';
import TTetris from '../models/tetris-t.js';
import ZTetris from '../models/tetris-z.js';

export default class TetrisEngine {
  grid: Grid = new Grid();
  active: Pixel = this.bingo();
  downInterval = setInterval(this.renderFrames.bind(this), 1500);

  constructor(titleTile = '') {
    this.grid.setTitle(titleTile + NEW_LINE);
  }

  async launch() {
    await this.grid.initializeGameGrid();
  }

  async renderFrames() {
    await this.grid.initializeGameGrid();
    this.active = this.bingo();
    this.drawScene();
  }

  private bingo() {
    const pick = Math.floor(Math.random() * 6 + 1);
    let val = new Pixel();
    switch (pick) {
      case 1:
        val = new OTetris();
        val.x = 10;
        val.y = 2;
        break;
      case 2:
        val = new ITetris();
        val.x = 12;
        val.y = 2;
        break;
      case 3:
        val = new JTetris();
        val.x = 10;
        val.y = 2;
        break;

      case 4:
        val = new STetris();
        val.x = 10;
        val.y = 2;
        break;

      case 5:
        val = new LTetris();
        val.x = 10;
        val.y = 2;
        break;

      case 6:
        val = new ZTetris();
        val.x = 10;
        val.y = 2;
        break;

      case 7:
        val = new TTetris();
        val.x = 10;
        val.y = 2;
        break;
    }
    return val;
  }
  private drawScene(params?: {activeDown?: boolean}) {
    if (this.grid) {
      clear();
      const {gridContent: board} = this.grid;
      const {x, y, shape} = this.active.draw();
      shape.forEach((xPixels, i) => {
        const index = i + y;
        const line = board[index];
        if (params?.activeDown) {
          board[index - 1] = replaceAll(`${board[index - 1]}`, '#', ' ');
          this.active.y += 1;
        }
        board[index] =
          line?.substring(0, x) +
          xPixels.join('') +
          line?.substring(x + xPixels.length);
      });
      this.grid.gridContent = board;
      this.grid.printGame();
    }
  }
}
