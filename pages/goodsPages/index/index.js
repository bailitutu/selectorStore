var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
      pageData:{}
  },

  onShow: function () {
    this.getPageData();
  },
  getPageData() {
    wx.showNavigationBarLoading();
    app.getData('/business/home', {}, (res) => {
      this.setData({
        pageData: res
      })
      wx.hideNavigationBarLoading();
    }, () => {
      wx.hideNavigationBarLoading();
    })
  },

  goPage(e) {
    const { url } = e.currentTarget.dataset;
    app.goNa(url);
  }
})