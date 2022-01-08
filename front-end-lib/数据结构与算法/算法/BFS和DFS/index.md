# BFS和DFS
问题状态空间

## 搜索的核心概念

问题求解树(问题状态树, 状态求解树)

![问题求解数](./search_tree.png)

经典问题，走迷宫

![](./migong_classic.png)

定义状态
求解树是思维结构中的一棵树

​         0,0
​       /       \
​     0,1      1,0
​    /  \         /  \
0,2   1,1  1,1  2,0



1. 什么是深搜和广搜？

对于问题求解数的不同遍历方式

2. 什么是搜索剪枝和优化？

排除某些问题求解树中子树的遍历过程， 不去搜索某些子树

3. 设计搜索算法的核心关键点是什么?

设计问题求解树中的状态



## DFS

通常情况下，使用递归实现深度优先遍历(DFS)

## BFS

通常情况下，使用队列实现BFS

BFS方便对于最优化问题的求解, 比如最短距离



## Coding

如果BFS和DFS都行，建议能用DFS就用DFS， 因为BFS会开辟一段空间

### 在二维矩阵中搜索，什么时候用BFS，什么时候用DFS？

1.如果只是要找到某一个结果是否存在，那么DFS会更高效。因为DFS会首先把一种可能的情况尝试到底，才会回溯去尝试下一种情况，只要找到一种情况，就可以返回了。但是BFS必须所有可能的情况同时尝试，在找到一种满足条件的结果的同时，也尝试了很多不必要的路径；
2.如果是要找所有可能结果中最短的，那么BFS回更高效。因为DFS是一种一种的尝试，在把所有可能情况尝试完之前，无法确定哪个是最短，所以DFS必须把所有情况都找一遍，才能确定最终答案（DFS的优化就是剪枝，不剪枝很容易超时）。而BFS从一开始就是尝试所有情况，所以只要找到第一个达到的那个点，那就是最短的路径，可以直接返回了，其他情况都可以省略了，所以这种情况下，BFS更高效。

### BFS

993 dfs bfs都可以

542  ![](./542.png)

方向数组

```js
class Data{
    i:number;
    j:number;
    k:number;

    constructor(i:number, j:number, k:number){
        this.i=i;
        this.j=j;
        this.k=k;
    }
}

function init_queue(q:Data[], vis:number[][], n:number, m:number, mat: number[][]){
    for(let i=0;i<n;i++){
        vis[i] = [];
        for(let j=0;j<m;j++){
            vis[i][j]=-1;
        }
    }
    for(let i=0;i<n;i++){
        for(let j=0;j<m;j++){
            if(mat[i][j] > 0) continue
            vis[i][j]=0;
            q.push(new Data(i,j,0));
        }
    }
}

// 上下左右4个格子的偏移量
const dir:number[][] = [
    [0,1],
    [1,0],
    [0,-1],
    [-1,0]
];

function updateMatrix(mat: number[][]): number[][] {
    // bfs队列
    const q:Data[] = [];
    // 判重矩阵
    const vis:number[][] = [];
    const n = mat.length, m = mat.length > 0 ? mat[0].length : 0;
    init_queue(q, vis, n, m, mat);
    while(q.length > 0) {
        const cur = q[0]; // 取状态
        // 扩展状态
        for(let k=0;k<4;k++){
            let x = cur.i + dir[k][0];
            let y = cur.j + dir[k][1];
            if(x < 0 || x >= n) continue;
            if(y < 0 || y >= m) continue;
            if(vis[x][y] != -1) continue;
            vis[x][y] = cur.k + 1;
            q.push(new Data(x, y, cur.k+1));
        }
        q.shift(); //出状态
    }
    return vis;
};
```



1091

