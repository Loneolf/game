import { TETRISSCORE, TETRISLEVEL, TETRISLINES } from './config'

export default class Music {
    bgMusic: HTMLAudioElement
    playMusic: HTMLAudioElement
    isPlay: boolean = false

    constructor() {
        this.bgMusic = document.querySelector('#bgAudio')!
        this.playMusic = document.querySelector('#playMusic')!
    }

    init() {
        this.archiveRestore()
        this.bgMusic.play().catch(() => {})
    }

    eatMusic() {
        this.playMusic.src = './mp3/eat.mp3'
        this.playMusic.play()
    }

    over() {
        this.bgMusic.pause()
        this.playMusic.src = './mp3/over.mp3'
        this.playMusic.play()
    }

    setBgMusicSpeed(speed: number) {
        this.bgMusic.playbackRate = speed
    }

    archive() {
        localStorage.setItem('TETRISMUSIC', JSON.stringify(this.isPlay))
    }

    archiveRestore() {
        try {
            const isPlay = JSON.parse(localStorage.getItem('TETRISMUSIC')!)
            this.isPlay = isPlay || false
        } catch (error) {
            console.log('音乐存档异常')
        }
    }
}
