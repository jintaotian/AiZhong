// pages/coupons/coupons.js
var gConfig=getApp();
Page({
  data: {
    isReceive: "true",
    isAble: '',
    amount:0,
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    var that=this;
    //获取优惠券列表
     wx.getStorage({
      key: 'userData',
      success: function (res) {
        wx.request({
          url: gConfig.http + 'xcx/coupon/mycoupons',
          data: {
            clientId: res.data.clientId,
            useStatus:1
          },
          header: {
            'content-type': 'application/json'
          },
          success: function (res) {
            that.setData({
               receiveData:res.data.data,
            })
          }
        })
      }
    })
    this.setData({
      amount : options.price
    })
  },
  onReady: function () {
    // 页面渲染完成
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
  receiveTabFn: function () {
    this.setData({
      isReceive: true
    })
     wx.getStorage({
      key: 'userData',
      success: function (res) {
        wx.request({
          url: gConfig.http + 'xcx/coupon/mycoupons',
          data: {
            clientId: res.data.clientId,
            useStatus:1
          },
          header: {
            'content-type': 'application/json'
          },
          success: function (res) {
            that.setData({
               receiveData:res.data.data,
            })
          }
        })
      }
    })
  },
  unreceiveTabFn: function () {
    this.setData({
      isReceive: ""
    })
       var that=this;
       wx.getStorage({
        key: 'userData',
        success: function (res) {
            wx.request({
              url: gConfig.http + 'xcx/coupon/list',
              data: {
                companyId:res.data.companyId,
                region:res.data.region
              },
              header: {
                'content-type': 'application/json'
              },
              success: function (res) {
                console.log(res)
                that.setData({
                  unreceiveData:res.data.data,
                  isReceive:''
                })
              }
            })
        }
       })
  },
  receiveFn: function () {
    wx.showToast({
      title: '',
      icon: 'success',
      duration: 2000
    })
  },
  //点击优惠劵时领取
  unreceiveFn: function (event) {
     var that=this;
     var unreceiveData=that.data. unreceiveData;
     var index = parseInt(event.currentTarget.dataset.index);
     var companyId,content,discount,endTime,fixedDays,fullPrice,id,ledQty,name,qty,qtyTypes,startTime,types,useEndTime
     for (var i = 0; i <  unreceiveData.length; i++) {
            if(index==i){
            companyId = unreceiveData[i].companyId,
            content = unreceiveData[i].content,
            discount = unreceiveData[i].discount,
            endTime = unreceiveData[i].endTime,
            fixedDays = unreceiveData[i].fixedDays,
            id = unreceiveData[i].id,
            fullPrice=unreceiveData[i].fullPrice,
            ledQty=unreceiveData[i].ledQty,
            name=unreceiveData[i].name,
            qty=unreceiveData[i].qty,
            qtyTypes=unreceiveData[i].qtyTypes,
            startTime=unreceiveData[i].startTime,
            types=unreceiveData[i].types,
            useEndTime=unreceiveData[i].useEndTimeuseEndTime
      }
      }
       wx.getStorage({
        key: 'userData',
        success: function (res) {
        wx.request({
          url: gConfig.http + 'xcx/coupon/getcoupon',
          data: {
            companyId:res.data.companyId,
            id:id,
          },
          header: {
            'content-type': 'application/json'
          },
          success: function (res) {
             wx.showToast({
              title: '领取成功',
              icon: 'success',
              duration: 500
            })
          }
        })
        }
       })
  },
  //点击优惠券返回orderDetail页面
  couponsOptFn: function (event) {
    var that=this;
    var receiveData=that.data.receiveData;
    var index=parseInt(event.currentTarget.dataset.index);
    console.log(index);
    var content,discount,endTime,fixedDays,fullPrice,id,ledQty,name,qty,qtyTypes,startTimes,types,useEndTime,code;
      for(var i=0;i<receiveData.length;i++){
        if(index==i){
            content=receiveData[i].content;
            discount=receiveData[i].discount;
            endTime=receiveData[i].endTime;
            fixedDays=receiveData[i].fixedDays;
            fullPrice=receiveData[i].fullPrice;
            id=receiveData[i].id;
            ledQty=receiveData[i].ledQty;
            name=receiveData[i].name;
            qty=receiveData[i].qty;
            qtyTypes=receiveData[i].qtyTypes;
            startTimes=receiveData[i].startTimes;
            types=receiveData[i].types;
            useEndTime=receiveData[i].useEndTime;
            code=receiveData[i].code;
        }
      }
      console.log(id)
    wx.setStorage({
      key:'couponsData',
      data:{
            content:content,
            discount:discount,
            endTime:endTime,
            fixedDays:fixedDays,
            fullPrice:fullPrice,
            id:id,
            ledQty:ledQty,
            name:name,
            qty:qty,
            qtyTypes:qtyTypes,
            startTimes:startTimes,
            types:types,
            useEndTime:useEndTime,
            code:code,
      },
      success: function(res){
        wx.navigateBack({
          dleta:1
        })
      }
    })
  }
})