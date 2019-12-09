import { Component, OnInit, OnDestroy } from '@angular/core';
import { fromEvent, BehaviorSubject, Observable } from 'rxjs';
import { debounceTime, takeWhile } from 'rxjs/operators';
import { ViewportScroller } from '@angular/common';
import { ReviewformServiceService } from 'src/app/Service/reviewform-service.service';
import { Router } from '@angular/router';
import { GetApiDataServiceService } from 'src/app/Service/get-api-data-service.service';
import { FlowNodeFinishClass } from 'src/app/Models/PostData_API_Class/FlowNodeFinishClass';
import { formatDateTime, getapi_formatTimetoString } from 'src/app/UseVoid/void_doFormatDate';
import { void_completionTenNum } from 'src/app/UseVoid/void_CompletionTenNum';
import { NgxSpinnerService } from 'ngx-spinner';
import { showUploadFileClass } from 'src/app/Models/showUploadFileClass';
import { FileDownloadService } from 'src/app/Service/file-download.service';
import { sendEmpPersonnelClass } from 'src/app/Models/sendEmpPersonnelClass';
import { GetApiUserService } from 'src/app/Service/get-api-user.service';
import { GetSelectBaseClass } from 'src/app/Models/GetSelectBaseClass';
import { GetCardFlowAppsByProcessFlowIDDataClass } from 'src/app/Models/CardFlowAppsByProcessFlowID';
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
  selector: 'app-reviewform-detail-card-patchform',
  templateUrl: './reviewform-detail-card-patchform.component.html',
  styleUrls: ['./reviewform-detail-card-patchform.component.css']
})
export class ReviewformDetailCardPatchformComponent implements OnInit, OnDestroy {
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
  signText: string;
  sussestext: string = '';
  onesendvaform(_sussestext) { this.sussestext = _sussestext; }
  inbodybuttomdiv = 'inherit';
  buttomdiv = 'inherit';

  inbodybuttomdiv_phone = 'inherit';
  buttomdiv_phone = 'inherit';

  isdesktop: boolean = true;

  ForgetData: GetCardFlowAppsByProcessFlowIDDataClass = new GetCardFlowAppsByProcessFlowIDDataClass()

