import { Component, OnInit, OnDestroy } from '@angular/core';
import { ViewportScroller } from '@angular/common';
import { fromEvent, BehaviorSubject, Observable } from 'rxjs';
import { debounceTime, takeWhile } from 'rxjs/operators';
import { ReviewformServiceService } from 'src/app/Service/reviewform-service.service';
import { void_completionTenNum } from 'src/app/UseVoid/void_CompletionTenNum';
import { Router } from '@angular/router';
import { GetApiDataServiceService } from 'src/app/Service/get-api-data-service.service';
import { AbscIntegrationHandlerGetAbsFlowAppsClass } from 'src/app/Models/PostData_API_Class/AbscIntegrationHandlerGetAbsFlowAppsClass';
import { formatDateTime, getapi_formatTimetoString, doFormatDate } from 'src/app/UseVoid/void_doFormatDate';
import { chinesenum } from 'src/app/UseVoid/void_chinesenumber';
import { FlowNodeFinishClass } from 'src/app/Models/PostData_API_Class/FlowNodeFinishClass';
import { NgxSpinnerService } from 'ngx-spinner';
import { GetFlowViewClass } from 'src/app/Models/PostData_API_Class/GetFlowViewClass';
import { drawCalendarClass, SearchMan } from 'src/app/Models/CalendarClass';
import { GetApiUserService } from 'src/app/Service/get-api-user.service';
import { GetAttendCalendarClass } from 'src/app/Models/PostData_API_Class/GetAttendCalendarClass';
import { GetAttendCalendarSimplifyData } from 'src/app/Models/GetAttendCalendarSimplifyData';
import { GetSelectBaseClass } from 'src/app/Models/GetSelectBaseClass';
import { NewVaSearchFlowSignClass } from 'src/app/Models/NewVaSearchFlowSignClass';
import { GetFlowViewAbsGetApiDataClass } from 'src/app/Models/GetFlowViewAbsGetApiDataClass';
import { ExampleHeader } from 'src/app/Service/datepickerHeader';
import { FlowNodeFinishGetDataClass } from 'src/app/Models/FlowNodeFinishGetDataClass';
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
  selector: 'app-reviewform-detail-delform',
  templateUrl: './reviewform-detail-delform.component.html',
  styleUrls: ['./reviewform-detail-delform.component.css']
})

// 表單審核-銷假單
// state 1  請求銷假
// 2 已銷假
// 3 無異動
//dateArray中才是主管真正要核銷的天
export class ReviewformDetailDelformComponent implements OnInit, OnDestroy {
  exampleHeader = ExampleHeader //日期套件header
  ngOnDestroy(): void {
    // throw new Error("Method not implemented.");
    this.api_subscribe = false;
  }
  api_subscribe = true; //ngOnDestroy時要取消訂閱api的subscribe

  // @Output() counterChange: EventEmitter<number> = new EventEmitter<number>();//返回修改按鈕

  // previouspage() {
  //   //返回修改按鈕
  //   this.counterChange.emit();
  // } 

  sussestext: string = '';
  onesendvaform(_sussestext) { this.sussestext = _sussestext; }
  inbodybuttomdiv = 'inherit';
  buttomdiv = 'inherit';

  inbodybuttomdiv_phone = 'inherit';
  buttomdiv_phone = 'inherit';

  isdesktop: boolean = true;

  private Be_RoteApiData$: BehaviorSubject<any> = new BehaviorSubject<any>(0); //月曆模擬
  Ob_RoteApiData$: Observable<any> = this.Be_RoteApiData$; //月曆模擬

  constructor(private viewScroller: ViewportScroller,
    public ReviewformServiceService: ReviewformServiceService,
    private router: Router,
    private GetApiDataServiceService: GetApiDataServiceService,
    private LoadingPage: NgxSpinnerService,
    private GetApiUserService: GetApiUserService,
    private SnackBar: MatSnackBar) { }
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

  uishowProcessFlowID = ''
  uishowDelDetail = []

