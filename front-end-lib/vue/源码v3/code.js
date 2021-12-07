const refValue = ref(0); // 包装基本值为一个类 15~29行

effect(function fn() { // 命名为 fn, 便于下文跟踪 46行
  console.log(refValue.value); // 21行
})

/* 模拟一个用户的动作 */ refValue.value++ // 触发 refValue 的 getter  25行

// 上面是开发者写的代码，按照顺序执行
// 背后的逻辑：

{
  let activeEffect;
  
  function ref (init) {
    class RefImpl {
      constructor(init) {
        this._value = init
      }
      get value() {
        trackRefValue(this); // 依赖收集   32行
        return this._value;
      }
      set value(newVal) {
        this._value = newVal;
        triggerRefValue(this, newVal); // 改值时触发更新  39行
      }
    }
    return new RefImpl(init)
  }
  
  function trackRefValue(refValue) {
    if (!refValue.dep) {
      refValue.dep = new Set();
    }
    refValue.dep.add(activeEffect) // activeEffect 在 46行得到了值
  }
  
  function triggerRefValue(refValue) {
    // 最终 refValue.dep 引用了 fn
    
    [...refValue.dep].forEach(effect => effect.fn())
  }
  
  function effect(fn) {
    activeEffect = new ReactiveEffect(fn); // activeEffect 有了值，指向 fn 
    
    fn() // 3行
  }
  
  class ReactiveEffect {
    constructor(fn) {
      this.fn = fn
    }
  }
}
