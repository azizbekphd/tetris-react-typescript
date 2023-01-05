import { useEffect, useState } from "react";
import "./App.css";
import useForceUpdate from "./hooks/useForceUpdate";
import useInterval from "./hooks/useInterval";
import { Game } from "./models";
import SchemeUtils from "./models/Scheme/SchemeUtils";

function App() {
  const [game, setGame] = useState<Game>(new Game());
  const forceUpdate = useForceUpdate();
  useInterval(() => {
    if (!game.playing) return;
    game.tick();
    forceUpdate();
  }, game.timeInterval);

  useEffect(() => {
    const actions: { [key: string]: () => void } = {
      ArrowLeft: () => game.moveBrick("l"),
      ArrowRight: () => game.moveBrick("r"),
      ArrowDown: () => game.moveBrick("d"),
      ArrowUp: () => game.rotateBrick(),
    };
    const activeKeys = Object.keys(actions);
    document.onkeydown = (e) => {
      if (!game.playing) return;
      if (activeKeys.includes(e.key)) {
        actions[e.key]();
        forceUpdate();
      }
    };
  }, [game]);

  return (
    <div className="App">
      <div className="appbar">
        <h4>Score: {game.score}</h4>
        <button
          className="pause-button"
          onClick={() => {
            game.pause();
            forceUpdate();
          }}
        >
          | |
        </button>
      </div>
      <table className="playground">
        <tbody>
          {Array.from(Array(game.playground.size.h).keys()).map((j) => (
            <tr key={j}>
              {Array.from(Array(game.playground.size.w).keys()).map((i) => (
                <td
                  key={i}
                  style={
                    game.brick.includes({ x: i, y: j })
                      ? {
                          backgroundColor: game.brick.color,
                        }
                      : SchemeUtils.includes(game.playground.scheme, {
                          x: i,
                          y: j,
                        })
                      ? {
                          backgroundColor:
                            game.playground.scheme.cells[j][i].color,
                        }
                      : {}
                  }
                ></td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <div
        className="fullscreen-menu"
        style={{
          display: game.playing ? "none" : "flex",
        }}
      >
        <button
          className="play-button"
          onClick={() => {
            game.play();
            forceUpdate();
          }}
        >
          &#9654;
        </button>
      </div>
    </div>
  );
}

export default App;
