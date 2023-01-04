import { useEffect, useState } from "react";
import "./App.css";
import { Game } from "./models";

function App() {
  const [game, setGame] = useState<Game>(new Game());
  let [gameInterval, setGameInterval] = useState<NodeJS.Timer>();

  useEffect(() => {
    if (game.playing && gameInterval) {
      setGameInterval(
        setInterval(() => {
          game.tick();
        }, game.timeInterval)
      );
      setGame(game);
    } else {
      clearTimeout(gameInterval);
      setGameInterval(undefined);
    }
  }, [game.playing]);

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