  private Sub_onChangeSignMan$: BehaviorSubject<any> = new BehaviorSubject(0)
  onChangeSingMan$: Observable<any> = this.Sub_onChangeSignMan$; //切換選擇簽核人員使用

  FirstEmpCode: string = ''
  ngOnInit() {

    this.SearchDateB.setDate(this.SearchDateB.getDate() - 30)
    this.SearchDateE.setDate(this.SearchDateE.getDate() + 30)

    this.Sub_onChangeSignMan$.next(this.ReviewformServiceService.showReviewMan.EmpCode)
    // alert(this.ReviewformServiceService.delDetail.ProcessFlowID)
    this.GetApiUserService.counter$.subscribe(
      x => {
        this.FirstEmpCode = x.EmpCode
      }
    )

    if (!this.ReviewformServiceService.delDetail) {
      this.router.navigate(['../nav/reviewform']);
    } else {
      // console.log(this.ReviewformServiceService.delDetail)
      var calSearchDateB = new Date(this.ReviewformServiceService.delDetail.dateArray[0].DateB)
      calSearchDateB.setDate(calSearchDateB.getDate() - 30)
      this.SearchDateB = new Date(calSearchDateB)

      var calSearchDateE = new Date(this.ReviewformServiceService.delDetail.dateArray[0].DateB)
      calSearchDateE.setDate(calSearchDateE.getDate() + 30)
      this.SearchDateE = new Date(calSearchDateE)

      var drawCalendar = {
        Year: '',
        Month: '',
        dateworks: []
      }
      this.Be_RoteApiData$.next(drawCalendar)

      this.desktopOrphone();
      fromEvent(window, 'resize')
        .pipe(debounceTime(500))
        .pipe(takeWhile(() => this.api_subscribe))
        .subscribe((event) => {
          this.desktopOrphone();
        })
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

      // console.log(this.ReviewformServiceService.delDetail)
      var caldateArray = []
      for (let onedatetime of this.ReviewformServiceService.delDetail.dateArray) {
        caldateArray.push(formatDateTime(onedatetime.DateB).getDate)
        caldateArray.push(formatDateTime(onedatetime.DateE).getDate)
      }
      var sortdateArray = caldateArray.sort((a: any, b: any) => {
        let left = Number(new Date(a));
        let right = Number(new Date(b));
        return left - right;
      });
      var firstDate = sortdateArray[0]
      var lastDate = sortdateArray[sortdateArray.length - 1]
      var AbscIntegrationHandlerGetAbsFlowApps: AbscIntegrationHandlerGetAbsFlowAppsClass = {
        DateB: firstDate, //firstDate
        DateE: lastDate, //lastDate
        EmpID: this.ReviewformServiceService.delDetail.EmpCode //this.ReviewformServiceService.delDetail.EmpCode
      }
      this.LoadingPage.show()
      this.GetApiDataServiceService.getWebApiData_AbscIntegrationHandlerGetAbsFlowApps(AbscIntegrationHandlerGetAbsFlowApps)
        .pipe(takeWhile(() => this.api_subscribe))
        .subscribe(
          (x: any) => {
            if (x.length == 0) {
              this.LoadingPage.hide()
              // this.loading = false
              // this.showdataIsEmpty = true 
            } else {
              // console.log(x)

              var getSearchDate = new Date(x[0].DateB)
              this.SearchCalendarSimulationDate = new Date(formatDateTime(getSearchDate).getDate)
              // console.log(this.ReviewformServiceService.delDetail.dateArray)
              for (let i = 0; i < x.length; i++) {
                this.uishowDelDetail.push({
                  titletext: '銷假時段' + chinesenum((i + 1)),
                  startdate: formatDateTime(x[i].DateB).getDate,
                  starttime: getapi_formatTimetoString(x[i].TimeB),
                  enddate: formatDateTime(x[i].DateE).getDate,
                  endtime: getapi_formatTimetoString(x[i].TimeE),
                  everyday: x[i].Circulate,
                  holiday: { id: x[i].HoliDayID, name: x[i].HoliDayNameC },
                  calday: 0,
                  calhour: 0,
                  calminute: 0,
                  eventDate: formatDateTime(x[i].EventDate).getDate,
                  keyName: x[i].KeyName,

                  detail_delform: []
                })
                for (let detail of x[i].AbsFlowAppsDetail) {
                  var real = false
                  for (let onedateArray of this.ReviewformServiceService.delDetail.dateArray) {

                    if (detail.DateTimeB == onedateArray.DateB && detail.DateTimeE == onedateArray.DateE) {
                      real = true
                    }
                  }

                  var setDay = 0
                  var setHour = 0
                  var setMin = 0
                  //計算日時分
                  setDay = detail.UseDayHourMinute.Day
                  setHour = detail.UseDayHourMinute.Hour
                  setMin = detail.UseDayHourMinute.Minute
                  // if (real) {
                  //   detail.State = '0'
                  // }
                  this.uishowDelDetail[i].detail_delform.push({
                    disable: 1,
                    state: detail.State,
                    checkState: false,
                    reallyDelShowState: real,
                    startdate: formatDateTime(detail.DateTimeB).getDate,
                    starttime: getapi_formatTimetoString(formatDateTime(detail.DateTimeB).getTime),
                    endtime: getapi_formatTimetoString(formatDateTime(detail.DateTimeE).getTime),
                    calday: setDay.toString(),
                    calhour: setHour.toString(),
                    calminute: setMin.toString()
                  })

                  if (real) {
                    this.uishowDelDetail[i].calday = this.uishowDelDetail[i].calday + setDay
                    this.uishowDelDetail[i].calhour = this.uishowDelDetail[i].calhour + setHour
                    this.uishowDelDetail[i].calminute = this.uishowDelDetail[i].calminute + setMin
                  }
                  // console.log(this.uishowDelDetail[i].detail_delform)


                }

              }
              this.LoadingPage.hide()
            }
          },
          (error: any) => {
            // alert('api連線錯誤，AbscIntegrationHandlerGetAbsFlowApps')
            this.LoadingPage.hide()
          }
        )
      this.uishowProcessFlowID = void_completionTenNum(this.ReviewformServiceService.delDetail.ProcessFlowID)

    }





  }

