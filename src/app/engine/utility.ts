import { random } from 'lodash';

export interface Vector {
  x: number;
  y: number;
}

export interface Dimensions {
  width: number;
  height: number;
}

export const layerCount = 3;
export enum DrawLayer {
  Food,
  Snake,
  Tile,
  None
}

export enum EntityID {
  Tile,
  Food,
  Snake,
  SnakeSegment
}

export enum Direction {
  Up,
  Right,
  Down,
  Left,
  None
}

// how many tiles per dimension
export const screenLayout: Dimensions = {
  width: 21,
  height: 21
};

// how many food to collect to "win" the game. height * width of screen (in tiles) minus the head of the snake
export const foodCollectionGoal = screenLayout.height * screenLayout.width - 1;

export const screenCenter: Vector = {
  x: Math.floor(screenLayout.width / 2),
  y: Math.floor(screenLayout.height / 2)
};

export enum GameStatus {
  StartMenu,
  Playing,
  Paused,
  Lose,
  Win
}

export enum KeyStatus {
  Up,
  Down,
  Pressed
}

export function isKeyDown(inputStatus: KeyStatus) {
  return inputStatus === KeyStatus.Down;
}

export function wasKeyPressed(inputStatus: KeyStatus) {
  return inputStatus === KeyStatus.Pressed;
}

export type UserInput = 'up' | 'down' | 'left' | 'right' | 'start' | 'pause';

export type KeyBindings = Record<UserInput, string>;

export type UserInputStatuses = Record<UserInput, KeyStatus>;

export enum HitDetection {
  CollidedWithWall,
  CollidedWithBodySegment,
  CollidedWithFood
}

export function getRandomPosition(positions: Vector[]) {
  return positions[random(positions.length - 1)];
}

export function drawText(
  canvas: CanvasRenderingContext2D,
  dimensions: Dimensions,
  text: string
) {
  const fontSize = dimensions.width / 18;
  canvas.fillStyle = '#FFFFFF';
  canvas.font = `${fontSize}px Roboto`;

  canvas.textBaseline = 'middle';
  canvas.textAlign = 'center';
  canvas.fillText(text, dimensions.width / 2, dimensions.height / 2);
  canvas.strokeText(text, dimensions.width / 2, dimensions.height / 2);
}
