## 符合Promise A+规范的Promise实现

```js
const PENDING = 'pending';
const FULFULLED = 'fulfilled'
const REJECTED = 'rejected';

class MPromise {
    /** 成功状态的回调 */
    FULFILLED_CALLBACK_LIST = [];
    /** 失败状态的回调 */
    REJECTED_CALLBACK_LIST = [];

    /** 私有变量，存储真正的status */
    _status = PENDING;

    constructor(fn) {
        /* 状态，初始为pending */
        this.status = PENDING;
        /* fulfilled的值 */
        this.value = null;
        /* rejected的值 */
        this.reason = null;

        try {
            fn(this.resolve.bind(this), this.reject.bind(this));
        } catch (e) {
            this.reject(e);
        }
    }

    get status() {
        return this._status;
    }

    set status(newState) {
        this._status = newState;

        switch (newState) {
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

    resolve(value) {
        if (this.status === PENDING) {
            this.value = value;
            this.status = FULFULLED;
        }
    }

    reject(reason) {
        if (this.status === PENDING) {
            this.reason = reason;
            this.status = REJECTED;
        }
    }

    then(onFulfilled, onRejected) {
        const realOnFulfilled = this.isFunction(onFulfilled) ? onFulfilled : (value) => value;
        const realOnRejected = this.isFunction(onRejected) ? onRejected : (reason) => reason;

        const promise2 = new MPromise((resolve, reject) => {
            const fulfilledMicrotask = () => {
                queueMicrotask(() => {
                    try {
                        const x = realOnFulfilled(this.value);
                        this.resolvePromise(promise2, x, resolve, reject);
                        realOnFulfilled(this.value);
                    } catch (e) {
                        reject(e);
                    }
                });
            }

            const rejectedMicrotask = () => {
                queueMicrotask(() => {
                    try {
                        const x = realOnRejected(this.reason);
                        this.resolvePromise(promise2, x, resolve, reject);
                    } catch (e) {
                        reject(e);
                    }
                });
            }


            switch (this.status) {
                case FULFULLED: {
                    fulfilledMicrotask();
                    break;
                }
                case REJECTED: {
                    rejectedMicrotask();
                    break;
                }
                case PENDING: {
                    // 如果是宏任务会有什么影响?
                    this.FULFILLED_CALLBACK_LIST.push(fulfilledMicrotask);
                    this.REJECTED_CALLBACK_LIST.push(rejectedMicrotask);
                }
            }
        });
        return promise2;
    }

    catch(onRejected) {
        return this.then(null, onRejected);
    }

    resolvePromise(promise2, x, resolve, reject) {
        // 如果promis2 和 x 相等，抛error, 为了防止死循环
        if (promise2 === x) {
            return reject(new TypeError('The promise and return value are the same'))
        }

        if (x instanceof MPromise) {
            queueMicrotask(() => {
                x.then((y) => {
                    this.resolvePromise(promise2, y, resolve, reject);
                }, reject);
            })

        } else if (typeof x === 'object' || this.isFunction(x)) {
            if (x == null) {
                return resolve(x);
            }

            let then = null;
            try {
                then = x.then;
            } catch (e) {
                // 如果取x.then的值报错，那么以e为reason, reject promise
                return reject(e);
            }

            // 如果then是函数
            if (this.isFunction(then)) {
                let called = false;

                try {
                    then.call(
                        x,
                        (y) => {
                            if (called) {
                                return;
                            }

                            called = true;
                            this.resolvePromise(promise2, y, resolve, reject);
                        },
                        (r) => {
                            if (called) {
                                return;
                            }
                            called = true;
                            reject(r);
                        }
                    );
                } catch (error) {
                    if (called) {
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

    isFunction(param) {
        return typeof param === 'function';
    }

    static resolve(value) {
        if (value instanceof MPromise) {
            return value;
        }

        return new MPromise(resolve => resolve(value))
    }

    static reject(reason) {
        if (value instanceof MPromise) {
            return value;
        }

        return new MPromise((resolve, reject) => reject(value))
    }

    static race(promiseList) {
        return new MPromise((resolve, reject) => {
            const length = promiseList.length;

            if (length === 0) {
                return resolve();
            } else {
                for (let i = 0; i < length; i++) {
                    MPromise.resolve(promiseList[i])
                        .then(value => {
                            resolve(value);
                        })
                        .catch(reason => {
                            reject(reason)
                        })
                }
            }
        })
    }

    static _isMPromise(obj) {
        return !!obj && (typeof obj === 'object' || typeof obj === 'function') && typeof obj.then === 'function';
    }

    static all(promiseList) {
        const result = new Array(promiseList);
        let resolveCount = 0;
        return new Promise((resolve, reject) => {
            for (let i = 0; i < promiseList.length; i++) {
                if (MPromise._isMPromise(promiseList[i])) {
                    promiseList[i].then(data => {
                        result[i] = data;
                        resolveCount++;
                        if (resolveCount == promiseList.length) {
                            resolve(result);
                        }
                    }, (reason) => reject(reason))
                } else {
                    resolveCount++;
                    result[i] = promiseList[i];
                }
            }

            // 全部非promise + 同步promise组成
            if (resolveCount === promiseList.length) {
                resolve(result);
            }
        });
    }

    static allSettled(promiseList) {
        const result = new Array(promiseList);
        let resolveCount = 0;
        return new Promise((resolve, reject) => {
            for (let i = 0; i < promiseList.length; i++) {
                if (MPromise._isMPromise(promiseList[i])) {
                    promiseList[i].then(data => {
                        result[i] = data;
                        resolveCount++;
                        if (resolveCount == promiseList.length) {
                            resolve(result);
                        }
                    }, (reason) => {
                        result[i] = reason;
                        resolveCount++;
                        if (resolveCount == promiseList.length) {
                            resolve(result);
                        }
                    })
                } else {
                    resolveCount++;
                    result[i] = promiseList[i];
                }
            }

            // 全部非promise + 同步promise组成
            if (resolveCount === promiseList.length) {
                resolve(result);
            }
        });
    }
}
```

