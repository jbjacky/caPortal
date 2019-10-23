import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { ExampleHeader } from 'src/app/Service/datepickerHeader';
import { doFormatDate } from 'src/app/UseVoid/void_doFormatDate';
import { NativeDateAdapter, DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material';
import { GetApiDataServiceService } from 'src/app/Service/get-api-data-service.service';
import { GetRoteApiDataClass } from 'src/app/Models/GetRoteApiDataClass';
import { takeWhile } from 'rxjs/operators';
import { GetAttendSumRoteGetApiClass } from 'src/app/Models/PostData_API_Class/GetAttendSumRoteGetApiClass';
import { GetAttendSumRoteGetApiDataClass } from 'src/app/Models/GetAttendSumRoteGetApiDataClass';
import { GetDeptDataClass } from 'src/app/Models/GetDeptDataClass';
import { NgxSpinnerService } from 'ngx-spinner';
import { GetApiUserService } from 'src/app/Service/get-api-user.service';
import { GetBaseByFormClass } from 'src/app/Models/PostData_API_Class/GetBaseByFormClass';
import { GetDeptGetApiClass } from 'src/app/Models/PostData_API_Class/GetDeptGetApiClass';
import { GetRoteDataClass } from 'src/app/Models/GetRoteDataClass';
import { void_DateDiff } from 'src/app/UseVoid/void_DateDiff';

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
      return year + '/' + this._to2digit(month) + '/' + this._to2digit(day);
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
  selector: 'app-search-rote-sum',
  templateUrl: './search-rote-sum.component.html',
  styleUrls: ['./search-rote-sum.component.css'],
  providers: [
    { provide: DateAdapter, useClass: MyDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS },
    { provide: MAT_DATE_LOCALE, useValue: 'zh-tw' },
  ]
})
export class SearchRoteSumComponent implements OnInit, OnDestroy {
  ngOnDestroy(): void {
    // throw new Error("Method not implemented.");
    this.api_subscribe = false;
  }
  @Input() setMan
  @Input() MyselfSearch: boolean //個人班表查詢-班別統計
  @Input() PersonSearch: boolean //員工班表查詢-班別統計


  chooseRadio: number = 1;
  radiogroup: radiogroupClass[] = [
    { id: 1, name: '查詢員工' },
    { id: 2, name: '查詢單位' }
  ];

  api_subscribe = true; //ngOnDestroy時要取消訂閱api的subscribe
  exampleHeader = ExampleHeader //日期套件header

  searchDateB
  searchDateE

  errorStartDate = { state: false, errorString: '' };
  errorEndDate = { state: false, errorString: '' };
  NgxRoteSelectBox: GetRoteApiDataClass[] = []
  NgxDeptSelectBox: GetDeptDataClass[] = []
  SearchRoteID
  SearchDeptID

  showSearchRote: GetAttendSumRoteGetApiDataClass[] = []
  showSerchNonBlock: boolean = false

  errorLeavemanState = { state: false, errorString: '' }
  SearchMan = { EmpCode: '', EmpNameC: '' }
  
  constructor(
    private GetApiUserService: GetApiUserService,
    private GetApiDataServiceService: GetApiDataServiceService,
    private LoadingPage: NgxSpinnerService) { }

  ngOnInit() {

    var today = new Date();
    var firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)
    var lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    this.searchDateB = firstDayOfMonth
    this.searchDateE = lastDayOfMonth

