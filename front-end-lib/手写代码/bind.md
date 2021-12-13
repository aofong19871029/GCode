###  call
```js
// call
Function.prototype.call = function (context, ...args) {
  context = context || window;
  
  const fnSymbol = Symbol("fn");
  context[fnSymbol] = this;
  
  context[fnSymbol](...args);
  delete context[fnSymbol];
}
```

### apply
```js
Function.prototype.apply = function (context, argsArr) {
  context = context || window;
  
  const fnSymbol = Symbol("fn");
  context[fnSymbol] = this;
  
  context[fnSymbol](...argsArr);
  delete context[fnSymbol];
}
```
### bind
```js
if (!Function.prototype.bind) {
	Function.prototype.bind = function(oThis) {
		if (typeof this !== 'function') {
			// closest thing possible to the ECMAScript 5      // internal IsCallable function      
			throw new TypeError('Function.prototype.bind - what is trying to be bound is not callable');
		}
		var aArgs = Array.prototype.slice.call(arguments, 1),
		//这    lbljbl里的arguments是跟oThis一起传进来的实参      
		fToBind = this,
		fNOP = function() {},
		fBound = function() {
			return fToBind.apply(this instanceof fNOP ? this: oThis, // 获取调用时(fBound)的传参.bind 返回的函数入参往往是这么传递的          
			aArgs.concat(Array.prototype.slice.call(arguments)));
		}; // 维护原型关系 
		if (this.prototype) { // Function.prototype doesn't have a prototype property  
			fNOP.prototype = this.prototype;
		}
		fBound.prototype = new fNOP();
		return fBound;
	};
}
```