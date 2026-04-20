// 游戏通用工具函数

// 扩展 Window 接口以支持 gfontSize 属性
declare global {
  interface Window {
    gfontSize?: number;
  }
}

export * from "./archive/index";

export * from "./store/index";


/**
 * 默认根元素字体大小
 */
export const DEFAULT_FONT_SIZE: number = 100;

/**
 * 相对于根元素100px，将px转化为rem
 * @param px - 像素值
 * @returns rem值
 */
export function pxToRem(px: number): number {
	return px / DEFAULT_FONT_SIZE;
}

/**
 * 根元素100px情况下，将rem转化为px
 * @param rem - rem值
 * @returns 像素值
 */
export function remToPx(rem: number): number {
	return rem * DEFAULT_FONT_SIZE;
}

/**
 * 获取相对于根元素100的尺寸
 * @param originSize - 原始尺寸
 * @returns 实际尺寸
 */
export function realSize(originSize: number): number {
	if (typeof window === "undefined" || !window.gfontSize) {
		return originSize;
	}
	return originSize / (window.gfontSize / DEFAULT_FONT_SIZE);
}

/**
 * 将像素位置转化为rem
 * 因为使用rem布局，获取的尺寸会有些许误差，需要转化为对应的rem计算
 * @param px - 像素值
 * @returns rem值（0.1的整倍数）
 */
export function getRealRem(px: number): number {
	if (typeof window === "undefined" || !window.gfontSize) {
		return px / DEFAULT_FONT_SIZE;
	}
	return Math.round((px / window.gfontSize) * 10) / 10;
}

/**
 * 生成随机整数
 * @param min - 最小值（包含）
 * @param max - 最大值（包含）
 * @returns 随机整数
 */
export function randomInt(min: number, max: number): number {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * 节流函数
 * @param func - 要节流的函数
 * @param wait - 等待时间（毫秒）
 * @returns 节流后的函数
 */
export function throttle<T extends (...args: any[]) => any>(func: T, wait: number): T {
	let timeout: number | null = null;
	let previous = 0;
	return function(this: any, ...args: any[]) {
		const now = Date.now();
		const remaining = wait - (now - previous);
		if (remaining <= 0 || remaining > wait) {
			if (timeout) {
				clearTimeout(timeout);
				timeout = null;
			}
			previous = now;
			func.apply(this, args);
		} else if (!timeout) {
			timeout = setTimeout(() => {
				previous = Date.now();
				timeout = null;
				func.apply(this, args);
			}, remaining) as unknown as number;
		}
	} as T;
}

/**
 * 防抖函数
 * @param func - 要防抖的函数
 * @param wait - 等待时间（毫秒）
 * @returns 防抖后的函数
 */
export function debounce<T extends (...args: any[]) => any>(func: T, wait: number): T {
	let timeout: number | undefined;
	return function(this: any, ...args: any[]) {
		clearTimeout(timeout);
		timeout = setTimeout(() => func.apply(this, args), wait) as unknown as number;
	} as T;
}

/**
 * 深拷贝对象
 * @param obj - 要拷贝的对象
 * @returns 拷贝后的对象
 */
export function deepClone<T>(obj: T): T {
	if (obj === null || typeof obj !== "object") {
		return obj;
	}
	if (obj instanceof Date) {
		return new Date(obj.getTime()) as unknown as T;
	}
	if (Array.isArray(obj)) {
		return obj.map((item) => deepClone(item)) as unknown as T;
	}
	const cloned: Record<string, any> = {};
	for (const key in obj) {
		if (Object.prototype.hasOwnProperty.call(obj, key)) {
			cloned[key] = deepClone(obj[key]);
		}
	}
	return cloned as T;
}