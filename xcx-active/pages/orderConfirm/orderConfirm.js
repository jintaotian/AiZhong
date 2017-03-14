// pages/orderConfirm/orderConfirm.js
var gConfig = getApp();
Page({
  data: {},
  onLoad: function () {
    var that = this;
    that.setData({
      value: '请选择收货地址'
    })
  },
  onShow: function () {
    // 页面显示
    var that = this;
    var orderData = wx.getStorageSync('orderData');
    var userData = wx.getStorageSync('userData');
    that.setData({
      orderData: orderData,
    })
     //当地址为默认值时
    wx.getStorage({
      key:'userData',
      success:function(res){
           wx.request({
             url:gConfig.http+'xcx/address/list',
             data:{
                clientId:res.data.clientId
             },
             header: {
                'content-type': 'application/json'
              },
              success:function(res){
                console.log(res)
                that.setData({
                  firstData:res.data.data.list
                })
                var firstData=that.data.firstData
                    that.setData({
                       value: firstData[0].regionName + firstData[0].address,
                       mobile: firstData[0].mob,
                       name: firstData[0].consignee,
                       id: firstData[0].id,
                       isDefault:firstData[0].isDefault
                   })
              }
           })
      },
    })
       //当地址自己选择时
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
    that.getOrderInfoFn(userData.region, orderData)
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
          "region":userData.region
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
      }
    })
  },
  getOrderInfoFn: function (region, itemList) {
    var that = this;
    var itemListData = [];
    for (var i = 0; i < itemList.length; i++) {
      itemListData.push({
        qty: itemList[i].moq,
        skuId: itemList[i].id
      })
    }
    wx.request({
      url: gConfig.http + 'xcx/order/itemsAmount', //仅为示例，并非真实的接口地址
      data: {
        data: {
          region: region,
          itemList: itemListData
        }
      },
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        console.log(res)
        // 重新渲染页面
        that.setData({
          totalPrice: res.data.data.total,
          coupon: res.data.data.discount,
          couponId:res.data.data.couponId
        })
      }
    })
  }
})
