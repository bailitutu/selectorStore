var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    ewmUrl:'',
    type:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    this.setData({
      ewmUrl:app.globalData.ewm,
      type:options.type
    })
    this.pageInit();
  },
  pageInit(){
    const { type} = this.data;
    if(type == '1'){
      wx.setNavigationBarTitle({
        title: '支付宝二维码',
      })
    }else if(type == '2'){
      wx.setNavigationBarTitle({
        title: '微信二维码',
      })
    }
  }

})