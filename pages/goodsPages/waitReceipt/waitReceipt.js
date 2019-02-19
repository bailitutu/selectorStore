var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    query: '',
    pageData: [],
    offset: 1,
    noData: false,
    noMore: false,
    sort: '0',//0：时间 1：仓库发出；2：商户发出：3：补货；
    showConfirm:false,
    confirmId:null,//待收货的订单Id
    scrollH:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.dialog = this.selectComponent("#dialogCompon");   
    let that = this;
    let query = wx.createSelectorQuery();
    query.select('#list_item').boundingClientRect(function (rect) { 
      that.setData({
         scrollH:rect.height
       }) 
    }).exec()
  },
  onShow(){
    this.getPageData();
  },

  getPageData() {
    let { query, offset, noData, noMore, pageData, sort } = this.data;
    app.getData('/business/getWaitReceiptGoodsData', {
      query: query,
      offset: offset,
      limit: 10,
      filter: sort
    }, (res) => {
      if (offset == 1 && !res.orderList.length) {
        noData = true;
      } else {
        noData = false;
      }
      if (offset > 1) {
        pageData = pageData.concat(res.orderList);
      } else {
        pageData = res.orderList;
      }

      if (res.end) {
        noMore = true;
      }
      this.setData({
        pageData: pageData,
        noMore: noMore,
        noData: noData,
        query: ''
      })
    })


  },

  // 搜索
  searchTap(e) {
    this.setData({
      query: e.detail,
      pageData: [],
      offset: 1,
      noData: false,
      noMore: false
    })
    this.getPageData();
  },

  // 筛选
  filterTap(e) {
    const { type } = e.currentTarget.dataset;
    this.setData({
      sort: type,
      pageData: [],
      offset: 1,
      noData: false,
      noMore: false,
      query: ''
    })
    this.getPageData();

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
  confirmReceipt(e){
    const { id } = e.currentTarget.dataset;
    const { showConfirm} = this.data;
    this.dialog.showDialog();
    this.setData({
      confirmId:id
    })
  },
  confirmFn(){
    const that = this;
    const { confirmId } = this.data;
    app.submit('/business/submitReceiptGoods',{
      orderId: confirmId
     },(res)=>{
        wx.showToast({
          title:'收货成功',
          success:function(){
            that.setData({
              offset:1,
              noData:false,
              noMore:false,
              pageData:[]
            })
            that.getPageData();
          }
        })
     }) 

  },
  // 查看订单详情
  checkDetail(e){
    const { id,para } = e.currentTarget.dataset;
    wx.navigateTo({
      url: '/pages/goodsPages/waitReceiptDetail/waitReceiptDetail?orderId=' + id + '&para=' + para,
    })

  }

})