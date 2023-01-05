import { Cell, Coords, Playground, Scheme } from "..";
import SchemeUtils from "../Scheme/SchemeUtils";
import BrickCode from "./BrickCode";
import BrickColors from "./BrickColors";
import BrickSchemes from "./BrickSchemes";

class Brick {
  static Code = BrickCode;

  code: BrickCode;
  scheme: Scheme;

  constructor({
    code,
    playground,
  }: {
    code: BrickCode;
    playground: Playground;
  }) {
    this.code = code;
    this.scheme = {
      ...BrickSchemes[code],
      offset: {
        x: Math.round(
          (playground.size.w -
            Math.max(...BrickSchemes[code].cells.map((row) => row.length))) /
            2
        ),
        y: 0,
      },
    };
  }

  static random({ playground }: { playground: Playground }): Brick {
    const codes = Object.values(BrickCode) as BrickCode[];
    const code = codes[Math.floor(Math.random() * codes.length)];
    return new Brick({
      code: code,
      playground: playground,
    });
  }

  get color() {
    return BrickColors[this.code];
  }

  get height() {
    return SchemeUtils.height(this.scheme);
  }

  get width() {
    return SchemeUtils.width(this.scheme);
  }

  get filledCells() {
    return SchemeUtils.filledCells(this.scheme);
  }

  includes(coords: Coords): boolean {
    return SchemeUtils.includes(this.scheme, coords);
  }

  moveDown() {
    this.scheme.offset.y++;
  }

  landed(playground: Playground): boolean {
    return (
      this.filledCells
        .map((cell) => {
          return {
            ...cell,
            y: cell.y + 1,
          };
        })
        .findIndex((cell) => {
          return (
            cell.y === playground.size.h ||
            SchemeUtils.includes(playground.scheme, cell)
          );
        }) !== -1
    );
  }

  canMoveLeft(playground: Playground): boolean {
    return (
      this.filledCells
        .map((cell) => {
          return {
            ...cell,
            x: cell.x - 1,
          };
        })
        .findIndex((cell) => {
          return cell.x <= -1 || SchemeUtils.includes(playground.scheme, cell);
        }) === -1
    );
  }

  moveLeft() {
    this.scheme.offset.x--;
  }

  canMoveRight(playground: Playground): boolean {
    return (
      this.filledCells
        .map((cell) => {
          return {
            ...cell,
            x: cell.x + 1,
          };
        })
        .findIndex((cell) => {
          return (
            cell.x >= playground.size.w ||
            SchemeUtils.includes(playground.scheme, cell)
          );
        }) === -1
    );
  }

  moveRight() {
    this.scheme.offset.x++;
  }

  rotate(playground: Playground) {
    const squareSize = Math.max(this.width, this.height);
    const maxIndex = squareSize - 1;
    const cellsSquare: Cell[][] = new Array(squareSize).fill(
      new Array<Cell>(squareSize).fill({ filled: false })
    );
    const oldCells = cellsSquare.map((row, y) =>
      row.map((cell, x) => {
        return SchemeUtils.includes(
          { ...this.scheme, offset: { x: 0, y: 0 } },
          { x, y }
        )
          ? {
              filled: true,
              color: this.color,
            }
          : cell;
      })
    );
    const newCells = cellsSquare.map((row, y) =>
      row.map((cell, x) => oldCells[maxIndex - x][y])
    );
    const newScheme: Scheme = {
      ...this.scheme,
      cells: newCells,
    };

    const width = SchemeUtils.filteredWidth(newScheme);
    const height = SchemeUtils.filteredHeight(newScheme);

    while (newScheme.offset.x < SchemeUtils.emptyColsLeft(newScheme)) {
      newScheme.offset.x++;
    }
    while (
      newScheme.offset.x + width >
      playground.size.w - SchemeUtils.emptyColsRight(newScheme)
    ) {
      newScheme.offset.x--;
    }
    while (
      SchemeUtils.overlaps(newScheme, playground.scheme) ||
      newScheme.offset.y + height > playground.size.h
    ) {
      newScheme.offset.y--;
    }
    this.scheme = newScheme;
  }
}

export default Brick;
