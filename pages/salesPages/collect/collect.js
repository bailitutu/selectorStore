var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goodsList:[], //商品数组
    totalPrice:0, //总金额
    memberPhone:'' ,//会员手机号
    query:'' ,//搜索内容
    payWay:1, //支付方式
    noData:false, //没有商品
    noMore:true, //没有更多了  
    offset:1,
    list:[] ,//搜索到商品列表
    showAdd:false, //显隐弹出层;
    animationData:{}, //动画
    scrollH:0,//高度
    memberDis:0, //会员折扣
    endPrice:0, //结算价
  },  
  onLoad(){
    this.dialog = this.selectComponent("#dialogCompo");
  },
  onShow(){
    let that = this;
    let lisH = wx.createSelectorQuery();
    lisH.select('#goods_list_box').boundingClientRect(function (rect) {
      that.setData({
        scrollH: rect.height
      })
    }).exec();
  },
  // 添加商品
  scanToAddGoods(){
    let that = this;
    let { goodsList } = this.data;
    wx.scanCode({
      scanType: ['barCode','qrCode'],
      success:function(res){
        app.getData('/business/queryGoodsInfo', {
          query: res.result,
          offset: 1,
          limit: 10
        }, (res) => {
          if(!res.goodsList || res.goodsList.length == 0){
            wx.showToast({
              title: '找不到该商品',
            })
            return false;
          }
          goodsList.unshift(res.goodsList[0]);
          that.setData({
            goodsList: goodsList
          })
          that.getTotal();
         
        })

      }
    })

  },
  // 获取总金额
  getTotal(){
    const { goodsList } = this.data;
    let total = 0;
    goodsList.map((item)=>{
      total += Number(item.goodsPrice)
    })
    total = total.toFixed(2);
    this.setData({
      totalPrice:total
    })
    this.getEndPrice();
  },
  // 获取结算价
  getEndPrice(){
    const { goodsList, memberDis, totalPrice} = this.data;

    let endPrice = 0;
    if (memberDis) {
      goodsList.map((item) => {
        if (Number(item.goodsOldPrice) * memberDis / 100 > item.goodsPrice){
          endPrice += Number(item.goodsPrice)
        }else{
          endPrice += Number(item.goodsOldPrice) * memberDis / 100;
        }
      })
      endPrice = parseInt(endPrice).toFixed(2);
      console.log(endPrice)
      this.setData({
        endPrice: endPrice
      })
    }else{
      this.setData({
        endPrice: totalPrice
      })
    }
  },

  // 选择支付方式
  selectPay(e){
    const {param} = e.currentTarget.dataset;
    this.setData({
      payWay:param
    })

  },
  //输入
  inputChange(e){
    const {type} = e.currentTarget.dataset;
    this.setData({
      [type]:e.detail.value
    })
  },

  // 输入会员手机号

  changeMemberPhone(e){
    const that = this;
    let phone = e.detail.value;
    if (phone.length > 0 && !app.isPhone(phone)){
      wx.showToast({
        title: '请输入正确的手机号',
        icon: 'none'
      })
      this.setData({
        memberPhone:''
      })
      return false;
    }

    // 18656890809
    if (phone.length == 11 && app.isPhone(phone)){
      app.getData('/business/getMemberDiscount',{
        phone:phone
      },(res)=>{
        that.setData({
          memberDis:res.discount
        })
        that.getEndPrice();
      })
    }
  },

  // 收银前验证
  collectTap(){
    const { payWay, goodsList, totalPrice, memberPhone} = this.data;

    if (memberPhone.length>0 && !app.isPhone(memberPhone) )
    {
      wx.showToast({
        title: '请输入正确的手机号',
        icon:'none'
      })
      return false;
    }

    this.dialog.showDialog();
  },
  // 发送收银请求
  submit(){

    const { payWay, goodsList, endPrice, memberPhone } = this.data;
    wx.showLoading({
      title: '提交中...',
      mask:true
    })
    let goodsIds = [];
    goodsList.map((item)=>{
        goodsIds.push({
          goodsId: item.number
        })
    })
    app.submit('/business/submitCollectMoney', {
      goodsList: goodsIds,
      memberPhone: memberPhone,
      totalPrice: endPrice,
      payType: payWay,
      busId:app.globalData.busId
    }, (res) => {
      wx.hideLoading();
      if(payWay == 3){
        wx.reLaunch({
          url: '/pages/salesPages/paySuccess/paySuccess?id=' + res.salesOrderId,
        })
      }else{
        wx.navigateTo({
          url: '/pages/salesPages/scanPay/scanPay?id=' + res.salesOrderId,
        })
      }
    })
  },
  // 进入搜索页
  goPage(e){
    const {url} = e.currentTarget.dataset;
    app.goNa(url);

  },
  
  // 删除商品
  deleteGoods(e){
    const { index } = e.currentTarget.dataset;
    let { goodsList} = this.data;

    goodsList.splice(index,1);
    this.setData({
      goodsList:goodsList,
    })
    this.getTotal(); 
  },

  // 搜索商品
  search(){
    const { query} = this.data;
    if(query == '' || !query){
      wx.showToast({
        title: '请输入单品编号',
        icon:'none'
      })
      return false;
    }
    this.setData({
      list:[],
      offset:1,
      noData:false,
      noMore:false
    })

    this.getGoodsList();
  },

  // 获取搜索的商品列表
  getGoodsList(){
    let { query ,noData,noMore,list,offset} = this.data ;

    app.getData('/business/queryGoodsInfo',{
      query:query,
      offset: offset,
      limit:10
    },(res)=>{
      if (offset == 1 && !res.goodsList.length) {
        noData = true;
      } else {
        noData = false;
      }
      if (offset > 1) {
        list = list.concat(res.goodsList);
      } else {
        list = res.goodsList;
      }

      this.setData({
        noData: noData,
        noMore: res.end,
        list: list,
      })
    })


  },

  // 手动追加商品
  addGoods(e){
    const { index } = e.currentTarget.dataset;
    let { goodsList,list} = this.data;
    goodsList.unshift( list[index]);
    this.setData({
      goodsList: goodsList
    })
    this.getTotal();
    wx.showToast({
      title: '添加成功',
      icon: 'none',
      duration: 1000
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
    this.getGoodsList();
  },
  // 显示弹出层
  showAddTap: function (e) {
    var that = this;
    // 创建一个动画实例
    var animation = wx.createAnimation({
      // 动画持续时间
      duration: 200,
      // 定义动画效果，当前是匀速
      timingFunction: 'linear'
    })
    // 将该变量赋值给当前动画
    that.animation = animation
    // 先在y轴偏移，然后用step()完成一个动画
    animation.bottom(-1000).step();
    // 用setData改变当前动画
    that.setData({
      animationData: animation.export(),
      showAdd: true
    })
    setTimeout(function () {
      animation.bottom(0).step();
      that.setData({
        animationData: animation.export()
      })
    }, 10)
  },

  // 关闭弹出层
  hideModal: function (e) {
    var that = this;
    var animation = wx.createAnimation({
      duration: 300,
      timingFunction: 'linear'
    })
    that.animation = animation
    animation.bottom(0).step()
    that.setData({
      animationData: animation.export()
    })
    setTimeout(function () {
      animation.bottom(-1000).step()
      that.setData({
        animationData: animation.export(),
        showAdd: false,
        list:[],
        noData:false,
        noMore:true,
        offset:1,
        query:''
      })
    }, 10)
  }



})