import { Entity } from './entity';
import { EntityID, DrawLayer, Vector } from './utility-types';

export class Food extends Entity {
  id = EntityID.Food;
  layer = DrawLayer.Food;

  constructor(public position: Vector) {
    super();
  }

  update(gameTime: any) {}
  draw(canvas: any, gameTime: any) {}
}
