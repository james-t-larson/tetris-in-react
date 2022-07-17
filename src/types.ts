export interface Tetrominos {
  active: Tetromino; inactive: InactiveTetrominoBlock[]
}

export interface Tetromino {
  ids: TetrominoBlock,
  color: string
}

export interface InactiveTetrominoBlock {
  id: string,
  color: string
}

export type TetrominoBlock = string[]

export type Movement = 'right' | 'left' | 'down' | 'up'



