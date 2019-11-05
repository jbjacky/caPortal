import { Component, OnInit, AfterViewInit, Input } from '@angular/core';
import { GetApiDataServiceService } from 'src/app/Service/get-api-data-service.service';
declare let $: any; //use jquery
import { GetAttendInfoClass } from 'src/app/Models/PostData_API_Class/GetAttendInfoClass';
import { chinesenum } from 'src/app/UseVoid/void_chinesenumber'
import { formatDateTime, getapi_formatTimetoString } from 'src/app/UseVoid/void_doFormatDate';
import { Attendance } from 'src/app/Models/Attendance';
import { ShowVa } from 'src/app/Models/ShowVa';
import { NgxSpinnerService } from 'ngx-spinner';
import { GetAbsDetailByListEmpIDGetApiClass } from 'src/app/Models/PostData_API_Class/GetAbsDetailByListEmpIDGetApiClass';
import { takeWhile } from 'rxjs/operators';
import { GetAbsDetailByListEmpIDDataClass } from 'src/app/Models/GetAbsDetailByListEmpIDDataClass';
import { void_crossDay } from 'src/app/UseVoid/void_crossDay';
import { BehaviorSubject, Observable } from 'rxjs';

@Component({
  selector: 'app-search-attendance',
  templateUrl: './search-attendance.component.html',
  styleUrls: ['./search-attendance.component.css'],
  providers: [GetAttendInfoClass,Attendance]
})
export class SearchAttendanceComponent implements OnInit {
  ngOnDestroy(): void {
    // throw new Error("Method not implemented.");
    this.api_subscribe = false;
  }
  api_subscribe = true; //ngOnDestroy時要取消訂閱api的subscribe

  @Input() searchAttendanceApiData;

  AttendanceApiData: Array<Attendance> = new Array<Attendance>();
  constructor(private GetApiDataServiceService: GetApiDataServiceService,
     private GetAttendInfoClass: GetAttendInfoClass,
    private LoadingPage: NgxSpinnerService,) { }

  ngOnInit() {
    this.searchAttendanceApiData.subscribe(
      (x:any)=>{
        console.log(void_crossDay('2410'))
        console.log(getapi_formatTimetoString(void_crossDay('2410').EndTime))
        // console.log(getapi_formatTimetoString(void_crossDay('2402').EndTime))
        this.AttendanceApiData = JSON.parse(JSON.stringify(x));
        // console.log(x)
        for(let aa of this.AttendanceApiData){
          aa.OffTime_calCrossDay = void_crossDay(aa.OffTime).isCrossDay
          aa.OnCardTime_calCrossDay = void_crossDay(aa.OnCardTime).isCrossDay
          aa.OffCardTime_calCrossDay =void_crossDay(aa.OffCardTime).isCrossDay

          aa.OnTime = getapi_formatTimetoString(void_crossDay(aa.OnTime).EndTime)
          aa.OffTime = getapi_formatTimetoString(void_crossDay(aa.OffTime).EndTime)
          aa.OnCardTime = getapi_formatTimetoString(void_crossDay(aa.OnCardTime).EndTime)
          aa.OffCardTime = getapi_formatTimetoString(void_crossDay(aa.OffCardTime).EndTime)
        }
        this.AttendanceApiData.sort((a,b)=>{
          var oldDate:any = new Date(a.AttendDate.toString())
          var newDate:any = new Date(b.AttendDate.toString())
          return  newDate - oldDate
        })
      }
    )
    // this.GetAttendInfoClass = { DateB: "2018/8/1", DateE: "2018/8/10", ListEmpID: ["051005"], EffectDate: "", Display: "1", ListState: ["1", "2", "3"] }
    // //顯示所有
    
    // this.GetAttendInfoClass = { DateB: "2018/8/1", DateE: "2018/8/10", ListEmpID: ["051005"], EffectDate: "", Display: "3", ListState: ["1", "2", "3"] }
    // //只顯示異常
    
    // this.GetAttendInfoClass = { DateB: "2018/8/1", DateE: "2018/8/10", ListEmpID: ["051005"], EffectDate: "", Display: "3", ListState: ["3"] }
    // //只顯示異常且未刷卡
    
    // this.GetAttendInfoClass = { DateB: "2018/8/1", DateE: "2018/8/10", ListEmpID: ["051005"], EffectDate: "", Display: "2", ListState: [""] }
    // //只顯示正常

    // this.GetApiDataServiceService.getWebApiData_GetAttendInfo(this.GetAttendInfoClass).subscribe(
    //   (x: any) => {
    //     for (let i = 0; i < x.length; i++) {
    //       if (x[i].AttendAbsInfo) {
    //         x[i].AttendAbsInfo = true
    //       } else {
    //         x[i].AttendAbsInfo = false
    //       }
    //     }
    //     this.AttendanceApiData = x;
    //     for (let i = 0; i < this.AttendanceApiData.length; i++) {
    //       var date = new Date(this.AttendanceApiData[i].AttendDate)
    //       this.AttendanceApiData[i].AttendDate = doFormatDate(this.AttendanceApiData[i].AttendDate)
    //       if (date.getDay() == 0){
    //         this.AttendanceApiData[i].DayOfweek = '日'
    //       }else{
    //         this.AttendanceApiData[i].DayOfweek = chinesenum(date.getDay())
    //       }
    //     }

    //   }
    // )
  }

  ShowVa: ShowVa[] = []
  SearchAttendDate: string = ''

  showDay(i) {
    return chinesenum(i + 1)
  }
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

            setDay = data.UseDayHourMinute.Day
            setHour = data.UseDayHourMinute.Hour
            setMin =  data.UseDayHourMinute.Minute

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
    // this.AttendanceApiData.push(
    //   {
    //     EmpID: "051005",
    //     EmpCode: "051005",
    //     EmpName: "王O懿",
    //     DeptName: "會計行政部",
    //     AttendDate: "2018-08-01",
    //     RoteNameC: "常日班",
    //     OnTime: "0800",
    //     OffTime: "1700",
    //     OnCardTime: "0800",
    //     OffCardTime: "1700",
    //     AttendAbsInfo: null,

    //     Ride: true, //搭車
    //     Behind: false, //車誤
    //     FlexibleMinute: 1, //彈性

    //     LateMins: 0, //遲到
    //     EarlyMins: 0, //早退
    //     IsAbsent: false, //未刷卡
    //     ForgetCard: 0,
    //     DayOfweek:''
    //   }
    // )