// components/search/search.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    holderText:{
      type:String,
      value: '搜索'
    },
    showScan:{
      type:String,
      value:false
    },
    noBorder:{
      type:String,
      value:false
    }
  },

  options: {
    multipleSlots: true
  },

  /**
   * 组件的初始数据
   */
  data: {
    searchVal:'', //搜索结果
    isable:true,  //是否可用
  },

  /**
   * 组件的方法列表
   */
  methods: {

    changeVal(e){
      this.setData({
        searchVal:e.detail.value
      })
    },

    searchTap(){
      let searchVal = this.data.searchVal;
      if (!searchVal || searchVal.length == 0){
        return false;
      }
      this.setData({
        searchVal:''
      })
      this.triggerEvent("searchTap",searchVal);
    },

    // 点击扫码
    scanTap(){
      const that = this;
      wx.scanCode({
        onlyFromCamera: true,
        scanType: ['qrCode','barCode'],
        success: (res) => {
          that.setData({
            searchVal:res.result
          })
          that.triggerEvent("scanTap", res.result);
        }
      })
    }
  }
})
