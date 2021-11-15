## 动画特效

1. transition 实现路由切换动画

* App.vue
* Home -> list -> detail 页面从右往左出现
* detail -> list -> home 页面从左往右



* Home.vue router depth



## 插槽 -slot-

slot 在组件模板中占好位置，当使用组件的时候，组件里面的内容会替换组件模板中的slot位置

让用户可以更好的扩展组件，更好的复用组件以及做一些定制化的处理

布局组件

1. slot 使用

   * 默认slot使用

   子组件里的<slot>标签确认渲染的位置，标签里也可以放一些dom结构。当父组件使用的时候，如果没有往插槽里传入内容，slot标签内的dom结构就会显示在页面。

   * 具名slot

     子组件用v-slot:lubai来标识插槽的名字，父组件在使用的时候，在默认插槽的基础上加v-slot属性，属性值就是lubai

   * 作用域slot

   组件间传递数据

2. slot原理

   一个带slot的组件

   ```js
   Vue.component('button-counter', {
      template: '<div><slot>我是默认内容</slot></div>' 
   });
   
   new Vue({
       el: '#app',
       template: '<button-counter><span>我是slot传入的内容</span></button-counter>',
       component: {buttonCounter}
   })
   ```

   经过vue编译，组件渲染函数会变成这样

   ```js
   (function anonymous(){
       with(this){return _c('div', [_t('default', [_v("我是默认内容")])], 2)}
   })
   ```

   而这个_t就是slot的渲染函数：

   ```js
   // 最终产出的是v-node
   function renderSlot(
   	name,
       fallback,
       props,
       bindObject
   ){
           // 得到渲染插槽内容的函数
           var scoppedSlot = this.$scopedSlots[name];
           var nodes;
           // 如果存在插槽渲染函数，则执行插槽渲染函数, 生成nodes节点返回
           // 否则使用默认值
           nodes = scopedSlotFn(props) || fallback;
           return nodes;
       }
   ```
   
   而scopedSlotFn就是递归解析各个节点，获取slot
   
   ```js
   /**
    * Runtime helper for resolving raw children VNodes into a slot object.
    */
   function resolveSlots (
     children,
     context
   ) {
     if (!children || !children.length) {
       return {}
     }
     var slots = {};
     for (var i = 0, l = children.length; i < l; i++) {
       var child = children[i];
       var data = child.data;
       // remove slot attribute if the node is resolved as a Vue slot node
       if (data && data.attrs && data.attrs.slot) {
         delete data.attrs.slot;
       }
       // named slots should only be respected if the vnode was rendered in the
       // same context.
       if ((child.context === context || child.fnContext === context) &&
         data && data.slot != null
       ) {
         // 如果slot存在（slot="header"）,则拿对应的值做key（header）
         var name = data.slot;
         var slot = (slots[name] || (slots[name] = []));
         // 如果是template元素，则把template的children添加到数组中，这也就是为什么你写的template标签并不会渲染成另一个标签
         if (child.tag === 'template') {
           slot.push.apply(slot, child.children || []);
         } else {
           slot.push(child);
         }
       } else {
           // 如果没有默认就是[]
         (slots.default || (slots.default = [])).push(child);
       }
     }
     // ignore slots that contains only whitespace
     for (var name$1 in slots) {
       if (slots[name$1].every(isWhitespace)) {
         delete slots[name$1];
       }
     }
     return slots
   }
   ```
   
   





## Mixin

本质就是一个js对象. data components methods created computed, 让其他组件集成他

局部混入

全局混入

1. mixin 使用

* mixins/index.ts 记录浏览页面的时间
* Page1.vue
* Page2.vue



tips： 

* 如果生命周期钩子有复用的话，先执行mixin钩子，再执行组件的钩子
* 当组件内存在与mixin相同的data key时，组件内优先，会覆盖mixin里的数据



1. mixin 实现原理

* 递归处理mixins
* 先遍历合并parent， 调用mergeFiled 方法进行合并
* 遍历child, 合并补上parent中没有的key, 再继续调用mergeFiled

分四种策略

* 替换型 - 同名的props, methods, inject, computed

```js
if(!parentVal){
    return childVal;
}

const ret = Object.create(null);
extend(ret, parentVal);

if(childVal){
    extend(ret, childVal);
}
return ret;
```

* 合并型策略 - data, 通过set方法进行合并和重新赋值

```js
const childData;
const parentData;

if(childData){
    return mergeData(childData, parentData);
} else {
    return parentData
}

function mergeData(to, from){
    if(!from) return to;
    
    const keys = Object.keys(from);
    for(let i=0;i<keys.length;i++){
        let key = keys[i];
        let toVal = to[key];
        let fromVal = from[key];
        
        if(!to.hasOwnProperty(key)){
            set(to, from, fromVal);
        } else if(typeof toVal === 'object' && ...){
                  mergeData(toVal, fromVal);
        }
                  
    }
}
```

* 队列型策略 - 生命周期和watch

* 叠加型策略 - component directives filters

  ```js
  const res = Object.create(parentVal || null);
  
  if(childVal){
      for(let key in childVal){
          res[key] = childVal[key];
      }
  }
  return res;
  ```

  

## 过滤器 Filter(建议使用computed替换filter)

不改变原始数据，只是对数据进行加工处理，可以理解为是一个函数

1. filter 使用

2. filter 实现原理

* 在编译阶段通过parseFilters 将过滤器编译为函数调用
* 串联的过滤器是一个嵌套的函数调用，前一个过滤器的执行结果，是后一个过滤器函数的参数

```js
function parseFilters(filter) {
    let filters = filter.split('|');
    let expression = filters.shift.trim();
    
    if(filters){
        for(let i=0;i<filters.length;i++){
            expression = wrapFilter(expression, filters[i].trim());
        }
    }
}

function wrapFilter(exp, filter){
    const i = filter.indexOf('(');
    if(i<0){
        return `_f("4{filter}")(${exp})`;
    }
}
```





## Plugin

简单来说，插件就是指对vue功能的增强或补充.

```js
import VueCliboard from 'VueCliboard';
Vue.use(VueCliboard)
```

1. 什么是插件， 如果编写一个插件

   ```js
   MyPlugin.install = function(Vue, options){
       Vue.myGlobalMethod = function(){};
       Vue.directive('my-directive', {
           bind(el, binding, vnode, oldNode){}
       })
       Vue.mixin({
           created(){}
       })；
       Vue.prototype.$copyText = ()=>{};
   }
   
   Vue.use(MyPlugin, {...options});
   ```

   

2. Vue.use做了什么

   * 判断当前插件是否已经安装过， 防止重复安装
   * 处理参数， 调用插件的install方法，第一个参数是Vue

   ```js
   Vue.use = function(plugin: Function | Object) {
       const installedPlugins = (this._installedPlugins || this._installedPlugins = [])
       
       if(installedPlugins.indexOf(plugin) != -1){
           return;
       }
       
       const args = Array.from(arguments);
       args.unshift(this); // this == Vue
       
       if(typeof plugin.install == 'function'){
           plugin.install.apply(plugin, args);
       } else if(typeof plugin === 'function'){
           plugin.apply(null, args);
       }
       
       installedPlugins.push(plugin);
       return this;
   }
   ```

   



## 常见组件库介绍

* vant
* iview
* element-ui
* ant-design-vue
* vue-material  适合国外网站



1. 按需引入
2. 组件额设计规范， 调用你们公司的其他团队有什么样的组件需求
3. 

