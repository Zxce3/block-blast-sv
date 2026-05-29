import type { Piece } from './pieces'

export interface PlaceResult {
  clearedRows: number[]
  clearedCols: number[]
  cellsPlaced: number
}

export class Board {
  cells    = $state<number[]>(new Array(64).fill(0))
  colorMap = $state<string[]>(new Array(64).fill(''))

  get filledRows(): number[] {
    const rows: number[] = []
    for (let r = 0; r < 8; r++) {
      let full = true
      for (let c = 0; c < 8; c++) {
        if (this.cells[r * 8 + c] === 0) { full = false; break }
      }
      if (full) rows.push(r)
    }
    return rows
  }

  get filledCols(): number[] {
    const cols: number[] = []
    for (let c = 0; c < 8; c++) {
      let full = true
      for (let r = 0; r < 8; r++) {
        if (this.cells[r * 8 + c] === 0) { full = false; break }
      }
      if (full) cols.push(c)
    }
    return cols
  }

  canPlace(piece: Piece, row: number, col: number): boolean {
    for (let r = 0; r < piece.shape.length; r++) {
      for (let c = 0; c < piece.shape[r].length; c++) {
        if (piece.shape[r][c] === 0) continue
        const br = row + r
        const bc = col + c
        if (br < 0 || br >= 8 || bc < 0 || bc >= 8) return false
        if (this.cells[br * 8 + bc] !== 0) return false
      }
    }
    return true
  }

  place(piece: Piece, row: number, col: number): PlaceResult {
    let cellsPlaced = 0
    const cells = this.cells.slice()
    const colorMap = this.colorMap.slice()
    for (let r = 0; r < piece.shape.length; r++) {
      for (let c = 0; c < piece.shape[r].length; c++) {
        if (piece.shape[r][c] === 0) continue
        const idx = (row + r) * 8 + (col + c)
        cells[idx] = 1
        colorMap[idx] = piece.colorVar
        cellsPlaced++
      }
    }
    this.cells = cells
    this.colorMap = colorMap

    return {
      clearedRows: this.filledRows,
      clearedCols: this.filledCols,
      cellsPlaced,
    }
  }

  clearLines(rows: number[], cols: number[]): void {
    const cells = this.cells.slice()
    const colorMap = this.colorMap.slice()
    for (const r of rows) {
      for (let c = 0; c < 8; c++) {
        cells[r * 8 + c] = 0
        colorMap[r * 8 + c] = ''
      }
    }
    for (const c of cols) {
      for (let r = 0; r < 8; r++) {
        cells[r * 8 + c] = 0
        colorMap[r * 8 + c] = ''
      }
    }
    this.cells = cells
    this.colorMap = colorMap
  }

  hasAnyValidPlacement(pieces: Piece[]): boolean {
    for (const piece of pieces) {
      for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
          if (this.canPlace(piece, r, c)) return true
        }
      }
    }
    return false
  }

  reset(): void {
    this.cells    = new Array(64).fill(0)
    this.colorMap = new Array(64).fill('')
  }
}
