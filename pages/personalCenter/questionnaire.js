const app = getApp();
const request = require('../../utils/request.js')
const box = require('../../utils/box.js')

Page({
	data:{
        customer_phone: '400-168-1375',
        questionlist:[
        ]
	},
    onLoad:function(options) {
    //     var obj =JSON.parse(options.questionlist)
    //     this.setData({
    //     questionlist:obj
    //    })
    var that=this;
    let data={
        openid:app.globalData.openid
     }
    request.request_get('/hmapi/getuserquestionstate.hn', data, function (res) {
        that.setData({
            questionlist:res.msg
        })
        console.info('调查问卷列表回调', res)
    })
    },
    onShow:function(){
 
    },
    go_test:function(e){
        console.log(e)
        let type=e.currentTarget.dataset.type;
        let id=e.currentTarget.dataset.id
        let title=e.currentTarget.dataset.title
        if(type==1){
            wx.showToast({
              title: '问卷已作答完成',
              icon:"error"
            })
        }else{
                 wx.navigateTo({
                    url: '/pages/personalCenter/question?id='+id+"&title="+title,
              })
        }
        
        
    },
});