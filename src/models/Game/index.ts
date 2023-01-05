import { Brick, Cell, Playground } from "..";
import BrickColors from "../Brick/BrickColors";
import SchemeUtils from "../Scheme/SchemeUtils";

class Game {
  playground: Playground;
  score: number;
  level: number;
  brick: Brick;
  playing: boolean;

  constructor() {
    this.playground = {
      scheme: {
        cells: new Array(16).fill(new Array<Cell>(10).fill({ filled: false })),
        offset: { x: 0, y: 0 },
      },
      size: { w: 10, h: 16 },
    };
    this.score = 0;
    this.level = 1;
    this.brick = Brick.random({ playground: this.playground });
    this.playing = true;
  }

  get timeInterval() {
    return 500 / this.level;
  }

  tick(): Game {
    if (this.brick.landed(this.playground)) {
      this.landBrick();
    } else {
      this.brick.down();
    }
    return this;
  }

  landBrick() {
    this.playground.scheme.cells = this.playground.scheme.cells.map(
      (row, y) => {
        return row.map((cell, x) => {
          if (SchemeUtils.overlaps(this.brick.scheme, { x, y })) {
            return {
              filled: true,
              color: this.brick.color,
            };
          } else {
            return cell;
          }
        });
      }
    );
    this.brick = Brick.random({ playground: this.playground });
  }
}

export default Game;
