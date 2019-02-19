// pages/minePages/changePass/changePass.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    passOne:'',
    passTwo:'',
    busId:''
  },
  onLoad(opt) {
    this.setData({
      busId: opt.busId
    })
  },
  inputPassOne(e){
    this.setData({
      passOne:e.detail.value
    })
  },
  inputPassTwo(e){
    this.setData({
      passTwo: e.detail.value
    })
  },
  submitFn(){
    const { passOne, passTwo, busId} = this.data;
    if(!passOne || passOne == ''){
      return false;
    }
    if(!passTwo || passTwo == ''){
      wx.showToast({
        title: '请确认密码',
        icon:"none"
      })
      return false;
    }  
    if(passOne !== passTwo){
      wx.showToast({
        title: '两次输入的密码不一致',
        icon: "none"
      })
      return false;
    }


    app.submit('/loginApi/updatePwdByForget',{
      password:passOne,
      passwordTwo:passTwo,
      userId:busId,
      type:1
    },(res)=>{
      wx.showToast({
        title: '设置成功',
        success(){
          setTimeout(()=>{
            app.goRe("登录");
          },1500)
        }
      })
    })
  }
})