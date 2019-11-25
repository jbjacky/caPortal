import { Component, OnInit, OnDestroy } from '@angular/core';
import { GetApiDataServiceService } from 'src/app/Service/get-api-data-service.service';
import { pagechange } from 'src/app/Models/pagechange';
import { AllformReview, FlowSign, vaFlowSign, forgetFlowSign, delFlowSign, dateArrayClass, changeFlowSign } from 'src/app/Models/AllformReview';
import { ReviewformServiceService } from 'src/app/Service/reviewform-service.service';
import { GetFlowSignRoleClass } from 'src/app/Models/PostData_API_Class/GetFlowSignRoleClass';
import { formatDateTime, getapi_formatTimetoString, doFormatDate } from 'src/app/UseVoid/void_doFormatDate';
import { GetApiUserService } from 'src/app/Service/get-api-user.service';
import { FlowNodeFinishClass } from 'src/app/Models/PostData_API_Class/FlowNodeFinishClass';
import { GetAttendClass } from 'src/app/Models/PostData_API_Class/GetAttendClass';
import { mergeMap, map, toArray, takeWhile } from 'rxjs/operators';
import { from, Observable, of, BehaviorSubject } from 'rxjs';
import { calYearindate } from 'src/app/UseVoid/void_calYearindate';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { void_crossDay } from 'src/app/UseVoid/void_crossDay';
import { GetSelectBaseClass } from 'src/app/Models/GetSelectBaseClass';
import { FlowNodeFinishGetDataClass } from 'src/app/Models/FlowNodeFinishGetDataClass';
import { void_completionTenNum } from 'src/app/UseVoid/void_CompletionTenNum';
import { GetFlowSignAbsGetApiClass } from 'src/app/Models/PostData_API_Class/GetFlowSignAbsGetApiClass';
import { GetFlowSignAbsApiDataClass } from 'src/app/Models/GetFlowSignAbsApiDataClass';
import { GetFlowSignAbscApiDataClass } from 'src/app/Models/GetFlowSignAbscApiDataClass';
import { GetFlowSignCardApiDataClass } from 'src/app/Models/GetFlowSignCardApiDataClass';
import { GetFlowSignShiftRoteApiDataClass } from 'src/app/Models/GetFlowSignShiftRoteApiDataClass';
import { MatSnackBar } from '@angular/material';
import { SussesApproveSnackComponent } from '../../shareComponent/snackbar/susses-approve-snack/susses-approve-snack.component';
import { SnackSetting } from '../../shareComponent/snackbar/SnackSetting';
import { ErrorApproveSnackComponent } from '../../shareComponent/snackbar/error-approve-snack/error-approve-snack.component';
import { SussesPutForwardSnackComponent } from '../../shareComponent/snackbar/susses-put-forward-snack/susses-put-forward-snack.component';
import { ErrorPutForwardSnackComponent } from '../../shareComponent/snackbar/error-put-forward-snack/error-put-forward-snack.component';
import { SussesSendbackSnackComponent } from '../../shareComponent/snackbar/susses-sendback-snack/susses-sendback-snack.component';
import { ErrorSendbackSnackComponent } from '../../shareComponent/snackbar/error-sendback-snack/error-sendback-snack.component';
declare let $: any; //use jquery

@Component({
  selector: 'app-reviewform',
  templateUrl: './reviewform.component.html',
  styleUrls: ['./reviewform.component.css']
})

export class ReviewformComponent implements OnInit, OnDestroy {
  ngOnDestroy(): void {
    // throw new Error("Method not implemented.");
    this.api_subscribe = false;
  }
  api_subscribe = true; //ngOnDestroy時要取消訂閱api的subscribe

  private Sub_onChangeReviewMan$: BehaviorSubject<any> = new BehaviorSubject(0)
  onChangeReviewMan$: Observable<any> = this.Sub_onChangeReviewMan$; //切換換審核人員給選擇簽核人員使用

  pagechange = new pagechange();
  va_pagechange = new pagechange();
  del_pagechange = new pagechange();
  change_pagechange = new pagechange();
  forget_pagechange = new pagechange();
  // jumpPage_forget(e) {
  //   this.forget_pagechange.lowValue = e
  //   this.forget_pagechange.highValue = e + 5
  //   // console.log(e)
  // }
  constructor(private GetApiDataServiceService: GetApiDataServiceService,
    public ReviewformServiceService: ReviewformServiceService,
    private GetApiUserService: GetApiUserService,
    private router: Router,
    private LoadingPage: NgxSpinnerService,
    private SnackBar: MatSnackBar) { }
  // loading: boolean;

  FirstEmpCode: string = ''
  ngOnInit() {

    this.GetApiUserService.counter$.subscribe(
      (x: any) => {
        if (x == 0) {
        } else {

          if (this.ReviewformServiceService.showReviewMan) {
            this.selectReviewMan = JSON.parse(JSON.stringify(this.ReviewformServiceService.showReviewMan))
          }
          this.ReviewformServiceService.clearReview()
          // console.log(this.ReviewformServiceService.showReviewTab)
          // console.log(this.ReviewformServiceService.showReviewMan)
          this.FirstEmpCode = x.EmpCode
          this.firstInTab(x.EmpCode)
        }
      }
    )

  }
  getReviewData: AllformReview[]


  getclickSwitchReview_num: number = 0;
  selectReviewMan: AllformReview;
  showReviewName: string;

  bt_next() {
    //切換審核人員下一個人
    if (this.getReviewData.length - 1 != this.getclickSwitchReview_num) {
      $('#' + this.getReviewData[this.getclickSwitchReview_num + 1].EmpCode + this.getReviewData[this.getclickSwitchReview_num + 1].RoleID).addClass('clicked');
      $('#' + this.getReviewData[this.getclickSwitchReview_num].EmpCode + this.getReviewData[this.getclickSwitchReview_num].RoleID).removeClass('clicked');
      this.getclickSwitchReview_num = this.getclickSwitchReview_num + 1;

      // this.ReviewformServiceService.changeReviewMan(this.getReviewData[this.getclickSwitchReview_num])

      this.selectReviewMan = this.getReviewData[this.getclickSwitchReview_num]
      this.changeMan_firstInTab(this.selectReviewMan)
      // this.ReviewformServiceService.changeReviewMan(this.selectReviewMan)
    }
  }
  bt_pre() {
    //切換審核人員上一個人
    if (this.getclickSwitchReview_num != 0) {
      $('#' + this.getReviewData[this.getclickSwitchReview_num - 1].EmpCode + this.getReviewData[this.getclickSwitchReview_num - 1].RoleID).addClass('clicked');
      $('#' + this.getReviewData[this.getclickSwitchReview_num].EmpCode + this.getReviewData[this.getclickSwitchReview_num].RoleID).removeClass('clicked');
      this.getclickSwitchReview_num = this.getclickSwitchReview_num - 1;

      // this.ReviewformServiceService.changeReviewMan(this.getReviewData[this.getclickSwitchReview_num])

      this.selectReviewMan = this.getReviewData[this.getclickSwitchReview_num]
      this.changeMan_firstInTab(this.selectReviewMan)
      // this.ReviewformServiceService.changeReviewMan(this.selectReviewMan)
    }
  }


  changeSelectReviewMan(selectReviewMan: AllformReview) {

    for (let i = 0; i < this.getReviewData.length; i++) {
      $('#' + this.getReviewData[i].EmpCode + this.getReviewData[i].RoleID).removeClass('clicked');
    }
    $('#' + selectReviewMan.EmpCode + selectReviewMan.RoleID).addClass('clicked');
    // console.log(selectReviewMan)
    this.ReviewformServiceService.showReviewTab = ''
    this.changeMan_firstInTab(selectReviewMan)
    // this.chooseEmpIDReviewForm(selectEmpCode, this.getReviewData)
    // this.ReviewformServiceService.changeReviewMan(selectReviewMan)

  }

  dialog_select_Click(e: AllformReview, index) {
    for (let i = 0; i < this.getReviewData.length; i++) {
      $('#' + this.getReviewData[i].EmpCode + this.getReviewData[i].RoleID).removeClass('clicked');
    }

    this.selectReviewMan = e
    // this.ReviewformServiceService.changeReviewMan(e)
    this.getclickSwitchReview_num = index;
    // this.chooseEmpIDReviewForm(e, this.getReviewData)
    this.changeMan_firstInTab(this.selectReviewMan)
    $('#' + e.EmpCode + e.RoleID).addClass('clicked');
  }

  vaCount = '0';
  delCount = '0';
  changeCount = '0';
  forgetCount = '0';

  vaFlowSigns: vaFlowSign[] = [];
  forgetFlowSigns: forgetFlowSign[] = [];
  delFlowSigns: delFlowSign[] = [];
  changeFlowSigns: changeFlowSign[] = [];

  chooseEmpIDReviewForm(EmpID, RoleID, getReviewDatas: AllformReview[]) {
    //取得明細
    this.vaFlowSigns = [];
    this.forgetFlowSigns = [];
    this.delFlowSigns = [];
    this.changeFlowSigns = [];

    for (let getReviewData of getReviewDatas) {
      if (EmpID == getReviewData.EmpCode && RoleID == getReviewData.RoleID) {
        for (let FlowSignForm of getReviewData.FlowSignForm) {
          if (FlowSignForm.FormCode == 'Abs') {
            //請假單
            this.vaCount = FlowSignForm.Count
          } else if (FlowSignForm.FormCode == 'Absc') {
            //銷假單
            this.delCount = FlowSignForm.Count
          } else if (FlowSignForm.FormCode == 'Card') {
            //考勤異常簽認單
            this.forgetCount = FlowSignForm.Count
          } else if (FlowSignForm.FormCode == 'ShiftRote') {
            //調班單
            this.changeCount = FlowSignForm.Count
          }

        }
      }
    }
    this.GoTab_ReviewLog(EmpID, RoleID, getReviewDatas);


    // this.GoTab(EmpID, RoleID, getReviewDatas);



  }

