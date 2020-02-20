import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { showFlowView } from '../../search-form/search-form.component';
import { GetApiDataServiceService } from 'src/app/Service/get-api-data-service.service';
import { GetAttendClass } from 'src/app/Models/PostData_API_Class/GetAttendClass';
import { formatDateTime, getapi_formatTimetoString } from 'src/app/UseVoid/void_doFormatDate';
import { GetAttendExceptionalClass } from 'src/app/Models/PostData_API_Class/GetAttendExceptionalClass';
import { void_completionTenNum } from 'src/app/UseVoid/void_CompletionTenNum';
import { NgxSpinnerService } from 'ngx-spinner';
import { GetApiUserService } from 'src/app/Service/get-api-user.service';
import { takeWhile, mergeMap, map, toArray } from 'rxjs/operators';
import { void_crossDay } from 'src/app/UseVoid/void_crossDay';
import { from, BehaviorSubject, Observable } from 'rxjs';
import { GetFlowViewCardGetApiDataClass } from 'src/app/Models/GetFlowViewCardGetApiDataClass';
import { TransSignStateGetApiClass } from 'src/app/Models/PostData_API_Class/TransSignStateGetApiClass';
import { GetSelectBaseClass } from 'src/app/Models/GetSelectBaseClass';
import { GetFlowViewDeptClass } from 'src/app/Models/PostData_API_Class/GetFlowViewDeptClass';

declare let $: any; //use jquery

@Component({
  selector: 'app-search-card-patch-form',
  templateUrl: './search-card-patch-form.component.html',
  styleUrls: ['./search-card-patch-form.component.css']
})
export class SearchCardPatchFormComponent implements OnInit, OnDestroy {
  ngOnDestroy(): void {
    // throw new Error("Method not implemented.");
    this.api_subscribe = false;
  }

  api_subscribe = true; //ngOnDestroy時要取消訂閱api的subscribe

  @Input() getForgetData: GetFlowViewCardGetApiDataClass[]
  @Input() getShowTransSign: boolean
  @Input() getShowTake: boolean
  cardPatchSearchFlowSign: cardPatchSearchFlowSignClass[] = []

  MoreSearchPage = 1
  @Input() CanSerchMore: boolean = false
  @Input() getCatchMoreGetFlowViewDept: GetFlowViewDeptClass

  constructor(private GetApiDataServiceService: GetApiDataServiceService,
    private LoadingPage: NgxSpinnerService,
    private GetApiUserService: GetApiUserService) { }
  SearchMan = { EmpCode: '', EmpNameC: '' }

  ngOnInit() {
    this.GetApiUserService.counter$
      .subscribe(
        (x: any) => {
          if (x != 0) {
            this.SearchMan.EmpCode = x.EmpID
            this.SearchMan.EmpNameC = x.EmpNameC
          }
        }
      )
    // console.log(this.getForgetData)
    this.GetFlowData_forget(this.getForgetData)
  }


