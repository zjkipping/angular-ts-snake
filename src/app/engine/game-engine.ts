import { difference } from 'lodash';
import * as Stats from 'stats.js';
import { environment } from 'src/environments/environment';

import { SnakeManager } from './snake-manager';
import {
  layerCount,
  Dimensions,
  GameStatus,
  screenLayout,
  UserInputStatuses,
  HitDetection,
  foodCollectionGoal,
  isKeyDown,
  wasKeyPressed,
  getRandomPosition,
  drawText
} from './utility';
import { Drawable } from './drawable';
import { Tile } from './tile';
import { Food } from './food';

export class GameEngine {
  lastTick = 0;

  gameStatus = GameStatus.StartMenu;

  snakeManager: SnakeManager;
  tiles: Tile[] = [];
  food: Food;

  foodCollected = 0;

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
    const availableSpots = this.findAvailableSpots();
    this.food = new Food(getRandomPosition(availableSpots));
    this.entitiesToDraw = [...this.tiles, this.snakeManager, this.food];

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

  update(elapsedTime: number, userInput: UserInputStatuses) {
    switch (this.gameStatus) {
      case GameStatus.StartMenu:
        if (
          isKeyDown(userInput.up) ||
          isKeyDown(userInput.right) ||
          isKeyDown(userInput.down) ||
          isKeyDown(userInput.left)
        ) {
          this.gameStatus = GameStatus.Playing;
          this.snakeManager.update(elapsedTime, userInput);
        }
        break;
      case GameStatus.Playing:
        if (wasKeyPressed(userInput.pause)) {
          this.gameStatus = GameStatus.Paused;
          break;
        }
        const hitDetection = this.calculateHitDetections();
        const collectedFood = hitDetection === HitDetection.CollidedWithFood;
        if (collectedFood) {
          this.foodCollected++;
          if (this.foodCollected === foodCollectionGoal) {
            this.gameStatus = GameStatus.Win;
            break;
          } else {
            this.food.position = getRandomPosition(this.findAvailableSpots());
          }
        }
        if (
          hitDetection === HitDetection.CollidedWithBodySegment ||
          hitDetection === HitDetection.CollidedWithWall
        ) {
          this.gameStatus = GameStatus.Lose;
        } else {
          this.snakeManager.update(elapsedTime, userInput, collectedFood);
        }
        break;
      case GameStatus.Paused:
        if (wasKeyPressed(userInput.pause)) {
          this.gameStatus = GameStatus.Playing;
        }
        break;
      case GameStatus.Win:
      case GameStatus.Lose:
        if (wasKeyPressed(userInput.start)) {
          this.gameStatus = GameStatus.Playing;
          this.restart();
        }
        break;
    }
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

    switch (this.gameStatus) {
      case GameStatus.StartMenu:
        drawText(canvas, dimensions, 'Move in any direction to begin!');
        break;
      case GameStatus.Paused:
        drawText(canvas, dimensions, 'Game is paused.');
        break;
      case GameStatus.Lose:
        drawText(canvas, dimensions, 'You lost... Press Escape to restart.');
        break;
      case GameStatus.Win:
        drawText(canvas, dimensions, 'You Won! Press Escape to restart.');
        break;
    }

    canvas.restore();
  }

  private findAvailableSpots() {
    return difference(
      this.tiles
        .map(tile => tile.position)
        .filter(
          pos =>
            pos.x !== this.snakeManager.head.position.x &&
            pos.y !== this.snakeManager.head.position.y
        ),
      this.snakeManager.bodySegments.map(seg => seg.position)
    );
  }

  private calculateHitDetections(): HitDetection | null {
    const snakeHead = this.snakeManager.head;
    if (
      this.food &&
      this.food.position.x === snakeHead.position.x &&
      this.food.position.y === snakeHead.position.y
    ) {
      return HitDetection.CollidedWithFood;
    } else if (
      snakeHead.position.x < 0 ||
      snakeHead.position.x >= screenLayout.width ||
      snakeHead.position.y < 0 ||
      snakeHead.position.y >= screenLayout.height
    ) {
      return HitDetection.CollidedWithWall;
    } else if (
      this.snakeManager.bodySegments.some(
        segment =>
          segment.position.x === snakeHead.position.x &&
          segment.position.y === snakeHead.position.y
      )
    ) {
      return HitDetection.CollidedWithBodySegment;
    }
    return null;
  }

  private restart() {
    this.foodCollected = 0;
    this.snakeManager = new SnakeManager();
    this.food.position = getRandomPosition(this.findAvailableSpots());
    this.entitiesToDraw = [...this.tiles, this.snakeManager, this.food];
    this.gameStatus = GameStatus.StartMenu;
  }
}

// Pixels Per Tile
function calculatePPT(d: Dimensions, tileCount: number): Dimensions {
  return {
    width: d.width / tileCount,
    height: d.height / tileCount
  };
}
