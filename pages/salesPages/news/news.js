var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list:[],
    noMore:false,
    noData:false,
    scrollH:0
  },
  onLoad(){
    let that = this;
    let query = wx.createSelectorQuery();
    query.select('#list_item').boundingClientRect(function (rect) {
      that.setData({
        scrollH: rect.height
      })
    }).exec()
  },
  onShow: function () {
    this.getPageData();
  },
  getPageData(){
    let { noData } = this.data;
    wx.showNavigationBarLoading();
    app.getData("/business/getMessageData",{
    },(res)=>{
      if (!res.messageList.length) {
        noData = true;
      } else {
        noData = false;
      }
      this.setData({
        list: res.messageList,
        noData:noData,
        noMore:true
      })
      wx.hideNavigationBarLoading();
    },()=>{
      wx.hideNavigationBarLoading();
    })
  },
  //查看详情
  checkNews(e){
    const { id,index} = e.currentTarget.dataset;
    wx.navigateTo({
      url: '/pages/salesPages/newsDetail/newsDetail?id='+ id,
    })
    let read = 'list[' + index +'].isRead';
    this.setData({
      [read]: '2'
    })

  },
  // 全部已读
  allRead(){
    app.submit('/business/newsAllRead',{
      busId:app.globalData.busId
    },(res)=>{
      this.getPageData();
    })
  }

})