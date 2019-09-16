import { DayHourMinuteClass } from "../Models/DayHourMinuteClass";

  export function CheckDayHourMinuteNotZero(DayHourMinute: DayHourMinuteClass) {
    //確認時數是否為0
    if (DayHourMinute) {
      if (DayHourMinute.Day > 0 || DayHourMinute.Hour > 0 || DayHourMinute.Minute > 0) {
        return true
      } else {
        return false
      }
    } else {
      return false
    }
  }