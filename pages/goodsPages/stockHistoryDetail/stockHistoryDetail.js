var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isReady:false,
    pageData:{},
    historyId:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      historyId:options.id
    })
    this.getPageData();
  },
  getPageData(){
     const { historyId } = this.data;
     wx.showNavigationBarLoading();
    app.getPageData('/business/getStockHistoryDetail',{
      historyId: historyId
    },(res)=>{
        this.setData({
          pageData:res,
          isReady:true
        })
        wx.hideNavigationBarLoading();
     },()=>{
      wx.navigateBack()
     }) 
  }
 
})