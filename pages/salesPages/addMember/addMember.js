var app = getApp();

var util = require('../../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hasSend: false,
    memberName: '',
    memberPhone: '',
    memberBirthday: '',
    memberSex: '男',
    code: '', //输入的验证码
    gotCode: '',//获取到的验证码,
    time: 60,
    today:''

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad:function (options) {

    let today = util.formatDate(new Date());
    this.setData({
      today:today
    })
  },

  inputChange(e){
      const { attr } = e.currentTarget.dataset;
      this.setData({
          [attr]:e.detail.value
      })
  },

  // 选择性别
  selSex(){
    const that = this;
    wx.showActionSheet({
      itemList: ['男','女'],
      success(res){
        if(!res.tapIndex){
          that.setData({
            memberSex:'男'
          })
        }else{
          that.setData({
            memberSex: '女'
          })
        }
      }
    })
  },

  // 发送验证码
  sendCode() {
    const { memberPhone } = this.data;
    if (!memberPhone || memberPhone == "") {
      wx.showToast({
        title: '手机号必填',
        icon: "none"
      })
      return false;
    } else if (!app.isPhone(memberPhone)) {
      wx.showToast({
        title: '手机号错误',
        icon: "none"
      })
      return false;
    }
    this.setData({
      hasSend: true
    })
    // 倒计时
    let timeUp = setInterval(() => {
      let { time } = this.data;
      if (!time) {
        clearInterval(timeUp);
        this.setData({
          hasSend: false
        })
        return;
      }
      time--;
      this.setData({
        time: time
      })
    }, 1000)
    app.submit("/loginApi/sendCode", { phone: memberPhone, type: 3 }, (res) => {
      this.setData({
        gotCode: res.random
      })
    })
  },


  // 选择生日
  bindDateChange(e){
    this.setData({
      memberBirthday: e.detail.value
    })
  },

  // 添加
  submit(){
    const { memberName,
      memberPhone,
      memberBirthday,
      memberSex,
      code,
      gotCode
      } = this.data;
    if (!memberName || memberName == "") {
      wx.showToast({
        title: '请输入会员姓名',
        icon: "none"
      })
      return false;
    }
    if (!memberPhone || memberPhone == "") {
      wx.showToast({
        title: '请输入会员手机号',
        icon: "none"
      })
      return false;
    }
    if (!app.isPhone(memberPhone)) {
      wx.showToast({
        title: '手机号错误',
        icon: "none"
      })
      return false;
    }
    if (code == "" || gotCode == "" || code != gotCode) {
      wx.showToast({
        title: '验证码错误',
        icon: "none"
      })
      return false;
    }

    if (!memberBirthday || memberBirthday == "") {
      wx.showToast({
        title: '请选择会员生日',
        icon: "none"
      })
      return false;
    }


    app.submit('/business/submitAddMember',{
        regBusId:app.globalData.busId,
        memberSex: memberSex,
        memberBirthday: memberBirthday,
        memberPhone: memberPhone,
        memberName: memberName,

      },(res)=>{
          wx.showToast({
            title: '注册成功',
            success:function(){
              wx.navigateBack({
                delta: 1,
              })
            }
          })
      })

  }

})