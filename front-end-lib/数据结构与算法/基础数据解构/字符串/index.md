# 字符串算法

## 经典匹配算法 KMP,  Sunday 和 Shify-[And



1. **暴力匹配**

   母串(文本串)   ```"a e c a e a e c a e d"```

   子串(模式串)   ```"a e c a e d"```

   单模匹配问题： 匹配中只有一个模式串

   

​        暴力匹配算法就是： 

​       **用模式串去对齐母串的每一位， 如果不匹配就用模式串与母串的下一位匹配。**

​	字符串匹配算法中最重要的2点是 不重， 不漏        

   * 不重: 之前匹配过的位置不会重复匹配；  
   * 不漏:  在算法中不会漏掉任何一个找到模式串的机会；

```c++
// text中查找到pattern的起始位置
// text 是母串， pattern 是子串
int brute_force(const char *test, const char *pattern){
    for(int i=0; text[i]; ++i){
        int flag = 1;
        for(int j=0;pattern[j];++j){
            if(text[i+j] == pattern[j]) continue
            flag = 0;
            break;
        }
        
        if(flag == 1) return i;
    }
    return -1;
}
```



2. **KMP**

暴力匹配--观察， ``a e c a e``是绿色区域， `` a e c a e d``

``a e c a e a`` ``e c a e d``

``a e c a e d``

d !=a 时， 后移一位能匹配成功的条件是text[1] == pattern[0]

推理的数据，可以预处理出来

绿色区域：匹配过的位置， 

是否对齐第2位 pre-4 = last-4 

* 子母串 前5位对齐, i=5

* pre： 模式串的前k位， last: 母串中已匹配区域中的i-k

* 是否对齐第2位 pre-4 = last-4 

* 移动一位 k=2.   pre: [0 ... i - k + 1] 子串中的前4位  last：[k-1 ... i]; 所以就是 子串 pre_4 前4位 == 母串 i-k+1位， 后4位

 是否对齐第3位 pre_3=last_3

是否对齐第4位 pre-2 = last_2 => yes



当前案例，对齐第4位， 

``a e c a e a`` ``e c a e d``

​        ``a e c a e d``

KMP 算法就是优化了暴力匹配中绝对不会产生结果的位数

1：23 正式进入KMP算法的学习

