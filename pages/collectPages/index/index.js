var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    current: 1,//1 :销售日报；2：现金结算；
    reteOne: 0,//存销率
    rateTwo: 0, //售罄率
    
    saleList: [],
    saleOffset: 1,
    saleNoData: false,
    saleNoMore: false,
    collectFilter:1, //今日：1；昨日：2
    collectList:[],
    collectOffset: 1,
    collectNoData: false,
    collectNoMore: false,
    SalesDayPrice:0,//日销售额
    paid: 0, //已支付（日）
    toBePaid:0,//待支付（日）
    toBePaidAll:0, //合计支付
    salesOrderList:[], //待支付订单的id数组；
    scrollH:0,
    scrollHH:0
  },
  onShow(){
    this.topTab = this.selectComponent("#topTab");
    this.topTab.setData({
      current: app.globalData.payCurrent
    })
    this.setData({
      current: app.globalData.payCurrent || 1,
    })

    this.getSalesData();
    this.getCollectData();
    this.tabTap();
  },
  // 顶部切换
  tabTap() {
    const { current } = this.topTab.data;
    this.setData({
      current: current,
    })
    this.changeHeight();
  },

  changeHeight(){
    let that = this;
    let query = wx.createSelectorQuery();
    query.select('#list_item').boundingClientRect(function (rect) {
      that.setData({
        scrollH: rect.height
      })
    }).exec()
    let querys = wx.createSelectorQuery();
    querys.select('#list_item_2').boundingClientRect(function (rect) {
      that.setData({
        scrollHH: rect.height
      })
    }).exec()
  },

  // 获取销售日报
  getSalesData() {
    let {  saleNoMore, saleNoData, saleOffset, saleList } = this.data;
    app.getData('/business/getSalesSlipDaily', {
      offset: saleOffset,
      limit: 10
    }, (res) => {
      if (saleOffset == 1 && !res.list.length) {
        saleNoData = true;
      }
      if (saleOffset > 1) {
        saleList = saleList.concat(res.list);
      } else {
        saleList = res.list;
      }

      if (res.end) {
        saleNoMore = true;
      }
      this.setData({
        rateOne: res.savingsRatio,
        rateTwo: res.soldOutRate,
        saleNoMore: saleNoMore,
        saleList: saleList,
        saleNoData: saleNoData
      })
    })
  },
  // 加载更多
  moreSaleData() {
    let { saleOffset, saleNoMore } = this.data;
    if (saleNoMore) return false;
    saleOffset++;
    this.setData({
      saleOffset: saleOffset,
    })
    this.getSalesData();
  },
  // 切换筛选
  filterTap(e) {
    const { type } = e.currentTarget.dataset;

    this.setData({
      collectFilter: type,
      collectList: [],//退货列表
      collectOffset: 1, //分页
      collectNoData: false,
      collectNoMore: false,
    })
    this.getCollectData();
    
  },
    // 获取现金结算数据
  getCollectData(){
    let { collectNoMore, collectNoData, collectOffset, collectList, collectFilter } = this.data;
    app.getData('/business/cashSettlementData', {
      offset: collectOffset,
      limit: 10,
      type: collectFilter
    }, (res) => {
      if (collectOffset == 1 && !res.list.length) {
        collectNoData = true;
      }
      if (collectOffset > 1) {
        collectList = collectList.concat(res.list);
      } else {
        collectList = res.list;
      }

      if (res.end) {
        collectNoMore = true;
      }
      this.setData({
        SalesDayPrice: res.SalesDayPrice,//日销售额
        paid: res.paid, //已支付（日）
        toBePaid: res.toBePaid,//待支付（日）
        toBePaidAll: res.toBePaidAll, //合计支付
        collectNoMore: collectNoMore,
        collectList: collectList,
        collectNoData: collectNoData,
        salesOrderList: res.salesOrderList
      })
    })

  },
    // 加载更多现金结算数据
  moreCollectData() {
    let { collectOffset, collectNoMore } = this.data;
    if (collectNoMore) return false;
    collectOffset++;
    this.setData({
      collectOffset: collectOffset,
    })
    this.getCollectData();
  },
  

  // 立即支付
  payNow(){
    const { toBePaidAll, salesOrderList} = this.data;
    const that = this;
    app.getUserOpenId(function (err, openId) {
      console.log(openId);
      if(!err){
        app.submit('/business/wxPay', {
          openId: openId,
          price: toBePaidAll,
          salesOrderList: salesOrderList,
          busId: app.globalData.busId
        }, (res) => {
          wx.requestPayment({
            'timeStamp': res.timeStamp,
            'nonceStr': res.nonceStr,
            'package': res.package,
            'signType': 'MD5',
            'paySign': res.paySign,
            'success': function (res) {
              wx.showToast({
                title: '支付成功！',
                mask: true,
                success: function () {
                  that.getCollectData();
                }
              })
            },
            'fail': function (res) {
              wx.showModal({
                title: '提示',
                content: '支付失败，请重试',
                success: function (ress) {
                  return false;
                }
              })
            }
          })
        })

      }

    })
  }
  ,
  onHide(){
    app.globalData.payCurrent = 1;
  }
})