  constructor(private viewScroller: ViewportScroller,
    public ReviewformServiceService: ReviewformServiceService,
    private router: Router,
    private GetApiDataServiceService: GetApiDataServiceService,
    private LoadingPage: NgxSpinnerService,
    private FileDownloadService: FileDownloadService,
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

  private Sub_onChangeSignMan$: BehaviorSubject<any> = new BehaviorSubject(0)
  onChangeSingMan$: Observable<any> = this.Sub_onChangeSignMan$; //切換選擇簽核人員使用
  GetCardFlowAppsByProcessFlowIDData: GetCardFlowAppsByProcessFlowIDDataClass = new GetCardFlowAppsByProcessFlowIDDataClass()

  RoteDateB: string = ''
  RoteTimeB: string = ''
  RoteDateE: string = ''
  RoteTimeE: string = ''
  CardDateB: string = ''
  CardTimeB: string = ''
  CardDateE: string = ''
  CardTimeE: string = ''

  FirstEmpCode: string = ''
  ngOnInit() {
    this.Sub_onChangeSignMan$.next(this.ReviewformServiceService.showReviewMan.EmpCode)
    this.GetApiUserService.counter$.subscribe(
      x => {
        this.FirstEmpCode = x.EmpCode
      }
    )
    // console.log(this.ReviewformServiceService.CardPatchFlowSignDetail)
    if (!this.ReviewformServiceService.CardPatchFlowSignDetail) {
      this.router.navigate(['../nav/reviewform']);
    } else {

    }

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

    this.LoadingPage.show()

    this.GetApiDataServiceService.getWebApiData_GetCardPatchFlowAppsByProcessFlowID(this.ReviewformServiceService.CardPatchFlowSignDetail.ProcessFlowID, true)
    .pipe(takeWhile(() => this.api_subscribe))  
    .subscribe(
        (data: GetCardFlowAppsByProcessFlowIDDataClass[]) => {
          this.GetCardFlowAppsByProcessFlowIDData = data[0]
          this.GetCardFlowAppsByProcessFlowIDData.Date = formatDateTime(data[0].Date).getDate
          this.GetCardFlowAppsByProcessFlowIDData.DateB = formatDateTime(data[0].DateB).getDate
          this.GetCardFlowAppsByProcessFlowIDData.DateE = formatDateTime(data[0].DateE).getDate
          this.GetCardFlowAppsByProcessFlowIDData.TimeB = getapi_formatTimetoString(data[0].TimeB)
          this.GetCardFlowAppsByProcessFlowIDData.TimeE = getapi_formatTimetoString(data[0].TimeE)

          this.RoteDateB = formatDateTime(data[0].RoteDateTimeB).getDate
          this.RoteTimeB = getapi_formatTimetoString(formatDateTime(data[0].RoteDateTimeB).getTime)
          this.RoteDateE = formatDateTime(data[0].RoteDateTimeE).getDate
          this.RoteTimeE = getapi_formatTimetoString(formatDateTime(data[0].RoteDateTimeE).getTime)

          this.CardDateB = formatDateTime(data[0].CardDateTimeB).getDate
          this.CardTimeB = getapi_formatTimetoString(formatDateTime(data[0].CardDateTimeB).getTime)
          this.CardDateE = formatDateTime(data[0].CardDateTimeE).getDate
          this.CardTimeE = getapi_formatTimetoString(formatDateTime(data[0].CardDateTimeE).getTime)
          this.LoadingPage.hide()
        }, err => {

          this.LoadingPage.hide()
        }

      )

  }

  scrollTo(tag: string) {
    this.viewScroller.scrollToAnchor(tag);
    //tag=id連結位置
  }
  backReview() {
    this.ReviewformServiceService.changeReview('CardPatchTab', this.ReviewformServiceService.showReviewMan)
  }


  FlowDynamic_Base: GetSelectBaseClass;
  chooseBase(GetSelectBase: GetSelectBaseClass) {
    this.FlowDynamic_Base = GetSelectBase
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

  
  forgetShowCheckText = ''
  checkforgetCardText_Approved() {
    $('#forgetApproveddialog').modal('show')
    this.LoadingPage.show()
    // this.GetApiDataServiceService.getWebApiData_CardCheckByProcessFlowID(this.ReviewformServiceService.CardPatchFlowSignDetail.ProcessFlowID)
    //   .pipe(takeWhile(() => this.api_subscribe))
    //   .subscribe(
    //     (x: string) => {
    //       this.forgetShowCheckText = x.toString()
    //       this.LoadingPage.hide()
    //       $('#forgetApproveddialog').modal('show')
    //     }
    //   )
  }
  checkforgetCardText_PutForward() {
    if (!this.FlowDynamic_Base) {
      alert('請選擇呈核人員')
    } else {
      $('#forgetPutForwarddialog').modal('show');
    }
    // this.LoadingPage.show()
    // this.GetApiDataServiceService.getWebApiData_CardCheckByProcessFlowID(this.ReviewformServiceService.CardPatchFlowSignDetail.ProcessFlowID)
    //   .pipe(takeWhile(() => this.api_subscribe))
    //   .subscribe(
    //     (x: string) => {
    //       this.forgetShowCheckText = x.toString()
    //       this.LoadingPage.hide()
    //       if (!this.FlowDynamic_Base) {
    //         alert('請選擇呈核人員')
    //       } else {
    //         $('#forgetPutForwarddialog').modal('show');
    //       }
    //     }
    //   )
  }

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
            ProcessFlowID: parseInt(this.ReviewformServiceService.CardPatchFlowSignDetail.ProcessFlowID),
            ProcessApParmAuto: parseInt(this.ReviewformServiceService.CardPatchFlowSignDetail.ProcessApParmAuto),
            State: "3",
            FlowTreeID: this.ReviewformServiceService.CardPatchFlowSignDetail.FlowTreeID,
            FlowNodeID: this.ReviewformServiceService.CardPatchFlowSignDetail.FlowNodeID,
            Note: this.signText,
            NodeName: "核准",
            ManInfo: y[0],
            FlowDynamic: {
              FlowNode: this.ReviewformServiceService.CardPatchFlowSignDetail.FlowNodeID,
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
            ProcessFlowID: parseInt(this.ReviewformServiceService.CardPatchFlowSignDetail.ProcessFlowID),
            ProcessApParmAuto: parseInt(this.ReviewformServiceService.CardPatchFlowSignDetail.ProcessApParmAuto),
            State: "2",
            FlowTreeID: this.ReviewformServiceService.CardPatchFlowSignDetail.FlowTreeID,
            FlowNodeID: this.ReviewformServiceService.CardPatchFlowSignDetail.FlowNodeID,
            Note: this.signText,
            NodeName: "重擬",
            ManInfo: y[0],
            FlowDynamic: {
              FlowNode: this.ReviewformServiceService.CardPatchFlowSignDetail.FlowNodeID,
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
            ProcessFlowID: parseInt(this.ReviewformServiceService.CardPatchFlowSignDetail.ProcessFlowID),
            ProcessApParmAuto: parseInt(this.ReviewformServiceService.CardPatchFlowSignDetail.ProcessApParmAuto),
            State: "1",
            FlowTreeID: this.ReviewformServiceService.CardPatchFlowSignDetail.FlowTreeID,
            FlowNodeID: this.ReviewformServiceService.CardPatchFlowSignDetail.FlowNodeID,
            Note: this.signText,
            NodeName: "呈核",
            ManInfo: y[0],
            FlowDynamic: {
              FlowNode: this.ReviewformServiceService.CardPatchFlowSignDetail.FlowNodeID,
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
                  // alert(x.MessageContent)
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
          // alert('與api連線異常，getWebApiData_GetManInfo')
          this.LoadingPage.hide()
        }
      )
  }

  sendFinish() {
    this.backReview()
    this.router.navigate(['../nav/reviewform']);
  }

  completionTenNum(e) {
    return void_completionTenNum(e)
  }

  color_CardOnTime() {

    if (this.ReviewformServiceService.CardPatchFlowSignDetail.isLateMins || this.ReviewformServiceService.CardPatchFlowSignDetail.isForgetCard) {
      return '#d0021b'
    } else {
      return '#4c4c4c'
    }
  }
  color_CardOffTime() {

    if (this.ReviewformServiceService.CardPatchFlowSignDetail.isEarlyMins || this.ReviewformServiceService.CardPatchFlowSignDetail.isForgetCard) {
      return '#d0021b'
    } else {
      return '#4c4c4c'
    }
  }
  color_ActualOnTime() {
    if (this.GetCardFlowAppsByProcessFlowIDData.DateB) {
      return '#028fcf'
    } else {
      return '#4c4c4c'
    }
  }

  color_ActualOffTime() {
    if (this.GetCardFlowAppsByProcessFlowIDData.DateE) {
      return '#028fcf'
    } else {
      return '#4c4c4c'
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



