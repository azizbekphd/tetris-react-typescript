import { Coords, Scheme } from "..";

class SchemeUtils {
  static filledCells(scheme: Scheme): Coords[] {
    return scheme.cells.map((row, j) =>
      row.map((cell, i) => {
        return cell?.filled
          ? { x: scheme.offset.x + i, y: scheme.offset.y + j }
          : { x: -1, y: -1 };
      })
    ).flat();
  }

  static overlaps(scheme: Scheme, coords: Coords): boolean {
    return (
      SchemeUtils.filledCells(scheme).findIndex(
        (cell) => cell.x === coords.x && cell.y === coords.y
      ) !== -1
    );
  }
}

export default SchemeUtils;