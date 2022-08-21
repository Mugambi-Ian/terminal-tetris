import Pixel from './game-pixel.js';

export default class TTetris extends Pixel {
  override x = -1;
  override y = -1;
  override skin = 't';
  override shape: number[][] = [
    [0, 1],
    [1, 1, 1],
  ];
  override clone(): TTetris {
    const clone = new TTetris();
    clone.x = this.x;
    clone.y = this.y;
    clone.skin = this.skin;
    clone.shape = this.shape;
    return clone;
  }
}
