import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { GetApiDataServiceService } from 'src/app/Service/get-api-data-service.service';
import { chinesenum } from 'src/app/UseVoid/void_chinesenumber'
import { GetAttendInfoClass } from 'src/app/Models/PostData_API_Class/GetAttendInfoClass';
import { doFormatDate, timeZone_tw, formatDateTime } from 'src/app/UseVoid/void_doFormatDate';
import { BehaviorSubject, Observable } from 'rxjs';
import { Attendance } from 'src/app/Models/Attendance';
import { GetApiUserService } from 'src/app/Service/get-api-user.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ExampleHeader } from 'src/app/Service/datepickerHeader';
import { void_MonthDiff } from 'src/app/UseVoid/void_DateDiff';
import { takeWhile } from 'rxjs/operators';
declare let $: any; //use jquery

@Component({
  selector: 'app-own-search',
  templateUrl: './own-search.component.html',
  styleUrls: ['./own-search.component.css'],
  providers: [GetAttendInfoClass, Attendance]

})
export class OwnSearchComponent implements OnInit, AfterViewInit, OnDestroy {
  exampleHeader = ExampleHeader //日期套件header
  ngAfterViewInit(): void {
  }

  ngOnDestroy(): void {
    this.api_subscribe = false;
  }
  api_subscribe = true;

  showSearchCheckbok = false;
  EmpBase = { EmpCode: '', Name: '' };
  LateMins = true; //遲到
  EarlyMins = true; //早退
  IsAbsent = true; //未刷卡
  IsEarlyCome = true; //早到
  IsLateBack = true; //晚退

  errorStartDateState = { state: false, errorString: '' }
  errorEndtDateState = { state: false, errorString: '' }

  constructor(private GetApiUserService: GetApiUserService,
    private GetApiDataServiceService: GetApiDataServiceService,
    private LoadingPage: NgxSpinnerService) { }

  SearchDateB: Date
  SearchDateE: Date
  SelectDisplay = 1

  ngOnInit() {
    this.GetApiUserService.counter$.subscribe(
      (x: any) => {
        if (x != 0) {
          this.EmpBase.EmpCode = x.EmpCode
          if (x.EmpNameC) {
            this.EmpBase.Name = x.EmpNameC;
          } else {
            this.EmpBase.Name = x.EmpNameE;
          }
          this.SearchDateB = new Date()
          this.SearchDateE = new Date()
          this.SearchDateB.setDate(this.SearchDateB.getDate() - 7)
          this.SearchDateE.setDate(this.SearchDateE.getDate())
          this.onSearchClick()
        }
      })
  }

  onSearchChange() {
    if (this.SelectDisplay == 1) {
      //全部
      this.showSearchCheckbok = false;
    } else if (this.SelectDisplay == 2) {
      // 正常出勤
      this.showSearchCheckbok = false;
    } else if (this.SelectDisplay == 3) {
      // 異常出勤
      this.showSearchCheckbok = true;
    }
  }

  SerchStartDateChang() {
    if (this.SearchDateE > this.SearchDateB) {

    } else {
      this.SearchDateE = new Date(this.SearchDateB)
    }
    this.blurStartDate()
  }
  blurStartDate() {
    if (!this.SearchDateB) {
      $("#id_ipt_startday").addClass("errorInput");
      this.errorStartDateState = { state: true, errorString: '請填寫起始日期' }
      return true
    } else {
      var today = new Date()
      today.setHours(0, 0, 0)
      today.setMinutes(0, 0, 0)
      today.setSeconds(0, 0)

      this.SearchDateB.setHours(0, 0, 0)
      this.SearchDateB.setMinutes(0, 0, 0)
      this.SearchDateB.setSeconds(0, 0)

      this.SearchDateE.setHours(0, 0, 0)
      this.SearchDateE.setMinutes(0, 0, 0)
      this.SearchDateE.setSeconds(0, 0)

      var startdate = this.SearchDateB
      var enddate = this.SearchDateE

      if (startdate > enddate) {
        $("#id_ipt_startday").addClass("errorInput");
        this.errorStartDateState = { state: true, errorString: '起始日期不能大於結束日期' }
      } else {
        $("#id_ipt_startday").removeClass("errorInput");
        this.errorStartDateState = { state: false, errorString: '' }
      }

      if (enddate > today) {
        $("#id_ipt_endday").addClass("errorInput");
        this.errorEndtDateState = { state: true, errorString: '結束日不得大於今天' }
      } else {
        $("#id_ipt_endday").removeClass("errorInput");
        this.errorEndtDateState = { state: false, errorString: '' }
      }

      if (enddate <= today && startdate <= enddate) {
        return false
      } else {
        return true
      }
    }
  }
  blurEndDate() {
    if (!this.SearchDateE) {
      $("#id_ipt_endday").addClass("errorInput");
      this.errorEndtDateState = { state: true, errorString: '請填寫結束日期' }
      return true
    } else {

      var today = new Date()
      today.setHours(0, 0, 0)
      today.setMinutes(0, 0, 0)
      today.setSeconds(0, 0)

      this.SearchDateB.setHours(0, 0, 0)
      this.SearchDateB.setMinutes(0, 0, 0)
      this.SearchDateB.setSeconds(0, 0)

      this.SearchDateE.setHours(0, 0, 0)
      this.SearchDateE.setMinutes(0, 0, 0)
      this.SearchDateE.setSeconds(0, 0)

      var startdate = this.SearchDateB
      var enddate = this.SearchDateE

      if (startdate > enddate) {
        $("#id_ipt_startday").addClass("errorInput");
        this.errorStartDateState = { state: true, errorString: '起始日期不能大於結束日期' }
      } else {
        $("#id_ipt_startday").removeClass("errorInput");
        this.errorStartDateState = { state: false, errorString: '' }
      }

      if (enddate > today) {
        $("#id_ipt_endday").addClass("errorInput");
        this.errorEndtDateState = { state: true, errorString: '結束日不得大於今天' }
      } else {
        $("#id_ipt_endday").removeClass("errorInput");
        this.errorEndtDateState = { state: false, errorString: '' }
      }

      if (enddate <= today && startdate <= enddate) {
        return false
      } else {
        return true
      }
    }
  }