  /**
   * @todo 如果有ReviewTab優先選Tab;請假>銷假>調班>考勤異常確認
   */
  private GoTab_ReviewLog(EmpID: any, RoleID: any, getReviewDatas: AllformReview[]) {
    if (this.ReviewformServiceService.showReviewTab.length > 0) {
      if (this.ReviewformServiceService.showReviewTab == 'vaTab') {
        this.ReviewformServiceService.changeReview('vaTab', this.ReviewformServiceService.showReviewMan);
        $('#' + this.ReviewformServiceService.showReviewTab).click();
        this.vaTabClick(this.ReviewformServiceService.showReviewMan);
      }
      else if (this.ReviewformServiceService.showReviewTab == 'delTab') {
        this.ReviewformServiceService.changeReview('delTab', this.ReviewformServiceService.showReviewMan);
        $('#' + this.ReviewformServiceService.showReviewTab).click();
        this.delTabClick(this.ReviewformServiceService.showReviewMan);
      }
      else if (this.ReviewformServiceService.showReviewTab == 'changeTab') {
        this.ReviewformServiceService.changeReview('changeTab', this.ReviewformServiceService.showReviewMan);
        $('#' + this.ReviewformServiceService.showReviewTab).click();
        this.changeTabClick(this.ReviewformServiceService.showReviewMan);
      }
      else if (this.ReviewformServiceService.showReviewTab == 'forgetTab') {
        this.ReviewformServiceService.changeReview('forgetTab', this.ReviewformServiceService.showReviewMan);
        $('#' + this.ReviewformServiceService.showReviewTab).click();
        this.forgetTabClick(this.ReviewformServiceService.showReviewMan);
      }
      else {
        this.LoadingPage.hide();
      }
    }
    else {
      this.GoTab(EmpID, RoleID, getReviewDatas);
    }
  }

  /**
   * @todo 如果請假單有就顯示;請假>銷假>調班>考勤異常確認
   */
  private GoTab(EmpID: any, RoleID: any, getReviewDatas: AllformReview[]) {
    if (parseInt(this.vaCount) > 0) {
      this.ReviewformServiceService.changeReview('vaTab', this.ReviewformServiceService.showReviewMan);
      $('#' + this.ReviewformServiceService.showReviewTab).click();
      // this.vaTabClick(this.ReviewformServiceService.showReviewMan)
      this.GetFlowData_va(EmpID, RoleID, getReviewDatas);
    }
    else if (parseInt(this.delCount) > 0) {
      this.ReviewformServiceService.changeReview('delTab', this.ReviewformServiceService.showReviewMan);
      $('#' + this.ReviewformServiceService.showReviewTab).click();
      // this.delTabClick(this.ReviewformServiceService.showReviewMan)
      this.GetFlowData_del(EmpID, RoleID, getReviewDatas);
    }
    else if (parseInt(this.changeCount) > 0) {
      this.ReviewformServiceService.changeReview('changeTab', this.ReviewformServiceService.showReviewMan);
      $('#' + this.ReviewformServiceService.showReviewTab).click();
      // this.changeTabClick(this.ReviewformServiceService.showReviewMan)
      this.GetFlowData_change(EmpID, RoleID, getReviewDatas);
    }
    else if (parseInt(this.forgetCount) > 0) {
      this.ReviewformServiceService.changeReview('forgetTab', this.ReviewformServiceService.showReviewMan);
      $('#' + this.ReviewformServiceService.showReviewTab).click();
      // this.forgetTabClick(this.ReviewformServiceService.showReviewMan)
      this.GetFlowData_forget(EmpID, RoleID, getReviewDatas);
    }
    else {
      this.LoadingPage.hide();
    }
  }

  chooseReviewManClass(chooseReviewManCode: AllformReview) {
    if (chooseReviewManCode == this.ReviewformServiceService.showReviewMan) {
      return 'SwitchReviews clicked'
    } else {
      return 'SwitchReviews'
    }

  }

  // vaDetailClick(e) {
  //   this.ReviewformServiceService.setVaDetailProcessFlowID(e);
  //   console.log(this.vaFlowSign)
  // }


  isFirstTab: boolean;
  firstInTab(SignEmpID) {

    this.isGetFlowSignRole = true;

    this.vaCount = '0';
    this.delCount = '0';
    this.changeCount = '0';
    this.forgetCount = '0';
    // this.loading = true;
    // this.LoadingPage.show()
    this.getReviewData = []
    this.vaFlowSigns = [];
    this.forgetFlowSigns = [];
    this.changeFlowSigns = [];
    this.delFlowSigns = [];
    this.ReviewformServiceService.getReviewData = [];

    var GetFlowSignRole: GetFlowSignRoleClass = {
      "SignEmpID": SignEmpID,
      "SignRoleID": "",
      "RealSignEmpID": "",
      "RealSignRoleID": "",
      "FlowTreeID": "",
      "SignDate": ""
    }
    this.void_GetFlowSignRole(GetFlowSignRole, 'Reload')
  }

  changeMan_firstInTab(selectReviewMan: AllformReview) {

    this.isGetFlowSignRole = true;

    this.vaCount = '0';
    this.delCount = '0';
    this.changeCount = '0';
    this.forgetCount = '0';
    // this.loading = true;
    this.LoadingPage.show()
    this.isFirstTab = true;
    this.getReviewData = []
    this.vaFlowSigns = [];
    this.forgetFlowSigns = [];
    this.changeFlowSigns = [];
    this.delFlowSigns = [];
    this.ReviewformServiceService.getReviewData = [];

    var GetFlowSignRole: GetFlowSignRoleClass = {
      "SignEmpID": this.FirstEmpCode,
      "SignRoleID": "",
      "RealSignEmpID": selectReviewMan.EmpCode,
      "RealSignRoleID": selectReviewMan.RoleID,
      "FlowTreeID": "",
      "SignDate": ""
    }
    this.void_GetFlowSignRole(GetFlowSignRole, 'Reload')
  }

  vaTabClick(selectReviewMan: AllformReview) {
    if (this.FirstEmpCode.length != 0) {

      this.LoadingPage.show()
      var GetFlowSignRole: GetFlowSignRoleClass = {
        "SignEmpID": this.FirstEmpCode,
        "SignRoleID": "",
        "RealSignEmpID": selectReviewMan.EmpCode,
        "RealSignRoleID": selectReviewMan.RoleID,
        "FlowTreeID": "81",
        "SignDate": ""
      }
      this.void_GetFlowSignRole(GetFlowSignRole, 'vaTabClick')
      window.scroll(0, 0)
    }
  }
  forgetTabClick(selectReviewMan: AllformReview) {
    if (this.FirstEmpCode.length != 0) {

      this.LoadingPage.show()
      var GetFlowSignRole: GetFlowSignRoleClass = {
        "SignEmpID": this.FirstEmpCode,
        "SignRoleID": "",
        "RealSignEmpID": selectReviewMan.EmpCode,
        "RealSignRoleID": selectReviewMan.RoleID,
        "FlowTreeID": "60",
        "SignDate": ""
      }
      this.void_GetFlowSignRole(GetFlowSignRole, 'forgetTabClick')
      window.scroll(0, 0)
    }
  }
  delTabClick(selectReviewMan: AllformReview) {
    if (this.FirstEmpCode.length != 0) {

      this.LoadingPage.show()
      var GetFlowSignRole: GetFlowSignRoleClass = {
        "SignEmpID": this.FirstEmpCode,
        "SignRoleID": "",
        "RealSignEmpID": selectReviewMan.EmpCode,
        "RealSignRoleID": selectReviewMan.RoleID,
        "FlowTreeID": "17",
        "SignDate": ""
      }
      this.void_GetFlowSignRole(GetFlowSignRole, 'delTabClick')
      window.scroll(0, 0)
    }
  }
  changeTabClick(selectReviewMan: AllformReview) {
    if (this.FirstEmpCode.length != 0) {

      this.LoadingPage.show()
      var GetFlowSignRole: GetFlowSignRoleClass = {
        "SignEmpID": this.FirstEmpCode,
        "SignRoleID": "",
        "RealSignEmpID": selectReviewMan.EmpCode,
        "RealSignRoleID": selectReviewMan.RoleID,
        "FlowTreeID": "66",
        "SignDate": ""
      }
      this.void_GetFlowSignRole(GetFlowSignRole, 'changeTabClick')
      window.scroll(0, 0)
    }
  }

  isGetFlowSignRole: boolean = true;

