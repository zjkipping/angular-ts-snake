import { SnakeManager } from './snake-manager';
import {
  layerCount,
  Dimensions,
  GameStatus,
  screenLayout,
  UserInputStatuses
} from './utility';
import { FoodManager } from './food-manager';

import * as Stats from 'stats.js';
import { environment } from 'src/environments/environment';
import { Drawable } from './drawable';
import { Tile } from './tile';

export class GameEngine {
  lastTick = 0;

  gameStatus = GameStatus.Playing;

  snakeManager: SnakeManager;
  foodManager: FoodManager;
  tiles: Tile[] = [];

  entitiesToDraw: Drawable[];

  stats: Stats | undefined;

  constructor() {
    // setup the initial entities
    for (let x = 0; x < screenLayout.width; x++) {
      for (let y = 0; y < screenLayout.height; y++) {
        this.tiles.push(new Tile({ x, y }));
      }
    }
    this.snakeManager = new SnakeManager();
    this.foodManager = new FoodManager();

    this.entitiesToDraw = [...this.tiles, this.snakeManager, this.foodManager];

    // fps display
    if (!environment.production) {
      this.stats = new Stats();
      this.stats.showPanel(0);
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
    const elapsedTime = time - this.lastTick;
    this.update(elapsedTime, userInput);
    this.draw(canvas, screenDimensions);
    this.lastTick = time;
    if (this.stats) {
      this.stats.end();
    }
  }

  calculateHitDetections() {}

  update(elapsedTime: number, userInput: UserInputStatuses) {
    // TODO: Need something to manage game status so we can can have menus (start, pause, end)

    // gameplay updates
    const hitDetections = this.calculateHitDetections();
    this.snakeManager.update(elapsedTime, userInput);
    this.foodManager.update(elapsedTime);
  }

  draw(canvas: CanvasRenderingContext2D, dimensions: Dimensions) {
    canvas.clearRect(0, 0, dimensions.width, dimensions.height);
    canvas.save();

    // gameplay drawing
    const pptRatio = calculatePPT(dimensions, screenLayout.width);
    for (let layer = 0; layer < layerCount; layer++) {
      this.entitiesToDraw.forEach(entity => {
        entity.draw(canvas, pptRatio, layer);
      });
    }

    canvas.restore();
  }
}

// Pixels Per Tile
function calculatePPT(d: Dimensions, tileCount: number): Dimensions {
  return {
    width: d.width / tileCount,
    height: d.height / tileCount
  };
}
