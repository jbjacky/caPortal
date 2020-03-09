import { formatDateTime } from "./void_doFormatDate"

/**
 * @todo 計算跨天時數
 * @param  _EndTime :ex:2800,48小時
 * @author jacky
 * @return EndTime:跨天就扣24小時後回傳時間,isCrossDay:跨天為true
 */
export function void_crossDay(_EndTime) {
    var _isCrossDay: boolean = false
    if (_EndTime) {
        if (parseInt((_EndTime).toString()) > 2400) {
            if (parseInt((_EndTime).toString()) >= 2500) {
                _EndTime = (parseInt((_EndTime).toString()) - 2400).toString()
                if ((_EndTime).toString().length < 4) {
                    _EndTime = '0' + _EndTime
                }
                _isCrossDay = true
            } else {
                _EndTime = (parseInt((_EndTime).toString()) - 2400)
                if (_EndTime >= 10) {
                    _EndTime = '00' + _EndTime.toString()
                } else {
                    _EndTime = '000' + _EndTime.toString()
                }
                _isCrossDay = true
            }
        } else if (parseInt((_EndTime).toString()) == 2400) {
            _EndTime = '0000'
            _isCrossDay = true
        } else {
            _isCrossDay = false
        }
    } else {
        _EndTime = null
    }

    return { EndTime: _EndTime, isCrossDay: _isCrossDay }

}


/**
 * @todo 是否跨天，只比對日期
 * @author jacky
 */
export function isCrossDate(DateIimeB: string, DateTimeE: string) {
  //只比對日期
  if (DateIimeB && DateTimeE) {
    var DateB = new Date(formatDateTime(DateIimeB).getDate)
    var DateE = new Date(formatDateTime(DateTimeE).getDate)
    if (DateE > DateB) {
      return true
    } else {
      return false
    }
  } else {
    return false
  }
}
