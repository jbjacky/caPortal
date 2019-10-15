import { Component, OnInit, OnDestroy, AfterViewInit, OnChanges } from '@angular/core';
import { fromEvent, Subscription, from, BehaviorSubject, Observable } from 'rxjs';
import { debounceTime, takeWhile, mergeMap, map, toArray } from 'rxjs/operators';
import { ViewportScroller } from '@angular/common';
import { ReviewformServiceService } from 'src/app/Service/reviewform-service.service';
import { Router } from '@angular/router';
import { GetApiDataServiceService } from 'src/app/Service/get-api-data-service.service';
import { void_completionTenNum } from 'src/app/UseVoid/void_CompletionTenNum';
import { chinesenum } from 'src/app/UseVoid/void_chinesenumber';
import { formatDateTime, doFormatDate } from 'src/app/UseVoid/void_doFormatDate';
import { getapi_formatTimetoString } from 'src/app/UseVoid/void_doFormatDate';
import { FileDownloadService } from 'src/app/Service/file-download.service';
import { FlowNodeFinishClass } from 'src/app/Models/PostData_API_Class/FlowNodeFinishClass';
import { showUploadFileClass } from 'src/app/Models/showUploadFileClass';
import { NgxSpinnerService } from 'ngx-spinner';
import { showFlowView } from 'src/app/View/search-form/search-form.component';
import { GetFlowViewClass } from 'src/app/Models/PostData_API_Class/GetFlowViewClass';
import { drawCalendarClass, SearchMan } from 'src/app/Models/CalendarClass';
import { GetAttendCalendarClass } from 'src/app/Models/PostData_API_Class/GetAttendCalendarClass';
import { void_crossDay } from 'src/app/UseVoid/void_crossDay';
import { GetApiUserService } from 'src/app/Service/get-api-user.service';
import { GetAttendCalendarSimplifyData } from 'src/app/Models/GetAttendCalendarSimplifyData';
import { GetSelectBaseClass } from 'src/app/Models/GetSelectBaseClass';
import { NewVaSearchFlowSignClass } from 'src/app/Models/NewVaSearchFlowSignClass';
import { GetFlowViewAbsGetApiDataClass } from 'src/app/Models/GetFlowViewAbsGetApiDataClass';
import { ExampleHeader } from 'src/app/Service/datepickerHeader';
import { FlowNodeFinishGetDataClass } from 'src/app/Models/FlowNodeFinishGetDataClass';
import { vaRote } from 'src/app/Models/vaform';
import { MatSnackBar } from '@angular/material';
import { SussesApproveSnackComponent } from 'src/app/View/shareComponent/snackbar/susses-approve-snack/susses-approve-snack.component';
import { SnackSetting } from 'src/app/View/shareComponent/snackbar/SnackSetting';
import { ErrorApproveSnackComponent } from 'src/app/View/shareComponent/snackbar/error-approve-snack/error-approve-snack.component';
import { SussesSendbackSnackComponent } from 'src/app/View/shareComponent/snackbar/susses-sendback-snack/susses-sendback-snack.component';
import { ErrorSendbackSnackComponent } from 'src/app/View/shareComponent/snackbar/error-sendback-snack/error-sendback-snack.component';
import { SussesPutForwardSnackComponent } from 'src/app/View/shareComponent/snackbar/susses-put-forward-snack/susses-put-forward-snack.component';
import { ErrorPutForwardSnackComponent } from 'src/app/View/shareComponent/snackbar/error-put-forward-snack/error-put-forward-snack.component';

declare let $: any; //use jquery

@Component({
  selector: 'app-reviewform-detail-vacation',
  templateUrl: './reviewform-detail-vacation.component.html',
  styleUrls: ['./reviewform-detail-vacation.component.css']
})
export class ReviewformDetailVacationComponent implements OnInit, OnDestroy, AfterViewInit {
  exampleHeader = ExampleHeader //日期套件header
  ngAfterViewInit(): void {
    //顯示視窗前呼叫
    // $("#OneDay_RecentHoliday").on("show.bs.modal", function (e) {
    //   console.log('顯示視窗前呼叫');
    //   $('#CalendarSimulation').modal('hide')
    // });
  }

