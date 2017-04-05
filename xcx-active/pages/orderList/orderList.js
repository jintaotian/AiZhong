// pages/orderList/orderList.js
var gConfig = getApp();
var util = require('../../utils/md5.js');
Page({
  data: {
    ispaid: true,
    imgPath: gConfig.imgPath
  },
  onShow: function () {
    this.unPaidListFn();
  },
  unPaidListFn: function () {
    var that = this;
    var userData = wx.getStorageSync('userData');
    var wxData = wx.getStorageSync('wxData');
    var sign = util.hexMD5('clientId=' + wxData.clientId + '&sdate=1&status=1' + gConfig.key);
    wx.request({
      url: gConfig.http + 'xcx/order/list',
      data: {
        clientId: wxData.clientId,
        sdate: 1,
        status: 1,
        sign: sign
      },
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        var listData = res.data.data;
        var j;
        for (var i = 0; i < res.data.data.length; i++) {
          for (j = 0; j < res.data.data[i].items.length; j++) {
            res.data.data[i].items[j].price = res.data.data[i].items[j].price.toFixed(2);
          }

          listData[i].amount = listData[i].amount.toFixed(2);
          listData[i].couponDiscount = listData[i].couponDiscount.toFixed(2);
          listData[i].retailPayAmount = listData[i].retailPayAmount.toFixed(2);
          res.data.data[i].items = res.data.data[i].items
        }
        that.setData({
          listData: listData,
          ispaid: true
        })
      }
    })
  },
  paidListFn: function () {
    var that = this;
    var userData = wx.getStorageSync('userData');
    var wxData = wx.getStorageSync('wxData');
    var sign = util.hexMD5('clientId=' + wxData.clientId + '&sdate=1&status=2' + gConfig.key);
    wx.request({
      url: gConfig.http + 'xcx/order/list',
      data: {
        clientId: wxData.clientId,
        sdate: 1,
        status: 2,
        sign: sign
      },
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        var listData = res.data.data;
        var j;
        for (var i = 0; i < res.data.data.length; i++) {
          for (j = 0; j < res.data.data[i].items.length; j++) {
            res.data.data[i].items[j].price = res.data.data[i].items[j].price.toFixed(2);
          }

          listData[i].amount = listData[i].amount.toFixed(2);
          listData[i].couponDiscount = listData[i].couponDiscount.toFixed(2);
          listData[i].retailPayAmount = listData[i].retailPayAmount.toFixed(2);
          res.data.data[i].items = res.data.data[i].items
        }
        that.setData({
          unListData: listData,
          ispaid: ''
        })
      }
    })
  },
  //未支付订单点击跳转订单详情页面
  orderDetailFn: function (event) {
    var orderId = event.currentTarget.dataset.orderid;
    wx.navigateTo({
      url: '../orderDetail/orderDetail?orderId=' + orderId + '&ispaid=' + this.data.ispaid
    })
  },
  //取消订单
  cancleFn: function (event) {
    var that = this;
    var orderId = event.currentTarget.dataset.orderid;
    var orderList = that.data.listData;
    var index = {};
    var sign = util.hexMD5('id=' + orderId + gConfig.key);
    for (let i = 0; i < orderList.length; i++) {
      orderList[i].index = i;//闭包
      if (orderList[i].id == orderId) {
        wx.showModal({
          title: '取消提示',
          content: '您确定要取消该订单吗？',
          success: function (res) {
            if (res.confirm) {
              orderList.splice(orderList[i].index, 1);/*从当前列表删除*/
              /*--重新渲染--*/
              wx.request({
                url: gConfig.http + 'xcx/order/del',
                data: { id: orderId, sign: sign },
                header: {
                  'content-type': 'application/json'
                },
                success: function (res) {
                  wx.showToast({
                    title: '取消成功',
                    icon: 'success',
                    duration: 1000
                  })
                  that.setData({
                    listData: orderList
                  })
                }
              })
            }
          }
        })
      }
    }
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
        console.log(res.data.data.timeStamp)
        console.log(res.data.data.nonceStr)
        console.log(res.data.data.package)
        console.log(res.data.data.paySign)
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