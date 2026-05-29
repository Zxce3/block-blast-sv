const LS_SCORES = 'blockblast_scores_v2'
const LS_STATS  = 'blockblast_stats_v2'

export interface ScoreEntry {
  score:      number
  bestStreak: number
  level:      number
  lines:      number
  date:       string
}

export interface Stats {
  gamesPlayed: number
  totalLines:  number
  bestStreak:  number
  bestScore:   number
}

const DEFAULT_STATS: Stats = { gamesPlayed: 0, totalLines: 0, bestStreak: 0, bestScore: 0 }

export class StatsTracker {
  scores = $state<ScoreEntry[]>([])
  stats  = $state<Stats>({ ...DEFAULT_STATS })

  constructor() {
    if (typeof localStorage === 'undefined') return
    try {
      const s = localStorage.getItem(LS_SCORES)
      if (s) this.scores = JSON.parse(s) as ScoreEntry[]
      const t = localStorage.getItem(LS_STATS)
      if (t) this.stats = { ...DEFAULT_STATS, ...(JSON.parse(t) as Partial<Stats>) }
    } catch { /* corrupt storage — start fresh */ }
  }

  recordGame(score: number, bestStreak: number, level: number, lines: number): void {
    const entry: ScoreEntry = {
      score, bestStreak, level, lines,
      date: new Date().toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
    }
    this.scores = [entry, ...this.scores]
      .sort((a, b) => b.score - a.score)
      .slice(0, 5)

    this.stats = {
      gamesPlayed: this.stats.gamesPlayed + 1,
      totalLines:  this.stats.totalLines  + lines,
      bestStreak:  Math.max(this.stats.bestStreak, bestStreak),
      bestScore:   Math.max(this.stats.bestScore, score),
    }

    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(LS_SCORES, JSON.stringify(this.scores))
      localStorage.setItem(LS_STATS,  JSON.stringify(this.stats))
    }
  }
}
