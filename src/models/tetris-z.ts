import Pixel from './game-pixel.js';

export default class ZTetris extends Pixel {
  override x = -1;
  override y = -1;
  override skin = 'Z';
  override shape: number[][] = [
    [1, 1],
    [0, 1, 1],
  ];
  override rotate(): void {
    if (this.shape.length === 3)
      this.shape = [
        [1, 1],
        [0, 1, 1],
      ];
    else
      this.shape = [
        [0, 1],
        [1, 1],
        [1, 0],
      ];
  }
  override clone(): ZTetris {
    const clone = new ZTetris();
    clone.x = this.x;
    clone.y = this.y;
    clone.skin = this.skin;
    clone.shape = this.shape;
    return clone;
  }
}
