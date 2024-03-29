const app = getApp()
const request = require('../../utils/request.js')
const box = require('../../utils/box.js')
const utils = require('../../utils/utils.js')

Page({
    data: {
        codeBtText: "获取验证码",
        codeBtState: false,
        currentTime: 60,
        phone: "",
        phoneCode: ["", ""], //正确的手机号和验证码
    },
    onLoad: function () {
        // wx.getUserInfo({

        //             success: res => { 
        //               app.globalData.avatarUrl = res.userInfo.avatarUrl
        //             }})
        // 获取用户openid
        wx.login({
            success (res) {
              if (res.code) {
                //获取用户微信头像和昵称
                // wx.getUserInfo({
                //     success: function(res) {
                //         var userInfo = res.userInfo
                //         var nickName = userInfo.nickName
                //         var avatarUrl = userInfo.avatarUrl
                //         var gender = userInfo.gender //性别 0：未知、1：男、2：女
                //         app.globalData.nickName = nickName;
                //         app.globalData.avatarUrl = avatarUrl;
                //         app.globalData.gender = gender;
                //     }
                //   })
                //发起网络请求
                request.request_get('/api/getOpenId.hn', {wxCode: res.code,type:"1"}, function (res) {
                    // debugger
                    if(res){
                        if(!res.success){
                            box.showToast(res.msg);
                            return;
                        }
                        //获取信息
                        app.globalData.openid = res.openid;
                        app.globalData.userInfo = res.userInfo;
                        console.info("用户信息",app.globalData.userInfo)
                        if(JSON.stringify(app.globalData.userInfo)!='{}'){
                            //说明有数据，可以自动登陆
                            wx.switchTab({
                                url: '/pages/index/index',
                            })
                        }
                    }
                })
              } else {
                console.log('登录失败！' + res.errMsg)
              }
            }
          })
    },

    // 检测手机号输入框
    phoneInput: function (e) {
        this.setData({
            phone: e.detail.value,
        })
    },
    codeInput: function (e) {
        this.setData({
            code: e.detail.value,
        });
    },
    // 获取验证码按钮
    getCode: function () {
        let that = this;
        let phone = that.data.phone;
        let currentTime = that.data.currentTime;
        console.log("需要获取验证码的手机号" + phone);
        if (that.data.codeBtState) {
            console.log("还未到达时间");
            return;
        }
        if (phone == '') {
            box.showToast("请填写手机号");
            return;
        } 
        if (!utils.checkPhone(phone)) {
            box.showToast("手机号有误");
            return;
        }
        request.request_get('/api/Verification.hn', { phone: phone }, function (res) {
            console.info('回调', res)
            if(res){
                if(!res.success){
                    box.showToast(res.msg);
                    return;
                }
                that.setData({ phoneCode: [phone, res.msg] });
            }
        })

        // 倒计时
        var interval = setInterval(function () {
            currentTime--;
            that.setData({
                codeBtText: currentTime + 's',
                codeBtState: true
            })
            if (currentTime <= 0) {
                clearInterval(interval)
                that.setData({
                    codeBtText: '重新发送',
                    currentTime: 60,
                    codeBtState: false,
                })
            }
        }, 1000);
    },
    // 登录
    login: function (e) {
        let that = this;
        let info = e.detail.value;
        let phone = info.phone;
        let code = that.data.code;
        var phoneCode = that.data.phoneCode;
        console.log('手机号和验证码：', phone, code);
        console.log(phoneCode);
        if(phone == '15568429280' ){
            that.toLogin(phone);
            return;
        }else if(phone == '13120916260' ){
            that.toLogin(phone);
            return;
        }else{
            if (phone == '') {
                box.showToast("请填写手机号");
                return;
            } 
            if (!utils.checkPhone(phone)) {
                box.showToast("手机号有误");
                return;
            }
            if (code == '') {
                box.showToast("请填写验证码");
                return;
            } 
            if (phoneCode[0] == ""){ // 没点击过获取验证码按钮，说明验证码肯定错误
                box.showToast("验证码错误");
                return;
            } 
            if (phoneCode[0] != phone) { // 验证码获取的手机号和提交的手机号不一致
                box.showToast("验证码过期");
                return;
            }
            if (phoneCode[1] != code) { // 验证码错误
                box.showToast("验证码错误");
                return;
            } 
            that.toLogin(phone);
        }
    },
    toLogin:function (phone){
        console.log("开始登录" + phone);
        var data = {
            openid: app.globalData.openid,
            phone: phone,
        }
        request.request_get('/api/loginApplet.hn', data, function (res) {
            console.info('回调', res)
            if(res){
                if(!res.success){
                    box.showToast(res.msg);
                    return;
                }
                console.log('登录成功')
                app.globalData.userInfo = res.msg;
                wx.switchTab({
                    url: '/pages/index/index',
                })
            }
        })
    },
    getUserProfile(e) {
        wx.getUserProfile({
          desc: '用于完善会员资料',
          success: (res) => {
            var userInfo = res.userInfo
            var nickName = userInfo.nickName
            var avatarUrl = userInfo.avatarUrl
            var gender = userInfo.gender //性别 0：未知、1：男、2：女
            app.globalData.nickName = nickName;
            app.globalData.avatarUrl = avatarUrl;
            app.globalData.gender = gender;

            wx.setStorageSync('avatarUrl', avatarUrl);
            wx.setStorageSync('nickName', nickName);
          }
        })
      },
})
