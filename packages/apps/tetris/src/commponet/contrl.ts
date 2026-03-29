/**
 * 游戏控制器类
 * 负责游戏的主循环、用户输入处理、游戏状态管理
 */

import ArchiveClass from '@u/archiveClass';
import { GAME_CONFIG, CONTROL_CONFIG } from '../config/game.config';
import { TouchEventData } from '../types/tetris.types';
import { TETRISSTATE, GETINFO_EVENT, RECEIVE_INFO_EVENT_MUSIC } from './config';
import Music from './music';
import Score from './score';
import Tetris from './tetris';

class Contrl implements ArchiveClass{
	/** 俄罗斯方块游戏实例 */
	tetris: Tetris;
    
	/** 分数管理实例 */
	score: Score;
    
	/** 音乐管理实例 */
	music: Music;
    
	/** 游戏是否正在进行中 */
	isLive: boolean = false;
    
	/** 游戏是否暂停 */
	isStop: boolean = false;
    
	/** 游戏是否结束 */
	isGameOver: boolean = false;
    
	/** 方向控制按钮容器 */
	dirEL: HTMLElement | null = null;
    
	/** 开始/重新开始按钮 */
	liveOptEL: HTMLElement | null = null;
    
	/** 暂停/继续按钮 */
	pauseEL: HTMLElement | null = null;
    
	/** 游戏循环的requestAnimationFrame ID */
	gameLoop: number | null = null;
    
	/** 方块下落间隔（毫秒） */
	dropInterval: number = GAME_CONFIG.baseDropInterval;
    
	/** 上次方块下落的时间戳 */
	lastDropTime: number = 0;
    
	/** 触摸事件数据 */
	private touchData: TouchEventData | null = null;
    
	/** 按键状态映射 */
	private keyStates: Map<string, boolean> = new Map();
    
	/** 上次按键时间 */
	private lastKeyTime: number = 0;
    
	/** FPS 计数器 */
	private frameCount: number = 0;
    
	/** 上次 FPS 更新时间 */
	private lastFpsUpdate: number = 0;
    
	/** 当前 FPS */
	private fps: number = 0;

	/**
     * 构造函数
     * 初始化游戏组件，绑定事件监听器，尝试恢复存档
     */
	constructor() {
		// 初始化游戏组件
		this.tetris = new Tetris();
		this.score = new Score();
		this.music = new Music();
        
		// 获取DOM元素
		this.dirEL = document.querySelector('#dirBox');
		this.liveOptEL = document.querySelector('#agin');
		this.pauseEL = document.querySelector('#pause');

		// 绑定触屏和鼠标事件（方向控制）
		if (this.dirEL) {
			this.dirEL.addEventListener('touchstart', this.clickHandle.bind(this));
			this.dirEL.addEventListener('mousedown', this.clickHandle.bind(this));
		}

		// 绑定开始按钮点击事件
		if (this.liveOptEL) {
			this.liveOptEL.addEventListener('click', () => this.start());
		}

		// 绑定暂停按钮点击事件
		if (this.pauseEL) {
			this.pauseEL.addEventListener('click', () => this.togglePause());
		}

		// 绑定键盘事件
		document.addEventListener('keydown', this.keyDownHandle.bind(this));
		document.addEventListener('keyup', this.keyUpHandle.bind(this));
        
		// 绑定触摸手势事件
		this.bindTouchGestures();
        
		// 尝试从本地存储恢复游戏状态
		this.archiveRestore();
        
		// 监听自定义事件（用于音乐组件获取游戏状态）
		document.addEventListener(GETINFO_EVENT, this.getInfoHandle.bind(this));
        
		// 初始绘制
		this.tetris.draw();
	}

	/**
     * 绑定触摸手势事件
     */
	private bindTouchGestures(): void {
		const gameContainer = document.querySelector('#game-container');
		if (!gameContainer) return;
        
		gameContainer.addEventListener('touchstart', this.handleTouchStart.bind(this), { passive: false });
		gameContainer.addEventListener('touchmove', this.handleTouchMove.bind(this), { passive: false });
		gameContainer.addEventListener('touchend', this.handleTouchEnd.bind(this), { passive: false });
	}

