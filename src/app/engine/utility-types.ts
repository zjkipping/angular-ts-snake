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
  Background,
  Food,
  Snake,
  Menu,
  None
}

export enum EntityID {
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
