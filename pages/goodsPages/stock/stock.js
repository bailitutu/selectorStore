var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    totalNum:0,
    totalPrice:0,
    query:'',
    offset:1,
    sort: 0,//0:时间；1：数量；2：库龄；3：成本,
    pageData:[],
    noMore:false,
    noData:false,
    scrollH: 0
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

  getPageData(){
    let { query, offset, noData, noMore, pageData, sort } = this.data;
    app.getData('/business/getStockData', {
      query: query,
      offset: offset,
      limit: 10,
      sort: sort
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
        totalNum: res.stockTotalNum,
        totalPrice: res.stockTotalPrice,
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
  // 查看款式详情
  checkDetail(e){
    const { id } = e.currentTarget.dataset;
    wx.navigateTo({
      url: '/pages/goodsPages/stockDetail/stockDetail?id='+ id,
    })
  }


})