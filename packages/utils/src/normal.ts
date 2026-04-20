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