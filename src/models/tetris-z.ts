import chalk from 'chalk';
import Pixel from './game-pixel.js';

export default class ZTetris extends Pixel {
  override x = -1;
  override y = -1;
  override skin = chalk.blackBright('z');
  override shape: number[][] = [
    [1, 1, 0],
    [0, 1, 1],
  ];
}
