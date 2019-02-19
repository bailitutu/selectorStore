var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pageData: [],
    offset: 1,
    noData: false,
    noMore: false,
    scrollH:0
  },
  onLoad(){
    let that = this;
    let query = wx.createSelectorQuery();
    query.select('#list_item').boundingClientRect(function (rect) {
      that.setData({
        scrollH: rect.height
      })
    }).exec()
  },
  onShow: function () {
    this.setData({
      pageData: [],
      offset: 1,
      noData: false,
      noMore: false,
    })
    this.getPageData();
  },
  getPageData() {
    let { offset, noData, noMore, pageData } = this.data;
    app.getData('/business/getRefundGoodsData', {
      offset: offset,
      limit: 10,
    }, (res) => {
      if (offset == 1 && !res.refundList.length) {
        noData = true;
      } else {
        noData = false;
      }
      if (offset > 1) {
        pageData = pageData.concat(res.refundList);
      } else {
        pageData = res.refundList;
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
  // 添加退货
  goPage(e) {
    const { url } = e.currentTarget.dataset;
    app.goNa(url);
  },
  // 编辑退货信息
  checkRefund(e){
    const { id} = e.currentTarget.dataset;
    wx.navigateTo({
      url: '/pages/goodsPages/refundDetail/refundDetail?orderId=' + id,
    })
  }


})