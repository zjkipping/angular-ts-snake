import { SnakeSegment } from './snake-segment';
import { EntityManager } from './entity-manager';
import { UserInputStatuses } from './user-input-manager';

export class SnakeManager extends EntityManager {
  segments: SnakeSegment[] = [];

  update(elapsedTime: number, userInput: UserInputStatuses) {}
  draw(canvas: CanvasRenderingContext2D, elapsedTime: number) {}
}
