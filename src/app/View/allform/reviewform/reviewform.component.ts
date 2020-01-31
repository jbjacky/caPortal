import { Component, OnInit, OnDestroy, AfterViewInit, ViewChild } from '@angular/core';
import { GetApiDataServiceService } from 'src/app/Service/get-api-data-service.service';
import { pagechange } from 'src/app/Models/pagechange';
import { AllformReview, FlowSign, vaFlowSign, forgetFlowSign, delFlowSign, dateArrayClass, changeFlowSign, AttendUnusualFlowSign, CardPatchFlowSign } from 'src/app/Models/AllformReview';
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
import { GetFlowSignAbsGetApiClass, GetFlowSignAbsDataGetApiClass } from 'src/app/Models/PostData_API_Class/GetFlowSignAbsGetApiClass';
import { GetFlowSignAbsApiDataClass } from 'src/app/Models/GetFlowSignAbsApiDataClass';
import { GetFlowSignAbscApiDataClass } from 'src/app/Models/GetFlowSignAbscApiDataClass';
import { GetFlowSignCardApiDataClass } from 'src/app/Models/GetFlowSignCardApiDataClass';
import { GetFlowSignShiftRoteApiDataClass } from 'src/app/Models/GetFlowSignShiftRoteApiDataClass';
import { MatSnackBar, MatPaginator } from '@angular/material';
import { SussesApproveSnackComponent } from '../../shareComponent/snackbar/susses-approve-snack/susses-approve-snack.component';
import { SnackSetting } from '../../shareComponent/snackbar/SnackSetting';
import { ErrorApproveSnackComponent } from '../../shareComponent/snackbar/error-approve-snack/error-approve-snack.component';
import { SussesPutForwardSnackComponent } from '../../shareComponent/snackbar/susses-put-forward-snack/susses-put-forward-snack.component';
import { ErrorPutForwardSnackComponent } from '../../shareComponent/snackbar/error-put-forward-snack/error-put-forward-snack.component';
import { SussesSendbackSnackComponent } from '../../shareComponent/snackbar/susses-sendback-snack/susses-sendback-snack.component';
import { ErrorSendbackSnackComponent } from '../../shareComponent/snackbar/error-sendback-snack/error-sendback-snack.component';
import { GetFlowSignAttendUnusualApiDataClass } from 'src/app/Models/GetFlowSignAttendUnusualApiDataClass';
import { GetFlowSignAbsDataApiDataClass } from 'src/app/Models/GetFlowSignAbsDataApiDataClass';
declare let $: any; //use jquery

@Component({
  selector: 'app-reviewform',
  templateUrl: './reviewform.component.html',
  styleUrls: ['./reviewform.component.css']
})

