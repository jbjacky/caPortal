import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
declare let $: any; //use jquery
import { BehaviorSubject, Observable } from 'rxjs';
import { takeWhile } from 'rxjs/operators';
import { GetApiDataServiceService } from 'src/app/Service/get-api-data-service.service';
import { AbscIntegrationHandlerGetAbsFlowAppsClass } from 'src/app/Models/PostData_API_Class/AbscIntegrationHandlerGetAbsFlowAppsClass';
import { formatDateTime, getapi_formatTimetoString, timeZone_tw, doFormatDate, sumbit_formatTimetoString } from 'src/app/UseVoid/void_doFormatDate';
import { AbscFlowHandlerSaveAndFlowStartClass, AbscFlowHandler_FlowApps } from 'src/app/Models/PostData_API_Class/AbscFlowHandlerSaveAndFlowStartClass';
import { GetApiUserService } from 'src/app/Service/get-api-user.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { GetBaseByFormClass } from 'src/app/Models/PostData_API_Class/GetBaseByFormClass';
import { ExampleHeader } from 'src/app/Service/datepickerHeader';
import { void_completionTenNum } from 'src/app/UseVoid/void_CompletionTenNum';
import { GetAbsFlowSignTreeGetApiClass } from 'src/app/Models/PostData_API_Class/GetAbsFlowSignTreeGetApiClass';
import { GetFormInfoGetApiClass } from 'src/app/Models/PostData_API_Class/GetFormInfoGetApiClass';
import { GetFormInfoDataClass } from 'src/app/Models/GetFormInfoDataClass';
import { GetSelectBaseClass } from 'src/app/Models/GetSelectBaseClass';

@Component({
  selector: 'app-delform',
  templateUrl: './delform.component.html',
  styleUrls: ['./delform.component.css'],
})

// 申請銷假單 
// state 1 銷假呈核中
// 2 已銷假
// 3 可以銷假
export class DelformComponent implements OnInit, AfterViewInit, OnDestroy {
  exampleHeader = ExampleHeader //日期套件header
  ngOnDestroy(): void {
    // throw new Error("Method not implemented.");
    this.api_subscribe = false;
  }

  isSearchAssistant: boolean = false

  alldelformpeople: delvaformClass[] = []
  ngAfterViewInit(): void {
    let a_lenght = 0;
    for (let i = 0; i < this.alldelformpeople.length; i++) {
      a_lenght++;
    }
    // $('#accordion_show').on('click', function () {
    //   for (let i = 0; i < a_lenght; i++) {
    //     $('#del_id' + i).collapse('show');
    //   }
    // });
    // //全部展開按鈕
    // $('#accordion_hide').on('click', function () {
    //   for (let i = 0; i < a_lenght; i++) {
    //     $('#del_id' + i).collapse('hide');
    //   }
    // });
    // //全部收合按鈕
    // this.router.events
    // .pipe(takeWhile(() => this.api_subscribe))
    // .subscribe((e: any) => {
    //   // If it is a NavigationEnd event re-initalise the component
    //   if (e instanceof NavigationEnd) {
    //     this.ngOnInit()
    //   }
    // });

  }

  api_subscribe = true; //ngOnDestroy時要取消訂閱api的subscribe

  constructor(private router: Router,
    private GetApiDataServiceService: GetApiDataServiceService,
    private GetApiUserService: GetApiUserService,
    private LoadingPage: NgxSpinnerService) {

  }
  // loading: boolean = true;
  showdataIsEmpty: boolean = false
  searchEmpCode: string
  searchEmpName: string

  writeEmpMan = { EmpCode: '', EmpNameC: '' }
  private Sub_onChangeSignMan$: BehaviorSubject<any> = new BehaviorSubject(0)
  onChangeSingMan$: Observable<any> = this.Sub_onChangeSignMan$; //切換選擇簽核人員使用
  showBlockIsAssistant: boolean = false

