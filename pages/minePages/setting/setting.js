var app = getApp();
Page({

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.dialog = this.selectComponent("#dialogCompo");
  },
  goChangePass(){
    app.goNa('忘记密码');
  },
  loginOutTap() {
    this.dialog.showDialog();
  },
  loginOut() {
    wx.removeStorageSync('busId');
    app.globalData.busId = '';
    wx.reLaunch({
      url: '/pages/minePages/login/login',
    })
  }
})