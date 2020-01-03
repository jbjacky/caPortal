import { Component, OnInit, ViewChild, AfterViewInit, ElementRef, OnDestroy } from '@angular/core';
import { GetApiUserService } from 'src/app/Service/get-api-user.service';
import { doFormatDate, formatDateTime, doFormatDate_getMonthAndDay } from 'src/app/UseVoid/void_doFormatDate';
import { weekDate } from 'src/app/UseVoid/void_weekDate';
import { GetApiDataServiceService } from 'src/app/Service/get-api-data-service.service';
import { mergeMap, takeWhile } from 'rxjs/operators';
import { GetAttendClass } from 'src/app/Models/PostData_API_Class/GetAttendClass';
import { ViewportScroller } from '@angular/common';
import { ShiftRoteSaveAndFlowStartClass } from 'src/app/Models/PostData_API_Class/ShiftRoteSaveAndFlowStartClass';
import { ShiftRoteCheckByTwoPersonClass } from 'src/app/Models/PostData_API_Class/ShiftRoteCheckByTwoPersonClass';
import { NgxSpinnerService } from 'ngx-spinner';
import { GetBaseByFormClass } from 'src/app/Models/PostData_API_Class/GetBaseByFormClass';
import { ExampleHeader } from 'src/app/Service/datepickerHeader';
import { uiShowClass } from 'src/app/Models/uiShowClass';
import { FlowShiftRoteCheckClass } from 'src/app/Models/PostData_API_Class/FlowShiftRoteCheckClass';
import { AprovedShiftRoteSaveAndFlowStartClass } from 'src/app/Models/PostData_API_Class/AprovedShiftRoteSaveAndFlowStartClass';
import { GetRoteByShiftDataClass } from 'src/app/Models/GetRoteByShiftDataClass';
import { valTT_Class, TT_errorDataClass } from 'src/app/Models/valTT_Class';
import { reallyData_P } from 'src/app/Models/reallyData_P';
import { Router, NavigationEnd } from '@angular/router';
import { void_crossDay } from 'src/app/UseVoid/void_crossDay';
import { BehaviorSubject, Observable } from 'rxjs';
import { GetBaseParameterDataClass } from 'src/app/Models/GetBaseParameterDataClass';
import { ResponeStateClass } from 'src/app/Models/ResponeStateClass';
declare let $: any; //use jquery

@Component({
  selector: 'app-change-two-r',
  templateUrl: './change-two-r.component.html',
  styleUrls: ['./change-two-r.component.css']
})

export class ChangeTwoRComponent implements OnInit, AfterViewInit, OnDestroy {
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


  api_subscribe = true; //ngOnDestroy時要取消訂閱api的subscribe


  ShowDetail: uiShowClass[] = []

  uiShow: uiShowClass[] = []
  selectDay: uiShowClass[] = []

  R_Route = '' //休息日
  Z_Route = '' //例假日
  uiDisableArray = [] //例假日、國定假日、特定不能調班的班型


  Emp = { EmpCode: '', EmpName: '' }
  ChangeEmp = { EmpCode: '', EmpName: '' }

  My_Emp = { EmpCode: '', EmpName: '' }
  My_ChangeEmp = { EmpCode: '', EmpName: '' }
  Assistant_Emp = { EmpCode: '', EmpName: '' }
  Assistant_ChangeEmp = { EmpCode: '', EmpName: '' }
  My_searchDate: Date
  Assistant_searchDate: Date

  ReallyWriteMan = { EmpCode: '', EmpName: '' }

  oneP: reallyData_P = new reallyData_P()
  twoP: reallyData_P = new reallyData_P()

  writeState = 1; //步驟一


  agreeCheckbox: boolean = false


  searchDate: Date

  constructor(private router: Router,
    private GetApiUserService: GetApiUserService,
    private GetApiDataServiceService: GetApiDataServiceService,
    private viewScroller: ViewportScroller,
    private LoadingPage: NgxSpinnerService) { }

  showBlockIsAssistant: boolean = false //是否有行政權限
  search_IsAssistant: boolean = false //是否用行政權限搜尋

