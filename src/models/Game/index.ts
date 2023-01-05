import { Brick, Cell, Playground } from "..";
import BrickColors from "../Brick/BrickColors";
import SchemeUtils from "../Scheme/SchemeUtils";

class Game {
  unit: number = 100;
  playground: Playground;
  score: number;
  level: number;
  brick: Brick;
  nextBrick: Brick;
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
    this.nextBrick = Brick.random({ playground: this.playground });
    this.playing = true;
  }

  get timeInterval() {
    return 500 / this.level;
  }

  tick(): Game {
    if (this.brick.landed(this.playground)) {
      this.landBrick();
    } else {
      this.brick.moveDown();
    }
    return this;
  }

  landBrick() {
    this.playground.scheme.cells = this.playground.scheme.cells.map(
      (row, y) => {
        return row.map((cell, x) => {
          if (SchemeUtils.includes(this.brick.scheme, { x, y })) {
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

    this.renewBrick();

    this.removeFullRows();
  }

  moveBrick(direction: "l" | "r" | "d") {
    if (direction == "l") {
      if (this.brick.canMoveLeft(this.playground)) {
        this.brick.moveLeft();
      }
    } else if (direction == "r") {
      if (this.brick.canMoveRight(this.playground)) {
        this.brick.moveRight();
      }
    } else if (direction == "d") {
      if (!this.brick.landed(this.playground)) {
        this.score += 1;
        this.brick.moveDown();
      }
    }
  }

  rotateBrick() {
    this.brick.rotate(this.playground);
  }

  renewBrick() {
    this.brick = this.nextBrick;
    this.nextBrick = Brick.random({ playground: this.playground });
  }

  removeFullRows() {
    for (let i = this.playground.scheme.cells.length - 1; i >= 0; i--) {
      const row = this.playground.scheme.cells[i];
      if (!row.some((cell) => !cell.filled)) {
        this.playground.scheme.cells.splice(i, 1);
      }
    }

    const deletedRows =
      this.playground.size.h - SchemeUtils.height(this.playground.scheme);

    this.playground.scheme.cells.splice(
      0,
      0,
      ...new Array(deletedRows).fill(
        new Array(this.playground.size.w).fill({ filled: false })
      )
    );

    this.score += this.unit * this.level * deletedRows;
  }
}

export default Game;
