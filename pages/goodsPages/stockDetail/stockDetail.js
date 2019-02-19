var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    styleId: null,
    isReady: false,
    pageInfo: {},
    storeList: [],
    labelDetail:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      styleId: options.id
    })
    this.getPageData();
  },

  getPageData() {
    const { styleId } = this.data;
    wx.showNavigationBarLoading();
    app.getData('/business/getStockStyleDetail', {
      styleId: styleId
    }, (res) => {
      let labelDetail = '';
      if (res.label){
        res.label.map((item,i)=>{
          if(i == (res.label.length-1)){
            labelDetail += item.labelName 
          }else{
            labelDetail += item.labelName + '/'
          }
        })
      }
      this.setData({
        labelDetail: labelDetail,
        pageInfo: res,
        isReady: true
      })
      wx.hideNavigationBarLoading();
    }, () => {
      this.setData({
        isReady: true
      })
      wx.hideNavigationBarLoading();
    })
  }

})