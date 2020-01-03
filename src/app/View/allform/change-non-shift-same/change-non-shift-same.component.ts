import { Component, OnInit, NgZone, OnDestroy, AfterViewInit } from '@angular/core';
import { doFormatDate, formatDateTime, getapi_formatTimetoString } from 'src/app/UseVoid/void_doFormatDate';
import { isValidDate } from 'src/app/UseVoid/void_isVaildDatetime';
import { GetApiDataServiceService } from 'src/app/Service/get-api-data-service.service';
import { GetApiUserService } from 'src/app/Service/get-api-user.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { takeWhile, mergeMap, map, toArray } from 'rxjs/operators';
import { GetAttendInfoClass } from 'src/app/Models/GetAttendInfoClass';
import { chinesenum } from 'src/app/UseVoid/void_chinesenumber';
import { ShiftRoteSaveAndFlowStartClass, ShiftRoteFlowAppsDetailArrayClass } from 'src/app/Models/PostData_API_Class/ShiftRoteSaveAndFlowStartClass';
import { ViewportScroller } from '@angular/common';
import { of, from, BehaviorSubject, Observable } from 'rxjs';
import { ShiftRoteCheckClass } from 'src/app/Models/PostData_API_Class/ShiftRoteCheckClass';
import { ExampleHeader } from 'src/app/Service/datepickerHeader';
import { FlowShiftRoteCheckClass } from 'src/app/Models/PostData_API_Class/FlowShiftRoteCheckClass';
import { GetRoteByShiftDataClass } from 'src/app/Models/GetRoteByShiftDataClass';
import { GetBaseByFormClass } from 'src/app/Models/PostData_API_Class/GetBaseByFormClass';
import { GetSelectBaseClass } from 'src/app/Models/GetSelectBaseClass';
import { Router, NavigationEnd } from '@angular/router';
import { uiShowClass } from 'src/app/Models/uiShowClass';
import { valTT_Class, TT_errorDataClass } from 'src/app/Models/valTT_Class';
import { GetBaseParameterDataClass } from 'src/app/Models/GetBaseParameterDataClass';
import { ResponeStateClass } from 'src/app/Models/ResponeStateClass';

declare let $: any; //use jquery

@Component({
  selector: 'app-change-non-shift-same',
  templateUrl: './change-non-shift-same.component.html',
  styleUrls: ['./change-non-shift-same.component.css']
})
export class ChangeNonShiftSameComponent implements OnInit, AfterViewInit, OnDestroy {
  ngAfterViewInit(): void {
    // this.router.events
    //   .pipe(takeWhile(() => this.api_subscribe))
    //   .subscribe((e: any) => {
    //     // If it is a NavigationEnd event re-initalise the component
    //     if (e instanceof NavigationEnd) {
    //       this.ngOnInit()
    //     }
    //   });
  }
  exampleHeader = ExampleHeader //日期套件header

  ngOnDestroy(): void {
    this.api_subscribe = false
  }

  radiogroup: any = [
    { id: 1, name: '自己' },
    { id: 2, name: '行政' }
  ];

  chooseRadio: number = 1;

  writeState = 1 //步驟一
  api_subscribe = true

  chooseNow: boolean = true
  str_DEFAULT = '對應班型'
  item_disable: boolean = true

  changeClass: changeClass[] = []

  showCheckDetailDateArray: showViewRote[] = []

  SearchMan = { EmpCode: '', EmpName: '' }
  WriteMan = { EmpCode: '', EmpName: '' }
  Assistant_SearchMan = { EmpCode: '', EmpName: '' }
  My_SearchMan = { EmpCode: '', EmpName: '' }

  private Sub_onChangeSignMan$: BehaviorSubject<any> = new BehaviorSubject(0)
  onChangeSingMan$: Observable<any> = this.Sub_onChangeSignMan$; //切換選擇簽核人員使用

  dateB
  dateE
  showBlockIsAssistant: boolean = false
  Assistant_DateB
  Assistant_DateE

