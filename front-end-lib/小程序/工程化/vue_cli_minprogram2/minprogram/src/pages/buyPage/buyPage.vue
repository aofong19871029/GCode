<template>
  <view>
      <view
        v-for="(item, index) in list"
        :key="index"
      >
          <van-card 
            :num="item.count"
            :title="item.info.name"
            desc="这是描述信息"
            :price="item.info.rmb"
            :thumb="item.info.thumImage"
          />
      </view>
  </view>
</template>

<script>
import { get } from '../../uitls/htpp';
export default {
    data() {
        return {
            list: [],
        };
    },
    mounted() {
        this.getBuyInfo();
    },
    methods: {
        async getBuyInfo() {
            const res = await get('/buyInfo', {}, {});
            console.log(res);
            if (res.statusCode !== 200) {
                return;
            }
            this.list = res.data;
        }
    },
}
</script>

<style>

</style>