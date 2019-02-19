//app.js
App({
  globalData: {
    labelList: [],
    styleTypeList: [],   
    payCurrent:1, 
    busId: '',
    httpUrl:'http://192.168.10.20:8040/api/user',
    url: {
      "登录": "/pages/minePages/login/login",
      "忘记密码": "/pages/minePages/forgetPass/forgetPass",
      "修改密码": "/pages/minePages/changePass/changePass",
      "设置密码": "/pages/minePages/setPass/setPass",
      "店铺信息": "/pages/minePages/shopInfo/shopInfo",
      "联系我们": "/pages/minePages/feedback/feedback",
      "设置": "/pages/minePages/setting/setting",
      "销售":"/pages/salesPages/index/index",
      "收银":"/pages/salesPages/collect/collect",
      "销售单流水":"/pages/salesPages/sales/sales",
      "会员管理":"/pages/salesPages/member/member",
      "添加会员":"/pages/salesPages/addMember/addMember",
      "退货":"/pages/salesPages/addRefund/addRefund",
      "银行卡":"/pages/minePages/cardInfo/cardInfo",
      "推广": "/pages/minePages/spread/spread",
      "消息中心":"/pages/salesPages/news/news",
      "待收货":"/pages/goodsPages/waitReceipt/waitReceipt",
      "调货":"/pages/goodsPages/deploy/deploy",
      "商品退货":"/pages/goodsPages/refund/refund",
      "折扣商品":"/pages/goodsPages/discount/discount",
      "库存预警":"/pages/goodsPages/stockWarn/stockWarn",
      "库存查询":"/pages/goodsPages/stock/stock",
      "出入库流水":"/pages/goodsPages/stockHistory/stockHistory",
      "添加退货":"/pages/goodsPages/refundDetail/refundDetail",
      "统计报表":"/pages/collectPages/collectList/collectList",
      "搜索商品":"/pages/salesPages/searchGood/searchGood",
    }
  },
  submit(url, data, callback, fail) {
    wx.showLoading({
      title: '请稍候...',
      mask: true
    })
    let that = this;
    wx.request({
      url: this.globalData.httpUrl + url,
      data: data,
      method: "POST",
      success(res) {
        wx.hideLoading();
        if (res.data.head.respCode === '0000000') {
          if (callback) {
            callback(res.data.body)
          }
        } else if (res.data.head.respCode === '0000020'){
          wx.showToast({
            title: '您已被强制下线！',
            icon: 'none',
            mask: true,
            success() {
              setTimeout(() => {
                wx.redirectTo({
                  url: '/pages/minePages/login/login',
                })
              }, 2000)
            }
          })
          that.globalData.busId = '';
        } else {
          wx.showToast({
            title: res.data.head.respContent,
            icon: 'none',
            success() {
              if (fail) {
                fail(res);
              }
            }
          })
        }
      }
    })
  },

  getData(url, option, callback, fail) {
    wx.showLoading({
      title: '加载中...',
      mask: true
    })
    let that = this;
    wx.request({
      url: this.globalData.httpUrl + url,
      data: Object.assign({
        busId: this.globalData.busId
      }, option),
      method: "GET",
      success(res) {
        wx.hideLoading();
        if (res.data.head.respCode === "0000000") {
          if (callback) {
            callback(res.data.body)
          }
        } else if (res.data.head.respCode === '0000020') {
          wx.showToast({
            title: '您已被强制下线！',
            icon: 'none',
            mask: true,
            success() {
              setTimeout(() => {
                wx.redirectTo({
                  url: '/pages/minePages/login/login',
                })
              }, 2000)
            }
          })
          that.globalData.busId = '';
        } else {
          wx.showToast({
            title: res.data.head.respContent,
            icon: 'none',
            success() {
              if (fail) {
                fail(res);
              }
            }
          })
        }
      }
    })

  },

  getPageData(url, option, callback, fail) {
    wx.showLoading({
      title: '加载中...',
      mask:true
    })
    let that = this;
    wx.request({
      url: this.globalData.httpUrl + url,
      data: option,
      method: "GET",
      success(res) {
        wx.hideLoading();
        if (res.data.head.respCode === "0000000") {
          if (callback) {
            callback(res.data.body)
          }
        } else if (res.data.head.respCode === '0000020') {
          wx.showToast({
            title: '您已被强制下线！',
            icon: 'none',
            mask: true,
            success() {
              setTimeout(() => {
                wx.redirectTo({
                  url: '/pages/minePages/login/login',
                })
              }, 2000)
            }
          })
          that.globalData.busId = '';
        }  else {
          wx.showToast({
            title: res.data.head.respContent,
            icon: 'none',
            success() {
              if (fail) {
                fail(res);
              }
            }
          })
        }
      }
    })

  },

  goRe(type) {
    wx.redirectTo({
      url: this.globalData.url[type],
    })
  },
  goNa(type) {
    wx.navigateTo({
      url: this.globalData.url[type],
    })
  },
  isMoney(money) {
    var reg = /^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/;
    var isMoney = reg.test(money);
    return isMoney;
  },
  isPhone(phone) {
    let phoneReg = /^[1][3,4,5,6,7,8,9][0-9]{9}$/;
    if (!phoneReg.test(phone)) {
      return false;
    } else {
      return true;
    }
  },
  isPassword(password) {
    let pass = /[a-zA-Z0-9]{6,20}$/;
    if (!pass.test(password)) {
      return false;
    } else {
      return true;
    }
  },
  // 获取用户openID；
  getUserOpenId: function (callback) {
    var self = this;
    if (self.globalData.openId) {
      callback(null, self.globalData.openId);
    } else {
      wx.login({
        success: function (data) {
          self.submit('/business/GetOpenid',{
              code: data.code
          }, function (res) {
            callback(null, res.openId)
          })
        },
        fail: function (err) {
          callback(err)
        }
      })
    }
  },
})
