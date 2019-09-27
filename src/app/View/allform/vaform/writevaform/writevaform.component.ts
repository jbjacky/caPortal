import { Component, OnInit, OnChanges, SimpleChanges, AfterViewInit, NgZone, ViewChild, ElementRef, DoCheck, OnDestroy } from '@angular/core';
import { ViewportScroller } from '@angular/common';
import { chinesenum } from 'src/app/UseVoid/void_chinesenumber'
import { GetApiUserService } from 'src/app/Service/get-api-user.service'
import { GetApiDataServiceService } from 'src/app/Service/get-api-data-service.service'
import { GetBaseByFormClass } from 'src/app/Models/PostData_API_Class/GetBaseByFormClass';
import { doFormatDate, sumbit_formatTimetoString, getapi_formatTimetoString, formatDateTime } from 'src/app/UseVoid/void_doFormatDate';
import { CalculateFlowDataClass } from 'src/app/Models/PostData_API_Class/CalculateFlowDataClass';
import { vaform } from 'src/app/Models/vaform';
import { uploadFileClass } from 'src/app/Models/uploadFileClass';
import { FileDownloadService } from 'src/app/Service/file-download.service';
import { GetAttendClass } from 'src/app/Models/PostData_API_Class/GetAttendClass';
import { takeWhile } from 'rxjs/operators';
import { showBalanceClass } from 'src/app/Models/showBalanceClass';
import { NgxSpinnerService } from 'ngx-spinner';
import { ExampleHeader } from 'src/app/Service/datepickerHeader';
import { GetHoliDayByFormData } from 'src/app/Models/GetHoliDayByFormData';
import { GetAbsFlowSignTreeGetApiClass } from 'src/app/Models/PostData_API_Class/GetAbsFlowSignTreeGetApiClass';
import { GetHoliDayBalanceFlow } from 'src/app/Models/PostData_API_Class/GetHoliDayBalanceFlow';
import { GetBaseParameterDataClass } from 'src/app/Models/GetBaseParameterDataClass';
import { Router, NavigationEnd } from '@angular/router';
import { void_crossDay } from 'src/app/UseVoid/void_crossDay';
import { AttendError } from 'src/app/Models/AttendError';
import { GetAttendInfoClass } from 'src/app/Models/PostData_API_Class/GetAttendInfoClass';
import { EmpArray } from 'src/app/Models/EmpArray';
import { HoliDayBalanceFlow } from 'src/app/Models/HoliDayBalanceFlow';
import { DayHourMinuteClass } from 'src/app/Models/DayHourMinuteClass';
import { AllVaShow } from 'src/app/View/surplus-leave/surplus-leave.component';
import { CheckDayHourMinuteNotZero } from 'src/app/UseVoid/void_CheckDayHourMinuteNotZero';
import { BehaviorSubject, Observable } from 'rxjs';
import { GetEventDateDataClass } from 'src/app/Models/GetEventDateDataClass';
import { GetEventDateGetApiClass } from 'src/app/Models/PostData_API_Class/GetEventDateGetApiClass';

declare let $: any; //use jquery

@Component({
  selector: 'app-writevaform',
  templateUrl: './writevaform.component.html',
  styleUrls: ['./writevaform.component.css'],
  providers: [GetBaseByFormClass]

})
export class WritevaformComponent implements OnInit, AfterViewInit, OnDestroy {
  exampleHeader = ExampleHeader //日期套件header

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
  dateS = new Date()
  dateE = new Date()
  dateTimeS: any = ''
  dateTimeE: any = ''
  eventDate = new Date()

  ngOnDestroy(): void {
    // $(this.eventDateView.nativeElement).off('change');
    // $(this.StartDateView.nativeElement).off('change');
    // $(this.EndDateView.nativeElement).off('change');
    // $(this.StartTimeView.nativeElement).off('change');
    // $(this.EndTimeView.nativeElement).off('change');
    this.api_subscribe = false;
  }

  api_subscribe = true; //ngOnDestroy時要取消

  WriteformPage: boolean = true;
  firstnotshow: boolean = false;//差假時段文字
  titlechinesenum = 0; //差假時段中文數字計算
  newtitle = '差假時段' + chinesenum(this.titlechinesenum + 1);//差假時段文字
  writevaform: vaform = new vaform();
  sendvaform: vaform[] = []
  NowIsWirteForm: boolean = true;
  HoliDay: GetHoliDayByFormData[] = [];
  showHoliDay: GetHoliDayByFormData[] = [];
  checkbox_beforholiday = false;//預排休假checkbox
  promptVaStirng = { state: false, promptString: '' };//喪假分類提示字
  errorDateAndTime = { state: false, errorString: '' };
  errorKeyNameState = { state: false, errorString: '' };
  errorEventDateState = { state: false, errorString: '' };
  errorLeavemanState = { state: false, errorString: '' };
  errorProxymanState = { state: false, errorString: '' };
  errorCauseState = { state: false, errorString: '' };
  errorVaSelect = { state: false, errorString: '' };
  showKeyNameState = false;//喪假的對沖姓名欄位
  showEventDate = false;//喪假、婚假、產假、陪產假的事件發生日欄位


  showSurplusLeaveAbsDeduction: AllVaShow[] = [] //餘假資訊

  writeHoliday: GetHoliDayByFormData = new GetHoliDayByFormData()

  showSendTree: number


  Show_chooseEmpdialog: boolean = false //選擇請假人Dialog
  Show_chooseProxyEmpdialog: boolean = false//總則代理人Dialog
  Show_signDay: boolean = false//請假簽核權限表Dialog

  radiogroup: any = [
    { id: 1, name: '剩餘時數', disabled: false },
    { id: 2, name: '新增事件發生日', disabled: false }
  ];
  chooseRadio: number = 1;

  GetEventDateData: GetEventDateDataClass[] = []
  selectEventDate: GetEventDateDataClass

  bt_Show_chooseEmpdialog() {
    this.Show_chooseEmpdialog = true
  }
  bt_Show_chooseProxyEmpdialog() {
    this.Show_chooseProxyEmpdialog = true
  }
  bt_Show_signDay() {
    this.Show_signDay = true
  }
  constructor(private router: Router,
    private viewScroller: ViewportScroller,
    private GetApiUserService: GetApiUserService,
    private GetApiDataServiceService: GetApiDataServiceService,
    private FileDownload: FileDownloadService,
    private LoadingPage: NgxSpinnerService) {
  }
  EmpCodeReturn() {
    if (this.writevaform.leaveman_jobid) {
      return false
    } else {
      return true
    }
  }
  showBlockIsAssistant: boolean = false
  SearchMan = { EmpCode: '', EmpNameC: '' }
  showBnftDate = '' //年度特休基準日
  ngOnInit() {
    // this.RouteReload()
    this.GetApiUserService.counter$
      .pipe(takeWhile(() => this.EmpCodeReturn()))
      .subscribe(
        (x: any) => {
          if (x != 0) {

            this.SearchMan.EmpCode = x.EmpCode
            this.SearchMan.EmpNameC = x.EmpNameC
            this.showBnftDate = formatDateTime(x.BnftDate).getDate

            this.writevaform.leaveman_jobid = x.EmpCode
            this.writevaform.wirteman_jobid = x.EmpCode
            this.showBlockIsAssistant = x.IsAssistant

            if (x.EmpNameC) {
              this.writevaform.leaveman_name = x.EmpNameC;
              this.writevaform.wirteman_name = x.EmpNameC;
            } else {
              this.writevaform.leaveman_name = x.EmpNameE;
              this.writevaform.wirteman_name = x.EmpNameE;
            }
            // this.showHoliDayBalance(this.writevaform.leaveman_jobid)
            this.blurEmpCode()
            this.firstGetHolday()
          }

        })

    // console.log(this.writevaform)
  }

