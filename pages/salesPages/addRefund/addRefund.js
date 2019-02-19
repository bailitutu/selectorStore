var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list:[], //商品列表
    labelId: '', //小票编号
    noMore:true,
    noData:true,
  },


  // 输入编号
  inputChange(e){
    this.setData({
      labelId:e.detail.value
    })
  },
  // 扫码
  scanTap(e) {
    const that = this;
    const { goodsList } = this.data;
    wx.scanCode({
      success: function (res) {
        that.setData({
          labelId:res.result
        })
        that.getOrderData();
      }
    })

  },

  // 获取商品列表
  getOrderData(){
    const { labelId } = this.data;
    if(labelId == '' || !labelId){
      wx.showToast({
        title: '小票条码必填！',
        icon:'none'
      })
    }
    wx.showLoading({
      title: '正在查询...',
      mask:true
    })
    app.getPageData('/business/getLabelData',{
      labelId:labelId
    },(res)=>{
      let list = [],noData = false;
      if(res.list.length == 0 || !res.list.length){
        noData = true
      }else{
        list =  res.list;
        noData = false;
      }
      this.setData({
        noMore:true,
        noData:noData,
        list:list
      })
      wx.hideLoading();
    })
  },
  // 查看商品详情
  checkDetail(e){
    const { id} = e.currentTarget.dataset;
    wx.navigateTo({
      url: '/pages/salesPages/addRefundDetail/addRefundDetail?id='+ id ,
    })
  }
})