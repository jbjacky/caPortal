import { Component, OnInit, ViewChild, AfterViewInit, ElementRef, OnDestroy } from '@angular/core';
import { GetApiUserService } from 'src/app/Service/get-api-user.service';
import { doFormatDate, formatDateTime, doFormatDate_getMonthAndDay, getapi_formatTimetoString } from 'src/app/UseVoid/void_doFormatDate';
import { weekDate } from 'src/app/UseVoid/void_weekDate';
import { GetApiDataServiceService } from 'src/app/Service/get-api-data-service.service';
import { mergeMap, takeWhile, debounceTime } from 'rxjs/operators';
import { GetAttendClass } from 'src/app/Models/PostData_API_Class/GetAttendClass';
import { ViewportScroller } from '@angular/common';
import { ShiftRoteSaveAndFlowStartClass } from 'src/app/Models/PostData_API_Class/ShiftRoteSaveAndFlowStartClass';
import { ReviewformServiceService } from 'src/app/Service/reviewform-service.service';
import { Router } from '@angular/router';
import { fromEvent, BehaviorSubject, Observable } from 'rxjs';
import { void_completionTenNum } from 'src/app/UseVoid/void_CompletionTenNum';
import { FlowNodeFinishClass } from 'src/app/Models/PostData_API_Class/FlowNodeFinishClass';
import { chinesenum } from 'src/app/UseVoid/void_chinesenumber';
import { selectuiShow, oneP_Class } from '../../change-rz/change-rz.component';
import { FormSign } from '../reviewform-detail-delform/reviewform-detail-delform.component';
import { NgxSpinnerService } from 'ngx-spinner';
import { sendEmpPersonnelClass } from 'src/app/Models/sendEmpPersonnelClass';
import { GetSelectBaseClass } from 'src/app/Models/GetSelectBaseClass';
import { GetShiftRoteFlowAppsByProcessFlowIDDataClass } from 'src/app/Models/GetShiftRoteFlowAppsByProcessFlowIDDataClass';
import { FlowNodeFinishGetDataClass } from 'src/app/Models/FlowNodeFinishGetDataClass';
import { SussesApproveSnackComponent } from 'src/app/View/shareComponent/snackbar/susses-approve-snack/susses-approve-snack.component';
import { ErrorApproveSnackComponent } from 'src/app/View/shareComponent/snackbar/error-approve-snack/error-approve-snack.component';
import { SnackSetting } from 'src/app/View/shareComponent/snackbar/SnackSetting';
import { SussesSendbackSnackComponent } from 'src/app/View/shareComponent/snackbar/susses-sendback-snack/susses-sendback-snack.component';
import { ErrorSendbackSnackComponent } from 'src/app/View/shareComponent/snackbar/error-sendback-snack/error-sendback-snack.component';
import { SussesPutForwardSnackComponent } from 'src/app/View/shareComponent/snackbar/susses-put-forward-snack/susses-put-forward-snack.component';
import { ErrorPutForwardSnackComponent } from 'src/app/View/shareComponent/snackbar/error-put-forward-snack/error-put-forward-snack.component';
import { MatSnackBar } from '@angular/material';
declare let $: any; //use jquery;

@Component({
  selector: 'app-reviewform-detail-changeform-rz',
  templateUrl: './reviewform-detail-changeform-rz.component.html',
  styleUrls: ['./reviewform-detail-changeform-rz.component.css']
})
export class ReviewformDetailChangeformRZComponent implements OnInit, OnDestroy {
  ngOnDestroy(): void {
    // throw new Error("Method not implemented.");
    this.api_subscribe = false;
  }

  loading: boolean = false;

  api_subscribe = true; //ngOnDestroy時要取消訂閱api的subscribe


  Emp = { EmpCode: '', EmpName: '' }

  oneP: oneP_Class = new oneP_Class()

  selectDay: selectuiShow
  selectChangeDay: selectuiShow

  inbodybuttomdiv = 'inherit';
  buttomdiv = 'inherit';