  void_GetFlowSignRole(GetFlowSignRole: GetFlowSignRoleClass, ReloadOrChangeTabString: string) {
    this.LoadingPage.show()
    this.GetApiDataServiceService.getWebApiData_GetFlowSignRole(GetFlowSignRole)
      .pipe(takeWhile(() => this.api_subscribe))
      .subscribe(
        (x: any) => {
          if (x) {
            if (x.length > 0) {

              var getAPI_ReviewData: AllformReview[] = []
              var FlowSign_index = 0
              for (let FlowSign of x) {
                getAPI_ReviewData.push({
                  EmpCode: FlowSign.EmpID,
                  EmpNameC: FlowSign.EmpName,
                  EmpNameE: FlowSign.EmpName,
                  Count: FlowSign.Count,
                  FlowSignForm: [],

                  PosID: FlowSign.PosID,
                  PosName: FlowSign.PosName,
                  RoleEmp: FlowSign.RoleEmp,
                  RoleID: FlowSign.RoleID,
                  DeptName: FlowSign.DeptName,
                  BatchSign: FlowSign.BatchSign
                })
                // var FlowSignForm_index = 0
                for (let FlowSignForm of FlowSign.FlowSignForm) {
                  getAPI_ReviewData[FlowSign_index].FlowSignForm.push(
                    {
                      Count: FlowSignForm.Count,
                      FormCode: FlowSignForm.FormCode,
                      FormName: FlowSignForm.FormName,
                      FlowTreeID: FlowSignForm.FlowTreeID,
                      FlowSign: []
                    }
                  )
                  // for (let FlowSign of FlowSignForm.FlowSign) {
                  //   getAPI_ReviewData[FlowSign_index].FlowSignForm[FlowSignForm_index].FlowSign.push(
                  //     {
                  //       ProcessFlowID: FlowSign.ProcessFlowID,
                  //       FlowTreeID: FlowSign.FlowTreeID,
                  //       FlowNodeID: FlowSign.FlowNodeID,
                  //       ProcessApParmAuto: FlowSign.ProcessApParmAuto,
                  //       EmpCode: FlowSign.AppEmpID,
                  //       EmpNameC: FlowSign.AppEmpName,
                  //       EmpNameE: FlowSign.AppEmpName,
                  //       Note: FlowSign.Note,
                  //       isApproved: FlowSign.SignCondition.SignComplete,
                  //       isSendback: FlowSign.SignCondition.Reject,
                  //       isPutForward: FlowSign.SignCondition.Sign
                  //     }
                  //   )
                  // }
                  // FlowSignForm_index = FlowSignForm_index + 1
                }
                FlowSign_index = FlowSign_index + 1;
              }

              // console.log(getAPI_ReviewData)
              // this.ReviewformServiceService.getReviewData = getAPI_ReviewData
              // this.getReviewData = this.ReviewformServiceService.getReviewData
              // if (this.ReviewformServiceService.showReviewManCode.length == 0) {
              //   this.ReviewformServiceService.changeReviewMan(this.getReviewData[0].EmpCode)
              //   this.selectReviewMan = this.ReviewformServiceService.showReviewManCode;
              //   this.showReviewName = this.ReviewformServiceService.showReviewName
              // } else {
              //   this.selectReviewMan = this.ReviewformServiceService.showReviewManCode;
              //   this.showReviewName = this.ReviewformServiceService.showReviewName
              // }
              this.getReviewData = getAPI_ReviewData
              if (this.ReviewformServiceService.showReviewMan.EmpCode) {
                var hasReviewMan: boolean = false
                for (let aa of getAPI_ReviewData) {
                  if (aa.EmpCode == this.selectReviewMan.EmpCode && aa.PosID == this.selectReviewMan.PosID && aa.RoleID == this.selectReviewMan.RoleID) {
                    this.ReviewformServiceService.changeReviewMan(aa)
                    this.Sub_onChangeReviewMan$.next(aa.EmpCode)
                    hasReviewMan = true
                  }
                }
                if (!hasReviewMan) {
                  this.ReviewformServiceService.changeReviewMan(getAPI_ReviewData[0])
                  this.Sub_onChangeReviewMan$.next(getAPI_ReviewData[0].EmpCode)
                }
              } else {
                this.ReviewformServiceService.changeReviewMan(getAPI_ReviewData[0])
                this.Sub_onChangeReviewMan$.next(getAPI_ReviewData[0].EmpCode)
              }
              this.selectReviewMan = this.ReviewformServiceService.showReviewMan

              if (ReloadOrChangeTabString == 'Reload') {

                this.chooseEmpIDReviewForm(this.ReviewformServiceService.showReviewMan.EmpCode, this.ReviewformServiceService.showReviewMan.RoleID, this.getReviewData)

              } else if (ReloadOrChangeTabString == 'vaTabClick') {

                this.GetFlowData_va(this.ReviewformServiceService.showReviewMan.EmpCode, this.ReviewformServiceService.showReviewMan.RoleID, this.getReviewData)

              } else if (ReloadOrChangeTabString == 'delTabClick') {

                this.GetFlowData_del(this.ReviewformServiceService.showReviewMan.EmpCode, this.ReviewformServiceService.showReviewMan.RoleID, this.getReviewData)

              } else if (ReloadOrChangeTabString == 'changeTabClick') {

                this.GetFlowData_change(this.ReviewformServiceService.showReviewMan.EmpCode, this.ReviewformServiceService.showReviewMan.RoleID, this.getReviewData)

              } else if (ReloadOrChangeTabString == 'forgetTabClick') {

                this.GetFlowData_forget(this.ReviewformServiceService.showReviewMan.EmpCode, this.ReviewformServiceService.showReviewMan.RoleID, this.getReviewData)
              }


              // this.LoadingPage.hide()
            } else {
              // this.loading = false;
              this.LoadingPage.hide()
              this.isGetFlowSignRole = false;
              // console.log('沒有審核資料')
            }
          } else {
            this.LoadingPage.hide()
          }

        },
        (error) => {
          // alert('取不到資料，與api連線異常，void_GetFlowSignRole')
          this.LoadingPage.hide()
        }
      )
  }

  FinallyReviewForm: FlowSign = new FlowSign();
  ReloadTabData = '';
  vaDetail_click(e_vaFlowSign: vaFlowSign, ReloadTabData) {
    this.ReloadTabData = ReloadTabData;
    this.signText = '';
    this.ReviewformServiceService.vaDetail = e_vaFlowSign
    this.FinallyReviewForm.ProcessFlowID = this.ReviewformServiceService.vaDetail.ProcessFlowID
    this.FinallyReviewForm.ProcessApParmAuto = this.ReviewformServiceService.vaDetail.ProcessApParmAuto
    this.FinallyReviewForm.FlowTreeID = this.ReviewformServiceService.vaDetail.FlowTreeID
    this.FinallyReviewForm.FlowNodeID = this.ReviewformServiceService.vaDetail.FlowNodeID

  }
  vaShowLimitText = ''
  checkAbsLimit_Approved(e_vaFlowSign: vaFlowSign, ReloadTabData) {
    this.vaDetail_click(e_vaFlowSign, ReloadTabData)
    this.LoadingPage.show()
    this.GetApiDataServiceService.getWebApiData_AbsLimitCheck(parseInt(this.FinallyReviewForm.ProcessFlowID))
      .pipe(takeWhile(() => this.api_subscribe))
      .subscribe(
        (x: string) => {
          this.vaShowLimitText = x.toString()
          this.LoadingPage.hide()
          $('#vaApproveddialog').modal('show')
        }
      )
  }
  showvaPutForwarddialog = false
  checkAbsLimit_PutForward(e_vaFlowSign: vaFlowSign, ReloadTabData) {
    this.vaDetail_click(e_vaFlowSign, ReloadTabData)
    this.LoadingPage.show()
    this.showvaPutForwarddialog = true
    this.GetApiDataServiceService.getWebApiData_AbsLimitCheck(this.FinallyReviewForm.ProcessFlowID)
      .pipe(takeWhile(() => this.api_subscribe))
      .subscribe(
        (x: string) => {
          this.vaShowLimitText = x.toString()
          this.LoadingPage.hide()
          
          $('#vaPutForwarddialog').modal('show')
        }
      )
  }
  showPutForwarddialog = false
  delDetail_click(e_delFlowSign: delFlowSign, ReloadTabData) {

    this.ReloadTabData = ReloadTabData;
    this.signText = '';
    this.ReviewformServiceService.delDetail = e_delFlowSign
    this.FinallyReviewForm.ProcessFlowID = this.ReviewformServiceService.delDetail.ProcessFlowID
    this.FinallyReviewForm.ProcessApParmAuto = this.ReviewformServiceService.delDetail.ProcessApParmAuto
    this.FinallyReviewForm.FlowTreeID = this.ReviewformServiceService.delDetail.FlowTreeID
    this.FinallyReviewForm.FlowNodeID = this.ReviewformServiceService.delDetail.FlowNodeID
  }
  del_PutForward(e_delFlowSign: delFlowSign, ReloadTabData){
    this.delDetail_click(e_delFlowSign,ReloadTabData)
    this.showPutForwarddialog = true
    $('#PutForwarddialog').modal('show')
  }
  forgetDetail_click(e_forgetFlowSign: forgetFlowSign, ReloadTabData) {
    this.ReloadTabData = ReloadTabData;
    this.signText = '';
    this.ReviewformServiceService.forgetDetail = e_forgetFlowSign
    this.FinallyReviewForm.ProcessFlowID = this.ReviewformServiceService.forgetDetail.ProcessFlowID
    this.FinallyReviewForm.ProcessApParmAuto = this.ReviewformServiceService.forgetDetail.ProcessApParmAuto
    this.FinallyReviewForm.FlowTreeID = this.ReviewformServiceService.forgetDetail.FlowTreeID
    this.FinallyReviewForm.FlowNodeID = this.ReviewformServiceService.forgetDetail.FlowNodeID
  }
  forgetShowCheckText = ''
  showforgetPutForwarddialog = false
  checkforgetCardText_Approved(e_forgetFlowSign: forgetFlowSign, ReloadTabData) {
    this.forgetDetail_click(e_forgetFlowSign, ReloadTabData)
    this.LoadingPage.show()
    this.GetApiDataServiceService.getWebApiData_CardCheckByProcessFlowID(this.FinallyReviewForm.ProcessFlowID)
      .pipe(takeWhile(() => this.api_subscribe))
      .subscribe(
        (x: string) => {
          this.forgetShowCheckText = x.toString()
          this.LoadingPage.hide()
          $('#forgetApproveddialog').modal('show')
        }
      )
  }
  checkforgetCardText_PutForward(e_forgetFlowSign: forgetFlowSign, ReloadTabData) {
    this.forgetDetail_click(e_forgetFlowSign, ReloadTabData)
    this.LoadingPage.show()
    this.showforgetPutForwarddialog = true
    this.GetApiDataServiceService.getWebApiData_CardCheckByProcessFlowID(this.FinallyReviewForm.ProcessFlowID)
      .pipe(takeWhile(() => this.api_subscribe))
      .subscribe(
        (x: string) => {
          this.forgetShowCheckText = x.toString()
          this.LoadingPage.hide()
          $('#forgetPutForwarddialog').modal('show')
        }
      )
  }

