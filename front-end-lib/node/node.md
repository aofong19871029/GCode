# Node JS

https://www.bookstack.cn/read/node-in-debugging/v8-profiler.md

## cpu

可以使用v8-profiler-next 来cpu火焰图，将生成的cpuprofile用chrome dev tool加载查看火焰图

![Node CPU火焰图](https://ask.qcloudimg.com/http-save/yehe-5805687/nj6aupmws9.jpeg?imageView2/2/w/1620)

火焰图重从上而下就是调用栈，其中横条长度越长，代表这占cpu时间越长，如果某个横条很长，但下面又没有很细小的子调用，一般就标识该调用消耗时间比较长，可以考虑做优化。

