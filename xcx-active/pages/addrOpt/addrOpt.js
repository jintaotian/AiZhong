// pages/addrOpt/addrOpt.js
var gConfig = getApp();
var util = require('../../utils/md5.js');
Page({
  data: {},
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    var that = this;
    that.setData({
      management: options.management
    })
  },
  onShow:function(){
    this.getAddrListFn();
    this.setData({isDoubleClick:''});
  },
  editorFn: function (event) {
    var that = this;
    var consignee, mob, region, address, isDefault, id;
    var addrData = that.data.addrData;
    var regionId = event.currentTarget.dataset.region;
    for (var i = 0; i < addrData.length; i++) {
      if (addrData[i].id == regionId) {
        consignee = addrData[i].consignee,
          mob = addrData[i].mob,
          region = addrData[i].region,
          address = addrData[i].address,
          isDefault = addrData[i].isDefault,
          id = addrData[i].id
      }
    }
    wx.navigateTo({
      url: '../addrEdit/addrEdit?consignee=' + consignee + '&mob=' + mob + '&region=' + region + '&address=' + address + '&isDefault=' + isDefault + '&id=' + id
    })
  },
  creatAddrFn: function () {
    this.setData({isDoubleClick:true});
    wx.navigateTo({
      url: '../addrEdit/addrEdit'
    })
  },
  getAddrListFn: function () {
    // 获取地址列表
    var that = this;
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
        that.setData({
          addrData: res.data.data.list
        })
      }
    })
  },
  choiceFn: function (event) {
    var that = this;
    var addrData = that.data.addrData;
    var index = parseInt(event.currentTarget.dataset.index);
    var consignee, mob, region, address, isDefault, id, regionName;
    for (var i = 0; i < addrData.length; i++) {
      if (index == i) {
        consignee = addrData[i].consignee,
          mob = addrData[i].mob,
          region = addrData[i].region,
          address = addrData[i].address,
          isDefault = addrData[i].isDefault,
          id = addrData[i].id,
          regionName = addrData[i].regionName
        that.setData({
          isDefault: 1
        })
      } else {
        that.setData({
          isDefault: 0
        })
      }
    }
    if (that.data.management) {

    } else {
      wx.setStorage({
        key: 'addressData',
        data: {
          'consignee': consignee,
          'mob': mob,
          'region': region,
          'address': address,
          'isDefault': isDefault,
          'id': id,
          'regionName': regionName
        },
        success: function (res) {
          wx.navigateBack({
            delta: 1
          })
        }
      })
    }
  }
})