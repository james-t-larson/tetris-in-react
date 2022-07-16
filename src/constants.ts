import { Movements } from './types'

export const moveBlock = ([row, column]: string, direction: Movements): string => {
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


export const moveTetromino = (ids: string[], direction: Movements): string[] => {
  if (collisionDetected(ids)) return ids;
   return ids.map(id => moveBlock(id, direction))
}

export const collisionDetected = (ids: string[]): boolean => {
  return  ids.some(([row, column]) => {
    return row === 'T'
  })
}

export const generateTetromino = (): string[] => {
  const tetrominoTypes = ['I', 'J', 'L', 'O', 'S', 'T', 'Z']
  const chosenType = tetrominoTypes[3]
  const startingPoint = 'A4'
  const tetromino: string[] = [startingPoint]

    switch (chosenType) {
      case 'O':
        const movements: Movements[] = ['right', 'down', 'left']
          for (let i = 0; i <= movements.length - 1; i++){ 
            tetromino.push(moveBlock(tetromino[i], movements[i]))
          }
          return tetromino
    }

    return tetromino
}

