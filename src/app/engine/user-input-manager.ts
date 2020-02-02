import { BehaviorSubject } from 'rxjs';

export enum KeyStatus {
  Up,
  Down,
  Pressed
}

type UserInput = 'up' | 'down' | 'left' | 'right' | 'start' | 'pause';

type KeyBindings = Record<UserInput, string>;

export type UserInputStatuses = Record<UserInput, KeyStatus>;

export class UserInputManager {
  private keyBindings: KeyBindings = {
    up: 'w',
    down: 's',
    left: 'a',
    right: 'd',
    start: ' ',
    pause: 'Escape'
  };

  private _userInput: UserInputStatuses = {
    up: KeyStatus.Up,
    down: KeyStatus.Up,
    left: KeyStatus.Up,
    right: KeyStatus.Up,
    start: KeyStatus.Up,
    pause: KeyStatus.Up
  };

  private userInputBS = new BehaviorSubject(this._userInput);

  userInput = this.userInputBS.asObservable();

  private checkKeyBindings(key: string, status: KeyStatus) {
    Object.entries(this.keyBindings).forEach(([input, binding]) => {
      if (key === binding) {
        this._userInput[input as UserInput] = status;
      }
    });
  }

  keyDown(key: string) {
    this.checkKeyBindings(key, KeyStatus.Down);
    this.userInputBS.next(this._userInput);
  }

  keyUp(key: string) {
    this.checkKeyBindings(key, KeyStatus.Pressed);
    this.userInputBS.next(this._userInput);
  }

  clear() {
    Object.keys(this.keyBindings).forEach(input => {
      if (this._userInput[input as UserInput] === KeyStatus.Pressed) {
        this._userInput[input as UserInput] = KeyStatus.Up;
      }
    });
    this.userInputBS.next(this._userInput);
  }
}
