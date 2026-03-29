/**
 * 游戏配置常量
 * 集中管理所有游戏配置参数
 */

import { GameConfig } from '../types/tetris.types';

/**
 * 游戏配置
 */
export const GAME_CONFIG: GameConfig = {
	/** 棋盘宽度（格子数） */
	boardWidth: 10,
	/** 棋盘高度（格子数） */
	boardHeight: 20,
	/** 每个格子的像素大小 */
	cellSize: 20,
	/** 基础下落间隔（毫秒） */
	baseDropInterval: 1000,
	/** 最小下落间隔（毫秒） */
	minDropInterval: 100,
	/** 每级速度减少量（毫秒） */
	speedDecreasePerLevel: 50,
};

/**
 * 分数配置
 */
export const SCORE_CONFIG = {
	/** 消除行数对应的分数 */
	lineScores: {
		1: 100,   // 消除1行
		2: 300,   // 消除2行
		3: 500,   // 消除3行
		4: 800,   // 消除4行（Tetris）
	},
	/** 升级所需的消除行数 */
	linesPerLevel: 10,
} as const;

/**
 * 控制配置
 */
export const CONTROL_CONFIG = {
	/** 键盘按键重复延迟（毫秒） */
	keyRepeatDelay: 100,
	/** DAS (Delayed Auto Shift) 首次延迟（毫秒） */
	dasDelay: 170,
	/** DAS 重复间隔（毫秒） */
	dasRepeat: 50,
	/** 触摸滑动阈值（像素） */
	swipeThreshold: 30,
	/** 快速下滑判定时间（毫秒） */
	quickDropTime: 300,
} as const;

/**
 * 渲染配置
 */
export const RENDER_CONFIG = {
	/** 是否启用脏矩形渲染 */
	enableDirtyRect: true,
	/** Ghost Piece 透明度 */
	ghostOpacity: 0.3,
	/** 方块高光透明度 */
	highlightOpacity: 0.3,
	/** 方块阴影透明度 */
	shadowOpacity: 0.3,
	/** 消除动画持续时间（毫秒） */
	clearAnimationDuration: 200,
} as const;
