import { Entity } from './entity';
import { LayerCount } from './utility-types';

export function render(entities: Entity[], canvas: any, gameTime: any) {
  for (let layer = 0; layer < LayerCount; layer++) {
    entities.forEach(entity => {
      if (entity.layer === layer) {
        entity.draw(canvas, gameTime);
      }
    });
  }
}
