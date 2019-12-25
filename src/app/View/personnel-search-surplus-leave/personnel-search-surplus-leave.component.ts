import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { GetApiDataServiceService } from 'src/app/Service/get-api-data-service.service';
import { GetHoliDayBalanceFlow } from 'src/app/Models/PostData_API_Class/GetHoliDayBalanceFlow';
import { takeWhile } from 'rxjs/operators';
import { HoliDayBalanceFlow } from 'src/app/Models/HoliDayBalanceFlow';
import { GetApiUserService } from 'src/app/Service/get-api-user.service';
import { doFormatDate, formatDateTime } from 'src/app/UseVoid/void_doFormatDate';
import { NgxSpinnerService } from 'ngx-spinner';
import { GetBaseByFormClass } from 'src/app/Models/PostData_API_Class/GetBaseByFormClass';
import { GetBaseInfoDetailClass } from 'src/app/Models/GetBaseInfoDetailClass';
import { DayHourMinuteClass } from 'src/app/Models/DayHourMinuteClass';
import { MatTableDataSource, MatSort } from '@angular/material';

declare let $: any; //use jquery
@Component({
  selector: 'app-personnel-search-surplus-leave',
  templateUrl: './personnel-search-surplus-leave.component.html',
  styleUrls: ['./personnel-search-surplus-leave.component.css']
})
export class PersonnelSearchSurplusLeaveComponent implements OnInit, OnDestroy {
  ngOnDestroy(): void {
    this.api_subscribe = false;
  }
  api_subscribe = true

  constructor(
    private GetApiUserService: GetApiUserService,
    private GetApiDataServiceService: GetApiDataServiceService,
    private LoadingPage: NgxSpinnerService) { }

  errorLeavemanState = { state: false, errorString: '' }

  showSurplusLeave: AllVaShow[] = [] //餘假資訊 - 給明細用的
  showSurplusLeaveAbsDeduction: AllVaShow[] = [] //餘假資訊

  showSpecialLeave: AllVaShow = new AllVaShow() //特休
  showWelfare: AllVaShow = new AllVaShow() //福利補休
  showDomestic: AllVaShow = new AllVaShow() //國內補休

  showBnftDate = '' //年度特休基準日

  SearchMan = { EmpCode: '', EmpNameC: '' }
  showSearchMan = { EmpCode: '', EmpNameC: '' }


  setMan = { EmpCode: '', EmpName: '', DeptaID: '', DeptaName: '' }

  displayedColumns_ShowSurplusLeaveAbsDeduction: string[] = ['HoliDayKindNameC', 'BalanceDayHourMin', 'FlowUseDayHourMin', 'UseDayHourMin'];
  dataSource_ShowSurplusLeaveAbsDeduction = new MatTableDataSource<any>();

  displayedColumns_ShowSpecialLeave: string[] = ['Year', 'RestAmountDayHourMin', 'DateB', 'DateE'];
  dataSource_ShowSpecialLeave = new MatTableDataSource<any>();

  displayedColumns_ShowWelfare: string[] = ['Year', 'RestAmountDayHourMin', 'DateB', 'DateE'];
  dataSource_ShowWelfare = new MatTableDataSource<any>();

  displayedColumns_ShowDomestic: string[] = ['Year', 'RestAmountDayHourMin', 'DateB', 'DateE'];
  dataSource_ShowDomestic = new MatTableDataSource<any>();


  @ViewChild('sortTable_ShowSurplusLeaveAbsDeduction') sortTable_ShowSurplusLeaveAbsDeduction: MatSort;
  @ViewChild('sortTable_ShowSpecialLeave') sortTable_ShowSpecialLeave: MatSort;
  @ViewChild('sortTable_ShowWelfare') sortTable_ShowWelfare: MatSort;
  @ViewChild('sortTable_ShowDomestic') sortTable_ShowDomestic: MatSort;

  ngOnInit() {
    this.showSpecialLeave.AbsAddition = []
    this.showWelfare.AbsAddition = []
    this.showDomestic.AbsAddition = []
    this.GetApiUserService.counter$.subscribe(
      (x: any) => {
        if (x != 0) {
          this.setMan.EmpCode = x.EmpCode
          if (x.EmpNameC) {
            this.setMan.EmpName = x.EmpNameC;
          } else {
            this.setMan.EmpName = x.EmpNameE;
          }
        }
      })
  }

