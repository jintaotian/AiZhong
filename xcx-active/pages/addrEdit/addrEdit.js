// pages/addrEdit/addrEdit.js
var gConfig = getApp();
var util = require('../../utils/md5.js');
Page({
  data: {
    isAdd: true,
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    if (options.region) {
      this.setData({
        consignee: options.consignee,
        mob: options.mob,
        address: options.address,
        region: options.region,
        id: options.id,
        isAdd: '',
        isDefault:options.isDefault
      })
    }
    var that=this;
    that.setData({
      isDefault:0,
    })
  },
  onShow: function () {
    // 页面显示
    var userData = wx.getStorageSync('userData')
    this.setData({ regionName: userData.regionName })
  },
  consigneeFn: function (event) {
    this.data.consignee = event.detail.value;
  },
  isDefaultFn:function(event){
    var that=this;
    that.data.isDefault= event.detail.value;
    if(that.data.isDefault){
       that.setData({
          isDefault:1
       })
    }else{
         that.setData({
          isDefault:0
       })
    }
    console.log(this.data.isDefault)
  },
  mobFn: function (event) {
    var that = this;
    that.data.mob = event.detail.value;
    var mob = that.data.mob;
    if (!(/^1[34578]\d{9}$/.test(this.data.mob))) {
      wx.showToast({
        title: '号码格式有误',
        icon: 'success',
        duration: 500,
        success: function () {
          that.setData({
            mob: ''
          })
        }
      })
    }
  },
  addressFn: function (event) {
    this.data.address = event.detail.value;
  },
  editAddrFn: function () {
    // 修改地址
    var that = this;
    var userData = wx.getStorageSync('userData');
    var wxData = wx.getStorageSync('wxData')
    wx.request({
      url: gConfig.http + 'xcx/address/update',
      data: {
        wxOpenid: wxData.wxOpenid,
        clientId: wxData.clientId,
        id: that.data.id,
        consignee: that.data.consignee,
        mob: that.data.mob,
        region: userData.region,
        address: that.data.address,
        isDefault: that.data.isDefault
      },
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        wx.showToast({
          title: '修改成功',
          icon: 'success',
          duration: 500
        })
        setTimeout(function () {
          wx.navigateBack({
            delta: 1
          })
        }, 1000)

      }
    })
  },
  addAddrFn: function () {
    // 新增地址
    var that = this;
    console.log(that.data.isDefault)
    var userData = wx.getStorageSync('userData');
    var wxData = wx.getStorageSync('wxData');
    var sign = util.hexMD5(gConfig.key);
    if (that.data.consignee && that.data.mob && that.data.address) {
      wx.request({
        url: gConfig.http + 'xcx/address/add',
        data: {
          wxOpenid: wxData.wxOpenid,
          clientId: wxData.clientId,
          consignee: that.data.consignee,
          mob: that.data.mob,
          region: userData.region,
          address: that.data.address,
          isDefault: that.data.isDefault
        },
        header: {
          'content-type': 'application/json'
        },
        success: function (res) {
          wx.showToast({
            title: '新增成功',
            icon: 'success',
            duration: 500
          })
          setTimeout(function () {
            wx.navigateBack({
              delta: 1
            })
          }, 1000)

        }
      })
    } else {
      wx.showToast({
        title: '信息不完整',
        icon: 'success',
        duration: 500
      })
    }
  },
  removeAddrFn: function () {
    // 删除地址
    var that = this;
    var sign = util.hexMD5('id=' + that.data.id + gConfig.key);
    wx.request({
      url: gConfig.http + 'xcx/address/delete',
      data: {
        id: that.data.id,
        sign:sign
      },
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        wx.navigateBack({
          delta: 1
        })
      }
    })
  },
})