
const app = getApp()
const updateApp = require('../../utils/updateApp.js')
const request = require('../../utils/request.js')
const box = require('../../utils/box.js')

Page({
    data:{
        msgs:[]

    },
    onLoad:function(){
        let that = this;
        that.updateMsg();
    //每次进来更新数据 TODO
    let data = {
        id: app.globalData.userInfo.id
    }
    request.request_get('/api/getMsg.hn', data, function (res) {
        console.info('消息列表回调', res)
        if (res) {
            if (!res.success) {
                box.showToast(res.msg);
                return;
            }
            that.setData({
                msgs:res.msg
            })
        }
    })
    },
    onShow:function(e){
        
    },
    updateMsg:function(){
        let that = this;
        let data = { 
            id: app.globalData.userInfo.id
        }
        request.request_get('/api/updateMsgStatus.hn',data,function(res){
            console.log("updateMsg回调", res);
            if(res){
                if(res.success){
                    console.log(res.msg);
                }else{
                    console.log(res.msg);
                }
            }else{
                box.showToast(res.msg);
            }
        })
    },
})