  getVaData: showFlowView[] = []//近期假單


  private Be_RoteApiData$: BehaviorSubject<any> = new BehaviorSubject<any>(0); //月曆模擬
  Ob_RoteApiData$: Observable<any> = this.Be_RoteApiData$; //月曆模擬

  scrollTo(tag: string) {
    this.viewScroller.scrollToAnchor(tag);
    //tag=id連結位置
  }

  ngOnDestroy(): void {
    // throw new Error("Method not implemented.");
    this.api_subscribe = false;
  }
  api_subscribe = true; //ngOnDestroy時要取消訂閱api的subscribe

  sussestext: string = '';
  onesendvaform(_sussestext) { this.sussestext = _sussestext; }
  inbodybuttomdiv = 'inherit';
  buttomdiv = 'inherit';

  inbodybuttomdiv_phone = 'inherit';
  buttomdiv_phone = 'inherit';

  isdesktop: boolean = true;
  constructor(private viewScroller: ViewportScroller,
    public ReviewformServiceService: ReviewformServiceService,
    private router: Router,
    private GetApiDataServiceService: GetApiDataServiceService,
    private FileDownloadService: FileDownloadService,
    private LoadingPage: NgxSpinnerService,
    private GetApiUserService: GetApiUserService,
    private SnackBar: MatSnackBar) {
  }

  desktopOrphone() {
    if (window.innerWidth > 768) {
      this.inbodybuttomdiv = 'inherit';
      this.buttomdiv = 'inherit';
      this.inbodybuttomdiv_phone = 'none';
      this.buttomdiv_phone = 'none';
      this.isdesktop = true;
    } else {
      this.inbodybuttomdiv = 'none';
      this.buttomdiv = 'none';
      this.inbodybuttomdiv_phone = 'inherit';
      this.buttomdiv_phone = 'inherit';
      this.isdesktop = false;
    }
  }

  // showVaDetail:ReviewVaDetailClass[]=[];
  uishowVaDetail: uishowVaDetailClass[] = [];//顯示差假時段資料
  uishowProcessFlowID = ''

  private Sub_onChangeSignMan$: BehaviorSubject<any> = new BehaviorSubject(0)
  onChangeSingMan$: Observable<any> = this.Sub_onChangeSignMan$; //切換選擇簽核人員使用