  RouteReload() {

    this.chooseRadio = 1;

    this.writeState = 1 //步驟一
    this.api_subscribe = true

    this.chooseNow = true
    this.str_DEFAULT = '對應班型'
    this.item_disable = true

    this.changeClass = []

    this.showCheckDetailDateArray = []

    this.SearchMan = { EmpCode: '', EmpName: '' }
    this.WriteMan = { EmpCode: '', EmpName: '' }
    this.Assistant_SearchMan = { EmpCode: '', EmpName: '' }
    this.My_SearchMan = { EmpCode: '', EmpName: '' }
    this.dateB = null
    this.dateE = null
    this.showBlockIsAssistant = false
    this.Assistant_DateB
    this.Assistant_DateE
    this.setMap = new Map()
    this.Assistant_errorStartDateState = { state: false, errorString: '' }
    this.Assistant_errorEndtDateState = { state: false, errorString: '' }
    this.errorEmp = { state: false, errorString: '' };
    this.checkAgree = false
    this.NoteString = null;

    this.My_errorStartDateState = { state: false, errorString: '' }
    this.My_errorEndtDateState = { state: false, errorString: '' }
  }
  constructor(private router: Router,
    private GetApiDataServiceService: GetApiDataServiceService,
    private GetApiUserService: GetApiUserService,
    private viewScroller: ViewportScroller,
    private LoadingPage: NgxSpinnerService) { }
  ngOnInit() {
    // this.RouteReload()
    this.GetApiUserService.counter$.subscribe(
      (x: any) => {
        if (x == 0) {

        } else {
          this.My_SearchMan.EmpCode = x.EmpCode
          this.WriteMan.EmpCode = x.EmpCode
          this.showBlockIsAssistant = x.IsAssistant
          if (x.EmpNameC) {
            this.My_SearchMan.EmpName = x.EmpNameC
            this.WriteMan.EmpName = x.EmpNameC
          } else {
            this.My_SearchMan.EmpName = x.EmpNameE
            this.WriteMan.EmpCode = x.EmpNameE
          }
        }
      })
  }


  setMap = new Map()
  onChangeChooseRote(e, change: changeClass) {
    var dateString = change.Date
    var dateday = new Date(dateString)
    // console.log(dateday.getDay())
    var datedayString = ''
    if (dateday.getDay() == 0) {
      datedayString = '日'
    } else {
      datedayString = chinesenum(dateday.getDay())
    }

    if (e.length > 0) {
      var showData: RoteSelectBoxClass = e[0].data
      // console.log(dateString)
      // console.log(showData.outPutSelectText)
      var setData: showViewRote = new showViewRote()
      setData = {
        ShiftRoteDate: dateString,
        OnTime1: change.OnTime,
        RoteID1: change.RoteID,
        RoteCode1: change.RoteCode,
        RoteName1: change.RoteNameC,
        OnTime2: showData.OnTime,
        RoteID2: showData.RoteID,
        RoteCode2: showData.RoteCode,
        RoteName2: showData.RoteName,
        ShiftRoteDateDay: datedayString
      }
      this.setMap.set(dateString, setData)
      // console.log(this.setMap)
    } else {
      this.setMap.delete(dateString)
      // console.log(this.setMap)
    }


  }


  prePage() {
    this.writeState = this.writeState - 1
    this.SetUiActive()
  }

  Assistant_errorStartDateState = { state: false, errorString: '' }
  Assistant_errorEndtDateState = { state: false, errorString: '' }

  SerchStartDateChange__Assistant() {
    if (this.Assistant_DateE > this.Assistant_DateB) {

    } else {
      this.Assistant_DateE = new Date(this.Assistant_DateB)
    }
    this.blurStartDate_Assistant()
  }
  blurStartDate_Assistant(): boolean {
    //true 有錯
    if (!this.Assistant_DateB) {
      this.Assistant_errorStartDateState = { state: true, errorString: '請輸入起始日期' }
      $("#Assistant_StartDate").addClass("errorInput");
      return true
    } else {
      var calDateB = new Date(doFormatDate(this.Assistant_DateB) + ' ' + '00:00')
      var calDateE = new Date(doFormatDate(this.Assistant_DateE) + ' ' + '00:00')
      if (calDateB > calDateE) {
        this.Assistant_errorStartDateState = { state: true, errorString: '起始日不得大於結束日' }
        $("#Assistant_StartDate").addClass("errorInput");
        return true
      } else {
        this.Assistant_errorStartDateState = { state: false, errorString: '' }
        $("#Assistant_StartDate").removeClass("errorInput");
        this.Assistant_errorEndtDateState = { state: false, errorString: '' }
        $("#Assistant_EndDate").removeClass("errorInput");
      }
    }

    return false
  }
  blurEndDate_Assistant(): boolean {
    //true 有錯
    if (!this.Assistant_DateE) {
      this.Assistant_errorEndtDateState = { state: true, errorString: '請輸入結束日期' }
      $("#Assistant_EndDate").addClass("errorInput");
      return true
    } else {
      var calDateB = new Date(doFormatDate(this.Assistant_DateB) + ' ' + '00:00')
      var calDateE = new Date(doFormatDate(this.Assistant_DateE) + ' ' + '00:00')
      if (calDateB > calDateE) {
        this.Assistant_errorEndtDateState = { state: true, errorString: '起始日不得大於結束日' }
        $("#Assistant_EndDate").addClass("errorInput");
        return true
      } else {
        this.Assistant_errorStartDateState = { state: false, errorString: '' }
        $("#Assistant_StartDate").removeClass("errorInput");
        this.Assistant_errorEndtDateState = { state: false, errorString: '' }
        $("#Assistant_EndDate").removeClass("errorInput");
      }
    }
    return false
  }

