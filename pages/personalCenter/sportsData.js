const app = getApp();
const request = require('../../utils/request.js')
const box = require('../../utils/box.js')

Page({
    data: {
        steps: true,
        steps_data: [],
        heart_rate: true,
        heart_rate_data: []
    },
    onLoad: function (options) {
        let that = this;
        let type = options.type;
        if (type == 1) {
            wx.setNavigationBarTitle({
                title:"步数"
            })
            that.setData({
                steps: false
            })
        } else if (type == 2) {
            wx.setNavigationBarTitle({
                title:"心率"
            })
            that.setData({
                heart_rate: false
            })
        }else if (type == 3) {
            wx.setNavigationBarTitle({
                title:"热量消耗"
            })
            that.setData({
                heart_rate: false
            })
        }
        else {
            //没这个类型
            wx.showModal({
                title: '温馨提示',
                content: '没有这个类型的运动数据',
                showCancel: false, //是否显示取消按钮
                cancelText: "否", //默认是“取消”
                cancelColor: 'skyblue', //取消文字的颜色
                confirmText: "好的", //默认是“确定”
                confirmColor: 'skyblue', //确定文字的颜色
                success: function (res) {
                    wx.navigateBack();
                }
            })
        }
        //去后台获取对应信息，加载页面
        // 1.steps
        // 2.heart_rate

        let data = {
            type: type,
            id: app.globalData.userInfo.id
        }
        request.request_get('/api/getSports.hn', data, function (res) {
            console.info('回调', res)
            if (res) {
                if (!res.success) {
                    //box.showToast(res.msg);
                    return;
                }
                //填充页面
                console.log('后台返回的数据');
                console.log(res);
                if (type == 1) {
                    that.setData({
                        steps_data: res.msg
                    })
                } else if (type == 2) {
                    that.setData({
                        heart_rate_data: res.msg
                    })
                } 
            }
        })
    },
    onShow: function () {},
});