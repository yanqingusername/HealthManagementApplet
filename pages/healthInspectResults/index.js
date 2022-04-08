const app = getApp();
const request = require('../../utils/request.js')
const box = require('../../utils/box.js')

Page({
    data: {
        csstype: 1,
        title: '基本体格检查',
        method: 'getphysiqueinfo',
        type:"",
        dataList: []
    },
    onLoad: function (options) {
        let title = options.title;
        this.setData({
            csstype: options.csstype,
            method: options.method,
            type: options.type
        });

        wx.setNavigationBarTitle({
            title: title,
        });
        this.getMethod();
    },
    onShow: function () {},
    getMethod(){
        let that = this;
        let data = {
            userid: app.globalData.userInfo.user_id,
            type: this.data.type
        }
        let url = '/hmapi/'+ this.data.method +'.hn';
        request.request_get(url, data, function (res) {
            if (res) {
                if (!res.success) {
                    box.showToast(res.msg);
                    return;
                }
                that.setData({
                    dataList: res.msg
                });
            }
        })
    },
});