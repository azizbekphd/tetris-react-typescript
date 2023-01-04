import { Coords, Playground, Scheme, Size } from "..";
import BrickCode from "./BrickCode";
import BrickColors from "./BrickColors";
import BrickSchemes from "./BrickSchemes";

class Brick {
  static Code = BrickCode;

  code: BrickCode;
  coords: Coords;
  scheme: Scheme;

  constructor({
    code,
    playground,
  }: {
    code: BrickCode;
    playground: Playground;
  }) {
    this.code = code;
    this.scheme = BrickSchemes[code];
    this.coords = {
      x: Math.round(
        (playground.size.w -
          Math.max(...BrickSchemes[code].map((row) => row.length))) /
          2
      ),
      y: 0,
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

  get width() {
    return Math.max(...this.scheme.map((row) => row.length));
  }

  overlaps(coords: Coords): boolean {
    const filledCells: Coords[] = this.scheme
      .map((row, j) =>
        row.map((cell, i) => {
          return cell?.filled
            ? { x: this.coords.x + i, y: this.coords.y + j }
            : { x: -1, y: -1 };
        })
      )
      .flat();
    return (
      filledCells.findIndex(
        (cell) => cell.x === coords.x && cell.y === coords.y
      ) !== -1
    );
  }

  down() {
    this.coords.y++;
    console.log(this.coords);
  }
}

export default Brick;
