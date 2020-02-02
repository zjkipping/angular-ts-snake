export abstract class Drawable {
  abstract update(elapsedTime: number, ...args: any): void;
  abstract draw(
    canvas: CanvasRenderingContext2D,
    screenRatio: number,
    ...args: any
  ): void;
}
