const app = getApp();
const request = require('../../utils/request.js')
const box = require('../../utils/box.js')

Page({
    data: {
        reportList: []
    },
    onLoad: function (options) {
        wx.setNavigationBarTitle({
            title:"我的健康报告"
        })
    },
    onShow: function () {
        this.getReportlist();
    },
    getReportlist(){
        let that = this;
        let data = {}
        request.request_get('/hmapi/getReportlist.hn', data, function (res) {
            console.info('回调', res)
            if (res) {
                if (!res.success) {
                    box.showToast(res.msg);
                    return;
                }
                that.setData({
                    reportList: res.msg
                });
                
            }
        })
    },
    bindExpertSuggest(e){
        let type = e.currentTarget.dataset.type;
        wx.navigateTo({
            url: `/pages/expertSuggest/index?type=${type}`,
        })
    },
    bindInspectResults(e){
        let method = e.currentTarget.dataset.method;
        let type = e.currentTarget.dataset.type;
        let title = e.currentTarget.dataset.title;
        let csstype = e.currentTarget.dataset.csstype;
        if(method && title && csstype && type){
            wx.navigateTo({
                url: `/pages/healthInspectResults/index?method=${method}&csstype=${csstype}&title=${title}&type=${type}`,
            })
        }
    },
});