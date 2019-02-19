var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pageData:{},
    messageId:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      messageId:options.id
    })
    this.getPageData();
  },

  getPageData(){
    const { messageId} =  this.data;
    wx.showNavigationBarLoading();
    app.getData('/business/getMessageDetail',{
      messageId: messageId
    },(res)=>{
      this.setData({
        pageData:res
      })
      wx.hideNavigationBarLoading();
    },()=>{
      wx.hideNavigationBarLoading();
    })
  }
})