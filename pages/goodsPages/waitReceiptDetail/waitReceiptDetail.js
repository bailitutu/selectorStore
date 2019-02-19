var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pageData:{},
    orderId:'',
    orderType:null,
    isReady:false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      orderId:options.orderId,
      orderType:options.para
    })
    this.dialog = this.selectComponent("#dialogCompon");    
  },
  onShow(){
    this.getPageData();    
  },
  // 获取页面数据
  getPageData(){
    const {orderId} = this.data;
    wx.showNavigationBarLoading();
    app.getPageData('/business/getReceiptOrderDetail',{
      orderId: orderId
    },(res)=>{
        this.setData({
          pageData:res,
          isReady:true
        })
        wx.hideNavigationBarLoading();
    })
  },
  // 查看商品列表详情
  checkGoodsDetail(){
      const { orderId} =this.data;
      wx.navigateTo({
        url: '/pages/goodsPages/waitReceiptGoods/waitReceiptGoods?orderId='+ orderId,
      })
  },
  // 立即反馈
  feedBack(){
    const { orderId } =this.data;
    wx.navigateTo({
      url: '/pages/goodsPages/orderFeedback/orderFeedback?orderId='+ orderId,
    })
  },
  // 确认收货
  confirmReceipt(){
    this.dialog.showDialog();
  },
  confirmFn(){
    const that = this;
    const { orderId } = this.data;
    app.submit('/business/submitReceiptGoods',{
      orderId: orderId
     },(res)=>{
        wx.showToast({
          title:'收货成功',
          complete:function(){
            setTimeout(()=>{
                  wx.navigateBack()
            },2000)
          }
        })
     }) 

  },
})