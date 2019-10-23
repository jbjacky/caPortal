import { Component, OnInit, AfterViewInit, Output, EventEmitter, OnDestroy } from '@angular/core';
import { EmpArray } from 'src/app/Models/EmpArray';
import { drawCalendarClass, SearchMan } from 'src/app/Models/CalendarClass';
import { BehaviorSubject, Observable } from 'rxjs';
import { GetApiUserService } from 'src/app/Service/get-api-user.service';
import { GetBaseByFormClass } from 'src/app/Models/PostData_API_Class/GetBaseByFormClass';
import { GetApiDataServiceService } from 'src/app/Service/get-api-data-service.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { GetAttendCalendarClass } from 'src/app/Models/PostData_API_Class/GetAttendCalendarClass';
import { takeWhile } from 'rxjs/operators';
import { formatDateTime, doFormatDate } from 'src/app/UseVoid/void_doFormatDate';
import { MatDatepicker, NativeDateAdapter, DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material';
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


  private _to2digit(n: number) {
    return ('00' + n).slice(-2);
  }
}

@Component({
  selector: 'app-personnel-search-rote',
  templateUrl: './personnel-search-rote.component.html',
  styleUrls: ['./personnel-search-rote.component.css'],
  providers: [
    { provide: DateAdapter, useClass: MyDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS },
    { provide: MAT_DATE_LOCALE, useValue: 'zh-tw' },
  ]
})
export class PersonnelSearchRoteComponent implements OnInit, AfterViewInit, OnDestroy {
  exampleHeader = ExampleHeaderMonth //日期套件header
  dateS = new Date()
  nonRote: boolean = false //查無班表資料
  chosenMonthHandler(a, datepicker: MatDatepicker<any>) {
    var choose = new Date(a)
    this.dateS = choose

    datepicker.close();
    this.blurSearchMonth()
  }
  ngOnDestroy(): void {
    // throw new Error("Method not implemented.");
    this.api_subscribe = false;
  }
  api_subscribe = true
  ngAfterViewInit(): void {
  }

  errorLeavemanState = { state: false, errorString: '' }
  showroteSumDialog: boolean = false
  constructor(
    private GetApiUserService: GetApiUserService,
    private GetApiDataServiceService: GetApiDataServiceService,
    private LoadingPage: NgxSpinnerService) { }
    
  SearchRoteMan
  
  setMan = { EmpCode: '', EmpName: '', DeptaID: '', DeptaName: '' }

