
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
        this.play('./mp3/eat.mp3')
    }

    over() {
        this.bgMusic.pause()
        this.play('./mp3/hint.mp3')
        setTimeout(() => {
            this.play('./mp3/over.mp3')
        }, 500);
    }

    setBgMusicSpeed(speed: number) {
        this.bgMusic.playbackRate = speed
    }

    play(src: string) {
        this.playMusic.src = src
        this.playMusic.oncanplaythrough = () => {
            this.playMusic.play()
        }
    }

}

export default Music