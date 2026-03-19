// 获取全局的根元素字体大小
// 默认跟元素的fontSize为100
const defaultFS = 100 

// 相对于根元素100px，px转化为rem
export const pxToRem = function (px: number) {
    return px / defaultFS
}

// 根元素100px情况下，rem转化为px
export const remTopx = function (rem: number) {
    return rem * defaultFS
}

// 获取相对于根元素100的尺寸
export const realSize = function (originSize: number) {
    return originSize / (window.gfontSize / defaultFS)
}

// 将获取到的蛇、食物的位置转化为rem
// 因为使用rem布局，获取的尺寸会有些许误差，蛇运行到右侧或者底部误差会变大，需要转化为对应的rem计算
// 宽度300px转化为3rem，蛇每次移动10px为0.1rem，故转化为的rem需要为0.1的整倍数
export const getRealrem = function (px: number) {
    return Math.round((px / window.gfontSize) * 10) / 10
}