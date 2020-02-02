import {
  Component,
  AfterViewInit,
  ViewChild,
  ElementRef,
  OnDestroy
} from '@angular/core';
import { Subject, fromEvent, Observable } from 'rxjs';
import { map, filter, takeUntil, withLatestFrom } from 'rxjs/operators';

import { GameEngine } from '../engine/framework';
import { Dimensions } from '../engine/utility-types';

@Component({
  selector: 'snake-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements AfterViewInit, OnDestroy {
  @ViewChild('canvas', { static: false }) canvasRef?: ElementRef;

  gameEngine = new GameEngine();

  animationFrames = new Subject<number>();
  destroyCleanup = new Subject<void>();

  ngAfterViewInit() {
    if (this.canvasRef) {
      const canvasElement: HTMLCanvasElement = this.canvasRef.nativeElement;
      const canvasRenderingContext = canvasElement.getContext('2d');

      if (canvasRenderingContext) {
        const crc = canvasRenderingContext;

        const screenResize = fromEvent(window, 'resize').pipe(
          map((event: Event) => event.target),
          filter((target): target is Window => !!target),
          map(target => ({
            width: target.innerWidth,
            height: target.innerHeight
          }))
        );

        // TODO: need to bind to keyUp & keyDown and have a UserInput class to do transformations of the controls

        const gameLoop: Observable<[
          CanvasRenderingContext2D,
          number,
          Dimensions
        ]> = this.animationFrames.pipe(
          withLatestFrom(screenResize),
          map(([time, screenSize]) => [crc, time, screenSize])
        );

        gameLoop
          .pipe(takeUntil(this.destroyCleanup))
          .subscribe(([canvas, time, screenDimension]) => {
            this.gameEngine.tick(canvas, screenDimension, time);
            this.requestFrame();
          });

        this.requestFrame();
      }
    }
  }

  requestFrame() {
    window.requestAnimationFrame(time => this.animationFrames.next(time));
  }

  ngOnDestroy() {
    this.destroyCleanup.next();
    this.destroyCleanup.complete();
  }
}
