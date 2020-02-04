import { Vector, DrawLayer, EntityID } from './utility';
import { Drawable } from './drawable';

export abstract class Entity extends Drawable {
  abstract id: EntityID;
  abstract layer: DrawLayer;
  abstract position: Vector;
}
