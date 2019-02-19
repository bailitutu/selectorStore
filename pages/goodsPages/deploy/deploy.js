var app =  getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pageData: [],
    offset: 1,
    noData: false,
    noMore: false,
    showSend:false,//是否显示发货弹窗
    logName:'' ,//物流公司名称
    logNumber:'' ,//物流单号,
    sendOrderId:null,//待发货的订单Id,
    confirmOrderId:null,//要确认的订单Id
    scrollH:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onShow: function (options) {
    this.dialog = this.selectComponent("#dialogCompon");  
    this.getPageData();
    let that = this;
    let query = wx.createSelectorQuery();
    query.select('#list_item').boundingClientRect(function (rect) {
      that.setData({
        scrollH: rect.height
      })
    }).exec()
  },

  getPageData() {
    let { offset, noData, noMore, pageData } = this.data;
    app.getData('/business/getDeployGoodsData', {
      offset: offset,
      limit: 10,
    }, (res) => {
      if (offset == 1 && !res.deployList.length) {
        noData = true;
      }else{
        noData = false;
      }
      if (offset > 1) {
        pageData = pageData.concat(res.deployList);
      } else {
        pageData = res.deployList;
      }

      if (res.end) {
        noMore = true;
      }
      this.setData({
        pageData: pageData,
        noMore: noMore,
        noData: noData,
      })
    })
  },
  //加载更多
  moreData() {
    let { offset, noMore } = this.data;
    if (noMore) return false;
    offset++;
    this.setData({
      offset: offset,
    })
    this.getPageData();
  },

  // 发货
  sendTap(e){
    const { id } = e.currentTarget.dataset;
    this.setData({
      showSend:true,
      sendOrderId:id
    })
  },
  cancelHander(){
    this.setData({
      showSend: false,
      logName:'',
      logNumber:'',
      sendOrderId:''
    })
  },

  inputChange(e){
    const {type} = e.currentTarget.dataset;
    this.setData({
      [type] :e.detail.value
    })

  },

  confirmHander(){
    const { logName,logNumber,sendOrderId} = this.data;

    if (logName == '' || !logName){
        wx.showToast({
          title: '请先输入物流公司',
          icon:'none'
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
      showSend:false
    })
    wx.showLoading({
      title: '提交中...',
      mask:true
    })
    const that = this;
    app.submit('/business/submitSenderOrder',{
      orderId:sendOrderId,
      loginstics: logName,
      loginsticsNumber: logNumber
    },(res)=>{
      wx.hideLoading();
      wx.showToast({
        title: '发货成功',
        mask: true,
        success:function(){
          setTimeout(()=>{
            that.setData({
              offset: 1,
              noData:false,
              noMore:false,
              pageData:[],
              logName:'',
              logNumber:''
            })
            that.getPageData();
          },1500)
        }
      })
    },()=>{
      wx.hideLoading();
    })
  },
  // 确认
  confirmTap(e){
    this.dialog.showDialog();
    const { id} = e.currentTarget.dataset;
    this.setData({
      confirmOrderId:id
    })
  },
  confirmFn(){
    const that = this;
    const { confirmOrderId} = this.data;
    wx.showLoading({
      title: '提交中...',
      mask: true
    })
    app.submit('/business/submitDeployOrder', {
      orderId: confirmOrderId,
    }, (res) => {
      wx.hideLoading();
      wx.showToast({
        title: '提交成功',
        mask: true,
        success: function () {
          setTimeout(() => {
            that.setData({
              offset: 1,
              noData: false,
              noMore: false,
              pageData: [],
              logName: '',
              logNumber: ''
            })
            that.getPageData();
          }, 1500)
        }
      })
    }, () => {
      wx.hideLoading();
    })

  },
  confirmCancel(){
    this.setData({
      confirmOrderId:null
    })
  },
  // 查看调货详情
  checkRefund(e){
    const { id } = e.currentTarget.dataset;
    wx.navigateTo({
      url: '/pages/goodsPages/deployDetail/deployDetail?id='+ id,
    })
  }





  

})