/**
 * 音乐管理类
 * 负责背景音乐和音效的播放控制
 */

export default class Music {
	/** 背景音乐音频元素 */
	bgMusic: HTMLAudioElement;
    
	/** 音效音频元素 */
	playMusic: HTMLAudioElement;
    
	/** 是否正在播放 */
	isPlay: boolean = false;
    
	/** 音效缓存 */
	private audioCache: Map<string, HTMLAudioElement> = new Map();

	/**
     * 构造函数
     * 获取音频元素引用，预加载音效
     */
	constructor() {
		this.bgMusic = document.querySelector('#bgAudio')!;
		this.playMusic = document.querySelector('#playMusic')!;
        
		// 预加载音效
		this.preloadSounds();
	}

	/**
     * 预加载所有音效文件
     */
	private preloadSounds(): void {
		const sounds = ['eat', 'over', 'rotate', 'move', 'drop', 'hold'];
        
		sounds.forEach(name => {
			const audio = new Audio(`./mp3/${name}.mp3`);
			audio.load();
			this.audioCache.set(name, audio);
		});
	}

	/**
     * 初始化
     * 从存档恢复播放状态，开始播放背景音乐
     */
	init() {
		this.archiveRestore();
		// 播放背景音乐（捕获自动播放限制错误）
		this.bgMusic.play().catch(() => {});
	}

	/**
     * 播放消除音效
     * 当消除行时调用
     */
	eatMusic() {
		this.playSound('eat');
	}

	/**
     * 游戏结束音效
     * 暂停背景音乐，播放结束音效
     */
	over() {
		this.bgMusic.pause();
		this.playSound('over');
	}

	/**
     * 旋转音效
     */
	rotateMusic() {
		this.playSound('rotate');
	}

	/**
     * 移动音效
     */
	moveMusic() {
		this.playSound('move');
	}

	/**
     * 硬降音效
     */
	dropMusic() {
		this.playSound('drop');
	}

	/**
     * 暂存音效
     */
	holdMusic() {
		this.playSound('hold');
	}

	/**
     * 播放指定音效
     * @param name - 音效名称
     */
	private playSound(name: string): void {
		// 优先使用缓存的音频
		const cachedAudio = this.audioCache.get(name);
		if (cachedAudio) {
			cachedAudio.currentTime = 0;
			cachedAudio.play().catch(() => {});
		} else {
			// 降级方案：使用playMusic元素
			this.playMusic.src = `./mp3/${name}.mp3`;
			this.playMusic.play().catch(() => {});
		}
	}

	/**
     * 设置背景音乐播放速度
     * @param speed - 播放速度倍率（1.0为正常速度）
     */
	setBgMusicSpeed(speed: number) {
		this.bgMusic.playbackRate = speed;
	}

	/**
     * 保存播放状态到本地存储
     */
	archive() {
		localStorage.setItem('TETRISMUSIC', JSON.stringify(this.isPlay));
	}

	/**
     * 从本地存储恢复播放状态
     */
	archiveRestore() {
		try {
			const isPlay = JSON.parse(localStorage.getItem('TETRISMUSIC')!);
			this.isPlay = isPlay || false;
		} catch (error) {
			console.log('音乐存档异常');
		}
	}
}
