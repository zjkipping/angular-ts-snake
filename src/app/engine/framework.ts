import { SnakeManager } from './snake-manager';
import { layerCount, Dimensions } from './utility-types';
import { Entity } from './entity';
import { FoodManager } from './food-manager';
import { UserInputStatuses } from './user-input-manager';

import * as Stats from 'stats.js';
import { environment } from 'src/environments/environment';
import { Drawable } from './drawable';

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

  stats: Stats | undefined;

  constructor() {
    // setup the initial entities
    this.snakeManager = new SnakeManager();
    this.foodManager = new FoodManager();

    if (!environment.production) {
      this.stats = new Stats();
      this.stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
      document.body.appendChild(this.stats.dom);
    }
  }

  tick(
    canvas: CanvasRenderingContext2D,
    userInput: UserInputStatuses,
    screenDimensions: Dimensions,
    time: number
  ) {
    if (this.stats) {
      this.stats.begin();
    }
    const elapsedTime = time - this.lastRender;
    this.update(elapsedTime, userInput);
    this.draw(canvas, screenDimensions);
    this.lastRender = time;
    if (this.stats) {
      this.stats.end();
    }
  }

  update(elapsedTime: number, userInput: UserInputStatuses) {
    this.snakeManager.update(elapsedTime, userInput);
    this.foodManager.update(elapsedTime);
  }

  draw(canvas: CanvasRenderingContext2D, dimensions: Dimensions) {
    const pptRatio = calculatePPT(dimensions, screenLayout.width);

    canvas.clearRect(0, 0, dimensions.width, dimensions.height);

    const entities: Drawable[] = [this.snakeManager];
    // for (let layer = 0; layer < layerCount; layer++) {
    entities.forEach(entity => {
      // if (entity.layer === layer) {
      entity.draw(canvas, pptRatio);
      // }
    });
    // }
  }
}

// Pixels Per Tile
function calculatePPT(d: Dimensions, tileCount: number): Dimensions {
  return {
    width: d.width / tileCount,
    height: d.height / tileCount
  };
}
