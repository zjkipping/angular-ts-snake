import { Entity } from './entity';
import { EntityID, DrawLayer, Vector, Dimensions } from './utility';

export class Tile extends Entity {
  id = EntityID.Tile;
  layer = DrawLayer.Tile;

  constructor(public position: Vector) {
    super();
  }

  update(_elapsedTime: number) {}

  draw(
    canvas: CanvasRenderingContext2D,
    pptRatio: Dimensions,
    layer: DrawLayer
  ) {
    if (this.layer === layer) {
      canvas.beginPath();
      canvas.rect(
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