  Assistant_nextPageToWrite() {
    //行政
    //下一步->輸入請求班型
    if (this.Assistant_SearchMan.EmpCode.length < 6) {
      this.Assistant_SearchMan.EmpName = ''
      this.errorEmp = { state: true, errorString: '無該部門的行政權限' }
      $("#Assistant_ChooseEmpCode").addClass("errorInput");
    } else if (this.blurStartDate_Assistant()) {

    } else if (this.blurEndDate_Assistant()) {

    } else {
      this.GetApiDataServiceService.getWebApiData_GetBaseParameter(this.Assistant_SearchMan.EmpCode)
        .pipe(takeWhile(() => this.api_subscribe))
        .subscribe((GetBaseParameterData: GetBaseParameterDataClass[]) => {
          if (GetBaseParameterData.length > 0) {
            if (GetBaseParameterData[0].IsAllowLeave) {

              var calDateB: any = new Date(this.Assistant_DateB)
              var calDateE: any = new Date(this.Assistant_DateE)

              var calDay = (calDateE - calDateB) / (24 * 60 * 60 * 1000)
              if (calDay >= 10) {
                alert('起訖日期區間不可大於10天')
              } else {
                this.SearchMan = this.Assistant_SearchMan
                this.Sub_onChangeSignMan$.next(this.SearchMan.EmpCode)
                this.nextPageToWrite(this.Assistant_DateB, this.Assistant_DateE)
              }
            } else {
              alert(this.Assistant_SearchMan.EmpCode.toString() + '此員工無申請表單權限，如需申請表單請洽單位行政設定')
              this.LoadingPage.hide()
            }
          } else {
            alert(this.Assistant_SearchMan.EmpCode.toString() + '此員工無申請表單權限，如需申請表單請洽單位行政設定')
            this.LoadingPage.hide()
          }
        })

    }
  }

  My_errorStartDateState = { state: false, errorString: '' }
  My_errorEndtDateState = { state: false, errorString: '' }

  SerchStartDateChange_My() {
    if (this.dateE > this.dateB) {

    } else {
      this.dateE = new Date(this.dateB)
    }
    this.blurStartDate_My()
  }
  blurStartDate_My(): boolean {
    //true 有錯
    if (!this.dateB) {
      this.My_errorStartDateState = { state: true, errorString: '請輸入起始日期' }
      $("#My_StartDate").addClass("errorInput");
      return true
    } else {
      var calDateB = new Date(doFormatDate(this.dateB) + ' ' + '00:00')
      var calDateE = new Date(doFormatDate(this.dateE) + ' ' + '00:00')
      if (calDateB > calDateE) {
        this.My_errorStartDateState = { state: true, errorString: '起始日不得大於結束日' }
        $("#My_StartDate").addClass("errorInput");
        return true
      } else {
        this.My_errorStartDateState = { state: false, errorString: '' }
        $("#My_StartDate").removeClass("errorInput");
        this.My_errorEndtDateState = { state: false, errorString: '' }
        $("#My_EndDate").removeClass("errorInput");
      }
    }

    return false
  }
  blurEndDate_My(): boolean {
    //true 有錯
    if (!this.dateE) {
      this.My_errorEndtDateState = { state: true, errorString: '請輸入結束日期' }
      $("#My_EndDate").addClass("errorInput");
      return true
    } else {
      var calDateB = new Date(doFormatDate(this.dateB) + ' ' + '00:00')
      var calDateE = new Date(doFormatDate(this.dateE) + ' ' + '00:00')
      if (calDateB > calDateE) {
        this.My_errorEndtDateState = { state: true, errorString: '起始日不得大於結束日' }
        $("#My_EndDate").addClass("errorInput");
        return true
      } else {
        this.My_errorStartDateState = { state: false, errorString: '' }
        $("#My_StartDate").removeClass("errorInput");
        this.My_errorEndtDateState = { state: false, errorString: '' }
        $("#My_EndDate").removeClass("errorInput");
      }
    }
    return false
  }


