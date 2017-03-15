// pages/orderDetail/orderDetail.js
var gConfig = getApp();
Page({
  data: {ispaid:true},
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    var that = this;
    if(options.ispaid == true || options.ispaid == 'true'){
      that.getOrderInfoFn(options.orderId);
      that.setData({ispaid:''})
    }else{
       that.getOrderInfoFn(options.orderId);
       that.setData({ispaid:true})
    }
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
  getOrderInfoFn: function (orderId) {
    var that = this;
    wx.request({
      url: gConfig.http + 'xcx/order/detail',
      data: {
        orderId: orderId
      },
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        console.log(res)
        that.setData({
          orderDeatilData: res.data.data,
        })
      }

    })
  },
  //取消订单
  cancleFn: function (event) {
    var orderId = event.currentTarget.dataset.orderid;
    wx.showModal({
      title: '取消提示',
      content: '您确定要取消该订单吗？',
      success: function (res) {
        if (res.confirm) {
          /*--重新渲染--*/
          wx.request({
            url: gConfig.http + 'xcx/order/del',
            data: { id: orderId },
            header: {
              'content-type': 'application/json'
            },
            success: function (res) {
              wx.showToast({
                title: '取消成功',
                icon: 'success',
                duration: 500
              })
              setTimeout(function () {
                wx.switchTab({
                  url: '../index/index'
                })
              }, 1000)
            }
          })

        }
      }
    })
  },
  placeOrderFn: function (event) {
    // 下单方法
    var that = this;
    var orderId = event.currentTarget.dataset.orderid;
    var userData = wx.getStorageSync('userData');
    wx.request({
      url: gConfig.http + 'xcx/wx/prepardId',
      data: {
        orderId: orderId
      },
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        // 微信支付接口
        wx.requestPayment({
          'timeStamp': res.data.data.timeStamp,
          'nonceStr': res.data.data.nonceStr,
          'package': res.data.data.package,
          'signType': 'MD5',
          'paySign': res.data.data.paySign
        })
        // 微信支付接口
      }
    })
  }

})