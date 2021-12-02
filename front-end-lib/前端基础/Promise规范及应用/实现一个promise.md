# 一步一步实现Promise

36：31

1. 平时用promise的适合，是new Promise()

```js
class Promise{
    constructor(){}
}
```



2. 定义3种状态

```js
const PENDING = 'pending';
const FULFULLED = 'fulfilled';
const REJECTED = 'rejected';
```

3. 设置promise的初始状态

```js
/* 状态，初始为pending */
this.status = PENDING;
/* fulfilled的值 */
this.value = null;
/* rejected的值 */
this.reason = null;
```

4. resolve 和 reject方法

   1. 这2个方法是用来更改status的，从Pending变成fulfilled或rejected
   2. value reason
   3. 状态改变时需要判断当前状态是不是pending

   ```js
   resolve(value){
           if(this.status === PENDING){
               this.value = value;
               this.status = FULFILLED;
           }
       }
       
       reject(reason){
           if(this.status === PENDING){
               this.reason = reaon;
               this.status = REJECTED;
           }
       }
   ```

   5. 咱们现在还缺少promise构造时的入参

      1. 入参是一个函数，函数接受resolve和reject两个参数
      2. 注意在初始化promise的适合，就要执行这个函数，并且任何报错都要reject出去

      ```js
        constructor(fn){
              /* 状态，初始为pending */
              this.status = PENDING;
      		/* fulfilled的值 */
              this.value = null;
              /* rejected的值 */
              this.reason = null;
      
              try{
                  fn(this.resolve.bind(this), this.reject.bind(this));
              } catch(e){
                  this.reject(e);
              }
          }
      ```

6. 接下来实现一个关键的then方法

   1. then 接收两个参数，onFulfilled和onRejected

   ```js
     then(onFulfilled, onRejected){
   ```

   2. 检查参数，做默认值处理

   ```js
    then(onFulfilled, onRejected){
           const realOnFulfilled = this.isFunction(onFulfilled) ? onFulfilled : (value)=>value;
           const realOnRejected = this.isFunction(onRejected) ? onRejected : (reason)=>reason;
       }
   ```

   3.  .then 返回是一个整体的promise, 所以咱们.then实现里先用promise来包一下

   ```js
   then(onFulfilled, onRejected){
           const realOnFulfilled = this.isFunction(onFulfilled) ? onFulfilled : (value)=>value;
           const realOnRejected = this.isFunction(onRejected) ? onRejected : (reason)=>reason;
   
           const promise2 = new MPromise((resolve, reject)=>{
               
           });
           return promise2;
       }
   ```

   4. 根据当前promise的状态, 调用不同的函数

   ```js
    then(onFulfilled, onRejected){
           const realOnFulfilled = this.isFunction(onFulfilled) ? onFulfilled : (value)=>value;
           const realOnRejected = this.isFunction(onRejected) ? onRejected : (reason)=>reason;
   
           const promise2 = new MPromise((resolve, reject)=>{
               switch(this.status){
                   case FULFULLED: {
                       realOnFulfilled();
                       break;
                   }
                   case REJECTED: {
                       realOnRejected();
                       break;
                   }
               }
           });
           return promise2;
       }
   ```

   5. 如果promise的状态不是同步改变，应该怎么去判断状态并且正确执行对应的回调

      1. 所以咱们要拿到callback, 并且在某个时机去执行他. 新建两个数组来分别存储成功和失败的回调

      ```js
       /** 成功状态的回调 */
      FULFILLED_CALLBACK_LIST = [];
      /** 失败状态的回调 */
      REJECTED_CALLBACK_LIST = [];
      
      then(onFulfilled, onRejected){
          const realOnFulfilled = this.isFunction(onFulfilled) ? onFulfilled : (value)=>value;
          const realOnRejected = this.isFunction(onRejected) ? onRejected : (reason)=>reason;
      
          const promise2 = new MPromise((resolve, reject)=>{
              switch(this.status){
                  case FULFULLED: {
                      realOnFulfilled();
                      break;
                  }
                  case REJECTED: {
                      realOnRejected();
                      break;
                  }
                  case PENDING: {
                      this.FULFILLED_CALLBACK_LIST.push(realOnFulfilled);
                      this.REJECTED_CALLBACK_LIST.push(realOnRejected);
                  }
              }
          });
          return promise2;
      }
      ```

      2. 什么时候去执行存储起来的回调？当status发生变化的时候.

      ```js
       get static(){
           return this._status;
       }
      
      set status(newState){
          this._status = newState;
      
          switch(newState){
              case FULFULLED: {
                  this.FULFILLED_CALLBACK_LIST.forEach(callback => {
                      callback(this.value);
                  })
                  break;
              }
              case REJECTED: {
                  this.REJECTED_CALLBACK_LIST.forEach(callback => {
                      callback(this.reason);
                  })
                  break;
              }
          }
      }
      ```

6. then的返回值, onFulfilled 或者 onRejecte执行报错, 就去reject掉

7. 如果返回值是一个x, 就调用resolvePromise