  CheckDayHourMinuteNotZero(DayHourMinute: DayHourMinuteClass) {
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

  SearchBalanceFlow(EmpID: string) {
    this.LoadingPage.show()
    var today = new Date()
    var GetHoliDayBalanceFlow: GetHoliDayBalanceFlow = {
      "EmpID": EmpID,
      "DateB": doFormatDate(today),
      "DateE": "9999/12/31",
      "HoliDayID": 0,
      "KeyName": "",
      "EventDate": "",
      "ListAbsFlow": null
    }
    this.GetApiDataServiceService.getWebApiData_GetBaseInfoDetail(EmpID)
      .pipe(takeWhile(() => this.api_subscribe))
      .subscribe(
        (GetBaseInfoDetail: GetBaseInfoDetailClass[]) => {
          if (GetBaseInfoDetail) {
            this.showBnftDate = formatDateTime(GetBaseInfoDetail[0].BnftDate).getDate
            this.showSearchMan.EmpCode = GetBaseInfoDetail[0].EmpCode
            this.showSearchMan.EmpNameC = GetBaseInfoDetail[0].EmpNameC
          }

          this.GetApiDataServiceService.getWebApiData_GetHoliDayBalanceFlow(GetHoliDayBalanceFlow)
            .pipe(takeWhile(() => this.api_subscribe))
            .subscribe(
              (x: HoliDayBalanceFlow[]) => {
                // console.log(x)
                var SortShowData: HoliDayBalanceFlow[] = []
                for (let data of x) {
                  SortShowData.push(data)
                }
                //計算日時分

                this.showSurplusLeaveAbsDeduction = []
                for (let showData of SortShowData) {
                  if (showData.AbsDeduction.length > 0) {
                    for (let AbsDeduction of showData.AbsDeduction) {

                      if (AbsDeduction.Balance) {
                        var showBalanceDayHourMin_AbsDeduction: DayHourMinuteClass = {
                          Day: AbsDeduction.Balance.Day,
                          Hour: AbsDeduction.Balance.Hour,
                          Minute: AbsDeduction.Balance.Minute
                        }
                      } else {
                        showBalanceDayHourMin_AbsDeduction = null
                      }

                      if (AbsDeduction.Use) {
                        var showUseDayHourMin_AbsDeduction: DayHourMinuteClass = {
                          Day: AbsDeduction.Use.Day,
                          Hour: AbsDeduction.Use.Hour,
                          Minute: AbsDeduction.Use.Minute
                        }
                      } else {
                        showUseDayHourMin_AbsDeduction = null
                      }
                      if (AbsDeduction.FlowUse) {

                        var showFlowUseDayHourMin_AbsDeduction: DayHourMinuteClass = {
                          Day: AbsDeduction.FlowUse.Day,
                          Hour: AbsDeduction.FlowUse.Hour,
                          Minute: AbsDeduction.FlowUse.Minute
                        }
                      } else {
                        showFlowUseDayHourMin_AbsDeduction = null
                      }

                      if (!this.CheckDayHourMinuteNotZero(showBalanceDayHourMin_AbsDeduction) &&
                        !this.CheckDayHourMinuteNotZero(showUseDayHourMin_AbsDeduction) &&
                        !this.CheckDayHourMinuteNotZero(showFlowUseDayHourMin_AbsDeduction)) {
                      } else {

                        this.showSurplusLeaveAbsDeduction.push(
                          {
                            Sort: showData.Sort,
                            HoliDayKindNameC: AbsDeduction.HoliDayNameC,

                            AbsAddition: [],
                            BalanceDayHourMin: showBalanceDayHourMin_AbsDeduction,//結餘
                            UseDayHourMin: showUseDayHourMin_AbsDeduction,//已請
                            FlowUseDayHourMin: showFlowUseDayHourMin_AbsDeduction//待扣
                          }
                        )
                      }
                    }
                  }
                }
                for (let showData of SortShowData) {
                  var showAbsAddition: AbsAddition[] = [] ///明細檔
                  for (let addition of showData.AbsAddition) {
                    var rr_DayHourMin: DayHourMinuteClass = {
                      Day: addition.RestAmountDayHourMinute.Day,
                      Hour: addition.RestAmountDayHourMinute.Hour,
                      Minute: addition.RestAmountDayHourMinute.Minute,
                    }
                    showAbsAddition.push(
                      {
                        DateB: formatDateTime(addition.DateB).getDate,
                        DateE: formatDateTime(addition.DateE).getDate,

                        Year: addition.Year.toString(),
                        RestAmount: addition.RestAmount,
                        RestAmountDayHourMin: rr_DayHourMin
                      }
                    )
                  }

                  //剩餘
                  var showBalanceDayHourMin: DayHourMinuteClass = {
                    Day: showData.BalanceRealDayHourMinute.Day,
                    Hour: showData.BalanceRealDayHourMinute.Hour,
                    Minute: showData.BalanceRealDayHourMinute.Minute,
                  }
                  //已請
                  var showUseDayHourMin: DayHourMinuteClass = {
                    Day: showData.UseDayHourMinute.Day,
                    Hour: showData.UseDayHourMinute.Hour,
                    Minute: showData.UseDayHourMinute.Minute,
                  }
                  //待扣
                  var showFlowUseDayHourMin: DayHourMinuteClass = {
                    Day: showData.FlowUseDayHourMinute.Day,
                    Hour: showData.FlowUseDayHourMinute.Hour,
                    Minute: showData.FlowUseDayHourMinute.Minute
                  }
                  this.showSurplusLeave.push(
                    {
                      Sort: showData.Sort,
                      HoliDayKindNameC: showData.HoliDayKindNameC,

                      AbsAddition: showAbsAddition,
                      BalanceDayHourMin: showBalanceDayHourMin,
                      UseDayHourMin: showUseDayHourMin,
                      FlowUseDayHourMin: showFlowUseDayHourMin
                    }
                  )
                }
                this.showSpecialLeave = new AllVaShow()
                this.showWelfare = new AllVaShow()
                this.showDomestic = new AllVaShow()
                this.showSpecialLeave.AbsAddition = []
                this.showWelfare.AbsAddition = []
                this.showDomestic.AbsAddition = []
                // console.log(this.showSurplusLeave)
                var cal_showSpecialLeave = new AllVaShow()
                var cal_showWelfare = new AllVaShow()
                var cal_showDomestic = new AllVaShow()
                cal_showSpecialLeave.AbsAddition = []
                cal_showWelfare.AbsAddition = []
                cal_showDomestic.AbsAddition = []
                for (let sup of this.showSurplusLeave) {
                  if (sup.HoliDayKindNameC == '特休') {
                    cal_showSpecialLeave = sup
                  } else { }

                  if (sup.HoliDayKindNameC == '福利補休') {
                    cal_showWelfare = sup
                  } else { }

                  if (sup.HoliDayKindNameC == '國內補休') {
                    cal_showDomestic = sup
                  } else { }
                }
                for (let aa of cal_showSpecialLeave.AbsAddition) {
                  if (aa.RestAmountDayHourMin.Day > 0 || aa.RestAmountDayHourMin.Hour > 0 || aa.RestAmountDayHourMin.Minute > 0) {
                    this.showSpecialLeave.AbsAddition.push(aa)
                  }
                }
                for (let bb of cal_showWelfare.AbsAddition) {
                  if (bb.RestAmountDayHourMin.Day > 0 || bb.RestAmountDayHourMin.Hour > 0 || bb.RestAmountDayHourMin.Minute > 0) {
                    this.showWelfare.AbsAddition.push(bb)
                  }
                }
                for (let cc of cal_showDomestic.AbsAddition) {
                  if (cc.RestAmountDayHourMin.Day > 0 || cc.RestAmountDayHourMin.Hour > 0 || cc.RestAmountDayHourMin.Minute > 0) {
                    this.showDomestic.AbsAddition.push(cc)
                  }
                }
                this.showSpecialLeave.AbsAddition.sort((a, b) => {
                  let left = Number(new Date(a.DateE));
                  let right = Number(new Date(b.DateE));
                  return right - left;
                })
                this.showWelfare.AbsAddition.sort((a, b) => {
                  let left = Number(new Date(a.DateE));
                  let right = Number(new Date(b.DateE));
                  return right - left;
                })
                this.showDomestic.AbsAddition.sort((a, b) => {
                  let left = Number(new Date(a.DateE));
                  let right = Number(new Date(b.DateE));
                  return right - left;
                })

                this.dataSource_ShowSurplusLeaveAbsDeduction.data = this.showSurplusLeaveAbsDeduction
                this.dataSource_ShowSurplusLeaveAbsDeduction.sort = this.sortTable_ShowSurplusLeaveAbsDeduction


                this.dataSource_ShowSpecialLeave.data = this.showSpecialLeave.AbsAddition;
                this.dataSource_ShowSpecialLeave.sort = this.sortTable_ShowSpecialLeave;

                this.dataSource_ShowWelfare.data = this.showWelfare.AbsAddition;
                this.dataSource_ShowWelfare.sort = this.sortTable_ShowWelfare;

                this.dataSource_ShowDomestic.data = this.showDomestic.AbsAddition;
                this.dataSource_ShowDomestic.sort = this.sortTable_ShowDomestic;
                // console.log(this.showSurplusLeave)
                // console.log(this.showSpecialLeave)
                // console.log(this.showWelfare)

                this.LoadingPage.hide()
              }, error => {
                this.LoadingPage.hide()
              }
            )

        }, error => {
          this.LoadingPage.hide()
        }
      )
  }

  onSaveEmptoView(event) {
    // console.log(event)
    this.SearchMan.EmpCode = event.split('，')[0]
    this.SearchMan.EmpNameC = event.split('，')[1]
    $('#chooseEmpdialog').modal('hide');
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
            $("#leavejobid").removeClass("errorInput");
            this.bt_search()

          }
        })
    } else {
      this.SearchMan.EmpNameC = ''
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
          this.errorLeavemanState = { state: true, errorString: '非同單位或無該部門的行政權限' }
          $("#leavejobid").addClass("errorInput");
          this.LoadingPage.hide();
        }
        else if (x.length == 0) {
          // alert('工號輸入錯誤')
          this.SearchMan.EmpNameC = ''
          this.errorLeavemanState = { state: true, errorString: '非同單位或無該部門的行政權限' }
          $("#leavejobid").addClass("errorInput");
          this.LoadingPage.hide();
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
          $("#leavejobid").removeClass("errorInput");
          this.bt_search()
        }
      }, error => {
        this.LoadingPage.hide();
      });
  }

  bt_search() {
    this.SearchBalanceFlow(this.SearchMan.EmpCode)
  }

  chooseEmpdialog_ShowDialog: boolean = false
  bt_ShowDialog_chooseEmpdialog() {
    this.chooseEmpdialog_ShowDialog = true
    $('#chooseEmpdialog').modal('show')
  }
  calcDayHourMin(Day: number, Hour: number, Minute: number) {
    var num = Day * 10000 + Hour * 100 + Minute * 1
    return num
  }
  sortChange_ShowSurplusLeaveAbsDeduction(sortInfo) {
    if (sortInfo.active == 'BalanceDayHourMin') {
      if (sortInfo.direction == 'asc') {
        this.showSurplusLeaveAbsDeduction.sort((a, b) => {
          var small = 0
          var large = 0
          if (a.BalanceDayHourMin) {
            small = this.calcDayHourMin(a.BalanceDayHourMin.Day,a.BalanceDayHourMin.Hour,a.BalanceDayHourMin.Minute)
          } else {
            small = 0
          }
          if (b.BalanceDayHourMin) {
            large = this.calcDayHourMin(b.BalanceDayHourMin.Day,b.BalanceDayHourMin.Hour,b.BalanceDayHourMin.Minute)
          } else {
            large = 0
          }
          return small - large
        })
      } else if (sortInfo.direction == 'desc') {
        this.showSurplusLeaveAbsDeduction.sort((a, b) => {
          var small = 0
          var large = 0
          if (a.BalanceDayHourMin) {
            small = this.calcDayHourMin(a.BalanceDayHourMin.Day,a.BalanceDayHourMin.Hour,a.BalanceDayHourMin.Minute)
          } else {
            small = 0
          }
          if (b.BalanceDayHourMin) {
            large = this.calcDayHourMin(b.BalanceDayHourMin.Day,b.BalanceDayHourMin.Hour,b.BalanceDayHourMin.Minute)
          } else {
            large = 0
          }
          return large - small
        })

      } else if (sortInfo.direction == '') {

      }
      this.dataSource_ShowSurplusLeaveAbsDeduction.data = this.showSurplusLeaveAbsDeduction;
    } else if (sortInfo.active == 'FlowUseDayHourMin') {
      if (sortInfo.direction == 'asc') {
        this.showSurplusLeaveAbsDeduction.sort((a, b) => {
          var small = 0
          var large = 0
          if (a.FlowUseDayHourMin) {
            small = this.calcDayHourMin(a.FlowUseDayHourMin.Day,a.FlowUseDayHourMin.Hour,a.FlowUseDayHourMin.Minute)
          } else {
            small = 0
          }
          if (b.FlowUseDayHourMin) {
            large = this.calcDayHourMin(b.FlowUseDayHourMin.Day,b.FlowUseDayHourMin.Hour,b.FlowUseDayHourMin.Minute)
          } else {
            large = 0
          }
          return small - large
        })
      } else if (sortInfo.direction == 'desc') {
        this.showSurplusLeaveAbsDeduction.sort((a, b) => {
          var small = 0
          var large = 0
          if (a.FlowUseDayHourMin) {
            small = this.calcDayHourMin(a.FlowUseDayHourMin.Day,a.FlowUseDayHourMin.Hour,a.FlowUseDayHourMin.Minute)
          } else {
            small = 0
          }
          if (b.FlowUseDayHourMin) {
            large = this.calcDayHourMin(b.FlowUseDayHourMin.Day,b.FlowUseDayHourMin.Hour,b.FlowUseDayHourMin.Minute)
          } else {
            large = 0
          }
          return large - small
        })

      } else if (sortInfo.direction == '') {

      }
      this.dataSource_ShowSurplusLeaveAbsDeduction.data = this.showSurplusLeaveAbsDeduction;
    } else if (sortInfo.active == 'UseDayHourMin') {
      if (sortInfo.direction == 'asc') {
        this.showSurplusLeaveAbsDeduction.sort((a, b) => {
          var small = 0
          var large = 0
          if (a.UseDayHourMin) {
            small = this.calcDayHourMin(a.UseDayHourMin.Day,a.UseDayHourMin.Hour,a.UseDayHourMin.Minute)
          } else {
            small = 0
          }
          if (b.UseDayHourMin) {
            large = this.calcDayHourMin(b.UseDayHourMin.Day,b.UseDayHourMin.Hour,b.UseDayHourMin.Minute)
          } else {
            large = 0
          }
          return small - large
        })
      } else if (sortInfo.direction == 'desc') {
        this.showSurplusLeaveAbsDeduction.sort((a, b) => {
          var small = 0
          var large = 0
          if (a.UseDayHourMin) {
            small = this.calcDayHourMin(a.UseDayHourMin.Day,a.UseDayHourMin.Hour,a.UseDayHourMin.Minute)
          } else {
            small = 0
          }
          if (b.UseDayHourMin) {
            large = this.calcDayHourMin(b.UseDayHourMin.Day,b.UseDayHourMin.Hour,b.UseDayHourMin.Minute)
          } else {
            large = 0
          }
          return large - small
        })

      } else if (sortInfo.direction == '') {

      }
      this.dataSource_ShowSurplusLeaveAbsDeduction.data = this.showSurplusLeaveAbsDeduction;
    }
  }
  sortChange_ShowSpecialLeave(sortInfo) {
    if (sortInfo.active == 'RestAmountDayHourMin') {
      if (sortInfo.direction == 'asc') {
        this.showSpecialLeave.AbsAddition.sort((a, b) => {
          var small = 0
          var large = 0
          if (a.RestAmountDayHourMin) {
            small = this.calcDayHourMin(a.RestAmountDayHourMin.Day,a.RestAmountDayHourMin.Hour,a.RestAmountDayHourMin.Minute)
          } else {
            small = 0
          }

          if (b.RestAmountDayHourMin) {
            large = this.calcDayHourMin(b.RestAmountDayHourMin.Day,b.RestAmountDayHourMin.Hour,b.RestAmountDayHourMin.Minute)
          } else {
            large = 0
          }
          return small - large
        })
      } else if (sortInfo.direction == 'desc') {
        this.showSpecialLeave.AbsAddition.sort((a, b) => {
          var small = 0
          var large = 0
          if (a.RestAmountDayHourMin) {
            small = this.calcDayHourMin(a.RestAmountDayHourMin.Day,a.RestAmountDayHourMin.Hour,a.RestAmountDayHourMin.Minute)
          } else {
            small = 0
          }

          if (b.RestAmountDayHourMin) {
            large = this.calcDayHourMin(b.RestAmountDayHourMin.Day,b.RestAmountDayHourMin.Hour,b.RestAmountDayHourMin.Minute)
          } else {
            large = 0
          }
          return large - small
        })

      } else if (sortInfo.direction == '') {

      }
      this.dataSource_ShowSpecialLeave.data = this.showSpecialLeave.AbsAddition;
    }
  }
  sortChange_ShowWelfare(sortInfo) {
    if (sortInfo.active == 'RestAmountDayHourMin') {
      if (sortInfo.direction == 'asc') {
        this.showWelfare.AbsAddition.sort((a, b) => {
          var small = 0
          var large = 0
          if (a.RestAmountDayHourMin) {
            small = this.calcDayHourMin(a.RestAmountDayHourMin.Day,a.RestAmountDayHourMin.Hour,a.RestAmountDayHourMin.Minute)
          } else {
            small = 0
          }

          if (b.RestAmountDayHourMin) {
            large = this.calcDayHourMin(b.RestAmountDayHourMin.Day,b.RestAmountDayHourMin.Hour,b.RestAmountDayHourMin.Minute)
          } else {
            large = 0
          }
          return small - large
        })
      } else if (sortInfo.direction == 'desc') {
        this.showWelfare.AbsAddition.sort((a, b) => {
          var small = 0
          var large = 0
          if (a.RestAmountDayHourMin) {
            small = this.calcDayHourMin(a.RestAmountDayHourMin.Day,a.RestAmountDayHourMin.Hour,a.RestAmountDayHourMin.Minute)
          } else {
            small = 0
          }

          if (b.RestAmountDayHourMin) {
            large = this.calcDayHourMin(b.RestAmountDayHourMin.Day,b.RestAmountDayHourMin.Hour,b.RestAmountDayHourMin.Minute)
          } else {
            large = 0
          }
          return large - small
        })

      } else if (sortInfo.direction == '') {

      }
      this.dataSource_ShowWelfare.data = this.showWelfare.AbsAddition;
    }
  }
  sortChange_ShowDomestic(sortInfo) {
    if (sortInfo.active == 'RestAmountDayHourMin') {
      if (sortInfo.direction == 'asc') {
        this.showDomestic.AbsAddition.sort((a, b) => {
          var small = 0
          var large = 0
          if (a.RestAmountDayHourMin) {
            small = this.calcDayHourMin(a.RestAmountDayHourMin.Day,a.RestAmountDayHourMin.Hour,a.RestAmountDayHourMin.Minute)
          } else {
            small = 0
          }

          if (b.RestAmountDayHourMin) {
            large = this.calcDayHourMin(b.RestAmountDayHourMin.Day,b.RestAmountDayHourMin.Hour,b.RestAmountDayHourMin.Minute)
          } else {
            large = 0
          }
          return small - large
        })
      } else if (sortInfo.direction == 'desc') {
        this.showDomestic.AbsAddition.sort((a, b) => {
          var small = 0
          var large = 0
          if (a.RestAmountDayHourMin) {
            small = this.calcDayHourMin(a.RestAmountDayHourMin.Day,a.RestAmountDayHourMin.Hour,a.RestAmountDayHourMin.Minute)
          } else {
            small = 0
          }

          if (b.RestAmountDayHourMin) {
            large = this.calcDayHourMin(b.RestAmountDayHourMin.Day,b.RestAmountDayHourMin.Hour,b.RestAmountDayHourMin.Minute)
          } else {
            large = 0
          }
          return large - small
        })

      } else if (sortInfo.direction == '') {

      }
      this.dataSource_ShowDomestic.data = this.showDomestic.AbsAddition;
    }
  }
}

class AllVaShow {

  Sort: number
  HoliDayKindNameC: string
  AbsAddition: AbsAddition[]

  BalanceDayHourMin: DayHourMinuteClass//結餘
  UseDayHourMin: DayHourMinuteClass//已請
  FlowUseDayHourMin: DayHourMinuteClass//待扣
}


class AbsAddition {
  DateB: string
  DateE: string
  Year: string
  RestAmount: number
  RestAmountDayHourMin: DayHourMinuteClass
}
