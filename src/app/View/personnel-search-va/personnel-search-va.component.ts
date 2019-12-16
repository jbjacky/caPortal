import { Component, OnInit, OnDestroy, Output, EventEmitter, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { getapi_formatTimetoString, formatDateTime, doFormatDate } from 'src/app/UseVoid/void_doFormatDate';
import { NgxSpinnerService } from 'ngx-spinner';
import { GetApiDataServiceService } from 'src/app/Service/get-api-data-service.service';
import { GetApiUserService } from 'src/app/Service/get-api-user.service';
import { takeWhile, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { GetBaseInfoDetailClass } from 'src/app/Models/GetBaseInfoDetailClass';
import { ExampleHeader } from 'src/app/Service/datepickerHeader';
import { GetAbsDetailByListEmpIDGetApiClass } from 'src/app/Models/PostData_API_Class/GetAbsDetailByListEmpIDGetApiClass';
import { GetBaseByFormClass } from 'src/app/Models/PostData_API_Class/GetBaseByFormClass';
import { GetAbsDetailByDeptGetApiClass } from 'src/app/Models/PostData_API_Class/GetAbsDetailByDeptGetApiClass';
import { GetDeptDataClass } from 'src/app/Models/GetDeptDataClass';
import { DeptDetailClass } from 'src/app/Models/DeptDetailClass';
import { vaSearchFlowSignClass } from 'src/app/Models/vaSearchFlowSignClass';
import { void_completionTenNum } from 'src/app/UseVoid/void_CompletionTenNum';
import { NewVaSearchFlowSignClass } from 'src/app/Models/NewVaSearchFlowSignClass';
import { MatSort, MatTableDataSource, Sort } from '@angular/material';
import { fromEvent } from 'rxjs';
declare let $: any; //use jquery

@Component({
  selector: 'app-personnel-search-va',
  templateUrl: './personnel-search-va.component.html',
  styleUrls: ['./personnel-search-va.component.css']
})
export class PersonnelSearchVaComponent implements OnInit, OnDestroy, AfterViewInit {
  ngAfterViewInit(): void {
    fromEvent(this.filter.nativeElement, 'keyup').pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe((searchText: string) => {
      this.dataSource.filter = (this.filter.nativeElement as HTMLInputElement).value;
    });
  }
  exampleHeader = ExampleHeader //日期套件header
  ngOnDestroy(): void {
    // throw new Error("Method not implemented.");
    this.api_subscribe = false;
  }
  api_subscribe = true; //ngOnDestroy時要取消訂閱api的subscribe


  chooseRadio: number = 1;

  constructor(
    private GetApiUserService: GetApiUserService,
    private GetApiDataServiceService: GetApiDataServiceService,
    private LoadingPage: NgxSpinnerService, ) { }

  SearchMan: GetBaseInfoDetailClass = new GetBaseInfoDetailClass()
  SearchDeptID
  NgxDeptSelectBox: GetDeptDataClass[] = []
  @ViewChild('filter') filter: ElementRef;
  @ViewChild('sortTable') sortTable: MatSort;

  displayedColumns: string[] = ['uiEmpID', 'uiEmpName', 'HoliDayNameC', 'DateRange', 'setDay', 'setHour', 'setMin', 'StateText', 'uiShowFlowID'];
  dataSource = new MatTableDataSource<any>();
  ngOnInit() {
    this.GetApiUserService.counter$
      .pipe(takeWhile(() => this.api_subscribe))
      .subscribe(
        (x: any) => {
          if (x != 0) {
            this.SearchMan = x
            this.LoadingPage.show()
            this.GetApiDataServiceService.getWebApiData_GetDeptsByEmp(x.EmpCode)
              .pipe(takeWhile(() => this.api_subscribe))
              .subscribe(
                (GetDeptData: GetDeptDataClass[]) => {
                  var aa: GetDeptDataClass = new GetDeptDataClass()
                  aa.DeptID = parseInt(x.DeptID)
                  aa.uiShowDeptCodeAndName = x.DeptaName
                  var found = GetDeptData.find(function (element) {
                    return element.DeptID == aa.DeptID
                  });

                  if (GetDeptData.length > 0) {
                    this.NgxDeptSelectBox = GetDeptData
                    for (let data of this.NgxDeptSelectBox) {
                      data.uiShowDeptCodeAndName = data.DeptCode + ' ' + data.DeptNameC
                    }
                    // console.log(this.NgxDeptSelectBox)

                    if (!found) {
                      this.NgxDeptSelectBox.push(aa)
                    }
                    this.SearchDeptID = aa.DeptID
                    this.chooseDeptName = aa.uiShowDeptCodeAndName;
                    // this.SearchDeptID = this.NgxDeptSelectBox[0].DeptID
                    this.showAbsDetailByDept(this.SearchDeptID, doFormatDate(this.SearchStartDate_Dept), doFormatDate(this.SearchEndDate_Dept))

                  } else {
                    this.NgxDeptSelectBox.push(aa)
                    this.SearchDeptID = aa.DeptID
                    this.chooseDeptName = aa.uiShowDeptCodeAndName;
                    this.showAbsDetailByDept(this.SearchDeptID, doFormatDate(this.SearchStartDate_Dept), doFormatDate(this.SearchEndDate_Dept))
                  }
                  this.LoadingPage.hide()
                }, error => {

                  this.LoadingPage.hide()
                }
              )
          }
        }
      )

  }
  AllAbsEmp = []
  showAbsDetailByDept(SearchDeptID: string, SearchStartDate, SearchEndDate) {

    var GetAbsDetailByDept: GetAbsDetailByDeptGetApiClass = {
      DateB: SearchStartDate,
      DateE: SearchEndDate,
      DeptID: SearchDeptID
    }
    this.LoadingPage.show()
    this.GetApiDataServiceService.getWebApiData_GetAbsDetailByDeptHide(GetAbsDetailByDept)
      .pipe(takeWhile(() => this.api_subscribe))
      .subscribe(
        (y: Array<any>) => {
          this.showVaDataDetail = false
          this.AllAbsEmp = y
          // console.log(this.AllAbsEmp)
          for (let aa of this.AllAbsEmp) {
            aa['uiEmpID'] = aa.Base.EmpID
            aa['uiEmpName'] = aa.Base.EmpNameC

            aa['DateB'] = formatDateTime(aa.DateTimeB).getDate
            aa['TimeB'] = getapi_formatTimetoString(formatDateTime(aa.DateTimeB).getTime)
            aa['DateE'] = formatDateTime(aa.DateTimeE).getDate
            aa['TimeE'] = getapi_formatTimetoString(formatDateTime(aa.DateTimeE).getTime)
            aa['DateRange'] = formatDateTime(aa.DateTimeB).getDate + ' ' +
              getapi_formatTimetoString(formatDateTime(aa.DateTimeB).getTime) +
              ' - ' + formatDateTime(aa.DateTimeE).getDate + ' ' +
              getapi_formatTimetoString(formatDateTime(aa.DateTimeE).getTime)
            // var setDay = 0
            // var setHour = 0
            // var setMin = 0
            //計算日時分

            aa["setDay"] = aa.UseDayHourMinute.Day
            aa["setHour"] = aa.UseDayHourMinute.Hour
            aa["setMin"] = aa.UseDayHourMinute.Minute
            aa["uiShowFlowID"] = {
              ProcessFlowID: aa.ProcessFlowID,
              uiShowProcessFlowID: void_completionTenNum(aa.ProcessFlowID),
              uiShowAbsID: aa.AbsID
            }
            var valText = ''
            if (aa.State == '1') {
              valText = '呈核中'
            } else if (aa.State == '2') {
              valText = '重擬'
            } else if (aa.State == '3') {
              valText = '已核准'
            } else if (aa.State == '6') {
              valText = '預排中'
            } else if (aa.State == '7') {
              valText = '已抽單'
            } else if (aa.State == '8') {
              valText = '已異動'
            }
            aa["StateText"] = valText

          }
          // console.log(this.AllAbsEmp)
          this.AllAbsEmp.sort((a, b) => {
            let left = Number(new Date(a.DateTimeB));
            let right = Number(new Date(b.DateTimeB));
            return left - right;
          })

          this.dataSource.data = this.AllAbsEmp;
          this.dataSource.sort = this.sortTable;
          this.LoadingPage.hide()
        },
        error => {
          // alert('與api連線異常，getWebApiData_GetAbsDetailByDep')
          this.LoadingPage.hide()
        }
      )
  }
  bt_searchDept() {
    //部門查詢
    if (!this.SearchDeptID) {

    }
    else if (this.blurStartDate_Dept()) {

    }
    else if (this.blurEndDate_Dept()) {

    } else {
      this.showAbsDetailByDept(this.SearchDeptID, doFormatDate(this.SearchStartDate_Dept), doFormatDate(this.SearchEndDate_Dept))
    }

  }
  Dept_ChangeEmp = { EmpCode: '', EmpName: '' }

  bt_search() {
    //員工號查詢
    if (!this.Dept_ChangeEmp.EmpCode) {

      this.Dept_errorChangeEmpState = { state: true, errorString: '非同單位或無該部門的行政權限' }
      this.Dept_ChangeEmp.EmpName = ''
      $("#Dept_ChangeEmpCode").addClass("errorInput");
    }
    else if (this.Dept_errorChangeEmpState.state) {

    } else if (this.blurStartDate_OneEmp()) {

    } else if (this.blurEndDate_OneEmp()) {
    }
    else {

      this.showAbsDetailByEmp(this.Dept_ChangeEmp.EmpCode, doFormatDate(this.OneEmp_SearchStartDate), doFormatDate(this.OneEmp_SearchEndDate))
    }
  }


  showAbsDetailByEmp(seachCode: string, SearchStartDate, SearchEndDate) {

    var GetAbsDetailByListEmpIDGetApi: GetAbsDetailByListEmpIDGetApiClass = {
      "DateB": SearchStartDate,
      "DateE": SearchEndDate,
      "ListEmpID": [seachCode]
    }
    this.LoadingPage.show()
    this.GetApiDataServiceService.getWebApiData_GetAbsDetailByListEmpIDHide(GetAbsDetailByListEmpIDGetApi)
      .pipe(takeWhile(() => this.api_subscribe))
      .subscribe(
        (y: Array<any>) => {
          this.showVaDataDetail = false
          this.AllAbsEmp = y

          for (let aa of this.AllAbsEmp) {
            aa['uiEmpID'] = aa.Base.EmpID
            aa['uiEmpName'] = aa.Base.EmpNameC

            aa['DateB'] = formatDateTime(aa.DateTimeB).getDate
            aa['TimeB'] = getapi_formatTimetoString(formatDateTime(aa.DateTimeB).getTime)
            aa['DateE'] = formatDateTime(aa.DateTimeE).getDate
            aa['TimeE'] = getapi_formatTimetoString(formatDateTime(aa.DateTimeE).getTime)
            aa['DateRange'] = formatDateTime(aa.DateTimeB).getDate + ' ' +
              getapi_formatTimetoString(formatDateTime(aa.DateTimeB).getTime) +
              ' - ' + formatDateTime(aa.DateTimeE).getDate + ' ' +
              getapi_formatTimetoString(formatDateTime(aa.DateTimeE).getTime)
            // var setDay = 0
            // var setHour = 0
            // var setMin = 0
            //計算日時分

            aa["setDay"] = aa.UseDayHourMinute.Day
            aa["setHour"] = aa.UseDayHourMinute.Hour
            aa["setMin"] = aa.UseDayHourMinute.Minute

            aa["uiShowFlowID"] = {
              ProcessFlowID: aa.ProcessFlowID,
              uiShowProcessFlowID: void_completionTenNum(aa.ProcessFlowID),
              uiShowAbsID: aa.AbsID
            }
            var valText = ''
            if (aa.State == '1') {
              valText = '呈核中'
            } else if (aa.State == '2') {
              valText = '重擬'
            } else if (aa.State == '3') {
              valText = '已核准'
            } else if (aa.State == '6') {
              valText = '預排中'
            } else if (aa.State == '7') {
              valText = '已抽單'
            } else if (aa.State == '8') {
              valText = '已異動'
            }
            aa["StateText"] = valText
          }

          this.AllAbsEmp.sort((a, b) => {
            let left = Number(new Date(a.DateTimeB));
            let right = Number(new Date(b.DateTimeB));
            return left - right;
          })
          this.dataSource.data = this.AllAbsEmp;
          this.dataSource.sort = this.sortTable;
          this.LoadingPage.hide()
        },
        error => {
          // alert('與api連線異常，getWebApiData_GetAbsDetailByDep')
          this.LoadingPage.hide()
        }
      )
  }

  Dept_errorChangeEmpState = { state: false, errorString: '' }

  Dept_onSaveChangeEmptoView(event) {

    this.Dept_ChangeEmp.EmpCode = event.split('，')[0]
    this.Dept_ChangeEmp.EmpName = event.split('，')[1]

    this.Dept_blurChangeEmpCode()
    if (event) {
      $('#Dept_chooseChnageEmpdialog').modal('hide');
    }

  }

  Dept_blurChangeEmpCode() {
    if (this.Dept_ChangeEmp.EmpCode) {
      if (this.Dept_ChangeEmp.EmpCode.length == 7) {
        if (this.Dept_ChangeEmp.EmpCode == this.SearchMan.EmpCode) {
          this.Dept_ChangeEmp.EmpName = this.SearchMan.EmpNameC.toString()
          this.Dept_errorChangeEmpState = { state: false, errorString: '' }
          $("#Dept_ChangeEmpCode").removeClass("errorInput");
        } else {
          var _NowDate = new Date();
          var _NowToday = doFormatDate(_NowDate);
          var GetBaseByForm: GetBaseByFormClass = {
            EmpCode: this.SearchMan.EmpCode,
            AppEmpCode: this.Dept_ChangeEmp.EmpCode,
            EffectDate: _NowToday
          }
          this.LoadingPage.show()
          this.GetApiDataServiceService.getWebApiData_GetBaseByFormDeptDown(GetBaseByForm)
            .pipe(takeWhile(() => this.api_subscribe))
            .subscribe((x: any) => {

              if (x == null) {
                // alert('工號輸入錯誤')
                this.Assistant(GetBaseByForm)
              } else if (x.length == 0) {
                // alert('工號輸入錯誤')
                this.Assistant(GetBaseByForm)
              } else {
                // alert('工號正確')
                this.Dept_ChangeEmp.EmpName = x[0].EmpNameC
                this.Dept_errorChangeEmpState = { state: false, errorString: '' }
                if (x[0].EmpNameC == null) {
                  this.Dept_ChangeEmp.EmpName = x[0].EmpNameE
                } else {
                  if (x[0].EmpNameC.length == 0) {
                    this.Dept_ChangeEmp.EmpName = x[0].EmpNameE
                  } else {
                    this.Dept_ChangeEmp.EmpName = x[0].EmpNameC
                  }
                }
                $("#Dept_ChangeEmpCode").removeClass("errorInput");
                this.LoadingPage.hide()
              }
            }
              , error => {
                this.LoadingPage.hide()
                // alert('與api連線異常，getWebApiData_GetBaseByForm')
              })
        }


      } else if (this.Dept_ChangeEmp.EmpCode.length > 0) {
        // alert('工號輸入錯誤')
        this.Dept_errorChangeEmpState = { state: true, errorString: '非同單位或無該部門的行政權限' }
        this.Dept_ChangeEmp.EmpName = ''
        $("#Dept_ChangeEmpCode").addClass("errorInput");
      } else {
        this.Dept_errorChangeEmpState = { state: false, errorString: '' }
        this.Dept_ChangeEmp.EmpName = ''
        $("#Dept_ChangeEmpCode").removeClass("errorInput");
      }
    } else {
      this.Dept_ChangeEmp.EmpName = ''
      this.Dept_errorChangeEmpState = { state: false, errorString: '' }
      $("#Dept_ChangeEmpCode").removeClass("errorInput");
    }
  }


  private Assistant(GetBaseByForm: GetBaseByFormClass) {
    //行政權限
    this.GetApiDataServiceService.getWebApiData_GetBaseByFormStaff(GetBaseByForm)
      .pipe(takeWhile(() => this.api_subscribe))
      .subscribe((x: any) => {
        if (x == null) {
          // alert('工號輸入錯誤')
          this.Dept_errorChangeEmpState = { state: true, errorString: '非同單位或無該部門的行政權限' }
          this.Dept_ChangeEmp.EmpName = ''
          $("#Dept_ChangeEmpCode").addClass("errorInput");
          this.LoadingPage.hide()
        }
        else if (x.length == 0) {
          // alert('工號輸入錯誤')
          this.Dept_errorChangeEmpState = { state: true, errorString: '非同單位或無該部門的行政權限' }
          this.Dept_ChangeEmp.EmpName = ''
          $("#Dept_ChangeEmpCode").addClass("errorInput");
          this.LoadingPage.hide()
        }
        else {
          // alert('工號正確')
          this.Dept_ChangeEmp.EmpName = x[0].EmpNameC
          this.Dept_errorChangeEmpState = { state: false, errorString: '' }
          if (x[0].EmpNameC == null) {
            this.Dept_ChangeEmp.EmpName = x[0].EmpNameE
          } else {
            if (x[0].EmpNameC.length == 0) {
              this.Dept_ChangeEmp.EmpName = x[0].EmpNameE
            } else {
              this.Dept_ChangeEmp.EmpName = x[0].EmpNameC
            }
          }
          $("#Dept_ChangeEmpCode").removeClass("errorInput");
          this.LoadingPage.hide()
        }
      }, error => {
        this.LoadingPage.hide();
      });
  }


  SearchStartDate_Dept: Date = new Date()
  SearchEndDate_Dept: Date = new Date()

  Dept_errorStartDateState = { state: false, errorString: '' }
  Dept_errorEndtDateState = { state: false, errorString: '' }
  SerchStartDateChange_My() {
    if (this.SearchEndDate_Dept > this.SearchStartDate_Dept) {

    } else {
      this.SearchEndDate_Dept = new Date(this.SearchStartDate_Dept)
    }
    this.blurStartDate_Dept()
  }
  blurStartDate_Dept(): boolean {
    //true 有錯
    if (!this.SearchStartDate_Dept) {
      this.Dept_errorStartDateState = { state: true, errorString: '請輸入起始日期' }
      $("#Dept_StartDate").addClass("errorInput");
      return true
    } else {
      var calDateB = new Date(doFormatDate(this.SearchStartDate_Dept) + ' ' + '00:00')
      var calDateE = new Date(doFormatDate(this.SearchEndDate_Dept) + ' ' + '00:00')
      if (calDateB > calDateE) {
        this.Dept_errorStartDateState = { state: true, errorString: '起始日不得大於結束日' }
        $("#Dept_StartDate").addClass("errorInput");
        return true
      } else {
        this.Dept_errorStartDateState = { state: false, errorString: '' }
        $("#Dept_StartDate").removeClass("errorInput");
        this.Dept_errorEndtDateState = { state: false, errorString: '' }
        $("#Dept_EndDate").removeClass("errorInput");
      }
    }

    return false
  }
  blurEndDate_Dept(): boolean {
    //true 有錯
    if (!this.SearchEndDate_Dept) {
      this.Dept_errorEndtDateState = { state: true, errorString: '請輸入結束日期' }
      $("#Dept_EndDate").addClass("errorInput");
      return true
    } else {
      var calDateB = new Date(doFormatDate(this.SearchStartDate_Dept) + ' ' + '00:00')
      var calDateE = new Date(doFormatDate(this.SearchEndDate_Dept) + ' ' + '00:00')
      if (calDateB > calDateE) {
        this.Dept_errorEndtDateState = { state: true, errorString: '起始日不得大於結束日' }
        $("#Dept_EndDate").addClass("errorInput");
        return true
      } else {
        this.Dept_errorStartDateState = { state: false, errorString: '' }
        $("#Dept_StartDate").removeClass("errorInput");
        this.Dept_errorEndtDateState = { state: false, errorString: '' }
        $("#Dept_EndDate").removeClass("errorInput");
      }
    }
    return false
  }


  OneEmp_SearchStartDate: Date = new Date()
  OneEmp_SearchEndDate: Date = new Date()
  OneEmp_errorStartDateState = { state: false, errorString: '' }
  OneEmp_errorEndtDateState = { state: false, errorString: '' }
  SerchStartDateChange_OneEmp() {
    if (this.OneEmp_SearchEndDate > this.OneEmp_SearchStartDate) {

    } else {
      this.OneEmp_SearchEndDate = new Date(this.OneEmp_SearchStartDate)
    }
    this.blurStartDate_OneEmp()
  }
  blurStartDate_OneEmp(): boolean {
    //true 有錯
    if (!this.OneEmp_SearchStartDate) {
      this.OneEmp_errorStartDateState = { state: true, errorString: '請輸入起始日期' }
      $("#OneEmp_StartDate").addClass("errorInput");
      return true
    } else {
      var calDateB = new Date(doFormatDate(this.OneEmp_SearchStartDate) + ' ' + '00:00')
      var calDateE = new Date(doFormatDate(this.OneEmp_SearchEndDate) + ' ' + '00:00')
      if (calDateB > calDateE) {
        this.OneEmp_errorStartDateState = { state: true, errorString: '起始日不得大於結束日' }
        $("#OneEmp_StartDate").addClass("errorInput");
        return true
      } else {
        this.OneEmp_errorStartDateState = { state: false, errorString: '' }
        $("#OneEmp_StartDate").removeClass("errorInput");
        this.OneEmp_errorEndtDateState = { state: false, errorString: '' }
        $("#OneEmp_EndDate").removeClass("errorInput");
      }
    }

    return false
  }
  blurEndDate_OneEmp(): boolean {
    //true 有錯
    if (!this.OneEmp_SearchStartDate) {
      this.OneEmp_errorEndtDateState = { state: true, errorString: '請輸入結束日期' }
      $("#OneEmp_EndDate").addClass("errorInput");
      return true
    } else {
      var calDateB = new Date(doFormatDate(this.OneEmp_SearchStartDate) + ' ' + '00:00')
      var calDateE = new Date(doFormatDate(this.OneEmp_SearchEndDate) + ' ' + '00:00')
      if (calDateB > calDateE) {
        this.OneEmp_errorEndtDateState = { state: true, errorString: '起始日不得大於結束日' }
        $("#OneEmp_EndDate").addClass("errorInput");
        return true
      } else {
        this.OneEmp_errorStartDateState = { state: false, errorString: '' }
        $("#OneEmp_StartDate").removeClass("errorInput");
        this.OneEmp_errorEndtDateState = { state: false, errorString: '' }
        $("#OneEmp_EndDate").removeClass("errorInput");
      }
    }
    return false
  }


  chooseDeptName = '';
  chooseDeptdialog_ShowDialog: boolean = false
  bt_ShowDialog_chooseDeptdialog() {
    this.chooseDeptdialog_ShowDialog = true
    $('#chooseDeptdialog').modal('show')
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

    this.SearchDeptID = DeptaID;
    this.chooseDeptName = DeptName;
    // this.chooseDeptBase = BaseArray;

  }


  @Output() gotoShowFormPlace: EventEmitter<number> = new EventEmitter<number>();
  setToNextVaDataTitle: NewVaSearchFlowSignClass //給明細用的title資料
  showVaDataDetail: boolean = false  // 顯示明細
  setVaProFIDDetail(oneDetail: any) {
    this.gotoShowFormPlace.emit();

    this.showVaDataDetail = true
    this.setToNextVaDataTitle = new NewVaSearchFlowSignClass()
    this.setToNextVaDataTitle.ProcessFlowID = oneDetail.ProcessFlowID


  }
  setVaKeyDetail(oneDetail: any) {
    this.gotoShowFormPlace.emit();

    this.showVaDataDetail = true
    this.setToNextVaDataTitle = new NewVaSearchFlowSignClass()
    this.setToNextVaDataTitle.ProcessFlowID = 0
    this.setToNextVaDataTitle.key = oneDetail.AbsID


  }
  onGoBackFunction() {
    this.showVaDataDetail = false
    this.gotoShowFormPlace.emit();
    // window.scroll(0, 0);
    //回列表
  }



  changeSort(sortInfo: Sort) {
    if (sortInfo.active == 'uiShowFlowID') {
      if (sortInfo.direction == 'asc') {
        this.AllAbsEmp.sort((a, b) => {
          return a.AbsID - b.AbsID
        })
      } else if (sortInfo.direction == 'desc') {
        this.AllAbsEmp.sort((a, b) => {
          return b.AbsID - a.AbsID
        })

      } else if (sortInfo.direction == '') {

      }
      this.dataSource.data = this.AllAbsEmp;
    }
  }
}


