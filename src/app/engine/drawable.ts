import { Dimensions, DrawLayer } from './utility-types';

export abstract class Drawable {
  abstract update(elapsedTime: number, ...args: any): void;
  abstract draw(
    canvas: CanvasRenderingContext2D,
    pptRatio: Dimensions,
    layer: DrawLayer,
    ...args: any
  ): void;
}