  FirstEmpCode: string = ''
  ngOnInit() {

    this.SearchDateB.setDate(this.SearchDateB.getDate() - 30)
    this.SearchDateE.setDate(this.SearchDateE.getDate() + 30)

    this.Sub_onChangeSignMan$.next(this.ReviewformServiceService.showReviewMan.EmpCode)
    this.GetApiUserService.counter$.subscribe(
      (x: any) => {
        if (x != 0) {
          this.FirstEmpCode = x.EmpCode
        }
      }
    )

    if (!this.ReviewformServiceService.vaDetail) {
      this.router.navigate(['../nav/reviewform']);
    } else {
      var drawCalendar = {
        Year: '',
        Month: '',
        dateworks: []
      }
      this.Be_RoteApiData$.next(drawCalendar)
      this.LoadingPage.show();
      this.desktopOrphone();
      fromEvent(window, 'resize')
        .pipe(debounceTime(500))
        .pipe(takeWhile(() => this.api_subscribe))
        .subscribe((event) => {
          this.desktopOrphone();
        })
      // 倒底時切換至內頁
      // fromEvent(window, 'scroll')
      //   .pipe(debounceTime(100)) //當使用者在0.1秒內沒動作就執行
      //   .pipe(takeWhile(() => this.api_subscribe))
      //   .subscribe((event) => {
      //     var last = document.body.scrollHeight - window.innerHeight
      //     //https://pjchender.blogspot.com/2015/04/jquery.html
      //     if (window.scrollY >= last) {
      //       //當scrollbar到底時
      //       if (this.isdesktop) {
      //         this.inbodybuttomdiv = 'inherit';
      //         this.buttomdiv = 'none';
      //       } else {
      //         this.inbodybuttomdiv_phone = 'inherit';
      //         this.buttomdiv_phone = 'inherit';
      //       }
      //     } else {
      //       if (this.isdesktop) {
      //         this.inbodybuttomdiv = 'none';
      //         this.buttomdiv = 'inherit';
      //       } else {
      //         this.inbodybuttomdiv_phone = 'inherit';
      //         this.buttomdiv_phone = 'inherit';
      //       }
      //     }
      //   })


      // console.log(this.ReviewformServiceService.vaDetail.ProcessFlowID)

      this.GetApiDataServiceService.getWebApiData_GetAbsFlowAppsByProcessFlowID(this.ReviewformServiceService.vaDetail.ProcessFlowID, true)
        .pipe(takeWhile(() => this.api_subscribe))
        .subscribe(
          (x: any) => {

            // console.log(x)

            var getSearchDate = new Date(x.FlowApps[0].DateB)
            this.SearchCalendarSimulationDate = new Date(formatDateTime(getSearchDate).getDate)

            this.uishowVaDetail = []
            var i = 0

            for (let data of x.FlowApps) {

              i++
              var getSetAbsFlowAppsDetail: showAbsFlowAppsDetailClass[] = []

              for (let AbsFlowAppsDetail of data.AbsFlowAppsDetail) {

                var _vaOneOffTime = void_crossDay(formatDateTime(AbsFlowAppsDetail.DateTimeE).getTime).EndTime
                var _ActualRote_calCrossDay = void_crossDay(formatDateTime(AbsFlowAppsDetail.DateTimeE).getTime).isCrossDay

                var _vaRote: vaRote
                var _vaRestClass: vaRestClass[] = []
                if (AbsFlowAppsDetail.Rote) {
                  if (AbsFlowAppsDetail.Rote.RoteRest) {
                    _vaRote = JSON.parse(JSON.stringify(AbsFlowAppsDetail.Rote))
                    for (let aa of AbsFlowAppsDetail.Rote.RoteRest) {
                      _vaRestClass.push({
                        vaRestOnTime: getapi_formatTimetoString(aa.TimeB),
                        vaRestOffTime: getapi_formatTimetoString(aa.TimeE)
                      })
                    }
                  }
                }
                getSetAbsFlowAppsDetail.push(
                  {
                    vaOneDate: formatDateTime(AbsFlowAppsDetail.DateTimeB).getDate,
                    vaOneOnTime: getapi_formatTimetoString(formatDateTime(AbsFlowAppsDetail.DateTimeB).getTime),
                    vaOneOffTime: getapi_formatTimetoString(_vaOneOffTime),
                    vaRest: _vaRestClass,
                    AllUse: AbsFlowAppsDetail.Use,
                    vaUseDay: AbsFlowAppsDetail.UseDayHourMinute.Day.toString(),
                    vaUseHour: AbsFlowAppsDetail.UseDayHourMinute.Hour.toString(),
                    vaUseMinute: AbsFlowAppsDetail.UseDayHourMinute.Minute.toString(),
                    ActualRote_calCrossDay: _ActualRote_calCrossDay,
                    vaRote: _vaRote
                  })

              }

              if (data.EventDate) {
                data.EventDate = formatDateTime(data.EventDate).getDate
              }
              this.uishowVaDetail.push({
                uitext: '差假時段' + chinesenum(i),
                startDate: formatDateTime(data.DateTimeB).getDate,
                startTime: getapi_formatTimetoString(formatDateTime(data.DateTimeB).getTime),
                endDate: formatDateTime(data.DateTimeE).getDate,
                endTime: getapi_formatTimetoString(formatDateTime(data.DateTimeE).getTime),
                proxyName: data.AgentName1,
                cause: data.Note,
                AllUseDay: data.UseDayHourMinute.Day,
                AllUseHour: data.UseDayHourMinute.Hour,
                AllUseMinute: data.UseDayHourMinute.Minute,
                HolidayName: data.HoliDayNameC,
                uploadFile: data.UploadFile,
                AbsFlowAppsDetail: data.AbsFlowAppsDetail,
                uishowAbsFlowAppsDetail: getSetAbsFlowAppsDetail,
                Circulate: data.Circulate,
                Today: data.Today,
                Appointment: data.Appointment,
                AutoKey: data.AutoKey,
                KeyName: data.KeyName,
                EventDate: data.EventDate
              })
              // console.log(this.uishowVaDetail)
              this.LoadingPage.hide();

              var calSearchDateB = new Date(this.uishowVaDetail[0].startDate + ' ' + '00:00')
              calSearchDateB.setDate(calSearchDateB.getDate() - 30)
              this.SearchDateB = new Date(calSearchDateB)

              var calSearchDateE = new Date(this.uishowVaDetail[0].startDate + ' ' + '00:00')
              calSearchDateE.setDate(calSearchDateE.getDate() + 30)
              this.SearchDateE = new Date(calSearchDateE)
            }
            // console.log(x[0].EmpID)

          },
          (error) => {
            // alert('與api取得資料錯誤，GetAbsFlowAppsByProcessFlowID')
          }
        )

      this.uishowProcessFlowID = void_completionTenNum(this.ReviewformServiceService.vaDetail.ProcessFlowID)
    }

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
                TransSign: false,//轉呈
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

  backReview() {
    this.ReviewformServiceService.changeReview('vaTab', this.ReviewformServiceService.showReviewMan)
  }


  onCheckCollapseIn(i) {
    //確認是否收合請假明細
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

  base64(upload: showUploadFileClass) {
    // console.log(upload.ServerName)
    // this.LoadingPage.show()
    this.GetApiDataServiceService.getWebApiData_GetUploadFileByStreamOnly(upload.ServerName)
    // .pipe(takeWhile(() => this.api_subscribe))
    // .subscribe(
    //   (data: Array<any>) => {
    //     // this.FileDownloadService.base64(data[0])
    //     this.LoadingPage.hide()
    //   }
    //   , error => {
    //     this.LoadingPage.hide()
    //   }
    // )
    // this.FileDownloadService.base64(upload);
  }

  vaShowLimitText = ''

  checkAbsLimit_Approved() {
    this.LoadingPage.show()
    this.GetApiDataServiceService.getWebApiData_AbsLimitCheck(parseInt(this.ReviewformServiceService.vaDetail.ProcessFlowID))
      .pipe(takeWhile(() => this.api_subscribe))
      .subscribe(
        (x: string) => {
          this.vaShowLimitText = x.toString()
          this.LoadingPage.hide()
          $('#Approveddialog').modal('show')
        }
      )
  }

  checkAbsLimit_PutForward() {
    this.LoadingPage.show()
    $('#vaPutForwarddialog').modal('show')
    if (!this.FlowDynamic_Base) {
      alert('請選擇呈核人員')
      this.LoadingPage.hide()
    } else {
      this.GetApiDataServiceService.getWebApiData_AbsLimitCheck(parseInt(this.ReviewformServiceService.vaDetail.ProcessFlowID))
        .pipe(takeWhile(() => this.api_subscribe))
        .subscribe(
          (x: string) => {
            this.vaShowLimitText = x.toString()
            this.LoadingPage.hide()
            $('#PutForwarddialog').modal('show');
          }
        )
    }
  }

  signText: string;
  Approved_Click() {
    this.LoadingPage.show()
    this.GetApiDataServiceService.getWebApiData_GetManInfo(this.FirstEmpCode)
      .pipe(takeWhile(() => this.api_subscribe))
      .subscribe(
        y => {

          if (this.FirstEmpCode != this.ReviewformServiceService.showReviewMan.EmpCode) {
            y[0].EmpName += '(代)'
          }

          if (!this.signText) {
            this.signText = ''
          }
          var FlowNodeFinish: FlowNodeFinishClass = {
            ProcessFlowID: parseInt(this.ReviewformServiceService.vaDetail.ProcessFlowID),
            ProcessApParmAuto: parseInt(this.ReviewformServiceService.vaDetail.ProcessApParmAuto),
            State: "3",
            FlowTreeID: this.ReviewformServiceService.vaDetail.FlowTreeID,
            FlowNodeID: this.ReviewformServiceService.vaDetail.FlowNodeID,
            Note: this.signText,
            NodeName: "核准",
            ManInfo: y[0],
            FlowDynamic: {
              FlowNode: this.ReviewformServiceService.vaDetail.FlowNodeID,
              RoleID: this.ReviewformServiceService.showReviewMan.RoleID,
              EmpID: this.ReviewformServiceService.showReviewMan.EmpCode,
              DeptID: '',
              PosID: ''
            },
            CheckEmpID: this.ReviewformServiceService.showReviewMan.EmpCode
          }
          // console.log(FlowNodeFinish)
          this.LoadingPage.show()
          this.GetApiDataServiceService.getWebApiData_FlowNodeFinish(FlowNodeFinish)
            .pipe(takeWhile(() => this.api_subscribe))
            .subscribe(
              (x: FlowNodeFinishGetDataClass) => {
                this.LoadingPage.hide()
                if (x.Finish) {
                  // $('#Approveddialog_sussesdialog').modal('show');
                  this.SnackBar.openFromComponent(SussesApproveSnackComponent, {
                    data: null,
                    panelClass: 'SussesSnackClass',
                    duration: SnackSetting.duration,
                    verticalPosition: SnackSetting.verticalPosition,
                    horizontalPosition: SnackSetting.horizontalPosition
                  });
                  this.router.navigateByUrl('/nav/reviewform')
                } else {
                  // alert(x.MessageContent)
                  this.SnackBar.openFromComponent(ErrorApproveSnackComponent, {
                    data: x.MessageContent,
                    panelClass: 'ErrorSnackClass',
                    duration: SnackSetting.duration,
                    verticalPosition: SnackSetting.verticalPosition,
                    horizontalPosition: SnackSetting.horizontalPosition
                  });
                }
                this.LoadingPage.hide()
              },
              error => {
                this.LoadingPage.hide()
              }
            )
        },
        error => {
          this.LoadingPage.hide()
          // alert('與api連線異常，getWebApiData_GetManInfo')
        }
      )
  }
  Sendback_Click() {
    this.LoadingPage.show()
    this.GetApiDataServiceService.getWebApiData_GetManInfo(this.FirstEmpCode)
      .pipe(takeWhile(() => this.api_subscribe))
      .subscribe(
        y => {

          if (this.FirstEmpCode != this.ReviewformServiceService.showReviewMan.EmpCode) {
            y[0].EmpName += '(代)'
          }

          if (!this.signText) {
            this.signText = ''
          }
          var FlowNodeFinish: FlowNodeFinishClass = {
            ProcessFlowID: parseInt(this.ReviewformServiceService.vaDetail.ProcessFlowID),
            ProcessApParmAuto: parseInt(this.ReviewformServiceService.vaDetail.ProcessApParmAuto),
            State: "2",
            FlowTreeID: this.ReviewformServiceService.vaDetail.FlowTreeID,
            FlowNodeID: this.ReviewformServiceService.vaDetail.FlowNodeID,
            Note: this.signText,
            NodeName: "重擬",
            ManInfo: y[0],
            FlowDynamic: {
              FlowNode: this.ReviewformServiceService.vaDetail.FlowNodeID,
              RoleID: this.ReviewformServiceService.showReviewMan.RoleID,
              EmpID: this.ReviewformServiceService.showReviewMan.EmpCode,
              DeptID: '',
              PosID: ''
            },
            CheckEmpID: this.ReviewformServiceService.showReviewMan.EmpCode
          }
          // console.log(FlowNodeFinish)
          this.LoadingPage.show()
          this.GetApiDataServiceService.getWebApiData_FlowNodeFinish(FlowNodeFinish)
            .pipe(takeWhile(() => this.api_subscribe))
            .subscribe(
              (x: FlowNodeFinishGetDataClass) => {
                this.LoadingPage.hide()
                if (x.Finish) {
                  // $('#Sendbackdialog_sussesdialog').modal('show');
                  this.SnackBar.openFromComponent(SussesSendbackSnackComponent, {
                    data: null,
                    panelClass: 'SussesSnackClass',
                    duration: SnackSetting.duration,
                    verticalPosition: SnackSetting.verticalPosition,
                    horizontalPosition: SnackSetting.horizontalPosition
                  });
                  this.router.navigateByUrl('/nav/reviewform')
                } else {
                  // alert(x.MessageContent)
                  this.SnackBar.openFromComponent(ErrorSendbackSnackComponent, {
                    data: x.MessageContent,
                    panelClass: 'ErrorSnackClass',
                    duration: SnackSetting.duration,
                    verticalPosition: SnackSetting.verticalPosition,
                    horizontalPosition: SnackSetting.horizontalPosition
                  });
                }
                this.LoadingPage.hide()
              },
              error => {
                this.LoadingPage.hide()
              }
            )
        }
      )
  }
  PutForward_Click() {
    this.LoadingPage.show()
    this.GetApiDataServiceService.getWebApiData_GetManInfo(this.FirstEmpCode)
      .pipe(takeWhile(() => this.api_subscribe))
      .subscribe(
        y => {

          if (this.FirstEmpCode != this.ReviewformServiceService.showReviewMan.EmpCode) {
            y[0].EmpName += '(代)'
          }

          if (!this.signText) {
            this.signText = ''
          }
          var FlowNodeFinish: FlowNodeFinishClass = {
            ProcessFlowID: parseInt(this.ReviewformServiceService.vaDetail.ProcessFlowID),
            ProcessApParmAuto: parseInt(this.ReviewformServiceService.vaDetail.ProcessApParmAuto),
            State: "1",
            FlowTreeID: this.ReviewformServiceService.vaDetail.FlowTreeID,
            FlowNodeID: this.ReviewformServiceService.vaDetail.FlowNodeID,
            Note: this.signText,
            NodeName: "呈核",
            ManInfo: y[0],
            FlowDynamic: {
              FlowNode: this.ReviewformServiceService.vaDetail.FlowNodeID,
              RoleID: '',
              EmpID: this.FlowDynamic_Base.EmpID.toString(),
              DeptID: this.FlowDynamic_Base.DeptaID.toString(),
              PosID: this.FlowDynamic_Base.JobID.toString()
            },
            CheckEmpID: this.ReviewformServiceService.showReviewMan.EmpCode
          }
          // console.log(FlowNodeFinish)
          this.LoadingPage.show()
          this.GetApiDataServiceService.getWebApiData_FlowNodeFinish(FlowNodeFinish)
            .pipe(takeWhile(() => this.api_subscribe))
            .subscribe(
              (x: FlowNodeFinishGetDataClass) => {
                this.LoadingPage.hide()
                if (x.Finish) {
                  // $('#PutForwarddialog_sussesdialog').modal('show');
                  this.SnackBar.openFromComponent(SussesPutForwardSnackComponent, {
                    data: null,
                    panelClass: 'SussesSnackClass',
                    duration: SnackSetting.duration,
                    verticalPosition: SnackSetting.verticalPosition,
                    horizontalPosition: SnackSetting.horizontalPosition
                  });
                  this.router.navigateByUrl('/nav/reviewform')
                } else {
                  // alert(x.MessageContent)
                  this.SnackBar.openFromComponent(ErrorPutForwardSnackComponent, {
                    data: x.MessageContent,
                    panelClass: 'ErrorSnackClass',
                    duration: SnackSetting.duration,
                    verticalPosition: SnackSetting.verticalPosition,
                    horizontalPosition: SnackSetting.horizontalPosition
                  });
                }
                this.LoadingPage.hide()
              },
              error => {
                this.LoadingPage.hide()
              }

            )

        }, error => {
          this.LoadingPage.hide()
          // alert('與api連線異常，getWebApiData_GetManInfo')
        }
      )


  }

  sendFinish() {
    this.backReview()
    this.router.navigate(['../nav/reviewform']);
  }


  FlowDynamic_Base: GetSelectBaseClass;
  chooseBase(GetSelectBase: GetSelectBaseClass) {
    this.FlowDynamic_Base = GetSelectBase
  }

  TodayChange(AutoKey, nowBoolean) {
    this.LoadingPage.show()
    this.GetApiDataServiceService.getWebApiData_SaveToday(AutoKey, nowBoolean)
      .pipe(takeWhile(() => this.api_subscribe))
      .subscribe(
        x => {
          this.LoadingPage.hide()
        },
        error => {
          // alert('與api連線錯誤，getWebApiData_SaveToday')
          this.LoadingPage.hide()
        }
      )
  }

  SearchCalendarSimulationDate = new Date()
  formatDate() {
    var showYear = doFormatDate(this.SearchCalendarSimulationDate).split('/')[0]
    var showDate = doFormatDate(this.SearchCalendarSimulationDate).split('/')[1]
    var showYearDate = showYear + '/' + showDate
    return showYearDate
  }
  lessMonth() {
    this.SearchCalendarSimulationDate.setMonth(this.SearchCalendarSimulationDate.getMonth() - 1)
    this.bt_CalendarSimulation(this.SearchCalendarSimulationDate)
  }
  addMonth() {
    this.SearchCalendarSimulationDate.setMonth(this.SearchCalendarSimulationDate.getMonth() + 1)
    this.bt_CalendarSimulation(this.SearchCalendarSimulationDate)
  }
  bt_CalendarSimulation(searchDay) {
    var startday = searchDay
    var checkYear: any = doFormatDate(startday).toString().split('/')[0];
    var checkMonth: any = doFormatDate(startday).toString().split('/')[1];
    var MonthFirstDate = new Date(checkYear, checkMonth - 1, 1)
    var MonthEndDate = new Date(checkYear, checkMonth, 0)
    MonthFirstDate.setDate(MonthFirstDate.getDate() - 7)
    MonthEndDate.setDate(MonthEndDate.getDate() + 12)
    var searchFirstDate = doFormatDate(MonthFirstDate).toString()
    var searchEndDate = doFormatDate(MonthEndDate).toString()
    // alert(searchFirstDate.toString() + '\n' + searchEndDate.toString())
    // alert(searchFirstDate.toString() + '\n' + searchEndDate.toString())
    this.LoadingPage.show()
    var GetAttendCalendar: GetAttendCalendarClass = {
      DateB: searchFirstDate.toString(),
      DateE: searchEndDate.toString(),
      EmpID: this.ReviewformServiceService.vaDetail.EmpCode.toString()
    }
    this.GetApiDataServiceService.getWebApiData_GetAttendCalendarSimplify(GetAttendCalendar)
      .pipe(takeWhile(() => this.api_subscribe))
      .subscribe(
        (x: GetAttendCalendarSimplifyData[]) => {
          // console.log(x);
          if (x) {
            if (x.length == 0) {
              alert('查無班表資料')
              this.LoadingPage.hide()
            } else {
              var drawCalendar: drawCalendarClass = new drawCalendarClass();
              drawCalendar.SearchMan = new SearchMan()
              drawCalendar.Year = checkYear
              drawCalendar.Month = checkMonth
              drawCalendar.SearchMan.jobID = this.ReviewformServiceService.vaDetail.EmpCode.toString()
              drawCalendar.SearchMan.name = this.ReviewformServiceService.vaDetail.EmpNameC.toString()
              drawCalendar.dateworks = []
              for (let data of x) {
                var todayVa: boolean = false
                var todayAtterror: boolean = false
                var todayHoliday: boolean = false
                if (data.Abs || data.AbsFlow) {
                  //db 或 flow 有請假資料
                  todayVa = true
                }
                if (data.AttendExceptional) {
                  todayAtterror = true
                }
                if (data.Holiday) {
                  //這天是否為放假
                  todayHoliday = true
                }
                drawCalendar.dateworks.push({
                  daytext: formatDateTime(data.AttendDate).getDate,
                  showText: '',
                  // routeName: data.ActualRote.RoteCode + data.ActualRote.RoteNameC,
                  roteID: data.ActualRoteID,
                  routeName: data.ActualRoteName,
                  onTime: data.OnTime,
                  offTime: data.OffTime,
                  isVa: todayVa,
                  isAtterror: todayAtterror,
                  isHoliday: todayHoliday
                })

                this.Be_RoteApiData$.next(drawCalendar)
              }
              this.LoadingPage.hide()

              // $('#CalendarSimulation').modal({ backdrop: false })
              $("#CalendarSimulation").modal('show')
            }
          } else {
            alert('查無出勤資料')
            this.LoadingPage.hide()
          }
        }, error => {
          alert('與api連線異常，getWebApiData_GetAttendCalendar')
          this.LoadingPage.hide()

        }
      )

  }


  signRecordDialog: boolean = false
  show_signRecord() {
    if (!this.signRecordDialog) {
      this.signRecordDialog = true
    }
    $('#signRecord').modal('show')
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


class ReviewVaDetailClass {
  ProcessID: number
  Serno: string
  HoliDayName: string
  DateB: string
  DateE: string
  DateTimeB: string
  DateTimeE: string
  EventDate: string
  AbsFlowAppsDetail: AbsFlowAppsDetailClass[]
  EmpID: string
  EmpCode: string
  EmpNameC: string
  RoteID: string
  TimeB: string
  TimeE: string
  HoliDayID: string
  HoliDayNameC: string
  Use: string
  Day: string
  Balance: string
  HoliDayUnitName: string
  AgentNobr1: string
  AgentName1: string
  AgentNote: string
  Note: string
  Info: string
  KeyName: string
  UploadFile: any[]
  MailBody: string
  State: string
  Today: boolean
  Circulate: boolean
  Appointment: boolean
  AutoKey: number
}

class AbsFlowAppsDetailClass {
  DateB: string
  DateTimeB: string
  DateTimeE: string
  AbsFlowAppsTrans: any[]
  State: string
  EmpID: string
  TimeB: string
  TimeE: string
  HoliDayID: number
  Use: number
  RoteRestList: RoteRestListClass[]
}
class RoteRestListClass {
  RoteID: number
  Seq: number
  TimeB: string
  TimeE: string
  Minute: number
  IsNormalAbs: boolean
  IsNormalOt: boolean
  IsHoliDayAbs: boolean
  IsHoliDayOt: boolean
}



class FormSign {
  DeptNameC: string
  EmpCode: string
  EmpID: string
  EmpNameC: string
  JobName: string
  Key1: string
  Key2: string
  NodeName: string
  Note: string
  ProcessFlowID: number
  SignDate: string
}
class showFormSign extends FormSign {
  SignDateday: string;
  SignDateTime: string;
}

class uishowVaDetailClass {
  uitext: string
  startDate: string
  startTime: string
  endDate: string
  endTime: string
  proxyName: string
  cause: string
  AllUseDay: number
  AllUseHour: number
  AllUseMinute: number
  HolidayName: string
  uploadFile: showUploadFileClass[]
  AbsFlowAppsDetail: AbsFlowAppsDetailClass[]
  uishowAbsFlowAppsDetail: showAbsFlowAppsDetailClass[]
  Circulate: boolean
  Today: boolean
  Appointment: boolean
  AutoKey: number
  KeyName: string
  EventDate: string
}
class showAbsFlowAppsDetailClass {
  vaOneDate: string
  vaOneOnTime: string
  vaOneOffTime: string
  vaRest: vaRestClass[]
  AllUse: number
  vaUseDay: string
  vaUseHour: string
  vaUseMinute: string
  ActualRote_calCrossDay: boolean
  vaRote: vaRote
}
interface vaRestClass {
  vaRestOnTime: string
  vaRestOffTime: string
}