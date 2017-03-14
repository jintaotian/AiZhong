// pages/orderDetail/orderDetail.js
var gConfig = getApp();
Page({
  data: {},
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    //获取姓名，地址，电话,图片路径，服务商名称等信息
    var that = this;
    wx.request({
      url: gConfig.http + 'xcx/order/detail',
      data: {
        orderId: ''
      },
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        that.setData({
          addrData: res.data.data,
        })
      }

    })
  },
  onReady: function () {
    // 页面渲染完成
  },
  onShow: function () {
    // 页面显示
  },
  onHide: function () {
    // 页面隐藏
  },
  onUnload: function () {
    // 页面关闭
  },
  cancleOrderFn: function () {
    wx.switchTab({
      url: '../index/index'
    })
  },
  placeOrderFn: function () {
    // 下单方法
    var that = this;
    var orderInfoData = that.data.orderData;
    var userData = wx.getStorageSync('userData');
    var itemListData = [];
    for (var i = 0; i < orderInfoData.length; i++) {
      itemListData.push({
        "id": orderInfoData[i].id,
        "qty": orderInfoData[i].moq
      })
    }
    wx.request({
      url: gConfig.http + 'xcx/order/save',
      data: {
        data: {
          "appId": "wxaf16046e5515de4c",
          "clientAddrId": 513,
          "buyer": userData.clientId,
          "itemCartsList": [
            {
              "companyId": userData.companyId,
              "couponId": that.data.couponId,
              "itemList": itemListData,
              "key": "N" + userData.companyId
            }
          ],
          "logisticsId": 0,
          "orderSource": 3,
          "payMode": 1,
          "seller": userData.companyId,
          "region": userData.region
        }
      },
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {

        console.log(res)
        // 微信支付接口
        wx.requestPayment({
          'timeStamp': res.data.data.timeStamp,
          'nonceStr': res.data.data.nonceStr,
          'package': res.data.data.package,
          'signType': 'MD5',
          'paySign': res.data.data.paySign,
          'success': function (res) {
          },
          'fail': function (res) {
          }
        })
        // 微信支付接口
      },
      complete: function () {
        wx.removeStorageSync('shoppingcarData')
      }
    })
  },

})