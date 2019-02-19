var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isReady:false, 
    salesOrderId:null,
    price:0,//支付金额
    codeUrl:'',//付款二维码
    showBtn:false,//是否显示确认按钮
    isSuccess:false, //是否支付成功
    payType: 0,  //支付方式 	1:微信已生成付款二维码 2：微信商户收款二维码 ；3：支付宝已生成付款二维码 ；4： 支付宝商户收款二维码;
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      salesOrderId:options.id
    })
    this.getPageData();
  },

  getPageData(){
    const { salesOrderId} = this.data;
    wx.showNavigationBarLoading();
    app.getPageData('/business/getCollectCode',{
      salesOrderId: salesOrderId
    },(res)=>{
      
        //判断是何种支付方式 	1:微信已生成付款二维码 2：微信商户收款二维码 ；3：支付宝已生成付款二维码 ；4： 支付宝商户收款二维码;
      let payWay = res.type;
      switch (payWay) {
          case '1':
          // 微信扫一扫，向我付钱
            this.setData({
              isReady:true,
              title:'微信扫一扫，向我付钱',
              codeUrl: res.url,
              price:res.price,
              payType:res.type
            })

          break;
        case '2':

          // 微信扫一扫，向我付钱
          this.setData({
            isReady: true,
            title: '微信扫一扫，向我付钱',
            codeUrl: res.url,
            price: res.price,
            payType: res.type,
          })

          break;
        case '3':

          // 支付宝扫一扫，向我付钱
          this.setData({
            isReady: true,
            title: '支付宝扫一扫，向我付钱',
            price: res.price,
            codeUrl:res.url,
            payType: res.type

          })
          break;
        case '4':

          // 支付宝扫一扫，向我付钱
          this.setData({
            isReady: true,
            title: '支付宝扫一扫，向我付钱',
            codeUrl: res.url,
            price: res.price,
            payType: res.type
          })

          break;
          default:
            wx.showToast({
              title: '支付方式错误',
              icon:'none',
              success(){
                setTimeout(()=>{
                  wx.navigateBack();
                },2000)
              }
            })
          break;
      }
      wx.hideNavigationBarLoading();
    })

  },

  // 获取支付是否成功
  getOrderStatus(){
    const { salesOrderId} = this.data;
    const that = this;
    wx.showLoading({
      title: '查询中...',
      mask:true
    })
    app.getPageData('/business/getPayStatus',{
      salesOrderId: salesOrderId
    },(res)=>{
      wx.hideLoading();
      switch (res.code) {
        case '1111111':
          wx.showToast({
            title: '系统异常，请重新支付！',
            duration: 2000
          })
          break;
        case '2222222':
          wx.showToast({
            title: '订单不存在!',
            duration: 2000
          })
          break;
        case '0000001':
          wx.showToast({
            title: '已收款！',
            success(){
              setTimeout(()=>{
                // 支付已完成
                wx.reLaunch({
                  url: '/pages/salesPages/paySuccess/paySuccess?id=' + salesOrderId,
                })
              },1500)
            }
          })
    
          break;
        case '0000002':
          wx.showToast({
            title: '转入退款！',
            icon: 'none',
            duration: 2000
          })
          break;
        case '0000003':
          wx.showToast({
            title: '用户支付中,请稍候',
            icon: 'none',
            duration:2000
          })
          break;
        case '0000004':
          wx.showToast({
            title: '订单已关闭 ！',
            icon: 'none',
            duration: 2000
          })
          break;
        case '0000005':
          wx.showToast({
            title: '用户支付中,请稍候！',
            icon: 'none',
            duration: 2000
          })
          break;
        default:
          wx.showToast({
            title: '系统异常，请重新支付！',
            icon: 'none',
            duration: 2000
          })

          return false;
      }
    },()=>{
      wx.hideLoading();
    })
  },
  // 进入支付成功
  goSuccess(){
    const { salesOrderId } = this.data;

    app.submit('/business/confirmPay',{
      salesOrderId: salesOrderId,
      busId:app.globalData.busId
    },(res)=>{
      wx.reLaunch({
        url: '/pages/salesPages/paySuccess/paySuccess?id=' + salesOrderId,
      })

    })
  }
})