	/**
     * 处理触摸开始事件
     */
	private handleTouchStart(e: TouchEvent): void {
		if (e.touches.length === 1) {
			this.touchData = {
				startX: e.touches[0].clientX,
				startY: e.touches[0].clientY,
				startTime: performance.now()
			};
		}
	}

	/**
     * 处理触摸移动事件
     */
	private handleTouchMove(e: TouchEvent): void {
		e.preventDefault();
	}

	/**
     * 处理触摸结束事件（手势识别）
     */
	private handleTouchEnd(e: TouchEvent): void {
		if (!this.touchData || !this.isLive || this.isStop || this.isGameOver) {
			this.touchData = null;
			return;
		}
        
		const touch = e.changedTouches[0];
		const deltaX = touch.clientX - this.touchData.startX;
		const deltaY = touch.clientY - this.touchData.startY;
		const deltaTime = performance.now() - this.touchData.startTime;
        
		// 检测滑动方向
		if (Math.abs(deltaX) > CONTROL_CONFIG.swipeThreshold && Math.abs(deltaX) > Math.abs(deltaY)) {
			// 水平滑动
			if (deltaX > 0) {
				this.tetris.moveRight();
				this.music.moveMusic();
			} else {
				this.tetris.moveLeft();
				this.music.moveMusic();
			}
		} else if (deltaY > CONTROL_CONFIG.swipeThreshold * 1.5 && deltaTime < CONTROL_CONFIG.quickDropTime) {
			// 快速下滑 = 硬降
			this.tetris.hardDrop();
			this.music.dropMusic();
		} else if (deltaY > CONTROL_CONFIG.swipeThreshold) {
			// 慢速下滑 = 软降
			this.tetris.moveDown();
		} else if (Math.abs(deltaX) < 10 && Math.abs(deltaY) < 10 && deltaTime < 200) {
			// 点击检测 = 旋转
			this.tetris.rotate();
			this.music.rotateMusic();
		}
        
		this.tetris.draw();
		this.touchData = null;
	}

	/**
     * 处理自定义事件
     * 用于音乐组件获取游戏暂停状态
     * @param e - 自定义事件对象
     */
	getInfoHandle(e: any) {
		switch (e.detail) {
			case 'isStop':
				// 向音乐组件发送当前暂停状态
				const receveInfoEventMusic = new CustomEvent(RECEIVE_INFO_EVENT_MUSIC, {detail: this.isStop});
				document.dispatchEvent(receveInfoEventMusic);
				break;
			default:
				break;
		}
	}

	/**
     * 切换暂停状态
     * 暂停时保存游戏状态，继续时恢复
     */
	togglePause() {
		if (!this.isLive || this.isGameOver) return;
        
		this.isStop = !this.isStop;
        
		if (this.isStop) {
			// 暂停游戏
			this.music.bgMusic.pause();
			if (this.pauseEL) this.pauseEL.innerText = '继续';
			this.archive();  // 保存游戏状态
		} else {
			// 继续游戏
			this.music.bgMusic.play();
			if (this.pauseEL) this.pauseEL.innerText = '暂停';
			this.clearArchive();  // 清除存档
			this.lastDropTime = performance.now();  // 重置下落计时
		}
	}

	/**
     * 开始新游戏
     * 重置所有游戏状态，启动游戏循环
     */
	start() {
		// 如果游戏正在进行且未结束，不允许重新开始
		if (this.isLive && !this.isGameOver) return;
        
		// 重置游戏状态
		this.tetris.initBoard();
		this.score.init();
		this.music.init();
		this.isLive = true;
		this.isStop = false;
		this.isGameOver = false;
        
		// 更新按钮文本
		if (this.liveOptEL) this.liveOptEL.innerText = '重新开始';
		if (this.pauseEL) this.pauseEL.innerText = '暂停';
        
		// 生成第一个方块
		this.tetris.spawnPiece();
		this.tetris.draw();
        
		// 启动游戏循环
		this.lastDropTime = performance.now();
		this.gameLoop = requestAnimationFrame(this.update.bind(this));
	}

