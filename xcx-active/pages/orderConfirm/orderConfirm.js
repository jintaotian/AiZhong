// pages/orderConfirm/orderConfirm.js
var gConfig = getApp();
var util = require('../../utils/md5.js');
Page({
  data: { value: '请选择收货地址',imgPath : gConfig.imgPath,isDoubleClick:''},
  onShow: function () {
    // 页面显示
    var that = this;
    var userData = wx.getStorageSync('userData');
    var addressData = wx.getStorageSync('addressData');
    if (addressData) {
      //当地址自己选择时
      that.setData({
        value: addressData.regionName + addressData.address,
        mobile: addressData.mob,
        name: addressData.consignee,
        id: addressData.id
      })
    } else {
      //获取默认地址
      that.setDefaultAddrFn();
    }
    // 从后台获取商品相关数据
    that.getOrderInfoFn(userData.region,userData.companyId)
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
    var wxData = wx.getStorageSync('wxData');
    var itemListData = [];
    var delData = [];
    for (var i = 0; i < orderInfoData.length; i++) {
      itemListData.push({
        "id": orderInfoData[i].skuId,
        "qty": orderInfoData[i].qty
      })
      
    }
    wx.setStorageSync('delData', itemListData);
    if (that.data.mobile) {
      that.setData({isDoubleClick:true});
      wx.request({
        url: gConfig.http + 'xcx/order/save',
        data: {
          data: {
            "appId": "wxaf16046e5515de4c",
            "clientAddrId": that.data.id,
            "buyer": wxData.clientId,
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
          // 微信支付接口
          wx.requestPayment({
            'timeStamp': res.data.data.timeStamp,
            'nonceStr': res.data.data.nonceStr,
            'package': res.data.data.package,
            'signType': 'MD5',
            'paySign': res.data.data.paySign,
            'success': function (res) {
              console.log(res)
              wx.switchTab({
                url: '../index/index'
              })
            },
            'fail': function (res) {
              wx.redirectTo({
                url: '../orderList/orderList'
              })
            }
          })
          // 微信支付接口
        },
        complete: function () {
          wx.setStorageSync('shoppingcarData', []);
          wx.removeStorageSync('addressData');
        }
      })
    } else {
      wx.showToast({
        title: '请填写收货地址',
        icon: 'loading',
        duration: 1000
      })
    }
  },
  getOrderInfoFn: function (region,companyId) {
    var that = this;
    var orderData = wx.getStorageSync('orderData');
    var itemListData = [];
    for (var i = 0; i < orderData.length; i++) {
      itemListData.push({
        qty: orderData[i].moq,
        skuId: orderData[i].id
      })
    }
    wx.request({
      url: gConfig.http + 'xcx/order/itemsAmount',
      data: {
        data: {
          companyId:companyId,
          region: region,
          itemList: itemListData
        }
      },
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        var orderPrice = 0;
        for(var i =0; i < res.data.data.itemList.length;i++){
            res.data.data.itemList[i].price = res.data.data.itemList[i].price.toFixed(2);
            orderPrice += res.data.data.itemList[i].price * res.data.data.itemList[i].qty
        }
        // 重新渲染页面
        that.setData({
          orderData:res.data.data.itemList,
          couponId:res.data.data.couponId,
          totalPrice: (res.data.data.total <= 0 ? 0 : res.data.data.total).toFixed(2),
          coupon: res.data.data.discount.toFixed(2),
          couponId: res.data.data.couponId,
          itemListLen: res.data.data.itemList.length,
          orderPrice: orderPrice.toFixed(2)
        })
      }
    })
  },
  setDefaultAddrFn: function () {
    var that = this;
    var userData = wx.getStorageSync('userData');
    var wxData = wx.getStorageSync('wxData');
    var sign = util.hexMD5('clientId=' + wxData.clientId + gConfig.key);
    wx.request({
      url: gConfig.http + 'xcx/address/list',
      data: {
        clientId: wxData.clientId,
        sign: sign
      },
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        var addrList = res.data.data.list;
        for (var i = 0; i < addrList.length; i++) {
          if (addrList[i].isDefault == 1) {
            that.setData({
              value: addrList[i].regionName + addrList[i].address,
              mobile: addrList[i].mob,
              name: addrList[i].consignee,
              id: addrList[i].id
            })
          }
        }
      }
    })
  }
})
