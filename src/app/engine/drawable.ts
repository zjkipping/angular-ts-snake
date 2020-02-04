import { Dimensions } from './utility-types';

export abstract class Drawable {
  abstract update(elapsedTime: number, ...args: any): void;
  abstract draw(
    canvas: CanvasRenderingContext2D,
    tileRatio: Dimensions,
    ...args: any
  ): void;
}