  EmpBase = { EmpCode: '', Name: '' }
  EmpCodeReturn() {
    if (this.EmpBase.EmpCode.length > 0) {
      return false
    } else {
      return true
    }
  }
  showNote = ''
  RouteReload() {
    this.isSearchAssistant = false
    this.showNote = ''
    this.FlowDynamic_Base = new GetSelectBaseClass();
    this.errorEmp = { state: false, errorString: '' };
    this.errorStartDate = { state: false, errorString: '' };
    this.errorEndDate = { state: false, errorString: '' };
    this.searchDateB = null
    this.searchDateE = null
  }
  ngOnInit() {
    // this.RouteReload()

    this.GetApiUserService.counter$
      .pipe(takeWhile(() => this.EmpCodeReturn()))
      .subscribe(
        (x: any) => {
          if (x == 0) {

          } else {
            this.showRemindNote()
            this.showBlockIsAssistant = x.IsAssistant
            this.searchEmpCode = x.EmpCode
            this.writeEmpMan.EmpCode = x.EmpCode
            this.writeEmpMan.EmpNameC = x.EmpNameC
            this.Sub_onChangeSignMan$.next(x.EmpCode)
            if (x.EmpNameC) {
              this.searchEmpName = x.EmpNameC;
            } else {
              this.searchEmpName = x.EmpNameE;
            }

            var _DateB = new Date()
            _DateB.setDate(_DateB.getDate() - 7)
            var _DateE = new Date()
            _DateE.setDate(_DateE.getDate() + 360)
            this.reload(x.EmpID, _DateB, _DateE)
          }
        }
      )

  }
  showRemindNote() {
    var GetFormInfoGetApi: GetFormInfoGetApiClass = {
      FormCode: 'Absc',
      FlowTreeID: '17'
    }
    this.GetApiDataServiceService.getWebApiData_GetFormInfo(GetFormInfoGetApi)
      .pipe(takeWhile(() => this.api_subscribe))
      .subscribe(
        (GetFormInfoData: GetFormInfoDataClass[]) => {
          this.showNote = GetFormInfoData[0].StdNote
        }, error => {
        }
      )
  }
  go() {
    this.router.navigate(['/delform1']);
  }
  disabled_checkAll(oneAllcheckData: delvaformClass) {
    var disable = true;

    for (let detail_vaform of oneAllcheckData.detail_vaform) {
      if (detail_vaform.disable == 1) {
        // 1 為 可銷假
        disable = false
      }
    }
    return disable;
  }
  checkAll(oneAllcheckData: delvaformClass) {
    if (oneAllcheckData.checkedstate) {
      // console.log(oneAllcheckData)
      for (let detail_vaform of oneAllcheckData.detail_vaform) {
        if (detail_vaform.disable == 1) {
          // 1 為 可銷假
          detail_vaform.checkState = false
        }
      }
      oneAllcheckData.selectDetailSeveral = '0'
    } else {
      var calSeveral = 0
      for (let detail_vaform of oneAllcheckData.detail_vaform) {
        if (detail_vaform.disable == 1) {
          // 1 為 可銷假
          detail_vaform.checkState = true
          calSeveral++;
        }
      }
      oneAllcheckData.selectDetailSeveral = calSeveral.toString()
    }
  }

  checkIsALL(oneAllcheckData: delvaformClass) {
    var ischeckall = true
    var calSeveral = 0
    for (let detail_vaform of oneAllcheckData.detail_vaform) {
      if (detail_vaform.disable == 1) {
        // 1 為 可銷假
        if (detail_vaform.checkState == false) {
          ischeckall = false
        } else {
          calSeveral++;
        }
      }
    }
    oneAllcheckData.checkedstate = ischeckall;
    oneAllcheckData.selectDetailSeveral = calSeveral.toString()
  }
  onCheckCollapseIn(id) {
    //確認是否收合
    if (!$('#' + id).hasClass('collapse in')) {
      $('#' + id + '_text').text('收合')
      $('#' + id + '_img').css({ "transition": "transform 0.5s" });
      $('#' + id + '_img').css({ "transform": "rotate(-180deg)" });

    } else {
      $('#' + id + '_text').text('展開')
      $('#' + id + '_img').css({ "transition": "transform 0.5s" });
      $('#' + id + '_img').css({ "transform": "rotate(0deg)" });
    }
  }
  textid(id) {
    return id + '_text'
    //收合、展開文字的id
  }
  imgid(id) {
    return id + '_img'
    //收合、展開箭頭圖案的id
  }

