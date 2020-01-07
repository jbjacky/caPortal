import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { GetApiDataServiceService } from 'src/app/Service/get-api-data-service.service';
import { chinesenum } from 'src/app/UseVoid/void_chinesenumber'
import { doFormatDate, timeZone_tw, formatDateTime } from 'src/app/UseVoid/void_doFormatDate';
import { BehaviorSubject, Observable } from 'rxjs';
import { Attendance } from 'src/app/Models/Attendance';
import { GetApiUserService } from 'src/app/Service/get-api-user.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { takeWhile } from 'rxjs/operators';
import { ExampleHeader } from 'src/app/Service/datepickerHeader';
import { GetBaseByFormClass } from 'src/app/Models/PostData_API_Class/GetBaseByFormClass';
import { GetDeptaByEmpClass, GetDeptaByEmpTTClass } from 'src/app/Models/PostData_API_Class/GetDeptaByEmpClass';
import { GetBaseByAuthByEmpIDgetDeptInfoGetApiClass } from 'src/app/Models/PostData_API_Class/GetBaseByAuthByEmpIDgetDeptInfoGetApiClass';
import { GetBaseByAuthByEmpIDDataClass } from 'src/app/Models/GetBaseByAuthByEmpIDDataClass';
import { GetDeptaByEmpDataClass, Base } from 'src/app/Models/GetDeptaByEmpDataClass';
import { DeptDetailClass } from 'src/app/Models/DeptDetailClass';
import { GetAttendInfoByDeptGetApiClass } from 'src/app/Models/PostData_API_Class/GetAttendInfoByDeptGetApiClass';
import { void_MonthDiff } from 'src/app/UseVoid/void_DateDiff';

declare let $: any; //use jquery

@Component({
  selector: 'app-personnel-search-card-time',
  templateUrl: './personnel-search-card-time.component.html',
  styleUrls: ['./personnel-search-card-time.component.css']
})
export class PersonnelSearchCardTimeComponent implements OnInit, OnDestroy {
  exampleHeader = ExampleHeader //日期套件header

  ngOnDestroy(): void {
    this.api_subscribe = false;
  }
  api_subscribe = true;

  EmpBase = { EmpCode: '', Name: '' };//被查詢人
  SearhMan = { EmpCode: '', Name: '' }; //查詢人
  errorLeavemanState = { state: false, errorString: '' }


  chooseDeptaID = 0;
  chooseDeptName = '';
  chooseDeptBase = [];
  downDept: boolean = false //即期向下

  chooseRadio: number = 1;


  errorStartDateState = { state: false, errorString: '' }
  errorEndtDateState = { state: false, errorString: '' }

  constructor(private GetApiUserService: GetApiUserService,
    private GetApiDataServiceService: GetApiDataServiceService,
    private LoadingPage: NgxSpinnerService) { }
  dateB = new Date()
  dateE = new Date()

  searchPageCurrent: number = 1 //查詢第幾頁
  searchPageRows: number = 100 //一頁有幾筆
  ngOnInit() {
    this.GetApiUserService.counter$.subscribe(
      (x: any) => {
        if (x == 0) {

        } else {
          this.SearhMan.EmpCode = x.EmpCode
          if (x.EmpNameC) {
            this.SearhMan.Name = x.EmpNameC;
          } else {
            this.SearhMan.Name = x.EmpNameE;
          }

          this.firstGetDeptData(this.SearhMan.EmpCode)
        }
      })

    this.dateB.setDate(this.dateB.getDate() - 7)
    this.dateE.setDate(this.dateE.getDate())

  }

