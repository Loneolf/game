// 游戏通用工具函数

/**
 * 存档抽象类
 * 蛇类、音乐类、分数类、控制类都需要实现存档功能
 */
class ArchiveClass {
	/**
	 * 存档当前状态
	 */
	archive() {
		throw new Error("archive method must be implemented");
	}

	/**
	 * 清除存档
	 */
	clearArchive() {
		throw new Error("clearArchive method must be implemented");
	}

	/**
	 * 从存档恢复状态
	 */
	archiveRestore() {
		throw new Error("archiveRestore method must be implemented");
	}
}

/**
 * 默认根元素字体大小
 * @type {number}
 */
const DEFAULT_FONT_SIZE = 100;

/**
 * 相对于根元素100px，将px转化为rem
 * @param {number} px - 像素值
 * @returns {number} rem值
 */
function pxToRem(px) {
	return px / DEFAULT_FONT_SIZE;
}

/**
 * 根元素100px情况下，将rem转化为px
 * @param {number} rem - rem值
 * @returns {number} 像素值
 */
function remToPx(rem) {
	return rem * DEFAULT_FONT_SIZE;
}

/**
 * 获取相对于根元素100的尺寸
 * @param {number} originSize - 原始尺寸
 * @returns {number} 实际尺寸
 */
function realSize(originSize) {
	if (typeof window === "undefined" || !window.gfontSize) {
		return originSize;
	}
	return originSize / (window.gfontSize / DEFAULT_FONT_SIZE);
}

/**
 * 将像素位置转化为rem
 * 因为使用rem布局，获取的尺寸会有些许误差，需要转化为对应的rem计算
 * @param {number} px - 像素值
 * @returns {number} rem值（0.1的整倍数）
 */
function getRealRem(px) {
	if (typeof window === "undefined" || !window.gfontSize) {
		return px / DEFAULT_FONT_SIZE;
	}
	return Math.round((px / window.gfontSize) * 10) / 10;
}

/**
 * 生成随机整数
 * @param {number} min - 最小值（包含）
 * @param {number} max - 最大值（包含）
 * @returns {number} 随机整数
 */
function randomInt(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * 节流函数
 * @param {Function} func - 要节流的函数
 * @param {number} wait - 等待时间（毫秒）
 * @returns {Function} 节流后的函数
 */
function throttle(func, wait) {
	let timeout = null;
	let previous = 0;
	return function (...args) {
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
			}, remaining);
		}
	};
}

/**
 * 防抖函数
 * @param {Function} func - 要防抖的函数
 * @param {number} wait - 等待时间（毫秒）
 * @returns {Function} 防抖后的函数
 */
function debounce(func, wait) {
	let timeout;
	return function (...args) {
		clearTimeout(timeout);
		timeout = setTimeout(() => func.apply(this, args), wait);
	};
}

/**
 * 深拷贝对象
 * @param {any} obj - 要拷贝的对象
 * @returns {any} 拷贝后的对象
 */
function deepClone(obj) {
	if (obj === null || typeof obj !== "object") {
		return obj;
	}
	if (obj instanceof Date) {
		return new Date(obj.getTime());
	}
	if (Array.isArray(obj)) {
		return obj.map((item) => deepClone(item));
	}
	const cloned = {};
	for (const key in obj) {
		if (obj.hasOwnProperty(key)) {
			cloned[key] = deepClone(obj[key]);
		}
	}
	return cloned;
}

/**
 * 本地存储封装
 */
const storage = {
	/**
	 * 设置本地存储
	 * @param {string} key - 键名
	 * @param {any} value - 值
	 */
	set(key, value) {
		try {
			localStorage.setItem(key, JSON.stringify(value));
		} catch (e) {
			console.error("Storage set error:", e);
		}
	},

	/**
	 * 获取本地存储
	 * @param {string} key - 键名
	 * @param {any} defaultValue - 默认值
	 * @returns {any} 存储的值
	 */
	get(key, defaultValue = null) {
		try {
			const item = localStorage.getItem(key);
			return item ? JSON.parse(item) : defaultValue;
		} catch (e) {
			console.error("Storage get error:", e);
			return defaultValue;
		}
	},

	/**
	 * 移除本地存储
	 * @param {string} key - 键名
	 */
	remove(key) {
		try {
			localStorage.removeItem(key);
		} catch (e) {
			console.error("Storage remove error:", e);
		}
	},

	/**
	 * 清空本地存储
	 */
	clear() {
		try {
			localStorage.clear();
		} catch (e) {
			console.error("Storage clear error:", e);
		}
	},
};

module.exports = {
	ArchiveClass,
	DEFAULT_FONT_SIZE,
	pxToRem,
	remToPx,
	realSize,
	getRealRem,
	randomInt,
	throttle,
	debounce,
	deepClone,
	storage,
};
