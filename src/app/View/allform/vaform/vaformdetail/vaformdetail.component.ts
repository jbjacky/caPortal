import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { vaform, showAbsFlowAppsDetailClass, vaRestClass, vaRote } from 'src/app/Models/vaform';
import { formatDateTime, getapi_formatTimetoString, doFormatDate, sumbit_formatTimetoString } from 'src/app/UseVoid/void_doFormatDate';
import { GetApiDataServiceService } from 'src/app/Service/get-api-data-service.service';
import { AbsFlowAppsDetailClass, FlowAppsClass, AbsSaveAndFlowStartClass } from 'src/app/Models/PostData_API_Class/AbsSaveAndFlowStart';
import { uploadFileClass } from 'src/app/Models/uploadFileClass';
import { FileDownloadService } from 'src/app/Service/file-download.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { takeWhile } from 'rxjs/operators';
import { GetFlowViewClass } from 'src/app/Models/PostData_API_Class/GetFlowViewClass';
import { BehaviorSubject, Observable } from 'rxjs';
import { void_completionTenNum } from 'src/app/UseVoid/void_CompletionTenNum';
import { void_crossDay } from 'src/app/UseVoid/void_crossDay';
import { GetFormInfoGetApiClass } from 'src/app/Models/PostData_API_Class/GetFormInfoGetApiClass';
import { GetFormInfoDataClass } from 'src/app/Models/GetFormInfoDataClass';
import { GetSelectBaseClass } from 'src/app/Models/GetSelectBaseClass';
import { NewVaSearchFlowSignClass } from 'src/app/Models/NewVaSearchFlowSignClass';
import { GetFlowViewAbsGetApiDataClass } from 'src/app/Models/GetFlowViewAbsGetApiDataClass';
import { ExampleHeader } from 'src/app/Service/datepickerHeader';
declare let $: any; //use jquery

@Component({
  selector: 'app-vaformdetail',
  templateUrl: './vaformdetail.component.html',
  styleUrls: ['./vaformdetail.component.css']
})
export class VaformdetailComponent implements OnInit, OnDestroy {
  exampleHeader = ExampleHeader //日期套件header

  api_subscribe = true; //ngOnDestroy時要取消
  ngOnDestroy(): void {
    this.api_subscribe = false;
  }
  onCheckCollapseIn(i:string) {
    //確認是否收合
    if ($('#id' + i).hasClass('collapsed')) {
      $('#' + i + '_text').text('收合請假明細')
      $('#' + i + '_img').css({ "transition": "transform 0.5s" });
      $('#' + i + '_img').css({ "transform": "rotate(-180deg)" });

    } else {
      $('#' + i + '_text').text('展開請假明細')
      $('#' + i + '_img').css({ "transition": "transform 0.5s" });
      $('#' + i + '_img').css({ "transform": "rotate(0deg)" });
    }
  }

  @Input() getshowSendTree: number;
  @Input() getsendvaform: vaform[];
  @Input() getwrite_Emp = { EmpID: '', EmpNameC: '' };
  @Output() counterChange: EventEmitter<number> = new EventEmitter<number>();//返回修改按鈕

  private Sub_onChangeSignMan$: BehaviorSubject<any> = new BehaviorSubject(0)
  onChangeSingMan$: Observable<any> = this.Sub_onChangeSignMan$; //切換選擇簽核人員使用
  showNote = ''

