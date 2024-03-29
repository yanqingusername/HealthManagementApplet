/* 
*  时间相关js
*  author cuiyf
*  date 2020-08-19
*/

//时间 -> 格式化至小时
const format_hour = date => {
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    const hour = date.getHours()
    return [year, month, day].map(formatNumber).join('-') + ' ' + [hour, '00', '00'].map(formatNumber).join(':')
}

// 时间今天 -> 日期
const today = date => {
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    return [year, month, day].map(formatNumber).join('-')
}

// 时间初始化字符串
const formatTime = date => {
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    const hour = date.getHours()
    const minute = date.getMinutes()
    const second = date.getSeconds()
  
    return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

// 获取日期
const getDate = date => {
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    return [year, month, day].map(formatNumber).join('/')
}

// 获取前几天
function getNextDate(date,day) {  
    var dd = new Date(date);
    dd.setDate(dd.getDate() + day);
    var y = dd.getFullYear();
    var m = dd.getMonth() + 1 < 10 ? "0" + (dd.getMonth() + 1) : dd.getMonth() + 1;
    var d = dd.getDate() < 10 ? "0" + dd.getDate() : dd.getDate();
    return y + "/" + m + "/" + d;
};

// 获取之前七天的数据
const getBefore7Date = date => {
    var dates = [];
    var year = date.getFullYear()
    var month = date.getMonth() + 1;
    var day = date.getDate();
    dates.push([year, month, day].map(formatNumber).join('/'))
    for (var i = 0; i < 6; i++) { 
        date.setDate(date.getDate() - 1);
        year = date.getFullYear()
        month = date.getMonth() + 1;
        day = date.getDate();
        dates.push([year, month, day].map(formatNumber).join('/'))
    }
    dates = dates.reverse(); 
    return dates
}

 // 获取前半年的月份
const get6Month = date => {
    var months = [];
    var year = date.getFullYear();
    var month = date.getMonth()+1;
    months.push([year, month].map(formatNumber).join('/'))
    // 前五个月
    for (var i = 0; i < 5; i++) { 
        var month = date.getMonth();
        if(month == 0){
            date.setFullYear(date.getFullYear()-1);
            date.setMonth(11);
        }else{
            month = month -1;
            date.setMonth(month);
        }
        year = date.getFullYear();
        month = date.getMonth()+1;
        months.push([year, month].map(formatNumber).join('/'))        
    }

    months = months.reverse(); 
    return months;
}

const get6Month1 = date => {
    var months = [];
    var year = date.getFullYear();
    var month = date.getMonth()+1;
    months.push(month)
    // 前五个月
    for (var i = 0; i < 5; i++) { 
        var month = date.getMonth();
        if(month == 0){
            date.setFullYear(date.getFullYear()-1);
            date.setMonth(11);
        }else{
            month = month -1;
            date.setMonth(month);
        }
        year = date.getFullYear();
        month = date.getMonth()+1;
        months.push(month)        
    }

    months = months.reverse(); 
    return months;
}


 // 获取当月的天数
function mGetDate(){
    var date = new Date();
    var year = date.getFullYear();
    var month = date.getMonth()+1;
    var d = new Date(year, month, 0);
    return d.getDate();
}


const format_hour3= date => {
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    const hour = date.getHours()
    const minute = date.getMinutes()
    return [year, month, day].map(formatNumber).join('-') + ' ' + [hour].map(formatNumber).join(':')
  
  }
  

  











  const formatTime1 = date => {
      const year = date.getFullYear()
      const month = date.getMonth() + 1
      const day = date.getDate()
      const hour = date.getHours()
      const minute = date.getMinutes()
      const second = date.getSeconds()
    
      // return [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute, second].map(formatNumber).join(':')
      return [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute, '00'].map(formatNumber).join(':')
  }
  

  
  
  
  //获取一个年后的日期
  const nextYearData = date => {
      const year = date.getFullYear() + 1
      const month = date.getMonth() + 1
      const day = date.getDate()
     
      return [year, month, day].map(formatNumber).join('-')
  }
  const formatTime1Hour = date => {
      //测试用的为一个小时前的时间
      const year = date.getFullYear()
      const month = date.getMonth() + 1
      const day = date.getDate()
      const hour = date.getHours() -1 
      const minute = date.getMinutes()
      const second = date.getSeconds()
    
      return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
    }
  //获取显示的日期
  const nowDate = date => {
      const year = date.getFullYear()
      const month = date.getMonth() + 1
      const day = date.getDate()
      return year + ' 年 ' + month + ' 月 ' + day + ' 日 ' 
  }
  
 
 
  
const formatNumber = n => {
    n = n.toString()
    return n[1] ? n : '0' + n
}


module.exports = {
    format_hour: format_hour,
    formatTime:formatTime,
    formatTime1:formatTime1,
    today:today,
    getDate:getDate,
    getBefore7Date:getBefore7Date,
    nextYearData:nextYearData,
    formatTime1Hour:formatTime1Hour,
    nowDate:nowDate,
    getNextDate:getNextDate,
    mGetDate:mGetDate,
    get6Month:get6Month,
    get6Month1:get6Month1,
    format_hour3:format_hour3,
}