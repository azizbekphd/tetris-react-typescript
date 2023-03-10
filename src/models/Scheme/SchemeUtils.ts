import { Coords, Scheme } from "..";

class SchemeUtils {
  static height(scheme: Scheme): number {
    return scheme.cells.length;
  }

  static width(scheme: Scheme): number {
    return Math.max(...scheme.cells.map((row) => row.length));
  }

  static filteredHeight(scheme: Scheme): number {
    return scheme.cells.filter((row) => !row.some((cell) => cell.filled))
      .length;
  }

  static filteredWidth(scheme: Scheme): number {
    const nonEmptyRows = scheme.cells.filter((row) =>
      row.some((cell) => cell.filled)
    );
    return (
      Math.max(
        ...nonEmptyRows.map(
          (row) =>
            row.length -
            row
              .slice()
              .reverse()
              .findIndex((cell) => cell.filled)
        )
      ) -
      Math.min(
        ...nonEmptyRows.map((row) => row.findIndex((cell) => cell.filled))
      )
    );
  }

  static filledCells(scheme: Scheme): Coords[] {
    return scheme.cells
      .map((row, j) =>
        row.map((cell, i) => {
          return cell?.filled
            ? { x: scheme.offset.x + i, y: scheme.offset.y + j }
            : { x: -1, y: -1 };
        })
      )
      .flat()
      .filter((cell) => cell.x !== -1 && cell.y !== -1);
  }

  static includes(scheme: Scheme, coords: Coords): boolean {
    return SchemeUtils.filledCells(scheme).some(
      (cell) => cell.x === coords.x && cell.y === coords.y
    );
  }

  static overlaps(scheme1: Scheme, scheme2: Scheme): boolean {
    const cells1 = SchemeUtils.filledCells(scheme1);
    const cells2 = SchemeUtils.filledCells(scheme2);
    for (let i = 0; i < cells1.length; i++) {
      const cell1 = cells1[i];
      if (cells2.some((cell2) => cell1.x === cell2.x && cell1.y === cell2.y)) {
        return true;
      }
    }
    return false;
  }

  static emptyColsLeft(scheme: Scheme): number {
    return Math.max(
      0,
      Math.min(
        ...scheme.cells.map((row) => row.findIndex((cell) => cell.filled))
      )
    );
  }

  static emptyColsRight(scheme: Scheme): number {
    return Math.max(
      0,
      Math.min(
        ...scheme.cells.map((row) =>
          row
            .slice()
            .reverse()
            .findIndex((cell) => cell.filled)
        )
      )
    );
  }
}

export default SchemeUtils;
