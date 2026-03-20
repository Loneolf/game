import ArchiveClass from '@u/archiveClass'
import Score from './score'
import Tetris from './tetris'
import Music from './music'
import { TETRISSTATE, GETINFO_EVENT, RECEIVE_INFO_EVENT_MUSIC } from './config'

class Contrl implements ArchiveClass{
    tetris: Tetris
    score: Score
    music: Music
    isLive: boolean = false
    isStop: boolean = false
    isGameOver: boolean = false
    dirEL: HTMLElement | null = null
    liveOptEL: HTMLElement | null = null
    pauseEL: HTMLElement | null = null
    gameLoop: number | null = null
    dropInterval: number = 1000
    lastDropTime: number = 0

    constructor() {
        this.tetris = new Tetris()
        this.score = new Score()
        this.music = new Music()
        this.dirEL = document.querySelector('#dirBox')
        this.liveOptEL = document.querySelector('#agin')
        this.pauseEL = document.querySelector('#pause')

        if (this.dirEL) {
            this.dirEL.addEventListener('touchstart', this.clickHandle.bind(this))
            this.dirEL.addEventListener('mousedown', this.clickHandle.bind(this))
        }

        if (this.liveOptEL) {
            this.liveOptEL.addEventListener('click', () => this.start())
        }

        if (this.pauseEL) {
            this.pauseEL.addEventListener('click', () => this.togglePause())
        }

        document.addEventListener('keydown', this.keyDownHandle.bind(this))
        this.archiveRestore()
        document.addEventListener(GETINFO_EVENT, this.getInfoHandle.bind(this))
        
        this.tetris.draw()
    }

    getInfoHandle(e: any) {
        switch (e.detail) {
            case "isStop":
                const receveInfoEventMusic = new CustomEvent(RECEIVE_INFO_EVENT_MUSIC, {detail: this.isStop})
                document.dispatchEvent(receveInfoEventMusic)
                break;
            default:
                break;
        }
    }

    togglePause() {
        if (!this.isLive || this.isGameOver) return
        this.isStop = !this.isStop
        if (this.isStop) {
            this.music.bgMusic.pause()
            if (this.pauseEL) this.pauseEL.innerText = '继续'
            this.archive()
        } else {
            this.music.bgMusic.play()
            if (this.pauseEL) this.pauseEL.innerText = '暂停'
            this.clearArchive()
            this.lastDropTime = performance.now()
        }
    }

    start() {
        if (this.isLive && !this.isGameOver) return
        
        this.tetris.initBoard()
        this.score.init()
        this.music.init()
        this.isLive = true
        this.isStop = false
        this.isGameOver = false
        
        if (this.liveOptEL) this.liveOptEL.innerText = '重新开始'
        if (this.pauseEL) this.pauseEL.innerText = '暂停'
        
        this.tetris.spawnPiece()
        this.tetris.draw()
        
        this.lastDropTime = performance.now()
        this.gameLoop = requestAnimationFrame(this.update.bind(this))
    }

    update(currentTime: number) {
        if (!this.isLive || this.isStop) {
            this.gameLoop = requestAnimationFrame(this.update.bind(this))
            return
        }

        const deltaTime = currentTime - this.lastDropTime
        const speed = this.getSpeed()

        if (deltaTime >= speed) {
            if (!this.tetris.moveDown()) {
                this.tetris.lockPiece()
                const linesCleared = this.tetris.clearLines()
                if (linesCleared > 0) {
                    this.score.addScore(linesCleared)
                    this.music.eatMusic()
                }
                
                if (!this.tetris.spawnPiece()) {
                    this.gameOver()
                    return
                }
            }
            this.lastDropTime = currentTime
        }

        this.tetris.draw()
        this.gameLoop = requestAnimationFrame(this.update.bind(this))
    }

    getSpeed(): number {
        const level = this.score.level
        const baseSpeed = 1000
        const speedDecrease = 50
        const minSpeed = 100
        
        const speed = baseSpeed - (level - 1) * speedDecrease
        return Math.max(speed, minSpeed)
    }

    gameOver() {
        this.isGameOver = true
        this.isLive = false
        this.music.over()
        if (this.liveOptEL) this.liveOptEL.innerText = '重新开始'
        if (this.pauseEL) this.pauseEL.innerText = '暂停'
        
        if (this.gameLoop) {
            cancelAnimationFrame(this.gameLoop)
            this.gameLoop = null
        }
        
        this.clearArchive()
    }

    archive() {
        this.tetris.archive()
        this.score.archive()
        this.music.archive()
        localStorage.setItem(TETRISSTATE, JSON.stringify({ 
            isArchive: true,
            isGameOver: this.isGameOver,
        }))
    }

    clearArchive() {
        localStorage.removeItem(TETRISSTATE)
        this.tetris.clearArchive()
        this.score.clearArchive()
    }

    archiveRestore() {
        try {
            const archiveData: { isArchive: boolean, isGameOver: boolean } = JSON.parse(localStorage.getItem(TETRISSTATE)!)
            if (archiveData?.isArchive && !archiveData.isGameOver) {
                if (this.liveOptEL) this.liveOptEL.innerText = '继续'
                this.isLive = true
                this.isStop = true
                this.isGameOver = false
                this.tetris.archiveRestore()
                this.score.archiveRestore()
                this.music.archiveRestore()
                this.tetris.draw()
            }
        } catch (error) {
            console.log('存档异常')
        }
    }

    clickHandle(e: TouchEvent | MouseEvent) {
        e.preventDefault()
        e.stopPropagation()
        const target = e.target as HTMLElement
        const inner = target.innerText
        
        if (!this.isLive || this.isStop || this.isGameOver) return

        switch (inner) {
            case '←':
                this.tetris.moveLeft()
                this.tetris.draw()
                break
            case '→':
                this.tetris.moveRight()
                this.tetris.draw()
                break
            case '↓':
                if (this.tetris.moveDown()) {
                    this.lastDropTime = performance.now()
                }
                this.tetris.draw()
                break
            case '↻':
                this.tetris.rotate()
                this.tetris.draw()
                break
        }
    }

    keyDownHandle(e: KeyboardEvent) {
        if (e.type !== 'keydown') return
        
        if (e.code === 'Space') {
            e.preventDefault()
            if (!this.isLive || this.isGameOver) {
                this.start()
            } else {
                this.togglePause()
            }
            return
        }

        if (!this.isLive || this.isStop || this.isGameOver) return

        switch (e.key) {
            case 'ArrowLeft':
                e.preventDefault()
                this.tetris.moveLeft()
                this.tetris.draw()
                break
            case 'ArrowRight':
                e.preventDefault()
                this.tetris.moveRight()
                this.tetris.draw()
                break
            case 'ArrowDown':
                e.preventDefault()
                if (this.tetris.moveDown()) {
                    this.lastDropTime = performance.now()
                }
                this.tetris.draw()
                break
            case 'ArrowUp':
                e.preventDefault()
                this.tetris.rotate()
                this.tetris.draw()
                break
        }
    }
}

export default Contrl
