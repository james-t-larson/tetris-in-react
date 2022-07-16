export interface Tetromino {
  ids: TetrominoBlock,
  color: string
}

export type TetrominoBlock = string[]

export type Movement = 'right' | 'left' | 'down' | 'up'