    if (this.setMan && this.MyselfSearch) {
      this.LoadingPage.show()

      this.GetApiDataServiceService.getWebApiData_GetDeptByEmpCode(this.setMan.EmpID)
        .pipe(takeWhile(() => this.api_subscribe))
        .subscribe(
          (GetDeptData: GetDeptDataClass[]) => {
            this.NgxDeptSelectBox = GetDeptData

            for (let aa of this.NgxDeptSelectBox) {
              var showParentName = ''
              if (aa.ParentName) {
                showParentName = aa.ParentName + ' / '
              }
              aa.uiShowDeptCodeAndName = showParentName + aa.DeptNameC
            }
            this.SearchDeptID = this.setMan.DeptID
            this.onSearch()
            var nowRadio = this.radiogroup.find((x)=>{
              return x.id == this.chooseRadio
            })
            this.changeRadio(nowRadio)
          })

    } else if (this.setMan && this.PersonSearch) {
      this.SearchMan = JSON.parse(JSON.stringify(this.setMan))
      this.blurEmpCode()
    }
  }

  onSearch() {
    $("body").addClass("modal-open");
    this.showSerchNonBlock = false
    var searchDeptID = []
    var searchListRoteID = []
    var searchListEmpID = []
    if (this.chooseRadio == 1) {
      searchDeptID = null
      if (this.MyselfSearch) {
        searchListEmpID.push(this.setMan.EmpID)
      } else if (this.PersonSearch) {
        if (this.SearchMan.EmpCode) {
          searchListEmpID.push(this.SearchMan.EmpCode)
        }
      }
    }

    if (this.chooseRadio == 2) {
      searchListEmpID = null
      if (this.SearchDeptID) {
        searchDeptID.push(this.SearchDeptID)
      }
    }

    if (this.SearchRoteID) {
      searchListRoteID.push(this.SearchRoteID)
    }
    if (this.blurStartDate()) {
    } else if (this.blurEndDate()) {
    } else if (void_DateDiff(this.searchDateB, this.searchDateE) > 365) {
      $("#id_ipt_startday_RoteSum").addClass("errorInput");
      $("#id_ipt_endday_RoteSum").addClass("errorInput");
      this.errorEndDate = { state: true, errorString: '起訖不得超過365天' };
      this.errorStartDate = { state: true, errorString: '起訖不得超過365天' };
    }
    else {

      var GetAttendSumRoteGetApi: GetAttendSumRoteGetApiClass = {
        "DateB": doFormatDate(this.searchDateB),
        "DateE": doFormatDate(this.searchDateE),
        "ListDeptID": searchDeptID,
        "ListEmpID": searchListEmpID,
        "ListRoteID": searchListRoteID
      }
      this.LoadingPage.show()
      this.GetApiDataServiceService.getWebApiData_GetAttendSumRote(GetAttendSumRoteGetApi)
        .pipe(takeWhile(() => this.api_subscribe))
        .subscribe(
          (x: GetAttendSumRoteGetApiDataClass[]) => {
            this.showSearchRote = x
            if (x) {
              if (x.length == 0) {
                this.showSerchNonBlock = true
              }
            }
            this.LoadingPage.hide()
          })
    }
  }
  SerchStartDateChange() {
    if (this.searchDateE > this.searchDateB) {

    } else {
      this.searchDateE = new Date(this.searchDateB)
    }
    this.blurStartDate()
  }
  blurStartDate() {
    if (!this.searchDateB) {
      this.errorStartDate = { state: true, errorString: '請填寫起始日期' };
      $("#id_ipt_startday_RoteSum").addClass("errorInput");
      return true
    } else {
      var StartDate = new Date(doFormatDate(this.searchDateB) + ' ' + '00:00')
      var EndDate = new Date(doFormatDate(this.searchDateE) + ' ' + '00:00')
      if (StartDate > EndDate) {
        this.errorStartDate = { state: true, errorString: '起始日不得大於結束日' };
        $("#id_ipt_startday_RoteSum").addClass("errorInput");
        return true
      } else if (void_DateDiff(this.searchDateB, this.searchDateE) > 365) {
        $("#id_ipt_startday_RoteSum").addClass("errorInput");
        $("#id_ipt_endday_RoteSum").addClass("errorInput");
        this.errorEndDate = { state: true, errorString: '起訖不得超過365天' };
        this.errorStartDate = { state: true, errorString: '起訖不得超過365天' };
      } else {
        this.errorEndDate = { state: false, errorString: '' };
        this.errorStartDate = { state: false, errorString: '' };
        $("#id_ipt_startday_RoteSum").removeClass("errorInput");
        $("#id_ipt_endday_RoteSum").removeClass("errorInput");
        var nowRadio = this.radiogroup.find((x)=>{
          return x.id == this.chooseRadio
        })
        this.changeRadio(nowRadio)
        return false
      }
    }

  }
  blurEndDate() {

    if (!this.searchDateE) {
      this.errorEndDate = { state: true, errorString: '請填寫結束日期' };
      $("#id_ipt_endday_RoteSum").addClass("errorInput");
      return true
    } else {
      var StartDate = new Date(doFormatDate(this.searchDateB) + ' ' + '00:00')
      var EndDate = new Date(doFormatDate(this.searchDateE) + ' ' + '00:00')
      if (StartDate > EndDate) {
        this.errorEndDate = { state: true, errorString: '起始日不得大於結束日' };
        $("#id_ipt_endday_RoteSum").addClass("errorInput");
        return true
      } else if (void_DateDiff(this.searchDateB, this.searchDateE) > 365) {
        $("#id_ipt_startday_RoteSum").addClass("errorInput");
        $("#id_ipt_endday_RoteSum").addClass("errorInput");
        this.errorEndDate = { state: true, errorString: '起訖不得超過365天' };
        this.errorStartDate = { state: true, errorString: '起訖不得超過365天' };
      } else {
        this.errorEndDate = { state: false, errorString: '' };
        this.errorStartDate = { state: false, errorString: '' };
        $("#id_ipt_startday_RoteSum").removeClass("errorInput");
        $("#id_ipt_endday_RoteSum").removeClass("errorInput");
        var nowRadio = this.radiogroup.find((x)=>{
          return x.id == this.chooseRadio
        })
        this.changeRadio(nowRadio)
        return false
      }
    }
  }



  chooseEmpdialog_ShowDialog: boolean = false
  bt_ShowDialog_chooseEmpdialog() {
    this.chooseEmpdialog_ShowDialog = true
    $('#chooseEmpdialogRoteSum').modal('show')
  }

  onSaveEmptoView(event) {
    // console.log(event)
    this.SearchMan.EmpCode = event.split('，')[0]
    this.SearchMan.EmpNameC = event.split('，')[1]
    if (event) {
      $('#chooseEmpdialogRoteSum').modal('hide');
    }
    // this.outPutEmpValue(this.SearchMan.EmpCode, this.SearchMan.EmpNameC, this.SearchMan.EmpNameC)
    this.blurEmpCode()
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
            this.errorLeavemanState = { state: false, errorString: '' }
            $("#leavejobid_RoteSum").removeClass("errorInput");

            this.NgxRoteSelectBox = []
            this.NgxDeptSelectBox = []
            var GetDeptGetApi: GetDeptGetApiClass = { "DeptID": 0, "EffectDate": "", "ChildDept": false }
            this.GetApiDataServiceService.getWebApiData_GetDept(GetDeptGetApi)
              .pipe(takeWhile(() => this.api_subscribe))
              .subscribe(
                (GetDeptData: GetDeptDataClass[]) => {
                  this.NgxDeptSelectBox = GetDeptData

                  for (let aa of this.NgxDeptSelectBox) {
                    var showParentName = ''
                    if (aa.ParentName) {
                      showParentName = aa.ParentName + ' / '
                    }
                    aa.uiShowDeptCodeAndName = showParentName + aa.DeptNameC
                  }
                  this.SearchDeptID = this.NgxDeptSelectBox[0].DeptID

                  var nowRadio = this.radiogroup.find((x)=>{
                    return x.id == this.chooseRadio
                  })
                  this.changeRadio(nowRadio)
                })
          }
        })
    } else {
      this.SearchMan.EmpNameC = ''
      this.errorLeavemanState = { state: true, errorString: '非同單位或無該部門的行政權限' }
      $("#leavejobid_RoteSum").addClass("errorInput");
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
          this.errorLeavemanState = { state: true, errorString: '非同單位或無該部門的行政權限' }
          $("#leavejobid_RoteSum").addClass("errorInput");
          this.LoadingPage.hide()
        }
        else if (x.length == 0) {
          // alert('工號輸入錯誤')
          this.SearchMan.EmpNameC = ''
          this.errorLeavemanState = { state: true, errorString: '非同單位或無該部門的行政權限' }
          $("#leavejobid_RoteSum").addClass("errorInput");
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
          this.errorLeavemanState = { state: false, errorString: '' }
          $("#leavejobid_RoteSum").removeClass("errorInput");
          this.LoadingPage.hide()
          var nowRadio = this.radiogroup.find((x)=>{
            return x.id == this.chooseRadio
          })
          this.changeRadio(nowRadio)
        }
      }, error => {
        this.LoadingPage.hide();
      });
  }


  close_chooseEmpdialogRoteSum() {
    $('#chooseEmpdialogRoteSum').modal('hide')
    $("body").addClass("modal-open");
  }

  selectDept(){
    var nowRadio = this.radiogroup.find((x)=>{
      return x.id == this.chooseRadio
    })
    this.changeRadio(nowRadio)
  }
  changeRadio(e: radiogroupClass) {
    var searchDeptID = []
    var searchListEmpID = []
    if (e.id == 1) {
      if (this.MyselfSearch) {
        searchListEmpID.push(this.setMan.EmpID)
        var GetAttendSumRoteGetApi: GetAttendSumRoteGetApiClass = {
          "DateB": doFormatDate(this.searchDateB),
          "DateE": doFormatDate(this.searchDateE),
          "ListDeptID": null,
          "ListEmpID": searchListEmpID,
          "ListRoteID": null
        }
        this.SetRoteDropdown(GetAttendSumRoteGetApi)
      } else if (this.PersonSearch) {
        if (this.SearchMan.EmpCode) {
          searchListEmpID.push(this.SearchMan.EmpCode)
        }
        var GetAttendSumRoteGetApi: GetAttendSumRoteGetApiClass = {
          "DateB": doFormatDate(this.searchDateB),
          "DateE": doFormatDate(this.searchDateE),
          "ListDeptID": null,
          "ListEmpID": searchListEmpID,
          "ListRoteID": null
        }
        this.SetRoteDropdown(GetAttendSumRoteGetApi)
      }
    } else if (e.id == 2) {
      if (this.SearchDeptID) {
        searchDeptID.push(this.SearchDeptID)
      }
      var GetAttendSumRoteGetApi: GetAttendSumRoteGetApiClass = {
        "DateB": doFormatDate(this.searchDateB),
        "DateE": doFormatDate(this.searchDateE),
        "ListDeptID": searchDeptID,
        "ListEmpID": null,
        "ListRoteID": null
      }
      this.SetRoteDropdown(GetAttendSumRoteGetApi)

    }
  }


  SetRoteDropdown(GetAttendSumRoteGetApi: GetAttendSumRoteGetApiClass) {

    this.LoadingPage.show()
    this.GetApiDataServiceService.getWebApiData_GetAttendSumRote(GetAttendSumRoteGetApi)
      .pipe(takeWhile(() => this.api_subscribe))
      .subscribe(
        (x: GetAttendSumRoteGetApiDataClass[]) => {
          this.NgxRoteSelectBox = []
          for (let data of x) {

            this.NgxRoteSelectBox.push({

              DeptCode: null,
              DeptName: null,
              RoteID: data.Rote.RoteID,
              RoteCode: data.Rote.RoteCode,
              RoteNameC: data.Rote.RoteNameC,
              OnDateTime: data.Rote.OnDateTime,
              OffDateTime: data.Rote.OffDateTime,
              OnTime: data.Rote.OnTime,
              OffTime: data.Rote.OffTime,
              WorkHours: data.Rote.WorkHours,
              DWorkHours: data.Rote.DWorkHours,
              OnTimeEarliest: data.Rote.OnTimeEarliest,
              OffTimeLatest: data.Rote.OffTimeLatest,
              OtBeginTime: data.Rote.OtBeginTime,
              YearRestHours: data.Rote.YearRestHours,
              LeaveOffTime: data.Rote.LeaveOffTime,
              FlexibleMinute: data.Rote.FlexibleMinute,
              FlexibleMinuteForward: data.Rote.FlexibleMinuteForward,
              FlexibleMinuteBehind: data.Rote.FlexibleMinuteBehind,
              LateMinute: data.Rote.LateMinute,
              WorkInterval: data.Rote.WorkInterval,
              IsCard: data.Rote.IsCard,
              IsShift: data.Rote.IsShift,
              IsDifferShift: data.Rote.IsDifferShift,
              Ride: data.Rote.Ride,
              Seq: data.Rote.Seq,
              Holiday: data.Rote.Holiday,
              RoteRest: data.Rote.RoteRest,
              RoteMapping: data.Rote.RoteMapping,
              uiShowRoteName: data.Rote.RoteNameC,
              OnTime_calCrossDay: null,
              OffTime_calCrossDay: null,
              uiWorkTime: null
            })
          }
          this.LoadingPage.hide()
        })

  }

}
class radiogroupClass {
  id: number;
  name: string;
}