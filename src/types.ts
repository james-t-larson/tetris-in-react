export interface Tetrominos {
  active: Tetromino; inactive: InactiveTetrominoBlock[]
}

export interface Tetromino {
  ids: TetrominoBlock,
  color: string,
  type: TetrominoType,
  rotated: 0 | 1 | 2 | 3
}

export interface InactiveTetrominoBlock {
  id: string,
  color: string
}

export type TetrominoBlock = string[]

export type TetrominoType = 'I' | 'J' | 'L' | 'O' | 'S' | 'T' | 'Z'

export type Movement = 'right' | 'left' | 'down' | 'up'

export type RotationCount = 0 | 1 | 2 | 3

