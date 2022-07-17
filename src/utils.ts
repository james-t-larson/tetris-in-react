import { Movement, Tetromino, Tetrominos, InactiveTetrominoBlock } from './types'

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

export const moveInactiveBlocks = (blocks: InactiveTetrominoBlock[]): InactiveTetrominoBlock[] => {
  return blocks.map(block => ({
    id: moveBlock(block.id, 'down'),
    color: block.color
  }))
}

export const clearLine = (blocks: InactiveTetrominoBlock[]): InactiveTetrominoBlock[] => {
  let count: {[key: string]: number} = {}

  blocks.forEach(block => {
    const row = block.id[0]
      if (count[row]) {
        count[row] += 1
      } else {
        count[row] = 1
      }
  })

  const filteredBlocks = blocks.filter(block => count[block.id[0]] < 9)
  const movedBlocks = moveInactiveBlocks(filteredBlocks)
  return Object.values(count).some(v => v > 9) ? movedBlocks : blocks
}

export const bottomReached = (tetrominos: Tetrominos, attemptedMovement: Movement): boolean => {
  const positionAfterMovement = [...tetrominos.active.ids].map(id => moveBlock(id, attemptedMovement))
  const inactiveIds = [...tetrominos.inactive].map(block => block.id)
  const blockCollisionFound = positionAfterMovement.some(id => {
    return inactiveIds.includes(id)
  })
  const atBottomRow = tetrominos.active.ids.some(([row]) => {
    return row === 'T'
  })
  return blockCollisionFound || atBottomRow
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

  const movementsForTypes: { [key: string]: Movement[] } = {
    'I': ['down', 'down', 'down'],
    'J': ['left', 'down', 'down'],
    'L': ['right', 'down', 'down'],
    'O': ['right', 'down', 'left'],
    'S': ['left', 'down', 'left'],
    'T': ['down', 'right', 'left', 'left'],
    'Z': ['right', 'down', 'right'],
  }

  const generateFromType = (type: string) => {
    const ids: string[] = [startingPoint]
    const movements = movementsForTypes[type]
    for (let i = 0; i <= movements.length - 1; i++){
      ids.push(moveBlock(ids[i], movements[i]))
    }
    return [...new Set(ids)] // delete duplicates
  }

  return {
    ids:  generateFromType(randomType),
    color: colors[randomNumber(0, colors.length - 1)]
  }
}