  changeDetail_click_checktoView(e_changeFlowSign: changeFlowSign, ReloadTabData) {
    if (e_changeFlowSign.isRR) {
      this.router.navigate(["../nav/reviewform/ReviewformDetailChangeformRRComponent"]);
    } else if (e_changeFlowSign.isDR) {
      this.router.navigate(['../nav/reviewform/ReviewformDetailChangeformComponent']);
    } else if (e_changeFlowSign.isRZ) {
      this.router.navigate(['../nav/reviewform/ReviewformDetailChangeformRZComponent']);

    }
    this.changeDetail_click(e_changeFlowSign, ReloadTabData)
  }
  changeDetail_click(e_changeFlowSign: changeFlowSign, ReloadTabData) {
    this.ReloadTabData = ReloadTabData;
    this.signText = '';
    this.ReviewformServiceService.changeDetail = e_changeFlowSign
    this.FinallyReviewForm.ProcessFlowID = this.ReviewformServiceService.changeDetail.ProcessFlowID
    this.FinallyReviewForm.ProcessApParmAuto = this.ReviewformServiceService.changeDetail.ProcessApParmAuto
    this.FinallyReviewForm.FlowTreeID = this.ReviewformServiceService.changeDetail.FlowTreeID
    this.FinallyReviewForm.FlowNodeID = this.ReviewformServiceService.changeDetail.FlowNodeID
  }

  change_PutForward(e_changeFlowSign: changeFlowSign, ReloadTabData){
    this.changeDetail_click(e_changeFlowSign,ReloadTabData)
    this.showPutForwarddialog = true
    $('#PutForwarddialog').modal('show')
  }


  FlowDynamic_Base: GetSelectBaseClass;
  chooseBase(GetSelectBase: GetSelectBaseClass) {
    this.FlowDynamic_Base = GetSelectBase
  }