  GetFlowData_forget(GetFlowViewCardGetApiData: GetFlowViewCardGetApiDataClass[]) {
    //考勤異常簽認單
    for (let data of GetFlowViewCardGetApiData) {

      var checkProxy = false //是否為代填表單
      if (data.EmpID != data.AppEmpID) {
        checkProxy = true
      }
      var _isForgetCardOld: boolean = false
      var _isEarlyMinsOld: boolean = false
      var _isLateMinsOld: boolean = false
      var _isNormalOld: boolean = false
      var _isOnBeforeMinsOld: boolean = false
      var _isOffAfterMinsOld: boolean = false

      var ExceptionalNameArray = []
      if (data.ExceptionalName) {
        if(data.ErrorStateName.length > 0){
          ExceptionalNameArray = data.ExceptionalName.split(',')
          for (let e of ExceptionalNameArray) {
            if (e == '未刷卡') {
              _isForgetCardOld = true}
             if (e == '早退') {
              _isEarlyMinsOld = true}
             if (e == '遲到') {
              _isLateMinsOld = true}
             if (e == '正常') {
              _isNormalOld = true}
             if (e == '早到') {
              _isOnBeforeMinsOld = true}
             if (e == '晚退') {
              _isOffAfterMinsOld = true
            }
          }
        }
      }
      var _isForgetCard: boolean = false
      var _isEarlyMins: boolean = false
      var _isLateMins: boolean = false
      var _isNormal: boolean = false
      var _isOnBeforeMins: boolean = false
      var _isOffAfterMins: boolean = false
      if (data.ErrorStateName == '未刷卡') {
        _isForgetCard = true}
       if (data.ErrorStateName == '早退') {
        _isEarlyMins = true}
       if (data.ErrorStateName == '遲到') {
        _isLateMins = true}
       if (data.ErrorStateName == '正常') {
        _isNormal = true}
       if (data.ErrorStateName == '早到') {
        _isOnBeforeMins = true}
       if (data.ErrorStateName == '晚退') {
        _isOffAfterMins = true
      }
      var _ActualRote_calCrossDay: boolean = false
      var _AttendCard_calCrossDay: boolean = false
      var _WriteRote_calCrossDay: boolean = false

      this.cardPatchSearchFlowSign.push({

        ProcessFlowID: data.ProcessFlowID,
        showProcessFlowID: void_completionTenNum(data.ProcessFlowID),
        EmpCode: data.EmpID,
        EmpNameC: data.EmpName,
        AppDeptName: data.DeptName,
        State: data.State,
        ManageEmpName: data.ManageEmpName,
        Take: data.Take,
        TransSign: data.TransSign,

        checkProxy: checkProxy,
        WriteEmpCode: data.AppEmpID,
        WriteEmpNameC: data.AppEmpName,
        Handle: data.Handle,

        Date: formatDateTime(data.Date).getDate,
        RouteCode: null,
        RoteNameC: data.RoteNameC,
        isForgetCard: _isForgetCard,
        isEarlyMins: _isEarlyMins,
        isLateMins: _isLateMins,
        isNormal: _isNormal,
        isOnBeforeMins: _isOnBeforeMins,
        isOffAfterMins: _isOffAfterMins,

        isForgetCardOld: _isForgetCardOld,
        isEarlyMinsOld: _isEarlyMinsOld,
        isLateMinsOld: _isLateMinsOld,
        isNormalOld: _isNormalOld,
        isOnBeforeMinsOld: _isOnBeforeMinsOld,
        isOffAfterMinsOld: _isOffAfterMinsOld,


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
        UploadFile: null,
        ActualRote_calCrossDay: _ActualRote_calCrossDay,
        AttendCard_calCrossDay: _AttendCard_calCrossDay,
        WriteRote_calCrossDay: _WriteRote_calCrossDay
      })
    }
    // this.LoadingPage.show()
    // from(GetFlowViewCardGetApiData).pipe(
    //   mergeMap(
    //     (y: any) => this.GetApiDataServiceService.getWebApiData_GetCardFlowAppsByProcessFlowID(y.ProcessFlowID, true)
    //       .pipe(
    //         map((t: any) => {
    //           var GetAttend: GetAttendClass = {

    //             DateB: formatDateTime(t[0].DateB).getDate.toString(),
    //             DateE: formatDateTime(t[0].DateB).getDate.toString(),
    //             ListEmpID: [t[0].EmpCode],
    //             ListRoteID: null
    //           }
    //           return { FlowSignData: y, FlowDetail: t, GetAttendApi: GetAttend }
    //         })
    //       )
    //   ), mergeMap((q: any) => this.GetApiDataServiceService.getWebApiData_GetAttend(q.GetAttendApi).pipe(
    //     map((u: any) => {
    //       return { FlowSignData: q.FlowSignData, FlowDetail: q.FlowDetail, GetAttend: u[0] }
    //     })
    //   ))
    //   , toArray()

    // ).subscribe(
    //   (data: any) => {
    //     // console.log(data)
    //     this.cardPatchSearchFlowSign = []
    //     for (let forgetSignData of data) {

    //       var _ActualRote_calCrossDay: boolean = void_crossDay(forgetSignData.GetAttend.ActualRote.OffTime).isCrossDay
    //       var _AttendCard_calCrossDay: boolean = void_crossDay(forgetSignData.FlowDetail[0].TimeE).isCrossDay
    //       var _WriteRote_calCrossDay: boolean = void_crossDay(formatDateTime(forgetSignData.FlowDetail[0].DateTimeE).getTime).isCrossDay

    //       var _RoteTimeE = void_crossDay(forgetSignData.GetAttend.ActualRote.OffTime).EndTime
    //       var _writeTimeE = void_crossDay(formatDateTime(forgetSignData.FlowDetail[0].DateTimeE).getTime).EndTime
    //       var _cardTimeE = void_crossDay(forgetSignData.FlowDetail[0].TimeE).EndTime

    //       var checkProxy = false //是否為代填表單
    //       if (forgetSignData.FlowDetail[0].AppEmpID != forgetSignData.FlowSignData.EmpCode) {
    //         checkProxy = true
    //       }
    //       this.cardPatchSearchFlowSign.push({

    //         ProcessFlowID: forgetSignData.FlowSignData.ProcessFlowID,
    //         showProcessFlowID: void_completionTenNum(forgetSignData.FlowSignData.ProcessFlowID),
    //         EmpCode: forgetSignData.FlowDetail[0].EmpCode,
    //         EmpNameC: forgetSignData.FlowDetail[0].EmpNameC,
    //         AppDeptName: forgetSignData.FlowDetail[0].DeptName,
    //         State: forgetSignData.FlowSignData.State,
    //         ManageEmpName: forgetSignData.FlowSignData.ManageEmpName,
    //         Take: forgetSignData.FlowSignData.Take,

    //         checkProxy: checkProxy,
    //         WriteEmpCode: forgetSignData.FlowSignData.AppEmpID,
    //         WriteEmpNameC: forgetSignData.FlowSignData.AppEmpName,

    //         Date: forgetSignData.GetAttend.AttendDate ? formatDateTime(forgetSignData.GetAttend.AttendDate).getDate : null,
    //         RouteCode: forgetSignData.GetAttend.ActualRote.RoteCode,
    //         isForgetCard: forgetSignData.GetAttend.IsAbsent,
    //         isEarlyMins: forgetSignData.GetAttend.EarlyMins > 0 ? true : false,
    //         isLateMins: forgetSignData.GetAttend.LateMins > 0 ? true : false,


    //         RoteTimeB: forgetSignData.GetAttend.ActualRote.OnTime ? getapi_formatTimetoString(forgetSignData.GetAttend.ActualRote.OnTime) : null,
    //         RoteTimeE: getapi_formatTimetoString(_RoteTimeE),

    //         writeDateB: forgetSignData.FlowDetail[0].DateTimeB ? formatDateTime(forgetSignData.FlowDetail[0].DateTimeB).getDate.toString() : null,
    //         writeTimeB: forgetSignData.FlowDetail[0].DateTimeB ? getapi_formatTimetoString(formatDateTime(forgetSignData.FlowDetail[0].DateTimeB).getTime.toString()) : null,
    //         writeDateE: forgetSignData.FlowDetail[0].DateTimeE ? formatDateTime(forgetSignData.FlowDetail[0].DateTimeE).getDate.toString() : null,
    //         writeTimeE: getapi_formatTimetoString(_writeTimeE),
    //         cardTimeB: forgetSignData.FlowDetail[0].TimeB ? getapi_formatTimetoString(forgetSignData.FlowDetail[0].TimeB) : null,
    //         cardTimeE: getapi_formatTimetoString(_cardTimeE),
    //         CauseID1: forgetSignData.FlowDetail[0].CauseID1,
    //         CauseName1: forgetSignData.FlowDetail[0].CauseName1,
    //         Note: forgetSignData.FlowDetail[0].Note,
    //         UploadFile: forgetSignData.FlowDetail[0].UploadFile,
    //         ActualRote_calCrossDay: _ActualRote_calCrossDay,
    //         AttendCard_calCrossDay: _AttendCard_calCrossDay,
    //         WriteRote_calCrossDay: _WriteRote_calCrossDay
    //       })
    //     }

    //     this.cardPatchSearchFlowSign.sort((a: any, b: any) => {
    //       return b.ProcessFlowID - a.ProcessFlowID;
    //     });
    //     this.LoadingPage.hide()
    //   }
    // ), error => {
    //   this.LoadingPage.hide()
    // }

  }

