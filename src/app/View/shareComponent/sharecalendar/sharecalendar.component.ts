import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { doFormatDate, formatDateTime, getapi_formatTimetoString } from 'src/app/UseVoid/void_doFormatDate';
import { dateworksClass, dataClass, oneDayClass, drawCalendarClass, SearchMan } from 'src/app/Models/CalendarClass';
import { Observable, BehaviorSubject } from 'rxjs';
import { GetApiDataServiceService } from 'src/app/Service/get-api-data-service.service';
import { takeWhile } from 'rxjs/operators';
import { chinesenum } from 'src/app/UseVoid/void_chinesenumber';
import { NgxSpinnerService } from 'ngx-spinner';
import { ShowVa } from 'src/app/Models/ShowVa';
import { GetAttendCalendarExceptionalGetApiClass } from 'src/app/Models/PostData_API_Class/GetAttendCalendarExceptionalGetApiClass';
import { GetAttendCalendarExceptionalDataClass } from 'src/app/Models/GetAttendCalendarExceptionalDataClass';
import { GetAbsDetailByListEmpIDGetApiClass } from 'src/app/Models/PostData_API_Class/GetAbsDetailByListEmpIDGetApiClass';
import { GetAbsDetailByListEmpIDDataClass } from 'src/app/Models/GetAbsDetailByListEmpIDDataClass';
import { void_crossDay } from 'src/app/UseVoid/void_crossDay';
declare var $;

