import { Brick, Playground, Scheme } from "..";

class Game {
  playground: Playground;
  score: number;
  level: number;
  brick: Brick;
  playing: boolean;

  constructor() {
    this.playground = {
      scheme: [],
      size: { w: 10, h: 16 },
    };
    this.score = 0;
    this.level = 1;
    this.brick = Brick.random({ playground: this.playground });
    this.playing = true;
  }

  get timeInterval() {
    return 1000 / this.level;
  }

  tick() {
    if (this.brick.coords.y === this.playground.size.h - 1) {
      this.brick = Brick.random({ playground: this.playground });
    }
    this.brick.down();
  }
}

export default Game;
