import { Coords, Playground, Scheme } from "..";
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
      }
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
    return this.scheme.cells.length;
  }

  get width() {
    return Math.max(...this.scheme.cells.map((row) => row.length));
  }

  get filledCells() {
    return SchemeUtils.filledCells(this.scheme);
  }

  overlaps(coords: Coords): boolean {
    return SchemeUtils.overlaps(this.scheme, coords);
  }

  down() {
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
            cell.y === playground.size.h || SchemeUtils.overlaps(playground.scheme, cell)
          );
        }) !== -1
    );
  }
}

export default Brick;
