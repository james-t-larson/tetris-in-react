import React, { useState, useMemo, useEffect } from 'react'
import { Tetrominos, Movement } from './types'
import { rotateTetromino, moveTetromino, collisionDetected, generateTetromino, bottomReached, clearLine } from './utils'
import './App.css';

function App() {
  const [tetrominos, setTetrominos] = useState<Tetrominos>({
    active: { ids: ['z0'], type: 'I', color: 'green', rotated: 0},
    inactive: [{ id: 'z0', color: 'green'}]
  })

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
    setInterval(() => {
      setTetrominos(prev => {
        if (bottomReached(prev, 'down') || prev.active.ids[0] === 'z0') {
          const inactiveTetrominoBlocks = [...prev.active.ids].map(id => ({
            id: id,
            color: prev.active.color
          })).concat(prev.inactive)
          
          return {
            active: generateTetromino(),
            inactive: clearLine(inactiveTetrominoBlocks)
          }
        }
        return {
          active: {ids: moveTetromino(prev.active.ids, 'down'), color: prev.active.color, type: prev.active.type, rotated: prev.active.rotated },
          inactive: [...prev.inactive]
        }
      })
    }, 500);
  }, [])

  const playerInputHandler = (event: React.KeyboardEvent<HTMLSpanElement>) => {
    const key = event.key.toLowerCase();
    const direction = key.replace('arrow', '')
      if ((!key.includes('up') && key.includes('arrow')) || collisionDetected(tetrominos.active.ids, direction as Movement)) {
        setTetrominos(prev => {
          return {
            active: {ids: moveTetromino(prev.active.ids, direction as Movement), color: prev.active.color, type: prev.active.type, rotated: prev.active.rotated },
            inactive: [...prev.inactive]
          }
        })
      }
      if ((key.includes('up') && key.includes('arrow'))) {
        setTetrominos(prev => {
          return {
            active: rotateTetromino(prev.active),
            inactive: [...prev.inactive]
          }
        })
      }
  }

  return (
    <span className="grid" tabIndex={0} onKeyDown={(event) => playerInputHandler(event)} >
      <div>
      {grid.map((row, index) => <div id={String.fromCharCode(index + 65)} className="row">{
        row.map(block => {
          return <div id={block.id} className={
             `block 
              ${!!tetrominos.active.ids.includes(block.id) ? `${tetrominos.active.color} active-block` : ''}
              ${(() => {
                const foundBlock = tetrominos.inactive.find(tetroBlocks => tetroBlocks.id === block.id)
                  return !!foundBlock?.color ? `${foundBlock?.color} active-block` : ''
              })()}
              ${block.color}
              `
            }>
          </div>
        })
      }</div>)}
      </div>
      </span>
  );
}

export default App;