  val_TT(selectDay: string[]) {
    //地服處內規檢查
    var CheckTTrule: valTT_Class = new valTT_Class() //state:false為不符合規則
    CheckTTrule.TT_errorData = new TT_errorDataClass()
    CheckTTrule.TT_errorData.ErrorDate = []
    CheckTTrule.TT_errorData.CorrectDateString = []

    for (let oneSelectDay of selectDay) {

      var today = new Date()

      var calDate = new Date(oneSelectDay)
      calDate.setDate(calDate.getDate() - 2)
      calDate.setHours(8, 0, 0)
      calDate.setMinutes(0, 0, 0)
      calDate.setSeconds(0, 0)

      if (calDate > today) {
        //雙人調班內規：出勤日前兩天早上08:00前提出換班申請，之後僅權限管理者可以申請及核准，例：04/03要換班，04/01早上08:00前要提出換班申請。

      } else {
        // alert('最晚在\t' + doFormatDate(calDate) + '\t08:00前提出')
        CheckTTrule.TT_errorData.ErrorDate.push(oneSelectDay)
        CheckTTrule.TT_errorData.CorrectDateString.push(doFormatDate(calDate) + ' 08:00')
      }
    }
    if (CheckTTrule.TT_errorData.ErrorDate.length > 0) {
      CheckTTrule.State = false
    } else {
      CheckTTrule.State = true
    }
    return CheckTTrule
  }

  My_nextPageToWrite() {
    //下一步->輸入請求班型
    if (this.blurStartDate_My()) {

    } else if (this.blurEndDate_My()) {

    } else if (!this.My_errorStartDateState) {

    } else if (!this.My_errorEndtDateState) {
    } else {

      var today: any = new Date()
      var calSearchDate: any = new Date(this.dateB)
      today.setHours(0, 0, 0)
      today.setMinutes(0, 0, 0)
      today.setSeconds(0, 0)

      calSearchDate.setHours(0, 0, 0)
      calSearchDate.setMinutes(0, 0, 0)
      calSearchDate.setSeconds(0, 0)
      if (today > calSearchDate) {
        alert('調班日不能申請今天以前')
      } else {

        var calDateB: any = new Date(this.dateB)
        var calDateE: any = new Date(this.dateE)
        var calDay = (calDateE - calDateB) / (24 * 60 * 60 * 1000)

        if (calDay >= 10) {
          alert('起訖日期區間不可大於10天')
        } else {
          this.LoadingPage.show()

          this.GetApiDataServiceService.getWebApiData_GetBaseParameter(this.My_SearchMan.EmpCode)
            .pipe(takeWhile(() => this.api_subscribe))
            .subscribe((GetBaseParameterData: GetBaseParameterDataClass[]) => {
              if (GetBaseParameterData.length > 0) {
                if (GetBaseParameterData[0].IsAllowLeave) {
                  this.GetApiDataServiceService.getWebApiData_IsTZTT(this.My_SearchMan.EmpCode)
                    .pipe(takeWhile(() => this.api_subscribe))
                    .subscribe(
                      (d: boolean) => {

                        var canNext: boolean = false
                        if (d) {
                          if (this.val_TT([doFormatDate(this.dateB)]).State) {
                            //如果通過地服處內規
                            canNext = true
                          } else {
                            var errorString = '';
                            for (let i = 0; i < this.val_TT([doFormatDate(this.dateB)]).TT_errorData.ErrorDate.length; i++) {
                              errorString += this.My_SearchMan.EmpCode + ' ' + this.val_TT([doFormatDate(this.dateB)]).TT_errorData.ErrorDate[i] + ' ' + '應' + ' ' + this.val_TT([doFormatDate(this.dateB)]).TT_errorData.CorrectDateString[i] + ' ' + '前申請調班\n'
                            }
                            alert(errorString)
                            canNext = false
                            this.LoadingPage.hide()
                          }
                        } else {
                          canNext = true
                        }

                        if (canNext) {
                          this.SearchMan = this.My_SearchMan
                          this.Sub_onChangeSignMan$.next(this.SearchMan.EmpCode)
                          this.nextPageToWrite(this.dateB, this.dateE)
                        }
                      })
                } else {
                  alert(this.My_SearchMan.EmpCode.toString() + '此員工無申請表單權限，如需申請表單請洽單位行政設定')
                  this.LoadingPage.hide()
                }
              } else {
                alert(this.My_SearchMan.EmpCode.toString() + '此員工無申請表單權限，如需申請表單請洽單位行政設定')
                this.LoadingPage.hide()
              }
            })
        }
      }

    }
  }