  NoteText: string;
  FlowDynamic_Base: GetSelectBaseClass;
  chooseBase(GetSelectBase: GetSelectBaseClass) {
    this.FlowDynamic_Base = GetSelectBase
  }

  showSendTree: number
  checkError() {
    var sendDay = 0
    var GetAbsFlowSignTreeGetApi: GetAbsFlowSignTreeGetApiClass[] = []
    for (let del of this.alldelformpeople) {
      var detailDay = 0
      for (let detail of del.detail_vaform) {
        if (detail.checkState) {
          sendDay = sendDay + 1
          detailDay = detailDay + 1
        }
      }
      if (detailDay > 0) {
        var sendHoliDayID = del.holiday.id.toString()
        var sendDetailDays = detailDay.toString()
        GetAbsFlowSignTreeGetApi.push(
          {
            "Tree": 3,
            "HoliDayID": parseInt(sendHoliDayID),
            "Day": parseInt(sendDetailDays)
          }
        )
      }

    }

    if (sendDay > 0) {
      if (this.NoteText) {
        if (this.FlowDynamic_Base) {
          this.LoadingPage.show()
          this.GetApiDataServiceService.getWebApiData_GetAbsFlowSignTree(GetAbsFlowSignTreeGetApi)
            .pipe(takeWhile(() => this.api_subscribe))
            .subscribe(
              (Treedata: GetAbsFlowSignTreeGetApiClass[]) => {

                Treedata.sort((a: any, b: any) => {
                  return a.Tree - b.Tree;
                });
                this.showSendTree = Treedata[0].Tree
                this.LoadingPage.hide()
                $('#checksenddialog').modal('show');

              }, error => {
                this.LoadingPage.show()
              }
            )
        }
        else {
          alert('請選擇簽核人員')
        }
      } else {
        alert('請填寫銷假事由')
      }
    } else {
      alert('請選擇銷假日期')
    }
  }
  sendandSaveDelform() {
    // this.loading = true
    var sendDelDeatil: AbscFlowHandler_FlowApps[] = []
    var sendDay = 0
    for (let del of this.alldelformpeople) {
      for (let detail of del.detail_vaform) {

        // var DateTime_nB = new Date(detail.startdate + ' ' + detail.starttime)
        // var DateTime_nE = new Date(detail.startdate + ' ' + detail.endtime)

        if (detail.checkState) {
          sendDelDeatil.push({
            EmpID: detail.EmpID,
            EmpCode: detail.EmpCode,
            EmpNameC: detail.EmpNameC,
            DateB: detail.startdate,
            TimeB: sumbit_formatTimetoString(detail.starttime),
            TimeE: sumbit_formatTimetoString(detail.endtime),
            DateTimeB: detail.DateTimeB,
            DateTimeE: detail.DateTimeE,
            AbsentMinusDetailId:detail.AbsentMinusDetailId,
            HoliDayID: parseInt(detail.holiday.id),
            HoliDayNameC: detail.holiday.name,
            Use: detail.Use,
            Day: 1,
            HoliDayUnitName: '小時',
            Note: this.NoteText,
            Info: '',
            MailBody: '',
            State: '1',
            AgentNobr1: del.AgentNobr1,
            AgentName1: del.AgentName1
          })
          sendDay = sendDay + 1
        }
      }
    }
    // console.log(this.alldelformpeople)
    // console.log(sendDelDeatil)
    this.LoadingPage.show()
    if (sendDay > 0) {
      if (this.NoteText) {
        if (this.FlowDynamic_Base) {

          var AbscFlowHandlerSaveAndFlowStart: AbscFlowHandlerSaveAndFlowStartClass = {
            FlowApp: {
              Day: sendDay,
              HoliDayID: 0,
              FlowApps: sendDelDeatil,
              EmpID: this.writeEmpMan.EmpCode,
              EmpCode: this.writeEmpMan.EmpCode,
              EmpNameC: this.writeEmpMan.EmpNameC,
              State: "1"
            },
            FlowDynamic: {
              FlowNode: "500",
              RoleID: "",
              EmpID: this.FlowDynamic_Base.EmpID,
              DeptID: this.FlowDynamic_Base.DeptaID.toString(),
              PosID: this.FlowDynamic_Base.JobID.toString()
            }
          }
          // console.log(AbscFlowHandlerSaveAndFlowStart)

          this.GetApiDataServiceService.getWebApiData_AbscFlowHandlerSaveAndFlowStart(AbscFlowHandlerSaveAndFlowStart)
            .pipe(takeWhile(() => this.api_subscribe))
            .subscribe(
              (x: any) => {
                // console.log(x)
                if (x == 1) {
                  $('#sussesdialog').modal('show');

                  var _DateB = new Date()
                  _DateB.setDate(_DateB.getDate() - 7)
                  var _DateE = new Date()
                  _DateE.setDate(_DateE.getDate() + 360)
                  this.reload(this.searchEmpCode, _DateB, _DateE)
                  // this.loading=false
                } else {
                  alert(x)
                }
                this.LoadingPage.hide()
              }, error => {
                this.LoadingPage.hide()
              }
            )
        }
        else {
          alert('請選擇簽核人員')
          // this.loading=false
          this.LoadingPage.hide()
        }
      } else {
        alert('請填寫銷假事由')
        // this.loading=false
        this.LoadingPage.hide()
      }
    } else {
      alert('請選擇銷假日期')
      // this.loading=false
      this.LoadingPage.hide()
    }
  }

