<template>
    <div id="app">
        <div id="nav">
            <router-link to="/">Home</router-link>
            <router-link to="/about">About</router-link>
            <router-link to="/dynamic/111/lubai">Dynamic</router-link>
            <router-link to="/list">List</router-link>
            <router-link to="/test">Test</router-link>
        </div>

        <transition name="fade">
            <router-view class="child-view"></router-view>
        </transition>
    </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import { Route } from "vue-router/types";

@Component({
    components: {}
})
export default class Index extends Vue {
    @Watch('$route')
    onRouteChange(to: Route, from: Route) {
        console.log(`from=${from.path}, to=${to.path}`)
    }
}
</script>

<style lang="less">
#app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
}

#nav {
    padding: 30px;

    a {
        font-weight: bold;
        color: #2c3e50;

        &.router-link-exact-active {
            color: green;
        }
    }
}

.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.75s ease;
}

.fade-enter, .fade-leave-active {
    opacity: 0;
}
</style>
