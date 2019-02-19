var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
      feedContent:'',
    isReady:false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getPageData();
  },

  // 获取信息
// / business / 
  getPageData() {
    wx.showNavigationBarLoading();
    app.getData('/business/feedbackData', {}, (res) => {
      this.setData({
        isReady: true,
        pageData: res
      })
      wx.hideNavigationBarLoading();
    }, () => {
      wx.hideNavigationBarLoading();
    })
  },

  inputChange(e){
    this.setData({
      feedContent:e.detail.value
    })
  },
  callPhone(e){
    const {phone} = e.currentTarget.dataset;
    wx.makePhoneCall({
      phoneNumber: phone
    })
  },
  submit(){
    const { feedContent }  = this.data;
    if (feedContent == '' || !feedContent){
      wx.showToast({
        title: '请先输入反馈意见',
        icon:'none'
      })
      return false;
    }
    app.submit('/business/submitMineFeedBack',{
      detail: feedContent,
      busId:app.globalData.busId

    },(res)=>{

       wx.showToast({
         title: '提交成功',
         success:function(){
           setTimeout(()=>{
             wx.navigateBack()
           },2000)
         }
       }) 

    })

  }

})