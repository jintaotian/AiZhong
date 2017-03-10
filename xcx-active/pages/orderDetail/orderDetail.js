// pages/orderDetail/orderDetail.js
Page({
  data: {
    addrData: [{
      phoneNum: "123456789",
      userName: "小明",
      userAddr: "北京市朝阳区望京东大街望京SOHO塔2 C座2705"
    }]
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
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
  purchaseNowFn: function () {
    wx.requestPayment({
      'timeStamp': '',
      'nonceStr': '',
      'package': '',
      'signType': 'MD5',
      'paySign': '',
      'success': function (res) {
      },
      'fail': function (res) {
      }
    })
  }
})