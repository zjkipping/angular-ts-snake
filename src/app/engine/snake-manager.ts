import { SnakeSegment } from './snake-segment';
import { EntityManager } from './entity-manager';

export class SnakeManager extends EntityManager {
  segments: SnakeSegment[] = [];

  update(gameTime: any, keyboard: any) {}
  draw(canvas: any, gameTime: any) {}
}
