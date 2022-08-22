import chalk from 'chalk';
import Pixel from './tetris-pixel.js';

export default class ITetris extends Pixel {
  override x = -1;
  override y = -1;
  override skin = chalk.red('#');
  override shape: number[][] = [[1], [1], [1], [1]];

  override rotate(): void {
    if (this.shape.length === 4) this.shape = [[1, 1, 1, 1]];
    else this.shape = [[1], [1], [1], [1]];
  }

  override clone(): ITetris {
    const clone = new ITetris();
    clone.x = this.x;
    clone.y = this.y;
    clone.skin = this.skin;
    clone.shape = this.shape;
    return clone;
  }
}
