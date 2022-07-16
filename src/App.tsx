import React, { useState, useMemo, useEffect } from 'react'
import { TetrominoBlocks } from './types'
import { moveTetromino, collisionDetected, generateTetromino } from './constants'
import './App.css';

function App() {
  const [activeTetrominoBlocks, setActiveTetrominoBlocks] = useState<TetrominoBlocks>({ ids: ['z0'], color: 'green'})
  // once an active tetromino hits something then all its blocks become inactive
  const [inactiveTetrominoBlocks, setInactiveTetrominoBlocks] = useState()

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

  // try one more time in the setActive call 

  useEffect(() => {
    setInterval(() => {
      setActiveTetrominoBlocks(prev => {
        if (collisionDetected(prev.ids) || activeTetrominoBlocks.ids[0] === 'z0') {
           return  { ids: generateTetromino(), color: 'green'}
        }
        return { ids: moveTetromino(prev.ids, 'down'), color: prev.color }
      })
    }, 1000);
  }, [])

  return (
    <div className="grid">
      <div>
      {grid.map((row, index) => <div id={String.fromCharCode(index + 65)} className="row">{
        row.map(block => {
          return <div id={block.id} className={`block ${
            !!activeTetrominoBlocks?.ids?.includes(block.id) ? `${activeTetrominoBlocks.color} active-block` : ''
          } ${block.color}`}></div>
        })
      }</div>)}
      </div>
    </div>
  );
}

export default App;
