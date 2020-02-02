import { Vector, DrawLayer, EntityID } from './utility-types';

export abstract class Entity {
  id: EntityID;
  layer: DrawLayer;
  position: Vector;

  abstract update(gameTime: any, ...args: any);
  abstract draw(canvas: any, gameTime: any, ...args: any);
}
