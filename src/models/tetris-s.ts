import chalk from 'chalk';
import Pixel from './game-pixel.js';

export default class STetris extends Pixel {
  override x = -1;
  override y = -1;
  override skin = chalk.cyan('S');
  override shape: number[][] = [
    [0, 1, 1],
    [1, 1, 0],
  ];
}
