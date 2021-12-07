### AMD、CMD、CommonJs、UMD，ES6 的对比

#### AMD、CMD、CommonJs 是 ES5 中提供的模块化编程的方案，import/export 是 ES6 中定义新增的

- CommonJS 规范是通过 module.exports 定义的，例如 Nodejs，即由服务端兴起

> eg:
```
const fs = require('fs');

module.exports = {}

exports.xxx = ...

```

CommonJS 加载模块是同步的，在服务端，依赖加载速度就是硬盘文件读取的速度，所以没什么问题，而客户端如果也使用此方案，就会出现加载模块过久，卡死的假象：

> eg:
```
const { concat } = require('string');

const newStr = concat('hello', 'word');
```
> 第二行代码就会一直等待加载完成才执行，因此必须使用一种异步加载的方案： AMD


- AMD（Asynchronous Module Definition）

采用异步方式加载模块，模块的加载不影响它后面语句的运行，以 RequireJS 为代表。
所有依赖这个模块的语句，都定义在一个回调函数中，等到加载完成之后，这个回调函数才会运行。
采用 require() 语句加载模块但是不同于 CommonJS，它要求两个参数，第一个参数 [module]，是一个数组，里面的成员就是要加载的模块；第二个参数 callback，则是加载成功之后的回调函数。

> eg:
``` 
require(['string'], function (string) {
  const newStr = string.concat('hello', 'word');
});

// 多模块，回调参数与模块顺序一致
require(['string', 'replace'], function (string, replace) {
  const newStr = string.concat('hello', 'word');
  replace(newStr, ...)
});

```


- CMD 是 SeaJS 在推广过程中对模块定义的规范化产出，SeaJS 是淘宝团队提供的一个模块开发的 js 框架。

通过 define() 定义，没有依赖前置，通过 require 加载 jQuery 插件，CMD 是依赖就近，在什么地方使用到插件就在什么地方 require 该插件，即用即返，这是一个同步的概念
> eg:
```

if (typeof define === 'function' && define.cmd) {
  //有 Sea.js 等 CMD 模块加载器存在
}

// define(id?, deps?, factory)，参数依次为模块标识，依赖项，回调函数
define('moduleName', ['jquery'], function(require, exports, module) {
  // 待
});


define(function(require, exports, module){
  // 这里用到了 jquery
  const $ = require('jquery');
  
  $('#app').click(e => {
    // 这里用到了 lodash
    const _ = require('lodash');
    ...
  })
  
});
``` 

- UMD 兼容 AMD 和 commonJS 规范的同时，还兼容全局引用的方式，浏览器或服务器环境均可使用

```
 // 无导入导出规范，常规写法，这里随手摘出一份源码可见端倪
 // node_modules/react/umd/react.development.js
 
 (function (global, factory) {
   typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
   typeof define === 'function' && define.amd ? define(['exports'], factory) :
   (global = global || self, factory(global.React = {}));
 }(this, (function (exports) {
   'use strict';
   ...
   exports.useReducer = useReducer;
   exports.useRef = useRef;
   exports.useState = useState;
   exports.version = ReactVersion;
 })))

```

- ES module，模块化---export/import 对模块进行导出导入的

> eg:
```
import React, { Component } from 'react';

export default function () {}

export const REACT = 'REACT';

```


### 模块的导出

假如，我们实现的模块为函数 test (没有其他的依赖)，为了在 node 环境运行，我们得这样导出

```
module.exports = test;
```

要支持 ES6 模块使用，得这样：

```
export default test;
```

在 CMD 环境下，这样实现 test：

```
define(function (require, exports, module) {
  exports.test = function test() {
    
  };
})
```

那么怎样才能写一份代码，然后运行在各种环境呢？

#### library 是一种方式