  reload(EmpID: string, _DateB, _DateE) {
    this.LoadingPage.show()
    this.alldelformpeople = []
    this.NoteText = '';
    // console.log(doFormatDate(_DateB))
    // console.log(doFormatDate(_DateE))

    var AbscIntegrationHandlerGetAbsFlowApps: AbscIntegrationHandlerGetAbsFlowAppsClass = {
      DateB: doFormatDate(_DateB),
      DateE: doFormatDate(_DateE),
      EmpID: EmpID
    }

    // this.GetApiDataServiceService.getWebApiData_GetBaseInfoDetail(EmpID)
    //   .pipe(takeWhile(() => this.api_subscribe))
    //   .subscribe(
    //     (GetBaseInfoDetail: GetBaseInfoDetailClass[]) => {

    this.GetApiDataServiceService.getWebApiData_AbscIntegrationHandlerGetAbsFlowApps(AbscIntegrationHandlerGetAbsFlowApps)
      .pipe(takeWhile(() => this.api_subscribe))
      .subscribe(
        (x: any) => {
          // console.log(x)
          // var foundGetBaseInfoDetail = GetBaseInfoDetail.find(function (element) {
          //   return element.PosType == 'M'
          // });
          this.alldelformpeople = []
          if (x.length == 0) {
            // this.loading = false
            this.showdataIsEmpty = true
            this.LoadingPage.hide()
          } else {

            for (let i = 0; i < x.length; i++) {

              var allDay = 0
              var allHour = 0
              var allMinute = 0
              var calProcessID = void_completionTenNum(x[i].ProcessID)

              this.alldelformpeople.push({
                startdate: formatDateTime(x[i].DateB).getDate,
                starttime: getapi_formatTimetoString(x[i].TimeB),
                enddate: formatDateTime(x[i].DateE).getDate,
                endtime: getapi_formatTimetoString(x[i].TimeE),
                everyday: x[i].Circulate,
                holiday: { id: x[i].HoliDayID, name: x[i].HoliDayNameC },
                calday: 0,
                calhour: 0,
                calminute: 0,
                EmpID: x[i].EmpID,
                EmpCode: x[i].EmpCode,
                EmpNameC: x[i].EmpNameC,
                eventDate:formatDateTime(x[i].EventDate).getDate,
                keyName:x[i].KeyName,

                ProcessID: calProcessID,

                AgentNobr1: x[i].AgentNobr1,
                AgentName1: x[i].AgentName1,

                _id: '',
                _idherf: '#',
                checkedstate: false,
                selectDetailSeveral: '0',

                detail_vaform: []
              })
              for (let detail of x[i].AbsFlowAppsDetail) {

                var setDay = 0
                var setHour = 0
                var setMin = 0
                //計算日時分
                setDay = detail.UseDayHourMinute.Day
                setHour = detail.UseDayHourMinute.Hour
                setMin = detail.UseDayHourMinute.Minute

                allDay = allDay + setDay
                allHour = allHour + setHour
                allMinute = allMinute + setMin

                var di = 1
                if (!this.isSearchAssistant && detail.State == '3') {
                  //如果不是行政不能突破明細7天限制
                  //例如請6/1~6/30，假如今天是6/9號，那明細的6/1號就不能銷假
                  var caldate: any = new Date(formatDateTime(detail.DateB).getDate)
                  var today = new Date()
                  today.setHours(0, 0, 0)
                  today.setMinutes(0, 0, 0)
                  today.setSeconds(0, 0)
                  var seventDayAgo = today.setDate(today.getDate() - 7)
                  if (caldate < seventDayAgo) {
                    detail.State = '7'
                  }

                }
                if (detail.State !='3') {
                  di = 0
                }
                this.alldelformpeople[i].detail_vaform.push({
                  disable: di,
                  state: detail.State,
                  checkState: false,
                  startdate: formatDateTime(detail.DateTimeB).getDate,
                  starttime: getapi_formatTimetoString(formatDateTime(detail.DateTimeB).getTime),
                  endtime: getapi_formatTimetoString(formatDateTime(detail.DateTimeE).getTime),
                  calday: setDay,
                  calhour: setHour,
                  calminute: setMin,
                  Use: detail.Use,
                  holiday: { id: x[i].HoliDayID, name: x[i].HoliDayNameC },
                  EmpID: x[i].EmpID,
                  EmpCode: x[i].EmpCode,
                  EmpNameC: x[i].EmpNameC,
                  DateTimeB:detail.DateTimeB,
                  DateTimeE:detail.DateTimeE,
                  AbsentMinusDetailId:detail.AbsentMinusDetailId
                })
                this.alldelformpeople[i].calday = allDay
                this.alldelformpeople[i].calhour = allHour
                this.alldelformpeople[i].calminute = allMinute
                
                this.LoadingPage.hide()

              }
            }
            // console.log(this.alldelformpeople)
            for (let i = 0; i < this.alldelformpeople.length; i++) {
              this.alldelformpeople[i]._id = 'del_id' + i;
              this.alldelformpeople[i]._idherf = '#del_id' + i;
            }
          }
        },
        (error: any) => {
          // this.loading = false
          this.LoadingPage.hide()
          // alert('api連線錯誤，AbscIntegrationHandlerGetAbsFlowApps')
        }
      )
    //   }, error => {
    //     this.LoadingPage.hide()
    //   }
    // )
  }