  constructor(
    private GetApiDataServiceService: GetApiDataServiceService,
    private FileDownload: FileDownloadService,
    private LoadingPage: NgxSpinnerService) { }
  previouspage() {
    //返回修改按鈕
    this.counterChange.emit();
  }
  ngOnInit() {
    // console.log(this.getsendvaform)
    this.SearchDateB.setDate(this.SearchDateB.getDate() - 30)
    this.SearchDateE.setDate(this.SearchDateE.getDate() + 30)

    this.Sub_onChangeSignMan$.next(this.getsendvaform[0].leaveman_jobid)
    this.LoadingPage.show()
    var GetFormInfoGetApi: GetFormInfoGetApiClass = {
      FormCode: 'Abs',
      FlowTreeID: '81'
    }
    this.GetApiDataServiceService.getWebApiData_GetFormInfo(GetFormInfoGetApi)
      .pipe(takeWhile(() => this.api_subscribe))
      .subscribe(
        (GetFormInfoData: GetFormInfoDataClass[]) => {
          this.showNote = GetFormInfoData[0].StdNote
          this.LoadingPage.hide()
        }, error => {
          this.LoadingPage.hide()
        }
      )
    this.LoadingPage.show()
    for (let send of this.getsendvaform) {
      var uishowAbsFlowAppsDetails: showAbsFlowAppsDetailClass[] = [];
      for (let sendvaform_FlowApp_AbsFlowAppsDetail of send.FlowApp.AbsFlowAppsDetail) {
        var _vaRestClass:vaRestClass[] = []
        var _vaRote:vaRote
        if(sendvaform_FlowApp_AbsFlowAppsDetail.RoteRestList){
          if(sendvaform_FlowApp_AbsFlowAppsDetail.Rote){
            if (sendvaform_FlowApp_AbsFlowAppsDetail.Rote.RoteRest.length > 0) {
              for (let aa of sendvaform_FlowApp_AbsFlowAppsDetail.Rote.RoteRest) {
                _vaRestClass.push({
                  vaRestOnTime: getapi_formatTimetoString(aa.TimeB),
                  vaRestOffTime: getapi_formatTimetoString(aa.TimeE)
                })
              }
            }
            _vaRote = JSON.parse(JSON.stringify(sendvaform_FlowApp_AbsFlowAppsDetail.Rote))
          }
        }

        //計算日時分
        var _vaUseDay = '0'
        var _vaUseHour = '0'
        var _vaUseMinute = '0'
        _vaUseDay = sendvaform_FlowApp_AbsFlowAppsDetail.UseDayHourMinute.Day.toString()
        _vaUseHour = sendvaform_FlowApp_AbsFlowAppsDetail.UseDayHourMinute.Hour.toString()
        _vaUseMinute = sendvaform_FlowApp_AbsFlowAppsDetail.UseDayHourMinute.Minute.toString()

        var _vaOneOffTime = void_crossDay(sendvaform_FlowApp_AbsFlowAppsDetail.TimeE).EndTime
        var _ActualRote_calCrossDay = void_crossDay(sendvaform_FlowApp_AbsFlowAppsDetail.TimeE).isCrossDay

        uishowAbsFlowAppsDetails.push(
          {
            vaOneDate: formatDateTime(sendvaform_FlowApp_AbsFlowAppsDetail.DateB).getDate,
            vaOneOffTime: getapi_formatTimetoString(_vaOneOffTime),
            vaOneOnTime: getapi_formatTimetoString(sendvaform_FlowApp_AbsFlowAppsDetail.TimeB),
            vaRest: _vaRestClass,
            vaRote: _vaRote,
            AllUse: sendvaform_FlowApp_AbsFlowAppsDetail.Use,
            vaUseDay: _vaUseDay,
            vaUseHour: _vaUseHour,
            vaUseMinute: _vaUseMinute,

            ActualRote_calCrossDay: _ActualRote_calCrossDay,
            IsDelete: false
          }
        )
      }

      send.uishowAbsFlowAppsDetails = uishowAbsFlowAppsDetails
      this.LoadingPage.hide()
    }
  }

  FlowDynamic_Base: GetSelectBaseClass;
  chooseBase(GetSelectBase: GetSelectBaseClass) {
    this.FlowDynamic_Base = GetSelectBase
  }

  base64(apiFile: uploadFileClass) {
    this.FileDownload.base64(apiFile)
  }


  showAllVatime() {
    var v_allday = 0;
    var v_allhour = 0;
    var v_allminute = 0;
    for (let send of this.getsendvaform) {
      v_allday += parseInt(send.ui_day)
      v_allhour += parseInt(send.ui_hour)
      v_allminute += parseInt(send.ui_minute)

    }
    return { allday: v_allday, allhour: v_allhour, allminute: v_allminute }
  }
  checkSendError() {
    // console.log(this.chooseEmpID)
    if (!this.FlowDynamic_Base) {
      alert('請選擇簽核人員')
    } else {
      $('#checksenddialog').modal('show');
    }
  }

