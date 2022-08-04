import React, { useState, useMemo, useEffect, useRef } from 'react'
import { Tetrominos, Movement, Tetromino } from './types'
import { rotateTetromino,
  moveTetromino,
  checkMovementForCollision,
  generateTetromino,
  clearLine,
  clearedLineCount
} from './utils'
import './App.css';

function App() {

  const initialState: Tetrominos = (
    {
      active: { ids: ['z0'], type: 'I', color: 'green', rotated: 0},
      inactive: [{ id: 'z0', color: 'green'}],
      score: 0
    }
  )

  const [tetrominos, setTetrominos] = useState<Tetrominos>(initialState)
  const playing = useRef(false)
  const gameLost = useRef(false)

  const grid = useMemo(() => {
    const row = [[],[],[],[],[],[],[],[],[],[]];
    const rows = [[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[]];
    const grid = rows.map((emptyRow, emptyRowIndex)=> {
      return row.map((block, index) => {
        return {
          id: `${String.fromCharCode(emptyRowIndex + 65)}${index}`,
          color: ''
        }
      })
    })
    return grid
  }, [])

  useEffect(() => {
      const loop = setInterval(() => {
        if (!playing.current) return null
        setTetrominos(prev => {
          const nextTetrominio: Tetromino = generateTetromino()

          if (checkMovementForCollision(prev , moveTetromino(prev.active.ids, 'down')) || prev.active.ids[0] === 'z0') {

            if (checkMovementForCollision(prev, nextTetrominio.ids)) {
              gameLost.current = true;
              playing.current = false;
            }


            const inactiveTetrominoBlocks = [...prev.active.ids].map(id => ({
              id: id,
              color: prev.active.color
            })).concat(prev.inactive)

            const pointCount = clearedLineCount(inactiveTetrominoBlocks) > 0 
              ? clearedLineCount(inactiveTetrominoBlocks) * 100 + prev.score 
              : prev.score

            return {
              active: nextTetrominio,
              inactive: clearLine(inactiveTetrominoBlocks),
              score: pointCount
            }

          }

          return {
            active: {
              ids: moveTetromino(prev.active.ids, 'down'),
              color: prev.active.color,
              type: prev.active.type,
              rotated: prev.active.rotated
            },
            inactive: [...prev.inactive],
            score: prev.score
          }

        })
      }, 500)
    return () => clearTimeout(loop)
  }, [playing])

  const playerInputHandler = (event: React.KeyboardEvent<HTMLSpanElement>) => {
    const key = event.key.toLowerCase().replace('arrow', '');
    const direction = key as Movement
    setTetrominos(prev => {
      const movementCollision = checkMovementForCollision(prev, moveTetromino(prev.active.ids, direction))
      const rotationCollision = checkMovementForCollision(prev, rotateTetromino(prev.active).ids)
      if (key === 'up' && !rotationCollision) {
        return {
          active: rotateTetromino(prev.active),
          inactive: [...prev.inactive],
          score: prev.score
        }
      }
      if (['right', 'left', 'down'].includes(key) && !movementCollision) {
        return {
          active: {
            ids: moveTetromino(prev.active.ids, direction as Movement),
            color: prev.active.color,
            type: prev.active.type,
            rotated: prev.active.rotated 
          },
          inactive: [...prev.inactive],
          score: direction === 'down' ? prev.score + 1 : prev.score
        }
      }
      return prev
    })
  }

  return (
    <span className="container" tabIndex={0} onKeyDown={(event) => playerInputHandler(event)} >
      <div className="score">{tetrominos.score}</div>
      <div className="grid">
      <img className={`${gameLost.current ? 'game-over' : 'game-playing'}`} alt="" src="/game-over.svg"></img>
      {grid.map((row, index) => <div id={String.fromCharCode(index + 65)} className="row">{
        row.map(block => {
          const activeBlockColor = tetrominos.inactive.find(tetroBlocks => tetroBlocks.id === block.id)?.color || ''
          const inactiveBlockColor = tetrominos.active.ids.includes(block.id) ? tetrominos.active.color : ''
          return (
            <div 
              id={block.id} 
              className={
                `
                  block
                  ${activeBlockColor}
                  ${inactiveBlockColor}
                  ${block.color}
                `
              }>
            </div>
          )
        })
      }</div>)}
      </div>
      <div className="buttons">
        <button 
          onClick={(() => { playing.current = !playing.current })} 
          className="button"
          disabled={gameLost.current}
        >
          {playing.current ? 'Pause' : 'Start'}
        </button>
        <button 
          onClick={(() => {
            setTetrominos(initialState)
            gameLost.current = false
          })}
          className="button"
        >
          Restart
        </button>
      </div>
    </span>
  );
}

export default App;
