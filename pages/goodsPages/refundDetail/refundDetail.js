var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    depotList:[],//完整的仓库列表
    depotArray:[],//piker使用的
    depotIndex:0,//选择的仓库名下标
    depotId:null, //选择 的仓库Id
    loginstics:'',
    loginsticsNumber:'',
    refundReason:'',
    goodsTotalPrice:0,//商品总价
    goodsTotal:0,//商品总数
    orderId:null,//订单Id
    goodsList: [],//商品列表
    orderStatus: null,//订单状态
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (opt) {
    if(opt.orderId){
      this.setData({
        orderId:opt.orderId
      })
      this.getPageData();
    }else{
      this.addTap();
    }

    this.getDepot();
    this.dialog = this.selectComponent("#del_pop");
  },
  // 输入
  inputChange(e){
    const { param } = e.currentTarget.dataset;
    this.setData({
      [param]:e.detail.value
    })
  },
  // 获取仓库列表
  getDepot(){
    app.getPageData('/business/getRefundDepotList',{},(res)=>{
      let list = res.depotList;
      let depotList = [];
      if(list.length > 0){
        list.map(function(item){
            depotList.push(item.name)
        })
      }
      
      this.setData({  
        depotArray:depotList,
        depotList:list
      })
    })

  },
  // 选择仓库
  bindPickerChange(e){
    const { depotList} = this.data;
    this.setData({
      depotIndex: e.detail.value,
      depotId: depotList[e.detail.value].id
    })
  },
  // 获取订单信息
  getPageData(){
    wx.showNavigationBarLoading();
    const { orderId, depotList } = this.data;
    app.getPageData('/business/getRefundGoodsDetail',{
      orderId:orderId
    },(res)=>{
      for(let i of depotList){
        if (depotList[i].id == res.depotId){
          depotIndex = i;
          break;
        }
      }
      this.setData({
        depotId: res.depotId, //选择 的仓库Id
        loginstics: res.loginstics,
        loginsticsNumber: res.loginsticsNumber,
        refundReason: res.refundReason || '',
        goodsList: res.goodsList,//商品列表
        orderStatus:res.orderStatus
      })
      this.getTotal();
      wx.hideNavigationBarLoading();
    })
  },

  // 添加商品数量
  addTap(){
    const { goodsList} = this.data;
    goodsList.unshift({
      number:'',
      num:'',
      price:0
    })
    this.setData({
      goodsList:goodsList
    })

  },

  //扫码获取商品编号及价格
  scanTap(e){
    const { index} = e.currentTarget.dataset;
    const  that = this;
    const { goodsList} = this.data;
    wx.scanCode({
      success:function(res){
        let context = 'goodsList['+ index + '].number';
        let conNum = 'goodsList[' + index + '].num'
        that.setData({
          [context]: res.result,
          [conNum]:1
        })
        that.getGoodsInfo(res.result , index);
      }
    })  

  },
  //输入商品信息
  goodsInput(e){
    const { index , param} = e.currentTarget.dataset;
    let { goodsList } = this.data;
    if(param == '1'){ //编号发生改变
      let conText = 'goodsList['+ index +'].number';
      let conNum = 'goodsList[' + index + '].num';
      this.setData({
        [conText]: e.detail.value,
        [conNum]: 1
      })
    }else{
      let conText = 'goodsList['+ index +'].num';
      this.setData({
        [conText]: e.detail.value
      })
    }

  },
  // 删除商品
  delTap(e){
    const { index} = e.currentTarget.dataset;
    let {goodsList} = this.data;

    if(goodsList[index].goodsId == ""){
      goodsList.splice(index, 1);
      this.setData({
        goodsList: goodsList
      })
    }else{
      goodsList.splice(index, 1);
      this.setData({
        goodsList: goodsList
      })
      this.getTotal();
    }
  },
  //确认单品信息
  confirmGoods(e){
    const { index } = e.currentTarget.dataset;
    this.getGoodsInfo(e.detail.value ,index);
  },

  // 修改了数量

  changeNum(e){
    const { index} = e.currentTarget.dataset;
    const { goodsList} = this.data;
    if (goodsList[index].number == '') {
      wx.showToast({
        title: '请先输入商品编号',
        icon: 'none'
      })
      return false;
    }
    this.getTotal();
  },

  // 获取单品信息
  getGoodsInfo(numb,index){
    let {goodsList} = this.data;
    wx.showLoading({
      title: '加载中...',
      mask:true
    })
    app.getData('/business/getGoodsDetail',{
      number:numb
    },(res)=>{
        let  param = 'goodsList['+ index +'].price';
        this.setData({
          [param]: res.goodsPrice
        })    
        this.getTotal();
        wx.hideLoading();
    },()=>{
      wx.hideLoading();
    })

  },


  // 获取商品总数和总额
  getTotal(){
    const { goodsList} = this.data;
    let  totalNum = 0;
    let totalPrice = 0;
    goodsList.map(function(item){
        let currPrice = parseInt(item.num)* Number(item.price);
        totalPrice += currPrice;
        totalNum += parseInt(item.num);
    })

    this.setData({
      goodsTotal:totalNum,
      goodsTotalPrice:totalPrice
    })
  },

  // 保存或发货
  submit(e){
    const { type } = e.currentTarget.dataset;
    const { depotId, loginstics, loginsticsNumber, refundReason, goodsList, goodsTotalPrice, goodsTotal, orderId } = this.data;
    if (!depotId ){
      wx.showToast({
        title: '请先选择仓库',
        icon:'none'
      })
      return false ;
    }
    if (!loginstics || loginstics== '') {
      wx.showToast({
        title: '物流公司必填',
        icon: 'none'
      })
      return false;
    }

    if (!loginsticsNumber || loginsticsNumber== '') {
      wx.showToast({
        title: '物流单号必填',
        icon: 'none'
      })
      return false;
    }

    if (goodsList.length == 0) {
      wx.showToast({
        title: '请先添加商品',
        icon: 'none'
      })
      return false;
    }
    let goodsErr = true;
    for( let i in goodsList){
      if (goodsList[i].number == '' || !goodsList[i].number) {
        wx.showToast({
          title: '商品编号不正确',
          icon: 'none',
          mask: true
        })
        goodsErr = false;
        break;
      }
      if (!goodsList[i].num || goodsList[i].num == 0) {
        wx.showToast({
          title: '商品数量不正确',
          icon: 'none',
          mask: true
        })
        goodsErr = false;
        break;
      }
    }

    if(!goodsErr){
      return false;
    }
    let tips = '';
    if (type == 1){
      tips = '保存成功！'
    }else{
      tips = '发货成功！'
    }

    app.submit('/business/submitAddRefundGoods',{
      busId:app.globalData.busId,
      depotId: depotId,
      loginstics: loginstics,
      loginsticsNumber: loginsticsNumber,
      refundReason: refundReason,
      goodsList: goodsList,
      type: type,
      goodsTotalPrice: goodsTotalPrice,
      goodsTotal: goodsTotal,
      orderId: orderId
    },(res)=>{
      wx.showToast({
        title: tips,
        success(){
          setTimeout(()=>{
            wx.navigateBack();
          },2000)
        }
      })

    })
  },
  confirmDelTap(){
    const { orderId } = this.data;
    app.submit('/business/deleteRefundOrder', {
      orderId: orderId
    }, (res) => {
      wx.showToast({
        title: '删除成功',
        success() {
          setTimeout(() => {
            wx.navigateBack();
          }, 2000)
        }
      })
    })
  },
  // 删除
  deleteTap(){
    this.dialog.showDialog();
  }
})