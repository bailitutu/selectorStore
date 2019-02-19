var app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    btnState:false,
    list:[],
    orderId:'',//订单Id
    pageData:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      orderId:options.id
    })
    this.getPageData();
  },  

  // 获取页面数据
  getPageData(){
    const { orderId } = this.data;
    wx.showNavigationBarLoading();
    app.getPageData( '/business/getPaySuccess',{
      salesOrderId:orderId
    },(res)=>{
      this.setData({
        pageData:res,
        isReady:true
      })
      this.printTicket();
      wx.hideNavigationBarLoading();
    })
  },

  // 跳转页面
  goPage(){
    wx.switchTab({
      url: '/pages/salesPages/index/index',
    })
  },

  // 手动打印
  handleTap(){
    this.printTicket();
  },
  // 打印
  printTicket(){
    const {pageData} =this.data;
    let paraData = Object.assign({
      busId: app.globalData.busId
    }, pageData)
    app.submit('/business/print', paraData,(res)=>{
        wx.showToast({
          title: '正在打印...',
          icon:'none',
          mask:'true',
          duration:2000
        })
    })
  }
})