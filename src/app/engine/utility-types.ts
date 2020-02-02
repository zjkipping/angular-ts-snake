export interface Vector {
  x: number;
  y: number;
}

export const LayerCount = 4;
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
  Left
}
