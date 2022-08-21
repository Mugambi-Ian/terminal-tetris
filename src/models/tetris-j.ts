import Pixel from './game-pixel.js';

export default class JTetris extends Pixel {
  override x = -1;
  override y = -1;
  override skin = 'J';
  override shape: number[][] = [
    [1, 1],
    [0, 1],
    [0, 1],
  ];

  override rotate(): void {
    if (this.shape.length === 3 && this.shape[0]![1] === 1)
      this.shape = [
        [0, 0, 1],
        [1, 1, 1],
      ];
    else if (this.shape.length === 2 && this.shape[0]![1] === 1)
      this.shape = [
        [1, 1],
        [0, 1],
        [0, 1],
      ];
    else if (this.shape.length === 3 && this.shape[0]![1] === 0)
      this.shape = [
        [1, 1, 1],
        [1, 0, 0],
      ];
    else if (this.shape.length === 2 && this.shape[0]![1] === 0)
      this.shape = [
        [1, 0],
        [1, 0],
        [1, 1],
      ];
  }

  override clone(): JTetris {
    const clone = new JTetris();
    clone.x = this.x;
    clone.y = this.y;
    clone.skin = this.skin;
    clone.shape = this.shape;
    return clone;
  }
}
