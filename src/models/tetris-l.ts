import chalk from 'chalk';
import Pixel from './game-pixel.js';

export default class LTetris extends Pixel {
  override x = -1;
  override y = -1;
  override skin = chalk.red('L');
  override shape: number[][] = [
    [1, 0, 0],
    [1, 1, 1],
  ];
}
