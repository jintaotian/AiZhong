// pages/orderConfirm/orderConfirm.js
var gConfig = getApp();
Page({
  data: {
    adr: true
  },
  onLoad: function () {
    var that = this;
    that.setData({
      value: '请选择收货地址'
    })
  },
  onShow: function () {
    // 页面显示
    var that = this;
    var totalPrice = 0;
    var orderData = wx.getStorageSync('orderData');
    var userData = wx.getStorageSync('userData');
    // 合计金额
    for (var i = 0; i < orderData.length; i++) {
      var price = parseInt(orderData[i].moq) * parseInt(orderData[i].retailPrice);
      totalPrice += price;
    }
    // 重新渲染页面
    that.setData({
      orderData: orderData,
      totalPrice: totalPrice,
      coupon: 0,
      freight: 0
    })
    //获取收货地址
    wx.getStorage({
      key: 'addressData',
      success: function (res) {
        that.setData({
          value: res.data.regionName + res.data.address,
          mobile: res.data.mob,
          name: res.data.consignee,
          id: res.data.id
        })
      }
    })
    // 从后台获取商品相关数据
    that.getOrderInfoFn(userData.region,orderData)
  },
  onHide: function () {
    // 页面隐藏
  },
  onUnload: function () {
    // 页面关闭
  },
  addrOptFn: function () {
    wx.navigateTo({
      url: '../addrOpt/addrOpt'
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
              "companyId": that.data.orderData[0].companyId,
              "couponId": "001abc97de1352790c5aa9ff2d3e6c66",
              "itemList": itemListData,
              "key": "N" + that.data.orderData[0].companyId
            }
          ],
          "logisticsId": 0,
          "orderSource": 3,
          "payMode": 1,
          "seller": that.data.orderData[0].companyId
        }
      },
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {

        console.log(res)
        // 微信支付接口
        // wx.requestPayment({
        //   'timeStamp': '',
        //   'nonceStr': '',
        //   'package': res.data.data.prepayId,
        //   'signType': 'MD5',
        //   'paySign': '',
        //   'success': function (res) {
        //   },
        //   'fail': function (res) {
        //   }
        // })
        // 微信支付接口
      }
    })
  },
  getOrderInfoFn: function (region,itemList) {
    var that = this;
    var itemListData = [];
    for(var i = 0; i < itemList.length;i++){
      itemListData.push({
        qty:itemList[i].moq,
        skuId:itemList[i].id
      })
    }
    wx.request({
      url: gConfig.http + 'xcx/order/itemsAmount', //仅为示例，并非真实的接口地址
      data: {
        region: region,
        itemList: itemListData
      },
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        console.log(res)
      }
    })
  }
})