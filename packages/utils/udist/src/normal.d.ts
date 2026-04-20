/**
 * 生成随机整数
 * @param min - 最小值（包含）
 * @param max - 最大值（包含）
 * @returns 随机整数
 */
export declare function randomInt(min: number, max: number): number;
/**
 * 节流函数
 * @param func - 要节流的函数
 * @param wait - 等待时间（毫秒）
 * @returns 节流后的函数
 */
export declare function throttle<T extends (...args: any[]) => any>(func: T, wait: number): T;
/**
 * 防抖函数
 * @param func - 要防抖的函数
 * @param wait - 等待时间（毫秒）
 * @returns 防抖后的函数
 */
export declare function debounce<T extends (...args: any[]) => any>(func: T, wait: number): T;
