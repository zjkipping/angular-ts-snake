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

    // deciding the new head direction (can't turn backwards)
    let newDirection = this.head.direction;
    if (isKeyDown(userInput.up) && this.head.direction !== Direction.Down) {
      newDirection = Direction.Up;
    } else if (
      isKeyDown(userInput.down) &&
      this.head.direction !== Direction.Up
    ) {
      newDirection = Direction.Down;
    } else if (
      isKeyDown(userInput.left) &&
      this.head.direction !== Direction.Right
    ) {
      newDirection = Direction.Left;
    } else if (
      isKeyDown(userInput.right) &&
      this.head.direction !== Direction.Left
    ) {
      newDirection = Direction.Right;
    }

    // temporary until eating fruit is added (need hit detection & random fruit spawning first)
    if (wasKeyPressed(userInput.start)) {
      const tail = this.bodySegments[this.bodySegments.length - 1];
      const position = tail ? tail.position : this.head.position;
      const direction = tail ? tail.direction : this.head.direction;
      this.bodySegments.push(
        new SnakeSegment(
          SegmentType.Body,
          findNewSegmentPosition(position, direction, 1),
          direction
        )
      );
    }
    //

    // if their is a new direction then update the head & add it to the turns list
    if (newDirection !== this.head.direction) {
      this.head.setDirection(newDirection);
      if (this.bodySegments.length > 0) {
        this.turns.set(JSON.stringify(this.head.position), newDirection);
      }
    }

    // every 150ms we want to move the snake's parts
    if (this.movementTimeElapsed >= 150) {
      this.movementTimeElapsed = 0;
      this.head.update(elapsedTime);
      this.bodySegments.forEach((segment, index) => {
        if (this.turns.size > 0) {
          // check to see if the body segment needs to turn it's direction
          this.turnSegmentIfNeeded(
            segment,
            index === this.bodySegments.length - 1
          );
        }
        segment.update(elapsedTime);
      });
    }
  }

  turnSegmentIfNeeded(segment: SnakeSegment, lastSegment: boolean) {
    const turn = this.turns.get(JSON.stringify(segment.position));
    if (turn !== null && turn !== undefined) {
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
