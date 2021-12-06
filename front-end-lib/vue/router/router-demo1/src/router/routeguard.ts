import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";
import Home from "../views/Home.vue"; // vue页面
import Dynamic from "../views/Dynamic.vue";
import List from "../views/List.vue";
import Detail from "../views/Detail.vue";
import Test from '../views/Test.vue';

// 通过use方法，引入vueRouter插件，进而使用vueRouter
Vue.use(VueRouter);

// 路由匹配的顺序是由上而下
const routes: Array<RouteConfig> = [
    {
        path: "/", // 路径
        name: "Home", // 名称
        component: Home, // 路径对应的组件/页面,
        meta: {
            title: '首页'
        }
    },
    {
        path: "/about",
        name: "About",
        component: () =>
            import(/* webpackChunkName: "about" */ "../views/About.vue")
    },
    {
        // /dynamic/1111
        // /dynamic
        // /dynamci/1111/lubai
        path: "/dynamic",
        name: "Dynamic",
        component: Dynamic,
        children: [
            {
                path: "",
                component: Dynamic
            },
            {
                path: ":id",
                component: Dynamic
            },
            {
                path: ":id/:name",
                component: Dynamic
            }
        ]
    },
    {
        path: '/list',
        name: 'List',
        component: List
    },
    {
        path: '/detail/:id',
        name: 'Detail',
        component: Detail
    },
    {
        path: '/test',
        name: 'Test',
        component: Test,
        meta: {
            title: '测试导航守卫'
        },
        children: [
            {
                path: "",
                component: Test
            },
            {
                path: ":id",
                component: Test
            }
        ],
        // 配置数组里针对单个路由的导航守卫
        beforeEnter: (to, from, next) => {
           console.log(`TestComponent route config beforeEnter => from=${from.path}, to=${to.path}`);
           next();
        }
    },
    {
        path: "*", // 这个路由可以匹配所有的路径 /list
        name: "ErrorPage",
        component: () =>
            import(/* webpackChunkName: "errorPage" */ "../views/ErrorPage.vue")
    }
];

// 1. router-link 的跳转, scrollBehavior没有记住滚动条的位置
// 2. 通过手动点击浏览器的返回或者前进按钮, 可以记住滚动条位置

// 新建一个router实例
const router = new VueRouter({
    mode: "history", // hash，选择模式，history/hash
    base: process.env.BASE_URL,
    routes, // 传入配置文件
    scrollBehavior: (to, from, savedPostion) => {
        console.log(savedPostion);
        return savedPostion;
    }
});

// 全局
router.beforeEach((to, from, next) => {
    console.log(`Router.beforeEach => from=${from.path}, to=${to.path}`);
    document.title = to.meta.title || '默认标题';
    next();
})

router.afterEach((to, from) => {
    console.log(`Router.afterEach => from=${from.path}, to=${to.path}`);
})

export default router;
