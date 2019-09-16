import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { drawCalendarClass, SearchMan } from 'src/app/Models/CalendarClass';
import { GetApiUserService } from 'src/app/Service/get-api-user.service';
import { GetApiDataServiceService } from 'src/app/Service/get-api-data-service.service';
import { GetAttendCalendarClass } from 'src/app/Models/PostData_API_Class/GetAttendCalendarClass';
import { takeUntil, takeWhile } from 'rxjs/operators';
import { formatDateTime, doFormatDate } from 'src/app/UseVoid/void_doFormatDate';
import { NgxSpinnerService } from 'ngx-spinner';
import { MAT_DATE_FORMATS, MatDatepicker, NativeDateAdapter, DateAdapter, MAT_DATE_LOCALE } from '@angular/material';
import { FormControl } from '@angular/forms';
import { isValidDate } from 'src/app/UseVoid/void_isVaildDatetime';
import { GetAttendCalendarSimplifyData } from 'src/app/Models/GetAttendCalendarSimplifyData';
import { ExampleHeaderMonth } from 'src/app/Service/datepickerHeaderMonth';
declare let $: any; //use jquery
const MY_DATE_FORMATS = {
  parse: {
    dateInput: { month: 'short', year: 'numeric', day: 'numeric' },
  },
  display: {
    dateInput: 'input',
    monthYearLabel: { year: 'numeric', month: 'numeric' },
    dateA11yLabel: { year: 'numeric', month: 'long', day: 'numeric' },
    monthYearA11yLabel: { year: 'numeric', month: 'long' },
  }
};

export class MyDateAdapter extends NativeDateAdapter {
  format(date: Date, displayFormat: Object): string {
    if (displayFormat == "input") {
      let day = date.getDate();
      let month = date.getMonth() + 1;
      let year = date.getFullYear();
      return year + '/' + this._to2digit(month);
    } else {
      return date.toDateString();
    }
  }
  getDateNames(): string[] {
    const dateNames: string[] = [];
    for (let i = 0; i < 31; i++) {
      dateNames[i] = String(i + 1);
    }
    return dateNames;
  }


  private _to2digit(n: number) {
    return ('00' + n).slice(-2);
  }
}
@Component({
  selector: 'app-own-search-rote',
  templateUrl: './own-search-rote.component.html',
  styleUrls: ['./own-search-rote.component.css'],
  providers: [
    { provide: DateAdapter, useClass: MyDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS },
    { provide: MAT_DATE_LOCALE, useValue: 'zh-tw' },
  ]
})
export class OwnSearchRoteComponent implements OnInit, AfterViewInit, OnDestroy {
  exampleHeader = ExampleHeaderMonth //日期套件header
  dateS = new Date()
  nonRote:boolean = false //查無班表資料
  chosenMonthHandler(a, datepicker: MatDatepicker<any>) {
    var choose = new Date(a)
    this.dateS = choose
    this.blurSearchMonth()
    datepicker.close();
  }
  ngOnDestroy(): void {
    // throw new Error("Method not implemented.");
    this.api_subscribe = false;
  }
  api_subscribe = true
  ngAfterViewInit(): void {
  }

  MonthMask(): {
    mask: Array<string | RegExp>;
    keepCharPositions: boolean;
  } {
    return {
      mask: [/[2]/, /[0]/, /\d/, /\d/, '/', /[0-1]/, /\d/],
      keepCharPositions: true,
    };
  }

  showroteSumDialog: boolean = false
  constructor(
    private GetApiUserService: GetApiUserService,
    private GetApiDataServiceService: GetApiDataServiceService,
    private LoadingPage: NgxSpinnerService) { }

