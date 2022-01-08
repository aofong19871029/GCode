## 高阶组件

把不同的部分当参数

好处是：

1.  代码复用， 状态/逻辑抽象
2. 可以对state/event/props 进行劫持、操作

缺点

1. 增加了组件嵌套层级, 过多时对于渲染的性能有1定的影响;
2. ref、displayName等易被忽略, 虽然我们不推荐使用ref， 但是类似组件封装的时候,ref的转发是必不可少的, 在一些Devtool中也徒增了UI无关的组件嵌套;
3. 对于已使用了HOC的业务，需求的扩展有一定的难度
4. 高阶组件有类似的逻辑时，也会造成执行顺序、功能覆盖的风险..

HOC 知名应用案例

- react-redux connect
- react-router withRouter

## hooks

⾼阶组件允许我们通过套娃的⽅式来增强组件，套娃套多了，维护起来会越来越难。hooks 的诞⽣也顺 

带解决了这个问题。因此 hooks 的强⼤能⼒依然是代码逻辑的复⽤，同时也简化了⽣命周期，使得函数式 

组件拥有了状态。注意， hooks 只能在函数式组件中使⽤，命名规范为 use 开头，且可以返回组件或任意 

类型的数据（也可不返回）。


常用的hooks

useState 
useEffect 
useRef 
useCallback 
useMemo 
useContext 
useImperativeHandle （与 forwardRef ⼀起使⽤） 
useReducer
useLayoutEffect 
useDebugValue 
useTransition

### ⾃定义 hook 的实现 

```js
import React, {
    useRef,
    useEffect
} from 'react';

function useCallback(count) {
    export default function useUpdated(callback) {
        const didUpdate = useRef(false);
        useEffect(() = > {
            if (didUpdate.current) {
                callback ? .();
            } else {
                didUpdate.current = true; // 初次挂载时⾛这⾥
            }
        });
    }
}
// 分隔线 ---------------------------------------------------
// 使⽤⽅式
import useUpdated from './useUpdated';
export default function UseRef() {
    useUpdated(() = > {
        console.log('模拟 componentDidUpdate ，即除了初始化，之后的更新进到这⾥');
    });
    return ( < button > Ref容器 < /button>);
    }
```

## 异步组件 

```jsx
import React from 'react';
export default function lazy(loadComponent) {
    const Fallback = () => < h1 > loading... < /h1>; 
    const [Component, setComponent] = useState(() => Fallback);

    useEffect(() => {
        loadComponent().then(res => {
            setComponent(res.default);
        });
    }, []);

    return <Component / > ;
}
// 或者使⽤⾼阶函数
export default function lazy(loadComponent) {
    return class WrapComponent extends React.Component {
        state = {
            Component: () => < h1 > loading... < /h1>
        }
        async componentDidMount() {
            const {
                default: Component
            } = await loadComponent();
            this.setState({
                Component
            });
        }
        render() {
            const Component = this.state.Component;
            return <Component / > ;
        }
    }
}

// 分隔线 -----------------------------------------------------
// 使⽤⽅式
const AsyncAbout = lazy(() => import('./About'));
```

