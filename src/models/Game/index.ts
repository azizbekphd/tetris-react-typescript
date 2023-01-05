import { Brick, Playground } from "..";

class Game {
  playground: Playground;
  score: number;
  level: number;
  brick: Brick;
  playing: boolean;

  constructor() {
    this.playground = {
      scheme: {
        cells: [],
        offset: {x: 0, y: 0},
      },
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

  tick(): Game {
    if (this.brick.landed(this.playground)) {
      this.brick = Brick.random({ playground: this.playground });
    } else {
      this.brick.down();
    }
    return this;
  }
}

export default Game;
