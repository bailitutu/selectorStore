var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pageData: {},
    orderId: '',
    logName: '',//物流公司名称
    logNumber: '',//物流单号,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      orderId: options.id
    })
    this.dialog = this.selectComponent("#dialogCompon");
  },
  onShow() {
    this.getPageData();
  },
  // 获取页面数据
  getPageData() {
    const { orderId } = this.data;
    app.getPageData('/business/getDeployOrderDetail', {
      orderId: orderId
    }, (res) => {
      this.setData({
        pageData: res
      })
    })
  },
  // 确认
  confirmTap() {
    this.dialog.showDialog();
  },
  confirmFn() {
    const that = this;
    const { orderId } = this.data;
    wx.showLoading({
      title: '提交中...',
      mask: true
    })
    app.submit('/business/submitDeployOrder', {
      orderId: orderId,
    }, (res) => {
      wx.hideLoading();
      wx.showToast({
        title: '提交成功',
        mask: true,
        success: function () {
          setTimeout(() => {
            wx.navigateBack({
              
            })
          }, 1500)
        }
      })
    }, () => {
      wx.hideLoading();
    })

  },

  inputChange(e) {
    const { type } = e.currentTarget.dataset;
    this.setData({
      [type]: e.detail.value
    })

  },
  // 发货
 sendTap() {
    const { logName, logNumber,orderId } = this.data;

    if (logName == '' || !logName) {
      wx.showToast({
        title: '请先输入物流公司',
        icon: 'none'
      })
      return false;
    }
    if (logNumber == '' || !logNumber) {
      wx.showToast({
        title: '请先输入物流公司',
        icon: 'none'
      })
      return false;
    }
    this.setData({
      showSend: false
    })
    wx.showLoading({
      title: '提交中...',
      mask: true
    })
    const that = this;
    app.submit('/business/submitSenderOrder', {
      orderId: orderId,
      loginstics: logName,
      loginsticsNumber: logNumber
    }, (res) => {
      wx.hideLoading();
      wx.showToast({
        title: '发货成功',
        mask: true,
        success: function () {
          setTimeout(() => {
            wx.navigateBack();
          }, 1500)
        }
      })
    }, () => {
      wx.hideLoading();
    })
  },
})