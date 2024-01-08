module.exports = {
    // plugins: [require('autoprefixer')]
    plugins: {
        autoprefixer: {},
        "postcss-px-to-viewport": {
            // var parsedVal = toFixed((pixels / viewportSize * 100), opts.unitPrecision);
            // 转换源码，除以viewportWidth然后再乘100，我们使用rem，跟的字体大小设置为100px，所以viewportWidth设置为10000，按照375px宽的尺寸正常书写px
            // 按照转换公式，360px宽度会被转换为3.6rem，结局问题~
            unitToConvert: "px", // 要转化的单位
            viewportWidth: 10000, // UI设计稿的宽度
            unitPrecision: 5, // 转换后的精度，即小数点位数
            propList: ["*"], // 指定转换的css属性的单位，*代表全部css属性的单位都进行转换
            viewportUnit: "rem", // 指定需要转换成的视窗单位，默认vw
            fontViewportUnit: "rem",
            replace: true, // 是否转换后直接更换属性值
            exclude: [/node_modules/], // 设置忽略文件，用正则做目录名匹配
        }
    }
};
// 7.2.6

