var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pageData:{} ,//页面数据
    goodsInfo:{} ,//商品信息
    isReady:false,//是否加载完成
    goodsId:null,
    array:[],
    index:0,
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      goodsId:options.id
    })
    this.getPageData();
    this.dialog = this.selectComponent("#dialogCompo");
  },

  getPageData(){
    const { goodsId} = this.data;
    app.getPageData('/business/getRefundGoods',{
      goodsId:goodsId
    },(res)=>{
      let num  = res.goodsInfo.goodsRefundNum;
      let arr = [];
      for( let i = 0;i<num;i++){
        arr.push(i+1);
      }
        this.setData({
          pageData:res,
          goodsInfo:res.goodsInfo,
          isReady:true,
          array:arr
        })
    })
  },

  // 选择退货数量
  selectNum(e){
    this.setData({
      index:e.detail.value
    })
  },

  // 确认退款
  submitTap(){

    this.dialog.showDialog();
  },

  submitFn(){
    const { goodsId, array,index,reason } = this.data;
    app.submit('/business/submitRefundInfo',{ 
      busId:app.globalData.busId,
      goodsId:goodsId,
      num: array[index],
      reason:reason
    },(res)=>{
      wx.showToast({
        title:'退货成功',
        success(){
          setTimeout(()=>{
            wx.navigateBack({});
          },2000)
        }
      })

    })

  }

 
})