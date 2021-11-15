### 简易vue template parser	

```js
function parse(template) {
    // 1. 语义拆分 templateStr 拆成数组(语义)
    const tokens = tokenizer(template);

    // 数组 => 树 完成了ast
    // 数组变成属性结构，理所当然想到递归

    let cur = 0;
    let ast = {
        type: 'root',
        props: [],
        children: [] // 子元素
    };
    while (cur < tokens.length){
        // let w = walk();
        ast.children.push(walk())
    }
    return ast;

    function walk() {
        let token = tokens[cur];
        if(token.type === 'tagstart'){
            let node = { // 开始标签新建node
                type: 'element',
                tags: token.val,
                props: [],
                children: []
            };

            token = tokens[++cur];
            // 一直往下走直到tagend or tagstart ，中间都是自己的内容
            while (token.type!=='tagend'){
                if (token.type === 'props'){
                    node.props.push(walk())
                } else {
                    node.children.push(walk())
                }
                token = tokens[cur];
            }

            cur++;
            return node;
        }

        if(token.type === 'tagend'){
            cur++;
        }
        if(token.type === 'text'){
            cur++;
            return token;
        }
        if(token.type === 'props'){
            cur++;
            // id=name
            const [key, val] = token.val.split('=');
            return {key, val}
        }
    }
}

function tokenizer(input) {
    // 返回数组 [{valie: 'div', type: 'tagstart'}, {type:'props']
    let tokens = [];
    let type = '';
    let val = '';
    for(let i=0;i<input.length;i++){
        let ch = input[i];
        if(ch === '<'){
            push(); // <开头的字符，语义更换, 之前收集的val,  push到token
            if (input[i+1] === '/'){
                type = 'tagend'; // </ 结束标签
            } else  {
                type = 'tagstart' // <div 开始标签
            }
        }
        
        if(ch === '>'){
            push();
            type = 'text';  //标签结束, 直接push
            continue;
        } else if (/[\s]/.test(ch)){  // 碰到空格夹断一下
            push();
            type = 'props'
            continue
        }
        val += ch;
    }
    
    function push() {
        if(val){
            if(type === 'tagstart') val = val.slice(1) //过滤<
            if(type === 'tagend') val = val.slice(2) // 过滤</
            tokens.push({
                type,
                val
            });
            val = '';

        }
    }

    return tokens;
}

function transform(ast) {
  // 给通用ast 加上vue语法标识
  // 包括vue特定template语法，所谓 <静态标记>
    let context = {
        helpers: new Set(['openBlock', 'createVNode']) //vue runtime 工具函数
    };

    // 树形结构，递归比较合适
    traverse(ast, context);
    ast.helpers = context.helpers
}

function traverse(ast, context) {
    switch (ast.type) {
        case 'root':
            context.helpers.add('createBlock');
        case 'element':
            // props 在里面
            // html元素
            // 重点: 1. vue语法的标记 2:class props event 这几个如果是静态需要标记出来方便vdom diff略过
            ast.children.forEach(node=>{
                traverse(node, context)
            })
            // 先不整位运算, 用对象好理解
            ast.flag = {
                props: false,
                class: false,
                event: false
            }
            ast.props = ast.props.map(prop => {
                const {key, val} = prop
                if(key[0] === '@'){
                    // 事件
                    ast.flag.event = true //后续对节点处理的时候， 需要对事件进行diff, 先remove 再addeventlistener
                    return {
                        // @click => onClick
                        key: 'on' + key[1].toUpperCase() + key.slice(2),
                        val
                    }
                }
                if(key[0] === ':'){
                    // 动态属性
                    ast.flag.props = true;
                    return {key: key.slice(1), val}
                }
                if(key[0] === 'v-'){
                    // 先忽略， 自己扩展v-modle
                }
                // 以上都没有
                return {...ast.props, static: true};
            })
            break;

        case 'text':
            // 文本需要直到{{}}, 有这个是动态，没这个是静态文本
            let re = /\{\{(.*)\}\}/g;
            if(re.test(ast.val)){
                ast.static = false; //动态数据需要displaystring
                context.helpers.add('toDisplayString')
                ast.val = ast.val.replace(re, function (s0, s1) {
                    return s1;
                })
            } else {
                ast.static = true; // 如果是静态后面vdom diff直接跳过
            }
        case 'root':
    }
}

function generate(ast) {
  const { helpers } = ast;

  let code = `
   import { ${ [...helpers].map(v=>v + 'as _' + v) } } from 'vue'\n
    export function render(_ctx, _cache){
        return (_openBlock(), ${ast.children.map(node => walk(node))})
    }
  `;

  return code;

    function walk(node) {
        switch (node.type){
            case 'element':
                let {flag} = node;

                let props = '{' + node.props.reduce((ret, p) => {

                   if(flag.props){
                       // 属性是动态的
                       ret.push(p.key + ':_ctx.' + p.val.replace(/['"]/g, ''))
                   } else {
                       ret.push(p.key + ':' + p.val)
                   }
                   // 没做class的判断
                   return ret;
                }, []).join(',') + '}';
                return `_createVnode("${node.tag}", 
                ${props}, 
                [${node.children.map(n => walk(n))}].
                ${JSON.stringify(flag)})`;
            case 'text':
                if(node.static) {
                    return '"' + node.val + '"'
                } else {
                    return `_toDisplayString(_ctx, ${node.val})`
                }
                break
        }
    }
}



function ll(json) {
    console.log(JSON.stringify(json, null, 1))
}

function compile(template) {
    let ast = parse(template);
    transform(ast);

    const code = generate(ast);
    ll(code)
    // return code;
}

const templateStr =  `<div id="app">
      <p @click="add" :id="name">{{name}}</p>
      <h1 class="item">技术摸鱼</h1>
  </div>`;

let code = compile(templateStr);
```

