import { Component, OnInit, ViewChild, AfterViewInit, ElementRef, OnDestroy } from '@angular/core';
import { GetApiUserService } from 'src/app/Service/get-api-user.service';
import { formatDateTime, doFormatDate_getMonthAndDay, getapi_formatTimetoString } from 'src/app/UseVoid/void_doFormatDate';
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
import { FormSign } from '../reviewform-detail-delform/reviewform-detail-delform.component';
import { NgxSpinnerService } from 'ngx-spinner';
import { sendEmpPersonnelClass } from 'src/app/Models/sendEmpPersonnelClass';
import { GetShiftRoteFlowAppsByProcessFlowIDDataClass } from 'src/app/Models/GetShiftRoteFlowAppsByProcessFlowIDDataClass';
import { GetSelectBaseClass } from 'src/app/Models/GetSelectBaseClass';
import { reallyData_P } from 'src/app/Models/reallyData_P';
import { FlowNodeFinishGetDataClass } from 'src/app/Models/FlowNodeFinishGetDataClass';
import { void_crossDay } from 'src/app/UseVoid/void_crossDay';
import { SussesApproveSnackComponent } from 'src/app/View/shareComponent/snackbar/susses-approve-snack/susses-approve-snack.component';
import { SnackSetting } from 'src/app/View/shareComponent/snackbar/SnackSetting';
import { ErrorApproveSnackComponent } from 'src/app/View/shareComponent/snackbar/error-approve-snack/error-approve-snack.component';
import { SussesSendbackSnackComponent } from 'src/app/View/shareComponent/snackbar/susses-sendback-snack/susses-sendback-snack.component';
import { ErrorSendbackSnackComponent } from 'src/app/View/shareComponent/snackbar/error-sendback-snack/error-sendback-snack.component';
import { SussesPutForwardSnackComponent } from 'src/app/View/shareComponent/snackbar/susses-put-forward-snack/susses-put-forward-snack.component';
import { ErrorPutForwardSnackComponent } from 'src/app/View/shareComponent/snackbar/error-put-forward-snack/error-put-forward-snack.component';
import { MatSnackBar } from '@angular/material';
declare let $: any; //use jquery;

@Component({
  selector: 'app-reviewform-detail-changeform-rr',
  templateUrl: './reviewform-detail-changeform-rr.component.html',
  styleUrls: ['./reviewform-detail-changeform-rr.component.css']
})
export class ReviewformDetailChangeformRRComponent implements OnInit, OnDestroy {
  ngOnDestroy(): void {
    // throw new Error("Method not implemented.");
    this.api_subscribe = false;
  }

  loading: boolean = false;

  api_subscribe = true; //ngOnDestroy時要取消訂閱api的subscribe

  RealRote: uiShow[] = []
  uiShow: uiShow[] = []
  selectDay: uiShow[] = []

  Emp = { EmpCode: '', EmpName: '' }
  ChangeEmp = { EmpCode: '', EmpName: '' }

  oneP: reallyData_P = new reallyData_P()
  twoP: reallyData_P = new reallyData_P()


  SimulationRoteData: GetShiftRoteFlowAppsByProcessFlowIDDataClass[] = []

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
      this.ChangeEmp = {
        EmpCode: this.ReviewformServiceService.changeDetail.EmpID2
        , EmpName: this.ReviewformServiceService.changeDetail.EmpNameC2
      }

