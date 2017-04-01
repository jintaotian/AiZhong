//app.js
App({
  onLaunch: function () {
    wx.clearStorage();
    this.wxLogFn();
  },
  wxLogFn: function () {
    var that = this;
    var util = require('utils/md5.js');
    wx.login({
      success: function (res) {
        var sign = util.hexMD5('code='+res.code+that.key);
        if (res.code) {
          //发起网络请求
          wx.request({
            url: that.http + 'xcx/common/login',
            data: {
              code: res.code,
              sign: sign
            },
            header: { 'content-type': 'application/json' },
            success: function (res) {
              wx.setStorageSync('wxData', {
                "wxOpenid": res.data.data.wxOpenid,
                "clientId": res.data.data.clientId
              });
            }
          })
        } else {
          console.log('获取用户登录态失败！' + res.errMsg)
        }
      }
    })
  },
  http: "https://msi-mall.51zhongzi.com/",
  // http:"https://xcx.51zhongzi.com/farms-msi/",
  imgPath: "https://img.51zhongzi.com/",
  key: '&key=9da1ec1d11f0401968d52cab64df46d8'
})