  RouteReload() {
    this.chooseRadio = 1;


    this.api_subscribe = true; //ngOnDestroy時要取消訂閱api的subscribe


    this.ShowDetail = []

    this.uiShow = []
    this.selectDay = []


    this.Emp = { EmpCode: '', EmpName: '' }
    this.ChangeEmp = { EmpCode: '', EmpName: '' }

    this.My_Emp = { EmpCode: '', EmpName: '' }
    this.My_ChangeEmp = { EmpCode: '', EmpName: '' }
    this.Assistant_Emp = { EmpCode: '', EmpName: '' }
    this.Assistant_ChangeEmp = { EmpCode: '', EmpName: '' }
    this.My_searchDate = null
    this.Assistant_searchDate = null

    this.ReallyWriteMan = { EmpCode: '', EmpName: '' }

    this.oneP = new reallyData_P()
    this.twoP = new reallyData_P()

    this.writeState = 1; //步驟一


    this.agreeCheckbox = false


    this.searchDate = null
    this.today = new Date()
    this.My_errorChangeEmpState = { state: false, errorString: '' }
    this.Assistant_errorEmpState = { state: false, errorString: '' }
    this.Assistant_errorChangeEmpState = { state: false, errorString: '' }
    this.NoteText = null
  }
  ngOnInit() {
    // this.RouteReload()
    this.GetApiUserService.counter$.subscribe(
      x => {
        // console.log(x)
        // this.oneP.code = x.EmpCode
        this.My_Emp.EmpCode = x.EmpCode
        this.ReallyWriteMan.EmpCode = x.EmpCode

        this.showBlockIsAssistant = x.IsAssistant
        if (x.EmpNameC) {
          // this.oneP.name = x.EmpNameC;
          this.My_Emp.EmpName = x.EmpNameC;
          this.ReallyWriteMan.EmpName = x.EmpNameC;
        } else {
          // this.oneP.name = x.EmpNameE;
          this.My_Emp.EmpName = x.EmpNameE;
          this.ReallyWriteMan.EmpName = x.EmpNameE;
        }
      }
    )

    this.GetApiDataServiceService.getWebApiData_GetRoteMappingByHoliday()
      .pipe(mergeMap((x: any) => {
        return this.GetApiDataServiceService.getWebApiData_GetRote([x.OffDay, x.NationalHoliday, x.Holidays])
      }))
      .pipe(takeWhile(() => this.api_subscribe))
      .subscribe(

        (y: any) => {
          this.uiDisableArray = []
          this.uiDisableArray.push('0W')

          for (let data of y) {
            if (data.RoteMapping.RoteMappingCode == 'OffDay') {
              //休息日
              this.R_Route = data.RoteCode
            } else if (data.RoteMapping.RoteMappingCode == 'NationalHoliday') {
              //國定假日
              this.uiDisableArray.push(data.RoteCode)
            } else if (data.RoteMapping.RoteMappingCode == 'Holidays') {
              //例假日
              this.Z_Route = data.RoteCode
              this.uiDisableArray.push(data.RoteCode)
            }
          }

        },
        (error: any) => {
          // alert('與api連線異常，getWebApiData_GetRoteMappingByHoliday')
        }
      )
  }
  SetUiChangeDate() {
    this.uiShow = [];
    for (let oP of this.oneP.work) {
      if (oP.job == this.Z_Route) {
        this.uiShow.push({
          reallydate: oP.realDate,
          date: oP.date, oneP: oP.job,
          twoP: '',
          twoPRoteID: '',
          onePRoteID: oP.RoteID,
          onePRoteName: oP.RoteName,
          twoPRoteName: '',
          disable: true,
          Clickselect: false,
          oneP_OnTime: void_crossDay(oP.OnTime).EndTime,
          oneP_OffTime: void_crossDay(oP.OffTime).EndTime,
          twoP_OnTime: '',
          twoP_OffTime: ''
        })
      } else {
        this.uiShow.push({
          reallydate: oP.realDate,
          date: oP.date,
          oneP: oP.job,
          twoP: '',
          twoPRoteID: '',
          onePRoteID: oP.RoteID,
          onePRoteName: oP.RoteName,
          twoPRoteName: '',
          disable: false,
          Clickselect: false,
          oneP_OnTime: void_crossDay(oP.OnTime).EndTime,
          oneP_OffTime: void_crossDay(oP.OffTime).EndTime,
          twoP_OnTime: '',
          twoP_OffTime: ''
        })
      }
    }

    for (let tP of this.twoP.work) {
      for (let ui of this.uiShow) {
        if (ui.date == tP.date) {
          ui.twoP = tP.job
          ui.twoPRoteName = tP.RoteName
          ui.twoPRoteID = tP.RoteID
          ui.twoP_OnTime = void_crossDay(tP.OnTime).EndTime
          ui.twoP_OffTime = void_crossDay(tP.OffTime).EndTime

          if (tP.job == this.Z_Route) {
            ui.disable = true;

          }
        }
      }
    }
    this.RRoneZ_Disable()
  }
  today = new Date()
  RRoneZ_Disable() {
    for (let ui of this.uiShow) {
      var uiDate = new Date()
      uiDate.setFullYear((parseInt(ui.reallydate.split('/')[0])))
      uiDate.setMonth((parseInt(ui.date.split('/')[0]) - 1))
      uiDate.setDate(parseInt(ui.date.split('/')[1]))
      uiDate.setHours(0, 0, 0)
      if (ui.oneP == this.R_Route && ui.twoP == this.R_Route) {
        ui.disable = true
      } else {
        ui.disable = false
        if (this.uiDisableArray.filter(x => x == ui.oneP).length > 0
          || this.uiDisableArray.filter(y => y == ui.twoP).length > 0
          || ui.oneP.length == 0
          || ui.twoP.length == 0) {
          ui.disable = true
        } else {
          ui.disable = false
        }
      }

      // console.log({uiDate:uiDate,today:this.today})
      // 如果是行政可以從這把權限拿掉，可調今天以前

      if (this.search_IsAssistant) {

      } else if (uiDate < this.today) {
        ui.disable = true
      }
    }
  }
  selectDiv(data: uiShowClass, index) {
    if (data.disable) {

    } else {

      if ($(".ui" + index).hasClass("selectDiv")) {
        $(".ui" + index).removeClass("selectDiv");
        $(".uidate" + index).removeClass("selectDateDiv");
        $(".uijob" + index).removeClass("selectJobDiv");

        // $(".ui_check" + index).removeClass("selectDiv");
        // $(".uidate_check" + index).removeClass("selectDateDiv_check");
        // $(".uijob_check" + index).removeClass("selectJobDiv");
        this.uiShow[index].Clickselect = false
        var splice_number = 0
        for (let i = 0; i < this.selectDay.length; i++) {
          if (data == this.selectDay[i]) {
            splice_number = i
          }
        }
        this.selectDay.splice(splice_number, 1)
        if (this.selectDay.length == 0) {
          this.RRoneZ_Disable()
        } else if (this.selectDay.length == 1) {
          this.RRoneZ_Disable()
          if (this.selectDay[0].oneP == this.R_Route || this.selectDay[0].twoP == this.R_Route) {
            for (let ui of this.uiShow) {
              if (ui.oneP != this.R_Route && ui.twoP != this.R_Route) {
                ui.disable = true
              } else if (this.selectDay[0] != ui && this.selectDay[0].oneP == this.R_Route && ui.oneP == this.R_Route) {
                ui.disable = true
              } else if (this.selectDay[0] != ui && this.selectDay[0].twoP == this.R_Route && ui.twoP == this.R_Route) {
                ui.disable = true
              }
            }
          } else {
            if (this.selectDay[0].oneP != this.R_Route && this.selectDay[0].twoP != this.R_Route) {
              for (let ui of this.uiShow) {
                if (ui.oneP == this.R_Route || ui.twoP == this.R_Route) {
                  ui.disable = true
                }
              }
            }
          }
        }

      } else {
        $(".ui" + index).addClass("selectDiv");
        $(".uidate" + index).addClass("selectDateDiv");
        $(".uijob" + index).addClass("selectJobDiv");

        // $(".ui_check" + index).addClass("selectDiv");
        // $(".uidate_check" + index).addClass("selectDateDiv_check");
        // $(".uijob_check" + index).addClass("selectJobDiv");
        // console.log(data);

        this.uiShow[index].Clickselect = true

        if (data.oneP == this.R_Route || data.twoP == this.R_Route) {
          for (let ui of this.uiShow) {
            if (ui.oneP != this.R_Route && ui.twoP != this.R_Route) {
              ui.disable = true
            } else if (data != ui && data.oneP == this.R_Route && ui.oneP == this.R_Route) {
              ui.disable = true
            } else if (data != ui && data.twoP == this.R_Route && ui.twoP == this.R_Route) {
              ui.disable = true
            }
          }
        } else {
          if (data.oneP != this.R_Route && data.twoP != this.R_Route) {
            for (let ui of this.uiShow) {
              if (ui.oneP == this.R_Route || ui.twoP == this.R_Route) {
                ui.disable = true
              }
            }
          }
        }
        this.selectDay.push(data)
      }
    }
  }
  showRerror() {
    var calnumber = 0
    for (let one_selectDay of this.selectDay) {
      if (one_selectDay.oneP == this.R_Route || one_selectDay.twoP == this.R_Route) {
        calnumber = calnumber + 1
      }
    }
    if (calnumber == 1 || calnumber == 3 || calnumber == 5) {

      return true
    } else {
      return false
    }
  }
  errorTest() {
    var Empcode = this.Emp.EmpCode
    var changeEmpCode = this.ChangeEmp.EmpCode
    var changeDate = doFormatDate(this.searchDate)
    if (!Empcode) {
      alert('請填寫員工')
      return false
    } else if (!changeEmpCode) {
      alert('請填寫互調員工')
      return false
    } else if (!changeDate) {
      alert('請填寫調班日')
      return false
    } else {
      return true
    }
  }

