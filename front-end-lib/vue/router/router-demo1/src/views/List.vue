<template>
    <div class="list">
        <h1>这里是列表页</h1>
        <div v-for="item in list" :key="item" class="item">
            <router-link :to="item">{{ item }}</router-link>
        </div>
    </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

@Component({
    components: {}
})
export default class List extends Vue {
    get list() {
        return new Array(1000).fill("").map((item, index) => `/detail/${index}`);
    }
}
</script>

<style lang="less" scoped>
.list {
    width: 100%;
    background-color: gray;

    .item {
        width: 100%;
        height: 40px;
        display: flex;
        justify-content: center;
        align-items: center;

        font-size: 16px;
        font-weight: bold;
    }
}

</style>
