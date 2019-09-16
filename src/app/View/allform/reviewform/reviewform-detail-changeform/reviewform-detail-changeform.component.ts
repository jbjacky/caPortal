import { Component, OnInit, OnDestroy } from '@angular/core';
import { fromEvent, BehaviorSubject, Observable } from 'rxjs';
import { debounceTime, takeUntil, takeWhile } from 'rxjs/operators';
import { ViewportScroller } from '@angular/common';
import { ReviewformServiceService } from 'src/app/Service/reviewform-service.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { void_completionTenNum } from 'src/app/UseVoid/void_CompletionTenNum';
import { GetApiDataServiceService } from 'src/app/Service/get-api-data-service.service';
import { Router } from '@angular/router';
import { ShiftRoteFlowAppsDetailClass } from 'src/app/Models/ShiftRoteFlowAppsDetailClass';
import { formatDateTime, getapi_formatTimetoString } from 'src/app/UseVoid/void_doFormatDate';
import { FlowNodeFinishClass } from 'src/app/Models/PostData_API_Class/FlowNodeFinishClass';
import { FormSign } from '../reviewform-detail-delform/reviewform-detail-delform.component';
import { sendEmpPersonnelClass } from 'src/app/Models/sendEmpPersonnelClass';
import { GetApiUserService } from 'src/app/Service/get-api-user.service';
import { GetSelectBaseClass } from 'src/app/Models/GetSelectBaseClass';
import { FlowNodeFinishGetDataClass } from 'src/app/Models/FlowNodeFinishGetDataClass';

declare let $: any; //use jquery;

@Component({
  selector: 'app-reviewform-detail-changeform',
  templateUrl: './reviewform-detail-changeform.component.html',
  styleUrls: ['./reviewform-detail-changeform.component.css']
})
export class ReviewformDetailChangeformComponent implements OnInit, OnDestroy {
  ngOnDestroy(): void {
    // throw new Error("Method not implemented.");
    this.api_subscribe = false;
  }
  api_subscribe = true; //ngOnDestroy時要取消訂閱api的subscribe
  uishowProcessFlowID
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
  constructor(private viewScroller: ViewportScroller,
    public ReviewformServiceService: ReviewformServiceService,
    private LoadingPage: NgxSpinnerService,
    private GetApiDataServiceService: GetApiDataServiceService,
    private router: Router,
    private GetApiUserService: GetApiUserService) { }
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

  Emp = { EmpCode: '', EmpName: '' }

  ShiftRoteFlowAppsDetailArray: ShiftRoteFlowAppsDetailClass[]

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
      this.Emp = {
        EmpCode: this.ReviewformServiceService.changeDetail.EmpID1
        , EmpName: this.ReviewformServiceService.changeDetail.EmpNameC1
      }


      this.GetApiDataServiceService.getWebApiData_GetShiftFlowAppsByProcessFlowID(this.ReviewformServiceService.changeDetail.ProcessFlowID)
        .pipe(takeWhile(() => this.api_subscribe))
        .subscribe(
          x => {
            this.ShiftRoteFlowAppsDetailArray = []
            for (let Rote of x[0].ShiftRoteFlowAppsDetail) {
              this.ShiftRoteFlowAppsDetailArray.push({
                ShiftRoteDate: formatDateTime(Rote.ShiftRoteDate).getDate,
                RoteID1: Rote.RoteID1,
                RoteCode1: Rote.RoteCode1,
                RoteName1: Rote.RoteName1,
                RoteID2: Rote.RoteID2,
                RoteCode2: Rote.RoteCode2,
                RoteName2: Rote.RoteName2
              })
            }

          }
        )

    }





  }

  scrollTo(tag: string) {
    this.viewScroller.scrollToAnchor(tag);
    //tag=id連結位置
  }
  backReview() {
    this.ReviewformServiceService.changeReview('changeTab', this.ReviewformServiceService.showReviewMan)
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
            CheckEmpID:this.ReviewformServiceService.showReviewMan.EmpCode
          }
          // console.log(FlowNodeFinish)
          this.LoadingPage.show()
          this.GetApiDataServiceService.getWebApiData_FlowNodeFinish(FlowNodeFinish)
          .pipe(takeWhile(() => this.api_subscribe))
          .subscribe(
            (x: FlowNodeFinishGetDataClass) => {
              this.LoadingPage.hide()
              if (x.Finish) {
                $('#Approveddialog_sussesdialog').modal('show');
              }else{
                alert(x.MessageContent)
              }
              this.LoadingPage.hide()
            },
            error => {
              this.LoadingPage.hide()
              // alert('與api連線異常，getWebApiData_FlowNodeFinish')
            }
          )
        },
        error => {
          this.LoadingPage.hide()
          // alert('與api連線異常，getWebApiData_FlowNodeFinish')
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
            CheckEmpID:this.ReviewformServiceService.showReviewMan.EmpCode
          }
          // console.log(FlowNodeFinish)
          this.LoadingPage.show()
          this.GetApiDataServiceService.getWebApiData_FlowNodeFinish(FlowNodeFinish)
          .pipe(takeWhile(() => this.api_subscribe))
          .subscribe(
            (x: FlowNodeFinishGetDataClass) => {
              this.LoadingPage.hide()
              if (x.Finish) {
                $('#Sendbackdialog_sussesdialog').modal('show');
              }else{
                alert(x.MessageCode)
              }
              this.LoadingPage.hide()
            },
            error => {
              this.LoadingPage.hide()
              // alert('與api連線異常，getWebApiData_FlowNodeFinish')
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
              DeptID:this.FlowDynamic_Base.DeptaID.toString(),
              PosID:this.FlowDynamic_Base.JobID.toString(),
            },
            CheckEmpID:this.ReviewformServiceService.showReviewMan.EmpCode
          }
          // console.log(FlowNodeFinish)
          this.LoadingPage.show()
          this.GetApiDataServiceService.getWebApiData_FlowNodeFinish(FlowNodeFinish)
          .pipe(takeWhile(() => this.api_subscribe))
          .subscribe(
            (x: FlowNodeFinishGetDataClass) => {
              this.LoadingPage.hide()
              if (x.Finish) {
                $('#PutForwarddialog_sussesdialog').modal('show');
              }else{
                alert(x.MessageContent)
              }
              this.LoadingPage.hide()
            },
            error => {
              this.LoadingPage.hide()
              // alert('與api連線異常，getWebApiData_FlowNodeFinish')
            }
          )
        },
        error => {
          this.LoadingPage.hide()
          // alert('與api連線異常，getWebApiData_GetManInfo')
        }
      )

    // this.GetApiDataServiceService.getWebApiData_FlowNodeFinish(FlowNodeFinish).subscribe(
    //   x=>{

    //   }
    // )
  }
  sendFinish() {
    this.backReview()
    this.router.navigate(['../nav/reviewform']);
  }




  checkCanSendPutForward() {
    if (!this.FlowDynamic_Base) {
      alert('請選擇呈核人員')
    } else {
      $('#PutForwarddialog').modal('show');
    }
  }

  signRecordDialog:boolean = false
  show_signRecord(){
    if(!this.signRecordDialog){
      this.signRecordDialog = true
    }
    $('#signRecord').modal('show')
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