  inbodybuttomdiv_phone = 'inherit';
  buttomdiv_phone = 'inherit';
  isdesktop: boolean = true;

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
  constructor(private GetApiUserService: GetApiUserService,
    private GetApiDataServiceService: GetApiDataServiceService,
    private viewScroller: ViewportScroller,
    private router: Router,
    public ReviewformServiceService: ReviewformServiceService,
    private LoadingPage: NgxSpinnerService,
    private SnackBar: MatSnackBar) { }

  uishowProcessFlowID

  private Sub_onChangeSignMan$: BehaviorSubject<any> = new BehaviorSubject(0)
  onChangeSingMan$: Observable<any> = this.Sub_onChangeSignMan$; //切換選擇簽核人員使用

  FirstEmpCode: string = ''
  ngOnInit() {
    this.Sub_onChangeSignMan$.next(this.ReviewformServiceService.showReviewMan.EmpCode)
    this.GetApiUserService.counter$.subscribe(
      x => {
        this.FirstEmpCode = x.EmpCode
      }
    )
    if (!this.ReviewformServiceService.changeDetail) {
      this.router.navigate(['../nav/reviewform']);
    } else {
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

      this.uishowProcessFlowID = void_completionTenNum(this.ReviewformServiceService.changeDetail.ProcessFlowID)
      // console.log(this.ReviewformServiceService.changeDetail.dateArray)
      this.Emp = {
        EmpCode: this.ReviewformServiceService.changeDetail.EmpID1
        , EmpName: this.ReviewformServiceService.changeDetail.EmpNameC1
      }
      this.GetApiDataServiceService.getWebApiData_GetShiftRoteFlowAppsByProcessFlowID(this.ReviewformServiceService.changeDetail.ProcessFlowID)
        .pipe(takeWhile(() => this.api_subscribe))
        .subscribe(
          (GetShiftRoteFlowAppsByProcessFlowIDData: GetShiftRoteFlowAppsByProcessFlowIDDataClass[]) => {

            var first = this.GetApiDataServiceService.getWebApiData_GetShiftRoteDateRange(this.ReviewformServiceService.changeDetail.dateArray[0], this.ReviewformServiceService.changeDetail.EmpID1)
              .pipe(
                mergeMap(
                  (x: any) => {
                    if (x.MessageCode) {
                      //判斷資料進行中是否有異常錯誤
                      alert(this.ReviewformServiceService.changeDetail.EmpID1 + x.MessageContent)
                      first.unsubscribe()
                    } else {

                      var Attend: GetAttendClass = {
                        DateB: x.DateA,
                        DateE: x.DateD,
                        ListEmpID: [this.ReviewformServiceService.changeDetail.EmpID1],
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
                    EmpCode: this.ReviewformServiceService.changeDetail.EmpID1,
                    EmpName: this.ReviewformServiceService.changeDetail.EmpNameC1,
                    work: []
                  }
                  for (let data of x) {
                    var setAttendDate = doFormatDate_getMonthAndDay(formatDateTime(data.AttendDate).getDate)
                    var isSelect: boolean = false
                    var dataAttenDate = doFormatDate(data.AttendDate)
                    var calDate = new Date(formatDateTime(data.AttendDate).getDate + ' ' + getapi_formatTimetoString(formatDateTime(data.AttendDate).getTime))
                    var calDate_dayofweek = calDate.getDay()
                    if (calDate_dayofweek == 0) {
                      calDate_dayofweek = 7
                    }
                    if (dataAttenDate == this.ReviewformServiceService.changeDetail.dateArray[0] || dataAttenDate == this.ReviewformServiceService.changeDetail.dateArray[1]) {
                      isSelect = true
                      // var showDayofWeek = ''
                      // if (calDate_dayofweek == 7) {
                      //   showDayofWeek = '日'
                      // } else {
                      //   showDayofWeek = chinesenum(calDate_dayofweek)
                      // }

                      // if (!this.selectDay) {

                      //   this.selectDay = {
                      //     date: setAttendDate,
                      //     job: data.ActualRote.RoteCode,
                      //     RoteName: data.ActualRote.RoteNameC,
                      //     RoteID: data.ActualRote.RoteID,
                      //     realdate: formatDateTime(data.AttendDate).getDate,
                      //     isSelect: isSelect,
                      //     dayofweek: showDayofWeek
                      //   }
                      // } else {
                      //   this.selectChangeDay = {
                      //     date: setAttendDate,
                      //     job: data.ActualRote.RoteCode,
                      //     RoteName: data.ActualRote.RoteNameC,
                      //     RoteID: data.ActualRote.RoteID,
                      //     realdate: formatDateTime(data.AttendDate).getDate,
                      //     isSelect: isSelect,
                      //     dayofweek: showDayofWeek
                      //   }
                      // }

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
                  for (let onePwork of this.oneP.work) {
                    for (let data of GetShiftRoteFlowAppsByProcessFlowIDData[0].ShiftRoteFlowAppsDetail) {
                      if (onePwork.realdate == formatDateTime(data.ShiftRoteDate).getDate) {
                        onePwork.RoteID = data.RoteID1.toString()
                        onePwork.RoteName = data.RoteName1.toString()
                        onePwork.job = data.RoteCode1.toString()
                      }
                    }
                  }

                  var sel_ShiftRoteFlowAppsDetail = GetShiftRoteFlowAppsByProcessFlowIDData[0].ShiftRoteFlowAppsDetail[0]
                  var calDate_selectDay = new Date(formatDateTime(sel_ShiftRoteFlowAppsDetail.ShiftRoteDate).getDate + ' ' + getapi_formatTimetoString(formatDateTime(sel_ShiftRoteFlowAppsDetail.ShiftRoteDate).getTime))
                  var calDate_dayofweek_selectDay = calDate_selectDay.getDay()
                  if (calDate_dayofweek_selectDay == 0) {
                    calDate_dayofweek_selectDay = 7
                  }
                  var showDayofWeek_selectDay = ''
                  if (calDate_dayofweek_selectDay == 7) {
                    showDayofWeek_selectDay = '日'
                  } else {
                    showDayofWeek_selectDay = chinesenum(calDate_dayofweek_selectDay)
                  }

                  this.selectDay = {
                    date: doFormatDate_getMonthAndDay(formatDateTime(sel_ShiftRoteFlowAppsDetail.ShiftRoteDate).getDate),
                    job: sel_ShiftRoteFlowAppsDetail.RoteCode1.toString(),
                    RoteName: sel_ShiftRoteFlowAppsDetail.RoteName1,
                    RoteID: sel_ShiftRoteFlowAppsDetail.RoteID1.toString(),
                    realdate: formatDateTime(sel_ShiftRoteFlowAppsDetail.ShiftRoteDate).getDate,
                    isSelect: isSelect,
                    dayofweek: showDayofWeek_selectDay
                  }


                  var selectChangeDay_ShiftRoteFlowAppsDetail = GetShiftRoteFlowAppsByProcessFlowIDData[0].ShiftRoteFlowAppsDetail[1]
                  var calDate_selectChangeDay = new Date(formatDateTime(selectChangeDay_ShiftRoteFlowAppsDetail.ShiftRoteDate).getDate + ' ' + getapi_formatTimetoString(formatDateTime(sel_ShiftRoteFlowAppsDetail.ShiftRoteDate).getTime))
                  var calDate_dayofweek_selectChangeDay = calDate_selectChangeDay.getDay()
                  if (calDate_dayofweek_selectChangeDay == 0) {
                    calDate_dayofweek_selectChangeDay = 7
                  }
                  var showDayofWeek_selectChangeDay = ''
                  if (calDate_dayofweek_selectChangeDay == 7) {
                    showDayofWeek_selectChangeDay = '日'
                  } else {
                    showDayofWeek_selectChangeDay = chinesenum(calDate_dayofweek_selectChangeDay)
                  }

                  this.selectChangeDay = {
                    date: doFormatDate_getMonthAndDay(formatDateTime(selectChangeDay_ShiftRoteFlowAppsDetail.ShiftRoteDate).getDate),
                    job: selectChangeDay_ShiftRoteFlowAppsDetail.RoteCode1.toString(),
                    RoteName: selectChangeDay_ShiftRoteFlowAppsDetail.RoteName1,
                    RoteID: selectChangeDay_ShiftRoteFlowAppsDetail.RoteID1.toString(),
                    realdate: formatDateTime(selectChangeDay_ShiftRoteFlowAppsDetail.ShiftRoteDate).getDate,
                    isSelect: isSelect,
                    dayofweek: showDayofWeek_selectChangeDay
                  }
                  // this.SetUiChangeDate()
                  // console.log(this.oneP)
                },
                (error: any) => {
                  // alert('與api連線異常，第一個人員，getWebApiData_GetShiftRoteDateRange')
                }
              )
          }
          , error => {

          })

    }
  }


  setDivStyle(selectData: selectuiShow) {
    if (selectData.isSelect) {
      return 'selectDiv'
    } else {
      return 'DivStyle'
    }
  }


  backReview() {
    this.ReviewformServiceService.changeReview('changeTab', this.ReviewformServiceService.showReviewMan)
  }
  checkCanSendPutForward() {
    if (!this.FlowDynamic_Base) {
      alert('請選擇呈核人員')
    } else {
      $('#PutForwarddialog').modal('show');
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
            ProcessFlowID: parseInt(this.ReviewformServiceService.changeDetail.ProcessFlowID),
            ProcessApParmAuto: parseInt(this.ReviewformServiceService.changeDetail.ProcessApParmAuto),
            State: "3",
            FlowTreeID: this.ReviewformServiceService.changeDetail.FlowTreeID,
            FlowNodeID: this.ReviewformServiceService.changeDetail.FlowNodeID,
            Note: this.signText,
            NodeName: "核准",
            ManInfo: y[0],
            FlowDynamic: {
              FlowNode: this.ReviewformServiceService.changeDetail.FlowNodeID,
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
              }, error => {
                this.LoadingPage.hide()
              }
            )
        }, error => {
          this.LoadingPage.hide()
          // alert('api連線異常，getWebApiData_GetManInfo')
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
            ProcessFlowID: parseInt(this.ReviewformServiceService.changeDetail.ProcessFlowID),
            ProcessApParmAuto: parseInt(this.ReviewformServiceService.changeDetail.ProcessApParmAuto),
            State: "2",
            FlowTreeID: this.ReviewformServiceService.changeDetail.FlowTreeID,
            FlowNodeID: this.ReviewformServiceService.changeDetail.FlowNodeID,
            Note: this.signText,
            NodeName: "重擬",
            ManInfo: y[0],
            FlowDynamic: {
              FlowNode: this.ReviewformServiceService.changeDetail.FlowNodeID,
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
              }, error => {
                this.LoadingPage.hide()
              }
            )
        }, error => {
          this.LoadingPage.hide()
          // alert('api連線異常，getWebApiData_GetManInfo')
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
            ProcessFlowID: parseInt(this.ReviewformServiceService.changeDetail.ProcessFlowID),
            ProcessApParmAuto: parseInt(this.ReviewformServiceService.changeDetail.ProcessApParmAuto),
            State: "1",
            FlowTreeID: this.ReviewformServiceService.changeDetail.FlowTreeID,
            FlowNodeID: this.ReviewformServiceService.changeDetail.FlowNodeID,
            Note: this.signText,
            NodeName: "呈核",
            ManInfo: y[0],
            FlowDynamic: {
              FlowNode: this.ReviewformServiceService.changeDetail.FlowNodeID,
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
                  this.router.navigateByUrl('/nav/reviewform')
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
  sendFinish() {
    this.backReview()
    this.router.navigate(['../nav/reviewform']);
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

