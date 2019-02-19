var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
      list:[],
      noMore:false,
      noData:false,
      offset:1,
      query:'',
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
    this.getPageData();
  },

  getPageData(){
    let { offset, noData, noMore, query, list} = this.data;
    app.getData('/business/getMemberData',{
      offset: offset,
      query:query,
      limit:10,
    },(res)=>{
      if (offset == 1 && !res.memberList.length) {
        noData = true;
      } else {
        noData = false;
      }
      if (offset > 1) {
        list = list.concat(res.memberList);
      } else {
        list = res.memberList;
      }

        this.setData({
          noData: noData,
          noMore: res.end,
          list: list,
        })

    })

  },

  // 加载更多
  moreData() {
    let { offset, noMore } = this.data;
    if (noMore) return false;
    offset++;
    this.setData({
      offset: offset,
    })
    this.getPageData();
  },
  // 搜索
  searchMember(e) {
    this.setData({
      query: e.detail,
      list: []
    })
    this.getPageData();
  },

  // 查看会员详情
  checkMember(e){
      const { id } = e.currentTarget.dataset;
      wx.navigateTo({
        url: '/pages/salesPages/memberDetail/memberDetail?id='+ id,
      })
  },

  // 添加会员
  goPage(e) {
    const { url } = e.currentTarget.dataset;
    app.goNa(url);
  }
  
})