import { Component, OnInit, AfterContentInit, OnDestroy, NgZone, AfterViewInit } from '@angular/core';
import { ViewportScroller } from '@angular/common';
import { GetApiDataServiceService } from 'src/app/Service/get-api-data-service.service';
import { GetApiUserService } from 'src/app/Service/get-api-user.service';
import { isValidDate } from 'src/app/UseVoid/void_isVaildDatetime';
import { takeWhile, mergeMap } from 'rxjs/operators';
import { doFormatDate, doFormatDate_getMonthAndDay, formatDateTime, getapi_formatTimetoString } from 'src/app/UseVoid/void_doFormatDate';
import { GetAttendClass } from 'src/app/Models/PostData_API_Class/GetAttendClass';
import { chinesenum } from 'src/app/UseVoid/void_chinesenumber';
import { ShiftRoteSaveAndFlowStartClass } from 'src/app/Models/PostData_API_Class/ShiftRoteSaveAndFlowStartClass';
import { NgxSpinnerService } from 'ngx-spinner';
import { ExampleHeader } from 'src/app/Service/datepickerHeader';
import { FlowShiftRoteCheckClass } from 'src/app/Models/PostData_API_Class/FlowShiftRoteCheckClass';
import { GetBaseByFormClass } from 'src/app/Models/PostData_API_Class/GetBaseByFormClass';
import { BehaviorSubject, Observable } from 'rxjs';
import { uiShowClass } from 'src/app/Models/uiShowClass';
import { valTT_Class, TT_errorDataClass } from 'src/app/Models/valTT_Class';
import { NavigationEnd, Router } from '@angular/router';
import { GetBaseParameterDataClass } from 'src/app/Models/GetBaseParameterDataClass';
import { ResponeStateClass } from 'src/app/Models/ResponeStateClass';

declare let $: any; //use jquery

