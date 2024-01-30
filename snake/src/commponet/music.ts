import { MUSICSTATE } from './config'
const stopIcon = require('../assets/stopMusic.png')
const normalIcon = require('../assets/music.png')

class Music {
    bgMusic: HTMLAudioElement;
    playMusic: HTMLAudioElement;
    musicImg: HTMLImageElement;
    isMusic: boolean = true;

    constructor() {
        this.bgMusic = document.querySelector('#bgAudio')!
        this.playMusic = document.querySelector('#playMusic')!
        this.musicImg = document.querySelector('.musicIcon')!
        this.musicImg.addEventListener('click', this.setMusic.bind(this))
    }

    init() {
        if (!this.isMusic) return
        this.bgMusic.currentTime = 0
        this.bgMusic.muted = false;
        setTimeout(() => {
            this.bgMusic.play()
        }, 200);
    }

    setMusic() {
        this.isMusic = !this.isMusic
        this.setMusicCom()
        this.archive()
    }
    
    setMusicCom() {
        if (this.isMusic) {
            this.musicImg.src = normalIcon
            this.musicImg.style.animationPlayState = 'running'
            setTimeout(() => {
                this.bgMusic.play()
            }, 200);
          } else {
            this.bgMusic.pause()
            this.musicImg.src = stopIcon
            this.musicImg.style.animationPlayState = 'paused'
        }
    }

    eatMusic() {
        this.play('./mp3/eat.mp3')
    }

    over() {
        if (!this.isMusic) return
        this.bgMusic.pause()
        this.play('./mp3/hint.mp3')
        setTimeout(() => {
            this.play('./mp3/over.mp3')
        }, 500);
    }

    setBgMusicSpeed(speed: number) {
        if (!this.isMusic) return
        this.bgMusic.playbackRate = speed
    }

    play(src: string) {
        if (!this.isMusic) return
        this.playMusic.src = src
        this.playMusic.oncanplaythrough = () => {
            this.playMusic.play()
        }
    }

    // 存档
    archive() {
        localStorage.setItem(MUSICSTATE, String(this.isMusic))
    }
    // 清档
    clearArchive() {
        localStorage.removeItem(MUSICSTATE)
    }
    // 还原
    archiveRestore() {
        this.isMusic = localStorage.getItem(MUSICSTATE)! === 'true' ? true : false
        this.setMusicCom()
    }

}

export default Music