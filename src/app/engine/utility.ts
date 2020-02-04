export interface Vector {
  x: number;
  y: number;
}

export interface Dimensions {
  width: number;
  height: number;
}

export const layerCount = 4;
export enum DrawLayer {
  Food,
  Snake,
  Tile,
  Menu,
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

export const screenCenter: Vector = {
  x: Math.floor(screenLayout.width / 2),
  y: Math.floor(screenLayout.height / 2)
};

export enum GameStatus {
  StartMenu,
  Playing,
  Paused,
  EndMenu
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
