
declare class SakuraScriptPlayer {
  constructor(named: Named); // stable
  play: (sakuraScript: string, listener?: {[event_name: string]: () => void;}, context?: any): void; // unstable
  break: (): void; // stable
  on: (event: string, callback: () => void;, context?: any): SakuraScriptPlayer;
  off: (event?: string, callback?: () => void;, context?: any): SakuraScriptPlayer;
  trigger: (event: string, ...args?: any[]): SakuraScriptPlayer;
  trigger_all: (event: string, listener?: {[event_name: string]: () => void;}, context?: any, ...args?: any[]): SakuraScriptPlayer;
  breakTid: number; // unstable
  playing: boolean; // unstable
}

declare module Nar {
}

declare module 'nar' {
  var foo: typeof Nar;
  module rsvp {
    export var Nar: typeof foo;
  }
  export = rsvp;
}
