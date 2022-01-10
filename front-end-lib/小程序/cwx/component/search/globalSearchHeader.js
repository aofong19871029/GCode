/**
 * 全部搜索
 * @module component/globalSearch
 */
// pages/search/globalSearchHeader/globalSearchHeader.js
import { cwx, CPage } from '../../cwx.js';

// var systeminfo = wx.getSystemInfoSync();
// var windowWidth = systeminfo.windowWidth;
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
      searchIconLeftOne:0,
      searchIconLeftTwo:0,
  },

  /**
   * 组件的方法列表
   */
  methods: {
    jumpToGlobalSearchHome: function () {
      cwx.navigateTo({
        url: '/pages/search/search'
      })
      // this.ubtTrace('wx_search_page', {
      //   actionCode: 'searchhome',
      //   actionType: 'click',
      // })
    },
  }
})
