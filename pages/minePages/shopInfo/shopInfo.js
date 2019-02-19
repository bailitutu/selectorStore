var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isReady:false,
    pageData:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getPageData();

  },

    // 获取店铺信息
  getPageData(){
    wx.showNavigationBarLoading();
    app.getData('/business/getBusInfo',{},(res)=>{
      this.setData({
        isReady:true,
        pageData:res
      })
      wx.hideNavigationBarLoading();
    },()=>{
      wx.hideNavigationBarLoading();
    })
  },
  // 查看二维码
  checkEwm(e){
    const { ewm,type} = e.currentTarget.dataset;
    app.globalData.ewm = ewm;
    wx.navigateTo({
      url: '/pages/minePages/ewmPage/ewmPage?type='+ type,
    })



  }

})