/**
 * @todo 總共使用時數(小時or分鐘)轉換日、時、分
 * @param ishour true:單位是小時 ， false:單位是分鐘 ex:true
 * @param time 要被計算的小時或分鐘數 ex:16
 * @param workTimehour 幾小時算一天 ex:8
 * @returns '{ day: 2, hour: 0, minute: 0 }'
 * @author jacky
 */
export function timeOfDay(ishour: boolean, time: number, workTimehour: number) {
    var day = 0
    var hour = 0
    var minute = 0

    if (ishour) {
        //如果是小時
        var minTime = time * 60
        day = calMin(minTime, workTimehour).day
        hour = calMin(minTime, workTimehour).hour
        minute = calMin(minTime, workTimehour).minute
    } else {
        //如果是分鐘

        day = calMin(time, workTimehour).day
        hour = calMin(time, workTimehour).hour
        minute = calMin(time, workTimehour).minute

    }

    return { day: day, hour: hour, minute: minute }

}
function calMin(Mintime: number, workTimehour: number) {

    var day = 0
    var hour = 0
    var minute = 0

    var calhour = Math.floor(Mintime / 60)
    if (calhour >= 1) {
        minute = Math.round(((Mintime / 60) - calhour) * 60)
    } else {
        minute = Mintime
    }

    if (calhour == workTimehour) {
        day = 1
    } else if (calhour > workTimehour) {
        day = Math.floor(calhour / workTimehour)
        // hour = Math.round(((time / 60) / workTimehour - day) * workTimehour)
        hour = Math.floor(((((Mintime / 60) / workTimehour - day)) * workTimehour))
    } else {
        hour = calhour
    }

    return { day: day, hour: hour, minute: minute }
}

/**
 * 依照每日工時計算日、時、分
 * @param time_hour 總共使用時數(小時)
 * @param workTimehour 每天工作時數(小時) 例如:['8','8','8']
 */
export function moreDaytimeOfDay_hour(time_hour: number, workTimehour: Array<string>) {
    var day = 0;
    var hour = 0;
    var minute = 0;

    var number_workTimehour = []
    for (let work of workTimehour) {
        number_workTimehour.push(parseFloat(work))
    }

    var caltimehour = time_hour
    for (let workTimehour of number_workTimehour) {
        if (caltimehour >= workTimehour) {
            caltimehour = caltimehour - workTimehour
            day += 1
        } else { }
    }
    hour = caltimehour

    if ((hour - Math.floor(hour)) > 0) {
        minute = Math.round((hour - Math.floor(hour)) * 60)
        hour = Math.floor(hour)
    }

    return { day: day, hour: hour, minute: minute }
}

/**
 * 依照每日工時計算日、時、分
 * @param time_hour 總共使用時數(分鐘)
 * @param workTimehour 每天工作時數(小時) 例如:['8','8','8']
 */
export function moreDaytimeOfDay_minute(time_minute: number, workTimehour: Array<string>) {
    var time_hour = time_minute / 60
    return moreDaytimeOfDay_hour(time_hour, workTimehour)
}


export function HourAndMin(hour: number) {
    var re_Hour = 0
    var re_Min = 0
    if (hour) {
        re_Hour = parseInt(hour.toString())
        re_Min = parseInt(((hour - parseInt(hour.toString())) * 60).toString())
    }

    return { hour: re_Hour, min: re_Min }
}