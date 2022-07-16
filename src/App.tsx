import React, { useState, useMemo, useEffect } from 'react'
import { Tetromino, Movement } from './types'
import { moveTetromino, collisionDetected, generateTetromino, bottomReached} from './utils'
import './App.css';

function App() {
  const [activeTetrominoBlocks, setActiveTetrominoBlocks] = useState<Tetromino>({ ids: ['z0'], color: 'green'})
  // once an active tetromino hits something then all its blocks become inactive
  const [inactiveTetrominoBlocks, setInactiveTetrominoBlocks] = useState<Tetromino>()

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
  }, [inactiveTetrominoBlocks])

  useEffect(() => {
    setInterval(() => {
      setActiveTetrominoBlocks(prev => {
        if (bottomReached(prev.ids) || prev.ids[0] === 'z0') {
           return generateTetromino()
        }
        return { ids: moveTetromino(prev.ids, 'down'), color: prev.color }
      })
    }, 500);
  }, [])

  const playerInputHandler = (event: React.KeyboardEvent<HTMLSpanElement>) => {
    const key = event.key.toLowerCase();
    const direction = key.replace('arrow', '')
    if ((!key.includes('up') && key.includes('arrow')) || collisionDetected(activeTetrominoBlocks.ids, direction as Movement)) {
      setActiveTetrominoBlocks(prev => {
        return { ids: moveTetromino(prev.ids, direction as Movement), color: prev.color }
      })
    }
  }

  return (
    <span className="grid" tabIndex={0} onKeyDown={(event) => playerInputHandler(event)} >
      <div>
      {grid.map((row, index) => <div id={String.fromCharCode(index + 65)} className="row">{
        row.map(block => {
          return <div id={block.id} className={`block ${
            !!activeTetrominoBlocks?.ids?.includes(block.id) ? `${activeTetrominoBlocks.color} active-block` : ''
          } ${block.color}`}></div>
        })
      }</div>)}
      </div>
    </span>
  );
}

export default App;