      this.GetApiDataServiceService.getWebApiData_GetShiftRoteFlowAppsByProcessFlowID(this.ReviewformServiceService.changeDetail.ProcessFlowID)
        .pipe(takeWhile(() => this.api_subscribe))
        .subscribe(
          (GetShiftRoteFlowAppsByProcessFlowIDData: GetShiftRoteFlowAppsByProcessFlowIDDataClass[]) => {
            this.SimulationRoteData = []
            this.SimulationRoteData = GetShiftRoteFlowAppsByProcessFlowIDData
            var first = this.GetApiDataServiceService.getWebApiData_GetShiftRoteDateRange(this.ReviewformServiceService.changeDetail.dateArray[0], this.Emp.EmpCode)
              .pipe(
                mergeMap(
                  (x: any) => {
                    if (x.MessageCode) {
                      //判斷資料進行中是否有異常錯誤
                      alert(this.Emp.EmpCode + x.MessageContent)
                      first.unsubscribe()
                    } else {

                      var Attend: GetAttendClass = {
                        DateB: x.DateA,
                        DateE: x.DateD,
                        ListEmpID: [this.Emp.EmpCode],
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

                  this.oneP = {
                    code: this.Emp.EmpCode,
                    name: this.Emp.EmpName,
                    work: []
                  }
                  for (let data of x) {
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
                  var second = this.GetApiDataServiceService.getWebApiData_GetShiftRoteDateRange(this.ReviewformServiceService.changeDetail.dateArray[0], this.ChangeEmp.EmpCode)
                    .pipe(
                      mergeMap(
                        (x: any) => {
                          if (x.MessageCode) {
                            //判斷資料進行中是否有異常錯誤
                            alert(this.ChangeEmp.EmpCode + x.MessageContent)
                            second.unsubscribe()
                          } else {

                            var Attend: GetAttendClass = {
                              DateB: x.DateA,
                              DateE: x.DateD,
                              ListEmpID: [this.ChangeEmp.EmpCode],
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

                        this.twoP = {
                          code: this.ChangeEmp.EmpCode,
                          name: this.ChangeEmp.EmpName,
                          work: []
                        }
                        for (let data of x) {
                          var setAttendDate = doFormatDate_getMonthAndDay(formatDateTime(data.AttendDate).getDate)
                          this.twoP.work.push({
                            realDate: formatDateTime(data.AttendDate).getDate,
                            date: setAttendDate, job: data.ActualRote.RoteCode,
                            RoteID: data.ActualRote.RoteID,
                            RoteName: data.ActualRote.RoteNameC,
                            OnTime: data.ActualRote.OnTime,
                            OffTime: data.ActualRote.OffTime
                          })
                        }

                        this.loading = false
                        this.SetUiChangeDate()
                      }
                      ,
                      (error: any) => {
                        // alert('與api連線異常，第二個人員，getWebApiData_GetShiftRoteDateRange')
                      }

                    )
                },
                (error: any) => {
                  // alert('與api連線異常，第一個人員，getWebApiData_GetShiftRoteDateRange')
                }
              )

          }, error => {

          })


    }
  }

  SetUiChangeDate() {
    this.RealRote = [];
    for (let oP of this.oneP.work) {
      this.RealRote.push({
        realDate: oP.realDate,
        date: oP.date,
        oneP: oP.job,
        oneP_OnTime: oP.OnTime,
        oneP_OffTime: oP.OffTime,
        onePRoteID: oP.RoteID,
        onePRoteName: oP.RoteName,
        twoP: '',
        twoPRoteID: null,
        twoPRoteName: '',
        twoP_OnTime: '',
        twoP_OffTime: '',
        disable: false,
        Clickselect: false
      })
    }

    for (let Real of this.RealRote) {
      for (let date of this.ReviewformServiceService.changeDetail.dateArray) {
        var da = date.split('/')[1] + '/' + date.split('/')[2]
        if (Real.date == da) {
          Real.Clickselect = true
        }
      }
    }

    for (let tP of this.twoP.work) {
      for (let ui of this.RealRote) {
        if (ui.date == tP.date) {
          ui.twoP = tP.job
          ui.twoPRoteID = tP.RoteID
          ui.twoPRoteName = tP.RoteName
          ui.twoP_OnTime = tP.OnTime
          ui.twoP_OffTime = tP.OffTime
        }
      }
    }

    //因核准後 真正的班型已經調換，所以要靠先前模擬的班型還原當時送單前的班型
    for (let re of this.RealRote) {
      for (let ss of this.SimulationRoteData[0].ShiftRoteFlowAppsDetail) {
        if (re.realDate == formatDateTime(ss.ShiftRoteDate).getDate) {
          re.oneP = ss.RoteCode1
          re.onePRoteID = ss.RoteID1
          re.onePRoteName = ss.RoteName1
          re.oneP_OnTime = void_crossDay(ss.RoteID1Info.OnTime).EndTime
          re.oneP_OffTime = void_crossDay(ss.RoteID1Info.OffTime).EndTime
          re.twoP = ss.RoteCode2
          re.twoPRoteID = ss.RoteID2
          re.twoPRoteName = ss.RoteName2
          re.twoP_OnTime = void_crossDay(ss.RoteID2Info.OnTime).EndTime
          re.twoP_OffTime = void_crossDay(ss.RoteID2Info.OffTime).EndTime
        }
      }
    }
    this.uiShow = []
    for (let Real of this.RealRote) {
      this.uiShow.push({
        realDate: Real.realDate,
        date: Real.date,
        oneP: Real.oneP,
        onePRoteID: Real.onePRoteID,
        onePRoteName: Real.onePRoteName,
        oneP_OnTime: void_crossDay(Real.oneP_OnTime).EndTime,
        oneP_OffTime: void_crossDay(Real.oneP_OffTime).EndTime,
        twoP: Real.twoP,
        twoPRoteID: Real.twoPRoteID,
        twoPRoteName: Real.twoPRoteName,
        twoP_OnTime: void_crossDay(Real.twoP_OnTime).EndTime,
        twoP_OffTime: void_crossDay(Real.twoP_OffTime).EndTime,
        disable: Real.disable,
        Clickselect: Real.Clickselect
      })
    }
  }

  FlowDynamic_Base: GetSelectBaseClass;
  chooseBase(GetSelectBase: GetSelectBaseClass) {
    this.FlowDynamic_Base = GetSelectBase
  }


  SimulationRoteClickOne = false
  OriginalRote() {
    //原始調班前
    this.SimulationRoteClickOne = false
    this.uiShow = []
    for (let Real of this.RealRote) {
      this.uiShow.push({
        realDate: Real.realDate,
        date: Real.date,
        oneP: Real.oneP,
        onePRoteID: Real.onePRoteID,
        oneP_OnTime: void_crossDay(Real.oneP_OnTime).EndTime,
        oneP_OffTime: void_crossDay(Real.oneP_OffTime).EndTime,
        onePRoteName: Real.onePRoteName,
        twoP: Real.twoP,
        twoPRoteID: Real.twoPRoteID,
        twoPRoteName: Real.twoPRoteName,
        twoP_OnTime: void_crossDay(Real.twoP_OnTime).EndTime,
        twoP_OffTime: void_crossDay(Real.twoP_OffTime).EndTime,
        disable: Real.disable,
        Clickselect: Real.Clickselect
      })
    }
    $('#bt_RoteShow').addClass('onShowButton')
    $('#bt_RoteShow').removeClass('offShowButton')
    $('#bt_TimeShow').addClass('offShowButton')
    $('#bt_TimeShow').removeClass('onShowButton')


  }
  SimulationRote() {
    //模擬調班後
    // console.log(this.SimulationRoteData[0].ShiftRoteFlowAppsDetail)
    if (!this.SimulationRoteClickOne) {
      for (let s_ui of this.uiShow) {
        for (let oneShiftRoteFlowAppsDetail of this.SimulationRoteData[0].ShiftRoteFlowAppsDetail) {
          if (s_ui.Clickselect && s_ui.realDate == formatDateTime(oneShiftRoteFlowAppsDetail.ShiftRoteDate).getDate) {
            s_ui.oneP = oneShiftRoteFlowAppsDetail.RoteCode1c
            s_ui.twoP = oneShiftRoteFlowAppsDetail.RoteCode2c

            s_ui.onePRoteID = oneShiftRoteFlowAppsDetail.RoteID1c
            s_ui.twoPRoteID = oneShiftRoteFlowAppsDetail.RoteID2c

            s_ui.onePRoteName = oneShiftRoteFlowAppsDetail.RoteName1c
            s_ui.twoPRoteName = oneShiftRoteFlowAppsDetail.RoteName2c

            s_ui.oneP_OnTime = void_crossDay(oneShiftRoteFlowAppsDetail.RoteID1cInfo.OnTime).EndTime
            s_ui.oneP_OffTime = void_crossDay(oneShiftRoteFlowAppsDetail.RoteID1cInfo.OffTime).EndTime

            s_ui.twoP_OnTime = void_crossDay(oneShiftRoteFlowAppsDetail.RoteID2cInfo.OnTime).EndTime
            s_ui.twoP_OffTime = void_crossDay(oneShiftRoteFlowAppsDetail.RoteID2cInfo.OffTime).EndTime

            s_ui.Clickselect = false
          }
        }
      }
      this.SimulationRoteClickOne = true
    }
    $('#bt_RoteShow').addClass('offShowButton')
    $('#bt_RoteShow').removeClass('onShowButton')
    $('#bt_TimeShow').addClass('onShowButton')
    $('#bt_TimeShow').removeClass('offShowButton')
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
              },
              error => {
                this.LoadingPage.hide()
              }
            )
        },
        error => {
          this.LoadingPage.hide()
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
                  this.sendFinish();
                } else {
                  alert(x.MessageContent)
                  this.SnackBar.openFromComponent(ErrorSendbackSnackComponent, {
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
  sendFinish() {
    this.backReview()
    this.router.navigate(['../nav/reviewform']);
  }


  FormatDate(date) {
    return doFormatDate_getMonthAndDay(formatDateTime(date).getDate)
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

export class uiShow {
  realDate: string
  date: string;
  oneP: string;
  onePRoteID: number;
  onePRoteName: string;
  oneP_OnTime: string;
  oneP_OffTime: string;
  twoP: string;
  twoPRoteID: number;
  twoPRoteName: string
  twoP_OnTime: string;
  twoP_OffTime: string;
  disable: boolean;
  Clickselect: boolean;
}