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