```js
 const fulfilledMicrotask = () => {
     try {
         const x = realOnFulfilled(this.value);
         this.resolvePromise(promise2, x, resolve, reject);
         realOnFulfilled(this.value);
     } catch (e) {
         reject(e);
     }
 }

 const rejectedMicrotask = () => {
     try {
         const x = realOnRejected(this.reason);
         this.resolvePromise(promise2, x, resolve, reject);
     } catch (e) {
         reject(e);
     }
 }
```

8. resolvePromise

```js
const PENDING = 'pending';
const FULFULLED = 'fulfilled'
const REJECTED = 'rejected';

class MPromise{
    /** 成功状态的回调 */
    FULFILLED_CALLBACK_LIST = [];
    /** 失败状态的回调 */
    REJECTED_CALLBACK_LIST = [];

    /** 私有变量，存储真正的status */
    _status = PENDING;

    constructor(fn){
        /* 状态，初始为pending */
        this.status = PENDING;
		/* fulfilled的值 */
        this.value = null;
        /* rejected的值 */
        this.reason = null;

        try{
            fn(this.resolve.bind(this), this.reject.bind(this));
        } catch(e){
            this.reject(e);
        }
    }

    get static(){
        return this._status;
    }

    set status(newState){
        this._status = newState;

        switch(newState){
            case FULFULLED: {
                this.FULFILLED_CALLBACK_LIST.forEach(callback => {
                    callback(this.value);
                })
                break;
            }
            case REJECTED: {
                this.REJECTED_CALLBACK_LIST.forEach(callback => {
                    callback(this.reason);
                })
                break;
            }
        }
    }
    
    resolve(value){
        if(this.status === PENDING){
            this.value = value;
            this.status = FULFULLED;
        }
    }
    
    reject(reason){
        if(this.status === PENDING){
            this.reason = reason;
            this.status = REJECTED;
        }
    }

    then(onFulfilled, onRejected){
        const realOnFulfilled = this.isFunction(onFulfilled) ? onFulfilled : (value)=>value;
        const realOnRejected = this.isFunction(onRejected) ? onRejected : (reason)=>reason;

        const promise2 = new MPromise((resolve, reject)=>{
            const fulfilledMicrotask = () => {
                try {
                    const x = realOnFulfilled(this.value);
                    this.resolvePromise(promise2, x, resolve, reject);
                    realOnFulfilled(this.value);
                } catch (e) {
                    reject(e);
                }
            }

            const rejectedMicrotask = () => {
                try {
                    const x = realOnRejected(this.reason);
                    this.resolvePromise(promise2, x, resolve, reject);
                } catch (e) {
                    reject(e);
                }
            }


            switch(this.status){
                case FULFULLED: {
                    fulfilledMicrotask();
                    break;
                }
                case REJECTED: {
                    rejectedMicrotask();
                    break;
                }
                case PENDING: {
                    // 如果是宏任务会有什么影响
                    this.FULFILLED_CALLBACK_LIST.push(realOnFulfilled);
                    this.REJECTED_CALLBACK_LIST.push(realOnRejected);
                }
            }
        });
        return promise2;
    }

    catch(onRejected){
        return this.then(null, onRejected);
    }

    resolvePromise(promise2, x, resolve, reject){
        // 如果promis2 和 x 相等，抛error, 为了防止死循环
        if(promise2 === x){
            return reject(new TypeError('The promise and return value are the same'))
        } 

        if(x instanceof MPromise) {
            queueMicrotask(()=> {
                x.then((y)=> {
                    this.resolvePromise(promise2, y, resolve, reject);
                }, reject);
            })
            
        } else if(typeof x === 'object' || this.isFunction(x)) {
            if(x == null) {
                return resolve(x);
            }

            let then = null;
            try {
                then = x.then;
            } catch(e){
                // 如果取x.then的值报错，那么以e为reason, reject promise
                return reject(e);
            }

            // 如果then是函数
            if(this.isFunction(then)) {
                let called = false;
                
                try {
                    then.call(
                        x,
                        (y) => {
                            if(called){
                                return;
                            }

                            called = true;
                            this.resolvePromise(promise2, y, resolve, reject);
                        },
                        (r) => {
                            if(called){
                                return;
                            }
                            called = true;
                            reject(r);
                        }
                    );
                } catch(error) {
                    if(called){
                        return;
                    }
                    reject(error);
                }

            } else {
                resolve(x);
            }

        } else {
            resolve(x);
        }
    }

    isFunction(param){
        return typeof param === 'function';
    }

    static resolve(value){
        if(value instanceof MPromise){
            return value;
        }

        return new MPromise(resolve=>resolve(value))
    }

    static reject(reason){
        if(value instanceof MPromise){
            return value;
        }

        return new MPromise((resolve, reject)=>reject(value))
    }
}


const test = new MPromise((resolve, reject) => {
    setTimeout(() => {
        resolve(111)
    }, 1000);
}).then(console.log)
.catch(reason => {
    console.log(`reason = ${reason}`)
})

console.log(test); // value: null

setTimeout(() => {
    console.log(test) // value: undefined 因为then方法没有返回值
}, 2000);
```