```ts
/**
i, j 就是横竖左边, l 是起始点走到当前点的最短路径， 起始点自身l为1
 */
class Data{
    i:number = 0;
    j:number = 0;
    l:number = 0;

    constructor(i:number,j:number,l:number){
        this.i=i;
        this.j=j;
        this.l=l;
    }
}

// 上下左右4个格子的偏移量
const dir:number[][] = [
    [0,1],
    [1,0],
    [0,-1],
    [-1,0],
    [1,-1],
    [-1,1],
    [1,1],
    [-1,-1]
]; 

function shortestPathBinaryMatrix(grid: number[][]): number {
    const n = grid.length, m = grid.length > 0 ? grid[0].length : 0;
    const q:Data[] = [];
    const vis:number[][] = [];
    
    if(grid[0][0] !== 0) return -1;
    for(let i=0;i<n;i++){
        vis[i]=[];
    }

    q.push(new Data(0,0,1));
    vis[0][0]=1; // 经过了0点
    while(q.length){
        const cur = q[0];
        // 到达了右下角
        if(cur.i==n-1 && cur.j === m-1){
            return cur.l;
        }

        for(let k = 0;k<8;k++){
            let x = cur.i + dir[k][0];
            let y = cur.j + dir[k][1];

            if(x < 0 || x >= n) continue;
            if(y < 0 || y >= m) continue;
            if(grid[x][y]!==0) continue;
            if(vis[x][y]===1) continue;
            vis[x][y]=1;
            q.push(new Data(x,y,cur.l+1));
        }

        q.shift();
    }
    return -1;
};
```

752

```ts
/**
s: 移动到的字符串
l: 从0000 移动到s ,的最小移动次数
 */
class Data{
    s:string = '';
    l:number = 0;

    constructor(s:string,l:number){
        this.s=s;
        this.l=l;
    }
}

function getStr(s:string, i:number, k:number):string{
    const characters:number[] = s.split('').map(s=>parseInt(s,10));
    switch(k){
        case 0: characters[i]++; break;
        case 1: characters[i]--; break;
    }
    if(characters[i] > 9) characters[i]=0;
    if(characters[i] < 0) characters[i]=9;
    return characters.join('');    
}

function openLock(deadends: string[], target: string): number {
    const q:Data[] = [];
    const h = new Set<string>();
    for(const x of deadends) h.add(x);
    if(h.has('0000')) return -1;
    h.add('0000');
    q.push(new Data('0000', 0));

    while(q.length){
        const cur = q[0];

        if(cur.s === target) return cur.l;

        for(let i=0;i<4;i++){
            for(let k = 0;k<2;k++){
                const t:string = getStr(cur.s, i, k);
                if(h.has(t)) continue;
                h.add(t);
                q.push(new Data(t, cur.l+1));
            }
        }

        q.shift();
    }

    return -1;
};
```

剑指offer13

```ts
/**
i, j 就是横竖左边
 */
class Data{
    i:number = 0;
    j:number = 0;

    constructor(i:number,j:number){
        this.i=i;
        this.j=j;
    }
}

function valOf(n:number){
    let s = n%10;
    let i = 10;
    while(n/i>=1){
        s += Math.floor(n/i);
        i*=10;
    }
    return s;
};

function movingCount(m: number, n: number, k: number): number {
    function transZone(i:number, j:number){
        return i * n + j;
    }
    const q:Data[] = [];
    const h:Set<number> = new Set<number>(); // x,y转为int x*总列数+y
    const dir:number[][] = [
        [0,1],
        [1,0],
        [0,-1],
        [-1,0]
    ];

    q.push(new Data(0,0));
    h.add(0);

    let ans = 0;
    while(q.length){
        const cur = q[0];
        ans++;
        for(let t=0;t<4;t++){
            const x = cur.i+dir[t][0];
            const y = cur.j+dir[t][1];
            if(x<0 || x>=m) continue;
            if(y<0||y>=n) continue;
            if(valOf(x) + valOf(y) > k) continue;
            if(h.has(transZone(x,y))) continue;
            h.add(transZone(x,y));
            q.push(new Data(x,y));
        }

        q.shift();
    }
    return ans;
};
```

### DFS

130

逆向思维， 什么样的O才是不被包围的O， 与四个边相连的圈

与边直接或间接接壤的O标极为o, 最后把剩下的O改为X, 把o改为O