  nextPageToWrite(_chooseStartDate, _chooseEndDate) {
    //下一步->輸入請求班型
    var chooseStartDate = doFormatDate(_chooseStartDate)
    var chooseEndDate = doFormatDate(_chooseEndDate)
    this.changeClass = []
    this.setMap.clear()
    this.LoadingPage.show()
    var startDate: any = new Date(chooseStartDate)
    var endDate: any = new Date(chooseEndDate)

    var _NowDate = new Date();
    var _NowToday = doFormatDate(_NowDate);

    var GetAttendInfo: GetAttendInfoClass =
    {
      DateB: doFormatDate(startDate),
      DateE: doFormatDate(endDate),
      ListEmpID: [this.SearchMan.EmpCode],
      EffectDate: _NowToday,
      Display: '1',
      ListState: ["1", "2", "3"]
    }
    var pushDate: any = new Date(chooseStartDate)
    var differenceVal = (endDate - startDate) / (24 * 60 * 60 * 1000)
    var setDate = []
    for (let i = 0; i <= differenceVal; i++) {
      setDate.push(doFormatDate(pushDate))
      pushDate.setDate(pushDate.getDate() + 1)
    }
    this.GetApiDataServiceService.getWebApiData_GetAttendInfo(GetAttendInfo)
      .pipe(takeWhile(() => this.api_subscribe))
      .pipe(
        mergeMap((o: any) => from(o).pipe(
          map((q: any) => {
            return q
          })
        ))
      )
      .pipe(
        mergeMap(z => {
          var attDate = formatDateTime(z.AttendDate).getDate
          return this.GetApiDataServiceService.getWebApiData_GetRoteByEmpID(z.EmpID, attDate)
            .pipe(map(
              (a: Array<any>) => {
                var abc = {
                  GetAttendInfo: z,
                  GetRoteByEmpID: a
                }
                return abc
              }
            ))
        }),
        toArray()
      )
      .subscribe(
        x => {
          // console.log(x)
          for (let data of x) {
            var RoteClass: RoteSelectBoxClass[] = []
            for (let rote of data.GetRoteByEmpID) {
              if (data.GetAttendInfo.ActualRote.WorkHours == rote.WorkHours) {
                //只能選到等工時
                RoteClass.push({
                  RoteID: rote.RoteID,
                  OnTime: rote.OnTime,
                  RoteCode: rote.RoteCode,
                  RoteName: rote.RoteNameC,
                  // outPutSelectText: rote.OnTime + rote.RoteCode + rote.RoteNameC 下拉選單換字!!
                  outPutSelectText: rote.RoteNameC + ' ' + '(' + rote.OnTime + '-' + rote.OffTime + ')'
                })
              }
            }
            // this.changeClass.push({
            //   Date: formatDateTime(data.GetAttendInfo.AttendDate).getDate,
            //   RoteID: data.GetAttendInfo.RoteID,
            //   RoteCode: data.GetAttendInfo.RoteCode,
            //   RoteNameC: data.GetAttendInfo.RoteNameC,
            //   OnTime: data.GetAttendInfo.OnTime,
            //   RoteSelectBox: RoteClass
            // })
            // console.log(data)
            this.changeClass.push({
              Date: formatDateTime(data.GetAttendInfo.AttendDate).getDate,
              RoteID: data.GetAttendInfo.ActualRote.RoteID,
              RoteCode: data.GetAttendInfo.ActualRote.RoteCode,
              RoteNameC: data.GetAttendInfo.ActualRote.RoteNameC,
              OnTime: data.GetAttendInfo.ActualRote.OnTime,
              RoteSelectBox: RoteClass
            })
          }

          this.GetApiDataServiceService.getWebApiData_GetRoteByShift('false')
            .pipe(takeWhile(() => this.api_subscribe))
            .subscribe(
              (GetRoteByShiftData: GetRoteByShiftDataClass[]) => {

                for (let oneRote of GetRoteByShiftData) {
                  for (let oneSelectDay of this.changeClass) {
                    if (oneRote.RoteID.toString() == oneSelectDay.RoteID.toString()) {
                      oneSelectDay.RoteSelectBox = []
                    }
                  }
                }
                this.changeClass.sort((a, b) => {
                  var aDate: any = new Date(a.Date)
                  var bDate: any = new Date(b.Date)
                  return aDate - bDate
                })
                if (this.changeClass.length != 0) {
                  this.writeState = 2
                  this.SetUiActive()
                } else {
                  alert('考勤區段異常，請確認該人員是否有出勤資料')
                }

                // console.log(this.changeClass)
                this.LoadingPage.hide()
              })
        }, error => {
          this.LoadingPage.hide()
          // alert('與api連線異常，getWebApiData_GetAttendInfo')
        }
      )


  }


