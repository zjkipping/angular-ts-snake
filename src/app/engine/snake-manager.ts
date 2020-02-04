import { SnakeSegment } from './snake-segment';
import { EntityManager } from './entity-manager';
import { UserInputStatuses, KeyStatus } from './user-input-manager';
import { Direction, Dimensions, DrawLayer } from './utility-types';

export class SnakeManager extends EntityManager {
  segments: SnakeSegment[] = [];
  position = { x: 12, y: 12 };
  direction = Direction.None;
  movementTimeElapsed = 0;

  update(elapsedTime: number, userInput: UserInputStatuses) {
    this.movementTimeElapsed += elapsedTime;

    if (userInput.up === KeyStatus.Down) {
      this.direction = Direction.Up;
    } else if (userInput.down === KeyStatus.Down) {
      this.direction = Direction.Down;
    } else if (userInput.left === KeyStatus.Down) {
      this.direction = Direction.Left;
    } else if (userInput.right === KeyStatus.Down) {
      this.direction = Direction.Right;
    }

    if (this.movementTimeElapsed >= 150) {
      this.movementTimeElapsed = 0;
      switch (this.direction) {
        case Direction.Up:
          this.position.y--;
          break;
        case Direction.Down:
          this.position.y++;
          break;
        case Direction.Left:
          this.position.x--;
          break;
        case Direction.Right:
          this.position.x++;
          break;
      }
    }
  }

  draw(
    canvas: CanvasRenderingContext2D,
    pptRatio: Dimensions,
    layer: DrawLayer
  ) {
    if (layer === DrawLayer.Snake) {
      canvas.beginPath();
      canvas.fillStyle = 'rgba(57, 185, 192, 1)';
      canvas.fillRect(
        this.position.x * pptRatio.width,
        this.position.y * pptRatio.height,
        pptRatio.width,
        pptRatio.height
      );
      canvas.stroke();
      canvas.closePath();
    }
  }
}
