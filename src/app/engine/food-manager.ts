import { EntityManager } from './entity-manager';
import { Dimensions, DrawLayer } from './utility';

export class FoodManager extends EntityManager {
  update(elapsedTime: number) {}
  draw(
    canvas: CanvasRenderingContext2D,
    pptRatio: Dimensions,
    layer: DrawLayer
  ) {}
}
