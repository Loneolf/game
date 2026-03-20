import { TETRISSCORE, TETRISLEVEL, TETRISLINES } from './config'

export default class Score {
    score: number = 0
    level: number = 1
    lines: number = 0
    scoreEL: HTMLElement | null = null
    levelEL: HTMLElement | null = null
    linesEL: HTMLElement | null = null

    constructor() {
        this.scoreEL = document.querySelector('#score')!
        this.levelEL = document.querySelector('#level')!
        this.linesEL = document.querySelector('#lines')!
    }

    init() {
        this.archiveRestore()
    }

    addScore(lines: number) {
        const scoreMap = {1: 100, 2: 300, 3: 500, 4: 800}
        this.score += scoreMap[lines] || 0
        this.lines += lines
        this.level = Math.floor(this.lines / 10) + 1
        this.updateUI()
        this.archive()
    }

    updateUI() {
        if (this.scoreEL) this.scoreEL.innerText = `${this.score}`
        if (this.levelEL) this.levelEL.innerText = `${this.level}`
        if (this.linesEL) this.linesEL.innerText = `${this.lines}`
    }

    archive() {
        localStorage.setItem(TETRISSCORE, JSON.stringify(this.score))
        localStorage.setItem(TETRISLEVEL, JSON.stringify(this.level))
        localStorage.setItem(TETRISLINES, JSON.stringify(this.lines))
    }

    archiveRestore() {
        try {
            const score = JSON.parse(localStorage.getItem(TETRISSCORE)!)
            const level = JSON.parse(localStorage.getItem(TETRISLEVEL)!)
            const lines = JSON.parse(localStorage.getItem(TETRISLINES)!)
            if (score) this.score = score
            if (level) this.level = level
            if (lines) this.lines = lines
            this.updateUI()
        } catch (error) {
            console.log('存档异常')
        }
    }

    clearArchive() {
        localStorage.removeItem(TETRISSCORE)
        localStorage.removeItem(TETRISLEVEL)
        localStorage.removeItem(TETRISLINES)
    }
}