	/**
     * 游戏主循环
     * 使用requestAnimationFrame实现流畅的游戏循环
     * @param currentTime - 当前时间戳（由requestAnimationFrame提供）
     */
	update(currentTime: number) {
		// FPS 计算
		this.frameCount++;
		if (currentTime - this.lastFpsUpdate >= 1000) {
			this.fps = this.frameCount;
			this.frameCount = 0;
			this.lastFpsUpdate = currentTime;
		}
        
		// 如果游戏未开始或已暂停，继续循环但不更新
		if (!this.isLive || this.isStop) {
			this.gameLoop = requestAnimationFrame(this.update.bind(this));
			return;
		}

		// 计算距离上次下落的时间
		const deltaTime = currentTime - this.lastDropTime;
		const speed = this.getSpeed();

		// 达到下落时间间隔时执行下落
		if (deltaTime >= speed) {
			// 尝试下落
			if (!this.tetris.moveDown()) {
				// 无法下落，锁定方块
				this.tetris.lockPiece();
                
				// 检查并清除已填满的行
				const linesCleared = this.tetris.clearLines();
				if (linesCleared > 0) {
					this.score.addScore(linesCleared);
					this.music.eatMusic();
				}
                
				// 生成新方块，如果失败则游戏结束
				if (!this.tetris.spawnPiece()) {
					this.gameOver();
					return;
				}
			}
			// 更新上次下落时间
			this.lastDropTime = currentTime;
		}

		// 绘制游戏画面
		this.tetris.draw();
        
		// 继续下一帧
		this.gameLoop = requestAnimationFrame(this.update.bind(this));
	}

	/**
     * 获取当前等级的下落速度
     * 等级越高，速度越快
     * @returns 下落间隔时间（毫秒）
     */
	getSpeed(): number {
		const level = this.score.level;
		const baseSpeed = GAME_CONFIG.baseDropInterval;
		const speedDecrease = GAME_CONFIG.speedDecreasePerLevel;
		const minSpeed = GAME_CONFIG.minDropInterval;
        
		const speed = baseSpeed - (level - 1) * speedDecrease;
		return Math.max(speed, minSpeed);
	}

	/**
     * 游戏结束处理
     * 停止游戏循环，播放结束音效，清除存档
     */
	gameOver() {
		this.isGameOver = true;
		this.isLive = false;
        
		// 播放游戏结束音效
		this.music.over();
        
		// 更新按钮文本
		if (this.liveOptEL) this.liveOptEL.innerText = '重新开始';
		if (this.pauseEL) this.pauseEL.innerText = '暂停';
        
		// 停止游戏循环
		if (this.gameLoop) {
			cancelAnimationFrame(this.gameLoop);
			this.gameLoop = null;
		}
        
		// 清除存档
		this.clearArchive();
	}

	/**
     * 保存游戏状态到本地存储
     */
	archive() {
		this.tetris.archive();
		this.score.archive();
		this.music.archive();
		localStorage.setItem(TETRISSTATE, JSON.stringify({ 
			isArchive: true,
			isGameOver: this.isGameOver,
		}));
	}

	/**
     * 清除本地存储的游戏状态
     */
	clearArchive() {
		localStorage.removeItem(TETRISSTATE);
		this.tetris.clearArchive();
		this.score.clearArchive();
	}

