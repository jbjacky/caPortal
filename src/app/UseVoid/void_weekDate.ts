import { doFormatDate } from "./void_doFormatDate";
/**
 * @todo 回傳當周的日期陣列
 */
export function weekDate(Daq:Date){
    
    var oneOfWeeek = Daq.getDay()
    if(Daq.getDay()==0){
      oneOfWeeek = 7
    }
    Daq.setDate(Daq.getDate()-(oneOfWeeek-1)) //拉到當周的星期一

    var sendWeekDate = []
    for(let i=0;i<7;i++){
      sendWeekDate.push(doFormatDate(Daq.toString()))
      Daq.setDate(Daq.getDate()+1)
    }

    return sendWeekDate   
}