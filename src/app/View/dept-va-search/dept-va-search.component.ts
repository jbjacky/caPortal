import { Component, OnInit, OnDestroy } from '@angular/core';
import { getapi_formatTimetoString, formatDateTime, doFormatDate } from 'src/app/UseVoid/void_doFormatDate';
import { NgxSpinnerService } from 'ngx-spinner';
import { GetApiDataServiceService } from 'src/app/Service/get-api-data-service.service';
import { GetApiUserService } from 'src/app/Service/get-api-user.service';
import { takeWhile } from 'rxjs/operators';
import { GetBaseInfoDetailClass } from 'src/app/Models/GetBaseInfoDetailClass';
import { ExampleHeader } from 'src/app/Service/datepickerHeader';
import { GetAbsDetailByListEmpIDGetApiClass } from 'src/app/Models/PostData_API_Class/GetAbsDetailByListEmpIDGetApiClass';
import { GetBaseByFormClass } from 'src/app/Models/PostData_API_Class/GetBaseByFormClass';
import { GetAbsDetailByDeptGetApiClass } from 'src/app/Models/PostData_API_Class/GetAbsDetailByDeptGetApiClass';
import { GetDeptDataClass } from 'src/app/Models/GetDeptDataClass';
declare let $: any; //use jquery

@Component({
  selector: 'app-dept-va-search',
  templateUrl: './dept-va-search.component.html',
  styleUrls: ['./dept-va-search.component.css']
})
export class DeptVaSearchComponent implements OnInit, OnDestroy {
  exampleHeader = ExampleHeader //日期套件header
  ngOnDestroy(): void {
    // throw new Error("Method not implemented.");
    this.api_subscribe = false;
  }
  api_subscribe = true; //ngOnDestroy時要取消訂閱api的subscribe

  radiogroup: any = [
    { id: 1, name: '查詢單位' },
    { id: 2, name: '查詢單一員工' }
  ];
  chooseRadio: number = 1;

  constructor(
    private GetApiUserService: GetApiUserService,
    private GetApiDataServiceService: GetApiDataServiceService,
    private LoadingPage: NgxSpinnerService, ) { }

  SearchMan: GetBaseInfoDetailClass = new GetBaseInfoDetailClass()
  SearchDeptID
  NgxDeptSelectBox: GetDeptDataClass[] = []
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
                    // this.SearchDeptID = this.NgxDeptSelectBox[0].DeptID
                    this.showAbsDetailByDept(this.SearchDeptID, doFormatDate(this.SearchStartDate_Dept), doFormatDate(this.SearchEndDate_Dept))

                  }else{
                      this.NgxDeptSelectBox.push(aa)
                      this.SearchDeptID = aa.DeptID
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
          this.AllAbsEmp = y

          for (let aa of this.AllAbsEmp) {
            aa['DateB'] = formatDateTime(aa.DateTimeB).getDate
            aa['TimeB'] = getapi_formatTimetoString(formatDateTime(aa.DateTimeB).getTime)
            aa['DateE'] = formatDateTime(aa.DateTimeE).getDate
            aa['TimeE'] = getapi_formatTimetoString(formatDateTime(aa.DateTimeE).getTime)
            // var setDay = 0
            // var setHour = 0
            // var setMin = 0
            //計算日時分

            aa["setDay"] = aa.UseDayHourMinute.Day
            aa["setHour"] = aa.UseDayHourMinute.Hour
            aa["setMin"] = aa.UseDayHourMinute.Minute
          }
          this.AllAbsEmp.sort((a, b) => {
            let left = Number(new Date(a.DateTimeB));
            let right = Number(new Date(b.DateTimeB));
            return left - right;
          })

          this.LoadingPage.hide()
        },
        error => {
          // alert('與api連線異常，getWebApiData_GetAbsDetailByDep')
          this.LoadingPage.hide()
        }
      )
  }
  bt_searchDept() {
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
          this.AllAbsEmp = y

          for (let aa of this.AllAbsEmp) {
            aa['DateB'] = formatDateTime(aa.DateTimeB).getDate
            aa['TimeB'] = getapi_formatTimetoString(formatDateTime(aa.DateTimeB).getTime)
            aa['DateE'] = formatDateTime(aa.DateTimeE).getDate
            aa['TimeE'] = getapi_formatTimetoString(formatDateTime(aa.DateTimeE).getTime)

            // var setDay = 0
            // var setHour = 0
            // var setMin = 0
            //計算日時分

            aa["setDay"] = aa.UseDayHourMinute.Day
            aa["setHour"] = aa.UseDayHourMinute.Hour
            aa["setMin"] = aa.UseDayHourMinute.Minute
          }

          this.AllAbsEmp.sort((a, b) => {
            let left = Number(new Date(a.DateTimeB));
            let right = Number(new Date(b.DateTimeB));
            return left - right;
          })
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
      if (this.Dept_ChangeEmp.EmpCode.length == 6) {
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
          this.GetApiDataServiceService.getWebApiData_GetBaseByFormNotDown(GetBaseByForm)
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
}


