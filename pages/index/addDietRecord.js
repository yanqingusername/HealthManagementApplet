
const app = getApp()
const updateApp = require('../../utils/updateApp.js')
const request = require('../../utils/request.js')
const box = require('../../utils/box.js')
const time = require('../../utils/time.js')
const utils = require('../../utils/utils.js')

/**
 * Detail类 构造函数 
 * @param {string} meal_content 食物名称
 * @param {string} intake_amount 摄入量
 */
function Detail(meal_content, intake_amount) {
    this.meal_content = meal_content;
    this.intake_amount = intake_amount;
  }
  function Info() {
    this.details = [];
  }

Page({
    data:{
       hoursminute:"",
       yearmouthday:"",
        mindate:"",
        maxdate:"",
        startIsPickerRender: false,
        startIsPickerShow: false,
        startTime: time.format_hour3(new Date(new Date().getTime())).toString() + ":00",
        startChartHide: false,
        time_chosen:false,
        pickerConfig: {
            endDate: false,
            column: "minute",
            dateLimit: true,
            initStartTime: time.format_hour(new Date(new Date().getTime())),
            limitStartTime: time.format_hour(new Date(new Date().getTime() - 1000 * 60 * 60 * 24 * 3)),
            limitEndTime: time.format_hour(new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * 7))
          },
        img_arr:[],
        info:{
            details:[{meal_content:'',intake_amount:''}]
        },
        meal_type:'',
        meal_content_final:'',
        intake_amount_final:''
    },
    bindTimeChange:function(e){
      var temptime=e.detail.value
      console.info("时间选择为",temptime)
      this.setData({
        hoursminute:temptime
      })
    },
    onLoad:function(options){
      let hours=new Date().getHours()
      let minutes=new Date().getMinutes()
      if(hours<10){
        hours="0"+hours
      }
      if(minutes<10){
        minutes="0"+minutes
      }
     this.setData({
      hoursminute:hours+":"+minutes
     })
     console.log(options)
      var temptime=options.time;
      console.info("接收的时间",temptime)
        let that = this;
        that.setData({
          yearmouthday:temptime
        })
        that.getOrderNum();
        if(options.type== 1){
            that.setData({ 
                meal_type: '早',
                meal_type_id:1
            })
        }else if(options.type== 2){
            that.setData({ 
                meal_type: '午',
                meal_type_id:2
            })
        }else if(options.type== 3){
            that.setData({ 
                meal_type: '晚',
                meal_type_id:3
            })
        }else if(options.type== 4){
            that.setData({ 
                meal_type: '加',
                meal_type_id:4
            })
    }
},
    addFood: function (e) {
        let info = this.data.info;
        info.details.push(new Detail('',''));
        this.setData({
          info: info
        });
        console.log(info.details)
      },
      setFood: function (e) {
        let index = parseInt(e.currentTarget.id.replace("food-", ""));
        let meal_content = e.detail.value;
        let info = this.data.info;
        // debugger
        info.details[index].meal_content = meal_content;
        this.setData({
          info: info
        });
      },   
      setAmount: function (e) {
        let index = parseInt(e.currentTarget.id.replace("amount-", ""));
        let intake_amount = e.detail.value;
        let info = this.data.info;
        info.details[index].intake_amount = intake_amount;
        this.setData({
          info: info
        });
      },
    onShow:function(e){
        
    },
    
    // 提交预约信息
  submit: utils.throttle(function (e) {
    // debugger
      let that = this;
    console.log(this.data.info)
    console.log(this.data.info.details)
    var foodList = this.data.info.details
    wx.showLoading({
        title: '提交中...',
        mask:true,
        duration:3000
      })
      var time_chosen = that.data.hoursminute;
      var img_arr = that.data.img_arr;
      if (time_chosen == "") {
        box.showToast("请选择用餐时间");
        return;
       } else if(img_arr.length == 0 && foodList.length == 1&&foodList[0].meal_content==""&&foodList[0].intake_amount==""){
          box.showToast("请拍照记录或文字记录");
          return;
      }
    var meal_content_final = '';
    var intake_amount_final = '';
    for(var i=0;i<foodList.length;i++){ //删除双空白项
      if(foodList[i].meal_content == '' &&foodList[i].intake_amount == ''){
          foodList.splice(i,1);
          i--;
      }
  }
    // var info_p = new Info();
    for(var i in foodList){ //确保不出现只有食物名称没有摄入量或相反的情况
        if(foodList[i].meal_content == '' &&foodList[i].intake_amount != '' ||foodList[i].meal_content != '' &&foodList[i].intake_amount == ''){
            box.showToast("请将文字记录填写完整");
            return;
        }
    }
    
    for (var i in foodList) {
        meal_content_final += foodList[i].meal_content + ";";
        intake_amount_final += foodList[i].intake_amount + ";";
    }
    
    var meal_type_id= that.data.meal_type_id;
    var record_num = that.data.record_num;
    var meal_time = that.data.yearmouthday+" "+that.data.hoursminute;
    var meal_person_id = app.globalData.userInfo.id; // 创建人id
    var meal_person = app.globalData.userInfo.name;
    var school=app.globalData.userInfo.school
    
      var data = {
        meal_person_id:meal_person_id, //进餐人id
        record_num: record_num,
        meal_time: meal_time, // 进餐时间
        meal_type_id: meal_type_id, // 1 早餐  2 午餐  3 晚餐  4 加餐 
        meal_person: meal_person,//进餐人姓名
        imgArr:img_arr,
        meal_content_final : meal_content_final,
        intake_amount_final : intake_amount_final,
        school:school
      }
       console.info("请求数据",data)
      if((data.meal_content_final==""&&data.intake_amount_final=="")&&data.imgArr.length==0){
        box.showToast("请拍照记录或文字记录");
         let info = that.data.info;
          info.details.push(new Detail('',''));
          that.setData({
            info: info
          });
        return
      }
      else{
        // box.showToast("ok");
          request.request_get('/api/addFoodInfo.hn', data, function (res) {
            console.info('回调', res)
            if (res) {
              if (res.success) {  
                var id = res.msg
                wx.showModal({
                  title: '成功',
                  content: '提交成功',
                  showCancel: false,
                  confirmText: '确定',
                  success: function (res) {
                    if (res.confirm) {
                        wx.reLaunch({
                            url: '/pages/index/index',
                          })
                    }
                  }
                })
              } else {
                console.log(res.msg);
                box.showToast("创建失败，请检查网络连接！");
              }
              // box.hideLoading();
            }else{
              box.showToast("网络不稳定，请重试");
            }
          })
      }
      
      wx.hideLoading({
        success: (res) => {},
      })
    
  },3000),
    start_time_show: function (e) {
        console.log("ssd")
        this.setData({
          startIsPickerShow: true,
          startIsPickerRender: true,
          startChartHide: true,
          time_chosen:true
        })
      },
      start_time_hide: function () {
        this.setData({
          startIsPickerShow: false,
          startChartHide: false
        })
      },
      set_start_time: function (val) {
          console.log(val.detail.startTime)
          this.setData({
            startTime: val.detail.startTime.substring(0, 16)
          });
      },
      getOrderNum: function () {
        var that = this;
        var random = Math.round(Math.random() * 9999);
        var str1 = that.getFullTime() + random;
        that.setData({
            record_num: str1
        })
      },
      getLocalTime() {
        return new Date().getTime();
      },
      getFullTime() {
        let date = new Date(), //时间戳为10位需*1000，时间戳为13位的话不需乘1000
          Y = date.getFullYear() + '',
          M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1),
          D = (date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate()),
          h = (date.getHours() < 10 ? '0' + (date.getHours()) : date.getHours()),
          m = (date.getMinutes() < 10 ? '0' + (date.getMinutes()) : date.getMinutes()),
          s = (date.getSeconds() < 10 ? '0' + (date.getSeconds()) : date.getSeconds());
        return Y + M + D + h + m + s
      },
    //上传图片
  upimg: function () {
    var that = this;
    var data = [];
    if (that.data.img_arr.length < 10) {
      wx.chooseImage({
        count:9-that.data.img_arr.length,
        sizeType: ['original', 'compressed'],
        success: function (res) {
          console.log(res.tempFilePaths)
          console.log(res.tempFilePaths.length)
          var filePath = res.tempFilePaths;
          // debugger
          for (var i = 0; i < filePath.length; i++) {
            wx.uploadFile({
              //url: 'https://8.130.48.31:8080/HM/api/upload.hn',  // 测试服务器  孙仕豪
              url: 'https://scldev.coyotebio-lab.com:8443/HM/api/upload.hn',  // 测试服务器  孙仕豪
              // url:'http://ygldev.coyotebio-lab.com:8080/HM/api/upload.hn',
              //url : 'http://ygldev.coyotebio-lab.com/flash20AppletBackend/OrderController/upload.hn',  // 测试服务器  于光良
              //url: 'https://8.130.25.5/flash20AppletBackend/api/upload.hn',   // 宋彦睿
              //url: 'https://syrdev.coyotebio-lab.com/flash20AppletBackend/OrderController/upload.hn',   // 宋彦睿
              //url: 'https://www.prohealth-wch.com:8443/flash20AppletBackend/OrderController/upload.hn', //正式服务器
              //url: 'http://localhost:8080/flash20AppletBackend/OrderController/upload.hn',// 本地测试
              filePath: filePath[i],
              name: 'imageFile',
              formData: data,
              header: {
                "chartset": "utf-8"
              },
              success: function (returnRes) {
                // debugger
                console.log(returnRes)
                var data = JSON.parse(returnRes.data)
                console.log(data.msg)
                var imgList = [];
                var imgArr = that.data.img_arr;
                for (var i = 0; i < imgArr.length; i++) {
                  imgList.push(imgArr[i])
                }
                imgList.push(data.msg)
                that.setData({
                  img_arr: imgList
                })
                console.log("imgList=" + imgList)
              },
            })
          }
        }
      })
    } else {
      wx.showToast({
        title: '最多上传九张图片',
        icon: 'loading',
        duration: 3000
      });
    }
  },
  // 删除图片
  delImg(e) { //删除图片
    let that = this;
    console.log('点击删除图片===>', e);
    let index = e.currentTarget.dataset.index;
    let imgList = that.data.img_arr;
    wx.showModal({
      title: '提示',
      content: '删除该图片？',
      success(res) {
        if (res.confirm) {
          console.log('用户点击确定')
          imgList.splice(index, 1);
          that.setData({
            img_arr: imgList
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
          console.log(that.data.img_arr)
        }
      }
    })
  },
   // 预览图片
  previewImg: function (e) {
    //获取当前图片的下标
    var index = e.currentTarget.dataset.index;
    //所有图片
    var img_arr = this.data.img_arr;
    wx.previewImage({
      //当前显示图片
      current: img_arr[index],
      //所有图片
      urls: img_arr
    })
  },
})