  ngOnInit() {

    this.GetApiUserService.counter$.subscribe(
      (x: any) => {
        if (x == 0) {
        } else {

          this.SearchRoteMan = x
          this.SearchMan.EmpCode = x.EmpCode
          this.setMan.EmpCode = x.EmpCode
          if (x.EmpNameC) {
            this.SearchMan.EmpNameC = x.EmpNameC;
            this.setMan.EmpName = x.EmpNameC;
          } else {
            this.SearchMan.EmpNameC = x.EmpNameE;
            this.setMan.EmpName = x.EmpNameE;
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

  onSaveEmptoView(event) {
    // console.log(event)
    this.SearchMan.EmpCode = event.split('，')[0]
    this.SearchMan.EmpNameC = event.split('，')[1]
    if (event) {
      $('#chooseEmpdialog').modal('hide');
    }
    // this.outPutEmpValue(this.SearchMan.EmpCode, this.SearchMan.EmpNameC, this.SearchMan.EmpNameC)
    this.blurEmpCode()
  }
  @Output() outPutChoose: EventEmitter<any> = new EventEmitter<any>();//選到的員工回傳
  outPutEmpValue(EmpCode, EmpNameC, EmpNameE) {
    var EmpArray: EmpArray[] = []
    EmpArray.push({ EmpCode: EmpCode, EmpNameC: EmpNameC, EmpNameE: EmpNameE })
    this.outPutChoose.emit(EmpArray)
  }
  blurEmpCode() {
    if (this.SearchMan.EmpCode.length == 6) {
      var _NowDate = new Date();
      var _NowToday = doFormatDate(_NowDate);
      var GetBaseByFormClass: GetBaseByFormClass = {
        EmpCode: this.setMan.EmpCode,
        AppEmpCode: this.SearchMan.EmpCode,
        EffectDate: _NowToday
      }
      this.LoadingPage.show()
      this.GetApiDataServiceService.getWebApiData_GetBaseByFormDeptDown(GetBaseByFormClass)
      .pipe(takeWhile(() => this.api_subscribe))
      .subscribe((x: any) => {
          if (x == null) {
            this.SearchMan.EmpNameC = ''
            // alert('工號輸入錯誤') 
            this.Assistant(GetBaseByFormClass)
          } else if (x.length == 0) {
            // alert('工號輸入錯誤')
            this.Assistant(GetBaseByFormClass)
          } else {
            // alert('工號正確')
            if (x[0].EmpNameC == null) {
              this.SearchMan.EmpNameC = x[0].EmpNameE
            } else if (x[0].EmpNameC.length == 0) {
              this.SearchMan.EmpNameC = x[0].EmpNameE
            } else {
              this.SearchMan.EmpNameC = x[0].EmpNameC
            }
            this.outPutEmpValue(this.SearchMan.EmpCode, this.SearchMan.EmpNameC, this.SearchMan.EmpNameC)
            this.errorLeavemanState = { state: false, errorString: '' }
            $("#leavejobid").removeClass("errorInput");
            this.LoadingPage.hide()

          }
        })
    } else {
      this.SearchMan.EmpNameC = ''
      this.outPutEmpValue('', '', '')
      this.errorLeavemanState = { state: true, errorString: '非同單位或無該部門的行政權限' }
      $("#leavejobid").addClass("errorInput");
      this.LoadingPage.hide()
    }
  }

  private Assistant(GetBaseByFormClass: GetBaseByFormClass) {
    //行政權限
    this.GetApiDataServiceService.getWebApiData_GetBaseByFormStaff(GetBaseByFormClass)
      .pipe(takeWhile(() => this.api_subscribe))
      .subscribe((x: any) => {
        if (x == null) {
          // alert('工號輸入錯誤')
          this.SearchMan.EmpNameC = ''
          this.outPutEmpValue('', '', '')
          this.errorLeavemanState = { state: true, errorString: '非同單位或無該部門的行政權限' }
          $("#leavejobid").addClass("errorInput");
          this.LoadingPage.hide()
        }
        else if (x.length == 0) {
          // alert('工號輸入錯誤')
          this.SearchMan.EmpNameC = ''
          this.outPutEmpValue('', '', '')
          this.errorLeavemanState = { state: true, errorString: '非同單位或無該部門的行政權限' }
          $("#leavejobid").addClass("errorInput");
          this.LoadingPage.hide()
        }
        else {
          // alert('工號正確')
          if (x[0].EmpNameC == null) {
            this.SearchMan.EmpNameC = x[0].EmpNameE
          } else if (x[0].EmpNameC.length == 0) {
            this.SearchMan.EmpNameC = x[0].EmpNameE
          } else {
            this.SearchMan.EmpNameC = x[0].EmpNameC
          }
          this.outPutEmpValue(this.SearchMan.EmpCode, this.SearchMan.EmpNameC, this.SearchMan.EmpNameC)
          this.errorLeavemanState = { state: false, errorString: '' }
          $("#leavejobid").removeClass("errorInput");
          this.LoadingPage.hide()
        }
      }, error => {
        this.LoadingPage.hide();
      });
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

  SearchMan = { EmpCode: '', EmpNameC: '' }
  private Be_RoteApiData$: BehaviorSubject<any> = new BehaviorSubject<any>(0);
  Ob_RoteApiData$: Observable<any> = this.Be_RoteApiData$;
  search(searchDay) {
    var startday = searchDay
    if (this.errorLeavemanState.state) {
      //權限搜尋員工
    } else if (this.blurSearchMonth()) {
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
      // alert(searchFirstDate.toString() + '\n' + searchEndDate.toString())
      this.LoadingPage.show()
      var GetAttendCalendar: GetAttendCalendarClass = {
        DateB: searchFirstDate.toString(),
        DateE: searchEndDate.toString(),
        EmpID: this.SearchMan.EmpCode.toString()
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
                drawCalendar.SearchMan.jobID = this.SearchMan.EmpCode.toString()
                drawCalendar.SearchMan.name = this.SearchMan.EmpNameC.toString()
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


  chooseEmpdialog_ShowDialog: boolean = false
  bt_ShowDialog_chooseEmpdialog() {
    this.chooseEmpdialog_ShowDialog = true
    $('#chooseEmpdialog').modal('show')
  }

  bt_showroteSumDialog() {
    this.showroteSumDialog = true;
    $('#roteSumDialog').modal('show')
  }
}
