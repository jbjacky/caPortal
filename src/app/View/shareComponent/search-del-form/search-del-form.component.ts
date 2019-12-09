import { Component, OnInit, Input, OnDestroy, Output, EventEmitter } from '@angular/core';
import { GetApiDataServiceService } from 'src/app/Service/get-api-data-service.service';
import { takeWhile } from 'rxjs/operators';
import { formatDateTime } from 'src/app/UseVoid/void_doFormatDate';
import { dateArrayClass, delFlowSign, YearAndDateClass } from 'src/app/Models/AllformReview';
import { calYearindate } from 'src/app/UseVoid/void_calYearindate';
import { void_completionTenNum } from 'src/app/UseVoid/void_CompletionTenNum';
import { NgxSpinnerService } from 'ngx-spinner';
import { GetApiUserService } from 'src/app/Service/get-api-user.service';
import { GetFlowViewAbscGetApiDataClass } from 'src/app/Models/GetFlowViewAbscGetApiDataClass';
import { TransSignStateGetApiClass } from 'src/app/Models/PostData_API_Class/TransSignStateGetApiClass';
import { BehaviorSubject, Observable } from 'rxjs';
import { GetSelectBaseClass } from 'src/app/Models/GetSelectBaseClass';
import { GetFlowViewDeptClass } from 'src/app/Models/PostData_API_Class/GetFlowViewDeptClass';

declare let $: any; //use jquery

@Component({
  selector: 'app-search-del-form',
  templateUrl: './search-del-form.component.html',
  styleUrls: ['./search-del-form.component.css']
})
export class SearchDelFormComponent implements OnInit, OnDestroy {
  ngOnDestroy(): void {
    // throw new Error("Method not implemented.");
    this.api_subscribe = false;
  }

  @Input() getDelData: GetFlowViewAbscGetApiDataClass[]
  @Input() getShowTransSign: boolean
  @Input() getShowTake: boolean
  delSearchFlowSign: delSearchFlowSignClass[] = [];
  showDelDataDetail: boolean = false  // 顯示明細

  MoreSearchPage = 1
  @Input() CanSerchMore: boolean = false
  @Input() getCatchMoreGetFlowViewDept: GetFlowViewDeptClass

  api_subscribe = true; //ngOnDestroy時要取消訂閱api的subscribe

  SearchMan = { EmpCode: '', EmpNameC: '' }
  constructor(private GetApiDataServiceService: GetApiDataServiceService,
    private LoadingPage: NgxSpinnerService,
    private GetApiUserService: GetApiUserService) { }

  ngOnInit() {
    this.GetApiUserService.counter$
      .subscribe(
        (x:any) => {
          if(x!=0){
            this.SearchMan.EmpCode = x.EmpID
            this.SearchMan.EmpNameC = x.EmpNameC
          }
        }
      )
    this.GetFlowData_del(this.getDelData)
  }


  GetFlowData_del(GetFlowViewAbscGetApiData: GetFlowViewAbscGetApiDataClass[]) {
    //銷假單
    for (let data of GetFlowViewAbscGetApiData) {
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
      var YearAndDateArray = []
      for (let OneDate of data.FlowViewAbscDate) {
        YearAndDateArray.push(formatDateTime(OneDate.DateTimeB).getDate)
      }
      this.delSearchFlowSign.push({
        ProcessFlowID: data.ProcessFlowID,
        showProcessFlowID: void_completionTenNum(data.ProcessFlowID),
        EmpCode: data.EmpID,//申請人工號
        EmpNameC: data.EmpName,//申請人姓名
        AppDeptName: data.DeptName,//申請人部門
        State: data.State,
        ManageEmpName: data.ManageEmpName,
        Take: data.Take,
        Note: '',
        Handle: data.Handle,
        TransSign: data.TransSign,

        checkProxy: ischeckProxy, //是否為代填表單
        WriteEmpCode: data.AppEmpID, //填寫人
        WriteEmpNameC: data.AppEmpName,//填寫人

        YearAndDate: calYearindate(YearAndDateArray),
        dateArray: YearAndDateArray,
        day: allDay.toString(),
        hour: allHour.toString(),
        minute: allMinute.toString(),
        numberOfVaData: data.AbscCount.toString()
      })
    }
  }
  @Output() gotoShowFormPlace: EventEmitter<number> = new EventEmitter<number>();
  setToNextDelDataTitle: delSearchFlowSignClass //給明細用的title資料
  nextShowDetail(setToNextDelDataTitle: delSearchFlowSignClass) {
    // console.log(setToNextVaDataTitle)

    this.gotoShowFormPlace.emit();

    this.showDelDataDetail = true
    this.setToNextDelDataTitle = setToNextDelDataTitle
  }

  onGoBackFunction() {
    this.showDelDataDetail = false
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
              }else{
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
            // this.delSearchFlowSign.splice(this.delSearchFlowSign.indexOf(this.takeForm), 1)
            this.delSearchFlowSign[this.delSearchFlowSign.indexOf(this.takeForm)].State = '7'
            this.delSearchFlowSign[this.delSearchFlowSign.indexOf(this.takeForm)].Take = false
            $('#sussesdialog').modal('show')
          }else{
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
    }else{}
    this.getCatchMoreGetFlowViewDept.PageCurrent = this.MoreSearchPage
    this.getMoreSearchFlowForm_Dept(this.getCatchMoreGetFlowViewDept)
  }
  getMoreSearchFlowForm_Dept(GetFlowViewDept: GetFlowViewDeptClass) {

    this.LoadingPage.show()

    this.GetApiDataServiceService.getWebApiData_GetFlowViewAbscByDept(GetFlowViewDept)
      .pipe(takeWhile(() => this.api_subscribe))
      .subscribe(
        (GetFlowViewAbscGetApiData: GetFlowViewAbscGetApiDataClass[]) => {
          if (GetFlowViewAbscGetApiData.length > 0) {
            this.GetFlowData_del(GetFlowViewAbscGetApiData)
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

export class delSearchFlowSignClass {
  ProcessFlowID: number
  showProcessFlowID: number
  EmpCode: string
  EmpNameC: string
  AppDeptName: string
  State: string
  ManageEmpName: string
  Take: boolean
  TransSign: boolean
  Note: string
  Handle: boolean

  checkProxy: boolean //是否為代填表單
  WriteEmpCode: string //填寫人
  WriteEmpNameC: string //填寫人

  YearAndDate: YearAndDateClass[];
  dateArray: dateArrayClass[];
  day: string;
  hour: string;
  minute: string;
  numberOfVaData: string;

}