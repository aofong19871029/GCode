<template>
  <div id="layout-wrapper">
    <!-- <div class="layout-header">头部导航</div> -->
    <div class="menu-content">
      <p  
        v-for="item in menuList"
        :key="item.name"
        @click="toRoute(item.props.routerBase, item.name)"
        :class="{
          'menu-item': true,
          'item-select': item.name === appValue
        }"
      >{{item.name}}</p>
    </div>
    <p>当前的人数是： {{peopleLists.length}}</p>
    <div id="subapp-viewport"></div>
  </div>
</template>

<script>
import appsConfig from './micro_app';
import action from './action';
export default {
  data() {
    return {
      peopleLists: [],
      menuList: [],
      appValue: '',
    };
  },
  mounted() {
    this.menuList = appsConfig;
    action.onGlobalStateChange((state) => {//监听公共状态的变化
      console.log('当前state的值是----', state);
      this.peopleLists = state.usersInfo;
    }, true);
  },
  methods: {
    toRoute(url, key) {
      if (this.appValue === key) {
        return;
      }
      this.appValue = key;
      this.$router.push(url);
    },
  },
}
</script>
<style>
.menu-content {
  display: flex;
  align-items: center;
}
.menu-item {
  width: 100px;
  height: 60px;
  line-height: 60px;
  /* background-color: yellowgreen; */
  text-align: center;
  cursor: pointer;
}
.item-select {
  background-color: yellowgreen;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
</style>
