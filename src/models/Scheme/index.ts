import { Cell, Coords } from "..";

type Scheme = {
    cells: Array<Array<Cell>>;
    offset: Coords;
};

export default Scheme;