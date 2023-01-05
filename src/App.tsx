import { useEffect, useState } from "react";
import "./App.css";
import useForceUpdate from "./hooks/useForceUpdate";
import useInterval from "./hooks/useInterval";
import { Brick, Game } from "./models";
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
        <h4>Level: {game.level}</h4>
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
      <div className="playground-wrapper">
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
        <div className="preview">
          <table className="playground">
            <tbody>
              {Array.from(
                Array(SchemeUtils.height(game.nextBrick.preview)).keys()
              ).map((j) => (
                <tr key={j}>
                  {Array.from(
                    Array(SchemeUtils.width(game.nextBrick.preview)).keys()
                  ).map((i) => (
                    <td
                      key={i}
                      style={
                        SchemeUtils.includes(game.nextBrick.preview, { x: i, y: j })
                          ? {
                              backgroundColor: game.nextBrick.color,
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
      </div>
      <div
        className="fullscreen-menu"
        style={{
          display: game.playing ? "none" : "flex",
        }}
      >
        <h3>High score: {game.highScore}</h3>
        <button
          className="play-button"
          onClick={() => {
            if (game.gameOver) {
              setGame(new Game(true));
            } else {
              game.play();
            }
            forceUpdate();
          }}
        >
          &#9654;
        </button>
        <h3>
          {game.gameOver ? <span>Game Over! </span> : <></>}Score: {game.score}
        </h3>
      </div>
    </div>
  );
}

export default App;
