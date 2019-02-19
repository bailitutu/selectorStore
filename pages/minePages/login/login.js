// pages/minePages/login/login.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showPass:false,
    password:'',
    userName:'',
    isSubmit:false //是否正在提交
  },
  // 输入账号
  inputAccount(e){
    this.setData({
      userName:e.detail.value
    })
  },

  // 输入密码
  inputPass(e){
    this.setData({
      password:e.detail.value
    })
  },
  // 显示密码
  showPassHandle(){
    this.setData({
      showPass:!this.data.showPass
    })
  },
// 登录
  submitTap(){
    const { isSubmit, userName, password} = this.data;
    
    if(!isSubmit){
      if( userName == "" || !userName){
        wx.showToast({
          title: '请先输入账号',
          icon: 'none',
        })
        return false;
      }
      if (password == "" || !password) {
        wx.showToast({
          title: '密码不能为空',
          icon: 'none',
        })
        return false;
      }


      this.setData({
        isSubmit:true
      })

      let  checkLogin = setTimeout(()=>{
        let {isSubmit} = this.data;
        if (isSubmit){
          wx.showToast({
            title: '登录超时，请重新登录',
            icon:'none'
          })
          this.setData({
            isSubmit:false
          })
        }
      },5000)

      app.submit('/loginApi/login',
        {
          account: this.data.userName,
          password: this.data.password,
          type:2
        },
        (res) => {
          this.setData({
            isSubmit : false
          })
          clearTimeout(checkLogin);
          wx.setStorageSync('busId', res.userId);
          app.globalData.busId = res.userId;
          wx.switchTab({
            url: '/pages/salesPages/index/index',
          })
        },(error)=>{
          this.setData({
            isSubmit: false
          })
          clearTimeout(checkLogin);
        }

      )
    }
  },
  
  forgetPass(){
    app.goNa("忘记密码");
  }
  
})