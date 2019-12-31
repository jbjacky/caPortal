import { Component, OnInit, OnDestroy } from '@angular/core';
import { GetApiDataServiceService } from 'src/app/Service/get-api-data-service.service';
import { GetHoliDayBalanceFlow } from 'src/app/Models/PostData_API_Class/GetHoliDayBalanceFlow';
import { takeWhile } from 'rxjs/operators';
import { HoliDayBalanceFlow } from 'src/app/Models/HoliDayBalanceFlow';
import { GetApiUserService } from 'src/app/Service/get-api-user.service';
import { doFormatDate, formatDateTime } from 'src/app/UseVoid/void_doFormatDate';
import { NgxSpinnerService } from 'ngx-spinner';
import { DayHourMinuteClass } from 'src/app/Models/DayHourMinuteClass';
import { CheckDayHourMinuteNotZero } from 'src/app/UseVoid/void_CheckDayHourMinuteNotZero';

@Component({
  selector: 'app-surplus-leave',
  templateUrl: './surplus-leave.component.html',
  styleUrls: ['./surplus-leave.component.css']
})
export class SurplusLeaveComponent implements OnInit, OnDestroy {
  ngOnDestroy(): void {
    this.api_subscribe = false;
  }
  api_subscribe = true
  constructor(
    private GetApiUserService: GetApiUserService,
    private GetApiDataServiceService: GetApiDataServiceService,
    private LoadingPage: NgxSpinnerService) { }


  showSurplusLeave: AllVaShow[] = [] //餘假資訊 - 給明細用的
  showSurplusLeaveAbsDeduction: AllVaShow[] = [] //餘假資訊

  showSpecialLeave: AllVaShow = new AllVaShow() //特休
  showWelfare: AllVaShow = new AllVaShow() //福利補休
  showDomestic: AllVaShow = new AllVaShow() //國內補休

  showBnftDate = '' //年度特休基準日


  SearchMan = { EmpCode: '', EmpNameC: '' }

  BaseHour = ''
  ngOnInit() {
    this.showSpecialLeave.AbsAddition = []
    this.showWelfare.AbsAddition = []
    this.showDomestic.AbsAddition = []
    this.GetApiUserService.counter$.subscribe(
      (x: any) => {
        // console.log(x)
        if (x == 0) {

        } else {
          this.SearchMan.EmpCode = x.EmpCode
          this.SearchMan.EmpNameC = x.EmpNameC

          this.showBnftDate = formatDateTime(x.BnftDate).getDate

          this.SearchBalanceFlow(x.EmpCode)
          this.BaseHour = x.BaseHour.toString()
        }

      })

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

                if (!CheckDayHourMinuteNotZero(showBalanceDayHourMin_AbsDeduction) &&
                  !CheckDayHourMinuteNotZero(showUseDayHourMin_AbsDeduction) &&
                  !CheckDayHourMinuteNotZero(showFlowUseDayHourMin_AbsDeduction)) {
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
              if (CheckDayHourMinuteNotZero(addition.RestAmountDayHourMinute)) {

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
            if (aa.RestAmountDayHourMin.Day > 0 || aa.RestAmountDayHourMin.Hour > 0 || aa.RestAmountDayHourMin.Minute > 0){
              this.showSpecialLeave.AbsAddition.push(aa)
            }
          }
          for (let bb of cal_showWelfare.AbsAddition) {
            if (bb.RestAmountDayHourMin.Day > 0 || bb.RestAmountDayHourMin.Hour > 0 || bb.RestAmountDayHourMin.Minute > 0){
              this.showWelfare.AbsAddition.push(bb)
            }
          }
          for (let cc of cal_showDomestic.AbsAddition) {
            if (cc.RestAmountDayHourMin.Day > 0 || cc.RestAmountDayHourMin.Hour > 0 || cc.RestAmountDayHourMin.Minute > 0){
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
          // console.log(this.showSurplusLeave)
          // console.log(this.showSpecialLeave)
          // console.log(this.showWelfare)

          this.LoadingPage.hide()
        }, error => {
          this.LoadingPage.hide()
        }
      )
  }

}

export class AllVaShow {

  Sort: number
  HoliDayKindNameC: string
  AbsAddition: AbsAddition[]

  BalanceDayHourMin: DayHourMinuteClass//結餘
  UseDayHourMin: DayHourMinuteClass//已請
  FlowUseDayHourMin: DayHourMinuteClass//待扣
}


export class AbsAddition {
  DateB: string
  DateE: string
  Year: string
  RestAmount: number
  RestAmountDayHourMin: DayHourMinuteClass
}
