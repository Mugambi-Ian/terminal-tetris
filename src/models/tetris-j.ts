import chalk from 'chalk';
import Pixel from './game-pixel.js';

export default class JTetris extends Pixel {
  override x = -1;
  override y = -1;
  override skin = chalk.gray('J');
  override shape: number[][] = [
    [0, 0, 1],
    [1, 1, 1],
  ];
}
