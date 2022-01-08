<template>
  <view class="item-content">
     <image :src="imageUrl" class="item-photo"></image>
     <view class="item-title">
          <text>{{name}}</text>
     </view>
     <view class="item-info">
         <text class="item-rmb">{{rmb}}</text>
         <text class="item-month-sall">{{monthSall}}</text>
     </view>
  </view>
</template>

<script>

export default {
   props: {
       name: {
           type: String,
           default: '默认名称',
       },
       imageUrl: {
           type: String,
           default: '',
       },
       rmb: {
           type: String,
           default: '',
       },
       monthSall: {
           type: String,
           default: '',
       },
   },
}
</script>

<style scoped>
.item-content {
    width: 50%;
    box-sizing: border-box;
    float: left;
    height: 240px;
    /* background-color: red; */
    padding: 5px;
}
.item-photo {
    width: 100%;
    height: 179px;
}
.item-title {
    height: 20px;
    line-height: 20px;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
}
.item-info {
    display: flex;
    justify-content: space-between;
     font-size: 12px;
}
.item-rmb {
    color: red;
}
.item-month-sall {
    color: #999;
}
</style>