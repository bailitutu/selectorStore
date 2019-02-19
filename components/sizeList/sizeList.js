// components/sizeList/sizeList.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    cell:{
      type:Object,
      value:{}
    },
    canShow:{
      type:Boolean,
      value:false
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    isShow:false,
    cell:{},
    infoList:[],
    showInfo:false,
    total:0
  },

  /**
   * 组件的方法列表
   */
  methods: {
    showTap(){
      const { isShow ,cell} = this.data;
      this.setData({
        isShow:!isShow
      })
    },

    showInfo(e) {
      if (!this.data.canShow){
        return;
      }
      let { cell } = this.data;
      const { index } = e.currentTarget.dataset;
      let infolist = [];
      infolist = cell.sizeList[index].singleDimensionList;
      this.setData({
        showInfo: true,
        infoList: infolist
      })
    },
    hideInfo() {
      this.setData({
        showInfo: false
      })
    }

  },
  attached: function () { 
    let {cell,total} = this.data;
    cell.sizeList.map((item) => {
      total += Number(item.num)
    })
    this.setData({
      total : total
    })
  }
})
