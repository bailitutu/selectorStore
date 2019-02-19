// components/sales/sales.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    time:{
      type:String,
      value:''
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    isShow: false,
  },

  /**
   * 组件的方法列表
   */
  methods: {
    showTap() {
      const { isShow } = this.data;
      this.setData({
        isShow: !isShow
      })
    }
  }
})