  RouteReload() {
    this.WriteformPage = true;
    this.firstnotshow = false;//差假時段文字
    this.titlechinesenum = 0; //差假時段中文數字計算
    this.newtitle = '差假時段' + chinesenum(this.titlechinesenum + 1);//差假時段文字
    this.writevaform = new vaform();
    this.sendvaform = []
    this.NowIsWirteForm = true;
    this.HoliDay = [];
    this.showHoliDay = [];
    this.checkbox_beforholiday = false;
    this.promptVaStirng = { state: false, promptString: '' };//喪假分類提示字
    this.errorDateAndTime = { state: false, errorString: '' };
    this.errorKeyNameState = { state: false, errorString: '' };
    this.errorEventDateState = { state: false, errorString: '' };
    this.errorLeavemanState = { state: false, errorString: '' };
    this.errorProxymanState = { state: false, errorString: '' };
    this.errorCauseState = { state: false, errorString: '' };
    this.errorVaSelect = { state: false, errorString: '' };
    this.showKeyNameState = false;//喪假的對沖姓名欄位
    this.showEventDate = false;//喪假、婚假、產假、陪產假的事件發生日欄位

    this.showSurplusLeaveAbsDeduction = []

    this.writeHoliday = new GetHoliDayByFormData()

    this.showSendTree = 0


    this.Show_chooseEmpdialog = false //選擇請假人Dialog
    this.Show_chooseProxyEmpdialog = false//總則代理人Dialog
    this.Show_signDay = false//請假簽核權限表Dialog
    this.dateS = new Date()
    this.dateE = new Date()
    this.dateTimeS = ''
    this.dateTimeE = ''
    this.eventDate = new Date()
    this.nonHoliDayBalance = false
    $("#id_ipt_startday").removeClass("errorInput");
    $("#id_ipt_starttime").removeClass("errorInput");
    $("#id_ipt_endday").removeClass("errorInput");
    $("#id_ipt_endtime").removeClass("errorInput");
  }

