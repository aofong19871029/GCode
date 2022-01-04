# 二分查找

## 二分查找: 在一个有序数组中，查找一个值

min是头指针; max是尾指针; mid=(min + max) /2 

调整:

如果 arr[mid]<x, min = mid+1

如果arr[mid]>x; max = mid-1

如果arr[mid] == x ，找到结果

```c++
int binary_search(int *arr, int n, int x){
    int head = 0, tail = n-1, mid;
    while(head <= tail){
        // 如果head tail很大的化，下面的+会越界>int32
        mid = (head + tail) / 2;
        // 优化后代码如下
        mid = head + (tail - head) /2;
        
        if(arr[mid] == x) return mid;
        if(arr[mid] < x) head = mid+1;
        else tail = mid-1;
    }
    return -1;
}
```

通常二分查找的时间复杂的是
$$
O(log_n)
$$

## 二分查找-泛型情况

[ 0, 0, 0, 0, 1, 1, 1, 1, 1, 1 ] 中查询第一个1

当mid = 1时, 由于需要考虑到mid正好是第一个1, 所以这个时候需要把tail调整岛mid的位置， tail=mid

当mid = 0时, head = mid+1



[ 1, 1, 1, 1, 1, 0, 0, 0, 0, 0 ] 中查找最后一个1

当mid=0时, tail = mid-1;

当mid=1时由于需要考虑到mid是最后一个1， 所以head=mid



这2种泛型是一个对偶问题

对偶问题: 把问题转换成另外个问题，如果你解决了另外个问题，原问题也解决了

`重点`：

<b>二分查找的范围无论怎么变化, 待查找的答案，始终在head~tail区间内</b>

希望最终head tail都执行第一个1

### 泛型情况的应用场景

[ 5, 7, 9, 9, 9, 10, 10, 11, 15, 20 ] 查询第一个>=9的数

我们把>=9设置为1, <9的设置为0. 这个问题就转化为

[ 0, 0, 1, 1, 1, 1, 1, 1, 1, 1]  0:条件不成立, 1:条件成立

```c++
// 查找序列中第一个>=x的位置
int binary_search_01(int *arr, int n, int x){
    int head = 0, tail = n-1, mid;
    // 最终结果是head == tail
    while(head < tail){
        mid = head + (tail - head) /2;        
        if(arr[mid] < x) head = mid+1;
        // tail >= x, 可能就是第一个>=x 不能跳过
        else tail = mid;
    }
    return head;
}
```

## 避免二分死循环的写法

大范围二分， 小范围顺序查找

```c++
int binary_search(int *arr, int n, int x){
    int head = 0, tail = n-1, mid;
    // 这里判断>3就是为防止边界处理不清楚，出现tail<head 死循环了
    while(tail - head > 3){
        // 如果head tail很大的化，下面的+会越界>int32
        mid = (head + tail) / 2;
        // 优化后代码如下
        mid = head + (tail - head) /2;
        
        if(arr[mid] == x) return mid;
        if(arr[mid] < x) head = mid+1;
        else tail = mid-1;
    }
    for(int i=head;i<=tail;i++){
        if(arr[i] == x) return i;
    }
    return -1;
}
```

## 二分中数组和函数的关系

f[x] -> y 下标->值的映射

f(x) ->y 参数->值的映射

二分查找是给出值，求解下标， 如果二分查找用在函数上, 就是一个单调函数的求解(参数)

比如f(x) = 2x;

| 参数 | 0    | 1    | 2    | 3    | 4    | 5    |
| ---- | ---- | ---- | ---- | ---- | ---- | ---- |
| 值   | 0    | 2    | 4    | 6    | 8    | 10   |

 思维逻辑结构中, 

1.  函数是压缩的数组
2. 数组是展开的函数

函数使用计算资源，数组使用存储资源
计算资源------------------->时间
                                            ^
                                            | 互换
                                            v
存储资源------------------->空间

<b>任何应用于数组上的算法, 都可以应用于某种性质的函数上</b>
1

