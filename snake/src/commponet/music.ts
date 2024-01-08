
class Music {
    bgMusic: HTMLAudioElement;
    playMusic: HTMLAudioElement;

    constructor() {
        this.bgMusic = document.querySelector('#bgAudio')!
        this.playMusic = document.querySelector('#playMusic')!
    }

    init() {
        this.bgMusic.currentTime = 0
        this.bgMusic.muted = false;
        setTimeout(() => {
            this.bgMusic.play()
        }, 200);
    }

    eatMusic() {
        this.playMusic.src = './mp3/eat.mp3'
        this.playMusic.play()
    }

    over() {
        this.bgMusic.pause()
        this.playMusic.src = './mp3/hint.mp3'
        this.playMusic.play()
        setTimeout(() => {
            this.playMusic.src = './mp3/over.mp3'
            this.playMusic.play()
        }, 500);
    }

    setBgMusicSpeed(speed: number) {
        this.bgMusic.playbackRate = speed
    }

}

export default Music