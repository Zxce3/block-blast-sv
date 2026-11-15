export interface Piece {
  id: string
  shape: number[][]
  colorVar: string
}

export const PIECES: Piece[] = [
  { id: '1x1',   shape: [[1]],                                colorVar: 'var(--piece-teal)'   },
  { id: '1x2',   shape: [[1, 1]],                             colorVar: 'var(--piece-blue)'   },
  { id: '2x1',   shape: [[1], [1]],                           colorVar: 'var(--piece-indigo)' },
  { id: '1x3',   shape: [[1, 1, 1]],                          colorVar: 'var(--piece-green)'  },
  { id: '3x1',   shape: [[1], [1], [1]],                      colorVar: 'var(--piece-orange)' },
  { id: 'L3',    shape: [[1, 0], [1, 0], [1, 1]],             colorVar: 'var(--piece-red)'    },
  { id: 'J3',    shape: [[0, 1], [0, 1], [1, 1]],             colorVar: 'var(--piece-pink)'   },
  { id: '2x2',   shape: [[1, 1], [1, 1]],                     colorVar: 'var(--piece-yellow)' },
  { id: '1x4',   shape: [[1, 1, 1, 1]],                       colorVar: 'var(--piece-purple)' },
  { id: '4x1',   shape: [[1], [1], [1], [1]],                 colorVar: 'var(--piece-teal)'   },
  { id: 'T4',    shape: [[1, 1, 1], [0, 1, 0]],               colorVar: 'var(--piece-blue)'   },
  { id: 'L4',    shape: [[1, 0], [1, 0], [1, 0], [1, 1]],     colorVar: 'var(--piece-green)'  },
  { id: 'J4',    shape: [[0, 1], [0, 1], [0, 1], [1, 1]],     colorVar: 'var(--piece-orange)' },
  { id: 'S4',    shape: [[0, 1, 1], [1, 1, 0]],               colorVar: 'var(--piece-red)'    },
  { id: 'Z4',    shape: [[1, 1, 0], [0, 1, 1]],               colorVar: 'var(--piece-indigo)' },
  { id: '3x3',   shape: [[1,1,1],[1,1,1],[1,1,1]],            colorVar: 'var(--piece-pink)'   },
  { id: 'P5',    shape: [[1, 1], [1, 1], [1, 0]],             colorVar: 'var(--piece-yellow)' },
]

const SMALL_IDS = new Set(['1x1', '1x2', '2x1', '1x3', '3x1', 'J3', 'L3', '2x2'])

export function getWeightedRandomPieces(n: number, level: number = 1): Piece[] {
  const pool: Piece[] = []
  for (const p of PIECES) {
    let weight: number
    if (level <= 2)      weight = SMALL_IDS.has(p.id) ? 3 : 1
    else if (level <= 5) weight = SMALL_IDS.has(p.id) ? 2 : 1
    else                 weight = SMALL_IDS.has(p.id) ? 1 : 2
    for (let i = 0; i < weight; i++) pool.push(p)
  }
  const result: Piece[] = []
  for (let i = 0; i < n; i++) {
    result.push(pool[Math.floor(Math.random() * pool.length)])
  }
  return result
}
