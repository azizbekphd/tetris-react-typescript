import { Brick, Cell, Playground } from "..";
import BrickColors from "../Brick/BrickColors";
import SchemeUtils from "../Scheme/SchemeUtils";

class Game {
  unit: number = 100;
  highScore: number;
  playground: Playground;
  score: number;
  level: number;
  brick: Brick;
  nextBrick: Brick;
  playing: boolean;

  constructor(playing: boolean = false) {
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
    this.playing = playing;
    this.highScore = parseInt(localStorage.getItem("hi") ?? "0");
  }

  get timeInterval() {
    return Math.max(10, 500 - (this.level)*30);
  }

  get gameOver() {
    return SchemeUtils.overlaps(this.nextBrick.scheme, this.playground.scheme);
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

    if (this.gameOver) {
      this.playing = false;
      this.setScore();
    }

    this.checkLevel();
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
        this.score += this.level;
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

  pause() {
    this.playing = false;
  }

  play() {
    this.playing = true;
  }

  setScore() {
    if (this.score > this.highScore) {
      localStorage.setItem("hi", this.score.toString());
      this.highScore = this.score;
    }
  }

  checkLevel() {
    if (Math.pow(2, this.level) * 10 < this.score) {
      this.level++;
    }
  }
}

export default Game;
