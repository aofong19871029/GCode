<template>
  <view>
      <swiper :autoplay="true" class="swiper-content">
            <swiper-item
                v-for="(item, index) in info.bigImage"
                :key="index"
            >
               <image :src="item" class="image-content"></image>
            </swiper-item>
      </swiper>
      <van-goods-action>
        <van-goods-action-icon icon="chat-o" text="客服" />
        <van-goods-action-icon icon="cart-o" text="购物车" :info="shopCarLen" />
        <van-goods-action-icon icon="shop-o" text="店铺" />
        <van-goods-action-button color="#be99ff" text="加入购物车" type="warning" @click="addShopToCar"/>
        <van-goods-action-button color="#7232dd" text="立即购买" @click="goBuyPage"/>
    </van-goods-action>
  </view>
</template>

<script>
import { get } from '../../uitls/htpp';
export default {
    data() {
        return {
            info: {},
            Id: '',
            shopCarLen: 0,
        };
    },
    onLoad(e) {
        console.log('接受到的参数是----', e);
        this.getShopinfoById(e.id || '1');
        this.Id = e.id || '';
        this.getSjopCarLen();
    },
    methods: {
        goBuyPage() {
            uni.navigateTo({
                url: '../../pages/buyPage/buyPage'
            });
        },
        // getShopinfoById
        async addShopToCar(Id) {
            const res = await get('/addShopToCar', { Id: this.Id }, {});
            if (res.statusCode !== 200) {
                return;
            }
            this.shopCarLen += 1;
        },
        async getSjopCarLen() {
            const res = await get('/shopCarLen', {}, {});
            if (res.statusCode !== 200) {
                return;
            } 
            this.shopCarLen = res.data;
        },
        async getShopinfoById(id) {
            const res = await get('/getShopinfoById', { id }, {});
            console.log(res);
            if (res.statusCode !== 200) {
                return;
            }
            this.info = Object.assign({}, this.info, res.data);
        },
    },
}
</script>

<style scoped>
.swiper-content {
    height: calc(50vh);
    background-color: antiquewhite;
}
.image-content {
    display: block;
    margin:  0 auto;
    height: calc(50vh);
}
</style>