@Component({
  selector: 'app-change-rz-nr',
  templateUrl: './change-rz-nr.component.html',
  styleUrls: ['./change-rz-nr.component.css']
})
export class ChangeRzNRComponent implements OnInit, AfterViewInit, OnDestroy {
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
    // throw new Error("Method not implemented.");
    this.api_subscribe = false;
  }

  radiogroup: any = [
    { id: 1, name: '自己' },
    { id: 2, name: '行政' }
  ];

  chooseRadio: number = 1;

  api_subscribe = true

  DateB: Date
  agreeCheckbox: boolean = false
  selectRZBoxArray: any;
  selectRZLoading: boolean = false

  Assistant_selectRZBoxArray: any;
  Assistant_selectRZLoading: boolean = false
  Assistant_DateB: Date

  ngZone: NgZone = new NgZone({ enableLongStackTrace: true });

  Assistant_setSelectRzChangeBox() {
    if (this.errorEmp.state) {

    } else if (this.Assistant_SearchMan.EmpCode.length > 0) {
      this.oneP = new oneP_Class()
      this.oneP.EmpCode = this.Assistant_SearchMan.EmpCode
      this.oneP.EmpName = this.Assistant_SearchMan.EmpName

      var selectDateB = doFormatDate(this.Assistant_DateB)
      var ErrorMsg = this.GetApiDataServiceService.getWebApiData_GetShiftRoteDateRange(selectDateB, this.oneP.EmpCode)
        .pipe(takeWhile(() => this.api_subscribe))
        .subscribe(
          (x: any) => {
            if (x.MessageCode) {
              //判斷資料進行中是否有異常錯誤
              alert(this.oneP.EmpCode + x.MessageContent)
              ErrorMsg.unsubscribe()
            } else {
              this.GetApiDataServiceService.getWebApiData_GetHolidayShiftRote(selectDateB, this.oneP.EmpCode)
                .pipe(takeWhile(() => this.api_subscribe))
                .subscribe(
                  (x: Array<any>) => {

                    this.Assistant_selectRZBoxArray = []
                    this.Assistant_selectRZLoading = false

                    this.ngZone.run(() => { });
                    this.LoadingPage.show()
                    var checkHaveDate = x.filter(item => {
                      return formatDateTime(item.AttendDate).getDate == selectDateB
                    })
                    if (x.length > 1) {
                      if (checkHaveDate.length > 0) {
                        // console.log('可換')
                        for (let data of x) {
                          data.AttendDate = formatDateTime(data.AttendDate).getDate
                          if (checkHaveDate[0].ActualRote.RoteID == data.ActualRote.RoteID) {

                          } else {
                            this.Assistant_selectRZBoxArray.push(data)
                            this.Assistant_selectChangeRZ = data
                          }
                        }
                        // console.log(this.selectRZBoxArray)
                        this.Assistant_selectRZLoading = true
                        this.ngZone.run(() => {
                          this.LoadingPage.hide()
                        });
                      } else {
                        this.LoadingPage.hide()
                        alert('此日期不符合休假與例假互換規則')
                      }
                    } else {
                      this.LoadingPage.hide()
                      alert('此日期無互換假別')
                    }

                  }
                  , error => {
                    // alert('與api連線異常，getWebApiData_GetHolidayShiftRote')
                    this.LoadingPage.hide()
                  }
                )
            }
          }, error => {
            // alert('與api連線異常，getWebApiData_GetShiftRoteDateRange')
            this.LoadingPage.hide()
          }
        )
    }

  }

  My_setSelectRzChangeBox() {
    this.oneP = new oneP_Class()
    this.oneP.EmpCode = this.My_SearchMan.EmpCode
    this.oneP.EmpName = this.My_SearchMan.EmpName

    var selectDateB = doFormatDate(this.DateB)
    var ErrorMsg = this.GetApiDataServiceService.getWebApiData_GetShiftRoteDateRange(selectDateB, this.oneP.EmpCode)
      .pipe(takeWhile(() => this.api_subscribe))
      .subscribe(
        (x: any) => {
          if (x.MessageCode) {
            //判斷資料進行中是否有異常錯誤
            alert(this.oneP.EmpCode + x.MessageContent)
            ErrorMsg.unsubscribe()
          } else {
            this.GetApiDataServiceService.getWebApiData_GetHolidayShiftRote(selectDateB, this.oneP.EmpCode)
              .pipe(takeWhile(() => this.api_subscribe))
              .subscribe(
                (x: Array<any>) => {

                  this.selectRZBoxArray = []
                  this.selectRZLoading = false

                  this.ngZone.run(() => { });
                  this.LoadingPage.show()
                  var checkHaveDate = x.filter(item => {
                    return formatDateTime(item.AttendDate).getDate == selectDateB
                  })
                  if (x.length > 1) {
                    if (checkHaveDate.length > 0) {
                      // console.log('可換')
                      for (let data of x) {
                        data.AttendDate = formatDateTime(data.AttendDate).getDate
                        if (checkHaveDate[0].ActualRote.RoteID == data.ActualRote.RoteID) {

                        } else {
                          this.selectRZBoxArray.push(data)
                          this.selectChangeRZ = data
                        }
                      }
                      // console.log(this.selectRZBoxArray)
                      this.selectRZLoading = true
                      this.ngZone.run(() => {
                        this.LoadingPage.hide()
                      });
                    } else {
                      this.LoadingPage.hide()
                      alert('此日期不符合休假與例假互換規則')
                    }
                  } else {
                    this.LoadingPage.hide()
                    alert('此日期無互換假別')
                  }

                }
                , error => {
                  // alert('與api連線異常，getWebApiData_GetHolidayShiftRote')
                  this.LoadingPage.hide()
                }
              )
          }
        }, error => {
          // alert('與api連線異常，getWebApiData_GetShiftRoteDateRange')
          this.LoadingPage.hide()
        }
      )
  }


  selectChangeRZ: any = ''
  Assistant_selectChangeRZ: any = ''

  writeState = 1; //步驟一

  oneP: oneP_Class = new oneP_Class()

  WriteMan = { EmpCode: '', EmpName: '' }
  Assistant_SearchMan = { EmpCode: '', EmpName: '' }
  My_SearchMan = { EmpCode: '', EmpName: '' }


  constructor(private router: Router,
    private GetApiDataServiceService: GetApiDataServiceService,
    private GetApiUserService: GetApiUserService,
    private viewScroller: ViewportScroller,
    private LoadingPage: NgxSpinnerService) { }

  showBlockIsAssistant: boolean = false

  RouteReload() {
    this.showBlockIsAssistant = false
    this.chooseRadio = 1;

    this.api_subscribe = true

    this.DateB = null
    this.agreeCheckbox = false
    this.selectRZBoxArray = [];
    this.selectRZLoading = false

    this.Assistant_selectRZBoxArray = [];
    this.Assistant_selectRZLoading = false
    this.Assistant_DateB = null

    this.selectChangeRZ = ''
    this.Assistant_selectChangeRZ = ''

    this.writeState = 1; //步驟一

    this.oneP = new oneP_Class()

    this.WriteMan = { EmpCode: '', EmpName: '' }
    this.Assistant_SearchMan = { EmpCode: '', EmpName: '' }
    this.My_SearchMan = { EmpCode: '', EmpName: '' }
    this.selectDay = new selectuiShow()
    this.selectChangeDay = new selectuiShow()

    this.NoteString = null
    this.errorEmp = { state: false, errorString: '' };
  }
  ngOnInit() {
    // this.RouteReload()
    this.GetApiUserService.counter$.subscribe(
      (x: any) => {
        if (x == 0) {

        } else {
          this.WriteMan.EmpCode = x.EmpCode
          this.My_SearchMan.EmpCode = x.EmpCode
          this.oneP.EmpCode = x.EmpCode

          this.showBlockIsAssistant = x.IsAssistant
          if (x.EmpNameC) {
            this.WriteMan.EmpName = x.EmpNameC
            this.My_SearchMan.EmpName = x.EmpNameC
            this.oneP.EmpName = x.EmpNameC
          } else {
            this.WriteMan.EmpName = x.EmpNameE
            this.My_SearchMan.EmpName = x.EmpNameC
            this.oneP.EmpName = x.EmpNameE
          }
        }
      }
    )

  }

  selectDay: selectuiShow
  selectChangeDay: selectuiShow

  scrollTo() {
    this.viewScroller.scrollToAnchor('goPageChange');
    //tag=id連結位置
  }

  SetUiActive() {
    $('#navs li').filter('.active').removeClass('active');
    $('#li' + this.writeState.toString()).addClass('active')
    this.scrollTo();
  }

  Assistant_nextPage() {
    if (this.errorEmp.state) {

    } else {
      this.GetApiDataServiceService.getWebApiData_GetBaseParameter(this.Assistant_SearchMan.EmpCode)
        .pipe(takeWhile(() => this.api_subscribe))
        .subscribe((GetBaseParameterData: GetBaseParameterDataClass[]) => {
          if (GetBaseParameterData.length > 0) {
            if (GetBaseParameterData[0].IsAllowLeave) {
              this.nextPage(this.Assistant_DateB, this.Assistant_selectChangeRZ, this.Assistant_selectRZLoading, this.Assistant_SearchMan.EmpCode, true)


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
  My_nextPage() {
    if (this.DateB) {

      var today = new Date()
      today.setHours(0, 0, 0)
      today.setMinutes(0, 0, 0)
      today.setSeconds(0, 0)

      this.DateB.setHours(0, 0, 0)
      this.DateB.setMinutes(0, 0, 0)
      this.DateB.setSeconds(0, 0)

      var selectDate = new Date(this.selectChangeRZ.AttendDate)
      selectDate.setHours(0, 0, 0)
      selectDate.setMinutes(0, 0, 0)
      selectDate.setSeconds(0, 0)

      if (today > this.DateB) {
        alert('例休日不能申請今天之前')
      } else if (today > selectDate) {
        alert('互換例休日不能申請今天之前')
      }
      else {
        this.GetApiDataServiceService.getWebApiData_GetBaseParameter(this.My_SearchMan.EmpCode)
          .pipe(takeWhile(() => this.api_subscribe))
          .subscribe((GetBaseParameterData: GetBaseParameterDataClass[]) => {
            if (GetBaseParameterData.length > 0) {
              if (GetBaseParameterData[0].IsAllowLeave) {
                this.nextPage(this.DateB, this.selectChangeRZ, this.selectRZLoading, this.My_SearchMan.EmpCode, false)

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
  val_TT(selectDay: string[]) {
    //地服處內規檢查
    var CheckTTrule: valTT_Class = new valTT_Class() //state:false為不符合規則
    CheckTTrule.TT_errorData = new TT_errorDataClass()
    CheckTTrule.TT_errorData.ErrorDate = []
    CheckTTrule.TT_errorData.CorrectDateString = []

    for (let oneSelectDay of selectDay) {

      var today = new Date()

      var calDate = new Date(oneSelectDay)
      var vaDay = calDate.getDay()
      if (vaDay == 0) {
        vaDay = 7
      }
      calDate.setDate(calDate.getDate() - (vaDay + 1))
      calDate.setHours(24, 0, 0)
      calDate.setMinutes(0, 0, 0)
      calDate.setSeconds(0, 0)
      if (calDate > today) {
        //調班內規：前一周星期六24:00前於系統中申請(班表週期:星期一至星期日為一週期)

      } else {
        // alert('最晚在\t' + doFormatDate(calDate) + '\t08:00前提出')
        CheckTTrule.TT_errorData.ErrorDate.push(oneSelectDay)
        calDate.setDate(calDate.getDate() - 1)
        CheckTTrule.TT_errorData.CorrectDateString.push(doFormatDate(calDate) + ' 24:00')
      }
    }
    if (CheckTTrule.TT_errorData.ErrorDate.length > 0) {
      CheckTTrule.State = false
    } else {
      CheckTTrule.State = true
    }
    return CheckTTrule
  }

  nextPage(_DateB: Date, _selectChangeRZ, _selectRZLoading, _searchEmpCode: string, search_IsAssistant: boolean) {
    if (_selectRZLoading && _selectChangeRZ.length != 0) {
      // console.log(this.selectChangeRZ)
      if (search_IsAssistant) {
        //行政不限制
        this.CheckAndNext(_DateB, _selectChangeRZ, _selectRZLoading)
      } else {
        //非行政

        this.GetApiDataServiceService.getWebApiData_IsTZTT(_searchEmpCode)
          .pipe(takeWhile(() => this.api_subscribe))
          .subscribe(
            (d: boolean) => {
              var canNext: boolean = false
              var selectDayArray = []
              selectDayArray.push(doFormatDate(_DateB))
              selectDayArray.push(_selectChangeRZ.AttendDate)
              if (d) {
                if (this.val_TT(selectDayArray).State) {
                  //如果通過地服處內規
                  canNext = true
                } else {
                  var errorString = '';
                  for (let i = 0; i < this.val_TT(selectDayArray).TT_errorData.ErrorDate.length; i++) {
                    errorString += _searchEmpCode + ' ' + this.val_TT(selectDayArray).TT_errorData.ErrorDate[i] + ' ' + '應' + ' ' + this.val_TT(selectDayArray).TT_errorData.CorrectDateString[i] + ' ' + '前申請調班\n'
                  }
                  alert(errorString)
                  canNext = false
                  this.LoadingPage.hide()
                }
              } else {
                //如果不是地服處人員 不檢查內規
                canNext = true
              }


              if (canNext) {
                //是地服處就檢查內規，不是地服處就不檢查 -> 最後流程檢查
                this.CheckAndNext(_DateB, _selectChangeRZ, _selectRZLoading)
              }
              // this.LoadingPage.hide()
            }, error => {
              this.LoadingPage.hide()
            }
          )
      }
    } else {
      alert('請選擇互換例休日')

      this.LoadingPage.hide()
    }
  }

  CheckAndNext(_DateB, _selectChangeRZ, _selectRZLoading) {

    this.LoadingPage.show()
    var FlowShiftRoteCheck: FlowShiftRoteCheckClass = {
      "EmpID1": this.oneP.EmpCode,
      "EmpID2": this.oneP.EmpCode,
      "ListShiftDate": []
    }
    FlowShiftRoteCheck.ListShiftDate.push(doFormatDate(_DateB))
    FlowShiftRoteCheck.ListShiftDate.push(_selectChangeRZ.AttendDate)

    this.GetApiDataServiceService.getWebApiData_FlowShiftRoteCheck(FlowShiftRoteCheck)
      .pipe(takeWhile(() => this.api_subscribe))
      .subscribe(
        (q: any) => {
          if (q == '1') {
            var first = this.GetApiDataServiceService.getWebApiData_GetShiftRoteDateRange(_selectChangeRZ.AttendDate, this.oneP.EmpCode)
              .pipe(
                mergeMap(
                  (x: any) => {
                    if (x.MessageCode) {
                      //判斷資料進行中是否有異常錯誤
                      alert(this.oneP.EmpCode + x.MessageContent)
                      first.unsubscribe()
                    } else {

                      var Attend: GetAttendClass = {
                        DateB: x.DateA,
                        DateE: x.DateD,
                        ListEmpID: [this.oneP.EmpCode],
                        ListRoteID: null
                      }
                      return this.GetApiDataServiceService.getWebApiData_GetAttend(Attend)
                    }
                  }
                )
              )
              .pipe(takeWhile(() => this.api_subscribe))
              .subscribe(
                (x: any) => {
                  // console.log(x)
                  this.selectDay = null
                  this.selectChangeDay = null
                  this.oneP = {
                    EmpCode: this.oneP.EmpCode,
                    EmpName: this.oneP.EmpName,
                    work: []
                  }
                  for (let data of x) {
                    var setAttendDate = doFormatDate_getMonthAndDay(formatDateTime(data.AttendDate).getDate)
                    var isSelect: boolean = false
                    var dataAttenDate = formatDateTime(data.AttendDate).getDate
                    var calDate = new Date(formatDateTime(data.AttendDate).getDate + ' ' + getapi_formatTimetoString(formatDateTime(data.AttendDate).getTime))
                    var calDate_dayofweek = calDate.getDay()
                    if (calDate_dayofweek == 0) {
                      calDate_dayofweek = 7
                    }


                    var selectDateB = doFormatDate(_DateB)
                    if (dataAttenDate == _selectChangeRZ.AttendDate || dataAttenDate == selectDateB) {
                      isSelect = true
                      var showDayofWeek = ''
                      if (calDate_dayofweek == 7) {
                        showDayofWeek = '日'
                      } else {
                        showDayofWeek = chinesenum(calDate_dayofweek)
                      }

                      if (!this.selectDay) {

                        this.selectDay = {
                          date: setAttendDate,
                          job: data.ActualRote.RoteCode,
                          RoteName: data.ActualRote.RoteNameC,
                          RoteID: data.ActualRote.RoteID,
                          realdate: formatDateTime(data.AttendDate).getDate,
                          isSelect: isSelect,
                          dayofweek: showDayofWeek
                        }
                      } else {
                        this.selectChangeDay = {
                          date: setAttendDate,
                          job: data.ActualRote.RoteCode,
                          RoteName: data.ActualRote.RoteNameC,
                          RoteID: data.ActualRote.RoteID,
                          realdate: formatDateTime(data.AttendDate).getDate,
                          isSelect: isSelect,
                          dayofweek: showDayofWeek
                        }
                      }

                    }
                    this.oneP.work.push(
                      {
                        date: setAttendDate,
                        job: data.ActualRote.RoteCode,
                        realdate: formatDateTime(data.AttendDate).getDate,
                        RoteName: data.ActualRote.RoteNameC,
                        RoteID: data.ActualRote.RoteID,
                        isSelect: isSelect,
                        dayofweek: chinesenum(calDate_dayofweek)
                      })
                  }


                  var setDate = []
                  for (let data of x) {
                    setDate.push(formatDateTime(data.AttendDate).getDate)
                  }
                  var changeDate = []
                  changeDate.push(
                    {
                      "ShiftDate": this.selectDay.realdate,
                      "RoteID1": this.selectDay.RoteID,
                      "RoteID2": this.selectChangeDay.RoteID
                    },
                    {
                      "ShiftDate": this.selectChangeDay.realdate,
                      "RoteID1": this.selectChangeDay.RoteID,
                      "RoteID2": this.selectDay.RoteID
                    }
                  )
                  var check = {
                    "EmpID1": this.oneP.EmpCode,
                    "EmpID2": this.oneP.EmpCode,
                    "ShiftRoteDate": changeDate,
                    "IsDifferShift": true //true:等工時，false:不等工時
                  }
                  this.GetApiDataServiceService.getWebApiData_ShiftRoteCheck(check)
                    .subscribe(
                      (y: any) => {
                        if (y.length > 0) {
                          alert(y)
                        } else {
                          //調班檢查(單人)成功
                          this.writeState += 1;
                          this.SetUiActive()
                        }
                        this.LoadingPage.hide()
                      }, error => {
                        this.LoadingPage.hide()
                      }
                    )


                },
                (error: any) => {
                  // alert('與api連線異常，第一個人員，getWebApiData_GetShiftRoteDateRange')

                  this.LoadingPage.hide()
                }
              )
          } else {
            alert(q)
            this.LoadingPage.hide()
          }
        }, error => {
          this.LoadingPage.hide()
        }
      )
  }
  setDivStyle(selectData: selectuiShow) {
    if (selectData.isSelect) {
      return 'selectDiv'
    } else {
      return 'DivStyle'
    }
  }

  prePage() {
    // this.selectChangeRZ = ''
    this.writeState -= 1;
    // this.selectDay = []
    // for (let ui of this.uiShow) {
    //   ui.Clickselect = false
    // }
    this.SetUiActive()
  }

  NoteString: string



  disableSend() {
    if (!this.NoteString) {
      return true
    } else if (!this.agreeCheckbox) {
      return true
    } else {
      return false
    }
  }
  checksenderror() {

    if (!this.NoteString) {
      alert('請輸入調班事由')
    } else if (!this.agreeCheckbox) {
      alert('請勾選同意書')
    } else {
      $('#checksenddialog').modal('show');
    }
  }

  sendandSaveChangeform() {
    // console.log(this.selectDay)
    var sendShift = []
    sendShift.push(
      {
        "ShiftRoteDate": this.selectDay.realdate,
        "RoteID1": this.selectDay.RoteID,
        "RoteCode1": this.selectDay.job,
        "RoteName1": this.selectDay.RoteName,
        "RoteID2": this.selectChangeDay.RoteID,
        "RoteCode2": this.selectChangeDay.job,
        "RoteName2": this.selectChangeDay.RoteName
      }
    )
    sendShift.push(
      {
        "ShiftRoteDate": this.selectChangeDay.realdate,
        "RoteID1": this.selectChangeDay.RoteID,
        "RoteCode1": this.selectChangeDay.job,
        "RoteName1": this.selectChangeDay.RoteName,
        "RoteID2": this.selectDay.RoteID,
        "RoteCode2": this.selectDay.job,
        "RoteName2": this.selectDay.RoteName
      }
    )

    var ShiftRoteSaveAndFlowStart: ShiftRoteSaveAndFlowStartClass = {
      "FlowApp": {
        "ShiftRoteType": "RZ",
        "ShiftRoteName": "例休互調",
        "DifferShift": true,
        "FlowApps": [
          {
            "EmpID1": this.oneP.EmpCode,
            "EmpCode1": this.oneP.EmpCode,
            "EmpNameC1": this.oneP.EmpName,
            "EmpID2": this.oneP.EmpCode,
            "EmpCode2": this.oneP.EmpCode,
            "EmpNameC2": this.oneP.EmpName,
            "Note": this.NoteString,
            "Info": "",
            "MailBody": "",
            "State": "1",
            "ShiftRoteFlowAppsDetail": sendShift
          }
        ],
        "EmpID": this.WriteMan.EmpCode,
        "EmpCode": this.WriteMan.EmpCode,
        "EmpNameC": this.WriteMan.EmpName,
        "State": "3" //3是直接核准
      },
      "FlowDynamic": {
        "FlowNode": "502",
        "RoleID": "",
        "EmpID": "",
        "DeptID": "",
        "PosID": ""
      }
    }
    // console.log(ShiftRoteSaveAndFlowStart)
    this.LoadingPage.show()
    this.GetApiDataServiceService.getWebApiData_ShiftRoteSaveAndFlowStart(ShiftRoteSaveAndFlowStart)
      .pipe(takeWhile(() => this.api_subscribe))
      .subscribe(
        (x: ResponeStateClass) => {
          // console.log(SaveAndFlowStart)
          if (x.isOK) {
            $('#sussesdialog').modal('show');
          } else {
            var errMsg = ''
            for (let e of x.ErrorMsg) {
              errMsg += e + '。 '
            }
            alert(errMsg);
          }
          this.LoadingPage.hide()
        }, error => {
          // alert('與api連線異常，getWebApiData_ShiftRoteSaveAndFlowStart')
          this.LoadingPage.hide()
        }
      )
  }

  errorEmp = { state: false, errorString: '' };
  chooseEmp() {
    this.Assistant_selectRZLoading = false
    this.Assistant_DateB = null
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
            } else {
              if (x[0].EmpNameC == null) {
                this.Assistant_SearchMan.EmpName = x[0].EmpNameE
              } else if (x[0].EmpNameC.length == 0) {
                this.Assistant_SearchMan.EmpName = x[0].EmpNameE
              } else {
                this.Assistant_SearchMan.EmpName = x[0].EmpNameC
              }
              this.errorEmp = { state: false, errorString: '' }
            }
          } else {
            this.errorEmp = { state: true, errorString: '無該部門的行政權限' }
            this.Assistant_SearchMan.EmpName = ''
          }

          this.LoadingPage.hide()
        }, error => {

          this.LoadingPage.hide()
        })
    } else {
      this.Assistant_SearchMan.EmpName = ''
      this.errorEmp = { state: true, errorString: '無該部門的行政權限' }
    }
  }
  onSaveEmptoView(event) {
    this.errorEmp = { state: false, errorString: '' }
    this.Assistant_SearchMan.EmpCode = event.split('，')[0]
    this.Assistant_SearchMan.EmpName = event.split('，')[1]
    this.Assistant_selectRZLoading = false
    this.Assistant_DateB = null
    $('#chooseEmpdialog').modal('hide');
    this.chooseEmp()
  }

  private Be_setGetRoteInfo$: BehaviorSubject<any> = new BehaviorSubject<Array<number>>(null);
  Ob_setGetRoteInfo$: Observable<any> = this.Be_setGetRoteInfo$;

  bt_Show_RoteInfo(oneSearchRoteID: number) {
    var searchRoteID: Array<number> = []
    if (oneSearchRoteID) {
      searchRoteID.push(oneSearchRoteID)
      this.Be_setGetRoteInfo$.next(searchRoteID)
      $('#RoteInf').modal('show')
    }
  }
}

export class oneP_Class {
  EmpCode: string
  EmpName: string
  work: selectuiShow[]
}
export class selectuiShow {
  date: string;
  job: string;
  RoteID: string;
  RoteName: string;
  realdate: string;
  isSelect: boolean;
  dayofweek: string
}
