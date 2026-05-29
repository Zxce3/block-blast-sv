const LS_HIGH   = 'blockblast_highscore'
const LS_PLAYED = 'blockblast_played'

export class Score {
  value        = $state(0)
  high         = $state(0)
  streak       = $state(0)
  bestStreak   = $state(0)
  played       = $state(0)
  linesCleared = $state(0)

  constructor() {
    if (typeof localStorage !== 'undefined') {
      this.high   = parseInt(localStorage.getItem(LS_HIGH)   ?? '0', 10)
      this.played = parseInt(localStorage.getItem(LS_PLAYED) ?? '0', 10)
    }
  }

  private persist(): void {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(LS_HIGH,   String(this.high))
      localStorage.setItem(LS_PLAYED, String(this.played))
    }
  }

  addPlacement(cells: number): void {
    this.value += cells
  }

  addBonus(pts: number): void {
    this.value += pts
    if (this.value > this.high) {
      this.high = this.value
      this.persist()
    }
  }

  addClear(lines: number): void {
    if (lines === 0) {
      this.streak = 0
      return
    }
    this.linesCleared += lines
    const multiplier  = lines >= 3 ? 2.0 : lines === 2 ? 1.5 : 1.0
    const streakBonus = this.streak * 5
    const base        = lines * 10
    this.value += Math.round(base * multiplier) + streakBonus
    this.streak++
    if (this.streak > this.bestStreak) this.bestStreak = this.streak
    if (this.value > this.high) {
      this.high = this.value
      this.persist()
    }
  }

  resetRound(): void {
    if (this.value > this.high) this.high = this.value
    this.value        = 0
    this.streak       = 0
    this.bestStreak   = 0
    this.linesCleared = 0
    this.played++
    this.persist()
  }
}
