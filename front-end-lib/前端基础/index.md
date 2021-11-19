### 变量提升

let 和const  在自身所在作用域中， 声明语句之前构建一个暂时性死区（TDZ），如果在声明前访问let const变量会抛出ReferenceError



与let, const相比较

var 是直接默认值为undefined