  errorEmp = { state: false, errorString: '' };
  errorStartDate = { state: false, errorString: '' };
  errorEndDate = { state: false, errorString: '' };
  searchDateB
  searchDateE
  chooseEmp() {
    if (this.EmpBase.EmpCode.length == 6) {
      var _NowDate = new Date();
      var _NowToday = doFormatDate(_NowDate);
      var GetBaseByFormClass: GetBaseByFormClass = {
        EmpCode: this.writeEmpMan.EmpCode,
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
          }else{
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

    } else {
      this.searchEmpCode = this.EmpBase.EmpCode
      this.searchEmpName = this.EmpBase.Name
      this.isSearchAssistant = true  //如果是行政可以突破明細7天限制
      this.reload(this.EmpBase.EmpCode, this.searchDateB, this.searchDateE)
    }
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
}

class delvaformClass {
  startdate: string;
  starttime: string;
  enddate: string;
  endtime: string;
  everyday: boolean;
  holiday: holidayClass;
  calday: number;
  calhour: number;
  calminute: number;
  eventDate:string;
  keyName:string;
  
  EmpID: string
  EmpCode: string
  EmpNameC: string

  detail_vaform: detail[]

  AgentNobr1: string
  AgentName1: string

  ProcessID: string
  _id: string;
  _idherf: string;
  checkedstate: boolean;
  selectDetailSeveral: string;
}

class detail {
  disable: number;
  state: string;
  checkState: boolean;
  startdate: string;
  starttime: string;
  endtime: string;
  calday: number;
  calhour: number;
  calminute: number;
  Use: number;
  holiday: holidayClass
  EmpID: string
  EmpCode: string
  EmpNameC: string
  DateTimeB: string
  DateTimeE: string
  AbsentMinusDetailId:number
}
class holidayClass {
  id: string;
  name: string;
}
