import chalk from 'chalk';
import Pixel from './tetris-pixel.js';

export default class OTetris extends Pixel {
  override x = -1;
  override y = -1;
  override skin = chalk.cyan('#');
  override shape: number[][] = [
    [1, 1],
    [1, 1],
  ];
  override rotate(): void {}
}
