import { useEffect, useState } from "react";
import "./App.css";
import useForceUpdate from "./hooks/useForceUpdate";
import useInterval from "./hooks/useInterval";
import { Game } from "./models";

function App() {
  const [game, setGame] = useState<Game>(new Game());
  const forceUpdate = useForceUpdate();
  const gameInterval = useInterval(() => {
    setGame(game.tick());
    forceUpdate();
  }, game.timeInterval);

  return (
    <div className="App">
      <table className="playground">
        <tbody>
          {Array.from(Array(game.playground.size.h).keys()).map((j) => (
            <tr key={j}>
              {Array.from(Array(game.playground.size.w).keys()).map((i) => (
                <td
                  key={i}
                  style={
                    game.brick.overlaps({ x: i, y: j })
                      ? {
                          backgroundColor: game.brick.color,
                        }
                      : {}
                  }
                ></td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
