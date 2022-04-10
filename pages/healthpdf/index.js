const app = getApp();
const request = require('../../utils/request.js')
const box = require('../../utils/box.js')

Page({
    data: {
        esrc:""
    },
    onLoad: function (options) {
        
        wx.setNavigationBarTitle({
            title: 'PDF',
        });

        this.setData({
            esrc: options.url
        });
    },
    onShow: function () {},
   
});