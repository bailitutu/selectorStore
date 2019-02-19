var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    current: 1,//1 :销售单；2：退货单；
    query: '', //搜索项
    totalNum:0,//总件数
    totalPrice:0,//总金额
    saleFilter:1,// 1：今日，2：昨天，3：7天，4：30天，5：未付款；
    saleList:[],
    saleOffset: 1,
    saleNoData:false,
    saleNoMore:false,

    refundList:[],//退货列表
    refundOffset:1, //分页
    refundFilter:1,// 1：今日，2：昨天，3：7天，4：30天，5：未付款；
    refundNoData:false,
    refundNoMore:false,
    scrollH: 0,
    scrollHH: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.topTab = this.selectComponent("#topTab");

    this.getRefundData();
    this.getSalesData();
    this.changeHeight();
  },

  // 顶部切换
  tabTap(){
    const { current } = this.topTab.data;
    this.setData({
      current: current,
    })
    this.changeHeight();
  },

  changeHeight() {
    let that = this;
    let query = wx.createSelectorQuery();
    query.select('#sale_item').boundingClientRect(function (rect) {
      that.setData({
        scrollH: rect.height
      })
    }).exec()
    let querys = wx.createSelectorQuery();
    querys.select('#refund_item').boundingClientRect(function (rect) {
      that.setData({
        scrollHH: rect.height
      })
    }).exec()
  },
  // 搜索
  search(e){
    const { query,current} = this.data;

    if(!query || query == ''){
      return  false;
    }
    if(current == 1){
      this.setData({
        showTotal: false,
        saleFilter: 0,
      })
      this.getSalesData();

    }else{
      this.setData({
        refundFilter:0
      })
      this.getRefundData();
    }
  },
  // 输入
  inputSearch(e){
    this.setData({
      query:e.detail.value
    })
  },

  // 切换筛选
  filterTap(e){
    const { type }= e.currentTarget.dataset;
    const { current} = this.data;
    if(current == 1){
        this.setData({
          saleFilter:type,
          saleList: [],
          saleOffset: 1,
          saleNoData: false,
          saleNoMore: false,
        })
      this.getSalesData();
    }else{
      this.setData({
        refundFilter:type,
        refundList: [],//退货列表
        refundOffset: 1, //分页
        refundNoData: false,
        refundNoMore: false,
      })
      this.getRefundData();
    }
  },


  // 获取销售单

  getSalesData(){
    let { query, saleFilter, saleNoMore, saleNoData, saleOffset, saleList} = this.data;
    app.getData('/business/getSalesSlipData',{
      query:query,
      fliterType: saleFilter,
      offset: saleOffset,
      limit:10
    },(res)=>{
      if (saleOffset == 1 && !res.salesList.length) {
        saleNoData = true;
      }
      if (saleOffset > 1) {
        saleList = saleList.concat(res.salesList);
      } else {
        saleList = res.salesList;
      }

      if (res.end) {
        saleNoMore = true;
      }
      this.setData({
        query:'',
        totalNum: res.totalSalesNum,
        totalPrice: res.totalSalesPrice,
        saleNoMore: saleNoMore,
        saleList: saleList,
        saleNoData: saleNoData
      })
    })
  },
  // 获取退货单信息
  getRefundData(){
    let { query, refundFilter, refundList, refundNoData, refundNoMore, refundOffset} = this.data;
    app.getData('/business/getRefundSlipData', {
      query: query,
      fliterType: refundFilter,
      offset: refundOffset,
      limit: 10
    }, (res) => {
      if (refundOffset == 1 && !res.list.length) {
        refundNoData = true;
      }
      if (refundOffset > 1) {
        refundList = refundList.concat(res.list);
      } else {
        refundList = res.list;
      }

      if (res.end) {
        refundNoMore = true;
      }
      this.setData({
        query: '',
        refundNoMore: refundNoMore,
        refundList: refundList,
        refundNoData: refundNoData
      })
    })
  },

  // 加载更多
  moreSaleData(){
    let { saleOffset, saleNoMore } = this.data;
    if (saleNoMore) return false;
    saleOffset++;
    this.setData({
      saleOffset: saleOffset,
    })
    this.getSalesData();
  },
  moreRefundData(){
    let { refundOffset, refundNoMore } = this.data;
    if (refundNoMore) return false;
    refundOffset++;
    this.setData({
      refundOffset: refundOffset,
    })
    this.getRefundData();
  } 




 
})