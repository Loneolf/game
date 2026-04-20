/**
 * 默认根元素字体大小
 */
export const DEFAULT_FONT_SIZE = 100;
/**
 * 获取根元素(html)的字体大小
 * @returns {number} 根元素的字体大小，单位为像素
 * @description 该函数用于获取当前页面根元素的实际字体大小，主要用于rem与px之间的转换计算。
 *              首先检查全局变量window.rem是否存在，如果存在则直接返回，
 *              否则通过getComputedStyle获取html元素的计算样式中的fontSize值，
 *              并转换为浮点数返回。如果转换结果为NaN，则返回默认值50px（兼容编译时的rootValue配置）。
 */
export function getRootFontSize() {
    var _a;
    // rootFontSize 缓存到 window.rem 中
    if (window.gfontSize)
        return window.gfontSize;
    const rootFontSize = parseFloat(((_a = getComputedStyle(document.documentElement)) === null || _a === void 0 ? void 0 : _a.fontSize) || '100px');
    window.gfontSize = rootFontSize;
    return rootFontSize;
}
/**
 * 相对于根元素100px，将px转化为rem
 * @param px - 像素值
 * @returns rem值
 */
export function pxToRem(px) {
    return px / DEFAULT_FONT_SIZE;
}
/**
 * 根元素100px情况下，将rem转化为px
 * @param rem - rem值
 * @returns 像素值
 */
export function remToPx(rem) {
    return rem * DEFAULT_FONT_SIZE;
}
/**
 * 获取相对于根元素100的尺寸
 * @param originSize - 原始尺寸
 * @returns 实际尺寸
 */
export function realSize(originSize) {
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
export function getRealRem(px) {
    if (typeof window === "undefined" || !window.gfontSize) {
        return px / DEFAULT_FONT_SIZE;
    }
    return Math.round((px / window.gfontSize) * 10) / 10;
}
