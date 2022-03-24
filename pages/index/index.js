
const app = getApp()
const updateApp = require('../../utils/updateApp.js')
const request = require('../../utils/request.js')
const box = require('../../utils/box.js')


Page({
    data:{
        timestamp:new Date().getTime(),
        page:1,
        pageSize:6,
        mealInfoList:[],
        count:0,
        digital:0

    },
    onLoad:function(){
        let that = this;
        setInterval(function () {
            // that.selectPageShufflingText();
            that.getMsg();
          }, 1000*30)    //代表1秒钟发送一次请求

          
        // 自动检查小程序版本并更新
        updateApp.updateApp("健康管理系统");
        that.getMsg();
        that.getmealInfoList();
        that.currentTime();
        
    },
    onShow:function(){
        let that = this;
        that.getMsg();
        //每次进来，判断是否填写信息
        if(app.globalData.userInfo.base_info==0){
            //直接提示并跳转信息编辑页面
            wx.showModal({
                title: '温馨提示',
                content: '志愿者请先完善个人信息，以便信息跟踪和统计。',
                showCancel: false,//是否显示取消按钮
                // cancelText:"否",//默认是“取消”
                // cancelColor:'#23CBC4',//取消文字的颜色
                confirmText:"立即完善",//默认是“确定”
                // confirmColor: '#23CBC4',//确定文字的颜色
                success: function (res) {
                    //跳转
                    wx.navigateTo({
                        url: '/pages/personalCenter/baseInfoEdit',
                      })
                }
             })
        }
    },
    currentTime() {
        let tempTime = new Date(this.data.timestamp);
        let month=tempTime.getMonth() + 1;
        let day=tempTime.getDate();
        if(month<10){
            month="0"+month
        }
        if(day<10){
            day="0"+day
        }
        let curtime = tempTime.getFullYear() + "-" + (month) + "-" + day;
        console.log('currentTime' + curtime);
        this.setData({
            date: curtime
        })
    },
    changeTimeBefore:function(){
        let that = this;
        let timestamp = that.data.timestamp - 24 * 60 * 60 * 1000;
        let tempTime = new Date(timestamp);
        let month=tempTime.getMonth() + 1;
        let day=tempTime.getDate();
        if(month<10){
            month="0"+month
        }
        if(day<10){
            day="0"+day
        }
        let date = tempTime.getFullYear() + "-" + (month) + "-" + day;
        that.setData({
            page:1,
            timestamp:timestamp,
            date:date,
            mealInfoList:[]
        })
        // console.log(date)
        // console.log(timestamp)
        that.getmealInfoList();
    },
    changeTimeNext:function(){
        let that = this;
        if(new Date(that.data.timestamp).toDateString() === new Date().toDateString()){
            return; //到达今天时，不能再选择下一天
        }
        let timestamp = that.data.timestamp + 24 * 60 * 60 * 1000;
        let tempTime = new Date(timestamp);
        let month=tempTime.getMonth() + 1;
        let day=tempTime.getDate();
        if(month<10){
            month="0"+month
        }
        if(day<10){
            day="0"+day
        }
        let date = tempTime.getFullYear() + "-" + (month) + "-" + day;
        that.setData({
            page:1,
            timestamp:timestamp,
            date:date,
            mealInfoList:[]
        })
        this.getmealInfoList();
    },
    addDietRecord:function(e){
     let type=e.currentTarget.dataset.type;
     let time=e.currentTarget.dataset.time
     let mealInfoList=this.data.mealInfoList;
     let flag=true;//，默认是添加食物
     let mealid;
     if(type!=4){
        for(var i=0;i<mealInfoList.length;i++){
            if(mealInfoList[i].meal_type==type){
               flag=false;
               mealid=mealInfoList[i].record_num
               break;
            }
        }
        if(flag){
           console.log(type);
           wx.navigateTo({
             url: '/pages/index/addDietRecord?type='+type+"&time="+time,
           })
        }else{
           wx.navigateTo({
             url: '/pages/index/mealInfo?id='+mealid,
           })
        } 
     }else{
        console.log(type);
        wx.navigateTo({
          url: '/pages/index/addDietRecord?type='+type+"&time="+time,
        })
     }
     
    },
    goMessage:function(e){
           wx.navigateTo({
             url: '/pages/index/message?',
           })
       },
    getmealInfoList: function () {
    var that = this;
    console.log(that.data.page)
    console.log(that.data.timestamp)
    var data = {
        meal_person_id: app.globalData.userInfo.id,
        timestamp:that.data.timestamp,
        pageNum: that.data.page, //页数
        // pageCount: that.data.pageSize //每页数据
    }
    console.info("食物列表传参",data)
    request.request_get('/api/getFoodList.hn', data, function (res) {
        console.info('食物列表回调', res)
        if (res) {
            if (res.success) {
                var mealInfoListTemp = that.data.mealInfoList;
                var mealInfoList = res.msg;
                if(mealInfoList.length == 0 && that.data.page == 1 ){
                    that.setData({
                    tip:"暂无数据",
                    tip_temp:'暂无数据',
                    
                        alreadyChecked:true,
                        alreadyChecked_temp:true
                    })
                }else if(mealInfoList.length < that.data.pageSize){ //无更多数据
                    that.setData({
                        hasMoreData:false,
                        page: that.data.page + 1,
                        tip:"没有更多数据了",
                        tip_temp:'没有更多数据了',
                        alreadyChecked:true,
                        alreadyChecked_temp:false
                    })
                }else{      // 有更多数据
                    that.setData({
                        hasMoreData:true,
                        page: that.data.page + 1,
                        tip:"加载中",
                        tip_temp:'加载中',
                        alreadyChecked:true,
                        alreadyChecked_temp:false
                    })
                }
                mealInfoList = mealInfoListTemp.concat(mealInfoList);
                console.info(mealInfoList);
                for(var i=0; i< mealInfoList.length;i++){
                    
                        var str_arr_1 =  mealInfoList[i].meal_content.split(";");
                        str_arr_1.pop(); 
                        mealInfoList[i].meal_content_arr = str_arr_1;
                        console.info(mealInfoList[i].meal_content_arr);
                    
                    
                        var str_arr_2 =  mealInfoList[i].intake_amount.split(";");
                        str_arr_2.pop(); 
                        mealInfoList[i].intake_amount_arr = str_arr_2;
                        console.info(mealInfoList[i].intake_amount_arr);
                    
                }
                console.info(mealInfoList);
                that.setData({
                    mealInfoList: mealInfoList,
                    count:res.count
                });
                console.info(that.data.mealInfoList);
            } else {
                box.showToast(res.msg);
            }
        }else{
        box.showToast("网络不稳定，请重试");
        }
	})
    },
    getMsg:function(){
        let that = this;
    //每次进来更新数据 TODO
    let data = {
        id: app.globalData.userInfo.id
    }
    request.request_get('/api/getMsg.hn', data, function (res) {
        console.info('回调消息', res)
        if (res) {
            if (!res.success) {
                box.showToast(res.msg);
                return;
            }
            console.log(res.count)
            that.setData({
               
                digital:res.count
            })
        }
    })
    },
    toInfo:function(e){
        let that = this;
        wx.navigateTo({
          url: '/pages/index/mealInfo?id='+e.currentTarget.dataset.id,
        })
    },

    // loginApp:function(){
    //     wx.login({
    //         success: (res) => {
    //             var code = res.code;
    //             console.log("获取code成功" + code );
    //             request.request_get('/pigProjectApplet/entryApplet.hn', { wxCode: code }, function (res) {
    //                 console.info('回调', res);
    //                 if(res){
    //                     if(res.success){
    //                         app.globalData.openid = res.msg;
    //                         if(res.code=='200'){    //没有登陆过小程序
    //                             wx.reLaunch({
    //                                 url: '/pages/main/login',
    //                             })
    //                         } else if (res.code=='199'){    // 获取登录账号的相关信息
    //                             login.toLogin(res.phone);
    //                         }
    //                     }else{
    //                         box.showToast(res.msg);
    //                     }
    //                 }
    //             })
    //         },
    //         fail:(res) => {
    //             console.log("登录信息获取失败：" + res);
    //             box.showToast("登录信息获取失败，请重试")
    //         }
    //     })
    // },
    // 预览图片
  previewImg: function (e) {
    //获取当前图片的下标
    console.log("ssss"+e.currentTarget.dataset.src);
    
    var index = e.currentTarget.dataset.index;
    //所有图片
    var img_arr = e.currentTarget.dataset.src;
    wx.previewImage({
      //当前显示图片
      current: img_arr[index],
      //所有图片
      urls: img_arr
    })
  },
})
