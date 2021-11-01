# Node JS

https://www.bookstack.cn/read/node-in-debugging/v8-profiler.md

## cpu

可以使用v8-profiler-next 来cpu火焰图，将生成的cpuprofile用chrome dev tool加载查看火焰图

![Node CPU火焰图](https://ask.qcloudimg.com/http-save/yehe-5805687/nj6aupmws9.jpeg?imageView2/2/w/1620)

火焰图重从上而下就是调用栈，其中横条长度越长，代表这占cpu时间越长，如果某个横条很长，但下面又没有很细小的子调用，一般就标识该调用消耗时间比较长，可以考虑做优化。



## nodejs得好处是什么

异步io, 前后同构, 跨平台，一人开发3端节省人力，方便迁移，机器运营成本低(低核), 社区提供大量npm包并且代码开源

