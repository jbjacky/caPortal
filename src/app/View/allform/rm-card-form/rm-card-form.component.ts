import { Component, OnInit, ViewChild, ElementRef, OnDestroy, AfterViewInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { GetApiDataServiceService } from 'src/app/Service/get-api-data-service.service';
import { GetAttendExceptionalClass } from 'src/app/Models/PostData_API_Class/GetAttendExceptionalClass';
import { getapi_formatTimetoString, doFormatDate, formatDateTime } from 'src/app/UseVoid/void_doFormatDate';
import { AttendCard } from 'src/app/Models/AttendCard'
import { throwMatDialogContentAlreadyAttachedError } from '@angular/material';
import { GetApiUserService } from 'src/app/Service/get-api-user.service';
import { GetBaseByFormClass } from 'src/app/Models/PostData_API_Class/GetBaseByFormClass';
import { isValidDate } from 'src/app/UseVoid/void_isVaildDatetime';
import { NgxSpinnerService } from 'ngx-spinner';
import { takeWhile } from 'rxjs/operators';
import { void_crossDay } from 'src/app/UseVoid/void_crossDay';
import { ExampleHeader } from 'src/app/Service/datepickerHeader';
import { GetFormInfoGetApiClass } from 'src/app/Models/PostData_API_Class/GetFormInfoGetApiClass';
import { GetFormInfoDataClass } from 'src/app/Models/GetFormInfoDataClass';
import { BehaviorSubject, Observable } from 'rxjs';
import { GetBaseParameterDataClass } from 'src/app/Models/GetBaseParameterDataClass';
import { void_MonthDiff } from 'src/app/UseVoid/void_DateDiff';
import { GetAttendForCardPatchIntegrationData } from 'src/app/Models/GetAttendForCardPatchIntegrationData';
import { formatDate } from '@angular/common';
import { ShowVa } from 'src/app/Models/ShowVa';
import { GetAbsDetailByListEmpIDGetApiClass } from 'src/app/Models/PostData_API_Class/GetAbsDetailByListEmpIDGetApiClass';
import { GetAbsDetailByListEmpIDDataClass } from 'src/app/Models/GetAbsDetailByListEmpIDDataClass';
import { chinesenum } from 'src/app/UseVoid/void_chinesenumber';
import { GetOtViewGetApi } from 'src/app/Models/PostData_API_Class/GetOtViewGetApi';
import { GetOtViewGetApiData } from 'src/app/Models/GetOtViewGetApiData';
declare let $: any; //use jquery

@Component({
  selector: 'app-rm-card-form',
  templateUrl: './rm-card-form.component.html',
  styleUrls: ['./rm-card-form.component.css']
})
export class RmCardFormComponent implements OnInit, AfterViewInit, OnDestroy {
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
  api_subscribe = true; //ngOnDestroy時要取消訂閱api的subscribe
  EmpBase = { EmpCode: '', Name: '' }
  isWriteforgetform = false; //Angular顯示用，選擇異常簽認單時為false，填寫時為true
  GetAttendExceptional: GetAttendExceptionalClass = { DateB: "", DateE: "", ListEmpID: [""] }


  AttendCard: AttendCard[] = [];
  selectAttendCard: AttendCard = new AttendCard();

  User = {
    forget_man_code: '',
    forget_man_name: '',
    write_man_code: '',
    write_man_name: ''
  }

  // loading: boolean = false;

  errorEmp = { state: false, errorString: '' };
  errorStartDate = { state: false, errorString: '' };
  errorEndDate = { state: false, errorString: '' };

  showNote = ''

  constructor(private router: Router,
    private GetApiUserService: GetApiUserService,
    private GetApiDataServiceService: GetApiDataServiceService,
    private LoadingPage: NgxSpinnerService) { }

  showBlockIsAssistant: boolean = false

  showSearchEmp = { EmpCode: '', EmpNameC: '' }
  DL_showNote:boolean = false //Loading getWebApiData_GetFormInfo
  DL_showBaseParameter:boolean = false //Loading getWebApiData_GetBaseParameter

  ngOnInit() {

    this.isWriteforgetform = false; //Angular顯示用，選擇異常簽認單時為false，填寫時為true
    var sendDate = new Date();
    var sendEndDate = doFormatDate(sendDate)
    sendDate.setDate(sendDate.getDate() - 6)
    // sendDate.setFullYear(2019, 7, 1)
    var sendStartDate = doFormatDate(sendDate)

    var GetFormInfoGetApi: GetFormInfoGetApiClass = {
      FormCode: "CardPatch",
      FlowTreeID: "82"
    }
    this.DL_showNote = true
    this.GetApiDataServiceService.getWebApiData_GetFormInfo(GetFormInfoGetApi)
      .pipe(takeWhile(() => this.api_subscribe))
      .subscribe(
        (GetFormInfoData: GetFormInfoDataClass[]) => {
          this.showNote = GetFormInfoData[0].StdNote
          this.DL_showNote = false
        }
      )

    this.GetAttendExceptional.DateB = sendStartDate
    this.GetAttendExceptional.DateE = sendEndDate
    this.GetApiUserService.counter$.subscribe(
      (x: any) => {
        if (x == 0) {

        } else {
          // console.log(x)
          this.GetAttendExceptional.ListEmpID = [x.EmpCode]

          this.showBlockIsAssistant = x.IsAssistant
          var ForgetName = ''
          if (x.EmpNameC) {
            ForgetName = x.EmpNameC;
          } else {
            ForgetName = x.EmpNameE;
          }
          this.User = {
            forget_man_code: x.EmpCode,
            forget_man_name: ForgetName,
            write_man_code: x.EmpCode,
            write_man_name: ForgetName
          }


          // this.loading = true
          // this.LoadingPage.show()
          this.AttendCard = [];

          this.showSearchEmp = { EmpCode: x.EmpCode, EmpNameC: x.EmpNameC }
          this.CheckSendFormLimit(this.GetAttendExceptional)
        }
      })

  }
  onGoWriteForm(Attend) {
    this.isWriteforgetform = true
    window.scroll(0, 0)
    this.selectAttendCard = Attend
    // console.log(Attend)
  }
  onisWriteforgetformChange() {
    //按返回，切換到選擇異常簽認單頁面
    this.isWriteforgetform = false;
    window.scroll(0, 0)
  }

  searchDateB
  searchDateE
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
      $("#id_ipt_startday").addClass("errorInput");
      return true
    } else {
      var StartDate = new Date(doFormatDate(this.searchDateB) + ' ' + '00:00')
      var EndDate = new Date(doFormatDate(this.searchDateE) + ' ' + '00:00')
      if (StartDate > EndDate) {
        this.errorStartDate = { state: true, errorString: '起始日不得大於結束日' };
        $("#id_ipt_startday").addClass("errorInput");
        return true
      } else {
        this.errorEndDate = { state: false, errorString: '' };
        this.errorStartDate = { state: false, errorString: '' };
        $("#id_ipt_startday").removeClass("errorInput");
        $("#id_ipt_endday").removeClass("errorInput");
        return false
      }
    }

  }

  blurEndDate() {

    if (!this.searchDateE) {
      this.errorEndDate = { state: true, errorString: '請填寫結束日期' };
      $("#id_ipt_endday").addClass("errorInput");
      return true
    } else {
      var StartDate = new Date(doFormatDate(this.searchDateB) + ' ' + '00:00')
      var EndDate = new Date(doFormatDate(this.searchDateE) + ' ' + '00:00')
      if (StartDate > EndDate) {
        this.errorEndDate = { state: true, errorString: '起始日不得大於結束日' };
        $("#id_ipt_endday").addClass("errorInput");
        return true
      } else {
        this.errorEndDate = { state: false, errorString: '' };
        this.errorStartDate = { state: false, errorString: '' };
        $("#id_ipt_startday").removeClass("errorInput");
        $("#id_ipt_endday").removeClass("errorInput");
        return false
      }
    }
  }
  onSearch() {
    if (!this.EmpBase.EmpCode) {
      this.errorEmp = { errorString: '無該部門的行政權限', state: true }
      $("#Assistant_ChooseEmpCode").addClass("errorInput");
    } else if (this.errorEmp.state) {

    } else if (this.blurStartDate()) {

    } else if (this.blurEndDate()) {

    } else if (void_MonthDiff(this.searchDateB, this.searchDateE) > 3) {
      alert('查詢起訖區間"月份"不得超過三個月')
    } else {
      var startDate = doFormatDate(this.searchDateB)
      var endDate = doFormatDate(this.searchDateE)
      this.GetAttendExceptional = { DateB: startDate, DateE: endDate, ListEmpID: [this.EmpBase.EmpCode] }

      // this.loading = true
      // this.LoadingPage.hide()
      this.AttendCard = [];

      this.User.forget_man_code = this.EmpBase.EmpCode
      this.User.forget_man_name = this.EmpBase.Name

      this.showSearchEmp = { EmpCode: this.EmpBase.EmpCode.toString(), EmpNameC: this.EmpBase.Name.toString() }
      this.CheckSendFormLimit(this.GetAttendExceptional)
    }

  }

  errorEmpSendForm = { state: false, errorEmpID: '' }
  CheckSendFormLimit(GetAttendExceptional: GetAttendExceptionalClass) {
    //確認EmpID是否可以申請表單
    //此員工無申請表單權限，如需申請表單請洽單位行政設定
    this.DL_showBaseParameter = true
    this.errorEmpSendForm = { state: false, errorEmpID: '' }
    this.GetApiDataServiceService.getWebApiData_GetBaseParameter(GetAttendExceptional.ListEmpID[0])
      .pipe(takeWhile(() => this.api_subscribe))
      .subscribe((GetBaseParameterData: GetBaseParameterDataClass[]) => {
        if (GetBaseParameterData.length > 0) {
          if (GetBaseParameterData[0].IsAllowLeave) {
            this.searchAttendExceptional(this.GetAttendExceptional)
          } else {
            this.errorEmpSendForm = { state: true, errorEmpID: GetAttendExceptional.ListEmpID[0].toString() }
          }
        } else {
          this.errorEmpSendForm = { state: true, errorEmpID: GetAttendExceptional.ListEmpID[0].toString() }
        }
        this.DL_showBaseParameter = false
      })
  }


  searchAttendExceptional(GetAttendExceptional) {
    this.LoadingPage.show()
    this.GetApiDataServiceService.getWebApiData_GetAttendForCardPatchIntegration(GetAttendExceptional)
      .pipe(takeWhile(() => this.api_subscribe))
      .subscribe((data: GetAttendForCardPatchIntegrationData[]) => {
        // console.log(data)
        if (data) {
          if (data.length != 0) {

            for (let x of data) {
              var AttendData: AttendCard = new AttendCard()
              AttendData.forget_man_code = this.User.forget_man_code
              AttendData.forget_man_name = this.User.forget_man_name
              AttendData.write_man_code = this.User.write_man_code
              AttendData.write_man_name = this.User.write_man_name

              AttendData.AttendDate = formatDateTime(x.AttendDate).getDate
              AttendData.IsAbnormal = x.IsAbnormal

              if(x.ActualRote.WorkHours){
                AttendData.ActualRote_WorkHours = x.ActualRote.WorkHours
              }

              if (x.LateMins > 0) {
                AttendData.LateMins = true
              } else {
                AttendData.LateMins = false
              }

              if (x.EarlyMins > 0) {
                AttendData.EarlyMins = true
              } else {
                AttendData.EarlyMins = false
              }

              if (x.OnBeforeMins > 0) {
                AttendData.OnBeforeMins = true
              } else {
                AttendData.OnBeforeMins = false
              }

              if (x.OffAfterMins > 0) {
                AttendData.OffAfterMins = true
              } else {
                AttendData.OffAfterMins = false
              }

              AttendData.IsAbsent = x.IsAbsent
              AttendData.EliminateLate = x.EliminateLate
              AttendData.EliminateEarly = x.EliminateEarly
              AttendData.EliminateOnBefore = x.EliminateOnBefore
              AttendData.EliminateOffAfter = x.EliminateOffAfter
              AttendData.EliminateAbsent = x.EliminateAbsent

              AttendData.RoteID = x.ActualRote.RoteID
              AttendData.RoteCode = x.ActualRote.RoteCode
              AttendData.RoteNameC = x.ActualRote.RoteNameC

              if (x.ActualRote.OnTime) {
                AttendData.ActualRote_OnTime = getapi_formatTimetoString(x.ActualRote.OnTime)
              } else {
                AttendData.ActualRote_OnTime = ''
              }

              if (x.ActualRote.OffTime) {
                AttendData.ActualRote_OffTime = getapi_formatTimetoString(void_crossDay(x.ActualRote.OffTime).EndTime)
                AttendData.ActualRote_calCrossDay = void_crossDay(x.ActualRote.OffTime).isCrossDay
              } else {
                AttendData.ActualRote_OffTime = ''
                AttendData.ActualRote_calCrossDay = false
              }

              if (x.ActualRote.OnDateTime) {
                AttendData.ActualRote_OnDateTime = x.ActualRote.OnDateTime
              } else {
                AttendData.ActualRote_OnDateTime = ''
              }

              if (x.ActualRote.OffDateTime) {
                AttendData.ActualRote_OffDateTime = x.ActualRote.OffDateTime
              } else {
                AttendData.ActualRote_OffDateTime = ''
              }


              if (x.AttendCard.length > 0) {
                AttendData.AttendCard_OnTime = getapi_formatTimetoString(void_crossDay(x.AttendCard[0].OnTime).EndTime)
                AttendData.AttendCard_OffTime = getapi_formatTimetoString(void_crossDay(x.AttendCard[0].OffTime).EndTime)
                AttendData.AttendCard_OnTime_calCrossDay = void_crossDay(x.AttendCard[0].OnTime).isCrossDay
                AttendData.AttendCard_OffTime_calCrossDay = void_crossDay(x.AttendCard[0].OffTime).isCrossDay
                AttendData.AttendCard_OnDateTime = x.AttendCard[0].OnDateTime
                AttendData.AttendCard_OffDateTime = x.AttendCard[0].OffDateTime
              } else {
                AttendData.AttendCard_OnTime = ''
                AttendData.AttendCard_OffTime = ''
                AttendData.AttendCard_OnTime_calCrossDay = false
                AttendData.AttendCard_OffTime_calCrossDay = false
                AttendData.AttendCard_OnDateTime = ''
                AttendData.AttendCard_OffDateTime = ''
              }
              AttendData.UiAttendColor.RAttendOnTimeTitle = this.RedAttendString_OnTimeTitle(AttendData)
              AttendData.UiAttendColor.RAttendOnTimeContent = this.RedAttendString_OnTimeContent(AttendData)
              AttendData.UiAttendColor.ROffTimeTitle = this.RedAttendString_OffTimeTitle(AttendData)
              AttendData.UiAttendColor.ROffTimeContent = this.RedAttendString_OffTimeContent(AttendData)

              AttendData.IsAbs = x.IsAbs
              AttendData.IsOt = x.IsOt

              //如果車誤，把dateTime分析成Time
              if (x.Behind) {
                if (x.Behind.IsDelay) {
                  x.Behind.ArriveTime = getapi_formatTimetoString(formatDateTime(x.Behind.ArriveTime).getTime)
                }
              }
              AttendData.Behind = x.Behind

              var Time = formatDateTime(x.ArriveTime).getTime
              AttendData.ArriveTime = Time
              this.AttendCard.push(AttendData)
              // this.loading = false
            }
            this.AttendCard.sort((a, b) => {
              var startDate: any = new Date(a.AttendDate)
              var endDate: any = new Date(b.AttendDate)
              return endDate - startDate
            })
            this.LoadingPage.hide()
          } else {
            // alert('查無資料')
            // this.loading = false
            this.LoadingPage.hide()
          }
        } else {
          // alert('查無資料')
          // this.loading = false
          this.LoadingPage.hide()
        }

      })
  }


  onSaveEmptoView(event) {
    // console.log(event)
    this.errorEmp = { state: false, errorString: '' }
    $("#Assistant_ChooseEmpCode").removeClass("errorInput");
    this.EmpBase.EmpCode = event.split('，')[0]
    this.EmpBase.Name = event.split('，')[1]
    $('#chooseEmpdialog').modal('hide');
    this.chooseEmp()
  }

  chooseEmp() {
    if (this.EmpBase.EmpCode.length == 6) {
      var _NowDate = new Date();
      var _NowToday = doFormatDate(_NowDate);
      var GetBaseByFormClass: GetBaseByFormClass = {
        EmpCode: this.User.write_man_code,
        AppEmpCode: this.EmpBase.EmpCode,
        EffectDate: _NowToday
      }
      this.LoadingPage.show()
      this.GetApiDataServiceService.getWebApiData_GetBaseByFormStaff(GetBaseByFormClass)
        .pipe(takeWhile(() => this.api_subscribe))
        .subscribe((x: any) => {
          if (x) {
            if (x.length == 0) {
              this.errorEmp = { state: true, errorString: '無該部門的行政權限' }
              this.EmpBase.Name = ''
              $("#Assistant_ChooseEmpCode").addClass("errorInput");
            } else {
              if (x[0].EmpNameC == null) {
                this.EmpBase.Name = x[0].EmpNameE
              } else if (x[0].EmpNameC.length == 0) {
                this.EmpBase.Name = x[0].EmpNameE
              } else {
                this.EmpBase.Name = x[0].EmpNameC
              }
              this.errorEmp = { state: false, errorString: '' }
              $("#Assistant_ChooseEmpCode").removeClass("errorInput");
            }
          } else {
            this.errorEmp = { state: true, errorString: '無該部門的行政權限' }
            this.EmpBase.Name = ''
            $("#Assistant_ChooseEmpCode").addClass("errorInput");
          }
          this.LoadingPage.hide()
        }, error => {

          this.LoadingPage.hide()
        })
    } else {
      this.EmpBase.Name = ''
      this.errorEmp = { state: true, errorString: '無該部門的行政權限' }
      $("#Assistant_ChooseEmpCode").addClass("errorInput");
    }
  }
  RedAttendString_OnTimeTitle(Attend: AttendCard) {
    if (this.RedAttendString(Attend).onTimeErr) {
      return '#d0021b'
    } else {
      return 'rgb(150, 149, 148)'
    }
  }
  RedAttendString_OnTimeContent(Attend: AttendCard) {
    if (this.RedAttendString(Attend).onTimeErr) {
      return '#d0021b'
    } else {
      return '#4c4c4c'
    }
  }

  RedAttendString_OffTimeTitle(Attend: AttendCard) {
    if (this.RedAttendString(Attend).offTimeErr) {
      return '#d0021b'
    } else {
      return 'rgb(150, 149, 148)'
    }
  }
  RedAttendString_OffTimeContent(Attend: AttendCard) {
    if (this.RedAttendString(Attend).offTimeErr) {
      return '#d0021b'
    } else {
      return '#4c4c4c'
    }
  }

  RedAttendString(Attend: AttendCard) {
    // console.log(Attend)
    var onTimeErr: boolean = false
    var offTimeErr: boolean = false
    if ((Attend.IsAbsent)) {
      onTimeErr = true
      offTimeErr = true
    }

    if ((Attend.LateMins && !Attend.EliminateLate) ||
      (Attend.OnBeforeMins && !Attend.EliminateOnBefore)
    ) {
      onTimeErr = true
    }

    if ((Attend.EarlyMins && !Attend.EliminateEarly) ||
      (Attend.OffAfterMins && !Attend.EliminateOffAfter)
    ) {
      offTimeErr = true
    }
    return { onTimeErr: onTimeErr, offTimeErr: offTimeErr }
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


  ShowVa: ShowVa[] = []
  ShowOt: GetOtViewGetApiData[] = []
  SearchAttendDate: string = ''

  showDay(i) {
    return chinesenum(i + 1)
  }
  vaClick(YearMonthDday, EmpID) {
    // alert('請假單:' + YearMonthDday + ' ' + EmpID)
    this.SearchAttendDate = YearMonthDday
    var GetAbsDetailByListEmpIDGetApi: GetAbsDetailByListEmpIDGetApiClass = {
      "DateB": YearMonthDday,
      "DateE": YearMonthDday,
      "ListEmpID": [
        EmpID
      ]
    }
    this.LoadingPage.show()

    this.GetApiDataServiceService.getWebApiData_GetAbsDetailByListEmpID(GetAbsDetailByListEmpIDGetApi)
      .pipe(takeWhile(() => this.api_subscribe))
      .subscribe(
        (GetAbsDetailByListEmpIDData: GetAbsDetailByListEmpIDDataClass[]) => {
          this.ShowVa = []
          for (let data of GetAbsDetailByListEmpIDData) {
            var setDay = 0
            var setHour = 0
            var setMin = 0
            //計算日時分

            setDay = data.UseDayHourMinute.Day
            setHour = data.UseDayHourMinute.Hour
            setMin = data.UseDayHourMinute.Minute

            this.ShowVa.push({
              State: data.State,
              DateTimeB: data.DateTimeB,
              DateTimeE: data.DateTimeE,
              SignDate: data.CreatDate,
              HoliDayNameC: data.HoliDay.HoliDayNameC,
              Use: data.Use,

              showDateB: formatDateTime(data.DateTimeB).getDate,
              showDateE: formatDateTime(data.DateTimeE).getDate,
              showTimeB: getapi_formatTimetoString(formatDateTime(data.DateTimeB).getTime),
              showTimeE: getapi_formatTimetoString(formatDateTime(data.DateTimeE).getTime),
              showSignDate: formatDateTime(data.CreatDate).getDate,
              showSignTime: getapi_formatTimetoString(formatDateTime(data.CreatDate).getTime),
              day: setDay.toString(),
              hour: setHour.toString(),
              minute: setMin.toString()
            })
          }
          this.LoadingPage.hide()
          $('#RecentHoliday').modal('show')
        }, error => {
          this.LoadingPage.hide()
        }
      )
  }
  otClick(YearMonthDday, EmpID) {
    var GetOtViewGetApi: GetOtViewGetApi = {
      "EmpList": [
        EmpID
      ],
      "DateList": [
        YearMonthDday
      ]
    }
    this.LoadingPage.show()
    this.GetApiDataServiceService.getWebApiData_GetOtView(GetOtViewGetApi)
      .pipe(takeWhile(() => this.api_subscribe))
      .subscribe(
        (GetOtViewGetApiData: GetOtViewGetApiData[]) => {
          this.ShowOt  = JSON.parse(JSON.stringify(GetOtViewGetApiData))
          for(let ot of this.ShowOt){
            ot.DateTimeB = formatDateTime(ot.DateTimeB).getDate+' '+getapi_formatTimetoString( formatDateTime(ot.DateTimeB).getTime )
            ot.DateTimeE = formatDateTime(ot.DateTimeE).getDate+' '+getapi_formatTimetoString( formatDateTime(ot.DateTimeE).getTime )
            ot.ApproveDate = formatDateTime(ot.ApproveDate).getDate+' '+getapi_formatTimetoString( formatDateTime(ot.ApproveDate).getTime )
          }
          this.LoadingPage.hide()
          $('#OtDataDialog').modal('show')
        })
  }
}
