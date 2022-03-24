App({
    onLaunch: function () {
        // ***获取右上角的胶囊**********
        wx.getSystemInfo({
            success: e => {
                this.globalData.StatusBar = e.statusBarHeight;
                let capsule = wx.getMenuButtonBoundingClientRect();
                if (capsule) {
                    this.globalData.Custom = capsule;
                    this.globalData.CustomBar = capsule.bottom + capsule.top - e.statusBarHeight;
                } else {
                    this.globalData.CustomBar = e.statusBarHeight + 50;
                }
                this.globalData.ratio = e.windowWidth / 750;
            }
        })
    },
    globalData: {
        //微信信息
        openid: '',
        nickName: '',
        avatarUrl: '',
        gender: '',
        //用户信息
        userInfo:{},
    }
})









// 隐藏功能
/**
 * app.json
 * 
            {
                "pagePath": "pages/message/index",
                "iconPath": "/image/icon/tab_message.png",
                "selectedIconPath": "/image/icon/tab_message_select.png",
                "text": "消息"
            },
 */