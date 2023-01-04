import { Scheme, Cell } from "..";
import CellColor from "../Cell/CellColor";
import BrickCode from "./BrickCode";

function stringToScheme(s: string): Scheme {
  return s.split("\n").map<Cell[]>((r) =>
    r.split("").map<Cell>((c) => {
      return {
        filled: c !== " ",
      };
    })
  );
}

const BrickSchemes = {
  [BrickCode.I]: stringToScheme(
    "xxxx",
  ),
  [BrickCode.J]: stringToScheme(
    "x  \n" +
    "xxx",
  ),
  [BrickCode.L]: stringToScheme(
    "  x\n" +
    "xxx",
  ),
  [BrickCode.O]: stringToScheme(
    "xx\n" +
    "xx",
  ),
  [BrickCode.S]: stringToScheme(
    " xx\n" +
    "xx ",
  ),
  [BrickCode.T]: stringToScheme(
    " x \n" +
    "xxx",
  ),
  [BrickCode.Z]: stringToScheme(
    "xx \n" +
    " xx",
  ),
};

export default BrickSchemes;
