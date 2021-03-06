import {
  Component,
  AfterViewInit,
  ViewChild,
  ElementRef,
  OnDestroy
} from '@angular/core';
import { Subject, fromEvent, Observable, NextObserver } from 'rxjs';
import {
  map,
  filter,
  takeUntil,
  withLatestFrom,
  startWith,
  tap
} from 'rxjs/operators';

import { GameEngine } from '../engine/game-engine';
import { Dimensions, UserInputStatuses, screenLayout } from '../engine/utility';
import { UserInputManager } from '../engine/user-input-manager';

@Component({
  selector: 'snake-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements AfterViewInit, OnDestroy {
  @ViewChild('gameScreen') canvasRef?: ElementRef<HTMLCanvasElement>;

  gameEngine = new GameEngine();
  userInputManager = new UserInputManager();

  animationFrames = new Subject<number>();
  destroyCleanup = new Subject<void>();

  ngAfterViewInit() {
    if (this.canvasRef) {
      const canvasElement = this.canvasRef.nativeElement;
      const canvasRenderingContext = canvasElement.getContext('2d');
      if (canvasRenderingContext) {
        const crc = canvasRenderingContext;

        const screenResize = fromEvent(window, 'resize').pipe(
          map(() => calculateCanvasDimensions()),
          startWith(calculateCanvasDimensions()),
          tap(dimensions => {
            canvasElement.width = dimensions.width;
            canvasElement.height = dimensions.height;
          })
        );

        const keyDownObserver = {
          next: event => this.userInputManager.keyDown(event.key)
        } as NextObserver<KeyboardEvent>;
        fromEvent<KeyboardEvent>(window, 'keydown')
          .pipe(
            filter(event => !event.repeat),
            takeUntil(this.destroyCleanup)
          )
          .subscribe(keyDownObserver);

        const keyUpObserver = {
          next: event => this.userInputManager.keyUp(event.key)
        } as NextObserver<KeyboardEvent>;
        fromEvent<KeyboardEvent>(window, 'keyup')
          .pipe(
            filter(event => !event.repeat),
            takeUntil(this.destroyCleanup)
          )
          .subscribe(keyUpObserver);

        const gameLoop: Observable<[
          CanvasRenderingContext2D,
          UserInputStatuses,
          number,
          Dimensions
        ]> = this.animationFrames.pipe(
          withLatestFrom(screenResize, this.userInputManager.userInput),
          map(([time, screenSize, userInput]) => [
            crc,
            userInput,
            time,
            screenSize
          ])
        );

        const gameLoopObserver = {
          next: ([canvas, userInput, time, screenDimension]) => {
            this.gameEngine.tick(canvas, userInput, screenDimension, time);
            this.userInputManager.clear();
            this.requestFrame();
          }
        } as NextObserver<
          [CanvasRenderingContext2D, UserInputStatuses, number, Dimensions]
        >;
        gameLoop
          .pipe(takeUntil(this.destroyCleanup))
          .subscribe(gameLoopObserver);

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

function calculateCanvasDimensions(): Dimensions {
  const minDimension = Math.min(
    window.innerWidth - window.innerWidth * 0.1,
    window.innerHeight - window.innerHeight * 0.1
  );
  const length =
    minDimension -
    (minDimension % Math.min(screenLayout.width, screenLayout.height));
  return { width: length, height: length };
}
