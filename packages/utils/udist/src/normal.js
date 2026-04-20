/**
 * 生成随机整数
 * @param min - 最小值（包含）
 * @param max - 最大值（包含）
 * @returns 随机整数
 */
export function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
/**
 * 节流函数
 * @param func - 要节流的函数
 * @param wait - 等待时间（毫秒）
 * @returns 节流后的函数
 */
export function throttle(func, wait) {
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
        }
        else if (!timeout) {
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
 * @param func - 要防抖的函数
 * @param wait - 等待时间（毫秒）
 * @returns 防抖后的函数
 */
export function debounce(func, wait) {
    let timeout;
    return function (...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
}
