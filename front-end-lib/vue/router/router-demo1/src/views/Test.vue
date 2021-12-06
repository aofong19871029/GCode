<template>
    <div class="about">
        <h1>这里是测试页面</h1>
        <router-link to="/test/1">Test-1</router-link>
        <router-link to="/test/2">Test-2</router-link>
    </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

@Component({
    components: {},
    beforeRouteEnter: (to, from, next) => {
        console.log(`TestComponent beforeRouteEnter => from=${from.path}, to=${to.path}`);
        next();
    },
    beforeRouteUpdate: (to, from, next) => {
        console.log(`TestComponent beforeRouteUpdate => from=${from.path}, to=${to.path}`);
        next();
    },
    beforeRouteLeave: (to, from , next) => {
        console.log(`TestComponent beforeRouteLeave => from=${from.path}, to=${to.path}`);
        next();
    }
})
export default class Test extends Vue {

}
</script>
