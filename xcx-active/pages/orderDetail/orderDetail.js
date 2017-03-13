// pages/orderDetail/orderDetail.js
var gConfig=getApp();
Page({
  data:{},
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    //获取姓名，地址，电话,图片路径，服务商名称等信息
    var that=this;
    wx.request({
      url:gConfig.http + 'xcx/order/detail',
      data:{
         orderId:''
      },
      header: {
         'content-type': 'application/json'
      },
      success:function(res){
           that.setData({
             addrData:res.data.data,
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
  },

})