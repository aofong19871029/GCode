/**
 * @module cwx/hotel
 * @file 酒店 实现小程序MVC
 */
var cwx = require('./global.js').cwx;

var cwx_hotel = {
  processNotFound: function (path, query, entry) {
    cwx.request({
      url: "/restapi/soa2/14160/getmvcurl",
      data: {
        path,
        query,
        entry
      },
      success: function (res) {
        cwx.redirectTo({
          url: res.data.wechatUrl
        })
      }
    })
  }
};

module.exports = cwx_hotel;
