<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png">
    <p 
      v-for="item in peopleLists"
      :key="item.userId"
    >我的名字是什么:{{item.userName}} 我的ID是: {{item.userId}}</p>
    <button @click="addPeople">添加一个用户</button>
  </div>
</template>

<script>
import action from '../action';
export default {
  data() {
    return {
      peopleLists: [],
    }
  },
  mounted() {
    action.onGlobalStateChange((state) => {
      console.log('子类获取----', state);
      this.peopleLists = state.usersInfo;
    }, true)
  },
  methods: {
    addPeople() {
      const tempList = JSON.parse(JSON.stringify(this.peopleLists));
      tempList.push({
        userName: 'xxx',
        userId: new Date().getTime(),
      });
      action.setGlobalState({
        usersInfo: tempList,
      })
    },
  },
}
</script>