  nextPageToSendDetail() {
    ///下一步->確認請求明細
    var ChangeRoteArray: showViewRote[] = []
    this.setMap.forEach(
      (value: showViewRote, key, map) => {
        ChangeRoteArray.push(value)
      }
    )
    // console.log(ChangeRoteArray)
    this.showCheckDetailDateArray = ChangeRoteArray
    this.showCheckDetailDateArray.sort((a, b) => {
      let left = Number(new Date(a.ShiftRoteDate));
      let right = Number(new Date(b.ShiftRoteDate));
      return left - right;
    });
    // console.log()


    if (this.showCheckDetailDateArray.length == 0) {
      alert('請選擇欲調班班型')
    } else {
      this.LoadingPage.show()
      var ShiftRoteCheckClass: ShiftRoteCheckClass = {
        "EmpID1": this.SearchMan.EmpCode,
        "EmpID2": this.SearchMan.EmpCode,
        "ShiftRoteDate": [],
        "IsDifferShift": true //true:等工時，false:不等工時
      }
      var FlowShiftRoteCheck: FlowShiftRoteCheckClass = {
        "EmpID1": this.SearchMan.EmpCode,
        "EmpID2": this.SearchMan.EmpCode,
        "ListShiftDate": []
      }
      for (let ChangeRote of ChangeRoteArray) {
        ShiftRoteCheckClass.ShiftRoteDate.push(
          {
            "ShiftDate": ChangeRote.ShiftRoteDate,
            "RoteID1": ChangeRote.RoteID1,
            "RoteID2": ChangeRote.RoteID2
          }
        )
        FlowShiftRoteCheck.ListShiftDate.push(ChangeRote.ShiftRoteDate)
      }
      this.GetApiDataServiceService.getWebApiData_FlowShiftRoteCheck(FlowShiftRoteCheck)
        .pipe(takeWhile(() => this.api_subscribe))
        .subscribe(
          (q: any) => {
            if (q == '1') {

              this.GetApiDataServiceService.getWebApiData_GetRoteByShift('false')
                .pipe(takeWhile(() => this.api_subscribe))
                .subscribe(
                  (GetRoteByShiftData: GetRoteByShiftDataClass[]) => {

                    for (let oneRote of GetRoteByShiftData) {
                      for (let oneSelectDay of ShiftRoteCheckClass.ShiftRoteDate) {
                        if (oneRote.RoteID.toString() == oneSelectDay.RoteID1.toString()) {
                          alert(oneRote.RoteNameC + '班型不允許調班')
                          this.LoadingPage.hide();
                          return
                        } else if (oneRote.RoteID.toString() == oneSelectDay.RoteID2.toString()) {
                          alert(oneRote.RoteNameC + '班型不允許調班')
                          this.LoadingPage.hide();
                          return
                        }
                      }
                    }

                    this.GetApiDataServiceService.getWebApiData_ShiftRoteCheck(ShiftRoteCheckClass)
                      .pipe(takeWhile(() => this.api_subscribe))
                      .subscribe(
                        (data: any) => {
                          if (data.length > 0) {
                            alert(data)
                          } else {
                            this.writeState = 3
                            this.SetUiActive()
                          }
                          this.LoadingPage.hide()
                        }, error => {
                          // alert('與api連線異常，getWebApiData_ShiftRoteCheck')

                          this.LoadingPage.hide()
                        }
                      )

                  }, error => {
                    // alert('與api連線異常，getWebApiData_GetRoteByShift，請確認連線狀態，如連線正常請洽資訊人員')
                    this.LoadingPage.hide();
                  }
                )
            } else {
              alert(q)
            }
            this.LoadingPage.hide()
          }, error => {
            this.LoadingPage.hide()
          }
        )


    }

  }

