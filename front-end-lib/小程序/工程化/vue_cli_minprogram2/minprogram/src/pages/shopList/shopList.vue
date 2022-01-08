<template>
    <view>
       <view
        v-for="(item, index) in list"
        :key="index"
        @click="goShopInfo(item.Id)"
        >
        <Item
            :name="item.name"
            :imageUrl="item.thumImage"
            :rmb="item.rmb"
            :monthSall="item.mounthSell"
        />
       </view>
    </view>
</template>

<script>
import Item from './components/item/item';
import { get } from '../../uitls/htpp';
export default {
    components: {
        Item,
    },
    data() {
        return {
            list: [],
            finishTag: true,
        };
    },
    mounted() {
        this.getShopList();
    },
    onReachBottom() {
        console.log('我触发了下拉刷新----');
        this.getShopList();
    },
    methods: {
        goShopInfo(id) {
            // console.log('goShopInfo---');
            uni.navigateTo({
                url: `../../pages/shopInfo/shopInfo?id=${id}`,
            });
        },
        async getShopList() {
            if (!this.finishTag) {
                return;
            }
            this.finishTag = false;
            const res = await get('/shopList', {}, {});
            console.log('getShopList----', res);
            if (res.statusCode !== 200) {
                uni.showToast({
                    title: '请求错误',
                });
                return;
            }
            this.finishTag = true;
            const { data } = res;
            // debugger;
            this.list = [...this.list, ...data];
            // get
        },
    },
}
</script>

<style>

</style>