const { getOptions } = require('loader-utils');
const { validate } = require('schema-utils');
const babel = require('@babel/core');
const util = require('util');

const schema = require('./schema.json');
// const { module } = require('../webpack.base.conf');

const _transform = util.promisify(babel.transform);

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

module.exports.pitch = function (remainingRequest, precedingRequest, data) {
    debugger
    console.log("开始执行aLoader Pitching Loader");
    console.log(remainingRequest, precedingRequest, data)
  };