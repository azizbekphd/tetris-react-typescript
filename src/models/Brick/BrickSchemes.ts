import { Scheme, Cell } from "..";
import BrickCode from "./BrickCode";

function stringToScheme(s: string): Scheme {
  return {
    cells: s.split("\n").map<Cell[]>((r) =>
      r.split("").map<Cell>((c) => {
        return {
          filled: c !== " ",
        };
      })
    ),
    offset: { x: 0, y: 0 },
  };
}

const BrickSchemes = {
  [BrickCode.I]: stringToScheme("xxxx"),
  [BrickCode.J]: stringToScheme("x  \n" + "xxx"),
  [BrickCode.L]: stringToScheme("  x\n" + "xxx"),
  [BrickCode.O]: stringToScheme("xx\n" + "xx"),
  [BrickCode.S]: stringToScheme(" xx\n" + "xx "),
  [BrickCode.T]: stringToScheme(" x \n" + "xxx"),
  [BrickCode.Z]: stringToScheme("xx \n" + " xx"),
};

export default BrickSchemes;
