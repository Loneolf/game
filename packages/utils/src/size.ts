
// 扩展 Window 接口以支持 gfontSize 属性
declare global {
	interface Window {
		gfontSize?: number;
	}
}
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