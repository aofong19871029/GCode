# VUE 

## 源码

### Vue 响应式

### Virtual Dom

1. 什么是vdom

   vdom就是一个普通的javascript对象，包含了tag, props, children 三个属性。用来描述，模拟真实的DOM树结构信息

2. 为什么要使用vdom

* 直接操作dom操作会频繁的操作dom, 引起重绘和回流，使用vdom可以将dom diff 放在js层处理，输出比对后的操作，能够最小颗粒度的操作复用dom
* vue引入vdom，将渲染过程抽象化，从而提升了组件的抽象能力，可以适配DOM以外的渲染目标, 可以实现跨平台，实现SSR 同构渲染, Weex等高级特性
* 通过vdom的抽象能力，我们拥有了声明式编写UI的能力，大大提高了工作效率，
* 不再依赖HTML解析器进行模板解析，可以进行更多的AOT工作提高运行时的效率，通过模板的AOT编译，进一步压缩VUE运行时体积

3. vdom的原理是什么

   ```text
   虚拟 DOM 的工作原理是通过 JS 对象模拟 DOM 的节点。在 Facebook 构建 React 初期时，考虑到要提升代码抽象能力、避免人为的 DOM 操作、降低代码整体风险等因素，所以引入了虚拟 DOM。
   
   虚拟 DOM 在实现上通常是 Plain Object，以 React 为例，在 render 函数中写的 JSX 会在 Babel 插件的作用下，编译为 React.createElement 执行 JSX 中的属性参数。
   
   React.createElement 执行后会返回一个 Plain Object，它会描述自己的 tag 类型、props 属性以及 children 情况等。这些 Plain Object 通过树形结构组成一棵虚拟 DOM 树。当状态发生变更时，将变更前后的虚拟 DOM 树进行差异比较，这个过程称为 diff，生成的结果称为 patch。计算之后，会渲染 Patch 完成对真实 DOM 的操作。
   
   虚拟 DOM 的优点主要有三点：改善大规模 DOM 操作的性能、规避 XSS 风险、能以较低的成本实现跨平台开发。
   
   虚拟 DOM 的缺点在社区中主要有两点。
   
   内存占用较高，因为需要模拟整个网页的真实 DOM。
   
   高性能应用场景存在难以优化的情况，类似像 Google Earth 一类的高性能前端应用在技术选型上往往不会选择 React。
   ```

### Vue Diff

vue diff是对状态改变后的vdom进行比较, diff原理

/vue-next-master/packages/runtime-core/src/renderer.ts

1. 比较2颗树的根节点, 先比较节点tag, 然后比较属性， 如果相同则继续比较子节点

2. 子节点比较 old: [0,1,2,3,4], new [1,3,2,5]

   1. 先分别从2个数组的左边开始遍历，查找复用节点，直到找不到复用节点停止

      (a, b) c

      (a, b) d e

   2. 从2个数组的右边查找可复用的节点，直到找不到停止
      a (b, c)

      d e  (b, c)

   3.  如果old遍历完成，new还有多的节点，就新增 mount 

      (a b)

      (a b) c

      i=2, e1=1, e2=2

      (a b)

      c (a b)

      i=0, e1=-1, e2=0

   4. 如果new遍历完成，old还有多的节点，就卸载这些节点

   5. 剩下的节点中，新老节点都有，但是顺序不一样。

      [i ... e1 + 1]: a b [c d e] f g

      [i ... e2 + 1]: a b [e d c h] f g

       i = 2, e1 = 4, e2 = 5

      1. 遍历new，做个map图 Map<key, idx>, react是遍历old
      
      2. 构建一个new 节点对应old节点位置的map, 用来标记最长的稳定序列，减少节点的移动，保持dom的稳定.
      
         *`Vue更新阶段，新老vdom diff如果有节点移动，那么此时可以计算dom节点中最长递增子序列，减少move,确保dom影响最小`*
      
      3. 

### vue3为了提高运行速度，做了哪些优化

1. diff算法优化

* 静态标记 PatchFlag

`patchFlag` 是 `complier` 时的 `transform` 阶段解析 AST Element 打上的**优化标识**。并且，顾名思义 `patchFlag`，`patch` 一词表示着它会为 `runtime` 时的 `patchVNode` 提供依据，从而实现靶向更新 `VNode` 的效果.

对带有动态属性的元素进行标记, 标记类型有13种

