## 并查集

### 连通性问题

并查集主要是解决连通性问题, 传递性

a-b]

​        ===> a -c

b-c]

### Quick-Find算法(染色法)

每次连接的时候，连接的是2个集合

1. 基于`染色`思想, 一开始所有的点颜色不同
2. 连接两个点的操作，可以看成将一种`颜色`的点染成`另一种颜色`
3. 如果两个点颜色<u>一样</u>， 证明联通，否则不联通
4. 这种方法叫做并查集的 [Quick-Find]算法

```c++
class UnionSet {
    public :
       int *color ,n;
       UnionSet(int n): n(n) {
           color = new int[n+1];
           for(int i=0;i<=n;i++){
               color[i]=i;
           }
       }
       int find(x){ // O(1)
           return color[x]
       }
       void merge(int a, int b){ // O(n)
           if(color[a] == color[b]) return;
           int cb = color[b];
           // b的颜色染成a的颜色
           for(int i=0;i<=n;i++){
               if(color[i] == cb) color[i]=color[a];
           }
           return;
       }
}
```



1. 联通判断: O(1)
2. 合并操作: O(n)



问题思考：

1. quick-find 算法的联通判断非常快，可是合并操作非常慢

2. 本质上问题中只是需要知道一个点与哪些点的颜色相同

3. 而若干点的颜色可以通过间接指向同一个节点

4. 合并操作时，实际上是将一颗树作为另一颗树

   

### Quick-Union算法

使用树形结构

```c++
```







