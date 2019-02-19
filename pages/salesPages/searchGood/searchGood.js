// pages/salesPages/searchGood/searchGood.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list:[],
    query:'',
  },


  // 搜索商品
  search(){

      const { query} = this.data;
      if(!query || query == ''){
          wx.showToast({
            title: '请输入商品编号',
            icon:'none'
          })
          return false;
      }
    app.getPageData('',{
        
    },(res)=>{

    })

  },

  inputChange(e){
    this.setData({

    })
    this.search();
  }


 
})