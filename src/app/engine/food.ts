import { Entity } from './entity';
import { EntityID, DrawLayer, Vector, Dimensions } from './utility';

export class Food extends Entity {
  id = EntityID.Food;
  layer = DrawLayer.Food;

  constructor(public position: Vector) {
    super();
  }

  update(elapsedTime: number) {}

  draw(
    canvas: CanvasRenderingContext2D,
    pptRatio: Dimensions,
    layer: DrawLayer
  ) {}
}
