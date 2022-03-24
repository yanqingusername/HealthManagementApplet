const app = getApp();
const request = require('../../utils/request.js')
const box = require('../../utils/box.js')

Page({
    data: {
        time:'',
        cur_height_weight: {
            height: '-',//身高
            height_unit:'-',
            Weight: '-',//体重
            Weight_unit:'-',
            create_time: '-',
            waist: '-',//腰围
            bmi: '-',
            bmi_unit:'-',
            whtr: '-'//腰高比
        },
        cur_blood_pressure: {
            heart_rate: '-',
            systolic: '-',//收缩压
            systolic_unit:'-',
            diastolic: '-',//舒张压
            diastolic_unit:'-',
            create_time: '-'
        },
        cur_bone_density: {
            bmd_t: '-',
            bmd_t_unit:'-',
            bmd_z:'-',
            bmd_z_unit:'-',
            create_time: '-'
        },
        cur_body_composition: {
            FatPercentage: '-',//体脂肪率
            FatPercentage_unit:'-',
            BasicMetabolism: '-',//基础代谢率
            BasicMetabolism_unit:'-',
            MuscleMass: '-',//肌肉量
            MuscleMass_unit:'-',
            muscle: '-',//肌肉率
            muscle_unit:'-',
            BodyBone: '-',//骨量
            BodyBone_unit:'-',
            sm:"-",//骨骼肌率
            sm_unit:'-',
            BodyWaterContent: '-',//体水分率
            BodyWaterContent_unit: '-',
            create_time: '-'
        },
        cur_biochemical_examination: {
            routine_blood_test: '-',
            urinalysis: '-',
            liver: '-',
            renal: '-',
            urinary_microalbumin: '-',
            create_time: '-'
        },

    },
    onLoad: function () {
        let that = this;
        console.log("健康数据详情")
        //这里需要获取最新的体检数据
        let data = {
            user_id: app.globalData.userInfo.user_id
        }
        request.request_get('/api/getPhysicalExamination.hn', data, function (res) {
            console.info('健康报告回调', res)
            if (res) {
                that.setData({
                    time:res.time
                })
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
                if (res.be != '') {
                    that.setData({
                        cur_biochemical_examination: res.be
                    })
                }
            }
        })
    },
    onShow: function () {
    },
    go_history: function (e) {
        let type = e.currentTarget.dataset.type;
        console.log(type);
        wx.navigateTo({
            url: '/pages/personalCenter/history?type=' + type,
        })
    },
});