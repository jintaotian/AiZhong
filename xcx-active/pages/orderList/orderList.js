// pages/orderList/orderList.js
var gConfig=getApp();
Page({
  data:{
    ispaid:true
  },
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
    //获取未支付数据
    
    var that=this;
      wx.getStorage({
      key: 'userData',
      success: function (res) {
        wx.request({
          url: gConfig.http + 'xcx/order/list',
          data: {
            clientId:res.data.clientId,
            sdate:1,
            status:1
          },
          header: {
            'content-type': 'application/json'
          },
          success: function (res) {
            console.log(res)
            that.setData({
              listData: res.data.data
            })
          }
        })
      }
    })
    
  },
  onReady:function(){
    // 页面渲染完成
  },
  onShow:function(){
    // 页面显示
  },
  onHide:function(){
    // 页面隐藏
  },
  onUnload:function(){
    // 页面关闭
  },
  switchPaidFn:function(e){
    var that=this;
    that.setData({ispaid:true})
     wx.getStorage({
      key: 'userData',
      success: function (res) {
        wx.request({
          url: gConfig.http + 'xcx/order/list',
          data: {
            clientId:res.data.clientId,
            sdate:1,
            status:1
          },
          header: {
            'content-type': 'application/json'
          },
          success: function (res) {
            console.log(res)
            that.setData({
              listData: res.data.data
            })
          }
        })
      }
    })
  },
  //取消订单
  overFn:function(event){
     var that=this;
     var listData=that.data.listData;
     var index = parseInt(event.currentTarget.dataset.index);
     var id;
     for (var i = 0; i < listData.length; i++) {
          if(index==i){
            id = listData[i].id
     }
    }
    wx.showModal({
        title: '取消提示',
        content: '您确定要取消此订单吗？',
        duration: 500,
        success:function(res){
             if(res.confirm){
                 wx.request({
                    url:gConfig.http+'xcx/order/del',
                    data:{
                        id:id
                    },
                    header: {
                          'content-type': 'application/json'
                        },
                        success:function(res){
                          console.log(res)
                        }
                  })
             }else{}
        }
    })
    
  },
  switchUnPaidFn:function(){
    var that=this;
    that.setData({ispaid:false})
     wx.getStorage({
      key: 'userData',
      success: function (res) {
        wx.request({
          url: gConfig.http + 'xcx/order/list',
          data: {
            clientId: res.data.clientId,
            sdate:1,
            status:2
          },
          header: {
            'content-type': 'application/json'
          },
          success: function (res) {
            console.log(res)
            that.setData({
              unListData: res.data.data
            })
          }
        })
      }
    })
  },
  //未支付订单点击跳转订单详情页面
  listDataFn:function(){
      wx.navigateTo({
         url:'../orderDetail/orderDetail'
      })
  },
  unListDataFn:function(){
    wx.navigateTo({
      url:'../orderDetail/orderDetail'
    })
  }
})