@Component({
  selector: 'app-sharecalendar',
  templateUrl: './sharecalendar.component.html',
  styleUrls: ['./sharecalendar.component.css']
})
export class SharecalendarComponent implements OnInit, OnDestroy {
  ngOnDestroy(): void {
    // throw new Error("Method not implemented.");
    this.api_subscribe = false;
  }
  api_subscribe = true
  constructor(private GetApiDataServiceService: GetApiDataServiceService,
    private LoadingPage: NgxSpinnerService, ) { }
  @Input() searchCalendarData: Observable<any>;
  data: dataClass[] = [];
  phone_data: oneDayClass[] = []
  Year: string;
  Month: string;
  Dateday: string;
  dateworks: dateworksClass[] = []
  SearchMan: SearchMan;
  Cathch_drawCalendar: drawCalendarClass;
  ngOnInit() {
    this.searchCalendarData.subscribe(
      (x: drawCalendarClass) => {
        if (x) {
          this.Cathch_drawCalendar = x;
          this.Year = x.Year;
          this.Month = x.Month;
          this.data = this.drawCalendar(x.Year, x.Month, 0, x.dateworks)
          this.dateworks = x.dateworks
          this.SearchMan = x.SearchMan
          if (this.dateworks) {
            this.RoteCalendarShow(x)
            this.matchPhoneData()
          }
        }
      }
    )
  }
  RoteCalendarShow(drawCalendar: drawCalendarClass) {
    //依照班型顯示
    var showRote: drawCalendarClass = drawCalendar;
    for (let show of showRote.dateworks) {
      show.showText = show.routeName
    }
    this.data = this.drawCalendar(drawCalendar.Year, drawCalendar.Month, 0, showRote.dateworks)

    $('#bt_RoteShow').addClass('onShowButton')
    $('#bt_RoteShow').removeClass('offShowButton')
    $('#bt_TimeShow').addClass('offShowButton')
    $('#bt_TimeShow').removeClass('onShowButton')


  }
  TimeCalendarShow(drawCalendar: drawCalendarClass) {
    //依照出勤時間顯示
    var showTime: drawCalendarClass = drawCalendar;
    for (let show of showTime.dateworks) {
      if (show.isHoliday) {
        show.showText = show.routeName

      } else {
        show.showText = void_crossDay(show.onTime).EndTime + '-' + void_crossDay(show.offTime).EndTime
      }
    }
    this.data = this.drawCalendar(drawCalendar.Year, drawCalendar.Month, 0, showTime.dateworks)
    $('#bt_RoteShow').addClass('offShowButton')
    $('#bt_RoteShow').removeClass('onShowButton')
    $('#bt_TimeShow').addClass('onShowButton')
    $('#bt_TimeShow').removeClass('offShowButton')
  }
  matchPhoneData() {
    this.phone_data = []
    // console.log(this.Cathch_drawCalendar)
    // var showRouteTime:drawCalendarClass = this.Cathch_drawCalendar;
    // for(let draw of this.Cathch_drawCalendar.dateworks){
    //     for(let show of showRouteTime.dateworks){
    //       show.showText = draw.routeName+' / '+draw.onTime+'-'+draw.offTime
    //   }
    // }
    // var pdata = this.drawCalendar(this.Cathch_drawCalendar.Year, this.Cathch_drawCalendar.Month, 0, showRouteTime.dateworks)
    for (let desktop of this.data) {
      this.phone_data.push(
        {
          YearMonthDayText: desktop.Sunday.YearMonthDayText,
          showText: desktop.Sunday.showText,
          roteID: desktop.Sunday.roteID,
          routeName: desktop.Sunday.routeName,
          onTime: void_crossDay(desktop.Sunday.onTime).EndTime,
          offTime: void_crossDay(desktop.Sunday.offTime).EndTime,
          daytext: desktop.Sunday.daytext,
          isthisMonth: desktop.Sunday.isthisMonth,
          isVa: desktop.Sunday.isVa,
          isAtterror: desktop.Sunday.isAtterror,
          isHoliday: desktop.Sunday.isHoliday,
          isToday: desktop.Sunday.isToday,
          dayofweek: '星期日'
        })
      this.phone_data.push(
        {
          YearMonthDayText: desktop.Monday.YearMonthDayText,
          showText: desktop.Monday.showText,
          roteID: desktop.Monday.roteID,
          routeName: desktop.Monday.routeName,
          onTime: void_crossDay(desktop.Monday.onTime).EndTime,
          offTime: void_crossDay(desktop.Monday.offTime).EndTime,
          daytext: desktop.Monday.daytext,
          isthisMonth: desktop.Monday.isthisMonth,
          isVa: desktop.Monday.isVa,
          isAtterror: desktop.Monday.isAtterror,
          isHoliday: desktop.Monday.isHoliday,
          isToday: desktop.Monday.isToday,
          dayofweek: '星期一'
        })
      this.phone_data.push(
        {
          YearMonthDayText: desktop.Tuesday.YearMonthDayText,
          showText: desktop.Tuesday.showText,
          roteID: desktop.Tuesday.roteID,
          routeName: desktop.Tuesday.routeName,
          onTime: void_crossDay(desktop.Tuesday.onTime).EndTime,
          offTime: void_crossDay(desktop.Tuesday.offTime).EndTime,
          daytext: desktop.Tuesday.daytext,
          isthisMonth: desktop.Tuesday.isthisMonth,
          isVa: desktop.Tuesday.isVa,
          isAtterror: desktop.Tuesday.isAtterror,
          isHoliday: desktop.Tuesday.isHoliday,
          isToday: desktop.Tuesday.isToday,
          dayofweek: '星期二'
        })
      this.phone_data.push(
        {
          YearMonthDayText: desktop.Wednesday.YearMonthDayText,
          showText: desktop.Wednesday.showText,
          roteID: desktop.Wednesday.roteID,
          routeName: desktop.Wednesday.routeName,
          onTime: void_crossDay(desktop.Wednesday.onTime).EndTime,
          offTime: void_crossDay(desktop.Wednesday.offTime).EndTime,
          daytext: desktop.Wednesday.daytext,
          isthisMonth: desktop.Wednesday.isthisMonth,
          isVa: desktop.Wednesday.isVa,
          isAtterror: desktop.Wednesday.isAtterror,
          isHoliday: desktop.Wednesday.isHoliday,
          isToday: desktop.Wednesday.isToday,
          dayofweek: '星期三'
        })
      this.phone_data.push(
        {
          YearMonthDayText: desktop.Thursday.YearMonthDayText,
          showText: desktop.Thursday.showText,
          roteID: desktop.Thursday.roteID,
          routeName: desktop.Thursday.routeName,
          onTime: void_crossDay(desktop.Thursday.onTime).EndTime,
          offTime: void_crossDay(desktop.Thursday.offTime).EndTime,
          daytext: desktop.Thursday.daytext,
          isthisMonth: desktop.Thursday.isthisMonth,
          isVa: desktop.Thursday.isVa,
          isAtterror: desktop.Thursday.isAtterror,
          isHoliday: desktop.Thursday.isHoliday,
          isToday: desktop.Thursday.isToday,
          dayofweek: '星期四'
        })
      this.phone_data.push(
        {
          YearMonthDayText: desktop.Friday.YearMonthDayText,
          showText: desktop.Friday.showText,
          roteID: desktop.Friday.roteID,
          routeName: desktop.Friday.routeName,
          onTime: void_crossDay(desktop.Friday.onTime).EndTime,
          offTime: void_crossDay(desktop.Friday.offTime).EndTime,
          daytext: desktop.Friday.daytext,
          isthisMonth: desktop.Friday.isthisMonth,
          isVa: desktop.Friday.isVa,
          isAtterror: desktop.Friday.isAtterror,
          isHoliday: desktop.Friday.isHoliday,
          isToday: desktop.Friday.isToday,
          dayofweek: '星期五'
        })
      this.phone_data.push(
        {
          YearMonthDayText: desktop.Saturday.YearMonthDayText,
          showText: desktop.Saturday.showText,
          roteID: desktop.Saturday.roteID,
          routeName: desktop.Saturday.routeName,
          onTime: void_crossDay(desktop.Saturday.onTime).EndTime,
          offTime: void_crossDay(desktop.Saturday.offTime).EndTime,
          daytext: desktop.Saturday.daytext,
          isthisMonth: desktop.Saturday.isthisMonth,
          isVa: desktop.Saturday.isVa,
          isAtterror: desktop.Saturday.isAtterror,
          isHoliday: desktop.Saturday.isHoliday,
          isToday: desktop.Saturday.isToday,
          dayofweek: '星期六'
        })


    }
  }
  drawCalendar(Year: string, Month: string, addMonth: number, drawVal: dateworksClass[]) {
    var data: dataClass[] = []
    var dateworks: dateworksClass[] = drawVal

    var yearDate = Year + '/' + Month + '/01'
    var qwedate = new Date(yearDate)
    var today = new Date()

    qwedate.setMonth(qwedate.getMonth() + addMonth)
    if (qwedate.getDay() > 0) {
      qwedate.setDate(qwedate.getDate() - qwedate.getDay())
    }
    // console.log(qwedate.getDate())

    var allmonth = []

    for (let k = 0; k < 6; k++) {
      var oneweek = []
      var reallyoneweek = []
      var isInMonth = []
      var isToday = []
      for (let i = 0; i < 7; i++) {
        oneweek.push(qwedate.getDate().toString())
        reallyoneweek.push(doFormatDate(qwedate))
        var calMonth = (qwedate.getMonth() + 1).toString()
        if ((qwedate.getMonth() + 1) < 10) {
          calMonth = '0' + calMonth
        } else { }
        if (calMonth == Month) {
          isInMonth.push(true)
        } else {
          isInMonth.push(false)
        }
        if (qwedate.getFullYear() == qwedate.getFullYear() && qwedate.getDate() == today.getDate() && qwedate.getMonth() == today.getMonth()) {
          isToday.push(true)
        } else {
          isToday.push(false)
        }

        qwedate.setDate(qwedate.getDate() + 1)
      }
      allmonth.push({ reallyoneweek: reallyoneweek, oneweek: oneweek, isthisMonth: isInMonth, isthisToday: isToday })
    }
    // console.log(allmonth)
    for (let all of allmonth) {
      data.push(
        {
          Sunday: {
            YearMonthDayText: all.reallyoneweek[0], daytext: all.oneweek[0], isthisMonth: all.isthisMonth[0], isToday: all.isthisToday[0], showText: '', roteID: null, routeName: '', onTime: '', offTime: '', isVa: false, isAtterror: false, isHoliday: false,
            dayofweek: '星期日'
          },
          Monday: {
            YearMonthDayText: all.reallyoneweek[1], daytext: all.oneweek[1], isthisMonth: all.isthisMonth[1], isToday: all.isthisToday[1], showText: '', roteID: null, routeName: '', onTime: '', offTime: '', isVa: false, isAtterror: false, isHoliday: false,
            dayofweek: '星期一'
          },
          Tuesday: {
            YearMonthDayText: all.reallyoneweek[2], daytext: all.oneweek[2], isthisMonth: all.isthisMonth[2], isToday: all.isthisToday[2], showText: '', roteID: null, routeName: '', onTime: '', offTime: '', isVa: false, isAtterror: false, isHoliday: false,
            dayofweek: '星期二'
          },
          Wednesday: {
            YearMonthDayText: all.reallyoneweek[3], daytext: all.oneweek[3], isthisMonth: all.isthisMonth[3], isToday: all.isthisToday[3], showText: '', roteID: null, routeName: '', onTime: '', offTime: '', isVa: false, isAtterror: false, isHoliday: false,
            dayofweek: '星期三'
          },
          Thursday: {
            YearMonthDayText: all.reallyoneweek[4], daytext: all.oneweek[4], isthisMonth: all.isthisMonth[4], isToday: all.isthisToday[4], showText: '', roteID: null, routeName: '', onTime: '', offTime: '', isVa: false, isAtterror: false, isHoliday: false,
            dayofweek: '星期四'
          },
          Friday: {
            YearMonthDayText: all.reallyoneweek[5], daytext: all.oneweek[5], isthisMonth: all.isthisMonth[5], isToday: all.isthisToday[5], showText: '', roteID: null, routeName: '', onTime: '', offTime: '', isVa: false, isAtterror: false, isHoliday: false,
            dayofweek: '星期五'
          },
          Saturday: {
            YearMonthDayText: all.reallyoneweek[6], daytext: all.oneweek[6], isthisMonth: all.isthisMonth[6], isToday: all.isthisToday[6], showText: '', roteID: null, routeName: '', onTime: '', offTime: '', isVa: false, isAtterror: false, isHoliday: false,
            dayofweek: '星期六'
          }
        }
      )
    }
    // console.log(data)

    ///資料畫成月曆
    for (var datework of dateworks) {
      var dateText = datework.daytext

      for (var monthdata of data) {
        if (monthdata.Sunday.YearMonthDayText == dateText) {
          monthdata.Sunday.showText = datework.showText
          monthdata.Sunday.roteID = datework.roteID
          monthdata.Sunday.routeName = datework.routeName
          monthdata.Sunday.onTime = datework.onTime
          monthdata.Sunday.offTime = datework.offTime
          monthdata.Sunday.isVa = datework.isVa
          monthdata.Sunday.isAtterror = datework.isAtterror
          monthdata.Sunday.isHoliday = datework.isHoliday
        } else if (monthdata.Monday.YearMonthDayText == dateText) {
          monthdata.Monday.showText = datework.showText
          monthdata.Monday.roteID = datework.roteID
          monthdata.Monday.routeName = datework.routeName
          monthdata.Monday.onTime = datework.onTime
          monthdata.Monday.offTime = datework.offTime
          monthdata.Monday.isVa = datework.isVa
          monthdata.Monday.isAtterror = datework.isAtterror
          monthdata.Monday.isHoliday = datework.isHoliday
        } else if (monthdata.Tuesday.YearMonthDayText == dateText) {
          monthdata.Tuesday.showText = datework.showText
          monthdata.Tuesday.roteID = datework.roteID
          monthdata.Tuesday.routeName = datework.routeName
          monthdata.Tuesday.onTime = datework.onTime
          monthdata.Tuesday.offTime = datework.offTime
          monthdata.Tuesday.isVa = datework.isVa
          monthdata.Tuesday.isAtterror = datework.isAtterror
          monthdata.Tuesday.isHoliday = datework.isHoliday
        } else if (monthdata.Wednesday.YearMonthDayText == dateText) {
          monthdata.Wednesday.showText = datework.showText
          monthdata.Wednesday.roteID = datework.roteID
          monthdata.Wednesday.routeName = datework.routeName
          monthdata.Wednesday.onTime = datework.onTime
          monthdata.Wednesday.offTime = datework.offTime
          monthdata.Wednesday.isVa = datework.isVa
          monthdata.Wednesday.isAtterror = datework.isAtterror
          monthdata.Wednesday.isHoliday = datework.isHoliday
        } else if (monthdata.Thursday.YearMonthDayText == dateText) {
          monthdata.Thursday.showText = datework.showText
          monthdata.Thursday.roteID = datework.roteID
          monthdata.Thursday.routeName = datework.routeName
          monthdata.Thursday.onTime = datework.onTime
          monthdata.Thursday.offTime = datework.offTime
          monthdata.Thursday.isVa = datework.isVa
          monthdata.Thursday.isAtterror = datework.isAtterror
          monthdata.Thursday.isHoliday = datework.isHoliday
        } else if (monthdata.Friday.YearMonthDayText == dateText) {
          monthdata.Friday.showText = datework.showText
          monthdata.Friday.roteID = datework.roteID
          monthdata.Friday.routeName = datework.routeName
          monthdata.Friday.onTime = datework.onTime
          monthdata.Friday.offTime = datework.offTime
          monthdata.Friday.isVa = datework.isVa
          monthdata.Friday.isAtterror = datework.isAtterror
          monthdata.Friday.isHoliday = datework.isHoliday
        } else if (monthdata.Saturday.YearMonthDayText == dateText) {
          monthdata.Saturday.showText = datework.showText
          monthdata.Saturday.roteID = datework.roteID
          monthdata.Saturday.routeName = datework.routeName
          monthdata.Saturday.onTime = datework.onTime
          monthdata.Saturday.offTime = datework.offTime
          monthdata.Saturday.isVa = datework.isVa
          monthdata.Saturday.isAtterror = datework.isAtterror
          monthdata.Saturday.isHoliday = datework.isHoliday
        }
      }
    }

    return data

  }
  addMonth(dateworks) {
    var dateday = '01'
    var calYearMonth = new Date(this.Year + '/' + this.Month + '/' + dateday)
    calYearMonth.setMonth(calYearMonth.getMonth() + 1)
    this.Year = calYearMonth.getFullYear().toString()
    if ((calYearMonth.getMonth() + 1) >= 10) {
      this.Month = (calYearMonth.getMonth() + 1).toString()
    } else {
      this.Month = "0" + (calYearMonth.getMonth() + 1).toString()
    }
    this.data = this.drawCalendar(this.Year, this.Month, 0, dateworks)
    this.matchPhoneData()
  }
  lessMonth(dateworks) {
    var dateday = '01'
    var calYearMonth = new Date(this.Year + '/' + this.Month + '/' + dateday)
    calYearMonth.setMonth(calYearMonth.getMonth() - 1)
    this.Year = calYearMonth.getFullYear().toString()
    if ((calYearMonth.getMonth() + 1) >= 10) {
      this.Month = (calYearMonth.getMonth() + 1).toString()
    } else {
      this.Month = "0" + (calYearMonth.getMonth() + 1).toString()
    }
    this.data = this.drawCalendar(this.Year, this.Month, 0, dateworks)
    this.matchPhoneData()
  }

