// pages/index/index.js
var gConfig = getApp();
var util = require('../../utils/md5.js');
Page({
  data: {},
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    this.getPositionFn()
  },
  purchaseFn: function (event) {
    /*循环数据查找商品是否加入购物车*/
    var that = this;
    var cartid = event.currentTarget.dataset.cartid;
    var goodslist = that.data.actData;
    var orderData = [];
    for (var i = 0; i < goodslist.length; i++) {
      if (goodslist[i].itemId == cartid) {
        orderData.push({
          id: goodslist[i].id,
          itemId: goodslist[i].itemId,
          companyId: goodslist[i].companyId,
          img: goodslist[i].img,
          defauliImg: goodslist[i].defauliImg,
          name: goodslist[i].name,
          companyName: goodslist[i].companyName,
          units: goodslist[i].units,
          norm: goodslist[i].norm,
          retailPrice: goodslist[i].retailPrice,
          moq: goodslist[i].moq <= 1 ? 1 : goodslist[i].moq
        })

        wx.setStorage({
          key: "orderData",
          data: orderData
        })

        wx.navigateTo({
          url: '../orderConfirm/orderConfirm'
        })

      }
    }

  },
  decrFn: function (event) {
    /*--产品数量-1--*/
    var that = this;
    var cartid = event.currentTarget.dataset.cartid;
    var goodslist = that.data.actData;
    var sum = that.data.sumretailPrice;
    for (var i = 0; i < goodslist.length; i++) {
      if (goodslist[i].itemId == cartid) {
        if ((goodslist[i].moq - 1) < 1) {
          goodslist[i].moq = 1;
        } else {
          goodslist[i].moq = parseInt(goodslist[i].moq) - 1;
        }
        //break;
      }
    }
    /*--设置data数据，重新渲染页面--*/
    that.setData({
      actData: goodslist,
    })
  },
  incrFn: function (event) {
    /*--产品数量+1--*/
    var that = this;
    var cartid = event.currentTarget.dataset.cartid;
    var goodslist = that.data.actData;
    for (var i = 0; i < goodslist.length; i++) {
      if (goodslist[i].itemId == cartid) {
        goodslist[i].moq = parseInt(goodslist[i].moq) + 1;
        //break; 
      }
    }
    /*--设置data数据，重新渲染页面--*/
    that.setData({
      actData: goodslist,
    })

  },
  joinCarFn: function (event) {
    /*--获取加入购物车的数据--*/
    var that = this;
    var goodslist = that.data.actData;
    var cartid = event.currentTarget.dataset.cartid;
    var shoppingcarData = [];
    for (var i = 0; i < goodslist.length; i++) {
      if (goodslist[i].itemId == cartid) {
        goodslist[i].shopcar = true
        that.setData({
          actData: goodslist
        })
      }
    }

    /*循环数据查找商品是否加入购物车*/
    for (var i = 0; i < goodslist.length; i++) {
      if (goodslist[i].shopcar == true) {
        shoppingcarData.push({
          id: goodslist[i].id,
          itemId: goodslist[i].itemId,
          companyId: goodslist[i].companyId,
          img: goodslist[i].img,
          defauliImg: goodslist[i].defauliImg,
          name: goodslist[i].name,
          companyName: goodslist[i].companyName,
          units: goodslist[i].units,
          norm: goodslist[i].norm,
          retailPrice: goodslist[i].retailPrice,
          moq: goodslist[i].moq <= 1 ? 1 : goodslist[i].moq
        })
      }
    }

    /*--将加入购物车数据存入缓存到后台数据库==ps:要将用户openId一起存入本地，用于辨别同一手机的不同购物车列表--*/
    wx.setStorage({
      key: "shoppingcarData",
      data: shoppingcarData
    })

    /*--加入购物车成功提示--*/
    wx.showToast({
      title: '已加入购物车',
      icon: 'shoppingcar',
      duration: 500
    })
  },
  getRegionFn: function (lati, longi) {
    //获取当前所在区域
    var that = this;
    var sign = util.hexMD5('x=' + lati + '&y=' + longi + gConfig.key);
    wx.request({
      url: gConfig.http + 'xcx/common/region',
      data: {
        x: lati,
        y: longi,
        sign: sign
      },
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        var region = res.data.data.region;
        var companyId = res.data.data.companyId;
        wx.setStorageSync('userData', {
          "region": res.data.data.region,
          "regionName": res.data.data.fullName,
          "companyId": res.data.data.companyId
        });
        that.getGoodsListFn(region);
        that.getCouponsFn(region, companyId)
      },
    })
  },
  getGoodsListFn: function (region) {
    //商品信息请求
    var that = this;
    var sign = util.hexMD5('region=' + region + gConfig.key);
    wx.request({
      url: gConfig.http + 'xcx/item/promotionitems',
      data: {
        region: region,
        sign: sign
      },
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        that.setData({
          actData: res.data.data
        })
      }
    })
  },
  getCouponsFn: function (region, companyId) {
    var that = this;
    var sign = util.hexMD5('companyId=' + companyId + '&region=' + region + gConfig.key);
    wx.request({
      url: gConfig.http + 'xcx/coupon/list',
      data: {
        region: region,
        companyId: companyId,
        sign: sign
      },
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        that.setData({
          couponsData: res.data.data,
        })
      }
    })
  },
  useCouponsFn: function (event) {
    wx.showToast({
      title: '下单自动使用',
      icon: 'success',
      duration: 2000,
      mask:true
    })
  },
  getPositionFn: function () {
    var that = this;
    wx.getLocation({
      type: 'wgs84',
      success: function (res) {
        that.setData({
          isPosition: ''
        })
        that.getRegionFn(res.latitude, res.longitude)
      },
      fail: function () {
        that.setData({
          isPosition: true
        })
      }
    })
  }
})