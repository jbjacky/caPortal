import { Component, OnInit, Input, OnDestroy, OnChanges, Output, EventEmitter, ViewChild } from '@angular/core';
import { void_completionTenNum } from 'src/app/UseVoid/void_CompletionTenNum';
import { GetApiDataServiceService } from 'src/app/Service/get-api-data-service.service';
import { formatDateTime, getapi_formatTimetoString } from 'src/app/UseVoid/void_doFormatDate';
import { NgxSpinnerService } from 'ngx-spinner';
import { GetApiUserService } from 'src/app/Service/get-api-user.service';
import { GetFlowViewAbsGetApiDataClass } from 'src/app/Models/GetFlowViewAbsGetApiDataClass';
import { vaSearchFlowSignClass } from 'src/app/Models/vaSearchFlowSignClass';
import { NewVaSearchFlowSignClass, DetailNewVaSearchFlowSignClass } from 'src/app/Models/NewVaSearchFlowSignClass';
import { takeWhile } from 'rxjs/operators';
import { BehaviorSubject, Observable } from 'rxjs';
import { GetSelectBaseClass } from 'src/app/Models/GetSelectBaseClass';
import { TransSignStateGetApiClass } from 'src/app/Models/PostData_API_Class/TransSignStateGetApiClass';

declare let $: any; //use jquery

@Component({
  selector: 'app-search-va-form',
  templateUrl: './search-va-form.component.html',
  styleUrls: ['./search-va-form.component.css']
})
export class SearchVaFormComponent implements OnInit, OnDestroy {
  ngOnDestroy(): void {
    // throw new Error("Method not implemented.");
    this.api_subscribe = false;
  }
  api_subscribe = true; //ngOnDestroy時要取消訂閱api的subscribe
  showVaDataDetail: boolean = false  // 顯示明細


  @Input() getVaData: GetFlowViewAbsGetApiDataClass[]
  // @Input() getSearchFlowView: GetFlowViewClass
  @Input() getShowTransSign: boolean
  @Input() getShowTake: boolean

  vaSearchFlowSign: DetailNewVaSearchFlowSignClass[] = [];
  constructor(private GetApiDataServiceService: GetApiDataServiceService,
    private LoadingPage: NgxSpinnerService,
    private GetApiUserService: GetApiUserService) { }
  SearchMan = { EmpCode: '', EmpNameC: '' }
  ngOnInit() {
    // alert(this.getVaData.toString())
    // console.log(this.getVaData)
    this.GetApiUserService.counter$
      .subscribe(
        (x: any) => {
          if (x != 0) {
            this.SearchMan.EmpCode = x.EmpID
            this.SearchMan.EmpNameC = x.EmpNameC
          }
        }
      )
    // console.log(this.getVaData)
    this.GetFlowData_vaData(this.getVaData)

  }
  GetFlowData_vaData(GetFlowViewAbsGetApiData: GetFlowViewAbsGetApiDataClass[]) {
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
        ProcessFlowID: data.ProcessFlowID,
        showProcessFlowID: void_completionTenNum(data.ProcessFlowID),
        EmpCode: data.EmpID,//申請人工號
        EmpNameC: data.EmpName,//申請人姓名
        AppDeptName: data.DeptName,//申請人部門
        State: data.State,
        ManageEmpName: data.ManageEmpName,
        Take: data.Take,
        TransSign: data.TransSign,
        HoliDayID: 0,
        HoliDayNameC: 0,
        Handle: data.Handle,

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
        Appointment: data.Appointment,

        ListHoliDayNameC: data.ListHoliDayNameC
      })
    }
  }


  @Output() gotoShowFormPlace: EventEmitter<number> = new EventEmitter<number>();
  setToNextVaDataTitle: vaSearchFlowSignClass //給明細用的title資料
  nextShowDetail(setToNextVaDataTitle: vaSearchFlowSignClass) {
    // console.log(setToNextVaDataTitle)
    // if (setToNextVaDataTitle.ProcessFlowID != 0) {
    this.gotoShowFormPlace.emit();

    this.showVaDataDetail = true
    this.setToNextVaDataTitle = setToNextVaDataTitle
    // }
  }


  onGoBackFunction() {
    this.showVaDataDetail = false
    this.gotoShowFormPlace.emit();
    // window.scroll(0, 0);
    //回列表
  }

  takeForm: any
  transSignForm: any
  private Sub_onChangeReviewMan$: BehaviorSubject<any> = new BehaviorSubject(0)
  onChangeReviewMan$: Observable<any> = this.Sub_onChangeReviewMan$; //切換換審核人員給選擇簽核人員使用
  FlowDynamic_Base: GetSelectBaseClass;
  checkTransSignForm(oneVaData) {
    // console.log(oneVaData)
    this.transSignForm = oneVaData
    this.Sub_onChangeReviewMan$.next(oneVaData.EmpCode)

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
            // this.vaSearchFlowSign.splice(this.vaSearchFlowSign.indexOf(this.takeForm), 1)
            this.vaSearchFlowSign[this.vaSearchFlowSign.indexOf(this.takeForm)].State = '7'
            this.vaSearchFlowSign[this.vaSearchFlowSign.indexOf(this.takeForm)].Take = false

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

}



