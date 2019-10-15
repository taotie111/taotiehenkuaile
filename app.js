App({
      // success:function(res){
        //success
      // },
      // fail:function(){
        //fail
      // },
      // complete:function(){
        //complete
      // }
  /**
   * 当小程序初始化完成时，会触发 onLaunch（全局只触发一次）
   */
  onLaunch: function () {
    // !!!
   
    wx.clearStorageSync()
    
    var storageData = wx.getStorageSync('postList');
    if(!storageData){
      // 如果postList缓存不存在
      var dataObj = require("data/data.js");
      wx.clearStorageSync();
      wx.setStorageSync('postList', dataObj.postList);
      // ！切记，同步设置缓存第二个参数不能带单引号！
      // 及时清数据缓存看效果！！！
    }
  },


  _getUserInfo: function () {
    var userInfoStorage = wx.getStorageSync('user');
    if (!userInfoStorage) {
      var that = this;
      wx.login({
        success: function () {
          wx.getUserInfo({
            success: function (res) {
              console.log(res);
              that.globalData.g_userInfo = res.userInfo
              wx.setStorageSync('user', res.userInfo)
            },
            fail: function (res) {
              console.log(res);
            }
          })
        }
      })
    }
    else {
      this.globalData.g_userInfo = userInfoStorage;
    }
  },
  // 添加全局变量(g前缀)
  globalData:{
    g_isPlayingMusic:false,
    
    // // 新增全局变量保存正在播放音乐的id号
    // g_currentMusicPostId:null,
    // doubanBase: 'http://t.yushu.im',
    // // 豆瓣API基地址

    g_userInfo:null
  },


  /**
   * 当小程序启动，或从后台进入前台显示，会触发 onShow
   */
  onShow: function (options) {
    
  },

  /**
   * 当小程序从前台进入后台，会触发 onHide
   */
  onHide: function () {
    
  },

  /**
   * 当小程序发生脚本错误，或者 api 调用失败时，会触发 onError 并带上错误信息
   */
  onError: function (msg) {
    
  }
})
