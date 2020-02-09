import { Entity } from './entity';
import { EntityID, DrawLayer, Vector, Dimensions } from './utility';

export class Food extends Entity {
  id = EntityID.Food;
  layer = DrawLayer.Food;

  constructor(public position: Vector) {
    super();
  }

  update(_elapsedTime: number) {}

  draw(
    canvas: CanvasRenderingContext2D,
    pptRatio: Dimensions,
    layer: DrawLayer
  ) {
    if (layer === DrawLayer.Food) {
      canvas.beginPath();
      canvas.fillStyle = 'rgba(255, 192, 203, 1)';
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
