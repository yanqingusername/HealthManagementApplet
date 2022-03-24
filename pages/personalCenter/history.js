const app = getApp();
const request = require('../../utils/request.js')
const box = require('../../utils/box.js')

Page({
    data: {
        height_weight: true,
        height_weight_data: [],
        blood_pressure: true,
        blood_pressure_data: [],
        bone_density: true,
        bone_density_data: [],
        body_composition: true,
        body_composition_data: [],
        biochemical_examination: true,
        biochemical_examination_data: []
    },
    onLoad: function (options) {
        let that = this;
        let type = options.type;
        if (type == 1) {
            wx.setNavigationBarTitle({
                title:"基本体格检查"
            })
            that.setData({
                height_weight: false
            })
        } else if (type == 2) {
            wx.setNavigationBarTitle({
                title:"血压"
            })
            that.setData({
                blood_pressure: false
            })
        } else if (type == 3) {
            wx.setNavigationBarTitle({
                title:"骨密度"
            })
            that.setData({
                bone_density: false
            })
        } else if (type == 4) {
            wx.setNavigationBarTitle({
                title:"人体成分"
            })
            that.setData({
                body_composition: false
            })
        } else if (type == 5) {
            wx.setNavigationBarTitle({
                title:"生化检查"
            })
            that.setData({
                biochemical_examination: false
            })
        } else {
            //没这个类型
            wx.showModal({
                title: '温馨提示',
                content: '没有这个类型的检测数据',
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
        // 1.height_weight
        // 2.blood_pressure
        // 3.bone_density
        // 4.body_composition
        // 5.biochemical_examination
        // 6.待定
        let data = {
            type: type,
            user_id: app.globalData.userInfo.user_id
        }
        console.info("历史报告传参",data)
        request.request_get('/api/getPE3.hn', data, function (res) {
            console.info('历史报告回调', res)
            if (res) {
                if (!res.success) {
                    //box.showToast(res.msg);
                    return;
                }
                //填充页面
                if (type == 1) {
                    that.setData({
                        height_weight_data: res.msg
                    })
                } else if (type == 2) {
                    that.setData({
                        blood_pressure_data: res.msg
                    })
                } else if (type == 3) {
                    that.setData({
                        bone_density_data: res.msg
                    })
                } else if (type == 4) {
                    that.setData({
                        body_composition_data: res.msg
                    })
                } else if (type == 5) {
                    that.setData({
                        biochemical_examination_data: res.msg
                    })
                }
            }
        })
    },
    onShow: function () {},
});