```ts
/**
 Do not return anything, modify board in-place instead.
 */

let n,m;
const dir = [
    [0,1],
    [1,0],
    [0,-1],
    [-1,0]
];
function solve(board: string[][]): void {
    n = board.length;
    m = n>0 ? board[0].length : 0;

    for(let i=0;i<n;i++){
        if(board[i][0] === 'O') dfs(i, 0, board);
        if(board[i][m-1] === 'O') dfs(i, m-1, board);
    }

    for(let j=0;j<m;j++){
        if(board[0][j] === 'O') dfs(0, j, board);
        if(board[n-1][j] === 'O') dfs(n-1, j, board);
    }

    for(let i=0;i<n;i++){
        for(let j=0;j<m;j++){
            if(board[i][j] === 'O') board[i][j]='X';
            if(board[i][j] === 'o') board[i][j]='O';
        }
    }
};

/**
    做标极， 如果O是挨着某条边，标极为小o, 最后在把所有O改为X， o改为O
 */
function dfs(i:number, j:number, board:string[][]){
    if(i<0 || i>= n) return;
    if(j<0 || j>= m) return;

    board[i][j] = 'o';
    for(let k=0;k<dir.length;k++){
        const x = i + dir[k][0];
        const y = j + dir[k][1];
        if(x<0 || x>= n) continue;
        if(y<0 || y>= m) continue;
        if(board[x][y] != 'O') continue;
        dfs(x,y,board);
    }
}
```



494

搜索+Hash记忆化，i + ' ' + target做key, hash速度快

```ts
// let ans = 0;
const h:Map<string, number> = new Map();


function dfs(i:number, target:number, nums: number[]):number{
    let ans = 0;
    const pi = i + ' ' + target;
    if(h.has(pi)) { 
        ans += h.get(pi);
        return ans;
    }

    if(i === nums.length){
        const res =  target === 0 ? 1 : 0;
        // h.set(pi, res);
        return res;
    }



    // +
    ans+=dfs(i+1, target-nums[i], nums);
    // -
    ans+=dfs(i+1, target+nums[i], nums);
    h.set(pi, ans);
    return ans;
}

function findTargetSumWays(nums: number[], target: number): number {
    // ans=0;
    h.clear();
    return dfs(0, target, nums);
    // return ans;
};
```

473

```ts
/**
  这题就是用火彩装满 4个容量为正方形边长的桶
  如果火彩>桶的剩余容量就失败
  如果火柴==桶的剩余容量 or 火柴+最短的那根=桶的剩余容量就可以
  火柴数组倒序， 先从最大的一根开始试
 */
function makesquare(matchsticks: number[]): boolean {
    matchsticks = matchsticks.sort((a,b)=>a-b);
    const arr:number[] = new Array(4);
    let sum = 0;
    for(const x of matchsticks) sum+=x;
    if(sum%4!==0) return false;
    arr.fill(sum/4);
    return dfs(matchsticks.length-1, arr, matchsticks);
};


/**
   ind: 当前处理到了第几根木棍
   arr: 桶的容量是多少
   ms: 火柴数组
 */
function dfs(ind:number, arr:number[], ms:number[]):boolean{
    if(ind==-1){
        return true;
    }
    for(let i=0;i<4;i++){
        const item = ms[ind];
        if(arr[i] < item) continue;
        if(arr[i] === item || arr[i]>=item + ms[0]){
            arr[i]-=item;
            if(dfs(ind-1, arr, ms)) return true;
            arr[i]+=item;
        }
    }
    return false;
}
```

39

```ts
let ans:number[][] = [];


function combinationSum(candidates: number[], target: number): number[][] {
    ans = [];
    let path = [];
    dfs(0, target, path, candidates);
    return ans;
};

/**
  ind: 遍历到第几个数
  target: 需要拼凑的对象
  path: 当前组合链的路径数组
  can:元素数组
 */
function dfs(ind:number, target:number, path:number[], can:number[]):void{
    if(target<0) return;
    if(target === 0) {
        ans.push(Array.from(path));
        return;
    } 
    if(ind === can.length) return;

    // 不选择ind
    // ind++
    dfs(ind+1, target, path, can);
    // 选择ind
    path.push(can[ind]);
    dfs(ind, target-can[ind], path, can);
    // 弹出末尾值，继续用其他值尝试
    path.pop();
}
```

51
