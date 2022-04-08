const app = getApp();
const request = require('../../utils/request.js')
const box = require('../../utils/box.js')

Page({
    data: {
        type: 1
    },
    onLoad: function (options) {
        this.setData({
            type: options.type
        });
        if(this.data.type == 1){
            wx.setNavigationBarTitle({
                title:"专家指导建议"
            })
        } else if(this.data.type == 2){
            wx.setNavigationBarTitle({
                title:"腹部超声"
            })
        }
        

        // let data = {
        //     type: type,
        //     id: app.globalData.userInfo.id
        // }
        // request.request_get('/api/getSports.hn', data, function (res) {
        //     console.info('回调', res)
        //     if (res) {
        //         if (!res.success) {
        //             //box.showToast(res.msg);
        //             return;
        //         }
        //         //填充页面
        //         console.log('后台返回的数据');
        //         console.log(res);
        //         if (type == 1) {
        //             that.setData({
        //                 steps_data: res.msg
        //             })
        //         } else if (type == 2) {
        //             that.setData({
        //                 heart_rate_data: res.msg
        //             })
        //         } 
        //     }
        // })
    },
    onShow: function () {},
    
});