  showForgetDataDetail: boolean = false  // 顯示明細
  @Output() gotoShowFormPlace: EventEmitter<number> = new EventEmitter<number>();
  setToNextForgetDataTitle: cardPatchSearchFlowSignClass //給明細用的title資料
  nextShowDetail(setToNextForgetDataTitle: cardPatchSearchFlowSignClass) {

    // console.log(setToNextVaDataTitle)

    this.gotoShowFormPlace.emit();

    this.showForgetDataDetail = true
    this.setToNextForgetDataTitle = setToNextForgetDataTitle
  }

  onGoBackFunction() {
    this.showForgetDataDetail = false
    this.gotoShowFormPlace.emit();
    // window.scroll(0, 0);
    //回列表
  }

  takeForm: any
  transSignForm: any
  private Sub_onChangeReviewMan$: BehaviorSubject<any> = new BehaviorSubject(0)
  onChangeReviewMan$: Observable<any> = this.Sub_onChangeReviewMan$; //切換換審核人員給選擇簽核人員使用
  FlowDynamic_Base: GetSelectBaseClass;
  checkTransSignForm(oneforgetData) {
    // console.log(oneforgetData)
    this.transSignForm = oneforgetData
    this.Sub_onChangeReviewMan$.next(oneforgetData.EmpCode)

    $('#TransSignformdialog').modal('show')
  }
  chooseBase(GetSelectBase: GetSelectBaseClass) {
    this.FlowDynamic_Base = GetSelectBase
  }
  /**
   * @todo 轉呈
   */
  TransSignform_Click() {

    if (this.FlowDynamic_Base.EmpID) {
      if (this.FlowDynamic_Base.EmpID.length) {
        this.LoadingPage.show()

        var ListProcessFlowID = this.transSignForm.ProcessFlowID
        var TransSignStateGetApi: TransSignStateGetApiClass = {
          "ListProcessFlowID": [
            ListProcessFlowID
          ],
          "enumState": "TransSign",
          "EmpID": this.SearchMan.EmpCode,
          "SignEmpID": this.FlowDynamic_Base.EmpID

        }
        this.GetApiDataServiceService.getWebApiData_TransSignState(TransSignStateGetApi)
          .pipe(takeWhile(() => this.api_subscribe))
          .subscribe(
            (x: any) => {
              if (x.Finish) {
                $('#TransSignformSussesdialog').modal('show')
              } else {
                alert(x.MessageContent)
              }
              this.LoadingPage.hide()
            }
          )
      } else {
        alert('請選擇簽核人員')
      }
    } else {
      alert('請選擇簽核人員')
    }
  }

