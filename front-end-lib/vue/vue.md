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