  disableSend() {
    if (!this.NoteString) {
      return true
    } else if (!this.showCheckDetailDateArray.length) {
      return true
    }
    else if (!this.FlowDynamic_Base) {
      return true
    } else if (!this.checkAgree) {
      return true
    } else {
      return false
    }
  }
  checkCanSendFlow() {
    if (!this.showCheckDetailDateArray.length) {
      alert('未選擇調班日期')
    } else if (!this.NoteString) {
      alert('請填寫調班事由')
    }
    else if (!this.FlowDynamic_Base) {
      alert('請選擇簽核人員')
    }
    else if (!this.checkAgree) {
      alert('勾選調班同意書')
    } else {
      $('#checksenddialog').modal('show')
    }
  }
  checkAgree: boolean
  NoteString: string;


  FlowDynamic_Base: GetSelectBaseClass;
  chooseBase(GetSelectBase: GetSelectBaseClass) {
    this.FlowDynamic_Base = GetSelectBase
  }

  sendFlow() {

    this.LoadingPage.show()
    var ShiftRoteSaveAndFlowStart: ShiftRoteSaveAndFlowStartClass = {
      "FlowApp": {
        "ShiftRoteType": "DR",
        "ShiftRoteName": "請求調班",
        "DifferShift": true,
        "FlowApps": [
          {
            "EmpID1": this.SearchMan.EmpCode,
            "EmpCode1": this.SearchMan.EmpCode,
            "EmpNameC1": this.SearchMan.EmpName,
            "EmpID2": this.SearchMan.EmpCode,
            "EmpCode2": this.SearchMan.EmpCode,
            "EmpNameC2": this.SearchMan.EmpName,
            "Note": this.NoteString,
            "Info": "",
            "MailBody": "",
            "State": "1",
            "ShiftRoteFlowAppsDetail": this.showCheckDetailDateArray
          }
        ],
        "EmpID": this.WriteMan.EmpCode,
        "EmpCode": this.WriteMan.EmpCode,
        "EmpNameC": this.WriteMan.EmpName,
        "State": "1" //1是要簽核
      },
      "FlowDynamic": {
        "FlowNode": "502",
        "RoleID": "",
        "EmpID": this.FlowDynamic_Base.EmpID.toString(),
        "DeptID": this.FlowDynamic_Base.DeptaID.toString(),
        "PosID": this.FlowDynamic_Base.JobID.toString()
      }
    }
    // console.log(ShiftRoteSaveAndFlowStart)
    this.GetApiDataServiceService.getWebApiData_ShiftRoteSaveAndFlowStart(ShiftRoteSaveAndFlowStart)
      .pipe(takeWhile(() => this.api_subscribe))
      .subscribe(
        (x: ResponeStateClass) => {
          if (x.isOK) {
            $('#sussesdialog').modal('show')
          } else {
            var errMsg = ''
            for (let e of x.ErrorMsg) {
              errMsg += e + '。 '
            }
            alert(errMsg);
          }
          this.LoadingPage.hide()
        },
        error => {
          this.LoadingPage.hide()
          // alert('與api連線異常，getWebApiData_ShiftRoteSaveAndFlowStart')
        }

      )


  }

  setActive(writeState) {
    if (writeState) {
      return 'active'
    }
  }


  scrollTo() {
    this.viewScroller.scrollToAnchor('goPageChange');
    //tag=id連結位置
  }

  SetUiActive() {
    $('#navs li').filter('.active').removeClass('active');
    $('#li' + this.writeState.toString()).addClass('active')
    this.scrollTo();
  }