  signText: string;
  ReloadData() {
    if (this.ReloadTabData == 'vaTab') {
      this.vaFlowSigns = []
      this.vaTabClick(this.ReviewformServiceService.showReviewMan);
    } else if (this.ReloadTabData == 'forgetTab') {
      this.forgetFlowSigns = []
      this.forgetTabClick(this.ReviewformServiceService.showReviewMan);
    } else if (this.ReloadTabData == 'delTab') {
      this.delFlowSigns = []
      this.delTabClick(this.ReviewformServiceService.showReviewMan);
    } else if (this.ReloadTabData == 'changeTab') {
      this.changeFlowSigns = []
      this.changeTabClick(this.ReviewformServiceService.showReviewMan);
    } else {
      alert('取值錯誤')
    }
  }
  Approved_Click() {
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
            ProcessFlowID: parseInt(this.FinallyReviewForm.ProcessFlowID),
            ProcessApParmAuto: parseInt(this.FinallyReviewForm.ProcessApParmAuto),
            State: "3",
            FlowTreeID: this.FinallyReviewForm.FlowTreeID,
            FlowNodeID: this.FinallyReviewForm.FlowNodeID,
            Note: this.signText,
            NodeName: "核准",
            ManInfo: y[0],
            FlowDynamic: {
              FlowNode: this.FinallyReviewForm.FlowNodeID,
              RoleID: this.ReviewformServiceService.showReviewMan.RoleID,
              EmpID: this.ReviewformServiceService.showReviewMan.EmpCode,
              DeptID: "",
              PosID: ""
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
                  // document.getElementById("bt_Sus_Apr").focus();
                  this.SnackBar.openFromComponent(SussesApproveSnackComponent, {
                    data: null,
                    panelClass: 'SussesSnackClass',
                    duration: SnackSetting.duration,
                    verticalPosition: SnackSetting.verticalPosition,
                    horizontalPosition: SnackSetting.horizontalPosition
                  });
                  this.ReloadData()
                } else {
                  // alert(x.MessageContent)
                  this.SnackBar.openFromComponent(ErrorApproveSnackComponent, {
                    data: x.MessageContent.toString(),
                    panelClass: x.MessageContent,
                    duration: SnackSetting.duration,
                    verticalPosition: SnackSetting.verticalPosition,
                    horizontalPosition: SnackSetting.horizontalPosition
                  });
                }
              }
            )
        }
      )
  }
  Sendback_Click() {

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
            ProcessFlowID: parseInt(this.FinallyReviewForm.ProcessFlowID),
            ProcessApParmAuto: parseInt(this.FinallyReviewForm.ProcessApParmAuto),
            State: "2",
            FlowTreeID: this.FinallyReviewForm.FlowTreeID,
            FlowNodeID: this.FinallyReviewForm.FlowNodeID,
            Note: this.signText,
            NodeName: "重擬",
            ManInfo: y[0],
            FlowDynamic: {
              FlowNode: this.FinallyReviewForm.FlowNodeID,
              RoleID: this.ReviewformServiceService.showReviewMan.RoleID,
              EmpID: this.ReviewformServiceService.showReviewMan.EmpCode,
              DeptID: "",
              PosID: ""
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
                  // document.getElementById("bt_Sus_Sbk").focus();
                  this.SnackBar.openFromComponent(SussesSendbackSnackComponent, {
                    data: null,
                    panelClass: 'SussesSnackClass',
                    duration: SnackSetting.duration,
                    verticalPosition: SnackSetting.verticalPosition,
                    horizontalPosition: SnackSetting.horizontalPosition
                  });
                  this.ReloadData()
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
              }
            )
        }
      )
  }
  PutForward_Click() {

    if (!this.FlowDynamic_Base) {
      alert('請選擇呈核人員')
    } else {
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
              ProcessFlowID: parseInt(this.FinallyReviewForm.ProcessFlowID),
              ProcessApParmAuto: parseInt(this.FinallyReviewForm.ProcessApParmAuto),
              State: "1",
              FlowTreeID: this.FinallyReviewForm.FlowTreeID,
              FlowNodeID: this.FinallyReviewForm.FlowNodeID,
              Note: this.signText,
              NodeName: "呈核",
              ManInfo: y[0],
              FlowDynamic: {
                FlowNode: this.FinallyReviewForm.FlowNodeID,
                RoleID: "",//呈核對象
                EmpID: this.FlowDynamic_Base.EmpID.toString(),//呈核對象
                DeptID: this.FlowDynamic_Base.DeptaID.toString(),
                PosID: this.FlowDynamic_Base.JobID.toString()
              },
              CheckEmpID: this.ReviewformServiceService.showReviewMan.EmpCode
            }
            // console.log(FlowNodeFinish)
            // console.log(JSON.stringify(FlowNodeFinish).toString())
            this.LoadingPage.show()
            this.GetApiDataServiceService.getWebApiData_FlowNodeFinish(FlowNodeFinish)
              .pipe(takeWhile(() => this.api_subscribe))
              .subscribe(
                (x: FlowNodeFinishGetDataClass) => {
                  this.LoadingPage.hide()
                  if (x.Finish) {
                    // $('#PutForwarddialog_sussesdialog').modal('show');
                    // document.getElementById("bt_Sus_Put").focus();
                    this.SnackBar.openFromComponent(SussesPutForwardSnackComponent, {
                      data: null,
                      panelClass: 'SussesSnackClass',
                      duration: SnackSetting.duration,
                      verticalPosition: SnackSetting.verticalPosition,
                      horizontalPosition: SnackSetting.horizontalPosition
                    });
                    this.ReloadData()
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
                }
              )
          }
        )
    }
  }

  checkHaveFlowDynamic_EmpID() {

    if (!this.FlowDynamic_Base) {
      return true
    } else {
      return false
    }
  }

  GetFlowData_va(EmpID: string, RoleID, getReviewDatas: AllformReview[]) {
    //請假單
    var today = new Date()
    var GetFlowSignAbsGetApi: GetFlowSignAbsGetApiClass = {
      RealSignEmpID: EmpID,
      RealSignRoleID: RoleID,
      SignDate: doFormatDate(today)
    }
    this.GetApiDataServiceService.getWebApiData_GetFlowSignAbs(GetFlowSignAbsGetApi)
      .pipe(takeWhile(() => this.api_subscribe))
      .subscribe(
        (GetFlowSignAbsApiData: GetFlowSignAbsApiDataClass[]) => {

          this.vaFlowSigns = []
          if (GetFlowSignAbsApiData) {
            for (let aa of GetFlowSignAbsApiData) {

              this.vaFlowSigns.push({
                uiProcessFlowID: void_completionTenNum(aa.ProcessFlowID),
                uiHolidayName: aa.HolidayName,
                ProcessFlowID: aa.ProcessFlowID.toString(),
                FlowTreeID: aa.FlowTreeID,
                FlowNodeID: aa.FlowNodeID,
                ProcessApParmAuto: aa.ProcessApParmAuto.toString(),
                EmpCode: aa.EmpCode, //申請人
                EmpNameC: aa.EmpNameC,
                EmpNameE: aa.EmpNameC,
                isApproved: aa.isApproved,
                isSendback: aa.isSendback,
                isPutForward: aa.isPutForward,

                checkProxy: aa.checkProxy, //是否為代填表單
                WriteEmpCode: aa.EmpCode, //填寫人
                WriteEmpNameC: aa.EmpNameC, //填寫人

                Appointment: aa.Appointment,//是否為預排假單

                DateB: formatDateTime(aa.DateB).getDate,
                DateE: formatDateTime(aa.DateE).getDate,
                TimeB: getapi_formatTimetoString(aa.TimeB),
                TimeE: getapi_formatTimetoString(aa.TimeE),
                numberOfVaData: aa.numberOfVaData.toString(),

                day: aa.day.toString(),
                hour: aa.hour.toString(),
                minute: aa.minute.toString()
              })
            }
          }
          this.vaFlowSigns.sort((small: any, large: any) => {
            var small_DateTimeB = Number(new Date(small.DateB + ' ' + small.TimeB))
            var large_DateTimeB = Number(new Date(large.DateB + ' ' + large.TimeB))
            return small_DateTimeB - large_DateTimeB;
          });

          this.vaCount = this.vaFlowSigns.length.toString()

          this.LoadingPage.hide()
        })
  }
  GetFlowData_del(EmpID: string, RoleID, getReviewDatas: AllformReview[]) {
    //銷假單
    var today = new Date()
    var GetFlowSignAbsGetApi: GetFlowSignAbsGetApiClass = {
      RealSignEmpID: EmpID,
      RealSignRoleID: RoleID,
      SignDate: doFormatDate(today)
    }
    this.GetApiDataServiceService.getWebApiData_GetFlowSignAbsc(GetFlowSignAbsGetApi)
      .pipe(takeWhile(() => this.api_subscribe))
      .subscribe(
        (GetFlowSignAbscApiData: GetFlowSignAbscApiDataClass[]) => {
          this.delFlowSigns = []
          if (GetFlowSignAbscApiData) {

            for (let bb of GetFlowSignAbscApiData) {
              this.delFlowSigns.push({
                uiProcessFlowID: void_completionTenNum(bb.ProcessFlowID),
                uiHolidayName: bb.HolidayName,
                ProcessFlowID: bb.ProcessFlowID.toString(),
                FlowTreeID: bb.FlowTreeID,
                FlowNodeID: bb.FlowNodeID,
                ProcessApParmAuto: bb.ProcessApParmAuto.toString(),
                EmpCode: bb.EmpCode,//申請人
                EmpNameC: bb.EmpNameC,//申請人
                EmpNameE: bb.EmpNameC,//申請人
                isApproved: bb.isApproved,
                isSendback: bb.isSendback,
                isPutForward: bb.isPutForward,

                WriteEmpCode: bb.EmpCode, //填寫人
                WriteEmpNameC: bb.EmpNameC, //填寫人

                checkProxy: bb.checkProxy,
                YearAndDate: calYearindate(bb.dateArray),
                dateArray: bb.dateArray,
                Note: bb.Note,
                day: bb.day.toString(),
                hour: bb.hour.toString(),
                minute: bb.minute.toString(),
                numberOfVaData: bb.numberOfVaData.toString()
              })
            }
          }
          this.delFlowSigns.sort((a: any, b: any) => {
            return b.ProcessFlowID - a.ProcessFlowID;
          });

          this.delCount = this.delFlowSigns.length.toString()
          this.LoadingPage.hide()
        })
  }

  GetFlowData_forget(EmpID: string, RoleID, getReviewDatas: AllformReview[]) {
    //考勤異常簽認單

    var today = new Date()
    var GetFlowSignAbsGetApi: GetFlowSignAbsGetApiClass = {
      RealSignEmpID: EmpID,
      RealSignRoleID: RoleID,
      SignDate: doFormatDate(today)
    }
    this.GetApiDataServiceService.getWebApiData_GetFlowSignCard(GetFlowSignAbsGetApi)
      .pipe(takeWhile(() => this.api_subscribe))
      .subscribe(
        (GetFlowSignCardApiData: GetFlowSignCardApiDataClass[]) => {

          this.forgetFlowSigns = []

          if (GetFlowSignCardApiData) {

            for (let cc of GetFlowSignCardApiData) {
              var ExceptionalNameArray = []
              ExceptionalNameArray = cc.ExceptionalName.split(',')
              var _isForgetCard: boolean = false
              var _isEarlyMins: boolean = false
              var _isLateMins: boolean = false
              for (let e of ExceptionalNameArray) {
                if (e == '未刷卡') {
                  _isForgetCard = true
                } else if (e == '早退') {
                  _isEarlyMins = true
                } else if (e == '遲到') {
                  _isLateMins = true
                }
              }
              this.forgetFlowSigns.push({
                uiProcessFlowID: void_completionTenNum(cc.ProcessFlowID),
                ProcessFlowID: cc.ProcessFlowID.toString(),
                FlowTreeID: cc.FlowTreeID,
                FlowNodeID: cc.FlowNodeID,
                ProcessApParmAuto: cc.ProcessApParmAuto.toString(),
                EmpCode: cc.EmpCode,
                EmpNameC: cc.EmpNameC,
                EmpNameE: cc.EmpNameE,
                isApproved: cc.isApproved,
                isSendback: cc.isSendback,
                isPutForward: cc.isPutForward,
                isForgetCard: _isForgetCard,
                isEarlyMins: _isEarlyMins,
                isLateMins: _isLateMins,

                checkProxy: cc.checkProxy,
                WriteEmpCode: cc.EmpCode,
                WriteEmpNameC: cc.EmpNameC,

                Date: formatDateTime(cc.Date).getDate.toString(),
                RoteCode: cc.RoteCode,
                RoteTimeB: null,
                RoteTimeE: null,

                writeDateB: null,
                writeTimeB: null,
                writeDateE: null,
                writeTimeE: null,
                cardTimeB: null,
                cardTimeE: null,
                CauseID1: null,
                CauseName1: null,
                Note: null,

                ActualRote_calCrossDay: null,
                AttendCard_calCrossDay: null,
                WriteRote_calCrossDay: null
              })

            }
          }
          this.forgetFlowSigns.sort((a: any, b: any) => {
            return b.ProcessFlowID - a.ProcessFlowID;
          });

          this.forgetCount = this.forgetFlowSigns.length.toString()
          this.LoadingPage.hide()

        })

  }

  GetFlowData_change(EmpID: string, RoleID, getReviewDatas: AllformReview[]) {
    //調班單

    var today = new Date()
    var GetFlowSignAbsGetApi: GetFlowSignAbsGetApiClass = {
      RealSignEmpID: EmpID,
      RealSignRoleID: RoleID,
      SignDate: doFormatDate(today)
    }
    this.GetApiDataServiceService.getWebApiData_GetFlowSignShiftRote(GetFlowSignAbsGetApi)
      .pipe(takeWhile(() => this.api_subscribe))
      .subscribe(
        (GetFlowSignShiftRoteApiData: GetFlowSignShiftRoteApiDataClass[]) => {
          this.changeFlowSigns = []
          if (GetFlowSignShiftRoteApiData) {

            for (let dd of GetFlowSignShiftRoteApiData) {

              this.changeFlowSigns.push({
                uiProcessFlowID: void_completionTenNum(dd.ProcessFlowID),
                ProcessFlowID: dd.ProcessFlowID.toString(),
                FlowTreeID: dd.FlowTreeID,
                FlowNodeID: dd.FlowNodeID,
                ProcessApParmAuto: dd.ProcessApParmAuto.toString(),
                EmpID1: dd.EmpID1,
                EmpCode1: dd.EmpCode1,
                EmpNameC1: dd.EmpNameC1,
                EmpID2: dd.EmpID2,
                EmpCode2: dd.EmpCode2,
                EmpNameC2: dd.EmpNameC2,
                isApproved: dd.isApproved,
                isSendback: dd.isSendback,
                isPutForward: dd.isPutForward,
                Note: null,

                YearAndDate: calYearindate(dd.dateArray),
                dateArray: dd.dateArray,
                isDR: dd.isDR,
                isRR: dd.isRR,
                isRZ: dd.isRZ,
                numberOfVaData: dd.numberOfVaData.toString(),

                WriteEmpCode: dd.WriteEmpCode.toString(),
                WriteEmpNameC: dd.WriteEmpNameC.toString(),
                checkProxy: dd.checkProxy
              })
            }
          }
          this.changeFlowSigns.sort((a: any, b: any) => {
            return b.ProcessFlowID - a.ProcessFlowID;
          });

          this.changeCount = this.changeFlowSigns.length.toString()
          this.LoadingPage.hide()
        })
  }
  // GetFlowData_va(EmpID: string, RoleID, getReviewDatas: AllformReview[]) {
  //   // 請假單
  //   if (this.getReviewData.length > 0) {
  //     this.LoadingPage.show()

  //     from(getReviewDatas).pipe(
  //       map(
  //         (x: any) => {
  //           var searchFlowSignForm = []
  //           if (x.EmpCode == EmpID && x.RoleID == RoleID) {
  //             for (let FlowSignForm of x.FlowSignForm) {
  //               if (FlowSignForm.FormCode == 'Abs' && FlowSignForm.FlowSign.length > 0) {
  //                 this.vaCount = FlowSignForm.Count
  //                 // this.ReviewformServiceService.changeReview('vaTab', this.ReviewformServiceService.showReviewMan)
  //                 for (let FlowSign of FlowSignForm.FlowSign) {
  //                   searchFlowSignForm.push(FlowSign)
  //                 }
  //               }
  //             }

  //           }
  //           return searchFlowSignForm
  //         }
  //       ),
  //       mergeMap((o: any) => from(o)),
  //       mergeMap(
  //         (y: any) => this.GetApiDataServiceService.getWebApiData_GetAbsFlowAppsByProcessFlowID(y.ProcessFlowID, true)
  //           .pipe(
  //             map((t: any) => {
  //               return { FlowSignData: y, FlowDetail: t }
  //             })
  //           )
  //       ),
  //       // mergeMap((q: any) => this.GetApiDataServiceService.getWebApiData_GetHoliDayByForm().pipe(
  //       //   map((u: any) => {
  //       //     return { FlowSignData: q.FlowSignData, FlowDetail: q.FlowDetail, HolidayData: u }
  //       //   })
  //       // )),
  //       toArray()

  //     ).subscribe(
  //       (data: any) => {
  //         // console.log(data)
  //         this.vaFlowSigns = []

  //         // var foundGetBaseInfoDetail = GetBaseInfoDetail.find(function (element) {
  //         //   return element.PosType == 'M'
  //         // });
  //         for (let vaSignData of data) {
  //           var allDay = 0
  //           var allHour = 0
  //           var allMinute = 0
  //           var ischeckProxy: boolean = false
  //           if (vaSignData.FlowSignData.EmpCode != vaSignData.FlowDetail.FlowApps[0].EmpCode) {
  //             ischeckProxy = true
  //           }

  //           //計算日時分
  //           allDay = vaSignData.FlowDetail.UseDayHourMinute.Day
  //           allHour = vaSignData.FlowDetail.UseDayHourMinute.Hour
  //           allMinute = vaSignData.FlowDetail.UseDayHourMinute.Minute

  //           vaSignData.FlowDetail.FlowApps.sort((a: any, b: any) => {
  //             let left = Number(new Date(a));
  //             let right = Number(new Date(b));
  //             return left - right;
  //           });

  //           var mapHolidayName: Map<any, any> = new Map()
  //           for (let aa of vaSignData.FlowDetail.FlowApps) {
  //             mapHolidayName.set(aa.HoliDayNameC, aa.HoliDayNameC)
  //           }
  //           var showHolidayName = []
  //           mapHolidayName.forEach((qq: any) => {
  //             showHolidayName.push(qq)
  //           })

  //           this.vaFlowSigns.push({
  //             uiProcessFlowID: void_completionTenNum(vaSignData.FlowSignData.ProcessFlowID),
  //             uiHolidayName: showHolidayName,
  //             ProcessFlowID: vaSignData.FlowSignData.ProcessFlowID,
  //             FlowTreeID: vaSignData.FlowSignData.FlowTreeID,
  //             FlowNodeID: vaSignData.FlowSignData.FlowNodeID,
  //             ProcessApParmAuto: vaSignData.FlowSignData.ProcessApParmAuto,
  //             EmpCode: vaSignData.FlowDetail.FlowApps[0].EmpCode, //申請人
  //             EmpNameC: vaSignData.FlowDetail.FlowApps[0].EmpNameC,
  //             EmpNameE: vaSignData.FlowDetail.FlowApps[0].EmpNameC,
  //             isApproved: vaSignData.FlowSignData.isApproved,
  //             isSendback: vaSignData.FlowSignData.isSendback,
  //             isPutForward: vaSignData.FlowSignData.isPutForward,

  //             checkProxy: ischeckProxy, //是否為代填表單
  //             WriteEmpCode: vaSignData.FlowSignData.EmpCode, //填寫人
  //             WriteEmpNameC: vaSignData.FlowSignData.EmpNameC, //填寫人

  //             Appointment: vaSignData.FlowDetail.FlowApps[0].Appointment,//是否為預排假單

  //             DateB: formatDateTime(vaSignData.FlowDetail.FlowApps[0].DateTimeB).getDate,
  //             DateE: formatDateTime(vaSignData.FlowDetail.FlowApps[vaSignData.FlowDetail.FlowApps.length - 1].DateTimeE).getDate,
  //             TimeB: getapi_formatTimetoString(formatDateTime(vaSignData.FlowDetail.FlowApps[0].DateTimeB).getTime),
  //             TimeE: getapi_formatTimetoString(formatDateTime(vaSignData.FlowDetail.FlowApps[vaSignData.FlowDetail.FlowApps.length - 1].DateTimeE).getTime),
  //             numberOfVaData: vaSignData.FlowDetail.FlowApps.length,

  //             day: allDay.toString(),
  //             hour: allHour.toString(),
  //             minute: allMinute.toString()
  //           })
  //         }

  //         this.vaFlowSigns.sort((small: any, large: any) => {
  //           var small_DateTimeB = Number(new Date(small.DateB + ' ' + small.TimeB))
  //           var large_DateTimeB = Number(new Date(large.DateB + ' ' + large.TimeB))
  //           return small_DateTimeB - large_DateTimeB;
  //         });

  //         this.vaCount = this.vaFlowSigns.length.toString()

  //         this.LoadingPage.hide()

  //       }, error => {
  //         this.LoadingPage.hide()
  //       }
  //     )
  //   } else {
  //   }

  // }
  // GetFlowData_del(EmpID: string, RoleID, getReviewDatas: AllformReview[]) {
  //   //銷假單
  //   if (this.getReviewData.length > 0) {
  //     this.LoadingPage.show()

  //     from(getReviewDatas).pipe(
  //       map(
  //         (x: any) => {
  //           var searchFlowSignForm = []
  //           if (x.EmpCode == EmpID && x.RoleID == RoleID) {
  //             for (let FlowSignForm of x.FlowSignForm) {
  //               if (FlowSignForm.FormCode == 'Absc' && FlowSignForm.FlowSign.length > 0) {
  //                 this.delCount = FlowSignForm.Count
  //                 // this.ReviewformServiceService.changeReview('delTab', this.ReviewformServiceService.showReviewMan)
  //                 for (let FlowSign of FlowSignForm.FlowSign) {
  //                   searchFlowSignForm.push(FlowSign)
  //                 }
  //               }
  //             }

  //           }
  //           return searchFlowSignForm
  //         }
  //       ),
  //       mergeMap((o: any) => from(o)),
  //       mergeMap(
  //         (y: any) => this.GetApiDataServiceService.getWebApiData_GetAbscFlowAppsByProcessFlowID(y.ProcessFlowID)
  //           .pipe(
  //             map((t: any) => {
  //               return { FlowSignData: y, FlowDetail: t }
  //             })
  //           )
  //       ),
  //       toArray()

  //     ).subscribe(
  //       (data: any) => {
  //         // console.log(data)
  //         this.delFlowSigns = []


  //         for (let delSignData of data) {

  //           var allDay = 0
  //           var allHour = 0
  //           var allMinute = 0
  //           var ischeckProxy: boolean = false

  //           var dateArray: dateArrayClass[] = []
  //           var YearAndDateArray = []

  //           if (delSignData.FlowSignData.EmpCode != delSignData.FlowDetail.FlowAppsExtend[0].EmpCode) {
  //             ischeckProxy = true
  //           }

  //           for (let delFlowDetail of delSignData.FlowDetail.FlowAppsExtend) {
  //             var oneDate = { DateB: delFlowDetail.DateTimeB, DateE: delFlowDetail.DateTimeE }
  //             var oneYearAndDate = formatDateTime(delFlowDetail.DateB).getDate
  //             dateArray.push(oneDate)
  //             YearAndDateArray.push(oneYearAndDate)
  //           }
  //           //計算日時分

  //           allDay = delSignData.FlowDetail.UseDayHourMinute.Day
  //           allHour = delSignData.FlowDetail.UseDayHourMinute.Hour
  //           allMinute = delSignData.FlowDetail.UseDayHourMinute.Minute

  //           // delSignData.FlowDetail.sort((a: any, b: any) => {
  //           //   let left = Number(new Date(a));
  //           //   let right = Number(new Date(b));
  //           //   return left - right;
  //           // });

  //           var mapHolidayName: Map<any, any> = new Map()
  //           for (let aa of delSignData.FlowDetail.FlowAppsExtend) {
  //             mapHolidayName.set(aa.HoliDayNameC, aa.HoliDayNameC)
  //           }
  //           var showHolidayName = []
  //           mapHolidayName.forEach((qq: any) => {
  //             showHolidayName.push(qq)
  //           })

  //           this.delFlowSigns.push({
  //             uiProcessFlowID: void_completionTenNum(delSignData.FlowSignData.ProcessFlowID),
  //             uiHolidayName: showHolidayName,
  //             ProcessFlowID: delSignData.FlowSignData.ProcessFlowID,
  //             FlowTreeID: delSignData.FlowSignData.FlowTreeID,
  //             FlowNodeID: delSignData.FlowSignData.FlowNodeID,
  //             ProcessApParmAuto: delSignData.FlowSignData.ProcessApParmAuto,
  //             EmpCode: delSignData.FlowDetail.FlowAppsExtend[0].EmpCode,//申請人
  //             EmpNameC: delSignData.FlowDetail.FlowAppsExtend[0].EmpNameC,//申請人
  //             EmpNameE: delSignData.FlowDetail.FlowAppsExtend[0].EmpNameC,//申請人
  //             isApproved: delSignData.FlowSignData.isApproved,
  //             isSendback: delSignData.FlowSignData.isSendback,
  //             isPutForward: delSignData.FlowSignData.isPutForward,

  //             WriteEmpCode: delSignData.FlowSignData.EmpCode, //填寫人
  //             WriteEmpNameC: delSignData.FlowSignData.EmpNameC, //填寫人

  //             checkProxy: ischeckProxy,
  //             YearAndDate: calYearindate(YearAndDateArray),
  //             dateArray: dateArray,
  //             Note: delSignData.FlowDetail.FlowAppsExtend[0].Note,
  //             day: allDay.toString(),
  //             hour: allHour.toString(),
  //             minute: allMinute.toString(),
  //             numberOfVaData: delSignData.FlowDetail.FlowAppsExtend.length
  //           })
  //         }

  //         this.delFlowSigns.sort((a: any, b: any) => {
  //           return b.ProcessFlowID - a.ProcessFlowID;
  //         });

  //         this.delCount = this.delFlowSigns.length.toString()
  //         this.LoadingPage.hide()
  //       }, error => {
  //         this.LoadingPage.hide()
  //       }
  //     )
  //   } else {

  //   }
  // }
  // GetFlowData_forget(EmpID: string, RoleID, getReviewDatas: AllformReview[]) {
  //   //考勤異常簽認單

  //   if (this.getReviewData.length > 0) {
  //     this.LoadingPage.show()
  //     from(getReviewDatas).pipe(
  //       map(
  //         (x: any) => {
  //           var searchFlowSignForm = []
  //           if (x.EmpCode == EmpID && x.RoleID == RoleID) {
  //             for (let FlowSignForm of x.FlowSignForm) {
  //               if (FlowSignForm.FormCode == 'Card' && FlowSignForm.FlowSign.length > 0) {
  //                 this.forgetCount = FlowSignForm.Count
  //                 // this.ReviewformServiceService.changeReview('forgetTab', this.ReviewformServiceService.showReviewMan)
  //                 for (let FlowSign of FlowSignForm.FlowSign) {
  //                   searchFlowSignForm.push(FlowSign)
  //                 }
  //               }
  //             }

  //           }
  //           return searchFlowSignForm
  //         }
  //       ),
  //       mergeMap((o: any) => from(o)),
  //       mergeMap(
  //         (y: any) => this.GetApiDataServiceService.getWebApiData_GetCardFlowAppsByProcessFlowID(y.ProcessFlowID, true)
  //           .pipe(
  //             map((t: any) => {
  //               var GetAttend: GetAttendClass = {

  //                 DateB: formatDateTime(t[0].Date).getDate.toString(),
  //                 DateE: formatDateTime(t[0].Date).getDate.toString(),
  //                 ListEmpID: [t[0].EmpCode],
  //                 ListRoteID: null
  //               }
  //               return { FlowSignData: y, FlowDetail: t, GetAttendApi: GetAttend }
  //             })
  //           )
  //       ), mergeMap((q: any) => this.GetApiDataServiceService.getWebApiData_GetAttend(q.GetAttendApi).pipe(
  //         map((u: any) => {
  //           return { FlowSignData: q.FlowSignData, FlowDetail: q.FlowDetail, GetAttend: u[0] }
  //         })
  //       ))
  //       , toArray()

  //     ).subscribe(
  //       (data: any) => {
  //         // console.log(data)
  //         this.forgetFlowSigns = []
  //         for (let forgetSignData of data) {

  //           var _ActualRote_calCrossDay: boolean = false
  //           var _AttendCard_calCrossDay: boolean = false
  //           var _WriteRote_calCrossDay: boolean = false
  //           if (forgetSignData.GetAttend) {
  //             _ActualRote_calCrossDay = void_crossDay(forgetSignData.GetAttend.ActualRote.OffTime).isCrossDay
  //             _AttendCard_calCrossDay = void_crossDay(forgetSignData.FlowDetail[0].TimeE).isCrossDay
  //             _WriteRote_calCrossDay = void_crossDay(formatDateTime(forgetSignData.FlowDetail[0].DateTimeE).getTime).isCrossDay

  //             var _RoteTimeE = void_crossDay(forgetSignData.GetAttend.ActualRote.OffTime).EndTime
  //             var _writeTimeE = void_crossDay(formatDateTime(forgetSignData.FlowDetail[0].DateTimeE).getTime).EndTime
  //             var _cardTimeE = void_crossDay(forgetSignData.FlowDetail[0].TimeE).EndTime
  //             var _RoteCode = forgetSignData.GetAttend.ActualRote.RoteNameC
  //             var _RoteTimeB = forgetSignData.GetAttend.ActualRote.OnTime ? getapi_formatTimetoString(forgetSignData.GetAttend.ActualRote.OnTime) : null
  //           }

  //           var checkProxy = false //是否為代填表單
  //           if (forgetSignData.FlowDetail[0].EmpID != forgetSignData.FlowSignData.EmpCode) {
  //             checkProxy = true
  //           }
  //           var ExceptionalNameArray = []
  //           ExceptionalNameArray = forgetSignData.FlowDetail[0].ExceptionalName.split(',')
  //           var _isForgetCard: boolean = false
  //           var _isEarlyMins: boolean = false
  //           var _isLateMins: boolean = false
  //           for (let e of ExceptionalNameArray) {
  //             if (e == '未刷卡') {
  //               _isForgetCard = true
  //             } else if (e == '早退') {
  //               _isEarlyMins = true
  //             } else if (e == '遲到') {
  //               _isLateMins = true
  //             }
  //           }
  //           this.forgetFlowSigns.push({
  //             uiProcessFlowID: void_completionTenNum(forgetSignData.FlowSignData.ProcessFlowID),
  //             ProcessFlowID: forgetSignData.FlowSignData.ProcessFlowID,
  //             FlowTreeID: forgetSignData.FlowSignData.FlowTreeID,
  //             FlowNodeID: forgetSignData.FlowSignData.FlowNodeID,
  //             ProcessApParmAuto: forgetSignData.FlowSignData.ProcessApParmAuto,
  //             EmpCode: forgetSignData.FlowDetail[0].EmpCode,
  //             EmpNameC: forgetSignData.FlowDetail[0].EmpNameC,
  //             EmpNameE: forgetSignData.FlowDetail[0].EmpNameE,
  //             isApproved: forgetSignData.FlowSignData.isApproved,
  //             isSendback: forgetSignData.FlowSignData.isSendback,
  //             isPutForward: forgetSignData.FlowSignData.isPutForward,
  //             isForgetCard: _isForgetCard,
  //             isEarlyMins: _isEarlyMins,
  //             isLateMins: _isLateMins,

  //             checkProxy: checkProxy,
  //             WriteEmpCode: forgetSignData.FlowSignData.EmpCode,
  //             WriteEmpNameC: forgetSignData.FlowSignData.EmpNameC,

  //             Date: forgetSignData.FlowDetail[0].Date ? formatDateTime(forgetSignData.FlowDetail[0].Date).getDate.toString() : null,
  //             RoteCode: _RoteCode,
  //             RoteTimeB: _RoteTimeB,
  //             RoteTimeE: getapi_formatTimetoString(_RoteTimeE),

  //             writeDateB: forgetSignData.FlowDetail[0].DateTimeB ? formatDateTime(forgetSignData.FlowDetail[0].DateTimeB).getDate.toString() : null,
  //             writeTimeB: forgetSignData.FlowDetail[0].DateTimeB ? getapi_formatTimetoString(formatDateTime(forgetSignData.FlowDetail[0].DateTimeB).getTime.toString()) : null,
  //             writeDateE: forgetSignData.FlowDetail[0].DateTimeE ? formatDateTime(forgetSignData.FlowDetail[0].DateTimeE).getDate.toString() : null,
  //             writeTimeE: getapi_formatTimetoString(_writeTimeE),
  //             cardTimeB: forgetSignData.FlowDetail[0].TimeB ? getapi_formatTimetoString(forgetSignData.FlowDetail[0].TimeB) : null,
  //             cardTimeE: getapi_formatTimetoString(_cardTimeE),
  //             CauseID1: forgetSignData.FlowDetail[0].CauseID1,
  //             CauseName1: forgetSignData.FlowDetail[0].CauseName1,
  //             Note: forgetSignData.FlowDetail[0].Note,

  //             ActualRote_calCrossDay: _ActualRote_calCrossDay,
  //             AttendCard_calCrossDay: _AttendCard_calCrossDay,
  //             WriteRote_calCrossDay: _WriteRote_calCrossDay
  //           })
  //         }

  //         this.forgetFlowSigns.sort((a: any, b: any) => {
  //           return b.ProcessFlowID - a.ProcessFlowID;
  //         });

  //         this.forgetCount = this.forgetFlowSigns.length.toString()
  //         this.LoadingPage.hide()
  //       }, error => {
  //         this.LoadingPage.hide()
  //       }
  //     )
  //   } else {
  //   }
  // }
  // GetFlowData_change(EmpID: string, RoleID, getReviewDatas: AllformReview[]) {
  //   //調班單
  //   if (this.getReviewData.length > 0) {
  //     this.LoadingPage.show()
  //     from(getReviewDatas).pipe(
  //       map(
  //         (x: any) => {
  //           var searchFlowSignForm = []
  //           if (x.EmpCode == EmpID && x.RoleID == RoleID) {
  //             for (let FlowSignForm of x.FlowSignForm) {
  //               if (FlowSignForm.FormCode == 'ShiftRote' && FlowSignForm.FlowSign.length > 0) {
  //                 this.changeCount = FlowSignForm.Count
  //                 // this.ReviewformServiceService.changeReview('changeTab', this.ReviewformServiceService.showReviewMan)
  //                 for (let FlowSign of FlowSignForm.FlowSign) {
  //                   searchFlowSignForm.push(FlowSign)
  //                 }
  //               }
  //             }

  //           }
  //           return searchFlowSignForm
  //         }
  //       ),
  //       mergeMap((o: any) => from(o)),
  //       mergeMap(
  //         (y: any) => this.GetApiDataServiceService.getWebApiData_GetShiftFlowAppsByProcessFlowID(y.ProcessFlowID)
  //           .pipe(
  //             map((t: any) => {
  //               return { FlowSignData: y, FlowDetail: t }
  //             })
  //           )
  //       )
  //       , toArray()

  //     ).subscribe(
  //       (data: any) => {
  //         // console.log(data)
  //         this.changeFlowSigns = []
  //         for (let changeSignData of data) {

  //           var YearAndDateArray = []
  //           var RR: boolean = false
  //           var DR: boolean = false
  //           var RZ: boolean = false
  //           for (let changeFlowDetail of changeSignData.FlowDetail) {
  //             for (let ShiftRoteFlowAppsDetail of changeFlowDetail.ShiftRoteFlowAppsDetail) {
  //               var ShiftRoteDate = formatDateTime(ShiftRoteFlowAppsDetail.ShiftRoteDate).getDate.toString()
  //               YearAndDateArray.push(ShiftRoteDate)
  //             }
  //           }

  //           if (changeSignData.FlowDetail[0].ShiftRoteType == 'RR') {
  //             RR = true
  //           } else if (changeSignData.FlowDetail[0].ShiftRoteType == 'DR') {
  //             DR = true
  //           } else if (changeSignData.FlowDetail[0].ShiftRoteType == 'RZ') {
  //             RZ = true
  //           }
  //           var checkProxy = false //是否為代填表單
  //           if (changeSignData.FlowDetail[0].EmpID1 != changeSignData.FlowSignData.EmpCode) {
  //             checkProxy = true
  //           }

  //           this.changeFlowSigns.push({
  //             uiProcessFlowID: void_completionTenNum(changeSignData.FlowSignData.ProcessFlowID),
  //             ProcessFlowID: changeSignData.FlowSignData.ProcessFlowID,
  //             FlowTreeID: changeSignData.FlowSignData.FlowTreeID,
  //             FlowNodeID: changeSignData.FlowSignData.FlowNodeID,
  //             ProcessApParmAuto: changeSignData.FlowSignData.ProcessApParmAuto,
  //             EmpID1: changeSignData.FlowDetail[0].EmpID1,
  //             EmpCode1: changeSignData.FlowDetail[0].EmpCode1,
  //             EmpNameC1: changeSignData.FlowDetail[0].EmpNameC1,
  //             EmpID2: changeSignData.FlowDetail[0].EmpID2,
  //             EmpCode2: changeSignData.FlowDetail[0].EmpCode2,
  //             EmpNameC2: changeSignData.FlowDetail[0].EmpNameC2,
  //             isApproved: changeSignData.FlowSignData.isApproved,
  //             isSendback: changeSignData.FlowSignData.isSendback,
  //             isPutForward: changeSignData.FlowSignData.isPutForward,
  //             Note: changeSignData.FlowDetail[0].Note,

  //             YearAndDate: calYearindate(YearAndDateArray),
  //             dateArray: YearAndDateArray,
  //             isDR: DR,
  //             isRR: RR,
  //             isRZ: RZ,
  //             numberOfVaData: YearAndDateArray.length.toString(),

  //             WriteEmpCode: changeSignData.FlowSignData.EmpCode,
  //             WriteEmpNameC: changeSignData.FlowSignData.EmpNameC,
  //             checkProxy: checkProxy
  //           })
  //         }
  //         this.changeFlowSigns.sort((a: any, b: any) => {
  //           return b.ProcessFlowID - a.ProcessFlowID;
  //         });

  //         this.changeCount = this.changeFlowSigns.length.toString()
  //         this.LoadingPage.hide()
  //       }, error => {
  //         this.LoadingPage.hide()
  //       }
  //     )
  //   } else {
  //   }
  // }

  AllReview = []
  AllCanReviewFlow = []
  Approved_All_Check(FlowArray: Array<any>, ReloadTabData) {
    this.ReloadTabData = ReloadTabData;
    var CanSendFlowID = []
    for (let aa of FlowArray) {
      if (aa.isApproved) {
        CanSendFlowID.push(aa)
      }
    }
    this.AllReview = FlowArray
    this.AllCanReviewFlow = CanSendFlowID
    if (this.AllCanReviewFlow.length > 0) {
      $("#AllAproveDialog").modal('show')
    } else {
      alert('目前無可批核表單')
    }
  }
  Sendback_All_Check(FlowArray: Array<any>, ReloadTabData) {
    this.ReloadTabData = ReloadTabData;
    var CanSendFlowID = []
    for (let aa of FlowArray) {
      if (aa.isSendback) {
        CanSendFlowID.push(aa)
      }
    }
    this.AllReview = FlowArray
    this.AllCanReviewFlow = CanSendFlowID
    if (this.AllCanReviewFlow.length > 0) {
      $("#AllSendBackDialog").modal('show')
    } else {
      alert('目前無可批核表單')
    }
  }

  sendReviewLength: string = ''
  realReviewLength: string = ''

  Approved_All_Click() {
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
          var SendFlowNodeFinish: FlowNodeFinishClass[] = []
          for (let oneCanReview of this.AllCanReviewFlow) {
            SendFlowNodeFinish.push({
              ProcessFlowID: parseInt(oneCanReview.ProcessFlowID),
              ProcessApParmAuto: parseInt(oneCanReview.ProcessApParmAuto),
              State: "3",
              FlowTreeID: oneCanReview.FlowTreeID,
              FlowNodeID: oneCanReview.FlowNodeID,
              Note: this.signText,
              NodeName: "核准",
              ManInfo: y[0],
              FlowDynamic: {
                FlowNode: oneCanReview.FlowNodeID,
                RoleID: this.ReviewformServiceService.showReviewMan.RoleID,
                EmpID: this.ReviewformServiceService.showReviewMan.EmpCode,
                DeptID: "",
                PosID: ""
              },
              CheckEmpID: this.ReviewformServiceService.showReviewMan.EmpCode
            })
          }
          // console.log(FlowNodeFinish)
          this.LoadingPage.show()
          this.GetApiDataServiceService.getWebApiData_ListFlowNodeFinish(SendFlowNodeFinish)
            .pipe(takeWhile(() => this.api_subscribe))
            .subscribe(
              (x: any) => {
                this.sendReviewLength = SendFlowNodeFinish.length.toString()
                this.realReviewLength = x.toString()
                $('#All_Approveddialog_sussesdialog').modal('show');
                document.getElementById("bt_Sus_AllApr").focus();
                this.ReloadData()
                this.LoadingPage.hide()
              }
            )
        }
      )
  }
  Sendback_All_Click() {

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

          var SendFlowNodeFinish: FlowNodeFinishClass[] = []
          for (let oneCanReview of this.AllCanReviewFlow) {
            SendFlowNodeFinish.push({
              ProcessFlowID: parseInt(oneCanReview.ProcessFlowID),
              ProcessApParmAuto: parseInt(oneCanReview.ProcessApParmAuto),
              State: "2",
              FlowTreeID: oneCanReview.FlowTreeID,
              FlowNodeID: oneCanReview.FlowNodeID,
              Note: this.signText,
              NodeName: "重擬",
              ManInfo: y[0],
              FlowDynamic: {
                FlowNode: oneCanReview.FlowNodeID,
                RoleID: this.ReviewformServiceService.showReviewMan.RoleID,
                EmpID: this.ReviewformServiceService.showReviewMan.EmpCode,
                DeptID: "",
                PosID: ""
              },
              CheckEmpID: this.ReviewformServiceService.showReviewMan.EmpCode
            })
          }
          // console.log(FlowNodeFinish)
          this.LoadingPage.show()
          this.GetApiDataServiceService.getWebApiData_ListFlowNodeFinish(SendFlowNodeFinish)
            .pipe(takeWhile(() => this.api_subscribe))
            .subscribe(
              (x: FlowNodeFinishGetDataClass) => {
                this.LoadingPage.hide()
                this.sendReviewLength = SendFlowNodeFinish.length.toString()
                this.realReviewLength = x.toString()
                $('#All_Sendbackdialog_sussesdialog').modal('show');
                document.getElementById("bt_Sus_AllSbk").focus();
                this.ReloadData()
              }
            )
        }
      )
  }

}














