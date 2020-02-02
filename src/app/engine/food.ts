import { Entity } from './entity';
import { EntityID, DrawLayer } from './utility-types';

export class Food extends Entity {
  id: EntityID.Food;
  layer: DrawLayer.Food;

  update(gameTime: any) {}
  draw(canvas: any, gameTime: any) {}
}
