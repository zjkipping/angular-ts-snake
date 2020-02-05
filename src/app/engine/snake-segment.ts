import { Entity } from './entity';
import { EntityID, DrawLayer, Direction, Vector, Dimensions } from './utility';

export enum SegmentType {
  Head,
  Body
}

export class SnakeSegment extends Entity {
  id = EntityID.Snake;
  layer = DrawLayer.Snake;

  constructor(
    public type: SegmentType,
    public position: Vector,
    public direction: Direction
  ) {
    super();
  }

  setDirection(d: Direction) {
    this.direction = d;
  }

  update(_elapsedTime: number) {
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

  draw(
    canvas: CanvasRenderingContext2D,
    pptRatio: Dimensions,
    _layer: DrawLayer
  ) {
    canvas.beginPath();
    if (this.type === SegmentType.Head) {
      canvas.fillStyle = 'rgba(57, 185, 192, 1)';
    } else {
      canvas.fillStyle = 'rgba(57, 179, 50, 1)';
    }
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
