const app = getApp();
const request = require('../../utils/request.js')
const box = require('../../utils/box.js')

Page({
    data: {
        touxiang:'',
        questionstate:0,
        questionlist:[],
        name: '',
        school: '',
        avatarUrl: '',
        cur_height_weight: {
            height: '-',
            height_unit:'-',
            Weight: '-',
            Weight_unit:'-',
            create_time: '-'
        },
        cur_blood_pressure: {
            systolic: '-',//收缩压
            systolic_unit:'-',
            diastolic: '-',//舒张压
            diastolic_unit:'-',
            create_time: '-'
        },
        cur_body_composition: {
            MuscleMass: '-',//肌肉量
            MuscleMass_unit:'-',
            FatPercentage: '-',//体脂肪率
            FatPercentage_unit:'-',
            create_time: '-'
        },
        cur_bone_density: {
            bmd_t: '-',//T
            bmd_t_unit:'-',
            bmd_z: '-',//Z
            bmd_z_unit:'-',
            create_time: '-'
        },
        cur_sports_bracelet: {
            steps: '-',
            heart_rate: '-',
            calorie: '-',
            create_time: '-'
        },
        maxHeartRate:"-",
        avgOxygenSaturation:"-",
        caloriesBurned:"-",
        step:"-",
    },
    onLoad: function () {
        let avatarUrl = wx.getStorageSync('avatarUrl');
        let nickName = wx.getStorageSync('nickName');

        this.setData({
            touxiang:avatarUrl
        })
        console.info("99999999990",avatarUrl)
        let that = this;
        console.log("进入个人中心")
        that.setData({
            name: nickName,
            avatarUrl: avatarUrl,
        })

        //这里需要获取最新的体检数据，判断是否有新的问卷
        let data = {
            user_id: app.globalData.userInfo.user_id
        }
        let data1={
           openid:app.globalData.openid
        }
        console.info("调查问卷有无传参",data1)
        request.request_get('/hmapi/getuserquestionstate.hn', data1, function (res) {
            that.setData({
                questionstate:res.flag,
                questionlist:res.msg
            })
            console.info('调查问卷有无回调', res)
        })
        console.info("我的首页传参",data)
        request.request_get('/api/getPhysicalExamination.hn', data, function (res) {
            console.info('我的首页回调', res)
            if (res) {
                if (!res.success) {
                    box.showToast(res.msg);
                    return;
                }
                if (res.hw != '') {
                    that.setData({
                        cur_height_weight: res.hw
                    })
                }
                if (res.bp != '') {
                    that.setData({
                        cur_blood_pressure: res.bp
                    })
                }
                if (res.bc != '') {
                    that.setData({
                        cur_body_composition: res.bc
                    })
                }
                if (res.bd != '') {
                    that.setData({
                        cur_bone_density: res.bd
                    })
                }
                if (res.sb != '') {
                    that.setData({
                        cur_sports_bracelet: res.sb
                    })
                }
            }
        })
    },
    //1、获取每日心率
    getDailyHeartRate(){
        let that = this;
        let data = {
            HWid: app.globalData.userInfo.hw_id
        }
        request.request_new_test('/HW/getDailyHeartRate.hn', data, function (res) {
            if (res) {
                if (!res.success) {
                    box.showToast(res.msg);
                    return;
                }
                that.setData({
                    maxHeartRate: res.msg.maxHeartRate
                });
            }
        })
    },
    //1、每日血氧统计
    getDailyBloodOxygenSaturation(){
        let that = this;
        let data = {
            HWid: app.globalData.userInfo.hw_id
        }
        request.request_new_test('/HW/getDailyBloodOxygenSaturation.hn', data, function (res) {
            if (res) {
                if (!res.success) {
                    box.showToast(res.msg);
                    return;
                }
                that.setData({
                    avgOxygenSaturation: res.msg.avgOxygenSaturation
                });
            }
        })
    },
    //1、获取每日运动数 
    getDailyworkout_system(){
        let that = this;
        let data = {
            HWid: app.globalData.userInfo.hw_id
        }
        request.request_new_test('/HW/getDailyworkout_system.hn', data, function (res) {
            if (res) {
                if (!res.success) {
                    box.showToast(res.msg);
                    return;
                }
                that.setData({
                    caloriesBurned: res.msg.caloriesBurned,
                    step: res.msg.step,
                });
            }
        })
    },
    onShow: function () {
        let that = this;
        //这里面需要每次去app.js中获取用户基本信息，然后展示
        that.setData({
            name: app.globalData.userInfo.name,
            school: app.globalData.userInfo.school
        })

        let data1={
            openid:app.globalData.openid
         }
         console.info("调查问卷有无传参",data1)
         request.request_get('/hmapi/getuserquestionstate.hn', data1, function (res) {
             that.setData({
                 questionstate:res.flag,
             })
             console.info('调查问卷有无回调', res)
         })

         this.getDailyHeartRate();
         this.getDailyBloodOxygenSaturation();
         this.getDailyworkout_system();
    },

    enter_baseInfo: function () {
        wx.navigateTo({
            url: '/pages/personalCenter/baseInfoEdit',
        })
    },
    enter_questionnaire: function () {
        // var obj = JSON.stringify(this.data.questionlist) //myObj：本js文件中的对象
        wx.navigateTo({
            url: '/pages/personalCenter/questionnaire',
        })
    },
    enter_healthReport: function () {
        // 原来的健康报告
        // wx.navigateTo({
        //     url: '/pages/personalCenter/healthReport',
        // })

        wx.navigateTo({
            url: '/pages/myHealthReport/index',
        })
    },
    enter_sports: function (e) {
        let type = e.currentTarget.dataset.type;
        console.log(type);
        // wx.navigateTo({
        //     url: '/pages/personalCenter/sportsData?type=' + type,
        // })

        wx.navigateTo({
            url: '/pages/sportCenter/index?type=' + type,
        })
    },
    bindSleepingLineChart: function (e) {
        let id = app.globalData.userInfo.hw_id
        let name = this.data.name;
        if(id){
            // wx.navigateTo({
            //     url: `/pages/sleepingLineChart/index?hwid=${id}&name=${name}`,
            // })
            wx.navigateTo({
                url: `/pages/sleepingCenter/index?hwid=${id}&name=${name}`,
            })
        }
    },
    bindRunningLineChart: function (e) {
        let id = app.globalData.userInfo.hw_id;
        let name = this.data.name;
        if(id){
            wx.navigateTo({
                url: `/pages/runningLineChart/index?hwid=${id}&name=${name}`,
            })
        }
    },

    // 退出当前账号
    exit: function () {
        wx.showModal({
            title: '',
            content: '是否退出当前账号',
            success: function (res) {
                if (res.confirm) {
                    wx.reLaunch({
                        url: '/pages/login/login',
                    })

                    var data = {
                        openid: app.globalData.openid,
                        type:1
                    }
                    request.request_get('/api/appLogOut.hn', data, function (res) {
                        console.info('回调', res)
                        if (res) {
                            if (res.success) {
                                wx.removeStorageSync({
                                    key: 'avatarUrl',
                                    success(res) {}
                                })
                                wx.removeStorageSync({
                                    key: 'nickName',
                                    success(res) {}
                                })
                                wx.reLaunch({
                                    url: '/pages/login/login',
                                })
                            } else {
                                box.showToast("退出失败，请稍后再试");
                            }
                        }
                    })
                }
            }
        })
    }
});