  colorisThisMonth(isthisMonth, isToday) {

    if (isthisMonth) {
      return 'rgb(91, 103, 102)'
    } else {
      return 'rgb(208, 211, 212)'
    }
    // if (isToday) {
    //   return 'rgb(91, 103, 102)'
    // } else {

    //   if (isthisMonth) {
    //     return 'rgb(91, 103, 102)'
    //   } else {
    //     return 'rgb(208, 211, 212)'
    //   }
    // }
  }
  colorisThisHoliday(isHoliday, isthisMonth) {
    if (isthisMonth) {
      if (isHoliday) {
        return 'rgb(181, 0, 41)'
      } else {
        return 'rgb(0, 0, 0)'
      }
    } else {
      return 'rgb(208, 211, 212)'
    }
  }
  ShowVa: ShowVa[] = []
  vaClick(YearMonthDday, EmpID) {
    // alert('請假單:' + YearMonthDday + ' ' + EmpID)
    this.SearchAttendDate = YearMonthDday
    var GetAbsDetailByListEmpIDGetApi: GetAbsDetailByListEmpIDGetApiClass = {
      "DateB": YearMonthDday,
      "DateE": YearMonthDday,
      "ListEmpID": [
        EmpID
      ]
    }
    this.LoadingPage.show()

    this.GetApiDataServiceService.getWebApiData_GetAbsDetailByListEmpID(GetAbsDetailByListEmpIDGetApi)
      .pipe(takeWhile(() => this.api_subscribe))
      .subscribe(
        (GetAbsDetailByListEmpIDData: GetAbsDetailByListEmpIDDataClass[]) => {
          this.ShowVa = []
          for (let data of GetAbsDetailByListEmpIDData) {
            var setDay = 0
            var setHour = 0
            var setMin = 0
            //計算日時分
            //全部以分鐘算

            setDay = data.UseDayHourMinute.Day
            setHour = data.UseDayHourMinute.Hour
            setMin = data.UseDayHourMinute.Minute

            this.ShowVa.push({
              State: data.State,
              DateTimeB: data.DateTimeB,
              DateTimeE: data.DateTimeE,
              SignDate: data.CreatDate,
              HoliDayNameC: data.HoliDay.HoliDayNameC,
              Use: data.Use,

              showDateB: formatDateTime(data.DateTimeB).getDate,
              showDateE: formatDateTime(data.DateTimeE).getDate,
              showTimeB: getapi_formatTimetoString(formatDateTime(data.DateTimeB).getTime),
              showTimeE: getapi_formatTimetoString(formatDateTime(data.DateTimeE).getTime),
              showSignDate: formatDateTime(data.CreatDate).getDate,
              showSignTime: getapi_formatTimetoString(formatDateTime(data.CreatDate).getTime),
              day: setDay.toString(),
              hour: setHour.toString(),
              minute: setMin.toString()
            })
          }
          this.LoadingPage.hide()
          $('#RecentHoliday').modal('show')
        }, error => {
          this.LoadingPage.hide()
        }
      )
  }


