```js
const PENDING = 'pending';
const FULFULLED = 'fulfilled'
const REJECTED = 'rejected';

class Promise{
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
}
```



