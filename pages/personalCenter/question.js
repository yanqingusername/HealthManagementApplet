// pages/question/question.js
const app = getApp();
const questionsdata = require('../..//utils/questiondata.js')
const time = require('../..//utils/time.js')
const request = require('../../utils/request.js')
const neednumberno = questionsdata.neednumberno;
Page({
  /**
   * 页面的初始数据
   *///创建节点选择器
  data: {
    windowHeight:0,//屏幕的高度
    topheght:0,//上半部分高度
    scrollheght:0,//答案滚动高度
    topNum:'0',
    questions:[
    ],//问题集合
     title:"",
     question:[],//临时存某一部分的题目信息
     pageindex:1,//第几题
     pagesun:0,//共几题
     partsun:0,//共几部分
     currentpartindex:1,//当前第几部分
     partpagesun:0,//第xxx部分共几题
     currentquestionindex:1,//第xxx部分的第几题
     questionid:"1",//调查问卷id
     starttime:time.formatTime1(new Date()),
  },
  next:function(){//下一题
    this.setData({
      topNum:0
    })//滚动初始为最上面
    console.log("下一题")
    let that=this.data;
    let currentquestionindex=that.currentquestionindex-1;
    const items=that.question[currentquestionindex];

    var regNum=new RegExp('[0-9]','g');//判断用户输入的是否为数字
    var neednos=[];
    for(var i=0;i<neednumberno.length;i++){
      if(neednumberno[i].id==that.questionid){
        neednos=neednumberno[i].part[that.currentpartindex-1].no;
       break;
      }
   }

    if(neednos.includes(that.pageindex)&&(!regNum.exec(that.question[currentquestionindex].option.other))){
      wx.showToast({
        title: '请输入有效数字',
        icon:"error"
      })
    }else{
          if(items.option.other==''&&that.question[currentquestionindex].option.checked==""){ 
            wx.showToast({
              title: '请作答本题',
              icon:"error"
            })//判断本题是否作答  
          }else{
                let flag=true;
                for(var i=0;i<items.answer.length;i++){
                    if(items.answer[i].value=='其他'&&items.answer[i].checked==true&&that.question[currentquestionindex].option.other==""){ 
                        flag=false;     
                    }
                }//当选择 其他 的时候判断是否有输入的内容
                if(flag){
                  this.setData({
                    pageindex:that.pageindex+1,
                    currentquestionindex:that.currentquestionindex+1,
                  })
                }else{
                  wx.showToast({
                    title: '请填写内容',
                    icon:"error"
                  })
                }
          }
    }

    if(that.currentquestionindex>that.partpagesun){//当下一题变为下一部分处理保存此部分的数据以及更新变量
      var key='questions['+(that.currentpartindex-1)+'].question'
      this.setData({
         [key]:that.question,//当选择下一部分时保存当前部分的数据
         currentquestionindex:1//更新题目编号
      })
      that.question=[]
      this.setData({
        currentpartindex:that.currentpartindex+1,//当前第几部分+1
      })
      this.setData({
        partpagesun:that.questions[that.currentpartindex-1].question.length,//当前第xxx部分共题目数更新
        question:that.questions[that.currentpartindex-1].question
      })
    }//当下一题变为下一部分处理保存此部分的数据以及更新变量
    console.log(that.questions)
  },
  before:function(){//上一题
    this.setData({
      topNum:0
    })//滚动初始为最上面
    let that=this.data;
    if(that.pageindex<=1){
      wx.showToast({
        title: '这是第一页啦',
        icon:"error"
      })
    }else{
      this.setData({
        pageindex:that.pageindex-1,
        currentquestionindex:that.currentquestionindex-1
      })
      if(that.currentquestionindex<1) {//当上一题变为上一部分时保存此部分的题目并且更新一些变量
                var key='questions['+(that.currentpartindex-1)+'].question'
                this.setData({
                  [key]:that.question,//当选择下一部分时保存当前部分的数据
                })
                that.question=[]
                this.setData({
                  currentpartindex:that.currentpartindex-1,//当前第几部分-1
                })
                this.setData({
                  currentquestionindex:that.questions[that.currentpartindex-1].question.length,
                  partpagesun:that.questions[that.currentpartindex-1].question.length,//当前第xxx部分共题目数更新
                  question:that.questions[that.currentpartindex-1].question
                })
      }//当上一题变为上一部分时保存此部分的题目并且更新一些变量
    }
  },
  radioChange: function (e) {//单选改变赋值
      var str = [e.detail.value]
      console.log(e)
      var currentquestionindex=this.data.currentquestionindex-1;//当前页数
      var key ='question['+(currentquestionindex)+'].option.checked';
      var that=this.data;
      const items=that.question[currentquestionindex].answer
      this.setData({ 
        [key]:str
      });//赋值option
      for(var i=0;i<items.length;i++){
        items[i].checked=false;
        if(str==items[i].value){
          items[i].checked=true;
        }
      }//记录checked状态
      var  key1 ='question['+(currentquestionindex)+'].answer';
      this.setData({
        [key1]:items
      })//双向数据绑定
      // debugger
      for(var i=0;i<items.length;i++){
        if(items[i].value=='其他'&&items[i].checked==false){ 
          var key2 ='question['+(currentquestionindex)+'].option.other';
           this.setData({
              [key2]:''
           })
        }
       }//清空单选按钮的其他
      console.log(that.question)
  },
  checkboxChange:function(e){//多选改变赋值
    var str = e.detail.value;//记录选项
    console.log(e)
    var currentquestionindex=this.data.currentquestionindex-1;//当前页数
    var key ='question['+(currentquestionindex)+'].option.checked';
    var that=this.data;
    const items=that.question[currentquestionindex].answer;
    var groupkeyword=[];
    var flag=0;
    var flag1=false;
    var len=str.length-1;
    flag1=str.includes("没有");
    if(str[len]=="没有"){
      flag=1;
    }
    for(var i=0;i<neednumberno.length;i++){
       if(neednumberno[i].id==that.questionid){
        groupkeyword=neednumberno[i].part[that.currentpartindex-1].grooup;
        break;
       }
    }
    if(groupkeyword.includes(str[len])&&flag1==true){
      flag=0;//此时并不是选了一个
      for(var i=0;i<str.length;i++){
        if(str[i]=="没有"){
         str.splice(i,1);
         break;
        }
       }
    }
    if(flag==1){
            for(var i=0;i<items.length;i++){
              items[i].checked = false;
                if (items[i].value ==="没有") {
                  items[i].checked = true;
                }
              }//记录checked
              this.setData({ 
                [key]:["没有"]
              });//赋值option
    }
    else{
            for(var i=0;i<items.length;i++){
              items[i].checked = false;
              for(var j=0;j<str.length;j++){
                if (items[i].value === str[j]) {
                  items[i].checked = true;
                  break;
                }
            }
          }//记录checked
          this.setData({ 
            [key]:str
          });//赋值option
    }
   
     var key1 ='question['+(currentquestionindex)+'].answer';
     this.setData({
       [key1]:items
     })//双向数据绑定
     for(var i=0;i<items.length;i++){
      if(items[i].value=='其他'&&items[i].checked==false){ 
        var key2 ='question['+(currentquestionindex)+'].option.other';
         this.setData({
            [key2]:''
         })
      }
     }//清空按钮的其他
      console.log(that.question)
  },
  textareaChange:function(e){//输入框赋值
    // debugger
    var that=this.data;
    var str = e.detail.value;//记录输入值
    var currentquestionindex=this.data.currentquestionindex-1;//当前页数
    var flag=false;
    if(that.question[currentquestionindex].type==3){
      flag=true
    }
      var key ='question['+(currentquestionindex)+'].option.other';
      var key1 ='question['+(currentquestionindex)+'].option.checked';
      this.setData({ 
        [key]:str,
      });//赋值option
      if(flag){
        this.setData({
          [key1]:[]
        })
      }
      console.log(this.data.question)
  },
  submit:function(){//提交
    var that=this.data
    if(that.pageindex>that.pagesun){
      var key='questions['+(that.currentpartindex-1)+'].question'
      this.setData({
        [key]:that.question,//当选择提交时保存最后一部分部分的数据
      })
    }
    var flag=true;
    // debugger
    // console.log(that.questions)
    for(var i=0;i<that.questions.length;i++){
      for(var j=0;j<that.questions[i].question.length;j++){//部分
        if(that.questions[i].question[j].option.checked==''&&that.questions[i].question[j].option.other==''){
          flag=false
        }
      }
    }//再次遍历question判断是否全部答完
    if(flag){
      var submitquestions=that.questions;
      for(var i=0;i<submitquestions.length;i++){
        submitquestions[i].value="";
         for(var j=0;j<submitquestions[i].question.length;j++){
          submitquestions[i].question[j].answer="";
          submitquestions[i].question[j].title="";
          submitquestions[i].question[j].type="";
         }
      }
      // console.info("答案",submitquestions)
      //提交请求
      // console.info("转换",submitquestions.join(","))
      // var obj=JSON.parse(submitquestions);
      var obj = JSON.stringify(submitquestions) //myObj：本js文件中的对象
            let data = {
              openid:app.globalData.openid,
              questionid:that.questionid,
              start_time:that.starttime,
              end_time:time.formatTime1(new Date()),
              answer:obj,
              question_name:that.title,
          }
          console.log(data.answer)
          request.request_post('/hmapi/Submitquestion.hn',data , function (res) {
            console.info('调查问卷回调', res);  
            if(!res.success){
              wx.showToast({
                title: "提交失败",
                icon:"error"
              })
              return 
            }
            wx.showToast({
              title: res.msg,
              icon:"success"
            })
            wx.switchTab({
              url: '/pages/personalCenter/index',
           })
        })
      // console.log(submitquestions)
      wx.showToast({
        title: '提交成功',
        icon:'success'
      })
    }else{
      wx.showToast({
        title: '您有未作答的题目',
        icon:'error'
      })
    }
   },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this.data;
    this.setData({
      questionid:options.id,
      title:options.title
    })
   console.log(that)
    var windowHeight = wx.getSystemInfoSync().windowHeight
    this.setData({
      windowHeight:windowHeight
    });
    //创建节点选择器
    var query = wx.createSelectorQuery();
    query.select('.top-box').boundingClientRect()
    query.exec((res) => {
      var listHeight = res[0].height; // 获取list高度
      this.setData({
        topheght:listHeight
      })
      this.setData({
        scrollheght:this.data.windowHeight-this.data.topheght
      })
    })//获取上面盒子的高度用来计算中间部分高度
    for(var i=0;i<questionsdata.questionsdata.length;i++){
       if(questionsdata.questionsdata[i].id==that.questionid){
        this.setData({
          questions:questionsdata.questionsdata[i].neirong
        })//从question文件中拿数据
        break;
       }
    }
   
    this.setData({
      question:that.questions[that.currentpartindex-1].question
    })//临时赋值
    var count=0;
    for(var i=0;i<that.questions.length;i++){
       for(var j=0;j<that.questions[i].question.length;j++){
         count++;
       }
    }
    this.setData({
      pagesun:count,//赋值题目共多少题
      partsun:that.questions.length,//赋值部分总数
      partpagesun:that.questions[that.currentpartindex-1].question.length//赋值部分题目总数
    })//总题数赋值
  }
})