  nonHoliDayBalance: boolean = false
  showHoliDayBalance(EmpID: string) {
    // console.log('xxx')

    this.LoadingPage.show()

    this.showSurplusLeaveAbsDeduction = []
    var GetHoliDayBalanceFlow: GetHoliDayBalanceFlow = {
      EmpID: EmpID,
      DateB: doFormatDate(new Date()),
      DateE: "9999/12/31",
      HoliDayID: 0,
      KeyName: "",
      EventDate: "",
      ListAbsFlow: null
    }

    // this.GetApiDataServiceService.getWebApiData_GetBaseInfoDetail(EmpID)
    //   .pipe(takeWhile(() => this.api_subscribe))
    //   .subscribe(
    //     (GetBaseInfoDetail: GetBaseInfoDetailClass[]) => {
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

          this.nonHoliDayBalance = true
          $('#holidayInfo').modal('show')
          this.LoadingPage.hide()
        }, error => {
          this.LoadingPage.hide()
          // alert('與api連線異常，getWebApiData_GetHoliDayBalance')
        })
    // }, error => {
    //   this.LoadingPage.hide()
    // });

  }

  blurEmpCode() {
    if (this.writevaform.leaveman_jobid) {
      if (this.writevaform.leaveman_jobid.length == 6) {
        var _NowDate = new Date();
        var _NowToday = doFormatDate(_NowDate);
        var GetBaseByFormClass: GetBaseByFormClass = {
          EmpCode: this.writevaform.wirteman_jobid,
          AppEmpCode: this.writevaform.leaveman_jobid,
          EffectDate: _NowToday
        }
        this.LoadingPage.show()

        this.GetApiDataServiceService.getWebApiData_GetBaseByForm(GetBaseByFormClass)
          .pipe(takeWhile(() => this.api_subscribe))
          .subscribe((x: any) => {
            if (x == null) {
              // alert('工號輸入錯誤')
              this.Assistant(GetBaseByFormClass);
            } else if (x.length == 0) {
              // alert('工號輸入錯誤')
              this.Assistant(GetBaseByFormClass);
            } else {
              // alert('工號正確')
              if (x[0].EmpNameC == null) {
                this.writevaform.leaveman_name = x[0].EmpNameE
              } else if (x[0].EmpNameC.length == 0) {
                this.writevaform.leaveman_name = x[0].EmpNameE
              } else {
                this.writevaform.leaveman_name = x[0].EmpNameC
              }
              this.errorLeavemanState = { state: false, errorString: '' }
              $("#leavejobid").removeClass("errorInput");

              this.valCanSend();
            }
          }
            , error => {
              this.LoadingPage.hide()
              // alert('與api連線異常，getWebApiData_GetBaseByForm')
            }
          )
      } else {
        // alert('工號輸入錯誤')
        this.writevaform.leaveman_name = ''
        this.errorLeavemanState = { state: true, errorString: '非同單位或無該部門的行政權限' }
        $("#leavejobid").addClass("errorInput");
      }
    } else {
      this.writevaform.leaveman_name = ''
      this.errorLeavemanState = { state: true, errorString: '非同單位或無該部門的行政權限' }
      $("#leavejobid").addClass("errorInput");
    }
  }
  private Assistant(GetBaseByFormClass: GetBaseByFormClass) {
    //行政權限
    this.GetApiDataServiceService.getWebApiData_GetBaseByFormStaff(GetBaseByFormClass)
      .pipe(takeWhile(() => this.api_subscribe))
      .subscribe((x: any) => {
        if (x == null) {
          // alert('工號輸入錯誤')
          this.errorLeavemanState = { state: true, errorString: '非同單位或無該部門的行政權限' };
          this.writevaform.leaveman_name = '';
          $("#leavejobid").addClass("errorInput");
          this.LoadingPage.hide();
        }
        else if (x.length == 0) {
          // alert('工號輸入錯誤')
          this.writevaform.leaveman_name = '';
          this.errorLeavemanState = { state: true, errorString: '非同單位或無該部門的行政權限' };
          $("#leavejobid").addClass("errorInput");
          this.LoadingPage.hide();
        }
        else {
          // alert('工號正確')
          if (x[0].EmpNameC == null) {
            this.writevaform.leaveman_name = x[0].EmpNameE;
          }
          else if (x[0].EmpNameC.length == 0) {
            this.writevaform.leaveman_name = x[0].EmpNameE;
          }
          else {
            this.writevaform.leaveman_name = x[0].EmpNameC;
          }
          this.errorLeavemanState = { state: false, errorString: '' };
          $("#leavejobid").removeClass("errorInput");
          this.valCanSend();
        }
      }, error => {
        this.LoadingPage.hide();
      });
  }

  private valCanSend() {
    //員工延伸定義(可判斷是否可請假)
    this.GetApiDataServiceService.getWebApiData_GetBaseParameter(this.writevaform.leaveman_jobid)
      .pipe(takeWhile(() => this.api_subscribe))
      .subscribe((GetBaseParameterData: GetBaseParameterDataClass[]) => {
        if (GetBaseParameterData.length > 0) {
          if (GetBaseParameterData[0].IsAllowLeave) {
            this.changeStartDateView()
            this.showEventData();
          }
          else {
            this.errorLeavemanState = { state: true, errorString: '後台設定為不可請假，如有問題請洽單位行政，謝謝' };
            this.writevaform.leaveman_name = '';
            $("#leavejobid").addClass("errorInput");
            this.LoadingPage.hide();
          }
        }
        else {
          this.errorLeavemanState = { state: true, errorString: 'GetBaseParameter，請到後台維護人事資料->基本資料->員工參數設定，匯入員工' };
          this.writevaform.leaveman_name = '';
          $("#leavejobid").addClass("errorInput");
          this.LoadingPage.hide();
        }
      }, error => {
        this.LoadingPage.hide();
      });
  }

  blurProxyEmpCode() {
    if (this.writevaform.proxyman_jobid) {
      if (this.writevaform.proxyman_jobid.length == 6) {

        if (this.writevaform.proxyman_jobid == this.writevaform.leaveman_jobid) {
          this.errorProxymanState = { state: true, errorString: '代理人不能與請假人相同' }
          $("#proxymanjobid").addClass("errorInput");
          return
        } else {

          var _NowDate = new Date();
          var _NowToday = doFormatDate(_NowDate);
          var GetBaseByFormClass: GetBaseByFormClass = {
            EmpCode: this.writevaform.leaveman_jobid,
            AppEmpCode: this.writevaform.proxyman_jobid,
            EffectDate: _NowToday
          }
          this.LoadingPage.show()
          this.GetApiDataServiceService.getWebApiData_GetBaseByForm(GetBaseByFormClass)
            .pipe(takeWhile(() => this.api_subscribe))
            .subscribe((x: any) => {

              if (x == null) {
                this.Assistant_proxy(GetBaseByFormClass);
              } else if (x.length == 0) {
                this.Assistant_proxy(GetBaseByFormClass);
              } else {
                // alert('工號正確')
                this.writevaform.proxyman_name = x[0].EmpNameC
                this.errorProxymanState = { state: false, errorString: '' }
                $("#proxymanjobid").removeClass("errorInput");
                if (x[0].EmpNameC == null) {
                  this.writevaform.proxyman_name = x[0].EmpNameE
                } else {
                  if (x[0].EmpNameC.length == 0) {
                    this.writevaform.proxyman_name = x[0].EmpNameE
                  } else {
                    this.writevaform.proxyman_name = x[0].EmpNameC
                  }
                }
                this.LoadingPage.hide()
              }
            }
              , error => {
                this.LoadingPage.hide()
                // alert('與api連線異常，getWebApiData_GetBaseByForm')
              })
        }

      } else if (this.writevaform.proxyman_jobid.length > 0) {
        // alert('工號輸入錯誤')
        this.errorProxymanState = { state: true, errorString: '非同單位' }
        $("#proxymanjobid").addClass("errorInput");
        this.writevaform.proxyman_name = ''
      } else {
        this.errorProxymanState = { state: false, errorString: '' }
        $("#proxymanjobid").removeClass("errorInput");
        this.writevaform.proxyman_name = ''
      }
    } else {
      this.writevaform.proxyman_name = ''
      this.errorProxymanState = { state: false, errorString: '' }
      $("#proxymanjobid").removeClass("errorInput");
    }
  }
  private Assistant_proxy(GetBaseByFormClass: GetBaseByFormClass) {
    //代理人-行政權限
    this.GetApiDataServiceService.getWebApiData_GetBaseByFormStaff(GetBaseByFormClass)
      .pipe(takeWhile(() => this.api_subscribe))
      .subscribe((x: any) => {
        if (x == null) {
          // alert('工號輸入錯誤')
          this.errorProxymanState = { state: true, errorString: '非同單位或無該部門的行政權限' };
          $("#proxymanjobid").addClass("errorInput");
          this.writevaform.proxyman_name = '';
          this.LoadingPage.hide()
        }
        else if (x.length == 0) {
          // alert('工號輸入錯誤')
          this.errorProxymanState = { state: true, errorString: '非同單位或無該部門的行政權限' };
          $("#proxymanjobid").addClass("errorInput");
          this.writevaform.proxyman_name = '';
          this.LoadingPage.hide()
        }
        else {
          // alert('工號正確')
          this.writevaform.proxyman_name = x[0].EmpNameC;
          this.errorProxymanState = { state: false, errorString: '' };
          $("#proxymanjobid").removeClass("errorInput");
          if (x[0].EmpNameC == null) {
            this.writevaform.proxyman_name = x[0].EmpNameE;
          }
          else {
            if (x[0].EmpNameC.length == 0) {
              this.writevaform.proxyman_name = x[0].EmpNameE;
            }
            else {
              this.writevaform.proxyman_name = x[0].EmpNameC;
            }
          }
          this.LoadingPage.hide()
        }
      }, error => {
        this.LoadingPage.hide()
      });
  }

  blurCause() {
    if (this.writevaform.cause) {
      if (this.writevaform.cause.length == 0) {
        this.errorCauseState = { state: true, errorString: '請輸入請假事由' }
        $("#cause").addClass("errorInput");
        return true
      } else {
        this.errorCauseState = { state: false, errorString: '' }
        $("#cause").removeClass("errorInput");
        return false
      }
    } else {
      this.errorCauseState = { state: true, errorString: '請輸入請假事由' }
      $("#cause").addClass("errorInput");
      return true
    }
  }
  blurKeyName() {
    if (this.showKeyNameState) {
      if (!$("#ipt_keyname").val()) {
        this.errorKeyNameState = { state: true, errorString: '請填寫稱謂' }
        $("#ipt_keyname").addClass("errorInput");
        return true
      } else {
        this.errorKeyNameState = { state: false, errorString: '' }
        $("#ipt_keyname").removeClass("errorInput");
        if ($("#ipt_keyname").val().length == 0) {
          this.errorKeyNameState = { state: true, errorString: '請填寫稱謂' }
          $("#ipt_keyname").addClass("errorInput");
          return true
        } else {
          this.errorKeyNameState = { state: false, errorString: '' }
          $("#ipt_keyname").removeClass("errorInput");
          return false
        }
      }
    }
  }
  blurEventDate() {
    if (this.showEventDate && this.chooseRadio == 2) {
      if (!this.eventDate) {
        this.errorEventDateState = { state: true, errorString: '請填寫事件發生日' }
        $("#id_ipt_eventday").addClass("errorInput");
      } else {
        this.errorEventDateState = { state: false, errorString: '' }
        $("#id_ipt_eventday").removeClass("errorInput");
        if (!this.eventDate) {
          this.errorEventDateState = { state: true, errorString: '請填寫事件發生日' }
          $("#id_ipt_eventday").addClass("errorInput");
        } else {
        }
      }
    } else if (this.showEventDate && this.chooseRadio == 1) {
      if (this.selectEventDate.EventDate.length == 0) {
        alert('請選擇事件發生日')
      }
    }
  }
  blurDateAndTime(): boolean {
    //true:出錯 
    var today = new Date()
    today.setDate(today.getDate() - 7)
    today.setHours(0, 0, 0)
    today.setMinutes(0, 0, 0)
    today.setSeconds(0, 0)
    if (this.dateS < today && !(this.showBlockIsAssistant)) {
      // alert('不能請')
      this.errorDateAndTime = { state: true, errorString: '7天限制' }
      $("#id_ipt_startday").addClass("errorInput");
      return true
    } else {
      this.errorDateAndTime = { state: false, errorString: '' }
      $("#id_ipt_startday").removeClass("errorInput");
      $("#id_ipt_starttime").removeClass("errorInput");
      $("#id_ipt_endday").removeClass("errorInput");
      $("#id_ipt_endtime").removeClass("errorInput");
      this.writevaform.startday = doFormatDate(this.dateS);
      this.writevaform.endday = doFormatDate(this.dateE);
      this.writevaform.starttime = this.dateTimeS.toString()
      this.writevaform.endtime = this.dateTimeE.toString()
      if (this.writevaform.startday && this.writevaform.endday && this.writevaform.starttime && this.writevaform.endtime) {
        if ((this.writevaform.startday).length == 0) {
          this.errorDateAndTime = { state: true, errorString: '請填寫起始日期' }
          $("#id_ipt_startday").addClass("errorInput");
          return true
        }
        // else if (!isValidDate(doFormatDate(this.dateS))) {
        //   this.errorDateAndTime = { state: true, errorString: '起始日期格式錯誤' };
        //   $("#id_ipt_startday").addClass("errorInput");
        //   return
        // }

        if ((this.writevaform.endday).length == 0) {
          this.errorDateAndTime = { state: true, errorString: '請填寫結束日期' }
          $("#id_ipt_endday").addClass("errorInput");
          return true
        }
        // else if (!isValidDate(doFormatDate(this.dateE))) {
        //   this.errorDateAndTime = { state: true, errorString: '結束日期格式錯誤' };
        //   $("#id_ipt_endday").addClass("errorInput");
        //   return
        // }

        if ((this.writevaform.starttime).length == 0) {
          this.errorDateAndTime = { state: true, errorString: '請填寫起始時間' }
          $("#id_ipt_starttime").addClass("errorInput");
          return true
        }
        //  else if (!isValidTime(this.dateTimeS.toString())) {
        //   this.errorDateAndTime = { state: true, errorString: '起始時間格式錯誤' };
        //   $("#id_ipt_starttime").addClass("errorInput");
        //   return
        // }

        if ((this.writevaform.endtime).length == 0) {
          this.errorDateAndTime = { state: true, errorString: '請填寫結束時間' }
          $("#id_ipt_endtime").addClass("errorInput");
          return true
        }
        //  else if (!isValidTime(doFormatDate(this.dateTimeE.toString()))) {
        //   this.errorDateAndTime = { state: true, errorString: '結束時間格式錯誤' };
        //   $("#id_ipt_endtime").addClass("errorInput");
        //   return
        // }
      }

      if (this.writevaform.everydayloop) {
        var WirteStartDate = new Date(doFormatDate(this.dateS) + ' ' + '00:00')
        var WirteEndDate = new Date(doFormatDate(this.dateE) + ' ' + '00:00')
        if (WirteStartDate > WirteEndDate) {
          this.errorDateAndTime = { state: true, errorString: '起始區間大於結束區間' }
          $("#id_ipt_startday").addClass("errorInput");
          $("#id_ipt_starttime").addClass("errorInput");
          $("#id_ipt_endday").addClass("errorInput");
          $("#id_ipt_endtime").addClass("errorInput");
          return true;
        } else {

          var WirteStartDateTime_First = new Date(doFormatDate(this.dateS) + ' ' + this.dateTimeS)
          var WirteEndDateTime_First = new Date(doFormatDate(this.dateS) + ' ' + this.dateTimeE)

          var WirteStartDateTime_Second = new Date(doFormatDate(this.dateE) + ' ' + this.dateTimeS)
          var WirteEndDateTime_Second = new Date(doFormatDate(this.dateE) + ' ' + this.dateTimeE)

          if (WirteStartDateTime_First > WirteEndDateTime_First) {

            this.errorDateAndTime = { state: true, errorString: '起始區間大於結束區間' }
            $("#id_ipt_startday").addClass("errorInput");
            $("#id_ipt_starttime").addClass("errorInput");
            $("#id_ipt_endday").addClass("errorInput");
            $("#id_ipt_endtime").addClass("errorInput");
            return true;
          }

          if (WirteStartDateTime_Second > WirteEndDateTime_Second) {

            this.errorDateAndTime = { state: true, errorString: '起始區間大於結束區間' }
            $("#id_ipt_startday").addClass("errorInput");
            $("#id_ipt_starttime").addClass("errorInput");
            $("#id_ipt_endday").addClass("errorInput");
            $("#id_ipt_endtime").addClass("errorInput");
            return true;
          }

          var W_StartDateTime = new Date(this.writevaform.startday + ' ' + this.writevaform.starttime);
          var W_EndDateTime = new Date(this.writevaform.endday + ' ' + this.writevaform.endtime);
          this.checkinArray(W_StartDateTime, W_EndDateTime)
        }
      } else {

        var startDateTime = new Date(this.writevaform.startday + ' ' + this.writevaform.starttime);
        var endDateTime = new Date(this.writevaform.endday + ' ' + this.writevaform.endtime);
        if (startDateTime > endDateTime) {
          this.errorDateAndTime = { state: true, errorString: '起始區間大於結束區間' }
          $("#id_ipt_startday").addClass("errorInput");
          $("#id_ipt_starttime").addClass("errorInput");
          $("#id_ipt_endday").addClass("errorInput");
          $("#id_ipt_endtime").addClass("errorInput");
          return true;
        } else if (this.checkinArray(startDateTime, endDateTime)) {//檢查重複
          $("#id_ipt_startday").addClass("errorInput");
          $("#id_ipt_starttime").addClass("errorInput");
          $("#id_ipt_endday").addClass("errorInput");
          $("#id_ipt_endtime").addClass("errorInput");
          return true;
        }

      }
      // $("#id_ipt_startday").removeClass("errorInput");
      // $("#id_ipt_starttime").removeClass("errorInput");
      // $("#id_ipt_endday").removeClass("errorInput");
      // $("#id_ipt_endtime").removeClass("errorInput");
    }

    return false
  }

  changeStartDateView() {
    var today = new Date()
    today.setDate(today.getDate() - 7)
    today.setHours(0, 0, 0)
    today.setMinutes(0, 0, 0)
    today.setSeconds(0, 0)
    if (this.dateS < today && !(this.showBlockIsAssistant)) {
      // alert('不能請')
      this.errorDateAndTime = { state: true, errorString: '7天限制' }
      $("#id_ipt_startday").addClass("errorInput");
    } else {
      this.errorDateAndTime = { state: false, errorString: '' }
      $("#id_ipt_startday").removeClass("errorInput");
      // this.LoadingPage.show()
      var _DateB = doFormatDate(this.dateS)
      var _DateE = doFormatDate(this.dateS)
      var GetAttend: GetAttendClass = {
        DateB: _DateB,
        DateE: _DateE,
        ListEmpID: [this.writevaform.leaveman_jobid],
        ListRoteID: null
      }
      this.LoadingPage.show()
      this.GetApiDataServiceService.getWebApiData_GetAttend(GetAttend)
        .pipe(takeWhile(() => this.api_subscribe))
        .subscribe(
          (Attends: any[]) => {
            // console.log(Attends)
            for (let Attend of Attends) {
              if (Attend.ActualRote) {
                if (this.dateE > this.dateS) {
                  this.dateTimeS = getapi_formatTimetoString(Attend.ActualRote.OnTime)
                } else {

                  this.dateE = new Date(formatDateTime(Attend.AttendDate).getDate)
                  this.dateTimeS = getapi_formatTimetoString(Attend.ActualRote.OnTime)
                  this.dateTimeE = getapi_formatTimetoString(void_crossDay(Attend.ActualRote.OffTime).EndTime)
                  if (void_crossDay(Attend.ActualRote.OffTime).isCrossDay) {
                    this.dateE.setDate(this.dateE.getDate() + 1)
                  } else {

                  }
                }
              }
            }
            this.blurDateAndTime()
            this.LoadingPage.hide()
          }
          , error => {
            this.LoadingPage.hide()
            // alert('與api連線異常，getWebApiData_GetAttend')
          }
        )
    }
    // this.ScheduledVacation()
  }
  changeEndDateView() {
    var _DateB = doFormatDate(this.dateE)
    var _DateE = doFormatDate(this.dateE)
    var GetAttend: GetAttendClass = {
      DateB: _DateB,
      DateE: _DateE,
      ListEmpID: [this.writevaform.leaveman_jobid],
      ListRoteID: null
    }
    this.LoadingPage.show()
    this.GetApiDataServiceService.getWebApiData_GetAttend(GetAttend)
      .pipe(takeWhile(() => this.api_subscribe))
      .subscribe(
        (Attends: any[]) => {
          // console.log(Attends)
          for (let Attend of Attends) {
            if (Attend.ActualRote) {
              this.dateTimeE = getapi_formatTimetoString(void_crossDay(Attend.ActualRote.OffTime).EndTime)
              // if (void_crossDay(Attend.ActualRote.OffTime).isCrossDay) {
              //   this.dateE.setDate(this.dateE.getDate() + 1)
              // } else {

              // }
            }
          }
          this.blurDateAndTime()
          this.LoadingPage.hide()
        }
        , error => {
          this.LoadingPage.hide()
        }
      )
  }
  @ViewChild('StartTimeView') StartTimeView: ElementRef;
  changeStartTimeView() {
    this.dateTimeS = $("#id_bt_starttime").val()

    this.blurDateAndTime();
    $(this.StartTimeView.nativeElement)
      .on('change', (e, args) => {
        this.dateTimeS = $("#id_bt_starttime").val()
        this.blurDateAndTime();
      });
  }
  @ViewChild('EndTimeView') EndTimeView: ElementRef;
  changeEndTimeView() {
    this.dateTimeE = $("#id_bt_endtime").val()
    this.blurDateAndTime();
    $(this.EndTimeView.nativeElement)
      .on('change', (e, args) => {
        this.dateTimeE = $("#id_bt_endtime").val()
        this.blurDateAndTime();
      });
  }

  dayMask(): {
    mask: Array<string | RegExp>;
    keepCharPositions: boolean;
  } {
    return {
      mask: [/[2]/, /[0]/, /\d/, /\d/, '/', /[0-1]/, /\d/, '/', /[0-3]/, /\d/],
      keepCharPositions: true,
    };
  }

  starttimeMask(): {
    mask: Array<string | RegExp>;
    keepCharPositions: boolean;
  } {
    return {
      mask: [/[0-2]/, this.dateTimeS.toString() && parseInt(this.dateTimeS[0].toString()) > 1 ? /[0-3]/ : /\d/, ':', /[0-5]/, /\d/],
      keepCharPositions: true
    };
  }

  endtimeMask(): {
    mask: Array<string | RegExp>;
    keepCharPositions: boolean;
  } {
    return {
      mask: [/[0-2]/, this.dateTimeE.toString() && parseInt(this.dateTimeE[0].toString()) > 1 ? /[0-3]/ : /\d/, ':', /[0-5]/, /\d/],
      keepCharPositions: true
    };
  }
  btn_del(uisendvaform) {
    //刪除按鈕
    this.sendvaform.splice(this.sendvaform.indexOf(uisendvaform), 1)
    this.titlechinesenum = this.sendvaform.length;
    if (this.sendvaform.length > 0) {
      for (let i = 0; i < this.sendvaform.length; i++) {
        this.sendvaform[i].ui_title = '差假時段' + chinesenum(i + 1)
      }
      this.newtitle = '差假時段' + chinesenum(this.titlechinesenum + 1);
    } else {
      this.NowIsWirteForm = true;
      this.firstnotshow = false;
      this.newtitle = '差假時段' + chinesenum(this.titlechinesenum + 1);
      this.errorDateAndTime = { state: false, errorString: '' }
      $("#id_ipt_startday").removeClass("errorInput");
      $("#id_ipt_starttime").removeClass("errorInput");
      $("#id_ipt_endday").removeClass("errorInput");
      $("#id_ipt_endtime").removeClass("errorInput");
      // this.changeStartDateView()
      // this.onChange_vacategrory()
      // this.showWriteform()

    }

    // var startDateTime = new Date(this.writevaform.startday + ' ' + this.writevaform.starttime);
    // var endDateTime = new Date(this.writevaform.endday + ' ' + this.writevaform.endtime);
    // this.checkinArray(startDateTime, endDateTime)//檢查重複
    // this.writevaform.upload = []

    // var GetAttend: GetAttendClass = {
    //   DateB: doFormatDate(this.dateS),
    //   DateE: doFormatDate(this.dateE),
    //   ListEmpID: [this.writevaform.leaveman_jobid],
    //   ListRoteID: null
    // }
    // console.log(GetAttend)
    // this.GetApiDataServiceService.getWebApiData_GetAttend(GetAttend)
    //   .pipe(takeWhile(() => this.api_subscribe))
    //   .subscribe(
    //     (Attends: any[]) => {
    //       console.log(Attends)
    //       for (let Attend of Attends) {
    //         $("#id_ipt_starttime").val(getapi_formatTimetoString(Attend.ActualRote.OnTime));
    //         $("#id_ipt_endtime").val(getapi_formatTimetoString(Attend.ActualRote.OffTime));
    //         this.blurDateAndTime()
    //       }
    //       this.LoadingPage.hide()
    //     }
    //     , error => {
    //       this.LoadingPage.hide()
    //       alert('與api連線異常，getWebApiData_GetAttend')
    //     }
    //   )
  }
  hideWriteform() {
    //刪除本時段按鈕
    this.NowIsWirteForm = false;
    this.writevaform.upload = []
    this.new_writevaform(this.writevaform)
    // this.writevaform = new vaform()
  }
  showWriteform() {
    //新增差假時段按鈕
    this.dateS = new Date()
    this.dateE = new Date()
    this.NowIsWirteForm = true;
    this.newtitle = '差假時段' + chinesenum(this.titlechinesenum + 1)
    this.writevaform.everydayloop = false;
    this.writevaform.todayCheck = false
    this.writevaform.proxyman_jobid = '';
    this.writevaform.proxyman_name = '';
    this.writevaform.cause = '';
    this.errorDateAndTime = { state: false, errorString: '' };
    this.errorKeyNameState = { state: false, errorString: '' };
    this.errorEventDateState = { state: false, errorString: '' };
    this.errorLeavemanState = { state: false, errorString: '' };
    this.errorProxymanState = { state: false, errorString: '' };
    this.errorCauseState = { state: false, errorString: '' };
    this.showKeyNameState = false;//喪假的對沖姓名欄位
    this.showEventDate = false;//喪假、婚假、產假、陪產假的事件發生日欄位

    this.writevaform.FlowApp = this.nextsendCheckFlowApp;
    this.writevaform.upload = []

    var GetAttend: GetAttendClass = {
      DateB: doFormatDate(this.dateS),
      DateE: doFormatDate(this.dateE),
      ListEmpID: [this.writevaform.leaveman_jobid],
      ListRoteID: null
    }

    this.GetApiDataServiceService.getWebApiData_GetAttend(GetAttend)
      .pipe(takeWhile(() => this.api_subscribe))
      .subscribe(
        (Attends: any[]) => {
          // console.log(Attends)
          for (let Attend of Attends) {
            this.dateTimeS = getapi_formatTimetoString(void_crossDay(Attend.ActualRote.OnTime).EndTime)
            this.dateTimeE = getapi_formatTimetoString(void_crossDay(Attend.ActualRote.OffTime).EndTime);
            this.blurDateAndTime()
          }
          this.LoadingPage.hide()
        }
        , error => {
          this.LoadingPage.hide()
          // alert('與api連線異常，getWebApiData_GetAttend')
        }
      )
    this.onChange_vacategrory()
  }
  disableSendvaform() {

    if (this.errorCauseState.state ||
      this.errorLeavemanState.state ||
      this.errorProxymanState.state ||
      this.errorKeyNameState.state ||
      this.errorEventDateState.state ||
      this.errorDateAndTime.state ||
      this.errorVaSelect.state) {
      return true
    } else {
      return false
    }
  }

  //預排卡15天後才能請
  ScheduledVacation() {
    var startDate = this.dateS
    var endDate = this.dateE

    var today = new Date()
    var calstart_today = new Date()
    var calend_today = new Date()
    calstart_today.setHours(0, 0, 0)
    calstart_today.setMinutes(0, 0, 0)
    calend_today.setMinutes(0, 0, 0)
    calend_today.setHours(0, 0, 0)
    // today.setDate(today.getDate() + 10)
    if (this.checkbox_beforholiday) {
      if (today.getDate() > 15) {

        calstart_today.setMonth(calstart_today.getMonth() + 2)
        calstart_today.setDate(1)
        var canStartDate = calstart_today
        calend_today.setMonth(calstart_today.getMonth() + 3)
        calend_today.setDate(0)
        var canEndDate = calend_today

        if (!(startDate >= canStartDate && startDate <= canEndDate)) {
          // alert(startDate)
          alert('起始日期不合規則，可預排休假期間：' + doFormatDate(canStartDate) + '到' + doFormatDate(canEndDate))
          return true
        } else if (!(endDate >= canStartDate && endDate <= canEndDate)) {

          alert('結束日期不合規則，可預排休假期間：' + doFormatDate(canStartDate) + '到' + doFormatDate(canEndDate))
          return true
        } else {
          return false
        }

      } else {

        calstart_today.setMonth(calstart_today.getMonth() + 1)
        calstart_today.setDate(1)
        var canStartDate = calstart_today
        calend_today.setMonth(calstart_today.getMonth() + 3)
        calend_today.setDate(0)
        var canEndDate = calend_today

        if (!(startDate >= canStartDate && startDate <= canEndDate)) {
          // alert(startDate)
          // console.log(startDate)
          // console.log(canStartDate)
          // console.log(canEndDate)
          alert('起始日期不合規則，可預排休假期間：' + doFormatDate(canStartDate) + '到' + doFormatDate(canEndDate))
          return true
        } else if (!(endDate >= canStartDate && endDate <= canEndDate)) {

          alert('結束日期不合規則，可預排休假期間：' + doFormatDate(canStartDate) + '到' + doFormatDate(canEndDate))
          return true
        } else {
          return false
        }

      }
    } else {
      return false
    }
  }


  loopDayCheck() {
    if (this.writevaform.everydayloop) {
      var d1: any = new Date(this.dateS);
      var d2: any = new Date(this.dateE);
      var d3 = (d2 - d1) / 86400000;
      if (d3 > 30) {
        alert('循環請假不得連續請超過30個日曆天')
        return true
      }
      return false
    }
  }

  levAndproxy() {
    if (this.writevaform.leaveman_jobid == this.writevaform.proxyman_jobid) {
      alert('請假人不能與代理人相同')
      return true
    } else {
      return false
    }
  }

  addsendvaform() {
    // this.blurEmpCode()
    // this.blurProxyEmpCode()

    if (this.levAndproxy() || this.loopDayCheck() || this.disableSendvaform() || this.blurKeyName() || this.blurCause() || this.errorVaSelect.state || this.ScheduledVacation()) {
    } else if (this.dateS &&
      this.dateE &&
      this.dateTimeS &&
      this.dateTimeE) {

      this.writevaform.startday = doFormatDate(this.dateS)
      this.writevaform.endday = doFormatDate(this.dateE)
      this.writevaform.starttime = this.dateTimeS.toString()
      this.writevaform.endtime = this.dateTimeE.toString()

      if (this.showEventDate && this.chooseRadio == 1) {
        this.writevaform.eventdate = this.selectEventDate.EventDate
      }
      if (this.showEventDate && this.chooseRadio == 2) {
        this.writevaform.eventdate = doFormatDate(this.eventDate.toJSON().toString())
      }
      if (this.showKeyNameState) {
        this.writevaform.keyname = $('#ipt_keyname').val();
      }
      var startDateTime = new Date(this.writevaform.startday + ' ' + this.writevaform.starttime);
      var endDateTime = new Date(this.writevaform.endday + ' ' + this.writevaform.endtime);

      if (this.checkFileSize()) {
        return;
      } else { }

      if (this.checkinArray(startDateTime, endDateTime)) {//檢查重複
        return;
      } else { }

      this.canSendArray()
    } else {
      this.blurDateAndTime()
    }
  }
  checkFileSize() {
    var nowSize = 0
    if (this.writevaform.upload) {
      for (let now of this.writevaform.upload) {
        nowSize += +now.Size
      }
    }

    var allSize = 0
    if (this.sendvaform.length > 0) {
      for (let va of this.sendvaform) {
        if (va.upload) {
          for (let size of va.upload) {
            allSize += +size.Size
          }
        }
      }
    }

    var n_aSize = nowSize + allSize
    if (nowSize > 10485760 || allSize > 10485760 || n_aSize > 10485760) {
      alert('多筆假單總附檔大小不得超過10MB')
      return true
    } else {
      return false
    }

  }

  checkBoxEveryDay() {
    if (this.writevaform.everydayloop) {
      if (!this.blurDateAndTime()) {
        var W_StartDateTime = new Date(this.writevaform.startday + ' ' + this.writevaform.starttime);
        var W_EndDateTime = new Date(this.writevaform.endday + ' ' + this.writevaform.endtime);
        this.checkinArray(W_StartDateTime, W_EndDateTime)
      }
    } else {
      this.blurDateAndTime()
    }
  }


  /////判斷日期，檢核用
  checkinArray(W_StartDateTime, W_EndDateTime) {
    if (this.sendvaform.length > 0) {
      for (var i = 0; i < this.sendvaform.length; i++) {
        var x = this.sendvaform[i]
        if (x.everydayloop) {
          var sendStartDate = new Date(x.startday);
          var sendEndDate = new Date(x.endday);
          var subday = ((sendEndDate.valueOf() - sendStartDate.valueOf()) / 1000 / 60 / 60 / 24) + 1;
          for (var k = 0; k < subday; k++) {
            var sendstart = new Date(doFormatDate(sendStartDate) + ' ' + x.starttime) //11/09 0800
            var sendend = new Date(doFormatDate(sendStartDate) + ' ' + x.endtime) //11/09 1700

            var write_start_First = new Date(doFormatDate(this.dateS) + ' ' + this.dateTimeS.toString())
            var write_end_First = new Date(doFormatDate(this.dateS) + ' ' + this.dateTimeE.toString())

            var write_start_Second = new Date(doFormatDate(this.dateE) + ' ' + this.dateTimeS.toString())
            var write_end_Second = new Date(doFormatDate(this.dateE) + ' ' + this.dateTimeE.toString())

            if (this.writevaform.everydayloop == true) {
              if (this.CheckRepeatTime(sendstart, sendend, write_start_First, write_end_First)) {
                this.errorDateAndTime = { state: true, errorString: '與差假時段' + chinesenum(i + 1) + '重複' }

                $("#id_ipt_startday").addClass("errorInput");
                $("#id_ipt_starttime").addClass("errorInput");
                $("#id_ipt_endday").addClass("errorInput");
                $("#id_ipt_endtime").addClass("errorInput");
                return true;
              } else if (this.CheckRepeatTime(sendstart, sendend, write_start_Second, write_end_Second)) {
                this.errorDateAndTime = { state: true, errorString: '與差假時段' + chinesenum(i + 1) + '重複' }

                $("#id_ipt_startday").addClass("errorInput");
                $("#id_ipt_starttime").addClass("errorInput");
                $("#id_ipt_endday").addClass("errorInput");
                $("#id_ipt_endtime").addClass("errorInput");
                return true;
              } else {
                this.errorDateAndTime = { state: false, errorString: '' }
                $("#id_ipt_startday").removeClass("errorInput");
                $("#id_ipt_starttime").removeClass("errorInput");
                $("#id_ipt_endday").removeClass("errorInput");
                $("#id_ipt_endtime").removeClass("errorInput");
              }

            } else {
              var start = new Date(doFormatDate(sendStartDate) + ' ' + x.starttime)
              var end = new Date(doFormatDate(sendStartDate) + ' ' + x.endtime)
              if (W_StartDateTime < end && W_EndDateTime > start)//判斷重複
              {
                this.errorDateAndTime = { state: true, errorString: '與差假時段' + chinesenum(i + 1) + '重複' }

                $("#id_ipt_startday").addClass("errorInput");
                $("#id_ipt_starttime").addClass("errorInput");
                $("#id_ipt_endday").addClass("errorInput");
                $("#id_ipt_endtime").addClass("errorInput");
                return true;
              }
            }
            sendStartDate.setDate(sendStartDate.getDate() + 1)
          }

        }
        else {
          var sendStartDateTime = new Date(x.startday + ' ' + x.starttime);
          var sendEndDateTime = new Date(x.endday + ' ' + x.endtime);

          if (W_StartDateTime < sendEndDateTime && W_EndDateTime > sendStartDateTime)//判斷重複
          {
            this.errorDateAndTime = { state: true, errorString: '與差假時段' + chinesenum(i + 1) + '重複' }

            $("#id_ipt_startday").addClass("errorInput");
            $("#id_ipt_starttime").addClass("errorInput");
            $("#id_ipt_endday").addClass("errorInput");
            $("#id_ipt_endtime").addClass("errorInput");
            return true;
          }
        }


      };
    } else {
      this.errorDateAndTime = { state: false, errorString: '' }

      $("#id_ipt_startday").removeClass("errorInput");
      $("#id_ipt_starttime").removeClass("errorInput");
      $("#id_ipt_endday").removeClass("errorInput");
      $("#id_ipt_endtime").removeClass("errorInput");
      return false;
    }
  }
  CheckRepeatTime(StartDateTime, EndDateTime, W_StartDateTime, W_EndDateTime) {
    //判斷是否重複日期區段
    if (W_StartDateTime < EndDateTime && W_EndDateTime > StartDateTime) {
      return true;
    } else {
      return false;
    }

  }

  nextsendCheckFlowApp: any;
  canSendArray() {
    this.LoadingPage.show()
    this.firstnotshow = true;
    this.showKeyNameState = false
    // this.showEventDate = false

    if (this.checkbox_beforholiday) {
      this.writevaform.beforholiday = true
    } else {
      this.writevaform.beforholiday = false
    }


    if (!this.writevaform.keyname) { this.writevaform.keyname = '' }
    if (!this.writevaform.eventdate) { this.writevaform.eventdate = '' }
    if (!this.writeHoliday.IsCycle) { this.writevaform.everydayloop = false }

    var sendCalculateFlowData: CalculateFlowDataClass = {
      EmpID: this.writevaform.leaveman_jobid,
      HoliDayID: this.writeHoliday.HoliDayID,
      DateB: this.writevaform.startday,
      DateE: this.writevaform.endday,
      TimeB: sumbit_formatTimetoString(this.writevaform.starttime),
      TimeE: sumbit_formatTimetoString(this.writevaform.endtime),
      CalculateWorkTime: true,
      CalculateRes: true,
      FixedCycle: this.writevaform.everydayloop,
      Exception: 0,
      RoteID: 0,
      Time24: true,
      KeyName: this.writevaform.keyname,
      EventDate: this.writevaform.eventdate,
      FlowApps: this.sendFlowAppsArray()
    }
    // console.log(sendCalculateFlowData)
    this.scrollTo('NowIsWirteFormTop');

    this.GetApiDataServiceService.getWebApiData_GetCalculateFlowData(sendCalculateFlowData)
      .pipe(takeWhile(() => this.api_subscribe))
      .subscribe(
        (x: any) => {
          // console.log(x)
          // this.writevaform.vacategrory.HoliDayID  =
          //計算日時分

          if (x.ErrorMsg.length == 0) {
            this.titlechinesenum = this.titlechinesenum + 1;
            this.writevaform.ui_title = this.newtitle;
            this.writevaform.ui_day = x.TotalUseDayHourMinute.Day.toString()
            this.writevaform.ui_hour = x.TotalUseDayHourMinute.Hour.toString()
            this.writevaform.ui_minute = x.TotalUseDayHourMinute.Minute.toString()

            this.nextsendCheckFlowApp = x.FlowApps[0];
            if (this.writevaform.proxyman_jobid) {
              this.nextsendCheckFlowApp.AgentNobr1 = this.writevaform.proxyman_jobid ///代理人要再寫入
            } else {
              this.nextsendCheckFlowApp.AgentNobr1 = ''
            }

            if (this.writevaform.proxyman_name) {
              this.nextsendCheckFlowApp.AgentName1 = this.writevaform.proxyman_name///代理人要再寫入
            } else {
              this.nextsendCheckFlowApp.AgentName1 = ''
            }

            this.writevaform.vacategrory.HoliDayID = x.FlowApps[0].HoliDayID
            this.writevaform.vacategrory.HoliDayNameC = x.FlowApps[0].HoliDayNameC
            this.writevaform.FlowApp = this.nextsendCheckFlowApp

            this.sendvaform.push(JSON.parse(JSON.stringify(this.writevaform)));
            // console.log(this.sendvaform)
            // this.new_writevaform(this.writevaform);

            var GetAbsFlowSignTreeGetApi: GetAbsFlowSignTreeGetApiClass[] = []
            for (let send of this.sendvaform) {

              GetAbsFlowSignTreeGetApi.push(
                {
                  "Tree": 3,
                  "HoliDayID": send.FlowApp.HoliDayID,
                  "Day": send.FlowApp.Day
                }
              )
            }
            this.GetApiDataServiceService.getWebApiData_GetAbsFlowSignTree(GetAbsFlowSignTreeGetApi)
              .pipe(takeWhile(() => this.api_subscribe))
              .subscribe(
                (Treedata: GetAbsFlowSignTreeGetApiClass[]) => {
                  Treedata.sort((a: any, b: any) => {
                    return a.Tree - b.Tree;
                  });
                  this.showSendTree = Treedata[0].Tree
                  this.hideWriteform();
                  this.scrollTo('NowIsWirteFormTop');
                  this.LoadingPage.hide()
                }, error => {

                  this.LoadingPage.hide()
                }
              )

          } else {
            alert(x.ErrorMsg)
            if (this.sendvaform.length > 0) {
            } else {
              this.NowIsWirteForm = true;
              this.firstnotshow = false;
            }
            // this.writevaform.upload = []
            this.LoadingPage.hide()
          }
        }
        , error => {
          // alert('與api連線異常，getWebApiData_GetCalculateFlowData')
          this.LoadingPage.hide()
        }
      ), error => {
        this.LoadingPage.hide()

      }

  }

  sendFlowAppsArray() {
    var returnFlowAppsArray = []
    for (let va of this.sendvaform) {
      returnFlowAppsArray.push(va.FlowApp)
    }
    return returnFlowAppsArray;
  }
  /**
   * @todo  select請假類別切換
   */
  onChange_vacategrory() {
    // var selectHoliDayCode = '';
    // var HoliDayKindID = ''
    // for (let holiday of this.showHoliDay) {
    //   if (holiday.HoliDayID == this.writeHoliday) {
    //     selectHoliDayCode = holiday.HoliDayCode
    //     HoliDayKindID = holiday.HoliDayKindID
    //     this.writevaform.vacategrory = {
    //       HoliDayID:holiday.HoliDayID,
    //       HoliDayKindID:holiday.HoliDayKindID,
    //       HoliDayNameC:holiday.HoliDayNameC
    //     }
    //   }
    // }
    this.showKeyNameState = false;
    this.showEventDate = false;
    this.errorKeyNameState = { state: false, errorString: '' }
    this.errorEventDateState = { state: false, errorString: '' }

    this.promptVaStirng = { state: false, promptString: '' }

    if (this.writeHoliday.Memo) {
      if (this.writeHoliday.Memo.length > 0) {
        this.promptVaStirng = { state: true, promptString: this.writeHoliday.Memo }
      } else {
        this.promptVaStirng = { state: false, promptString: '' }
      }
    } else {
      this.promptVaStirng = { state: false, promptString: '' }
    }

    // if (this.writeHoliday.IsEventDate || this.writeHoliday.IsKeyName) {
    //   // console.log(this.writeHoliday)
    //   this.LoadingPage.show()
    //   this.GetApiDataServiceService()
    //     .pipe(takeWhile(() => this.api_subscribe))
    //     .subscribe(
    //       (x: any[]) => {

    //         if (this.writeHoliday.IsEventDate) {
    //           this.showEventDate = true;
    //         } else {
    //           this.showEventDate = false;
    //         }

    if (this.writeHoliday.IsKeyName) {
      this.showKeyNameState = true;
    } else {
      this.showKeyNameState = false;
    }
    //         this.LoadingPage.hide()
    //       }, error => {

    //         this.LoadingPage.hide()
    //       }
    //     )
    // }

    if (this.writeHoliday.IsEventDate) {
      this.showEventDate = true;
    } else {
      this.showEventDate = false;
    }

    if (this.writeHoliday.IsKeyName) {
      this.showKeyNameState = true;
    } else {
      this.showKeyNameState = false;
    }
    // if (this.writeHoliday.HoliDayKindID == 35 || this.writeHoliday.HoliDayKindID == 36 || this.writeHoliday.HoliDayKindID == 37) {

    //   // console.log('喪假')
    //   // if (this.writeHoliday.HoliDayCode == '010-1')
    //   //   this.promptVaStirng = { state: true, promptString: this.writeHoliday.Memo }
    //   // if (this.writeHoliday.HoliDayCode == '010-2')
    //   //   this.promptVaStirng = { state: true, promptString: this.writeHoliday.Memo }
    //   // if (this.writeHoliday.HoliDayCode == '010-3')
    //   //   this.promptVaStirng = { state: true, promptString: this.writeHoliday.Memo }

    // this.showKeyNameState = true;
    //   this.showEventDate = true;
    // } else if (this.writeHoliday.HoliDayKindID == 7) {
    //   // console.log('婚假')
    //   this.showEventDate = true;
    // } else if (this.writeHoliday.HoliDayKindID == 8) {
    //   // console.log('產假')
    //   this.showEventDate = true;
    // } else if (this.writeHoliday.HoliDayKindID == 10) {
    //   // console.log('陪產假')
    //   this.showEventDate = true;
    // } else if (this.writeHoliday.HoliDayKindID == 38 || this.writeHoliday.HoliDayKindID == 39 || this.writeHoliday.HoliDayKindID == 40) {
    //   // console.log('流產假')
    //   this.showEventDate = true;
    // }

    this.writevaform.keyname = ''
    this.writevaform.eventdate = ''

    this.showEventData();
  }
  disableEventData: boolean = false
  private showEventData() {
    //顯示剩餘事件發生日
    if (this.showEventDate) {
      this.disableEventData = false
      var GetEventDateGetApi: GetEventDateGetApiClass = {
        "EmpID": this.writevaform.leaveman_jobid,
        "HolidayID": this.writeHoliday.HoliDayID,
        "TakeNum": 3
      };
      this.LoadingPage.show();
      this.GetApiDataServiceService.getWebApiData_GetEventDate(GetEventDateGetApi)
        .pipe(takeWhile(() => this.api_subscribe))
        .subscribe((x: GetEventDateDataClass[]) => {
          // console.log(x)
          for (let data of x) {
            data.EventDate = formatDateTime(data.EventDate).getDate;
          }
          this.GetEventDateData = JSON.parse(JSON.stringify(x));
          this.selectEventDate = this.GetEventDateData[0]
          if (this.GetEventDateData) {

            if (this.GetEventDateData.length > 0) {
              for (let r of this.radiogroup) {
                if (r.id == 1) {
                  r.disabled = false
                  this.chooseRadio = 1
                }
              }
              this.disableEventData = false
            } else {
              for (let r of this.radiogroup) {
                if (r.id == 1) {
                  r.disabled = true
                  this.chooseRadio = 2
                }
              }
              this.disableEventData = true
            }
          } else {
            for (let r of this.radiogroup) {
              if (r.id == 1) {
                r.disabled = true
                this.chooseRadio = 2
              }
            }
            this.disableEventData = true
          }
          this.LoadingPage.hide();
        });
    }
  }

  /**
   * @todo 跳到tag的位置 
   * @param tag id連結位置
   * @author jacky
   */
  scrollTo(tag: string) {
    this.viewScroller.scrollToAnchor(tag);
    //tag=id連結位置
  }

  nextpage() {
    //下一步按鈕
    if (this.sendvaform.length > 0) {
      this.WriteformPage = false;
      window.scroll(0, 0);
    } else {
      alert('請先新增差假時段')
    }

  }
  firstGetHolday() {


    this.GetApiDataServiceService.getWebApiData_GetHoliDayByForm()
      .pipe(takeWhile(() => this.api_subscribe))
      .subscribe((x: any) => {
        var getShowHoliday = []
        for (let data of x) {
          if (data.IsDisplay) {
            getShowHoliday.push(data)
          }
        }
        // this.showHoliDay = getShowHoliday
        // this.writeHoliday = getShowHoliday[0]

        this.HoliDay = JSON.parse(JSON.stringify(getShowHoliday))
        this.beforholiday()

        this.new_writevaform(this.writevaform)

      }
        , error => {
          // alert('與api連線異常，getWebApiData_GetHoliDayByForm')
        }
      )

  }
  beforholiday() {
    //勾預排假
    this.showHoliDay = []
    this.errorKeyNameState = { state: false, errorString: '' }
    this.errorEventDateState = { state: false, errorString: '' }
    this.showKeyNameState = false;
    this.showEventDate = false;
    if (this.checkbox_beforholiday == true) {
      for (let holiday of this.HoliDay) {
        if (holiday.AutoFlowStart == true) {
          this.showHoliDay.push(holiday);
        }
      }
      this.writeHoliday = this.showHoliDay[0]
      this.onChange_vacategrory()

    } else {

      for (let holiday of this.HoliDay) {
        // if (holiday.AutoFlowStart == false) {
        this.showHoliDay.push(holiday);
        // }
      }
      this.writeHoliday = this.showHoliDay[0]
      this.onChange_vacategrory()
    }
  }
  new_writevaform(writevaform) {
    var leaveman_jobid = writevaform.leaveman_jobid
    var leaveman_name = writevaform.leaveman_name
    var wirteman_jobid = writevaform.wirteman_jobid
    var wirteman_name = writevaform.wirteman_name
    var writeman_worktime = writevaform.writeman_worktime

    this.writevaform = new vaform();
    this.writevaform.leaveman_jobid = leaveman_jobid
    this.writevaform.leaveman_name = leaveman_name
    this.writevaform.wirteman_jobid = wirteman_jobid
    this.writevaform.wirteman_name = wirteman_name
    this.writevaform.writeman_worktime = writeman_worktime
    // this.writevaform.upload = writevaform.upload

    if (this.checkbox_beforholiday) {
      this.writevaform.beforholiday = true
    } else {
      this.writevaform.beforholiday = false
    }
    this.writeHoliday = this.showHoliDay[0]
    this.writevaform.vacategrory = new GetHoliDayByFormData()

    // this.promptVaStirng = { state: false, promptString: '' }
    // console.log(this.checkbox_beforholiday)

    this.changeStartDateView()
    this.onChange_vacategrory()


  }

  disable_leavejobid() {
    if (this.sendvaform.length != 0) {
      return true
    } else {
      return false
    }
  }
  disable_beforholiday() {

    if (this.disable_leavejobid()) {
      return true
    } else {
      if (this.writevaform.todayCheck) {
        return true
      } else {
        return false
      }
    }

  }
  base64(apiFile: uploadFileClass) {
    // console.log(apiFile)
    this.FileDownload.base64(apiFile)
  }

  onCounterChange() {
    this.WriteformPage = true;
    window.scroll(0, 0);
    //返回修改按鈕，在vaformdetail.component.html
  }
  onSaveEmptoView(event) {
    this.writevaform.leaveman_jobid = event.split('，')[0]
    this.writevaform.leaveman_name = event.split('，')[1]
    if (event) {
      $('#chooseEmpdialog').modal('hide');
      this.blurEmpCode()
    }
    // this.errorLeavemanState = { state: false, errorString: '' }
    // $("#leavejobid").removeClass("errorInput");
  }
  onSaveProxyEmptoView(event) {
    this.writevaform.proxyman_jobid = event.split('，')[0]
    this.writevaform.proxyman_name = event.split('，')[1]
    if (event) {
      $('#chooseProxyEmpdialog').modal('hide');
      this.blurProxyEmpCode()
    }
    // this.errorProxymanState = { state: false, errorString: '' }
    // $("#proxymanjobid").removeClass("errorInput");
  }
  onSaveFile(event) {
    this.writevaform.upload = event;
    // console.log(event)
  }
  todayDisable() {
    if (this.checkbox_beforholiday) {
      return true
    }

    return false
  }

  setWriteEmp() {
    return { EmpID: this.writevaform.wirteman_jobid, EmpNameC: this.writevaform.wirteman_name };
  }


  showAttendArray: AttendError[] = []
  showSearchEmp: EmpArray = {
    EmpCode: '',
    EmpNameC: '',
    EmpNameE: ''
  }
  private Be_setGetAttendInfo$: BehaviorSubject<any> = new BehaviorSubject<GetAttendInfoClass>(null);
  Ob_setGetAttendInfo$: Observable<any> = this.Be_setGetAttendInfo$;
  bt_Show_DayRote() {
    this.showSearchEmp = {
      EmpCode: this.writevaform.leaveman_jobid,
      EmpNameC: this.writevaform.leaveman_name,
      EmpNameE: ''
    }
    var GetAttendInfo: GetAttendInfoClass = {
      "DateB": doFormatDate(this.dateS),
      "DateE": doFormatDate(this.dateE),
      "ListEmpID": [
        this.writevaform.leaveman_jobid
      ],
      "EffectDate": "",
      "Display": "1",
      "ListState": []
    }

    this.Be_setGetAttendInfo$.next(JSON.parse(JSON.stringify(GetAttendInfo)))
    $('#DayRote').modal('show')
  }



}


