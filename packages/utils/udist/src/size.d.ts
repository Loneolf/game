/**
 * 默认根元素字体大小
 */
export declare const DEFAULT_FONT_SIZE: number;
declare global {
    interface Window {
        gfontSize?: number;
    }
}
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
