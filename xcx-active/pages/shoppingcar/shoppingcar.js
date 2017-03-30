// pages/shoppingcar/shoppingcar.js
var delData = [];
var gConfig = getApp();
Page({
  data: {
    totalPrice: 0,
    isOrder: 'true',
    imgPath : gConfig.imgPath
  },
  onShow: function () {
    // 页面显示 
    var that = this;
    var shoppingcarData = wx.getStorageSync('shoppingcarData');
    if (shoppingcarData) {
      that.setData({
        shoppingListData: shoppingcarData,
        isOrder: ""
      })
      that.sumcalcFn();
    } else {
      that.setData({
        shoppingListData: [],
        isOrder: "true"
      })
      that.sumcalcFn();
    }
  },
  settlementFn: function () {
    var that = this;
    var orderData = wx.getStorageSync('shoppingcarData');

    wx.setStorage({
      key: "orderData",
      data: orderData
    })

    wx.navigateTo({
      url: '../orderConfirm/orderConfirm'
    })
  },
  decrFn: function (event) {
    /*--产品数量-1--*/
    var that = this;
    var cartid = event.currentTarget.dataset.cartid;
    var goodslist = that.data.shoppingListData;
    for (var i = 0; i < goodslist.length; i++) {
      if (goodslist[i].id == cartid) {
        if ((goodslist[i].moq - 1) < 1) {
          goodslist[i].moq = 1;
        } else {
          goodslist[i].moq = parseInt(goodslist[i].moq) - 1
        }
      }
    }

    /*--重新渲染--*/
    that.setData({
      shoppingListData: goodslist,
    })
    wx.setStorage({
      key: "shoppingcarData",
      data: goodslist
    })
    /*--求和--*/
    that.sumcalcFn();

  },
  incrFn: function (event) {
    /*--产品数量+1--*/
    var that = this;
    var cartid = event.currentTarget.dataset.cartid;
    var goodslist = that.data.shoppingListData;
    for (var i = 0; i < goodslist.length; i++) {
      if (goodslist[i].id == cartid) {
        goodslist[i].moq = parseInt(goodslist[i].moq) + 1;
      }
    }

    /*--重新渲染--*/
    that.setData({
      shoppingListData: goodslist,
    })
    wx.setStorage({
      key: "shoppingcarData",
      data: goodslist
    })
    /*--求和--*/
    that.sumcalcFn();

  },
  sumcalcFn: function () {
    /*--订单求和--*/
    var sumcalc = 0;
    var that = this;
    for (var i = 0; i < that.data.shoppingListData.length; i++) {
      var price = parseInt(that.data.shoppingListData[i].moq) * ((that.data.shoppingListData[i].retailPrice > 0 && that.data.shoppingListData[i].retailPromotionPrice > 0) ? that.data.shoppingListData[i].retailPromotionPrice : that.data.shoppingListData[i].retailPrice);
      sumcalc += price;
    }
    /*--重新渲染--*/
    that.setData({
      totalPrice: sumcalc.toFixed(2),
    })
  },
  removeFn: function (event) {
    /*--删除订单--*/
    var that = this;
    var cartid = event.currentTarget.dataset.cartid;
    var goodslist = that.data.shoppingListData;
    var index = {};
    for (let i = 0; i < goodslist.length; i++) {
      goodslist[i].index = i;//闭包
      if (goodslist[i].id == cartid) {
        wx.showModal({
          title: '删除提示',
          content: '您确定要删除该商品吗？',
          success: function (res) {
            if (res.confirm) {
              delData.push({
                'id':goodslist[i].id
              });
              wx.setStorageSync('delData', delData);

              goodslist.splice(goodslist[i].index, 1);/*从当前列表删除*/
              /*--重新渲染--*/
              wx.setStorage({
                key: "shoppingcarData",
                data: goodslist
              })
              if (goodslist.length > 0) {
                that.setData({
                  shoppingListData: goodslist,
                  isOrder: ""
                })
              } else {
                that.setData({
                  shoppingListData: goodslist,
                  isOrder: true
                })
              }
              /*--订单求和--*/
              that.sumcalcFn();
            }
          }
        })
      }
    }
  }
})