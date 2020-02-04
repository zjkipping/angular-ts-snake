import { SnakeSegment, SegmentType } from './snake-segment';
import { EntityManager } from './entity-manager';
import {
  Direction,
  Dimensions,
  DrawLayer,
  Vector,
  screenCenter,
  UserInputStatuses,
  isKeyDown,
  wasKeyPressed
} from './utility';

export class SnakeManager extends EntityManager {
  head = new SnakeSegment(SegmentType.Head, screenCenter, Direction.None);
  bodySegments: SnakeSegment[] = [];
  turns = new Map<string, Direction>();
  movementTimeElapsed = 0;

  update(elapsedTime: number, userInput: UserInputStatuses) {
    this.movementTimeElapsed += elapsedTime;

    let newDirection = this.head.direction;
    if (isKeyDown(userInput.up)) {
      newDirection = Direction.Up;
    } else if (isKeyDown(userInput.down)) {
      newDirection = Direction.Down;
    } else if (isKeyDown(userInput.left)) {
      newDirection = Direction.Left;
    } else if (isKeyDown(userInput.right)) {
      newDirection = Direction.Right;
    }

    // temporary until eating fruit is added (need hit detection & random spawning first)
    if (wasKeyPressed(userInput.start)) {
      this.bodySegments.push(
        new SnakeSegment(
          SegmentType.Body,
          findNewSegmentPosition(this.head.position, this.head.direction, 1),
          this.head.direction
        )
      );
    }

    if (newDirection !== this.head.direction) {
      this.head.setDirection(newDirection);
      if (this.bodySegments.length > 0) {
        this.turns.set(JSON.stringify(this.head.position), newDirection);
      }
    }

    if (this.movementTimeElapsed >= 150) {
      this.movementTimeElapsed = 0;
      this.head.update(elapsedTime);
      this.bodySegments.forEach((segment, index) => {
        this.turnSegmentIfNeeded(
          segment,
          index === this.bodySegments.length - 1
        );
        segment.update(elapsedTime);
      });
    }
  }

  // TODO: turning upward doesn't work for some reason...
  turnSegmentIfNeeded(segment: SnakeSegment, lastSegment: boolean) {
    const turn = this.turns.get(JSON.stringify(segment.position));
    console.log(this.turns, segment.position, turn);
    if (turn) {
      segment.setDirection(turn);
      if (lastSegment) {
        this.turns.delete(JSON.stringify(segment.position));
      }
    }
  }

  draw(
    canvas: CanvasRenderingContext2D,
    pptRatio: Dimensions,
    layer: DrawLayer
  ) {
    if (layer === DrawLayer.Snake) {
      this.head.draw(canvas, pptRatio, layer);
      this.bodySegments.forEach(segment =>
        segment.draw(canvas, pptRatio, layer)
      );
    }
  }
}

function findNewSegmentPosition(
  position: Vector,
  direction: Direction,
  offset: number
): Vector {
  switch (direction) {
    case Direction.Up:
      return { x: position.x, y: position.y + offset };
    case Direction.Down:
      return { x: position.x, y: position.y + offset * -1 };
    case Direction.Left:
      return { x: position.x + offset, y: position.y };
    case Direction.Right:
      return { x: position.x + offset * -1, y: position.y };
    default:
      // should never happen
      return position;
  }
}
