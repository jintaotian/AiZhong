// pages/addrEdit/addrEdit.js
var gConfig = getApp();
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
  },
  onShow: function () {
    // 页面显示
    var userData = wx.getStorageSync('userData')
    this.setData({ regionName: userData.regionName })
  },
  consigneeFn: function (event) {
    this.data.consignee = event.detail.value;
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
  isDefaultFn: function (event) {
    this.data.isDefault = event.detail.value;
    console.log(event.detail.value)
  },
  editAddrFn: function () {
    // 修改地址
    var that = this;
    var userData = wx.getStorageSync('userData')
    wx.request({
      url: gConfig.http + 'xcx/address/update',
      data: {
        wxOpenid: userData.wxOpenid,
        clientId: userData.clientId,
        id: that.data.id,
        consignee: that.data.consignee,
        mob: that.data.mob,
        region: userData.region,
        address: that.data.address,
        isDefault: that.data.isDefault ? 1 : 0
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
    var userData = wx.getStorageSync('userData');
    if (that.data.consignee && that.data.mob && that.data.address) {
      wx.request({
        url: gConfig.http + 'xcx/address/add',
        data: {
          wxOpenid: userData.wxOpenid,
          clientId: userData.clientId,
          consignee: that.data.consignee,
          mob: that.data.mob,
          region: userData.region,
          address: that.data.address,
          isDefault: that.data.isDefault ? 1 : 0
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
    wx.request({
      url: gConfig.http + 'xcx/address/delete',
      data: {
        id: that.data.id
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