	/**
     * 从本地存储恢复游戏状态
     * 如果有有效的存档，恢复游戏进度
     */
	archiveRestore() {
		try {
			const archiveData: { isArchive: boolean, isGameOver: boolean } = JSON.parse(localStorage.getItem(TETRISSTATE)!);
            
			// 只有存在存档且不是游戏结束状态才恢复
			if (archiveData?.isArchive && !archiveData.isGameOver) {
				if (this.liveOptEL) this.liveOptEL.innerText = '继续';
				this.isLive = true;
				this.isStop = true;
				this.isGameOver = false;
                
				// 恢复各组件状态
				this.tetris.archiveRestore();
				this.score.archiveRestore();
				this.music.archiveRestore();
                
				// 重新绘制画面
				this.tetris.draw();
			}
		} catch (error) {
			console.log('存档异常');
		}
	}

	/**
     * 处理触屏和鼠标点击事件
     * @param e - 触摸或鼠标事件
     */
	clickHandle(e: TouchEvent | MouseEvent) {
		e.preventDefault();
		e.stopPropagation();
        
		const target = e.target as HTMLElement;
		const inner = target.innerText;
        
		// 游戏未开始、暂停或结束时，不处理方向控制
		if (!this.isLive || this.isStop || this.isGameOver) return;

		switch (inner) {
			case '←':
				this.tetris.moveLeft();
				this.music.moveMusic();
				this.tetris.draw();
				break;
			case '→':
				this.tetris.moveRight();
				this.music.moveMusic();
				this.tetris.draw();
				break;
			case '↓':
				// 手动下落后重置下落计时
				if (this.tetris.moveDown()) {
					this.lastDropTime = performance.now();
				}
				this.tetris.draw();
				break;
			case '↻':
				this.tetris.rotate();
				this.music.rotateMusic();
				this.tetris.draw();
				break;
		}
	}

	/**
     * 处理键盘按键按下事件
     * @param e - 键盘事件
     */
	keyDownHandle(e: KeyboardEvent) {
		// 只处理keydown事件
		if (e.type !== 'keydown') return;
        
		// 空格键：开始游戏或切换暂停
		if (e.code === 'Space') {
			e.preventDefault();
			if (!this.isLive || this.isGameOver) {
				this.start();
			} else {
				this.togglePause();
			}
			return;
		}
        
		// C键：暂存方块
		if (e.code === 'KeyC') {
			e.preventDefault();
			if (this.isLive && !this.isStop && !this.isGameOver) {
				this.tetris.hold();
				this.music.holdMusic();
				this.tetris.draw();
			}
			return;
		}
        
		// Shift键：硬降
		if (e.code === 'ShiftLeft' || e.code === 'ShiftRight') {
			e.preventDefault();
			if (this.isLive && !this.isStop && !this.isGameOver) {
				this.tetris.hardDrop();
				this.music.dropMusic();
				this.tetris.draw();
			}
			return;
		}

		// 游戏未开始、暂停或结束时，不处理方向控制
		if (!this.isLive || this.isStop || this.isGameOver) return;
        
		// 处理按键重复（DAS机制）
		if (e.repeat) {
			const now = performance.now();
			if (now - this.lastKeyTime < CONTROL_CONFIG.keyRepeatDelay) {
				return;
			}
			this.lastKeyTime = now;
		}

		switch (e.key) {
			case 'ArrowLeft':
				e.preventDefault();
				this.tetris.moveLeft();
				this.music.moveMusic();
				this.tetris.draw();
				break;
			case 'ArrowRight':
				e.preventDefault();
				this.tetris.moveRight();
				this.music.moveMusic();
				this.tetris.draw();
				break;
			case 'ArrowDown':
				e.preventDefault();
				// 手动下落后重置下落计时
				if (this.tetris.moveDown()) {
					this.lastDropTime = performance.now();
				}
				this.tetris.draw();
				break;
			case 'ArrowUp':
				e.preventDefault();
				this.tetris.rotate();
				this.music.rotateMusic();
				this.tetris.draw();
				break;
		}
	}

	/**
     * 处理键盘按键释放事件
     * @param e - 键盘事件
     */
	keyUpHandle(e: KeyboardEvent) {
		// 清除按键状态
		this.keyStates.delete(e.code);
	}
}

export default Contrl;
