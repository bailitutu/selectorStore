var app = getApp();
Page({

  /**
   * 页面的初始数据
   */ 
  data: {
      orderId:null,
      list:[]
  },  

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      orderId:options.orderId
    })
    this.getPageData();
  },

  getPageData() {
    const { orderId } = this.data;
    app.getPageData('/business/getReceiptOrderGoods', {
      orderId: orderId
    }, (res) => {
      this.setData({
        list: res.styleList
      })
    })
  },
})