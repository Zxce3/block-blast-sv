import { Board } from '#lib/game/board.svelte.ts'
import { Score } from '#lib/game/score.svelte.ts'
import { StatsTracker } from '#lib/game/stats.svelte.ts'
import { getWeightedRandomPieces, type Piece } from '#lib/game/pieces.ts'
import type { PlaceResult } from '#lib/game/board.svelte.ts'

export interface Notification {
  id:    number
  text:  string
  color: string
}

export class Game {
  board         = new Board()
  score         = new Score()
  stats         = new StatsTracker()
  tray          = $state<(Piece | null)[]>([null, null, null])
  dragging      = $state<number | null>(null)
  dragOffset    = $state({ row: 0, col: 0 })
  phase         = $state<'landing' | 'playing'>('landing')
  notifications = $state<Notification[]>([])

  private _notifId   = 0
  private _prevLevel = 1

  get level(): number {
    return Math.floor(this.score.value / 500) + 1
  }

  get isOver(): boolean {
    if (this.phase !== 'playing') return false
    const active = this.tray.filter((p): p is Piece => p !== null)
    if (active.length === 0) return false
    return !this.board.hasAnyValidPlacement(active)
  }

  constructor() {
    this.refillTray()
  }

  startGame(): void {
    this.phase      = 'playing'
    this._prevLevel = 1
    this.board.reset()
    this.refillTray()
  }

  startDrag(slotIndex: number, offsetRow = 0, offsetCol = 0): void {
    this.dragging   = slotIndex
    this.dragOffset = { row: offsetRow, col: offsetCol }
  }

  tryPlace(row: number, col: number): PlaceResult | null {
    if (this.dragging === null) return null
    const piece = this.tray[this.dragging]
    if (!piece) return null
    if (!this.board.canPlace(piece, row, col)) return null

    const result = this.board.place(piece, row, col)
    this.score.addPlacement(result.cellsPlaced)

    const tray = this.tray.slice() as (Piece | null)[]
    tray[this.dragging] = null
    this.tray    = tray
    this.dragging = null

    const totalLines = result.clearedRows.length + result.clearedCols.length
    this.score.addClear(totalLines)

    // Line-clear notifications
    if      (totalLines >= 4) this._notify('MEGA CLEAR!',  'var(--piece-pink)')
    else if (totalLines === 3) this._notify('TRIPLE!',     'var(--piece-orange)')
    else if (totalLines === 2) this._notify('DOUBLE!',     'var(--piece-green)')

    // Streak milestone every 3
    if (this.score.streak >= 3 && this.score.streak % 3 === 0) {
      this._notify(`STREAK ×${this.score.streak}`, 'var(--piece-yellow)')
    }

    // Level-up notification
    const newLevel = this.level
    if (newLevel > this._prevLevel) {
      this._prevLevel = newLevel
      this._notify(`LEVEL ${newLevel}!`, 'var(--piece-indigo)')
    }

    if (this.tray.every(p => p === null)) this.refillTray()

    return result
  }

  checkPerfectClear(): void {
    if (this.board.cells.every(c => c === 0)) {
      this.score.addBonus(500)
      this._notify('PERFECT CLEAR! +500', 'var(--piece-yellow)')
    }
  }

  cancelDrag(): void {
    this.dragging = null
  }

  refillTray(): void {
    this.tray = getWeightedRandomPieces(3, this.level)
  }

  newGame(): void {
    this._recordAndReset()
    this.phase = 'playing'
  }

  goToMenu(): void {
    this._recordAndReset()
    this.phase = 'landing'
  }

  private _recordAndReset(): void {
    this.stats.recordGame(
      this.score.value,
      this.score.bestStreak,
      this.level,
      this.score.linesCleared,
    )
    this.score.resetRound()
    this.board.reset()
    this._prevLevel    = 1
    this.notifications = []
    this.refillTray()
  }

  private _notify(text: string, color: string): void {
    const id = ++this._notifId
    this.notifications = [...this.notifications, { id, text, color }]
    setTimeout(() => {
      this.notifications = this.notifications.filter(n => n.id !== id)
    }, 1500)
  }
}

export const game = new Game()
