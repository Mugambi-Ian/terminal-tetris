export default class Pixel {
  x = -1;
  y = -1;
  skin = ' ';
  shape: number[][] = [[1]];

  constructor() {}
  draw(): string[][] {
    const shape: string[][] = this.shape.map(xPixels => {
      const print: string[] = [];
      const xLength = xPixels.length * 2;
      for (let i = 0; i < xLength; i++) {
        const draw = xPixels[Math.floor(i / 2)];
        print[i] = draw ? this.skin : ' ';
      }
      return print;
    });
    return shape;
  }

  clone(): Pixel {
    const clone = new Pixel();
    clone.x = this.x;
    clone.y = this.y;
    clone.skin = this.skin;
    clone.shape = this.shape;
    return clone;
  }

  rotate(): void {}
}
