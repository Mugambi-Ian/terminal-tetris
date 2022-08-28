import chalk from 'chalk';
import Pixel from './tetris-pixel.js';

export default class TTetris extends Pixel {
  override x = -1;
  override y = -1;
  override skin = chalk.yellow('#');
  override shape: number[][] = [
    [0, 1, 0],
    [1, 1, 1],
  ];

  override rotate(): void {
    if (this.shape.length === 3 && this.shape[0]![0] === 1)
      this.shape = [
        [1, 1, 1],
        [0, 1, 0],
      ];
    else if (this.shape.length === 2 && this.shape[1]![0] === 0)
      this.shape = [
        [0, 1],
        [1, 1],
        [0, 1],
      ];
    else if (this.shape.length === 3 && this.shape[0]![0] === 0)
      this.shape = [
        [0, 1, 0],
        [1, 1, 1],
      ];
    else if (this.shape.length === 2 && this.shape[1]![0] === 1)
      this.shape = [
        [1, 0],
        [1, 1],
        [1, 0],
      ];
  }

  override clone(): TTetris {
    const clone = new TTetris();
    clone.x = this.x;
    clone.y = this.y;
    clone.skin = this.skin;
    clone.shape = this.shape;
    return clone;
  }
}
