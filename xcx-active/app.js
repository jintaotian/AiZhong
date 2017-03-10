//app.js
App({
  onLaunch: function () {
    this.wxLogFn()
  },
  wxLogFn: function () {
    var that = this;
    wx.login({
      success: function (res) {
        if (res.code) {
          //发起网络请求
          wx.request({
            url: that.http + 'xcx/common/login',
            data: { code: res.code },
            header: { 'content-type': 'application/json' },
            success: function (res) {
              that.wxOpenid = res.data.data.wxOpenid;
              that.clientId = res.data.data.clientId;
            }
          })
        } else {
          console.log('获取用户登录态失败！' + res.errMsg)
        }
      }
    })
  },
  http: "https://xcx.51zhongzi.com/farms-msi/"
})