  /**
   * @todo 抽單
   */
  Cancelform_Click() {
    // console.log(this.SearchMan.EmpCode)
    // console.log(this.takeForm.ProcessFlowID)
    var ListProcessFlowID = this.takeForm.ProcessFlowID
    this.LoadingPage.show()

    this.GetApiDataServiceService.getWebApiData_TakeSetFlowState(this.SearchMan.EmpCode, ListProcessFlowID)
      .pipe(takeWhile(() => this.api_subscribe))
      .subscribe(
        (x: any) => {
          if (x.Finish) {
            // this.cardPatchSearchFlowSign.splice(this.cardPatchSearchFlowSign.indexOf(this.takeForm), 1)
            this.cardPatchSearchFlowSign[this.cardPatchSearchFlowSign.indexOf(this.takeForm)].State = '7'
            this.cardPatchSearchFlowSign[this.cardPatchSearchFlowSign.indexOf(this.takeForm)].Take = false
            $('#sussesdialog').modal('show')
          } else {
            alert(x.MessageContent)
          }
          this.LoadingPage.hide()
        },
        error => {
          this.LoadingPage.hide()
          // alert('與api連線異常，getWebApiData_TakeSetFlowState')
        }
      )
  }


  MoreOnSearchForm() {
    if (this.CanSerchMore) {
      this.MoreSearchPage = this.MoreSearchPage + 1
    } else { }
    this.getCatchMoreGetFlowViewDept.PageCurrent = this.MoreSearchPage
    this.getMoreSearchFlowForm_Dept(this.getCatchMoreGetFlowViewDept)
  }
  getMoreSearchFlowForm_Dept(GetFlowViewDept: GetFlowViewDeptClass) {

    this.LoadingPage.show()

    this.GetApiDataServiceService.getWebApiData_GetFlowViewCardByDept(GetFlowViewDept)
      .pipe(takeWhile(() => this.api_subscribe))
      .subscribe(
        (GetFlowViewCardGetApiData: GetFlowViewCardGetApiDataClass[]) => {
          if (GetFlowViewCardGetApiData.length > 0) {
            this.GetFlowData_forget(GetFlowViewCardGetApiData)
            this.CanSerchMore = true
          } else {
            this.CanSerchMore = false
            alert('無更多資料')
          }
          this.LoadingPage.hide()
        }, error => {
          this.LoadingPage.hide()
        }
      )

  }
}
export class cardPatchSearchFlowSignClass {
  ProcessFlowID: number
  showProcessFlowID: number
  EmpCode: string
  EmpNameC: string
  AppDeptName: string
  State: string
  ManageEmpName: string
  Take: boolean
  TransSign: boolean

  Date: string
  RouteCode: string
  RoteNameC: string

  isForgetCard: boolean
  isEarlyMins: boolean
  isLateMins: boolean
  isNormal: boolean
  isOffAfterMins: boolean
  isOnBeforeMins: boolean

  isForgetCardOld: boolean
  isEarlyMinsOld: boolean
  isLateMinsOld: boolean
  isNormalOld: boolean
  isOffAfterMinsOld: boolean
  isOnBeforeMinsOld: boolean

  Handle: boolean

  checkProxy: boolean
  WriteEmpCode: string;
  WriteEmpNameC: string;

  RoteTimeB: string
  RoteTimeE: string

  writeDateB: string
  writeTimeB: string
  writeDateE: string
  writeTimeE: string
  cardTimeB: string
  cardTimeE: string
  CauseID1: string
  CauseName1: string
  Note: string

  ActualRote_calCrossDay: boolean
  AttendCard_calCrossDay: boolean
  WriteRote_calCrossDay: boolean
  UploadFile: any
}
