import { Movement, Tetromino, Tetrominos, InactiveTetrominoBlock, TetrominoType, RotationCount } from './types'

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

const movementsFromType: { [key: string]: Movement[] } = {
  'I': ['left', 'left', 'left'],
  'J': ['left', 'down', 'down'],
  'L': ['right', 'down', 'down'],
  'O': ['right', 'down', 'left'],
  'S': ['left', 'down', 'left'],
  'T': ['down', 'right', 'left', 'left'],
  'Z': ['right', 'down', 'right'],
}

const rotateMovements = (movements: Movement[], rotated: 0 | 1 | 2 | 3) => {
    if (rotated === 0) return movements
    const rotatedMovements: { [key: number]: {[key: string]: Movement} } = {
      1: {
        left: 'down',
        right: 'up',
        down: 'left',
        up: 'right'
      },
      2: {
        left: 'right',
        right: 'left',
        down: 'up',
        up: 'down'
      },
      3: {
        left: 'down',
        right: 'up',
        down: 'right',
        up: 'left'
      }
    }
    return movements.map((movement: Movement) => rotatedMovements[rotated][movement])
}

const generateFromMovements = (movements: Movement[], startingPoint: string = 'A4') => {
  const ids: string[] = [startingPoint]
  for (let i = 0; i <= movements.length - 1; i++){
    ids.push(moveBlock(ids[i], movements[i]))
  }
  return [...new Set(ids)] // delete duplicates
}

export const rotateTetromino = (tetromino: Tetromino): Tetromino => {
  const rotated: RotationCount = (tetromino.rotated < 3 ? tetromino.rotated + 1 : 0) as RotationCount 

  const startingPointFromType : { [key: string]: string} = {
    'I': tetromino.ids[2],
    'J': tetromino.ids[0],
    'L': tetromino.ids[0],
    'O': tetromino.ids[0],
    'S': tetromino.ids[0],
    'T': tetromino.ids[0],
    'Z': tetromino.ids[0],
  }

  const rotatedMovements = rotateMovements(movementsFromType[tetromino.type], rotated)

  return {
    ids:  generateFromMovements(rotatedMovements, startingPointFromType[tetromino.type]),
    color: tetromino.color,
    type: tetromino.type,
    rotated: rotated
  }
}

export const generateTetromino = (): Tetromino => {
  const tetrominoTypes: TetrominoType[] = ['I','J','L','O','S','T','Z']
  const colors = ['cyan', 'blue', 'orange', 'yellow', 'green', 'purple', 'red']
  const randomType: TetrominoType = tetrominoTypes[randomNumber(0, tetrominoTypes.length - 1)]
  // const movements = movementsFromType[randomType]
  const movements = movementsFromType['T']

  return {
    ids:  generateFromMovements(movements),
    color: colors[randomNumber(0, colors.length - 1)],
    // type: randomType,
    type: 'T',
    rotated: 0 
  }
}

