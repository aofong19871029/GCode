# VUE

## 源码

### Vue 响应式

### Virtual Dom

1. 什么是vdom
2. 为什么要使用vdom
3. vdom的作用是什么，解决什么问题
4. vdom的原理是什么

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

      1.  遍历new，做个map图 Map<key, idx>, react是遍历old
      2. 构建一个new 节点对应old节点位置的map, 用来标记最长的稳定序列，减少节点的移动，保持dom的稳定
      3. 

