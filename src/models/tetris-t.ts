import chalk from 'chalk';
import Pixel from './game-pixel.js';

export default class TTetris extends Pixel {
  override x = -1;
  override y = -1;
  override skin = chalk.magenta('t');
  override shape: number[][] = [
    [1, 1, 1],
    [0, 1, 0],
  ];
}