    SearchRoteMan
  ngOnInit() {

    this.GetApiUserService.counter$.subscribe(
      (x: any) => {
        if (x == 0) {
        } else {
          this.SearchRoteMan = x
          this.SearchMan.jobID = x.EmpCode
          if (x.EmpNameC) {
            this.SearchMan.name = x.EmpNameC;
          } else {
            this.SearchMan.name = x.EmpNameE;
          }

          var today = new Date()
          this.search(today)
        }
      })
    var drawCalendar = {
      Year: '',
      Month: '',
      dateworks: []
    }
    this.Be_RoteApiData$.next(drawCalendar)
  }
  errorSearchMonthState = { state: false, errorString: '' }
  blurSearchMonth() {
    if (!this.dateS) {
      this.errorSearchMonthState = { state: true, errorString: '請填寫查詢日期' }
      $("#id_ipt_SearchMonth").addClass("errorInput");
      return true
    } else {
      this.errorSearchMonthState = { state: false, errorString: '' }
      $("#id_ipt_SearchMonth").removeClass("errorInput");
      return false
    }
  }
  SearchMan: SearchMan = { jobID: '', name: '' }
  private Be_RoteApiData$: BehaviorSubject<any> = new BehaviorSubject<any>(0);
  Ob_RoteApiData$: Observable<any> = this.Be_RoteApiData$;
  search(searchDay) {
    var startday = searchDay
    if (this.blurSearchMonth()) {
      // alert('請填寫正確日期格式')
    } else {
      this.nonRote = false 
      var checkYear: any = doFormatDate(startday).toString().split('/')[0];
      var checkMonth: any = doFormatDate(startday).toString().split('/')[1];
      var MonthFirstDate = new Date(checkYear, checkMonth - 1, 1)
      var MonthEndDate = new Date(checkYear, checkMonth, 0)
      MonthFirstDate.setDate(MonthFirstDate.getDate() - 7)
      MonthEndDate.setDate(MonthEndDate.getDate() + 12)
      var searchFirstDate = doFormatDate(MonthFirstDate).toString()
      var searchEndDate = doFormatDate(MonthEndDate).toString()
      // alert(searchFirstDate.toString() + '\n' + searchEndDate.toString())
      this.LoadingPage.show()
      var GetAttendCalendar: GetAttendCalendarClass = {
        DateB: searchFirstDate.toString(),
        DateE: searchEndDate.toString(),
        EmpID: this.SearchMan.jobID.toString()
      }
      this.GetApiDataServiceService.getWebApiData_GetAttendCalendarSimplify(GetAttendCalendar)
        .pipe(takeWhile(() => this.api_subscribe))
        .subscribe(
          (x: GetAttendCalendarSimplifyData[]) => {
            // console.log(x);
            if (x) {
              if (x.length == 0) {
                // alert('查無班表資料')
                this.nonRote = true
                this.LoadingPage.hide()
              } else {
                var drawCalendar: drawCalendarClass = new drawCalendarClass();
                drawCalendar.SearchMan = new SearchMan()
                drawCalendar.Year = checkYear
                drawCalendar.Month = checkMonth
                drawCalendar.SearchMan.jobID = this.SearchMan.jobID.toString()
                drawCalendar.SearchMan.name = this.SearchMan.name.toString()
                drawCalendar.dateworks = []
                for (let data of x) {
                  var todayVa: boolean = false
                  var todayAtterror: boolean = false
                  var todayHoliday: boolean = false
                  if (data.Abs || data.AbsFlow) {
                    //db 或 flow 有請假資料
                    todayVa = true
                  }
                  if (data.AttendExceptional) {
                    todayAtterror = true
                  }
                  if (data.Holiday) {
                    //這天是否為放假
                    todayHoliday = true
                  }
                  drawCalendar.dateworks.push({
                    daytext: formatDateTime(data.AttendDate).getDate,
                    showText: '',
                    // routeName: data.ActualRote.RoteCode + data.ActualRote.RoteNameC,
                    roteID:data.ActualRoteID,
                    routeName: data.ActualRoteName,
                    onTime: data.OnTime,
                    offTime: data.OffTime,
                    isVa: todayVa,
                    isAtterror: todayAtterror,
                    isHoliday: todayHoliday
                  })

                  this.Be_RoteApiData$.next(drawCalendar)
                }
                this.LoadingPage.hide()
              }
            } else {
              alert('查無出勤資料')
              this.LoadingPage.hide()
            }
          }, error => {
            // alert('與api連線異常，getWebApiData_GetAttendCalendar')
            this.LoadingPage.hide()

          }
        )
    }
    // var drawCalendar: drawCalendarClass = {
    //   Year: checkYear,
    //   Month: checkMonth,
    //   dateworks: [{
    //     daytext: '2019/01/05',
    //     showText: '',
    //     routeName: '1205ABC',
    //     onTime: '1205',
    //     offTime: '1700',
    //     isVa: false,
    //     isAtterror: true,
    // isHoliday:false
    //   }, {
    //     daytext: '2019/01/08',
    //     showText: '',
    //     routeName: '1201ABC',
    //     onTime: '1201',
    //     offTime: '1700',
    //     isVa: true,
    //     isAtterror: false,
    // isHoliday:false
    //   }, {
    //     daytext: '2019/01/10',
    //     showText: '',
    //     routeName: '1201ABC',
    //     onTime: '1201',
    //     offTime: '1700',
    //     isVa: false,
    //     isAtterror: false,
    // isHoliday:false
    //   }, {
    //     daytext: '2019/01/16',
    //     showText: '',
    //     routeName: '1201ABC',
    //     onTime: '1201',
    //     offTime: '1700',
    //     isVa: true,
    //     isAtterror: true,
    // isHoliday:false
    //   }, {
    //     daytext: '2019/01/25',
    //     showText: '',
    //     routeName: '1201ABC',
    //     onTime: '1201',
    //     offTime: '1700',
    //     isVa: true,
    //     isAtterror: false,
    // isHoliday:false
    //   }, {
    //     daytext: '2019/01/21',
    //     showText: '',
    //     routeName: '1220_ABC',
    //     onTime: '1220',
    //     offTime: '1700',
    //     isVa: false,
    //     isAtterror: true,
    // isHoliday:false
    //   }, {
    //     daytext: '2019/01/27',
    //     showText: '',
    //     routeName: '1227ABC',
    //     onTime: '1227',
    //     offTime: '1700',
    //     isVa: true,
    //     isAtterror: true,
    // isHoliday:false
    //   }],
    //   SearchMan: this.SearchMan
    // }
    // this.Be_RoteApiData$.next(drawCalendar)
  }

  bt_showroteSumDialog() {
    this.showroteSumDialog = true;
    $('#roteSumDialog').modal('show')
  }
}
