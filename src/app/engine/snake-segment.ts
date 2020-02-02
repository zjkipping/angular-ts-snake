import { Entity } from './entity';
import { EntityID, DrawLayer, Direction, Vector } from './utility-types';

export enum SegmentType {
  Head,
  Body
}

export class SnakeSegment extends Entity {
  id = EntityID.Snake;
  layer = DrawLayer.Snake;
  direction = Direction.None;

  constructor(public type: SegmentType, public position: Vector) {
    super();
  }

  update(gameTime: any) {}
  draw(canvas: any, gameTime: any) {}
}
