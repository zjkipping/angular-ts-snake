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
  startWith
} from 'rxjs/operators';

import { GameEngine } from '../engine/framework';
import { Dimensions } from '../engine/utility-types';
import {
  UserInputManager,
  UserInputStatuses
} from '../engine/user-input-manager';

@Component({
  selector: 'snake-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements AfterViewInit, OnDestroy {
  @ViewChild('gameScreen', { static: false }) canvasRef?: ElementRef<
    HTMLCanvasElement
  >;

  gameEngine = new GameEngine();
  userInputManager = new UserInputManager();

  animationFrames = new Subject<number>();
  destroyCleanup = new Subject<void>();

  ngAfterViewInit() {
    if (this.canvasRef) {
      const canvasElement = this.canvasRef.nativeElement;
      canvasElement.width = canvasElement.offsetWidth;
      canvasElement.height = canvasElement.offsetHeight;
      const canvasRenderingContext = canvasElement.getContext('2d');
      if (canvasRenderingContext) {
        const crc = canvasRenderingContext;

        const screenResize = fromEvent(window, 'resize').pipe(
          // tap()
          map(() => ({
            width: canvasElement.width,
            height: canvasElement.height
          })),
          startWith({
            width: canvasElement.width,
            height: canvasElement.height
          })
        );

        const keyDownObserver = {
          next: event => this.userInputManager.keyDown(event.key)
        } as NextObserver<KeyboardEvent>;
        fromEvent<KeyboardEvent>(window, 'keydown')
          .pipe(takeUntil(this.destroyCleanup))
          .subscribe(keyDownObserver);

        const keyUpObserver = {
          next: event => this.userInputManager.keyUp(event.key)
        } as NextObserver<KeyboardEvent>;
        fromEvent<KeyboardEvent>(window, 'keyup')
          .pipe(takeUntil(this.destroyCleanup))
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