  disableSelectBox(ch: changeClass) {
    var disableCode = ['R', 'Z', 'GBL']
    if (ch.RoteSelectBox.length == 0) {
      return true
    } else {
      for (let code of disableCode) {
        if (code == ch.RoteCode) {
          return true
        }
      }
      return false
    }
  }


  errorEmp = { state: false, errorString: '' };
  chooseEmp() {
    if (this.Assistant_SearchMan.EmpCode.length == 6) {
      this.LoadingPage.show()

      var _NowDate = new Date();
      var _NowToday = doFormatDate(_NowDate);

      var GetBaseByFormClass: GetBaseByFormClass = {
        EmpCode: this.WriteMan.EmpCode,
        AppEmpCode: this.Assistant_SearchMan.EmpCode,
        EffectDate: _NowToday
      }
      this.LoadingPage.show()
      this.GetApiDataServiceService.getWebApiData_GetBaseByFormStaff(GetBaseByFormClass)
        .pipe(takeWhile(() => this.api_subscribe))
        .subscribe((x: any) => {
          if (x) {
            if (x.length == 0) {
              this.errorEmp = { state: true, errorString: '無該部門的行政權限' }
              this.Assistant_SearchMan.EmpName = ''
              $("#Assistant_ChooseEmpCode").addClass("errorInput");
            } else {
              if (x[0].EmpNameC == null) {
                this.Assistant_SearchMan.EmpName = x[0].EmpNameE
              } else if (x[0].EmpNameC.length == 0) {
                this.Assistant_SearchMan.EmpName = x[0].EmpNameE
              } else {
                this.Assistant_SearchMan.EmpName = x[0].EmpNameC
              }
              this.errorEmp = { state: false, errorString: '' }
              $("#Assistant_ChooseEmpCode").removeClass("errorInput");
            }
          } else {
            this.errorEmp = { state: true, errorString: '無該部門的行政權限' }
            this.Assistant_SearchMan.EmpName = ''
            $("#Assistant_ChooseEmpCode").addClass("errorInput");
          }

          this.LoadingPage.hide()
        }, error => {

          this.LoadingPage.hide()
        })
    } else {
      this.Assistant_SearchMan.EmpName = ''
      this.errorEmp = { state: true, errorString: '無該部門的行政權限' }
      $("#Assistant_ChooseEmpCode").addClass("errorInput");
    }
  }
  onSaveEmptoView(event) {
    this.errorEmp = { state: false, errorString: '' }
    $("#Assistant_ChooseEmpCode").removeClass("errorInput");
    this.Assistant_SearchMan.EmpCode = event.split('，')[0]
    this.Assistant_SearchMan.EmpName = event.split('，')[1]
    $('#chooseEmpdialog').modal('hide');
    this.chooseEmp()
  }
  private Be_setGetAttendInfo$: BehaviorSubject<any> = new BehaviorSubject<GetAttendInfoClass>(null);
  Ob_setGetAttendInfo$: Observable<any> = this.Be_setGetAttendInfo$;
  bt_Show_DayRote(change: changeClass) {

    var GetAttendInfo: GetAttendInfoClass = {
      "DateB": doFormatDate(change.Date),
      "DateE": doFormatDate(change.Date),
      "ListEmpID": [
        this.SearchMan.EmpCode
      ],
      "EffectDate": "",
      "Display": "1",
      "ListState": []
    }

    this.Be_setGetAttendInfo$.next(JSON.parse(JSON.stringify(GetAttendInfo)))
    $('#DayRote').modal('show')
  }
}
class changeClass {
  Date: string;
  RoteID: number;
  RoteCode: string;
  RoteNameC: string;
  OnTime: string;
  RoteSelectBox: RoteSelectBoxClass[];
}
class RoteSelectBoxClass {
  RoteID: number
  OnTime: string
  RoteCode: string
  RoteName: string
  outPutSelectText: string

}

class ShiftRoteFlowAppsDetailClass {
  ShiftRoteDate: string
  RoteID1: number
  RoteCode1: string
  RoteName1: string
  RoteID2: number
  RoteCode2: string
  RoteName2: string
}
class showViewRote extends ShiftRoteFlowAppsDetailClass {
  OnTime1: string
  OnTime2: string
  ShiftRoteDateDay: string
}
