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
      console.log(options.isDefault)
      var provinceId = options.region.slice(0, 2)
      var cityId = options.region.slice(0, 4)
      var areaId = options.region.slice(0, 6)
      this.getProvinceFn(0, provinceId);
      this.getCityFn(provinceId, cityId);
      this.getAreaFn(cityId, areaId);
    } else {
      this.getProvinceFn(0);
    }
  },
  onShow: function () {
    // 页面显示
  },
  consigneeFn: function (event) {
    this.data.consignee = event.detail.value;
  },
  mobFn: function (event) {
    var that=this;
    that.data.mob = event.detail.value;
    var mob=that.data.mob; 
    if(!(/^1[34578]\d{9}$/.test(this.data.mob))){
       wx.showToast({
              title: '号码格式有误',
              icon: 'success',
              duration: 500,
              success:function(){
                that.setData({
                     mob:''
                })
              }
            })
    }
  },
  addressFn: function (event) {
    this.data.address = event.detail.value;
  },
  provinceFn: function (event) {
    this.setData({
      pIndex: event.detail.value,
    })
    var valId = this.data.provinceData[event.detail.value].id;
    this.getCityFn(valId);
  },
  cityFn: function (event) {
    this.setData({
      cIndex: event.detail.value,
    })
    var valId = this.data.cityData[event.detail.value].id
    this.getAreaFn(valId);
  },
  areaFn: function (event) {
    var areaData = this.data.areaData;
    this.setData({
      aIndex: event.detail.value,
      region: areaData[event.detail.value].id,
    })
  },
  getProvinceFn: function (defaultCode, provinceId) {
    //获取省份
    var that = this;
    wx.request({
      url: gConfig.http + 'xcx/common/childregion',
      data: { id: defaultCode },
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        that.setData({
          provinceData: res.data.data
        })
        for (var i = 0; i < res.data.data.length; i++) {
          if (res.data.data[i].id == provinceId) {
            that.setData({
              pIndex: i
            })
          }
        }
      }
    })
  },
  getCityFn: function (provinceId, cityId) {
    //获取城市
    var that = this;
    wx.request({
      url: gConfig.http + 'xcx/common/childregion',
      data: { id: provinceId },
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        that.setData({
          cityData: res.data.data
        })
        for (var i = 0; i < res.data.data.length; i++) {
          if (res.data.data[i].id == cityId) {
            that.setData({
              cIndex: i
            })
          }
        }
      }
    })
  },
  getAreaFn: function (cityId, areaId) {
    //获取地区
    var that = this;
    wx.request({
      url: gConfig.http + 'xcx/common/childregion',
      data: { id: cityId },
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        that.setData({
          areaData: res.data.data
        })
        for (var i = 0; i < res.data.data.length; i++) {
          if (res.data.data[i].id == areaId) {
            that.setData({
              aIndex: i
            })
          }
        }
      }
    })
  },
  editAddrFn: function () {
    // 修改地址
    var that = this;
    console.log(that.data.address)
    
    var userData = wx.getStorageSync('userData')
    wx.request({
      url: gConfig.http + 'xcx/address/update',
      data: {
        wxOpenid: userData.wxOpenid,
        clientId: userData.clientId,
        id: that.data.id,
        consignee: that.data.consignee,
        mob: that.data.mob,
        region: that.data.region,
        address: that.data.address,
        isDefault:1
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
    if(that.data.consignee && that.data.mob && that.data.address && that.data.aIndex && that.data.pIndex && that.data.cIndex){
        wx.request({
          url: gConfig.http + 'xcx/address/add',
          data: {
            wxOpenid: userData.wxOpenid,
            clientId: userData.clientId,
            consignee: that.data.consignee,
            mob: that.data.mob,
            region: that.data.region,
            address: that.data.address,
            isDefault:1
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
  }else{
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