  AttendanceApiData: Array<Attendance> = new Array<Attendance>();
  private Be_AttendanceApiData$: BehaviorSubject<any> = new BehaviorSubject<any>(0);
  Ob_AttendanceApiData$: Observable<any> = this.Be_AttendanceApiData$;
  onSearchClick() {
    var today = new Date()
    today.setHours(0, 0, 0)
    today.setMinutes(0, 0, 0)
    today.setSeconds(0, 0)

    this.SearchDateE.setHours(0, 0, 0)
    this.SearchDateE.setMinutes(0, 0, 0)
    this.SearchDateE.setSeconds(0, 0)

    var searchDateB: Date = new Date(this.SearchDateB.toString())
    var searchDateE: Date = new Date(this.SearchDateE.toString())
    if (this.SearchDateE > today) {
      $("#id_ipt_endday").addClass("errorInput");
      this.errorEndtDateState = { state: true, errorString: '結束日不得大於今天' }
    } else if (this.blurStartDate() || this.blurEndDate()) {
    } else if (void_MonthDiff(searchDateB, searchDateE) > 3) {
      alert('查詢起訖區間"月份"不得超過三個月')
    } else {
      this.LoadingPage.show()
      this.Be_AttendanceApiData$.next([])
      var ipt_ListEmpID = [this.EmpBase.EmpCode]
      var ipt_DateB = doFormatDate(this.SearchDateB)
      var ipt_DateE = doFormatDate(this.SearchDateE)
      var selectDisplay
      var checkListState = []
      if (this.SelectDisplay == 1) {
        //全部
        selectDisplay = '1'
        checkListState = []
      } else if (this.SelectDisplay == 2) {
        //正常出勤
        selectDisplay = '2'
        checkListState = []
      } else if (this.SelectDisplay == 3) {
        //異常出勤
        selectDisplay = '3'
        if (this.LateMins) {//遲到
          checkListState.push('2')
        }
        if (this.EarlyMins) {//早退
          checkListState.push('1')
        }
        if (this.IsAbsent) {//未刷卡
          checkListState.push('3')
        }
        if (this.IsEarlyCome) {//早到
          checkListState.push('4')
        }
        if (this.IsLateBack) {//晚退
          checkListState.push('5')
        }
      }

      // this.GetAttendInfoClass = { DateB: "2018/8/1", DateE: "2018/8/10", ListEmpID: ["051005"], EffectDate: "", Display: "1", ListState: ["1", "2", "3"] }
      // //顯示所有
      // this.GetAttendInfoClass = { DateB: "2018/8/1", DateE: "2018/8/10", ListEmpID: ["051005"], EffectDate: "", Display: "3", ListState: ["3"] }
      // //只顯示異常且未刷卡
      // this.GetAttendInfoClass = { DateB: "2018/8/1", DateE: "2018/8/10", ListEmpID: ["051005"], EffectDate: "", Display: "2", ListState: [""] }
      // //只顯示正常
      // this.GetAttendInfoClass = { DateB: "2018/8/1", DateE: "2018/8/10", ListEmpID: ["051005"], EffectDate: "", Display: "3", ListState: ["1", "2", "3"] }
      // //只顯示異常
      var _NowDate = new Date();
      var _NowToday = doFormatDate(_NowDate);
      var GetAttendInfo: GetAttendInfoClass = {
        DateB: ipt_DateB,
        DateE: ipt_DateE,
        ListEmpID: ipt_ListEmpID,
        EffectDate: _NowToday,
        Display: selectDisplay,
        ListState: checkListState
      }


      this.GetApiDataServiceService.getWebApiData_GetAttendInfo_Integration(GetAttendInfo)
      .pipe(takeWhile(() => this.api_subscribe))
      .subscribe(
        (x: any) => {
          for (let i = 0; i < x.length; i++) {
            if (x[i].AttendAbsInfo) {
              x[i].AttendAbsInfo = true
            } else {
              x[i].AttendAbsInfo = false
            }
          }
          this.AttendanceApiData = JSON.parse(JSON.stringify(x));
          // for(let i = 0 ; i<this.AttendanceApiData.length; i++){
          //   this.AttendanceApiData[i].AttendDate = new Date(this.AttendanceApiData[i].AttendDate).toString()
          // }
          for (let i = 0; i < this.AttendanceApiData.length; i++) {
            var date = new Date(this.AttendanceApiData[i].AttendDate.toString())
            this.AttendanceApiData[i].AttendDate = formatDateTime(this.AttendanceApiData[i].AttendDate).getDate
            if (date.getDay() == 0) {
              this.AttendanceApiData[i].DayOfweek = '日'
            } else {
              this.AttendanceApiData[i].DayOfweek = chinesenum(date.getDay())
            }
          }
          this.Be_AttendanceApiData$.next(this.AttendanceApiData)
          this.LoadingPage.hide()
        },
        error => {
          this.LoadingPage.hide()
          // alert('與api連線失敗，getWebApiData_GetAttendInfo')
        }
      )
    }
  }


}