  blurEmpCode() {
    if (this.EmpBase.EmpCode.length == 7) {
      var _NowDate = new Date();
      var _NowToday = doFormatDate(_NowDate);
      var GetBaseByFormClass: GetBaseByFormClass = {
        EmpCode: this.SearhMan.EmpCode,
        AppEmpCode: this.EmpBase.EmpCode,
        EffectDate: _NowToday
      }
      this.LoadingPage.show()
      this.GetApiDataServiceService.getWebApiData_GetBaseByFormDeptDown(GetBaseByFormClass)
        .pipe(takeWhile(() => this.api_subscribe))
        .subscribe((x: any) => {
          if (x == null) {
            // alert('工號輸入錯誤')
            this.Assistant(GetBaseByFormClass)
          } else if (x.length == 0) {
            // alert('工號輸入錯誤')this.EmpBase.Name = ''
            this.Assistant(GetBaseByFormClass)
          } else {
            // alert('工號正確')
            if (x[0].EmpNameC == null) {
              this.EmpBase.Name = x[0].EmpNameE
            } else if (x[0].EmpNameC.length == 0) {
              this.EmpBase.Name = x[0].EmpNameE
            } else {
              this.EmpBase.Name = x[0].EmpNameC
            }
            this.errorLeavemanState = { state: false, errorString: '' }
            $("#leavejobid").removeClass("errorInput");
          }

          this.LoadingPage.hide()
        }, error => {
          this.LoadingPage.hide()
        })
    } else {
      this.EmpBase.Name = ''
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
          this.EmpBase.Name = ''
          this.errorLeavemanState = { state: true, errorString: '非同單位或無該部門的行政權限' }
          $("#leavejobid").addClass("errorInput");
        }
        else if (x.length == 0) {
          // alert('工號輸入錯誤')
          this.EmpBase.Name = ''
          this.errorLeavemanState = { state: true, errorString: '非同單位或無該部門的行政權限' }
          $("#leavejobid").addClass("errorInput");
        }
        else {
          // alert('工號正確')
          if (x[0].EmpNameC == null) {
            this.EmpBase.Name = x[0].EmpNameE
          } else if (x[0].EmpNameC.length == 0) {
            this.EmpBase.Name = x[0].EmpNameE
          } else {
            this.EmpBase.Name = x[0].EmpNameC
          }
          this.errorLeavemanState = { state: false, errorString: '' }
          $("#leavejobid").removeClass("errorInput");
        }
      }, error => {
        this.LoadingPage.hide();
      });
  }


  SerchStartDateChange_OneEmp() {
    if (this.dateE > this.dateB) {

    } else {
      this.dateE = new Date(this.dateB)
    }
    this.blurStartDate()
  }
  blurStartDate() {
    var today = new Date()
    today.setHours(0, 0, 0)
    today.setMinutes(0, 0, 0)
    today.setSeconds(0, 0)

    this.dateB.setHours(0, 0, 0)
    this.dateB.setMinutes(0, 0, 0)
    this.dateB.setSeconds(0, 0)

    this.dateE.setHours(0, 0, 0)
    this.dateE.setMinutes(0, 0, 0)
    this.dateE.setSeconds(0, 0)

    if (!($("#id_ipt_startday").val())) {
      $("#id_ipt_startday").addClass("errorInput");
      this.errorStartDateState = { state: true, errorString: '請填寫起始日期' }
      return true
    } else {
      var startdate = this.dateB
      var enddate = this.dateE

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
    var today = new Date()
    today.setHours(0, 0, 0)
    today.setMinutes(0, 0, 0)
    today.setSeconds(0, 0)

    this.dateB.setHours(0, 0, 0)
    this.dateB.setMinutes(0, 0, 0)
    this.dateB.setSeconds(0, 0)

    this.dateE.setHours(0, 0, 0)
    this.dateE.setMinutes(0, 0, 0)
    this.dateE.setSeconds(0, 0)

    if (!($("#id_ipt_endday").val())) {
      $("#id_ipt_endday").addClass("errorInput");
      this.errorEndtDateState = { state: true, errorString: '請填寫結束日期' }
      return true
    } else {
      var startdate = this.dateB
      var enddate = this.dateE

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
  onSearchClick() {


    var today = new Date()
    today.setHours(0, 0, 0)
    today.setMinutes(0, 0, 0)
    today.setSeconds(0, 0)

    this.dateE.setHours(0, 0, 0)
    this.dateE.setMinutes(0, 0, 0)
    this.dateE.setSeconds(0, 0)

    var searchDateB: Date = new Date(this.dateB.toString())
    var searchDateE: Date = new Date(this.dateE.toString())

    if (this.dateE > today) {
      $("#id_ipt_endday").addClass("errorInput");
      this.errorEndtDateState = { state: true, errorString: '結束日不得大於今天' }
    } else if (this.blurStartDate() || this.blurEndDate()) {

    } else if (void_MonthDiff(searchDateB, searchDateE) > 3) {
      alert('查詢起訖區間"月份"不得超過三個月')
    } else {
      var ipt_ListEmpID = [this.EmpBase.EmpCode]
      var ipt_DateB = $("#id_ipt_startday").val()
      var ipt_DateE = $("#id_ipt_endday").val()
      var setDisplay
      var checkListState = []

      if (this.EmpBase.EmpCode.length > 0 && this.errorLeavemanState.state == false) {

      }
    }
  }


  onSearchDeptClick() {

    var searchDateB: Date = new Date(this.dateB.toString())
    var searchDateE: Date = new Date(this.dateE.toString())

    if (this.blurStartDate() || this.blurEndDate()) {

    } else if (void_MonthDiff(searchDateB, searchDateE) > 3) {
      alert('查詢起訖區間"月份"不得超過三個月')
    } else {
      var ipt_DateB = $("#id_ipt_startday").val()
      var ipt_DateE = $("#id_ipt_endday").val()
      var setDisplay
      var checkListState = []

      var _NowDate = new Date();
      var _NowToday = doFormatDate(_NowDate);


      this.searchPageCurrent = 1
      if (this.chooseDeptaID == null) {
        alert('請選擇查詢部門')
      } else {

      }
    }
  }
  onSaveEmptoView(event) {
    // console.log(event)
    this.EmpBase.EmpCode = event.split('，')[0]
    this.EmpBase.Name = event.split('，')[1]
    if (event) {
      $('#chooseEmpdialog').modal('hide');
    }
    this.blurEmpCode()
  }

  firstGetDeptData(searchEmpCode) {

    var _NowDate = new Date();
    var _NowToday = doFormatDate(_NowDate);

    var GetDeptaByEmpClass: GetDeptaByEmpTTClass = {
      EmpCode: searchEmpCode,
      DeptID: "",
      Level: 2,
      DeptNameKey: '',
      EmpCodeOrNameKey: '',
      EffectDate: _NowToday,
      IsTop: false,
      IsShift: false
    }

    var GetBaseByAuthByEmpIDgetDeptInfoGetApi: GetBaseByAuthByEmpIDgetDeptInfoGetApiClass =
    {
      "EmpID": searchEmpCode,
      "EffectDate": _NowToday
    }
    this.GetApiDataServiceService.getWebApiData_GetBaseByAuthByEmpIDgetDeptInfo(GetBaseByAuthByEmpIDgetDeptInfoGetApi)
      .pipe(takeWhile(() => this.api_subscribe))
      .subscribe(
        (GetBaseByAuthByEmpIDData: GetBaseByAuthByEmpIDDataClass) => {
          this.GetApiDataServiceService.getWebApiData_GetDeptaByEmp(GetDeptaByEmpClass)
            .subscribe((x: GetDeptaByEmpDataClass[]) => {
              if (x.length > 0) {
                if (x[0]) {
                  if (GetBaseByAuthByEmpIDData.IsAdmin) {
                    var dept: DeptDetailClass = {
                      ParentID: x[0].Dept[0].ParentID,
                      ParentDeptNameC: '',
                      DeptID: x[0].Dept[0].DeptID,
                      DeptNameC: x[0].Dept[0].DeptNameC,
                      BaseArray: x[0].Dept[0].Base,
                      isSearchClick: null
                    }
                    this.onSaveDeptatoView(dept)
                  } else {
                    if (GetBaseByAuthByEmpIDData.Dept) {
                      var Index = GetBaseByAuthByEmpIDData.Dept.findIndex((y) => {
                        return y.DeptID == x[0].Dept[0].DeptID
                      })
                      if (Index < 0) {
                        return ''
                      } else {
                        var dept: DeptDetailClass = {
                          ParentID: x[0].Dept[0].ParentID,
                          ParentDeptNameC: '',
                          DeptID: x[0].Dept[0].DeptID,
                          DeptNameC: x[0].Dept[0].DeptNameC,
                          BaseArray: x[0].Dept[0].Base,
                          isSearchClick: null
                        }
                        this.onSaveDeptatoView(dept)
                      }
                    }
                  }
                }
              } else {
              }
            }, error => {

            })
        })
  }

  onSaveDeptatoView(event: DeptDetailClass) {
    //簽核部門
    // console.log(event)
    var DeptaID = event.DeptID
    var DeptName = event.DeptNameC;
    var BaseArray: string[] = [];
    if (event.BaseArray) {
      for (let base of event.BaseArray) {
        BaseArray.push(base.EmpCode)
      }
    }

    this.chooseDeptaID = DeptaID;
    this.chooseDeptName = DeptName;
    this.chooseDeptBase = BaseArray;

  }
  onSaveDepttoView_KeyDept(event: DeptDetailClass) {
    // 編制部門
    var DeptaID = event.DeptID
    var DeptName = event.DeptNameC;
    var BaseArray: string[] = [];
    if (event.BaseArray) {
      for (let base of event.BaseArray) {
        BaseArray.push(base.EmpCode)
      }
    }

    this.chooseDeptaID = DeptaID;
    this.chooseDeptName = DeptName;
    this.chooseDeptBase = BaseArray;

  }


  chooseEmpdialog_ShowDialog: boolean = false
  bt_ShowDialog_chooseEmpdialog() {
    this.chooseEmpdialog_ShowDialog = true
    $('#chooseEmpdialog').modal('show')
  }

  chooseDeptdialog_ShowDialog: boolean = false
  bt_ShowDialog_chooseDeptdialog() {
    this.chooseDeptdialog_ShowDialog = true
    $('#chooseDeptdialog').modal('show')
  }

  canLoadState: boolean = true
  LoadNextDeptAttendData() {
    if (this.blurStartDate() || this.blurEndDate()) {

    } else {
      if (this.canLoadState) {
      }

    }
  }

}