  scrollTo(tag: string) {
    this.viewScroller.scrollToAnchor(tag);
    //tag=id連結位置
  }
  backReview() {
    this.ReviewformServiceService.changeReview('delTab', this.ReviewformServiceService.showReviewMan)
  }


  onCheckCollapseIn(i) {
    //確認是否收合請假明細
    if ($('#id' + i).hasClass('collapsed')) {
      $('#' + i + '_text').text('收合銷假明細')
      $('#' + i + '_img').css({ "transition": "transform 0.5s" });
      $('#' + i + '_img').css({ "transform": "rotate(-180deg)" });

    } else {
      $('#' + i + '_text').text('展開銷假明細')
      $('#' + i + '_img').css({ "transition": "transform 0.5s" });
      $('#' + i + '_img').css({ "transform": "rotate(0deg)" });
    }
  }



  FlowDynamic_Base: GetSelectBaseClass;
  chooseBase(GetSelectBase: GetSelectBaseClass) {
    this.FlowDynamic_Base = GetSelectBase
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
            ProcessFlowID: parseInt(this.ReviewformServiceService.delDetail.ProcessFlowID),
            ProcessApParmAuto: parseInt(this.ReviewformServiceService.delDetail.ProcessApParmAuto),
            State: "3",
            FlowTreeID: this.ReviewformServiceService.delDetail.FlowTreeID,
            FlowNodeID: this.ReviewformServiceService.delDetail.FlowNodeID,
            Note: this.signText,
            NodeName: "核准",
            ManInfo: y[0],
            FlowDynamic: {
              FlowNode: this.ReviewformServiceService.delDetail.FlowNodeID,
              RoleID: '',
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
                  this.sendFinish();
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
              }, error => {
                this.LoadingPage.hide()
              }
            )
        }, error => {
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
            ProcessFlowID: parseInt(this.ReviewformServiceService.delDetail.ProcessFlowID),
            ProcessApParmAuto: parseInt(this.ReviewformServiceService.delDetail.ProcessApParmAuto),
            State: "2",
            FlowTreeID: this.ReviewformServiceService.delDetail.FlowTreeID,
            FlowNodeID: this.ReviewformServiceService.delDetail.FlowNodeID,
            Note: this.signText,
            NodeName: "重擬",
            ManInfo: y[0],
            FlowDynamic: {
              FlowNode: this.ReviewformServiceService.delDetail.FlowNodeID,
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
                  this.sendFinish();
                } else {
                  // alert(x.MessageContent)
                  this.SnackBar.openFromComponent(ErrorSendbackSnackComponent, {
                    data: '資料出現異常資料出現異常資料出現異常資料出現異常資料出現異常資料出現異常',
                    panelClass: 'ErrorSnackClass',
                    duration: SnackSetting.duration,
                    verticalPosition: SnackSetting.verticalPosition,
                    horizontalPosition: SnackSetting.horizontalPosition
                  });
                }
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
            ProcessFlowID: parseInt(this.ReviewformServiceService.delDetail.ProcessFlowID),
            ProcessApParmAuto: parseInt(this.ReviewformServiceService.delDetail.ProcessApParmAuto),
            State: "1",
            FlowTreeID: this.ReviewformServiceService.delDetail.FlowTreeID,
            FlowNodeID: this.ReviewformServiceService.delDetail.FlowNodeID,
            Note: this.signText,
            NodeName: "呈核",
            ManInfo: y[0],
            FlowDynamic: {
              FlowNode: this.ReviewformServiceService.delDetail.FlowNodeID,
              RoleID: '',
              EmpID: this.FlowDynamic_Base.EmpID.toString(),
              DeptID: this.FlowDynamic_Base.DeptaID.toString(),
              PosID: this.FlowDynamic_Base.JobID.toString(),
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
                  this.sendFinish();
                } else {
                  alert(x.MessageContent)
                  this.SnackBar.openFromComponent(ErrorPutForwardSnackComponent, {
                    data: x.MessageContent,
                    panelClass: 'ErrorSnackClass',
                    duration: SnackSetting.duration,
                    verticalPosition: SnackSetting.verticalPosition,
                    horizontalPosition: SnackSetting.horizontalPosition
                  });
                }
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

  checkCanSendPutForward() {
    if (!this.FlowDynamic_Base) {
      alert('請選擇呈核人員')
    } else {
      $('#PutForwarddialog').modal('show');
    }
  }
  sendFinish() {
    this.backReview()
    this.router.navigate(['../nav/reviewform']);
  }

  debug() {
    console.log(this.uishowDelDetail)
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
      EmpID: this.ReviewformServiceService.delDetail.EmpCode.toString()
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
              drawCalendar.SearchMan.jobID = this.ReviewformServiceService.delDetail.EmpCode.toString()
              drawCalendar.SearchMan.name = this.ReviewformServiceService.delDetail.EmpNameC.toString()
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
              $("#CalendarSimulation").modal('show')
            }
          } else {
            alert('查無出勤資料')
            this.LoadingPage.hide()
          }
        }, error => {
          // alert('與api連線異常，getWebApiData_GetAttendCalendar')
          this.LoadingPage.hide()

        }
      )

  }

  StateColor(onedetail) {
    if (onedetail.reallyDelShowState) {
      return { color: '#4C4C4C' }
    } else {
      return { color: '#a9a9a9' }
    }
  }

  signRecordDialog: boolean = false
  show_signRecord() {
    if (!this.signRecordDialog) {
      this.signRecordDialog = true
    }
    $('#signRecord').modal('show')
  }
}


export class FormSign {
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
  ToDeptNameC: string
  ToEmpCode: string
  ToEmpID: string
  ToEmpNameC: string
  ToJobName: string
}

