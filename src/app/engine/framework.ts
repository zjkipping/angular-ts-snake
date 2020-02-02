import { SnakeManager } from './snake-manager';
import { layerCount, Dimensions } from './utility-types';
import { Entity } from './entity';
import { FoodManager } from './food-manager';

// pixels
const tileDimensions: Dimensions = {
  width: 16,
  height: 16
};

// how many tiles per dimension
const screenLayout: Dimensions = {
  width: 25,
  height: 25
};

export class GameEngine {
  lastRender = 0;

  snakeManager: SnakeManager;
  foodManager: FoodManager;

  constructor() {
    // setup the initial entities
    this.snakeManager = new SnakeManager();
    this.foodManager = new FoodManager();
  }

  tick(
    canvas: CanvasRenderingContext2D,
    screenDimensions: Dimensions,
    time: number
  ) {
    const elapsedTime = time - this.lastRender;
    this.update(elapsedTime);
    this.draw(canvas, screenDimensions);
    this.lastRender = time;
  }

  update(elapsedTime: number) {}

  draw(canvas: CanvasRenderingContext2D, dimensions: Dimensions) {
    canvas.clearRect(0, 0, dimensions.width, dimensions.height);

    // pixels per tile
    const pptRatio =
      dimensions.width / (screenLayout.width * tileDimensions.width);

    const entities: Entity[] = [];
    for (let layer = 0; layer < layerCount; layer++) {
      entities.forEach(entity => {
        if (entity.layer === layer) {
          entity.draw(canvas, pptRatio);
        }
      });
    }
  }
}