  sendLoading = false;
  sendVaform_click() {
    // this.sendLoading = true
    this.LoadingPage.show()
    // $('#sussesdialog').modal('show');
    var reallysendvaformFlowApps: FlowAppsClass[] = [];
    for (let sendvaform of this.getsendvaform) {
      var sendAbsFlowAppsDetail: AbsFlowAppsDetailClass[] = [];
      for (let reallysendvaformFlowApps_AbsFlowAppsDetail of sendvaform.FlowApp.AbsFlowAppsDetail) {
        sendAbsFlowAppsDetail.push({
          EmpID: reallysendvaformFlowApps_AbsFlowAppsDetail.EmpID,
          HoliDayID: reallysendvaformFlowApps_AbsFlowAppsDetail.HoliDayID,
          DateB: formatDateTime(reallysendvaformFlowApps_AbsFlowAppsDetail.DateB).getDate,
          TimeB: reallysendvaformFlowApps_AbsFlowAppsDetail.TimeB,
          TimeE: reallysendvaformFlowApps_AbsFlowAppsDetail.TimeE,
          DateTimeB: reallysendvaformFlowApps_AbsFlowAppsDetail.DateTimeB,
          DateTimeE: reallysendvaformFlowApps_AbsFlowAppsDetail.DateTimeE,
          Use: reallysendvaformFlowApps_AbsFlowAppsDetail.Use,
          AbsFlowAppsTrans: reallysendvaformFlowApps_AbsFlowAppsDetail.AbsFlowAppsTrans,
          RoteRestList: reallysendvaformFlowApps_AbsFlowAppsDetail.RoteRestList,
        })
      }
      reallysendvaformFlowApps.push(
        {
          EmpID: sendvaform.leaveman_jobid,
          EmpCode: sendvaform.leaveman_jobid,
          EmpNameC: sendvaform.leaveman_name,
          RoteID: 0,
          DateB: sendvaform.startday,
          DateE: sendvaform.endday,
          TimeB: sumbit_formatTimetoString(sendvaform.starttime),
          TimeE: sumbit_formatTimetoString(sendvaform.endtime),
          DateTimeB: sendvaform.startday + ' ' + sendvaform.starttime,
          DateTimeE: sendvaform.endday + ' ' + sendvaform.endtime,
          HoliDayID: sendvaform.vacategrory.HoliDayID,
          HoliDayNameC: sendvaform.vacategrory.HoliDayNameC,
          Use: sendvaform.FlowApp.Use,
          Day: sendvaform.FlowApp.Day,
          Balance: sendvaform.FlowApp.Balance,
          HoliDayUnitName: sendvaform.FlowApp.HoliDayUnitName,
          AgentNobr1: sendvaform.FlowApp.AgentNobr1,
          AgentName1: sendvaform.FlowApp.AgentName1,
          AgentNote: "",
          Note: sendvaform.cause,
          Info: "",
          KeyName: sendvaform.keyname,
          EventDate: sendvaform.eventdate,
          AbsFlowAppsDetail: sendAbsFlowAppsDetail,
          UploadFile: sendvaform.upload,
          MailBody: "",
          State: "1",
          Today: sendvaform.todayCheck,
          Circulate: sendvaform.everydayloop,
          Appointment: sendvaform.beforholiday
        }
      )

    }

    var send_AbsSaveAndFlowStartClass: AbsSaveAndFlowStartClass = new AbsSaveAndFlowStartClass();
    if (reallysendvaformFlowApps[0].Appointment) {
      //勾預排 state =  6
      send_AbsSaveAndFlowStartClass.FlowApp = {
        Day: this.getsendvaform.length,
        FlowApps: reallysendvaformFlowApps,
        EmpID: this.getwrite_Emp.EmpID,
        EmpCode: this.getwrite_Emp.EmpID,
        EmpNameC: this.getwrite_Emp.EmpNameC,
        State: '6'
      }
    } else {

      send_AbsSaveAndFlowStartClass.FlowApp = {
        Day: this.getsendvaform.length,
        FlowApps: reallysendvaformFlowApps,
        EmpID: this.getwrite_Emp.EmpID,
        EmpCode: this.getwrite_Emp.EmpID,
        EmpNameC: this.getwrite_Emp.EmpNameC,
        State: '1'
      }
    }
    send_AbsSaveAndFlowStartClass.FlowDynamic = {
      FlowNode: '495',
      RoleID: '',
      EmpID: this.FlowDynamic_Base.EmpID,
      DeptID: this.FlowDynamic_Base.DeptaID.toString(),
      PosID: this.FlowDynamic_Base.JobID.toString()
    }
    // console.log(send_AbsSaveAndFlowStartClass)
    this.GetApiDataServiceService.getWebApiData_AbsSaveAndFlowStart(send_AbsSaveAndFlowStartClass)
      .pipe(takeWhile(() => this.api_subscribe))
      .subscribe(
        x => {
          // console.log(x)
          if (x == 1) {
            $('#sussesdialog').modal('show');
          } else {
            // alert('起單失敗，請洽相關人員修復')
          }
          // this.sendLoading = false;
          this.LoadingPage.hide()
        },
        error => {
          // alert('與api連線異常，getWebApiData_AbsSaveAndFlowStar，')
          // this.sendLoading = false;
          this.LoadingPage.hide()
        }
      )


  }



