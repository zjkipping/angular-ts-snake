import { Entity } from './entity';
import { EntityID, DrawLayer, Direction } from './utility-types';

export enum SegmentType {
  Head,
  Body
}

export class SnakeSegment extends Entity {
  id: EntityID.Snake;
  layer: DrawLayer.None;
  type: SegmentType;
  direction: Direction;

  update(gameTime: any) {}
  draw(canvas: any, gameTime: any) {}
}