```typescript
export const enum PatchFlags {
  
  TEXT = 1,// 动态的文本节点
  CLASS = 1 << 1,  // 2 动态的 class
  STYLE = 1 << 2,  // 4 动态的 style
  PROPS = 1 << 3,  // 8 动态属性，不包括类名和样式
  FULL_PROPS = 1 << 4,  // 16 动态 key，当 key 变化时需要完整的 diff 算法做比较
  HYDRATE_EVENTS = 1 << 5,  // 32 表示带有事件监听器的节点
  STABLE_FRAGMENT = 1 << 6,   // 64 一个不会改变子节点顺序的 Fragment
  KEYED_FRAGMENT = 1 << 7, // 128 带有 key 属性的 Fragment
  UNKEYED_FRAGMENT = 1 << 8, // 256 子节点没有 key 的 Fragment
  NEED_PATCH = 1 << 9,   // 512
  DYNAMIC_SLOTS = 1 << 10,  // 动态 solt
  HOISTED = -1,  // 特殊标志是负整数表示永远不会用作 diff
  BAIL = -2 // 一个特殊的标志，指代差异算法
}
```





Vue2.0 vdom的diff是全量diff, 而Vue 3.0 新增了静态标记.在与上一次vdom进行对比的时候，只对比带有patch flag的节点，并且可以通过flag的信息得知当前节点要对比的具体内容

```html
<div>
  <p>标签</p>
  <p>{{msg}}</p>
</div>
```

上图在进行比对时只对<p>{{msg}}</p>进行比对.转换后的代码:

```js
import { createElementVNode as _createElementVNode, toDisplayString as _toDisplayString, openBlock as _openBlock, createElementBlock as _createElementBlock } from "vue"

export function render(_ctx, _cache, $props, $setup, $data, $options) {
  return (_openBlock(), _createElementBlock("div", null, [
    _createElementVNode("p", null, "标签"),
    _createElementVNode("p", null, _toDisplayString(_ctx.msg), 1 /* TEXT */) // 静态标记, 1: 动态的文本
  ]))
}
```



1. hoistStatic 静态提升

vue2.x中无论元素是否参与更新，每次都会重新创建，然后再渲染。vue3.0中对于不参与更新的元素，会做静态提升，只会被创建一次，在渲染时直接复用即可。

右边之前数据固定不变的标签，也就是这里的`<p>标签</p>`，被放在了`render`函数的外面。所以这样只会在全局创建一次，这样性能就明显提升了。

```js
import { createElementVNode as _createElementVNode, toDisplayString as _toDisplayString, openBlock as _openBlock, createElementBlock as _createElementBlock } from "vue"

// 静态提升
const _hoisted_1 = /*#__PURE__*/_createElementVNode("p", null, "标签", -1 /* HOISTED */)

export function render(_ctx, _cache, $props, $setup, $data, $options) {
  return (_openBlock(), _createElementBlock("div", null, [
    _hoisted_1,
    _createElementVNode("p", null, _toDisplayString(_ctx.msg), 1 /* TEXT */)
  ]))
}
```



1. catchHandlers (事件帧听缓存)

   默认情况下，如`onClick`事件会被视为动态绑定，所以每次都会追踪它的变化，但是因为是同一个函数，所以不用追踪变化，直接缓存起来复用即可。 好，我们来对比一下开启事件侦听器缓存前后。

   ```html
   <div>
     <p @click="cli">标签</p>
   </div>
   ```

   * 未开启catchHandlers

   ```js
   import { createElementVNode as _createElementVNode, openBlock as _openBlock, createElementBlock as _createElementBlock } from "vue"
   
   export function render(_ctx, _cache, $props, $setup, $data, $options) {
     return (_openBlock(), _createElementBlock("div", null, [
       _createElementVNode("p", { onClick: _ctx.cli }, "标签", 8 /* PROPS */, ["onClick"])
     ]))
   }
   ```

   

   * 开启后

```js
import { createElementVNode as _createElementVNode, openBlock as _openBlock, createElementBlock as _createElementBlock } from "vue"

export function render(_ctx, _cache, $props, $setup, $data, $options) {
  return (_openBlock(), _createElementBlock("div", null, [
    _createElementVNode("p", {
      onClick: _cache[0] || (_cache[0] = (...args) => (_ctx.cli && _ctx.cli(...args)))
    }, "标签")
  ]))
}
```

