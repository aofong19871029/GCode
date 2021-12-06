## 前端工程化

1. 图片

![前端工程化](./webApp.drawio.png)





htmlwebplugin

面试题， 版本控制如何做，如何处理

锁依赖来锁版本 script





面试题: 静态文件的移动 or 复制如何处理

用: copywebpackplugin



面试题: 为何我们在项目中引入模块时，有时候不需要写.vue .js .json这种尾缀

因为webpack  reolve.extensions 声明了



面试题：面对不同类型文件如何做不同的loader引入以及配置

根据不同的文件后缀加loaders



面试题： 如何针对文件夹，做指定打包处理

webpack module.rules. include



面试题:  如何针对相同类型的loader 做不同的配置路径，配置名输出

通过webpack.modules.rules.options.name 输出到不同的路径



## loaders	

loader本质是导出函数的javascript模块, 可用于内容转换.

loaders 用来处理具体文件类型的逻辑分支

该函数支持以下3个参数



```js
/**
 * 
 * @param {string|Buffer} content 源文件内容
 * @param {object} map 可以被https://github.com/mozilla/source-map 使用的 SourceMap 数据
 * @param {any } meta 数据，可以是任何内容
 */
module.exports = function(content, map, meta) {
    console.log('babelLoader: ', map, meta)
    // 获取传参
    const _options = getOptions(this) || {};

    validate(schema, _options, {
        name: 'babelLoader'
    })

    const callback = this.async();

    // 执行翻译
    _transform(content, _options)
        .then(({code, map}) => callback(null, code, map, meta))
        .catch(e => callback(e));
}
```

### normal loader和pitch loader

![前端工程化](https://www.teqng.com/wp-content/uploads/2021/08/wxsync-2021-08-7cddce2290b005768bbb3a0e060bdc0a.jpeg)

```js
const { getOptions } = require('loader-utils');
const { validate } = require('schema-utils');

const schema = require('./schema.json');

// 这种是normal loader
module.exports = function(content, map, meta) {
    const _options = getOptions(this);

    console.log('im ' + _options.name);

    validate(schema, _options, {
        name: "loaderKing"
    })

    return content;
}

// exports.pitch是pitch loader
// pitch可以做正序逻辑
/**
 * @remainingRequest 剩余请求
 * @precedingRequest 前置请求
 * @data 数据对象
 *
 * 其中 data 参数，可以用于数据传递。即在 pitch 函数中往 data 对象上添加数据，之后在 normal 函数中通过 this.data 的方式读取已添加的数据。
 */
module.exports.pitch = function(remainingRequest, precedingRequest, data) {
    console.log('pitch C');
}
```

loaders 是管道式执行，顺序是倒序， pitch可以做正序执行逻辑