  AttendanceApiData: GetAttendCalendarExceptionalDataClass
  SearchAttendDate = ''
  AtterrorClick(YearMonthDay, EmpID) {
    // alert('出勤:' + YearMonthDay + ' ' + EmpID)
    var GetAttendCalendarExceptionalGetApi: GetAttendCalendarExceptionalGetApiClass = {
      "DateB": YearMonthDay,
      "EmpID": EmpID
    }
    this.LoadingPage.show()
    this.GetApiDataServiceService.getWebApiData_GetAttendCalendarExceptional(GetAttendCalendarExceptionalGetApi)
      .pipe(takeWhile(() => this.api_subscribe))
      .subscribe(
        (x: GetAttendCalendarExceptionalDataClass) => {

          this.AttendanceApiData = JSON.parse(JSON.stringify(x))
          this.SearchAttendDate = formatDateTime(x.AttendDate).getDate
          this.AttendanceApiData.AttendDate = formatDateTime(x.AttendDate).getDate



          this.AttendanceApiData.ActualRote_OnTime_calCrossDay = void_crossDay(this.AttendanceApiData.OnTime).isCrossDay
          this.AttendanceApiData.ActualRote_OffTime_calCrossDay = void_crossDay(this.AttendanceApiData.OffTime).isCrossDay

          this.AttendanceApiData.AttendCard_OnTime_calCrossDay = void_crossDay(this.AttendanceApiData.OnCardTime).isCrossDay
          this.AttendanceApiData.AttendCard_OffTime_calCrossDay = void_crossDay(this.AttendanceApiData.OffCardTime).isCrossDay
          this.AttendanceApiData.OnTime = getapi_formatTimetoString(void_crossDay(this.AttendanceApiData.OnTime).EndTime)
          this.AttendanceApiData.OffTime = getapi_formatTimetoString(void_crossDay(this.AttendanceApiData.OffTime).EndTime)
          this.AttendanceApiData.OnCardTime = getapi_formatTimetoString(void_crossDay(this.AttendanceApiData.OnCardTime).EndTime)
          this.AttendanceApiData.OffCardTime = getapi_formatTimetoString(void_crossDay(this.AttendanceApiData.OffCardTime).EndTime)

          // this.AttendanceApiData.OnTime = getapi_formatTimetoString(x.OnTime)
          // this.AttendanceApiData.OffTime = getapi_formatTimetoString(x.OffTime)
          // this.AttendanceApiData.OnCardTime = getapi_formatTimetoString(x.OnCardTime)
          // this.AttendanceApiData.OffCardTime = getapi_formatTimetoString(x.OffCardTime)
          // this.LoadingPage.hide()
          $('#AttendanceError').modal('show')
          this.LoadingPage.hide()
        },
        error => {
          // alert('與api連線異常，getWebApiData_GetAttendInfo')
          this.LoadingPage.hide()
        }
      )
  }

  RedAttendString_Title(e: boolean, b: boolean) {
    if (e || b) {
      return '#d0021b'
    } else {
      return 'rgb(150, 149, 148)'
    }
  }
  RedAttendString_Content(e: boolean, b: boolean) {
    if (e || b) {
      return '#d0021b'
    } else {
      return '#4c4c4c'
    }
  }

  showDay(i) {
    return chinesenum(i + 1)
  }



  private Be_setGetRoteInfo$: BehaviorSubject<any> = new BehaviorSubject<Array<number>>(null);
  Ob_setGetRoteInfo$: Observable<any> = this.Be_setGetRoteInfo$;

  bt_Show_RoteInfo(oneSearchRoteID:number) {
    var searchRoteID: Array<number> = []
    if(oneSearchRoteID){
      searchRoteID.push(oneSearchRoteID)
      this.Be_setGetRoteInfo$.next(searchRoteID)
      $('#RoteInf').modal('show')
    }
  }

}


