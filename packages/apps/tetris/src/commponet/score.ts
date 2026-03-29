/**
 * 分数管理类
 * 负责游戏分数、等级、消除行数的计算和显示
 */
import { TETRISSCORE, TETRISLEVEL, TETRISLINES } from './config';

export default class Score {
	/** 当前分数 */
	score: number = 0;
    
	/** 当前等级 */
	level: number = 1;
    
	/** 总消除行数 */
	lines: number = 0;
    
	/** 分数显示元素 */
	scoreEL: HTMLElement | null = null;
    
	/** 等级显示元素 */
	levelEL: HTMLElement | null = null;
    
	/** 消除行数显示元素 */
	linesEL: HTMLElement | null = null;

	/**
     * 构造函数
     * 获取DOM元素引用
     */
	constructor() {
		this.scoreEL = document.querySelector('#score')!;
		this.levelEL = document.querySelector('#level')!;
		this.linesEL = document.querySelector('#lines')!;
	}

	/**
     * 初始化
     * 从存档恢复分数数据
     */
	init() {
		this.archiveRestore();
	}

	/**
     * 添加分数
     * 根据消除行数计算分数，更新等级
     * @param lines - 本次消除的行数（1-4行）
     */
	addScore(lines: number) {
		// 分数规则：1行100分，2行300分，3行500分，4行800分
		const scoreMap = {1: 100, 2: 300, 3: 500, 4: 800};
        
		this.score += scoreMap[lines] || 0;
		this.lines += lines;
        
		// 每消除10行升一级
		this.level = Math.floor(this.lines / 10) + 1;
        
		this.updateUI();
		this.archive();
	}

	/**
     * 更新UI显示
     * 将分数、等级、消除行数显示到页面上
     */
	updateUI() {
		if (this.scoreEL) this.scoreEL.innerText = `${this.score}`;
		if (this.levelEL) this.levelEL.innerText = `${this.level}`;
		if (this.linesEL) this.linesEL.innerText = `${this.lines}`;
	}

	/**
     * 保存分数数据到本地存储
     */
	archive() {
		localStorage.setItem(TETRISSCORE, JSON.stringify(this.score));
		localStorage.setItem(TETRISLEVEL, JSON.stringify(this.level));
		localStorage.setItem(TETRISLINES, JSON.stringify(this.lines));
	}

	/**
     * 从本地存储恢复分数数据
     */
	archiveRestore() {
		try {
			const score = JSON.parse(localStorage.getItem(TETRISSCORE)!);
			const level = JSON.parse(localStorage.getItem(TETRISLEVEL)!);
			const lines = JSON.parse(localStorage.getItem(TETRISLINES)!);
            
			if (score) this.score = score;
			if (level) this.level = level;
			if (lines) this.lines = lines;
            
			this.updateUI();
		} catch (error) {
			console.log('存档异常');
		}
	}

	/**
     * 清除本地存储的分数数据
     */
	clearArchive() {
		localStorage.removeItem(TETRISSCORE);
		localStorage.removeItem(TETRISLEVEL);
		localStorage.removeItem(TETRISLINES);
	}
}
