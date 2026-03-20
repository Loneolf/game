/**
 * 存档抽象类
 * 蛇类、音乐类、分数类、控制类都需要实现存档功能
 */
export declare abstract class ArchiveClass {
	abstract archive(): void;
	abstract clearArchive(): void;
	abstract archiveRestore(): void;
}

/**
 * 默认根元素字体大小
 */
export declare const DEFAULT_FONT_SIZE: number;

/**
 * 相对于根元素100px，将px转化为rem
 * @param px - 像素值
 * @returns rem值
 */
export declare function pxToRem(px: number): number;

/**
 * 根元素100px情况下，将rem转化为px
 * @param rem - rem值
 * @returns 像素值
 */
export declare function remToPx(rem: number): number;

/**
 * 获取相对于根元素100的尺寸
 * @param originSize - 原始尺寸
 * @returns 实际尺寸
 */
export declare function realSize(originSize: number): number;

/**
 * 将像素位置转化为rem
 * 因为使用rem布局，获取的尺寸会有些许误差，需要转化为对应的rem计算
 * @param px - 像素值
 * @returns rem值（0.1的整倍数）
 */
export declare function getRealRem(px: number): number;

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
export declare function throttle<T extends (...args: any[]) => void>(
	func: T,
	wait: number
): T;

/**
 * 防抖函数
 * @param func - 要防抖的函数
 * @param wait - 等待时间（毫秒）
 * @returns 防抖后的函数
 */
export declare function debounce<T extends (...args: any[]) => void>(
	func: T,
	wait: number
): T;

/**
 * 深拷贝对象
 * @param obj - 要拷贝的对象
 * @returns 拷贝后的对象
 */
export declare function deepClone<T>(obj: T): T;

/**
 * 本地存储封装
 */
export declare const storage: {
	set(key: string, value: any): void;
	get<T = any>(key: string, defaultValue?: T): T;
	remove(key: string): void;
	clear(): void;
};
