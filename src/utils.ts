import { Movement, Tetromino, Tetrominos, InactiveTetrominoBlock, TetrominoType, RotationCount } from './types'

const randomNumber = (min: number, max: number) => { 
  return Math.floor(Math.random() * (max - min) + min);
} 

export const moveBlock = ([row, column]: string, direction: Movement, movementCount: number = 1): string => {
  const directions = {
    'up': String.fromCharCode(row.charCodeAt(0) - movementCount) + column,
    'down': String.fromCharCode(row.charCodeAt(0) + movementCount) + column,
    'right': row + (Number(column) + movementCount),
    'left': row + (Number(column) - movementCount)
  }

  return directions[direction]
}

export const moveTetromino = (ids: string[], direction: Movement): string[] => {
   return ids.map(id => moveBlock(id, direction))
}

export const moveInactiveBlocks = (blocks: InactiveTetrominoBlock[], completeRows: TetrominoType[]): InactiveTetrominoBlock[] => {
  const completeRowsAsInts = completeRows.map(row => row.charCodeAt(0))
  return blocks.map(({ id, color })=> {
      if (completeRowsAsInts.includes(id[0].charCodeAt(0) + 1)) {
        return {
          id: moveBlock(id, 'down'),
          color: color
        }
      } else {
        return {
          id: id,
          color: color
        }
      }
  })
}

export const clearLine = (blocks: InactiveTetrominoBlock[]): InactiveTetrominoBlock[] => {
  let rowCounts: {[key: string]: number} = {}
  blocks.forEach(block => {
    const row = block.id[0]
      if (rowCounts[row]) {
        rowCounts[row] += 1
      } else {
        rowCounts[row] = 1
      }
  })

  const filteredBlocks = blocks.filter(block => rowCounts[block.id[0]] < 10)
  const filledRows: TetrominoType[] = Object.entries(rowCounts).filter(([key,value]) => {
    return value > 9
  }).map(row => row[0] as TetrominoType)

  const movedBlocks = moveInactiveBlocks(filteredBlocks, filledRows)
  return Object.values(rowCounts).some(v => v > 9) ? movedBlocks : blocks
}

export const checkMovementForCollision = (tetrominos: Tetrominos, futurePosition: string[]): boolean => {
  const inactiveIds = [...tetrominos.inactive].map(block => block.id)
  return futurePosition.some(id => {
    const boundaries = ['10', '-1', 'U', 'z']
    return inactiveIds.includes(id) || boundaries.some(b => id.includes(b))
  })
}

const movementsFromType: { [key: string]: Movement[] } = {
  'I': ['right', 'left', 'left', 'left'],
  'J': ['left','right', 'right', 'down'],
  'L': ['right', 'left', 'left', 'down'],
  'O': ['right', 'down', 'left'],
  'S': ['right', 'left', 'down', 'left'],
  'T': ['up', 'down', 'right', 'left', 'left'],
  'Z': ['left', 'right', 'up', 'right'],
}

const rotateMovements = (movements: Movement[], rotated: RotationCount) => {
    if (rotated === 0) return movements
    const rotatedMovements: { [key: number]: {[key: string]: Movement} } = {
      1: {
        left: 'up',
        right: 'down',
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
  if (tetromino.type === 'O') return tetromino
  const rotated: RotationCount = (tetromino.rotated < 3 ? tetromino.rotated + 1 : 0) as RotationCount 

  const rotatedMovements = rotateMovements(movementsFromType[tetromino.type], rotated)

  return {
    ids:  generateFromMovements(rotatedMovements, tetromino.ids[0]),
    color: tetromino.color,
    type: tetromino.type,
    rotated: rotated
  }
}

export const generateTetromino = (): Tetromino => {
  const tetrominoTypes: TetrominoType[] = ['I','J','L','O','S','T','Z']
  const colors = ['cyan', 'blue', 'orange', 'yellow', 'green', 'purple', 'red']
  const randomType: TetrominoType = tetrominoTypes[randomNumber(0, tetrominoTypes.length - 1)]
  const movements = movementsFromType[randomType]

  return {
    ids:  generateFromMovements(movements),
    color: colors[randomNumber(0, colors.length - 1)],
    type: randomType,
    rotated: 0 
  }
}

