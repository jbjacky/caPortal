import { Component, OnInit, Input, OnDestroy, Output, EventEmitter } from '@angular/core';
import { changeFlowSign, YearAndDateClass } from 'src/app/Models/AllformReview';
import { GetApiDataServiceService } from 'src/app/Service/get-api-data-service.service';
import { takeWhile, map, mergeMap, toArray } from 'rxjs/operators';
import { formatDateTime } from 'src/app/UseVoid/void_doFormatDate';
import { calYearindate } from 'src/app/UseVoid/void_calYearindate';
import { showFlowView } from '../../search-form/search-form.component';
import { void_completionTenNum } from 'src/app/UseVoid/void_CompletionTenNum';
import { NgxSpinnerService } from 'ngx-spinner';
import { GetApiUserService } from 'src/app/Service/get-api-user.service';
import { from, BehaviorSubject, Observable } from 'rxjs';
import { GetFlowViewShiftRoteGetApiDataClass } from 'src/app/Models/GetFlowViewShiftRoteGetApiDataClass';
import { TransSignStateGetApiClass } from 'src/app/Models/PostData_API_Class/TransSignStateGetApiClass';
import { GetSelectBaseClass } from 'src/app/Models/GetSelectBaseClass';

declare let $: any; //use jquery

@Component({
  selector: 'app-search-change-form',
  templateUrl: './search-change-form.component.html',
  styleUrls: ['./search-change-form.component.css']
})
export class SearchChangeFormComponent implements OnInit, OnDestroy {
  ngOnDestroy(): void {
    // throw new Error("Method not implemented.");
    this.api_subscribe = false;
  }
  api_subscribe = true; //ngOnDestroy時要取消訂閱api的subscribe

  constructor(private GetApiDataServiceService: GetApiDataServiceService,
    private LoadingPage: NgxSpinnerService,
    private GetApiUserService: GetApiUserService) { }
  SearchMan = { EmpCode: '', EmpNameC: '' }

  @Input() getChangeData: GetFlowViewShiftRoteGetApiDataClass[]
  @Input() getShowTransSign: boolean
  @Input() getShowTake: boolean

  @Output() gotoShowFormPlace: EventEmitter<number> = new EventEmitter<number>();

  changeSearchFlowSign: changeSearchFlowSignClass[] = []
  showChangeDataDetailRZ: boolean = false
  ngOnInit() {
    // console.log(this.getChangeData)
    this.GetApiUserService.counter$
      .subscribe(
        (x:any) => {
          if(x!=0){
            this.SearchMan.EmpCode = x.EmpID
            this.SearchMan.EmpNameC = x.EmpNameC
          }
        }
      )
    this.GetFlowData_change(this.getChangeData)
  }


  GetFlowData_change(GetFlowViewShiftRoteGetApiData: GetFlowViewShiftRoteGetApiDataClass[]) {
    //調班單
    for (let data of GetFlowViewShiftRoteGetApiData) {

      var YearAndDateArray = []
      var RR: boolean = false
      var DR: boolean = false
      var RZ: boolean = false
      for (let ShiftRoteFlowAppsDetail of data.FlowViewShiftRoteDate) {
        var ShiftRoteDate = formatDateTime(ShiftRoteFlowAppsDetail.ShiftRoteDate).getDate.toString()
        YearAndDateArray.push(ShiftRoteDate)
      }

      if (data.ShiftRoteName == '雙人互調') {
        RR = true
      } else if (data.ShiftRoteName == '請求調班') {
        DR = true
      } else if (data.ShiftRoteName == '例休互調') {
        RZ = true
      }

      var checkProxy = false //是否為代填表單
      if (data.EmpID1 != data.AppEmpID) {
        checkProxy = true
      }
      this.changeSearchFlowSign.push({
        ProcessFlowID: data.ProcessFlowID,
        showProcessFlowID: void_completionTenNum(data.ProcessFlowID),
        EmpCode: null,
        EmpNameC: null,
        AppDeptName: null,
        State: data.State,
        ManageEmpName: data.ManageEmpName,
        Take: data.Take,
        TransSign: data.TransSign,

        EmpID1: data.EmpID1,
        EmpCode1: data.EmpID1,
        EmpNameC1: data.EmpName1,
        DeptName1: data.DeptName1,
        EmpID2: data.EmpID2,
        EmpCode2: data.EmpID2,
        EmpNameC2: data.EmpName2,
        DeptName2: data.DeptName2,
        Note: '',
        Handle: data.Handle,

        YearAndDate: calYearindate(YearAndDateArray),
        dateArray: YearAndDateArray,
        isDR: DR,
        isRR: RR,
        isRZ: RZ,
        numberOfVaData: YearAndDateArray.length.toString(),
        checkProxy: checkProxy
      })
    }
  }

  showChangeDataDetailDR: boolean = false
  showChangeDataDetailRR: boolean = false
  setToNextChangeDataTitle: changeSearchFlowSignClass

  nextShowDetail(oneChangeData: changeSearchFlowSignClass) {
    if (oneChangeData.isDR) {
      this.showChangeDataDetailDR = true
      this.setToNextChangeDataTitle = oneChangeData

    } else if (oneChangeData.isRR) {

      this.showChangeDataDetailRR = true
      this.setToNextChangeDataTitle = oneChangeData

    } else if (oneChangeData.isRZ) {

      this.showChangeDataDetailRZ = true
      this.setToNextChangeDataTitle = oneChangeData

    }

    this.gotoShowFormPlace.emit();

  }
  takeForm: any
  transSignForm: any
  private Sub_onChangeReviewMan$: BehaviorSubject<any> = new BehaviorSubject(0)
  onChangeReviewMan$: Observable<any> = this.Sub_onChangeReviewMan$; //切換換審核人員給選擇簽核人員使用
  FlowDynamic_Base: GetSelectBaseClass;
  checkTransSignForm(oneChangeData) {
    // console.log(oneforgetData)
    this.transSignForm = oneChangeData
    this.Sub_onChangeReviewMan$.next(oneChangeData.EmpCode1)

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
            // this.changeSearchFlowSign.splice(this.changeSearchFlowSign.indexOf(this.takeForm), 1)
            this.changeSearchFlowSign[this.changeSearchFlowSign.indexOf(this.takeForm)].State = '7'
            this.changeSearchFlowSign[this.changeSearchFlowSign.indexOf(this.takeForm)].Take = false
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

  onGoBackFunction() {
    this.showChangeDataDetailRZ = false
    this.showChangeDataDetailRR = false
    this.showChangeDataDetailDR = false
    this.gotoShowFormPlace.emit();
    // window.scroll(0, 0);
    //回列表
  }

}


export class changeSearchFlowSignClass {
  ProcessFlowID: number
  showProcessFlowID: number
  EmpCode: string
  EmpNameC: string
  AppDeptName: string
  State: string
  ManageEmpName: string
  Take: boolean
  TransSign: boolean

  EmpID1: string
  EmpCode1: string
  EmpNameC1: string
  DeptName1: string
  EmpID2: string
  EmpCode2: string
  EmpNameC2: string
  DeptName2: string
  Note: string
  Handle: boolean

  YearAndDate: YearAndDateClass[]
  dateArray: Array<string>
  isDR: boolean
  isRR: boolean
  isRZ: boolean
  numberOfVaData: string
  checkProxy: boolean
}
