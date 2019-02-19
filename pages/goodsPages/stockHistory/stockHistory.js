var  app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    typeList: ["全部订单", "收货入库", "补货入库", "调货入库", "调货出库", "退货出库", "销售出库","退货入库"],
    typeIndex: 0, //筛选条件1收货入库2补货入库3调货入库4调货出库5退货出库6销售出库7退货入库
    offset: 1,
    noData: false,
    noMore: false,
    query:'',
    pageData:[],
    scrollH:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getPageData();
    let that = this;
    let query = wx.createSelectorQuery();
    query.select('#list_item').boundingClientRect(function (rect) {
      that.setData({
        scrollH: rect.height
      })
    }).exec()
  },
  // 选择订单类型
  bindPickerChange: function (e) {
    this.setData({
      typeIndex: e.detail.value,
      offset:1,
      noData:false,
      noMore:false,
      pageData:[]
    })
    this.getPageData();
  },

  //获取流水列表
  getPageData(){
    let { query, offset, noData, noMore, pageData, typeIndex } = this.data;
    app.getData('/business/getStockHistory', {
      query: query,
      offset: offset,
      limit: 10,
      filter: typeIndex
    }, (res) => {
      if (offset == 1 && !res.styleList.length) {
        noData = true;
      } else {
        noData = false;
      }
      if (offset > 1) {
        pageData = pageData.concat(res.styleList);
      } else {
        pageData = res.styleList;
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
  // 查看流水详情
  checkDetail(e){
    const { id } = e.currentTarget.dataset;
    wx.navigateTo({
      url: '/pages/goodsPages/stockHistoryDetail/stockHistoryDetail?id='+ id,
    })
  }

})  