  My_onSearch() {
    this.Emp = this.My_Emp
    this.ChangeEmp = this.My_ChangeEmp
    this.searchDate = this.My_searchDate
    this.search_IsAssistant = false

    var today: any = new Date()
    var calSearchDate: any = new Date(this.My_searchDate)
    today.setHours(0, 0, 0)
    today.setMinutes(0, 0, 0)
    today.setSeconds(0, 0)

    calSearchDate.setHours(0, 0, 0)
    calSearchDate.setMinutes(0, 0, 0)
    calSearchDate.setSeconds(0, 0)
    if (today > calSearchDate) {
      alert('調班日不能申請今天以前')
    } else if (this.My_errorChangeEmpState.state) {

    } else {
      this.CheckSendFormLimit()
    }
  }

  Assistant_onSearch() {
    this.Emp = this.Assistant_Emp
    this.ChangeEmp = this.Assistant_ChangeEmp
    this.searchDate = this.Assistant_searchDate
    this.search_IsAssistant = true
    if (this.Assistant_Emp.EmpCode == this.Assistant_ChangeEmp.EmpCode) {
      alert('員工與互調員工不能為同一人')
    } else {
      if (this.Assistant_errorEmpState.state || this.Assistant_errorChangeEmpState.state) {

      } else {
        this.CheckSendFormLimit()
      }
    }


  }

