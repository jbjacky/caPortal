

/**
 * @todo 傳入日期轉成2018/12/25的格式
 * @param {string} setdate :可能是2018-08-01T00:00:00
 * @author jacky
 */
export function doFormatDate(setdate) {

    var date = new Date(setdate)

    var formatdate = '';
    formatdate += date.getFullYear() + "/";

    if ((date.getMonth() + 1) < 10) {
        var monthAddZero = '0' + (date.getMonth() + 1)
        formatdate += monthAddZero + "/";
    } else {
        formatdate += (date.getMonth() + 1) + "/";
    }

    if (date.getDate() < 10) {
        var dateAddZero = '0' + date.getDate();
        formatdate += dateAddZero;
    } else {
        formatdate += date.getDate();
    }

    return formatdate;
}


/**
 * @todo 傳入日期強制修正到台灣時間的偏移量
 * @param {string} date :可能是2018-08-01T08:00:00 +08:00，如當地是-08:00，則會從2018-08-01T00:00:00 +08:00修正到 2018-08-01T00:00:00 -08:00
 * @author jacky
 */
export function timeZone_tw(date: Date) {

    var offset = 8
    var utc = date.getTime() + (date.getTimezoneOffset() * 60000);
    var timeZoneDate = new Date(utc + (3600000 * offset));
    return timeZoneDate;
}
/**
 * @todo 從0800轉換格式08:00
 * @param Time 範例0800
 */
export function getapi_formatTimetoString(Time: string) {

    var formatOntime = ''
    if (Time) {
        var formatArrayString = Time.toString().split('')
        formatArrayString.splice(2, 0, ':');
        for (let ArrayString of formatArrayString) {
            formatOntime += ArrayString
        }
    } else {
        formatOntime = ''
    }


    return formatOntime
}
/**
 * @todo 從08:00轉換格式0800
 * @param Time 範例08:00
 */
export function sumbit_formatTimetoString(Time: string) {
    var hour = Time.split(":")[0]
    var minute = Time.split(":")[1]
    // console.log(hour)
    // console.log(minute)
    Time = hour + minute
    return Time
}

/**
 * @todo 回傳mm/dd這種月、日格式
 * @param formatDay yyyy/mm/dd
 */

export function doFormatDate_getMonthAndDay(formatDay) {
    var index_formatDay = formatDay.indexOf('/')
    return formatDay.substr(index_formatDay + 1, formatDay.length);
}

/**
 * @todo 確認字串是否都是數字
 * @param str 輸入文字
 */
export function isNum_checkString(str: string) {
    var strArray = str.split('')
    for (let st of strArray) {
        if (isNaN(parseInt(st))) {
            return false
        }
    }
    return true
}


/**
 * @todo 已經實作偏移量修正
 * @todo 回傳{ getDate: YYYY/mm/dd, getTime: 0900 }
 * @param {string} DateTime 2018-10-31T00:00:00+08:00
 */
export function formatDateTime(DateTime) {
    if(DateTime){
        var Date_DateTime = new Date(DateTime);
        var timeZone_tw_DateTime = timeZone_tw(Date_DateTime)
        var getDate = doFormatDate(timeZone_tw_DateTime)
    
        var hour;
        if (timeZone_tw_DateTime.getHours() < 10) {
            hour = '0' + timeZone_tw_DateTime.getHours().toString()
        } else {
            hour = timeZone_tw_DateTime.getHours().toString()
        }
    
        var minute;
        if (timeZone_tw_DateTime.getMinutes() < 10) {
            minute = '0' + timeZone_tw_DateTime.getMinutes().toString()
        } else {
            minute = timeZone_tw_DateTime.getMinutes().toString()
        }
    
        var getTime = hour+minute
    
        return { getDate: getDate, getTime: getTime }
    }else{
        return { getDate: null, getTime: null }
    }
}


/**
 * @todo 時間四個字有包含_處理
 * @todo 回傳{ HH: 08, mm: 00 }
 * @param {string} time 08:00，可能08:0_
 */
export function reSplTimeHHmm(time: string) {
    var HH: string, mm: string
    var h1: string, h2: string, m1: string, m2: string
    if (!time || time == '') {
      h1 = '0'
      h2 = '0'
      m1 = '0'
      m2 = '0'
    } else {
      h1 = time.split(":")[0].toString().substring(0, 1)
      h2 = time.split(":")[0].toString().substring(1, 2)
      m1 = time.split(":")[1].toString().substring(0, 1)
      m2 = time.split(":")[1].toString().substring(1, 2)
      if (isNaN(parseInt(h1))) {
        h1 = '0'
      }
      if (isNaN(parseInt(h2))) {
        h2 = '0'
      }
      if (isNaN(parseInt(m1))) {
        m1 = '0'
      }
      if (isNaN(parseInt(m2))) {
        m2 = '0'
      }
    }
    HH = h1 + h2
    mm = m1 + m2
    return { HH: HH, mm: mm }
  }