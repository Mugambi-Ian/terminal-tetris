import Pixel from './game-pixel.js';

export default class STetris extends Pixel {
  override x = -1;
  override y = -1;
  override skin = 'S';
  override shape: number[][] = [
    [0, 1, 1],
    [1, 1, 0],
  ];
  override rotate(): void {
    if (this.shape.length === 3)
      this.shape = [
        [0, 1, 1],
        [1, 1, 0],
      ];
    else
      this.shape = [
        [1, 0],
        [1, 1],
        [0, 1],
      ];
  }

  override clone(): STetris {
    const clone = new STetris();
    clone.x = this.x;
    clone.y = this.y;
    clone.skin = this.skin;
    clone.shape = this.shape;
    return clone;
  }
}
