var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    memberInfo:{},
    id:null,
    isReady:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    this.setData({
      id:options.id
    })
    this.getPageData();
  },

  getPageData(){
    const { id } = this.data;
    wx.showNavigationBarLoading();
    app.getData('/business/getMemberDetail',{
      memberId:id
    },(res)=>{
      this.setData({
        memberInfo:res,
        isReady:true
      })
      wx.hideNavigationBarLoading();
    },()=>{
      wx.navigateBack();
    })


  }
 
})