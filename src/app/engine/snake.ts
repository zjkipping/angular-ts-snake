import { Entity } from './entity';
import { EntityID, DrawLayer } from './utility-types';
import { SnakeSegment } from './snake-segment';

export class Snake extends Entity {
  id: EntityID.Snake;
  layer: DrawLayer.None;
  segments: SnakeSegment[] = [];

  update(gameTime: any, keyboard: any) {}
  draw(canvas: any, gameTime: any) {}
}
