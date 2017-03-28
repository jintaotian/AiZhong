// pages/orderDetail/orderDetail.js
var gConfig = getApp();
var util = require('../../utils/md5.js');
Page({
  data: { ispaid: true },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    var that = this;
    if (options.ispaid == true || options.ispaid == 'true') {
      that.getOrderInfoFn(options.orderId);
      that.setData({ ispaid: '', orderId: options.orderId })
    } else {
      that.getOrderInfoFn(options.orderId);
      that.setData({ ispaid: true, orderId: options.orderId })
    }
  },
  getOrderInfoFn: function (orderId) {
    var that = this;
    var sign = util.hexMD5('orderId=' + orderId + gConfig.key);
    wx.request({
      url: gConfig.http + 'xcx/order/detail',
      data: {
        orderId: orderId,
        sign: sign
      },
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        console.log(res.data.data.company.name)
        var detailData = res.data.data;
        var amountPrice = 0;
        for (var i = 0; i < detailData.items.length; i++) {
          detailData.items[i].price = detailData.items[i].price.toFixed(2);
          amountPrice += detailData.items[i].price * detailData.items[i].qty;
        }
        detailData.retailPayAmount = parseFloat(detailData.retailPayAmount).toFixed(2);
        detailData.couponDiscount = parseFloat(detailData.couponDiscount).toFixed(2);
        detailData.items = detailData.items;

        that.setData({
          orderDeatilData: detailData,
          amountPrice:amountPrice.toFixed(2)
        })
      }

    })
  },
  //取消订单
  cancleFn: function (event) {
    var orderId = event.currentTarget.dataset.orderid;
    var sign = util.hexMD5('id=' + orderId + gConfig.key);
    wx.showModal({
      title: '取消提示',
      content: '您确定要取消该订单吗？',
      success: function (res) {
        if (res.confirm) {
          /*--重新渲染--*/
          wx.request({
            url: gConfig.http + 'xcx/order/del',
            data: {
              id: orderId,
              sign: sign
            },
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
    var sign = util.hexMD5('orderId=' + orderId + gConfig.key);
    wx.request({
      url: gConfig.http + 'xcx/wx/prepardId',
      data: {
        orderId: orderId,
        sign: sign
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
          'paySign': res.data.data.paySign,
          'success': function (res) {
            wx.switchTab({
              url: '../index/index'
            })
          }
        })
        // 微信支付接口
      }
    })
  }

})