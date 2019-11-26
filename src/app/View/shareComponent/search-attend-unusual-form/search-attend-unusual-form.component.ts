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
import { GetFlowSignAttendUnusualApiDataClass } from 'src/app/Models/GetFlowSignAttendUnusualApiDataClass';
import { GetFlowViewAttendUnusualDataClass } from 'src/app/Models/GetFlowViewAttendUnusualDataClass';

declare let $: any; //use jquery

@Component({
  selector: 'app-search-attend-unusual-form',
  templateUrl: './search-attend-unusual-form.component.html',
  styleUrls: ['./search-attend-unusual-form.component.css']
})
export class SearchAttendUnusualFormComponent implements OnInit, OnDestroy {
  ngOnDestroy(): void {
    // throw new Error("Method not implemented.");
    this.api_subscribe = false;
  }

  api_subscribe = true; //ngOnDestroy時要取消訂閱api的subscribe

  @Input() getFlowSignAttendUnusualApiData: GetFlowViewAttendUnusualDataClass[]
  @Input() getShowTransSign: boolean
  @Input() getShowTake: boolean

  getAttendUnusualSearchFlowSign: AttendUnusualSearchFlowSignClass[] = []

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
    this.GetFlowData_AttendUnusual(this.getFlowSignAttendUnusualApiData)
  }


  GetFlowData_AttendUnusual(GetFlowSignAttendUnusualApiData: GetFlowViewAttendUnusualDataClass[]) {
    //考勤異常簽認單
    // console.log(GetFlowSignAttendUnusualApiData)
    this.getAttendUnusualSearchFlowSign = JSON.parse(JSON.stringify(GetFlowSignAttendUnusualApiData))
    for(let data of this.getAttendUnusualSearchFlowSign){
      if(data.EmpID != data.AppEmpID){
        data.checkProxy = true
      }else{
        data.checkProxy = false
      }
      data.showProcessFlowID = void_completionTenNum(data.ProcessFlowID)
      data.Date = formatDateTime(data.Date).getDate
    }
  }
  showAttendUnusualDataDetail: boolean = false  // 顯示明細
  setToNextAttendUnusualDataTitle: AttendUnusualSearchFlowSignClass
  @Output() gotoShowFormPlace: EventEmitter<number> = new EventEmitter<number>();
  nextShowDetail(setToNextAttendUnusualDataTitle: AttendUnusualSearchFlowSignClass) {

    // console.log(setToNextVaDataTitle)

    this.gotoShowFormPlace.emit();

    this.showAttendUnusualDataDetail = true
    this.setToNextAttendUnusualDataTitle = setToNextAttendUnusualDataTitle
  }

  onGoBackFunction() {
    this.showAttendUnusualDataDetail = false
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
            // this.forgetSearchFlowSign.splice(this.forgetSearchFlowSign.indexOf(this.takeForm), 1)
            // this.AttendUnusualSearchFlowSign[this.AttendUnusualSearchFlowSign.indexOf(this.takeForm)].State = '7'
            // this.AttendUnusualSearchFlowSign[this.AttendUnusualSearchFlowSign.indexOf(this.takeForm)].Take = false
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

    this.GetApiDataServiceService.getWebApiData_GetFlowViewAttendUnusualByDept(GetFlowViewDept)
      .pipe(takeWhile(() => this.api_subscribe))
      .subscribe(
        (GetFlowSignAttendUnusualApiData: GetFlowViewAttendUnusualDataClass[]) => {
          if (GetFlowSignAttendUnusualApiData.length > 0) {
            this.GetFlowData_AttendUnusual(GetFlowSignAttendUnusualApiData)
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

export class AttendUnusualSearchFlowSignClass {

  showProcessFlowID: string;
  checkProxy:        boolean;
  EmpID:             string;
  EmpName:           string;
  DeptName:          string;
  Date:              string;
  EliminateLate:     boolean;
  EliminateEarly:    boolean;
  EliminateOnBefore: boolean;
  EliminateOffAfter: boolean;
  EliminateAbsent:   boolean;
  RoteNameC:         string;
  ErrorState:        string;
  Key:               string;
  ProcessFlowID:     number;
  FormName:          string;
  AppEmpID:          string;
  AppEmpName:        string;
  AppDeptName:       string;
  ManageEmpName:     string;
  RealManageEmpName: string;
  State:             string;
  Handle:            boolean;
  Take:              boolean;
  TransSign:         boolean;

}
