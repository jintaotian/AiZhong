// pages/orderList/orderList.js
var gConfig = getApp();
Page({
  data: {
    ispaid: true
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
  },
  onReady: function () {
    // 页面渲染完成、
    this.unPaidListFn()
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
  unPaidListFn: function () {
    var that = this;
    var userData = wx.getStorageSync('userData')
    console.log(userData)
    wx.request({
      url: gConfig.http + 'xcx/order/list',
      data: {
        clientId: userData.clientId,
        sdate: 1,
        status: 1
      },
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        console.log(res)
        that.setData({
          listData: res.data.data,
          ispaid: true
        })
      }
    })

  },
  paidListFn: function () {
    var that = this;
    var userData = wx.getStorageSync('userData')
    console.log(userData)
    console.log(userData.clientId)
    wx.request({
      url: gConfig.http + 'xcx/order/list',
      data: {
        clientId: userData.clientId,
        sdate: 1,
        status: 2
      },
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        console.log(res)
        that.setData({
          unListData: res.data.data,
          ispaid: false
        })
      }
    })
  },
  //未支付订单点击跳转订单详情页面
  orderDetailFn: function (event) {
    var orderId = event.currentTarget.dataset.orderid;
    console.log(orderId)
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
                data: { id: orderId },
                header: {
                  'content-type': 'application/json'
                },
                success: function (res) {
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