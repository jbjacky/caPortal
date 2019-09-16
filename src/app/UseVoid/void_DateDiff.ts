
/**
 * @todo 計算兩日期時間天數、取得兩時間差異
 * @param  _EndTime :ex:2800,48小時
 * @author jacky
 * @return EndTime:跨天就扣24小時後回傳時間,isCrossDay:跨天為true
 */
export function void_DateDiff(sDate:Date, eDate:Date) {
    var iDays: any
    var p_sDate:any = sDate
    var p_eDate:any = eDate
    iDays = ((p_eDate - p_sDate) / 1000 / 60 / 60 / 24)+1 // 把相差的毫秒數轉換為天數
    return iDays;
}