  CheckSendFormLimit() {
    this.LoadingPage.show()
    this.GetApiDataServiceService.getWebApiData_GetBaseParameter(this.Emp.EmpCode)
      .pipe(takeWhile(() => this.api_subscribe))
      .subscribe((GetBaseParameterData: GetBaseParameterDataClass[]) => {
        if (GetBaseParameterData.length > 0) {
          if (GetBaseParameterData[0].IsAllowLeave) {

            this.GetApiDataServiceService.getWebApiData_GetBaseParameter(this.ChangeEmp.EmpCode)
              .pipe(takeWhile(() => this.api_subscribe))
              .subscribe((GetBaseParameterData: GetBaseParameterDataClass[]) => {
                if (GetBaseParameterData.length > 0) {
                  if (GetBaseParameterData[0].IsAllowLeave) {
                    this.onSearch()
                  } else {
                    alert(this.ChangeEmp.EmpCode.toString() + '此員工無申請表單權限，如需申請表單請洽單位行政設定')
                    this.LoadingPage.hide()
                  }
                } else {
                  alert(this.ChangeEmp.EmpCode.toString() + '此員工無申請表單權限，如需申請表單請洽單位行政設定')
                  this.LoadingPage.hide()
                }
              })
          } else {
            alert(this.Emp.EmpCode.toString() + '此員工無申請表單權限，如需申請表單請洽單位行政設定')
            this.LoadingPage.hide()
          }
        } else {
          alert(this.Emp.EmpCode.toString() + '此員工無申請表單權限，如需申請表單請洽單位行政設定')
          this.LoadingPage.hide()
        }
      })
  }
  onSearch() {

    if (this.R_Route.length == 0 || this.Z_Route.length == 0 || this.uiDisableArray.length == 0) {
      alert('假別ID並未正確取得')
    } else {
      // this.loading = true
      var Empcode = this.Emp.EmpCode
      var changeEmpCode = this.ChangeEmp.EmpCode
      var changeDate = doFormatDate(this.searchDate)
      if (!this.errorTest()) {
        // this.loading = false
        this.LoadingPage.hide()
      } else {

        this.LoadingPage.show()
        var first = this.GetApiDataServiceService.getWebApiData_GetShiftRoteDateRange(changeDate, Empcode)
          .pipe(
            mergeMap(
              (Empx: any) => {
                if (Empx.MessageCode) {
                  //判斷資料進行中是否有異常錯誤
                  alert(Empcode + Empx.MessageContent)
                  first.unsubscribe()
                } else {

                  var Attend: GetAttendClass = {
                    DateB: Empx.DateA,
                    DateE: Empx.DateD,
                    ListEmpID: [Empcode],
                    ListRoteID: null
                  }
                  return this.GetApiDataServiceService.getWebApiData_GetAttend(Attend)
                }
              }
            )
          )
          .pipe(takeWhile(() => this.api_subscribe))
          .subscribe(
            (EmpDatax: any) => {
              // console.log(EmpDatax)

              var setDate = []
              for (let data of EmpDatax) {
                setDate.push(formatDateTime(data.AttendDate).getDate)
              }
              var FlowShiftRoteCheck: FlowShiftRoteCheckClass = {
                EmpID1: this.Emp.EmpCode,
                EmpID2: this.ChangeEmp.EmpCode,
                ListShiftDate: setDate
              }


              this.oneP = {
                code: this.Emp.EmpCode,
                name: this.Emp.EmpName,
                work: []
              }
              for (let data of EmpDatax) {
                var setAttendDate = doFormatDate_getMonthAndDay(formatDateTime(data.AttendDate).getDate)
                this.oneP.work.push({
                  realDate: formatDateTime(data.AttendDate).getDate,
                  date: setAttendDate,
                  job: data.ActualRote.RoteCode,
                  RoteID: data.ActualRote.RoteID,
                  RoteName: data.ActualRote.RoteNameC,
                  OnTime: data.ActualRote.OnTime,
                  OffTime: data.ActualRote.OffTime
                })
              }
              // this.SetUiChangeDate()

              var second = this.GetApiDataServiceService.getWebApiData_GetShiftRoteDateRange(changeDate, changeEmpCode)
                .pipe(
                  mergeMap(
                    (changeEmpx: any) => {
                      if (changeEmpx.MessageCode) {
                        //判斷資料進行中是否有異常錯誤
                        alert(changeEmpCode + changeEmpx.MessageContent)
                        second.unsubscribe()
                      } else {

                        var Attend: GetAttendClass = {
                          DateB: changeEmpx.DateA,
                          DateE: changeEmpx.DateD,
                          ListEmpID: [changeEmpCode],
                          ListRoteID: null
                        }
                        return this.GetApiDataServiceService.getWebApiData_GetAttend(Attend)
                      }
                    }
                  )
                )
                .pipe(takeWhile(() => this.api_subscribe))
                .subscribe(
                  (changeEmpDatax: any) => {
                    // console.log(x)

                    this.LoadingPage.show()
                    this.twoP = {
                      code: this.ChangeEmp.EmpCode,
                      name: this.ChangeEmp.EmpName,
                      work: []
                    }
                    for (let data of changeEmpDatax) {
                      var setAttendDate = doFormatDate_getMonthAndDay(formatDateTime(data.AttendDate).getDate)
                      this.twoP.work.push({
                        realDate: formatDateTime(data.AttendDate).getDate,
                        date: setAttendDate,
                        job: data.ActualRote.RoteCode,
                        RoteID: data.ActualRote.RoteID,
                        RoteName: data.ActualRote.RoteNameC,
                        OnTime: data.ActualRote.OnTime,
                        OffTime: data.ActualRote.OffTime
                      })
                    }
                    this.SetUiChangeDate()
                    for (let i = 0; i < this.uiShow.length; i++) {
                      if (this.uiShow[i].reallydate == doFormatDate(this.searchDate)) {
                        this.selectDiv(this.uiShow[i], i)
                      }
                    }
                    if (this.oneP.work.length == 0 || this.twoP.work.length == 0) {
                      var one = this.oneP.work.length == 0 ? this.oneP.name + '無出勤班型' : ''
                      var two = this.twoP.work.length == 0 ? this.twoP.name + '無出勤班型' : ''
                      alert(one + two)
                    } else {
                      this.writeState += 1;
                    }
                    this.SetUiActive()
                    // this.loading = false
                    this.LoadingPage.hide()
                    // console.log(this.oneP)
                    // console.log(this.twoP)
                    // console.log(this.uiShow)

                  }
                  ,
                  (error: any) => {
                    // alert('與api連線異常，第二個人員，getWebApiData_GetShiftRoteDateRange')
                    // this.loading = false
                    this.LoadingPage.hide()
                  }

                )




            },
            (error: any) => {
              // alert('與api連線異常，第一個人員，getWebApiData_GetShiftRoteDateRange')
              this.LoadingPage.hide()
            }
          )
      }
    }
  }

  SetUiActive() {
    $('#navs li').filter('.active').removeClass('active');
    $('#li' + this.writeState.toString()).addClass('active')
    this.scrollTo();
  }

