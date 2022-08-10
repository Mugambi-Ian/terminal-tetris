import chalk from 'chalk';
import Pixel from './game-pixel.js';

export default class ITetris extends Pixel {
  override x = -1;
  override y = -1;
  override skin = chalk.yellow('i');
  override shape: number[][] = [[1], [1], [1], [1]];
}
