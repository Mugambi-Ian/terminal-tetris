import Pixel from './game-pixel.js';

export default class OTetris extends Pixel {
  override x = -1;
  override y = -1;
  override skin = 'O';
  override shape: number[][] = [
    [1, 1],
    [1, 1],
  ];
  override rotate(): void {}
}
