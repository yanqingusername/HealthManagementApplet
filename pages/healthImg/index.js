const app = getApp();
const request = require('../../utils/request.js')
const box = require('../../utils/box.js')

Page({
    data: {
        typeString: 1
    },
    onLoad: function (options) {

        let typeString = options.typestring;
        this.setData({
            typeString: typeString
        });
        if(typeString == 1){
            wx.setNavigationBarTitle({
                title: '标准值参考范围',
            });
        } else if(typeString == 2){
            wx.setNavigationBarTitle({
                title: '膳食拍照SOP',
            });
        } 
    },
    onShow: function () {},
   
});