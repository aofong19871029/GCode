<template>
    <div class="home">
        <img alt="Vue logo" src="../assets/logo.png" />
        <HelloWorld :msg="'Welcome to vue.js app'" />
        <div @click="onClick">点我啊！！！</div>
    </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import HelloWorld from '../components/HelloWorld.vue';

@Component({
    components: {
        HelloWorld
    }
})
export default class Home extends Vue {
    onClick() {
        // this.$router.push({
        //     path: "/about"
        // })

        this.$router.push({
            path: "/dynamic/path111",
            params: {
                id: 'params111'
            }
        })
        
    }
}
</script>