export class ReviewformComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild("vaPaginator") vaPaginator: MatPaginator;
  @ViewChild("delPaginator") delPaginator: MatPaginator;
  @ViewChild("changePaginator") changePaginator: MatPaginator;
  @ViewChild("forgetPaginator") forgetPaginator: MatPaginator;
  @ViewChild("AttendUnusualPaginator") AttendUnusualPaginator: MatPaginator;
  @ViewChild("CardPatchPaginator") CardPatchPaginator: MatPaginator;

  ngAfterViewInit(): void {
  }
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
  AttendUnusual_pagechange = new pagechange();
  CardPatch_pagechange = new pagechange();
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
          this.FirstEmpCode = x.EmpCode.toString()
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
  AttendUnusualCount = '0';
  CardPatchCount = '0';

  vaFlowSigns: vaFlowSign[] = [];
  forgetFlowSigns: forgetFlowSign[] = [];
  delFlowSigns: delFlowSign[] = [];
  changeFlowSigns: changeFlowSign[] = [];
  AttendUnusualFlowSigns: AttendUnusualFlowSign[] = [];
  CardPatchFlowSigns: CardPatchFlowSign[] = []

  chooseEmpIDReviewForm(EmpID, RoleID, getReviewDatas: AllformReview[]) {
    //取得明細
    this.vaFlowSigns = [];
    this.forgetFlowSigns = [];
    this.delFlowSigns = [];
    this.changeFlowSigns = [];
    this.AttendUnusualFlowSigns = []

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
            //忘刷單
            this.forgetCount = FlowSignForm.Count
          } else if (FlowSignForm.FormCode == 'ShiftRote') {
            //調班單
            this.changeCount = FlowSignForm.Count
          } else if (FlowSignForm.FormCode == 'AttendUnusual') {
            //考勤異常確認
            this.AttendUnusualCount = FlowSignForm.Count
          } else if (FlowSignForm.FormCode == 'CardPatch') {
            this.CardPatchCount = FlowSignForm.Count
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
        this.vaTabClick(this.ReviewformServiceService.showReviewMan, false);
      }
      else if (this.ReviewformServiceService.showReviewTab == 'delTab') {
        this.ReviewformServiceService.changeReview('delTab', this.ReviewformServiceService.showReviewMan);
        $('#' + this.ReviewformServiceService.showReviewTab).click();
        this.delTabClick(this.ReviewformServiceService.showReviewMan, false);
      }
      else if (this.ReviewformServiceService.showReviewTab == 'changeTab') {
        this.ReviewformServiceService.changeReview('changeTab', this.ReviewformServiceService.showReviewMan);
        $('#' + this.ReviewformServiceService.showReviewTab).click();
        this.changeTabClick(this.ReviewformServiceService.showReviewMan, false);
      }
      else if (this.ReviewformServiceService.showReviewTab == 'forgetTab') {
        this.ReviewformServiceService.changeReview('forgetTab', this.ReviewformServiceService.showReviewMan);
        $('#' + this.ReviewformServiceService.showReviewTab).click();
        this.forgetTabClick(this.ReviewformServiceService.showReviewMan, false);
      }
      else if (this.ReviewformServiceService.showReviewTab == 'AttendUnusualTab') {
        this.ReviewformServiceService.changeReview('AttendUnusualTab', this.ReviewformServiceService.showReviewMan);
        $('#' + this.ReviewformServiceService.showReviewTab).click();
        this.AttendUnusualTabClick(this.ReviewformServiceService.showReviewMan, false);
      }
      else if (this.ReviewformServiceService.showReviewTab == 'CardPatchTab') {
        this.ReviewformServiceService.changeReview('CardPatchTab', this.ReviewformServiceService.showReviewMan);
        $('#' + this.ReviewformServiceService.showReviewTab).click();
        this.CardPatchTabClick(this.ReviewformServiceService.showReviewMan, false);
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
      this.GetFlowData_va(EmpID, RoleID, 1);
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
    else if (parseInt(this.AttendUnusualCount) > 0) {
      this.ReviewformServiceService.changeReview('AttendUnusualTab', this.ReviewformServiceService.showReviewMan);
      $('#' + this.ReviewformServiceService.showReviewTab).click();
      // this.AttendUnusualTabClick(this.ReviewformServiceService.showReviewMan)
      this.GetFlowData_AttendUnusual(EmpID, RoleID, getReviewDatas);
    }
    else if (parseInt(this.CardPatchCount) > 0) {
      this.ReviewformServiceService.changeReview('CardPatchTab', this.ReviewformServiceService.showReviewMan);
      $('#' + this.ReviewformServiceService.showReviewTab).click();
      // this.CardPatchTabClick(this.ReviewformServiceService.showReviewMan)
      this.GetFlowData_CardPatch(EmpID, RoleID, getReviewDatas);
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
    this.AttendUnusualCount = '0';
    this.CardPatchCount = '0';
    // this.loading = true;
    // this.LoadingPage.show()
    this.getReviewData = []
    this.vaFlowSigns = [];
    this.forgetFlowSigns = [];
    this.changeFlowSigns = [];
    this.delFlowSigns = [];
    this.AttendUnusualFlowSigns = [];
    this.ReviewformServiceService.getReviewData = [];

    var GetFlowSignRole: GetFlowSignRoleClass = {
      "SignEmpID": SignEmpID,
      "SignRoleID": "",
      "RealSignEmpID": "",
      "RealSignRoleID": "",
      "FlowTreeID": "",
      "SignDate": ""
    }
    this.void_GetFlowSignRole(GetFlowSignRole, 'Reload', true)
  }

  changeMan_firstInTab(selectReviewMan: AllformReview) {

    this.isGetFlowSignRole = true;

    this.vaCount = '0';
    this.delCount = '0';
    this.changeCount = '0';
    this.forgetCount = '0';
    this.AttendUnusualCount = '0';
    this.CardPatchCount = '0';
    // this.loading = true;
    this.LoadingPage.show()
    this.isFirstTab = true;
    this.getReviewData = []
    this.vaFlowSigns = [];
    this.forgetFlowSigns = [];
    this.changeFlowSigns = [];
    this.delFlowSigns = [];
    this.AttendUnusualFlowSigns = [];
    this.ReviewformServiceService.getReviewData = [];

    var GetFlowSignRole: GetFlowSignRoleClass = {
      "SignEmpID": this.FirstEmpCode.toString(),
      "SignRoleID": "",
      "RealSignEmpID": selectReviewMan.EmpCode,
      "RealSignRoleID": selectReviewMan.RoleID,
      "FlowTreeID": "",
      "SignDate": ""
    }
    this.void_GetFlowSignRole(GetFlowSignRole, 'Reload', true)
  }

  vaTabClick(selectReviewMan: AllformReview, uiClick: boolean) {
    if (this.FirstEmpCode.length != 0) {

      this.LoadingPage.show()
      var GetFlowSignRole: GetFlowSignRoleClass = {
        "SignEmpID": this.FirstEmpCode.toString(),
        "SignRoleID": "",
        "RealSignEmpID": selectReviewMan.EmpCode,
        "RealSignRoleID": selectReviewMan.RoleID,
        "FlowTreeID": "81",
        "SignDate": ""
      }
      if (uiClick) {
        this.ReviewformServiceService.va_pagechange = new pagechange();
      }
      this.void_GetFlowSignRole(GetFlowSignRole, 'vaTabClick', uiClick)
      window.scroll(0, 0)
    }
  }
  forgetTabClick(selectReviewMan: AllformReview, uiClick: boolean) {
    if (this.FirstEmpCode.length != 0) {

      this.LoadingPage.show()
      var GetFlowSignRole: GetFlowSignRoleClass = {
        "SignEmpID": this.FirstEmpCode.toString(),
        "SignRoleID": "",
        "RealSignEmpID": selectReviewMan.EmpCode,
        "RealSignRoleID": selectReviewMan.RoleID,
        "FlowTreeID": "60",
        "SignDate": ""
      }
      if (uiClick) {
        this.ReviewformServiceService.forget_pagechange = new pagechange();
      }
      this.void_GetFlowSignRole(GetFlowSignRole, 'forgetTabClick', uiClick)
      window.scroll(0, 0)
    }
  }
  AttendUnusualTabClick(selectReviewMan: AllformReview, uiClick: boolean) {
    if (this.FirstEmpCode.length != 0) {

      this.LoadingPage.show()
      var GetFlowSignRole: GetFlowSignRoleClass = {
        "SignEmpID": this.FirstEmpCode.toString(),
        "SignRoleID": "",
        "RealSignEmpID": selectReviewMan.EmpCode,
        "RealSignRoleID": selectReviewMan.RoleID,
        "FlowTreeID": "83",
        "SignDate": ""
      }
      if (uiClick) {
        this.ReviewformServiceService.AttendUnusual_pagechange = new pagechange();
      }
      this.void_GetFlowSignRole(GetFlowSignRole, 'AttendUnusualTabClick', uiClick)
      window.scroll(0, 0)
    }
  }
  delTabClick(selectReviewMan: AllformReview, uiClick: boolean) {
    if (this.FirstEmpCode.length != 0) {

      this.LoadingPage.show()
      var GetFlowSignRole: GetFlowSignRoleClass = {
        "SignEmpID": this.FirstEmpCode.toString(),
        "SignRoleID": "",
        "RealSignEmpID": selectReviewMan.EmpCode,
        "RealSignRoleID": selectReviewMan.RoleID,
        "FlowTreeID": "17",
        "SignDate": ""
      }
      if (uiClick) {
        this.ReviewformServiceService.del_pagechange = new pagechange();
      }
      this.void_GetFlowSignRole(GetFlowSignRole, 'delTabClick', uiClick)
      window.scroll(0, 0)
    }
  }
  changeTabClick(selectReviewMan: AllformReview, uiClick: boolean) {
    if (this.FirstEmpCode.length != 0) {

      this.LoadingPage.show()
      var GetFlowSignRole: GetFlowSignRoleClass = {
        "SignEmpID": this.FirstEmpCode.toString(),
        "SignRoleID": "",
        "RealSignEmpID": selectReviewMan.EmpCode,
        "RealSignRoleID": selectReviewMan.RoleID,
        "FlowTreeID": "66",
        "SignDate": ""
      }
      if (uiClick) {
        this.ReviewformServiceService.change_pagechange = new pagechange();
      }
      this.void_GetFlowSignRole(GetFlowSignRole, 'changeTabClick', uiClick)
      window.scroll(0, 0)
    }
  }

  CardPatchTabClick(selectReviewMan: AllformReview, uiClick: boolean) {
    if (this.FirstEmpCode.length != 0) {

      this.LoadingPage.show()
      var GetFlowSignRole: GetFlowSignRoleClass = {
        "SignEmpID": this.FirstEmpCode.toString(),
        "SignRoleID": "",
        "RealSignEmpID": selectReviewMan.EmpCode,
        "RealSignRoleID": selectReviewMan.RoleID,
        "FlowTreeID": "82",
        "SignDate": ""
      }
      if (uiClick) {
        this.ReviewformServiceService.CardPatch_pagechange = new pagechange();
      }
      this.void_GetFlowSignRole(GetFlowSignRole, 'CardPatchTabClick', uiClick)
      window.scroll(0, 0)
    }
  }

  isGetFlowSignRole: boolean = true;

  void_GetFlowSignRole(GetFlowSignRole: GetFlowSignRoleClass, ReloadOrChangeTabString: string, uiClick: boolean) {
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

                if (uiClick) {
                  this.ReviewformServiceService.showPageIndex = 0
                }
                this.GetFlowData_va(this.ReviewformServiceService.showReviewMan.EmpCode, this.ReviewformServiceService.showReviewMan.RoleID, this.ReviewformServiceService.showPageIndex)

              } else if (ReloadOrChangeTabString == 'delTabClick') {

                this.GetFlowData_del(this.ReviewformServiceService.showReviewMan.EmpCode, this.ReviewformServiceService.showReviewMan.RoleID, this.getReviewData)

              } else if (ReloadOrChangeTabString == 'changeTabClick') {

                this.GetFlowData_change(this.ReviewformServiceService.showReviewMan.EmpCode, this.ReviewformServiceService.showReviewMan.RoleID, this.getReviewData)

              } else if (ReloadOrChangeTabString == 'forgetTabClick') {

                this.GetFlowData_forget(this.ReviewformServiceService.showReviewMan.EmpCode, this.ReviewformServiceService.showReviewMan.RoleID, this.getReviewData)
              } else if (ReloadOrChangeTabString == 'AttendUnusualTabClick') {

                this.GetFlowData_AttendUnusual(this.ReviewformServiceService.showReviewMan.EmpCode, this.ReviewformServiceService.showReviewMan.RoleID, this.getReviewData)
              } else if (ReloadOrChangeTabString == 'CardPatchTabClick') {

                this.GetFlowData_CardPatch(this.ReviewformServiceService.showReviewMan.EmpCode, this.ReviewformServiceService.showReviewMan.RoleID, this.getReviewData)
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

    this.ReviewformServiceService.va_pagechange = JSON.parse(JSON.stringify(this.va_pagechange))
    if (this.vaCount == '0') {
      this.ReviewformServiceService.showPageIndex = this.vaPageIndex
    } else {

      this.ReviewformServiceService.showPageIndex = this.vaPageIndex + 1
    }

  }
  vaDetailView(e_vaFlowSign: vaFlowSign, ReloadTabData){
    
    this.vaDetail_click(e_vaFlowSign, ReloadTabData)
    this.router.navigate(["../nav/reviewform/ReviewformDetailVacationComponent"]);
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


    this.ReviewformServiceService.del_pagechange = JSON.parse(JSON.stringify(this.del_pagechange))

  }
  delDetailView(e_delFlowSign: delFlowSign, ReloadTabData) {
    
    this.delDetail_click(e_delFlowSign, ReloadTabData)
    this.router.navigate(["../nav/reviewform/ReviewformDetailDelformComponent"]);
  }
  del_PutForward(e_delFlowSign: delFlowSign, ReloadTabData) {
    this.delDetail_click(e_delFlowSign, ReloadTabData)
    this.showPutForwarddialog = true
    $('#PutForwarddialog').modal('show')
  }
  CardPatchDetailView(e_CardPatchFlowSign: CardPatchFlowSign, ReloadTabData){
    this.CardPatchDetail_click(e_CardPatchFlowSign,ReloadTabData)
    this.router.navigate(['../nav/reviewform/ReviewformDetailCardPatchformComponent']);
  }
  CardPatchDetail_click(e_CardPatchFlowSign: CardPatchFlowSign, ReloadTabData) {
    this.ReloadTabData = ReloadTabData;
    this.signText = '';
    this.ReviewformServiceService.CardPatchFlowSignDetail = e_CardPatchFlowSign
    this.FinallyReviewForm.ProcessFlowID = this.ReviewformServiceService.CardPatchFlowSignDetail.ProcessFlowID
    this.FinallyReviewForm.ProcessApParmAuto = this.ReviewformServiceService.CardPatchFlowSignDetail.ProcessApParmAuto
    this.FinallyReviewForm.FlowTreeID = this.ReviewformServiceService.CardPatchFlowSignDetail.FlowTreeID
    this.FinallyReviewForm.FlowNodeID = this.ReviewformServiceService.CardPatchFlowSignDetail.FlowNodeID

    this.ReviewformServiceService.CardPatch_pagechange = JSON.parse(JSON.stringify(this.CardPatch_pagechange))

  }
  checkCardPatch_Approved(e_forgetFlowSign: forgetFlowSign, ReloadTabData) {
    this.CardPatchDetail_click(e_forgetFlowSign, ReloadTabData)
    $('#Approveddialog').modal('show')
  }
  checkCardPatch_PutForward(e_forgetFlowSign: forgetFlowSign, ReloadTabData) {
    this.CardPatchDetail_click(e_forgetFlowSign, ReloadTabData)
    $('#PutForwarddialog').modal('show')
  }
  forgetDetailView(e_forgetFlowSign: forgetFlowSign, ReloadTabData){
    this.forgetDetail_click(e_forgetFlowSign,ReloadTabData)
    this.router.navigate(['../nav/reviewform/ReviewformDetailForgetformComponent']);
  }
  forgetDetail_click(e_forgetFlowSign: forgetFlowSign, ReloadTabData) {
    this.ReloadTabData = ReloadTabData;
    this.signText = '';
    this.ReviewformServiceService.forgetDetail = e_forgetFlowSign
    this.FinallyReviewForm.ProcessFlowID = this.ReviewformServiceService.forgetDetail.ProcessFlowID
    this.FinallyReviewForm.ProcessApParmAuto = this.ReviewformServiceService.forgetDetail.ProcessApParmAuto
    this.FinallyReviewForm.FlowTreeID = this.ReviewformServiceService.forgetDetail.FlowTreeID
    this.FinallyReviewForm.FlowNodeID = this.ReviewformServiceService.forgetDetail.FlowNodeID

    this.ReviewformServiceService.forget_pagechange = JSON.parse(JSON.stringify(this.forget_pagechange))

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

    this.ReviewformServiceService.change_pagechange = JSON.parse(JSON.stringify(this.change_pagechange))
  }

  change_PutForward(e_changeFlowSign: changeFlowSign, ReloadTabData) {
    this.changeDetail_click(e_changeFlowSign, ReloadTabData)
    this.showPutForwarddialog = true
    $('#PutForwarddialog').modal('show')
  }

  AttendUnusualDetailView(e_AttendUnusualFlowSign: AttendUnusualFlowSign, ReloadTabData){
    this.AttendUnusualDetail_click(e_AttendUnusualFlowSign, ReloadTabData)
    this.router.navigate(['../nav/reviewform/ReviewformDetailAttendUnusualformComponent']);
  }
  AttendUnusualDetail_click(e_AttendUnusualFlowSign: AttendUnusualFlowSign, ReloadTabData) {
    this.ReloadTabData = ReloadTabData;
    this.signText = '';
    this.ReviewformServiceService.AttendUnusualDetail = e_AttendUnusualFlowSign
    this.FinallyReviewForm.ProcessFlowID = this.ReviewformServiceService.AttendUnusualDetail.ProcessFlowID
    this.FinallyReviewForm.ProcessApParmAuto = this.ReviewformServiceService.AttendUnusualDetail.ProcessApParmAuto
    this.FinallyReviewForm.FlowTreeID = this.ReviewformServiceService.AttendUnusualDetail.FlowTreeID
    this.FinallyReviewForm.FlowNodeID = this.ReviewformServiceService.AttendUnusualDetail.FlowNodeID

    this.ReviewformServiceService.AttendUnusual_pagechange = JSON.parse(JSON.stringify(this.AttendUnusual_pagechange))

  }
  checkAttendUnusualText_PutForward(e_AttendUnusualFlowSign: AttendUnusualFlowSign, ReloadTabData) {
    this.AttendUnusualDetail_click(e_AttendUnusualFlowSign, ReloadTabData)
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
      this.vaTabClick(this.ReviewformServiceService.showReviewMan, false);
    } else if (this.ReloadTabData == 'forgetTab') {
      this.forgetFlowSigns = []
      this.forgetTabClick(this.ReviewformServiceService.showReviewMan, false);
    } else if (this.ReloadTabData == 'delTab') {
      this.delFlowSigns = []
      this.delTabClick(this.ReviewformServiceService.showReviewMan, false);
    } else if (this.ReloadTabData == 'changeTab') {
      this.changeFlowSigns = []
      this.changeTabClick(this.ReviewformServiceService.showReviewMan, false);
    } else if (this.ReloadTabData == 'AttendUnusualTab') {
      this.AttendUnusualFlowSigns = []
      this.AttendUnusualTabClick(this.ReviewformServiceService.showReviewMan, false);
    } else if (this.ReloadTabData == 'CardPatchTab') {
      this.CardPatchFlowSigns = []
      this.CardPatchTabClick(this.ReviewformServiceService.showReviewMan, false);
    } else {
      alert('取值錯誤')
    }
  }
  Approved_Click() {
    this.GetApiDataServiceService.getWebApiData_GetManInfo(this.FirstEmpCode.toString())
      .pipe(takeWhile(() => this.api_subscribe))
      .subscribe(
        y => {
          if (this.FirstEmpCode.toString() != this.ReviewformServiceService.showReviewMan.EmpCode) {
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
  Sendback_Click() {

    this.GetApiDataServiceService.getWebApiData_GetManInfo(this.FirstEmpCode.toString())
      .pipe(takeWhile(() => this.api_subscribe))
      .subscribe(
        y => {
          if (this.FirstEmpCode.toString() != this.ReviewformServiceService.showReviewMan.EmpCode) {
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
      this.GetApiDataServiceService.getWebApiData_GetManInfo(this.FirstEmpCode.toString())
        .pipe(takeWhile(() => this.api_subscribe))
        .subscribe(
          y => {

            if (this.FirstEmpCode.toString() != this.ReviewformServiceService.showReviewMan.EmpCode) {
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
  vaAllPageIndex: number = 0
  iptNumPage: number = 1
  iptVaGoPage(page: number) {
    if (page > 0) {
      if (page > this.vaAllPageIndex) {
        alert('查無此頁')
      } else {
        this.GetFlowData_va(this.ReviewformServiceService.showReviewMan.EmpCode, this.ReviewformServiceService.showReviewMan.RoleID, page)
      }
    } else {
      alert('請輸入1以上的數字')
    }
  }
  vaPaginatorChange(event) {
    var goPage = event.pageIndex + 1
    this.GetFlowData_va(this.ReviewformServiceService.showReviewMan.EmpCode, this.ReviewformServiceService.showReviewMan.RoleID, goPage)
    return event
  }
  vaPageIndex = 0
  GetFlowData_va(EmpID: string, RoleID, PageCurrent: number) {
    //請假單
    var today = new Date()
    var GetFlowSignAbsDataGetApi: GetFlowSignAbsDataGetApiClass = {
      SignEmpID: this.FirstEmpCode.toString(),
      SignRoleID: "",
      RealSignEmpID: EmpID,
      RealSignRoleID: RoleID,
      PageCurrent: PageCurrent.toString(),
      PageRows: "5",
      SignDate: doFormatDate(today)
    }
    this.LoadingPage.show()
    this.GetApiDataServiceService.getWebApiData_GetFlowSignAbsData(GetFlowSignAbsDataGetApi)
      .pipe(takeWhile(() => this.api_subscribe))
      .subscribe(
        (GetFlowSignAbsApiData: GetFlowSignAbsDataApiDataClass) => {
          this.vaCount = GetFlowSignAbsApiData.Count.toString()
          if (GetFlowSignAbsApiData.Count > 0) {
            this.vaAllPageIndex = Math.ceil((GetFlowSignAbsApiData.Count / 5))
          }
          this.vaFlowSigns = []
          if (GetFlowSignAbsApiData.ListFlowSignAbs) {
            for (let aa of GetFlowSignAbsApiData.ListFlowSignAbs) {

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
                WriteEmpCode: aa.WriteEmpCode, //填寫人
                WriteEmpNameC: aa.WriteEmpNameC, //填寫人

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
          // this.vaFlowSigns.sort((small: any, large: any) => {
          //   var small_DateTimeB = Number(new Date(small.DateB + ' ' + small.TimeB))
          //   var large_DateTimeB = Number(new Date(large.DateB + ' ' + large.TimeB))
          //   return small_DateTimeB - large_DateTimeB;
          // });

          this.goBackPage(this.vaPaginator, this.va_pagechange, this.ReviewformServiceService.va_pagechange, this.vaFlowSigns.length)
          if (PageCurrent > 0) {
            this.vaPageIndex = PageCurrent - 1
          }else{
            this.vaPageIndex = PageCurrent
          }
          this.LoadingPage.hide()
        })
  }
  GetFlowData_del(EmpID: string, RoleID, getReviewDatas: AllformReview[]) {
    //銷假單
    var today = new Date()
    var GetFlowSignAbsGetApi: GetFlowSignAbsGetApiClass = {
      SignEmpID: this.FirstEmpCode.toString(),
      SignRoleID: "",
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

                WriteEmpCode: bb.WriteEmpCode, //填寫人
                WriteEmpNameC: bb.WriteEmpNameC, //填寫人

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
          this.goBackPage(this.delPaginator, this.del_pagechange, this.ReviewformServiceService.del_pagechange, this.delFlowSigns.length)
          this.LoadingPage.hide()
        })
  }

  GetFlowData_CardPatch(EmpID: string, RoleID, getReviewDatas: AllformReview[]) {
    //補卡單

    var today = new Date()
    var GetFlowSignAbsGetApi: GetFlowSignAbsGetApiClass = {
      SignEmpID: this.FirstEmpCode.toString(),
      SignRoleID: "",
      RealSignEmpID: EmpID,
      RealSignRoleID: RoleID,
      SignDate: doFormatDate(today)
    }
    this.GetApiDataServiceService.getWebApiData_GetFlowSignCardPatch(GetFlowSignAbsGetApi)
      .pipe(takeWhile(() => this.api_subscribe))
      .subscribe(
        (GetFlowSignCardApiData: GetFlowSignCardApiDataClass[]) => {

          this.CardPatchFlowSigns = []

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
              this.CardPatchFlowSigns.push({
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
          this.CardPatchFlowSigns.sort((a: any, b: any) => {
            return b.ProcessFlowID - a.ProcessFlowID;
          });

          this.CardPatchCount = this.CardPatchFlowSigns.length.toString()
          this.goBackPage(this.CardPatchPaginator, this.CardPatch_pagechange, this.ReviewformServiceService.CardPatch_pagechange, this.CardPatchFlowSigns.length)
          this.LoadingPage.hide()

        })

  }
  GetFlowData_AttendUnusual(EmpID: string, RoleID, getReviewDatas: AllformReview[]) {
    //考勤異常簽認單
    var today = new Date()
    var GetFlowSignAbsGetApi: GetFlowSignAbsGetApiClass = {
      SignEmpID: this.FirstEmpCode.toString(),
      SignRoleID: "",
      RealSignEmpID: EmpID,
      RealSignRoleID: RoleID,
      SignDate: doFormatDate(today)
    }

    this.GetApiDataServiceService.getWebApiData_GetFlowSignAttendUnusual(GetFlowSignAbsGetApi)
      .pipe(takeWhile(() => this.api_subscribe))
      .subscribe(
        (x: GetFlowSignAttendUnusualApiDataClass[]) => {
          this.AttendUnusualFlowSigns = []
          this.AttendUnusualFlowSigns = JSON.parse(JSON.stringify(x))
          // console.log(this.AttendUnusualFlowSigns)
          for (let signs of this.AttendUnusualFlowSigns) {
            signs.uiProcessFlowID = void_completionTenNum(signs.ProcessFlowID)
            signs.Date = formatDateTime(signs.Date).getDate
          }
          this.AttendUnusualFlowSigns.sort((a: any, b: any) => {
            return b.ProcessFlowID - a.ProcessFlowID;
          });

          this.AttendUnusualCount = this.AttendUnusualFlowSigns.length.toString()
          this.goBackPage(this.AttendUnusualPaginator, this.AttendUnusual_pagechange, this.ReviewformServiceService.AttendUnusual_pagechange, this.AttendUnusualFlowSigns.length)
          this.LoadingPage.hide()
        }
      )
  }
  GetFlowData_forget(EmpID: string, RoleID, getReviewDatas: AllformReview[]) {
    //忘刷單

    var today = new Date()
    var GetFlowSignAbsGetApi: GetFlowSignAbsGetApiClass = {
      SignEmpID: this.FirstEmpCode.toString(),
      SignRoleID: "",
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
          this.goBackPage(this.forgetPaginator, this.forget_pagechange, this.ReviewformServiceService.forget_pagechange, this.forgetFlowSigns.length)
          this.LoadingPage.hide()

        })

  }

  GetFlowData_change(EmpID: string, RoleID, getReviewDatas: AllformReview[]) {
    //調班單

    var today = new Date()
    var GetFlowSignAbsGetApi: GetFlowSignAbsGetApiClass = {
      SignEmpID: this.FirstEmpCode.toString(),
      SignRoleID: "",
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
          this.goBackPage(this.changePaginator, this.change_pagechange, this.ReviewformServiceService.change_pagechange, this.changeFlowSigns.length)
          this.LoadingPage.hide()
        })
  }

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
    this.GetApiDataServiceService.getWebApiData_GetManInfo(this.FirstEmpCode.toString())
      .pipe(takeWhile(() => this.api_subscribe))
      .subscribe(
        y => {
          if (this.FirstEmpCode.toString() != this.ReviewformServiceService.showReviewMan.EmpCode) {
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

    this.GetApiDataServiceService.getWebApiData_GetManInfo(this.FirstEmpCode.toString())
      .pipe(takeWhile(() => this.api_subscribe))
      .subscribe(
        y => {
          if (this.FirstEmpCode.toString() != this.ReviewformServiceService.showReviewMan.EmpCode) {
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

  goBackPage(Paginator, Pagechange, ServicePagechange, AllDataLegth) {
    //回去紀錄的那頁

    Paginator.pageIndex = ServicePagechange.pageIndex.valueOf();
    Pagechange.pageIndex = ServicePagechange.pageIndex.valueOf();
    Pagechange.lowValue = ServicePagechange.lowValue.valueOf();
    Pagechange.highValue = ServicePagechange.highValue.valueOf();

    if (Pagechange.lowValue == AllDataLegth && AllDataLegth != 0) {
      Paginator.pageIndex = Paginator.pageIndex - 1
      Pagechange.pageIndex = Pagechange.pageIndex - 1
      Pagechange.lowValue = Pagechange.lowValue - Pagechange.pageSize
      Pagechange.highValue = Pagechange.highValue - Pagechange.pageSize
    }
  }

}