  val_TT(selectDay: uiShowClass[]) {
    //地服處內規檢查
    var CheckTTrule: valTT_Class = new valTT_Class() //state:false為不符合規則
    CheckTTrule.TT_errorData = new TT_errorDataClass()
    CheckTTrule.TT_errorData.ErrorDate = []
    CheckTTrule.TT_errorData.CorrectDateString = []

    for (let oneSelectDay of selectDay) {

      var today = new Date()

      var calDate = new Date(oneSelectDay.reallydate)
      calDate.setDate(calDate.getDate() - 2)
      calDate.setHours(8, 0, 0)
      calDate.setMinutes(0, 0, 0)
      calDate.setSeconds(0, 0)

      if (calDate > today) {
        //雙人調班內規：出勤日前兩天早上08:00前提出換班申請，之後僅權限管理者可以申請及核准，例：04/03要換班，04/01早上08:00前要提出換班申請。

      } else {
        // alert('最晚在\t' + doFormatDate(calDate) + '\t08:00前提出')
        CheckTTrule.TT_errorData.ErrorDate.push(oneSelectDay.reallydate)
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
  nextPage() {
    if (this.selectDay.length == 0) {
      alert('請先選擇調班天')
    } else if (this.showRerror()) {
      // alert('')
    }
    else {
      this.LoadingPage.show();

      this.GetApiDataServiceService.getWebApiData_IsTZTT(this.Emp.EmpCode)
        .pipe(takeWhile(() => this.api_subscribe))
        .subscribe(
          (d: boolean) => {
            var canNext: boolean = false
            if (d) {
              if (this.search_IsAssistant) {
                //行政不限制
                canNext = true
              } else if (this.val_TT(this.selectDay).State) {
                //如果通過地服處內規
                canNext = true
              } else {
                var errorString = '';
                for (let i = 0; i < this.val_TT(this.selectDay).TT_errorData.ErrorDate.length; i++) {
                  errorString += this.Emp.EmpCode + ' ' + this.val_TT(this.selectDay).TT_errorData.ErrorDate[i] + ' ' + '應' + ' ' + this.val_TT(this.selectDay).TT_errorData.CorrectDateString[i] + ' ' + '前申請調班\n'
                }
                alert(errorString)
                canNext = false
              }
            } else {
              //如果不是地服處人員 不檢查內規
              canNext = true
            }


            if (canNext) {
              //是地服處就檢查內規，不是地服處就不檢查
              //行政不限制

              this.LoadingPage.show()
              this.GetApiDataServiceService.getWebApiData_IsTZTT(this.ChangeEmp.EmpCode)
                .pipe(takeWhile(() => this.api_subscribe))
                .subscribe(
                  (y: boolean) => {
                    var canNext_ChangeEmp: boolean = false
                    if (y) {
                      if (this.search_IsAssistant) {
                        //行政不限制
                        canNext_ChangeEmp = true
                      } else if (this.val_TT(this.selectDay).State) {
                        //如果通過地服處內規
                        canNext_ChangeEmp = true
                      } else {
                        var errorString = '';
                        for (let i = 0; i < this.val_TT(this.selectDay).TT_errorData.ErrorDate.length; i++) {
                          errorString += this.ChangeEmp.EmpCode + ' ' + this.val_TT(this.selectDay).TT_errorData.ErrorDate[i] + ' ' + '應' + ' ' + this.val_TT(this.selectDay).TT_errorData.CorrectDateString[i] + ' ' + '前申請調班\n'
                        }
                        alert(errorString)
                        canNext_ChangeEmp = false
                      }
                    } else {
                      //如果不是地服處人員 不檢查內規
                      canNext_ChangeEmp = true
                    }


                    if (canNext_ChangeEmp) {
                      //是地服處就檢查內規，不是地服處就不檢查 -> 最後流程檢查
                      this.CheckAndNext()
                    } else {
                      this.LoadingPage.hide()
                    }
                  }, error => {
                    this.LoadingPage.hide()
                  }
                )
            }
            this.LoadingPage.hide()
          }, error => {
            this.LoadingPage.hide()
          }
        )

    }
  }

  CheckAndNext() {

    var FlowShiftRoteCheck: FlowShiftRoteCheckClass = {
      "EmpID1": this.Emp.EmpCode,
      "EmpID2": this.ChangeEmp.EmpCode,
      "ListShiftDate": []
    }
    for (let select of this.selectDay) {
      FlowShiftRoteCheck.ListShiftDate.push(select.reallydate)
    }
    this.LoadingPage.show();
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
                    for (let oneSelectDay of this.selectDay) {
                      if (oneRote.RoteID.toString() == oneSelectDay.onePRoteID) {
                        alert(oneSelectDay.onePRoteName + '班型不允許調班')
                        this.LoadingPage.hide();
                        return
                      } else if (oneRote.RoteID.toString() == oneSelectDay.twoPRoteID) {
                        alert(oneSelectDay.twoPRoteName + '班型不允許調班')
                        this.LoadingPage.hide();
                        return
                      }
                    }
                  }

                  var ShiftRoteCheckByTwoPerson: ShiftRoteCheckByTwoPersonClass = {
                    "EmpID1": this.Emp.EmpCode,
                    "EmpID2": this.ChangeEmp.EmpCode,
                    "DateB": this.uiShow[0].reallydate,
                    "DateE": this.uiShow[this.uiShow.length - 1].reallydate,
                    "ListShiftDate": [],
                    "IsDifferShift": true //true:等工時，false:不等工時
                  }
                  for (let select of this.selectDay) {
                    ShiftRoteCheckByTwoPerson.ListShiftDate.push(select.reallydate)
                  }
                  this.GetApiDataServiceService.getWebApiData_ShiftRoteCheckByTwoPerson(ShiftRoteCheckByTwoPerson)
                    .pipe(takeWhile(() => this.api_subscribe))
                    .subscribe(
                      (x: string) => {
                        if (x.length == 0) {

                          this.writeState += 1;
                          this.ShowDetail = JSON.parse(JSON.stringify(this.uiShow));
                          this.SimulationRoteClickOne = false
                          this.SetUiActive()
                        } else {
                          alert(x)
                        }

                        this.LoadingPage.hide()
                      },
                      error => {
                        // alert('與api連線異常，getWebApiData_ShiftRoteCheckByTwoPerson')

                        // this.loading = false

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
            this.LoadingPage.hide()
          }
        }, error => {
          this.LoadingPage.hide()
        }
      )
  }
  prePage() {
    this.writeState -= 1;
    this.selectDay = []
    // this.RealRote =[]
    for (let ui of this.uiShow) {
      ui.Clickselect = false
    }
    this.SetUiChangeDate()
    this.SetUiActive()
  }

  Assistant_onSaveEmptoView(event) {
    this.Assistant_Emp.EmpCode = event.split('，')[0]
    this.Assistant_Emp.EmpName = event.split('，')[1]

    $('#Assistant_chooseEmpdialog').modal('hide');
    this.Assistant_errorEmpState = { state: false, errorString: '' }
    this.Assistant_blurEmpCode()
  }

  Assistant_onSaveChangeEmptoView(event) {
    this.Assistant_ChangeEmp.EmpCode = event.split('，')[0]
    this.Assistant_ChangeEmp.EmpName = event.split('，')[1]

    $('#Assistant_chooseChnageEmpdialog').modal('hide');
    this.Assistant_errorChangeEmpState = { state: false, errorString: '' }
    this.Assistant_blurChangeEmpCode()
  }

  My_onSaveChangeEmptoView(event) {

    this.My_ChangeEmp.EmpCode = event.split('，')[0]
    this.My_ChangeEmp.EmpName = event.split('，')[1]

    this.My_blurChangeEmpCode()

    if (event) {
      $('#My_chooseChnageEmpdialog').modal('hide');
    }
  }

  DivStyleClass_disable(disable: boolean, Clickselect: boolean) {
    if (disable) {
      return 'DivStyle_disable'
    } else {
      if (Clickselect) {
        return 'selectDiv'
      }
      return 'DivStyle'
    }

  }
  DivDateStyleClass_disable(disable: boolean, Clickselect: boolean) {
    if (disable) {
      return 'DivDateStyle_disable'
    } else {
      if (Clickselect) {
        return 'DivDateStyle selectDateDiv'
      }
      return 'DivDateStyle'
    }
  }
  DivJobStyleClass_first(Clickselect: boolean) {
    if (Clickselect) {
      return 'selectJobDiv'
    } else {
    }
  }

  Date_disable(disable: boolean) {
    if (disable) {
      return 'row Date_disable'
    } else {
      return 'row'
    }
  }

  DivStyleClass_selectDiv() {
    if (!this.SimulationRoteClickOne) {
      return 'saveDivStyle selectDiv'
    } else {
      return 'saveDivStyle'
    }
  }
  DivStyleClass_selectDateDiv_check() {
    if (!this.SimulationRoteClickOne) {
      return 'DivDateStyle selectDateDiv_check'
    } else {
      return 'DivDateStyle'
    }
  }
  DivStyleClass_selectJobDiv_one() {
    if (!this.SimulationRoteClickOne) {
      return 'col-md-12  col-md-pull-0 col-xs-pull-4 col-xs-4 oneDivJobStyle selectJobDiv'
    } else {
      return 'col-md-12  col-md-pull-0 col-xs-pull-4 col-xs-4 oneDivJobStyle'
    }
  }
  DivStyleClass_selectJobDiv_two() {
    if (!this.SimulationRoteClickOne) {
      return 'col-md-12 col-xs-4 twoDivJobStyle selectJobDiv'
    } else {
      return 'col-md-12 col-xs-4 twoDivJobStyle'
    }
  }


  scrollTo() {
    this.viewScroller.scrollToAnchor('goPageChange');
    //tag=id連結位置
  }


  NoteText: string;//調班事由
  // FlowDynamic_EmpID: string;
  // chooseBase(e) {
  //   var id
  //   if (e.length == 0) {
  //     id = null
  //     // console.log('清除員工資料')
  //   } else {
  //     id = e[0].value.split('，')[0]
  //   }
  //   this.FlowDynamic_EmpID = id

  // }
  disableSend() {
    if (!this.NoteText) {
      return true
    } else if (!this.agreeCheckbox) {
      return true
    } else {
      return false
    }
  }
  sendPreCheckError() {
    // this.loading = true;
    if (!this.NoteText) {
      alert('請輸入調班事由')
      // this.loading = false
      // } else if (!this.FlowDynamic_EmpID) {
      //   alert('請選擇簽核人員')
      //   // this.loading = false

      //   this.LoadingPage.hide()
    } else if (!this.agreeCheckbox) {
      alert('請勾選同意書')
    } else {

      this.LoadingPage.show()

      var ShiftRoteCheckByTwoPerson: ShiftRoteCheckByTwoPersonClass = {
        "EmpID1": this.Emp.EmpCode,
        "EmpID2": this.ChangeEmp.EmpCode,
        "DateB": this.uiShow[0].reallydate,
        "DateE": this.uiShow[this.uiShow.length - 1].reallydate,
        "ListShiftDate": [],
        "IsDifferShift": true //true:等工時，false:不等工時
      }
      for (let select of this.selectDay) {
        ShiftRoteCheckByTwoPerson.ListShiftDate.push(select.reallydate)
      }
      // console.log(ShiftRoteCheckByTwoPerson)
      this.GetApiDataServiceService.getWebApiData_ShiftRoteCheckByTwoPerson(ShiftRoteCheckByTwoPerson)
        .pipe(takeWhile(() => this.api_subscribe))
        .subscribe(
          (x: string) => {
            if (x.length == 0) {
              $('#checksenddialog').modal('show');
            } else {
              alert(x)
            }

            // this.loading = false

            this.LoadingPage.hide()
          },
          error => {
            // alert('與api連線異常，getWebApiData_ShiftRoteCheckByTwoPerson')

            // this.loading = false

            this.LoadingPage.hide()
          }
        )
    }
  }
  sendandSaveChangeform() {
    // console.log(this.selectDay)
    var sendShift = []
    for (let select of this.selectDay) {
      sendShift.push(
        {
          "ShiftRoteDate": select.reallydate,
          "RoteID1": select.onePRoteID,
          "RoteCode1": select.oneP,
          "RoteName1": select.onePRoteName,
          "RoteID2": select.twoPRoteID,
          "RoteCode2": select.twoP,
          "RoteName2": select.twoPRoteName
        }
      )
    }

    var ShiftRoteSaveAndFlowStart: AprovedShiftRoteSaveAndFlowStartClass = {
      "FlowApp": {
        "ShiftRoteType": "RR",
        "ShiftRoteName": "雙人互調",
        "DifferShift": true,
        "FlowApps": [
          {
            "EmpID1": this.Emp.EmpCode,
            "EmpCode1": this.Emp.EmpCode,
            "EmpNameC1": this.Emp.EmpName,
            "EmpID2": this.ChangeEmp.EmpCode,
            "EmpCode2": this.ChangeEmp.EmpCode,
            "EmpNameC2": this.ChangeEmp.EmpName,
            "Note": this.NoteText,
            "Info": "",
            "MailBody": "",
            "State": "1",
            "ShiftRoteFlowAppsDetail": sendShift
          }
        ],
        "EmpID": this.ReallyWriteMan.EmpCode,
        "EmpCode": this.ReallyWriteMan.EmpCode,
        "EmpNameC": this.ReallyWriteMan.EmpName,
        "State": "1",//1是要簽核
        "Cond5": "1"//1是對方有核准權 (互簽，不向上呈核)
      },
      "FlowDynamic": {
        "FlowNode": "502",
        "RoleID": "",
        "EmpID": this.ChangeEmp.EmpCode,
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
          this.LoadingPage.hide()
          // alert('與api連線異常，getWebApiData_ShiftRoteSaveAndFlowStart')
        }
      )
  }



  My_errorChangeEmpState = { state: false, errorString: '' }
  Assistant_errorEmpState = { state: false, errorString: '' }
  Assistant_errorChangeEmpState = { state: false, errorString: '' }

  Assistant_blurEmpCode() {
    if (this.Assistant_Emp.EmpCode) {
      if (this.Assistant_Emp.EmpCode.length == 6) {

        if (this.Assistant_ChangeEmp.EmpCode == this.Assistant_Emp.EmpCode) {
          this.Assistant_Emp.EmpName = ''
          this.Assistant_errorEmpState = { state: true, errorString: '互調員工不能與員工相同' }
          return
        } else {

          var _NowDate = new Date();
          var _NowToday = doFormatDate(_NowDate);
          var GetBaseByFormClass: GetBaseByFormClass = {
            EmpCode: this.My_Emp.EmpCode,
            AppEmpCode: this.Assistant_Emp.EmpCode,
            EffectDate: _NowToday
          }
          this.LoadingPage.show()
          this.GetApiDataServiceService.getWebApiData_GetBaseByFormStaff(GetBaseByFormClass)
            .pipe(takeWhile(() => this.api_subscribe))
            .subscribe((x: any) => {

              if (x == null) {
                // alert('工號輸入錯誤')
                this.Assistant_errorEmpState = { state: true, errorString: '無該部門的行政權限' }
                this.Assistant_Emp.EmpName = ''
              } else if (x.length == 0) {
                // alert('工號輸入錯誤')
                this.Assistant_errorEmpState = { state: true, errorString: '無該部門的行政權限' }
                this.Assistant_Emp.EmpName = ''
              } else {
                // alert('工號正確')
                this.Assistant_Emp.EmpName = x[0].EmpNameC
                this.Assistant_errorEmpState = { state: false, errorString: '' }
                if (x[0].EmpNameC == null) {
                  this.Assistant_Emp.EmpName = x[0].EmpNameE
                } else {
                  if (x[0].EmpNameC.length == 0) {
                    this.Assistant_Emp.EmpName = x[0].EmpNameE
                  } else {
                    this.Assistant_Emp.EmpName = x[0].EmpNameC
                  }
                }
              }
              this.LoadingPage.hide()
            }
              , error => {
                this.LoadingPage.hide()
                // alert('與api連線異常，getWebApiData_GetBaseByForm')
              })
        }

      } else if (this.Assistant_Emp.EmpCode.length > 0) {
        // alert('工號輸入錯誤')
        this.Assistant_errorEmpState = { state: true, errorString: '' }
        this.Assistant_Emp.EmpName = ''
      } else {
        this.Assistant_errorEmpState = { state: false, errorString: '' }
        this.Assistant_Emp.EmpName = ''
      }
    } else {
      this.Assistant_Emp.EmpName = ''
      this.Assistant_errorEmpState = { state: false, errorString: '' }
    }
  }

  Assistant_blurChangeEmpCode() {
    if (this.Assistant_ChangeEmp.EmpCode) {
      if (this.Assistant_ChangeEmp.EmpCode.length == 6) {

        if (this.Assistant_ChangeEmp.EmpCode == this.Assistant_Emp.EmpCode) {
          this.Assistant_Emp.EmpName = ''
          this.Assistant_errorChangeEmpState = { state: true, errorString: '互調員工不能與員工相同' }
          return
        } else {

          var _NowDate = new Date();
          var _NowToday = doFormatDate(_NowDate);
          var GetBaseByFormClass: GetBaseByFormClass = {
            EmpCode: this.My_Emp.EmpCode,
            AppEmpCode: this.Assistant_ChangeEmp.EmpCode,
            EffectDate: _NowToday
          }
          this.LoadingPage.show()
          this.GetApiDataServiceService.getWebApiData_GetBaseByFormStaff(GetBaseByFormClass)
            .pipe(takeWhile(() => this.api_subscribe))
            .subscribe((x: any) => {

              if (x == null) {
                // alert('工號輸入錯誤')
                this.Assistant_errorChangeEmpState = { state: true, errorString: '無該部門的行政權限' }
                this.Assistant_ChangeEmp.EmpName = ''
              } else if (x.length == 0) {
                // alert('工號輸入錯誤')
                this.Assistant_errorChangeEmpState = { state: true, errorString: '無該部門的行政權限' }
                this.Assistant_ChangeEmp.EmpName = ''
              } else {
                // alert('工號正確')
                this.Assistant_ChangeEmp.EmpName = x[0].EmpNameC
                this.Assistant_errorChangeEmpState = { state: false, errorString: '' }
                if (x[0].EmpNameC == null) {
                  this.Assistant_ChangeEmp.EmpName = x[0].EmpNameE
                } else {
                  if (x[0].EmpNameC.length == 0) {
                    this.Assistant_ChangeEmp.EmpName = x[0].EmpNameE
                  } else {
                    this.Assistant_ChangeEmp.EmpName = x[0].EmpNameC
                  }
                }
              }
              this.LoadingPage.hide()
            }
              , error => {
                this.LoadingPage.hide()
                // alert('與api連線異常，getWebApiData_GetBaseByForm')
              })
        }

      } else if (this.Assistant_ChangeEmp.EmpCode.length > 0) {
        // alert('工號輸入錯誤')
        this.Assistant_errorChangeEmpState = { state: true, errorString: '' }
        this.Assistant_ChangeEmp.EmpName = ''
      } else {
        this.Assistant_errorChangeEmpState = { state: false, errorString: '' }
        this.Assistant_ChangeEmp.EmpName = ''
      }
    } else {
      this.Assistant_ChangeEmp.EmpName = ''
      this.Assistant_errorChangeEmpState = { state: false, errorString: '' }
    }
  }

  My_blurChangeEmpCode() {
    if (this.My_ChangeEmp.EmpCode) {
      if (this.My_ChangeEmp.EmpCode.length == 6) {

        if (this.My_ChangeEmp.EmpCode == this.My_Emp.EmpCode) {
          this.My_ChangeEmp.EmpName = ''
          this.My_errorChangeEmpState = { state: true, errorString: '互調員工不能與員工相同' }
          return
        } else {

          var _NowDate = new Date();
          var _NowToday = doFormatDate(_NowDate);
          var GetBaseByFormClass: GetBaseByFormClass = {
            EmpCode: this.My_Emp.EmpCode,
            AppEmpCode: this.My_ChangeEmp.EmpCode,
            EffectDate: _NowToday
          }
          this.LoadingPage.show()
          this.GetApiDataServiceService.getWebApiData_GetBaseByFormShift(GetBaseByFormClass)
            .pipe(takeWhile(() => this.api_subscribe))
            .subscribe((x: any) => {

              if (x == null) {
                // alert('工號輸入錯誤')
                this.My_errorChangeEmpState = { state: true, errorString: '非同單位' }
                this.My_ChangeEmp.EmpName = ''
                this.LoadingPage.hide()
              } else if (x.length == 0) {
                // alert('工號輸入錯誤')
                this.My_errorChangeEmpState = { state: true, errorString: '非同單位' }
                this.My_ChangeEmp.EmpName = ''
                this.LoadingPage.hide()
              } else {
                // alert('工號正確')
                this.My_ChangeEmp.EmpName = x[0].EmpNameC
                this.My_errorChangeEmpState = { state: false, errorString: '' }
                if (x[0].EmpNameC == null) {
                  this.My_ChangeEmp.EmpName = x[0].EmpNameE
                } else {
                  if (x[0].EmpNameC.length == 0) {
                    this.My_ChangeEmp.EmpName = x[0].EmpNameE
                  } else {
                    this.My_ChangeEmp.EmpName = x[0].EmpNameC
                  }
                }
                this.LoadingPage.hide()
              }
            }
              , error => {
                // alert('與api連線異常，getWebApiData_GetBaseByForm')
                this.LoadingPage.hide()
              })
        }

      } else if (this.My_ChangeEmp.EmpCode.length > 0) {
        // alert('工號輸入錯誤')
        this.My_errorChangeEmpState = { state: true, errorString: '非同單位' }
        this.My_ChangeEmp.EmpName = ''
      } else {
        this.My_errorChangeEmpState = { state: false, errorString: '' }
        this.My_ChangeEmp.EmpName = ''
      }
    } else {
      this.My_ChangeEmp.EmpName = ''
      this.My_errorChangeEmpState = { state: false, errorString: '' }
    }
  }

  SimulationRoteClickOne = false
  OriginalRote() {
    //原始調班前
    this.SimulationRoteClickOne = false;
    this.ShowDetail = JSON.parse(JSON.stringify(this.uiShow));
    $('#bt_RoteShow').addClass('onShowButton')
    $('#bt_RoteShow').removeClass('offShowButton')
    $('#bt_TimeShow').addClass('offShowButton')
    $('#bt_TimeShow').removeClass('onShowButton')


  }
  SimulationRote() {
    //模擬調班後
    if (!this.SimulationRoteClickOne) {
      this.SimulationRoteClickOne = true
      for (let s_ui of this.ShowDetail) {
        if (s_ui.Clickselect) {
          var oneP = s_ui.oneP
          var onePRoteID = s_ui.onePRoteID
          var onePRoteName = s_ui.onePRoteName
          var oneP_OnTime = s_ui.oneP_OnTime
          var oneP_OffTime = s_ui.oneP_OffTime

          s_ui.oneP = s_ui.twoP
          s_ui.twoP = oneP

          s_ui.onePRoteID = s_ui.twoPRoteID
          s_ui.twoPRoteID = onePRoteID

          s_ui.onePRoteName = s_ui.twoPRoteName
          s_ui.twoPRoteName = onePRoteName
          s_ui.oneP_OnTime = s_ui.twoP_OnTime
          s_ui.oneP_OffTime = s_ui.twoP_OffTime
          s_ui.twoP_OnTime = oneP_OnTime
          s_ui.twoP_OffTime = oneP_OffTime
        }
      }
    }
    $('#bt_RoteShow').addClass('offShowButton')
    $('#bt_RoteShow').removeClass('onShowButton')
    $('#bt_TimeShow').addClass('onShowButton')
    $('#bt_TimeShow').removeClass('offShowButton')
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