  vaSearchFlowSign: NewVaSearchFlowSignClass[] = []; //近期假單
  SearchDateB: Date = new Date()
  SearchDateE: Date = new Date()
  errorStartDateState = { state: false, errorString: '' }
  errorEndtDateState = { state: false, errorString: '' }
  getRecentHoliday(EmpCode) {
    ///近期假單一覽

    var GetFlowView: GetFlowViewClass = {
      "ListEmpID": [
        EmpCode
      ],
      "DateB": doFormatDate(this.SearchDateB),
      "DateE": doFormatDate(this.SearchDateE),
      "FormCode": "Abs",
      "State": "0",
      "ProcessFlowID": "0",
      "Cond1": "0",
      "Cond2": "0",
      "Cond3": "0",
      "Handle": false
    }
    if (!this.SearchDateB) {
      $("#id_ipt_startday").addClass("errorInput");
      this.errorStartDateState = { state: true, errorString: '請輸入起始日' }
    } else if (!this.SearchDateE) {
      $("#id_ipt_endday").addClass("errorInput");
      this.errorStartDateState = { state: true, errorString: '請輸入結束日' }
    }
    else {
      this.LoadingPage.show()
      this.GetApiDataServiceService.getWebApiData_GetFlowViewAbs(GetFlowView)
        .pipe(takeWhile(() => this.api_subscribe))
        .subscribe(
          (GetFlowViewAbsGetApiData: GetFlowViewAbsGetApiDataClass[]) => {
            this.vaSearchFlowSign = []
            for (let data of GetFlowViewAbsGetApiData) {

              var ischeckProxy: boolean = false
              if (data.EmpID != data.AppEmpID) {
                ischeckProxy = true
              }
              var allDay = 0
              var allHour = 0
              var allMinute = 0
              //計算日時分
              allDay = data.UseDayHourMinute.Day
              allHour = data.UseDayHourMinute.Hour
              allMinute = data.UseDayHourMinute.Minute

              this.vaSearchFlowSign.push({
                uiHolidayName: data.ListHoliDayNameC,
                ProcessFlowID: data.ProcessFlowID,
                showProcessFlowID: void_completionTenNum(data.ProcessFlowID),
                EmpCode: data.EmpID,//申請人工號
                EmpNameC: data.EmpName,//申請人姓名
                AppDeptName: data.DeptName,//申請人部門
                State: data.State,
                ManageEmpName: data.ManageEmpName,
                Take: false,//抽單
                TransSign:false,//轉呈
                HoliDayID: 0,
                HoliDayNameC: 0,

                checkProxy: ischeckProxy, //是否為代填表單
                WriteEmpCode: data.AppEmpID, //填寫人
                WriteEmpNameC: data.AppEmpName, //填寫人

                DateB: formatDateTime(data.DateTimeB).getDate,
                DateE: formatDateTime(data.DateTimeE).getDate,
                TimeB: getapi_formatTimetoString(formatDateTime(data.DateTimeB).getTime),
                TimeE: getapi_formatTimetoString(formatDateTime(data.DateTimeE).getTime),
                numberOfVaData: data.AbsCount,

                day: allDay.toString(),
                hour: allHour.toString(),
                minute: allMinute.toString(),
                key: data.Key,
                OldKey: data.OldKey,
                Appointment: false
              })
            }
            $('#RecentHoliday').modal('show')
            this.LoadingPage.hide()
          }, error => {
            this.LoadingPage.hide()
          }
        )
    }


  }
  SerchStartDateChange() {
    if (this.SearchDateE > this.SearchDateB) {

    } else {
      this.SearchDateE = new Date(this.SearchDateB)
    }
    this.blurStartDate()
  }
  blurStartDate() {
    if (!this.SearchDateB) {
      $("#id_ipt_startday").addClass("errorInput");
      this.errorStartDateState = { state: true, errorString: '請填寫起始日期' }
      return true
    } else {
      if (this.SearchDateB > this.SearchDateE) {
        $("#id_ipt_startday").addClass("errorInput");
        this.errorStartDateState = { state: true, errorString: '起始日期不能大於結束日期' }
        return true
      } else {
        $("#id_ipt_startday").removeClass("errorInput");
        this.errorStartDateState = { state: false, errorString: '' }
        return false
      }
    }
  }
  blurEndDate() {
    if (!this.SearchDateE) {
      $("#id_ipt_endday").addClass("errorInput");
      this.errorEndtDateState = { state: true, errorString: '請填寫結束日期' }
      return true
    } else {
      $("#id_ipt_endday").removeClass("errorInput");
      this.errorEndtDateState = { state: false, errorString: '' }
      return false
    }
  }

  
  private Be_setGetRoteInfo$: BehaviorSubject<any> = new BehaviorSubject<Array<number>>(null);
  Ob_setGetRoteInfo$: Observable<any> = this.Be_setGetRoteInfo$;
  
  bt_Show_RoteInfo(oneSearchRoteID:number) {
    var searchRoteID: Array<number> = []
    if(oneSearchRoteID){
      searchRoteID.push(oneSearchRoteID)
      this.Be_setGetRoteInfo$.next(searchRoteID)
      $('#RoteInf').modal('show')
    }
  }
}

