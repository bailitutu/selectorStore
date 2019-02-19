var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isOverdue:false, //是否有待支付订单
    pageData:{} ,//页面数据
    noLogin:false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 判断是否登录
    let busId = wx.getStorageSync('busId');
    if (!busId) {
      this.setData({
        noLogin: true
      })
      wx.redirectTo({
        url: '/pages/minePages/login/login',
      })
    } else {
      app.globalData.busId = busId;
    } 
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    const { noLogin } = this.data;
    if(!noLogin){
      this.getPageData();
    }

  },
  getPageData(){
    wx.showNavigationBarLoading();    
    app.getData('/business/salesHome', {}, (res) => {

      this.setData({
        pageData: res,
        isOverdue:res.isOverdue
      })
      wx.hideNavigationBarLoading();
    }, () => {
      wx.hideNavigationBarLoading();
    })

  },
  goPage(e) {
    const { url } = e.currentTarget.dataset;
    app.goNa(url);
  },
  //立即支付
  payNow(){
    const that = this;
    let { pageData} = this.data;
    app.getUserOpenId(function (err, openId) {
      if(!err){
        app.submit('/business/wxPay', {
          openId: openId,
          salesOrderList: pageData.saleOrderList,
          price: pageData.overduePrice,
          busId: app.globalData.busId
        }, (res) => {
          wx.requestPayment({
            'timeStamp': res.timeStamp,
            'nonceStr': res.nonceStr,
            'package': res.package,
            'signType': 'MD5',
            'paySign': res.paySign,
            'success': function (res) {
              wx.showToast({
                title: '支付成功！',
                mask: true,
                success: function () {
                  let newPrice = Number(pageData.waitPayPrice) - Number(pageData.overduePrice);
                  that.setData({
                    isOverdue: false,
                    ['pageData.waitPayPrice'] : newPrice
                  })
                }
              })
            },
            'fail': function (res) {
              wx.showModal({
                title: '提示',
                content: '支付失败，请重试',
                success: function (ress) {
                  return false;
                }
              })
            }
          })
        })
      }
    })

    

    
  },
  // 支付跳转

  goPayPage(){
    app.globalData.payCurrent = 2;
    wx.switchTab({
      url: '/pages/collectPages/index/index?',
    })
  }
  
})