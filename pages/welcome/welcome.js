Page(
  {
    onTapJump:function(event){
      wx.switchTab({
        url: '../course/course',
        success:function(){
          console.log("jump success")
        },
        fail:function(){
          console.log("jump failed")
        },
        complete:function(){
          console.log("jump complete")
        }
      })
    },
      onShareAppMessage: function () {
      return {
        title: 'MOOC中西方文化交流平台',
        desc: '精心打造中西文化、地方文化交流的平台',
        path: "/pages/welcome/welcome"
      }
    }
  }


)

