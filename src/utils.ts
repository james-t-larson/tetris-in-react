import { Movement, Tetromino } from './types'

const randomNumber = (min: number, max: number) => { 
  return Math.floor(Math.random() * (max - min) + min);
} 

export const moveBlock = ([row, column]: string, direction: Movement): string => {
  switch (direction) {
    case 'up':
          return String.fromCharCode(row.charCodeAt(0) - 1) + column
    case 'down':
          return String.fromCharCode(row.charCodeAt(0) + 1) + column
    case 'right':
          return row + (Number(column) + 1)
    case 'left':
          return row + (Number(column) - 1)
    default:
      return 'z0'
  }
}

export const moveTetromino = (ids: string[], direction: Movement): string[] => {
  if (collisionDetected(ids, direction)) return ids;
   return ids.map(id => moveBlock(id, direction))
}

export const bottomReached = (ids: string[]): boolean => {
  return  ids.some(([row]) => {
    return row === 'T'
  })
}

export const collisionDetected = (ids: string[], attemptedMovement: Movement): boolean => {
  const positionAfterMovement = [...ids].map(id => moveBlock(id, attemptedMovement))
  return positionAfterMovement.some(id => {
    return id.includes('U') || id.includes('10') || id.includes('-1')
  })
}

export const generateTetromino = (): Tetromino => {
  const tetrominoTypes = 'IJLOSTZ'
  const colors = ['cyan', 'blue', 'orange', 'yellow', 'green', 'purple', 'red']
  const randomType = tetrominoTypes[randomNumber(0, tetrominoTypes.length - 1)]
  const startingPoint = 'A4'
  const ids: string[] = [startingPoint]

    const generateWithMovements = (movements: Movement[]) => {
      for (let i = 0; i <= movements.length - 1; i++){
        ids.push(moveBlock(ids[i], movements[i]))
      }
      return [...new Set(ids)] // delete duplicates
    }

    switch (randomType) {
      case 'I':
        generateWithMovements(['down', 'down', 'down'])
        break;
      case 'J':
        generateWithMovements(['left', 'down', 'down'])
        break;
      case 'L':
        generateWithMovements(['right', 'down', 'down'])
        break;
      case 'O':
        generateWithMovements(['right', 'down', 'left'])
        break; 
      case 'S':
        generateWithMovements(['left', 'down', 'left'])
        break; 
      case 'T':
        generateWithMovements(['down', 'right', 'left', 'left'])
        break; 
      case 'Z':
        generateWithMovements(['right', 'down', 'right'])
        break; 
    }

    return {
      ids:  ids,
      color: colors[randomNumber(0, colors.length - 1)]
    }
}

