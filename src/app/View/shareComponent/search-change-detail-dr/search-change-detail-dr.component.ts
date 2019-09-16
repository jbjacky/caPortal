import { Component, OnInit, Output, EventEmitter, Input, OnDestroy } from '@angular/core';
import { changeSearchFlowSignClass } from '../search-change-form/search-change-form.component';
import { FormSign } from '../../allform/reviewform/reviewform-detail-delform/reviewform-detail-delform.component';
import { GetApiDataServiceService } from 'src/app/Service/get-api-data-service.service';
import { formatDateTime, getapi_formatTimetoString } from 'src/app/UseVoid/void_doFormatDate';
import { takeWhile } from 'rxjs/operators';
import { ShiftRoteFlowAppsDetailClass } from 'src/app/Models/ShiftRoteFlowAppsDetailClass';
import { NgxSpinnerService } from 'ngx-spinner';
import { TransSignStateGetApiClass } from 'src/app/Models/PostData_API_Class/TransSignStateGetApiClass';
import { BehaviorSubject, Observable } from 'rxjs';
import { GetSelectBaseClass } from 'src/app/Models/GetSelectBaseClass';
import { GetApiUserService } from 'src/app/Service/get-api-user.service';

declare let $: any; //use jquery

@Component({
  selector: 'app-search-change-detail-dr',
  templateUrl: './search-change-detail-dr.component.html',
  styleUrls: ['./search-change-detail-dr.component.css']
})
export class SearchChangeDetailDRComponent implements OnInit, OnDestroy {
  ngOnDestroy(): void {
    // throw new Error("Method not implemented.");
    this.api_subscribe = false;
  }
  api_subscribe = true; //ngOnDestroy時要取消訂閱api的subscribe

  @Output() goback: EventEmitter<number> = new EventEmitter<number>();//回列表

  @Input() getShowTransSignDetail: boolean
  @Input() getShowTakeDetail: boolean
  @Input() getChangeDataTitle: changeSearchFlowSignClass

  constructor(private GetApiDataServiceService: GetApiDataServiceService, 
    private LoadingPage: NgxSpinnerService,
    private GetApiUserService: GetApiUserService) { }

  ShiftRoteFlowAppsDetailArray: ShiftRoteFlowAppsDetailClass[]
  Note:string =''
  showAprovedName:string
  
  SearchMan = { EmpCode: '', EmpNameC: '' }
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

    this.GetApiDataServiceService.getWebApiData_GetShiftFlowAppsByProcessFlowID(this.getChangeDataTitle.ProcessFlowID)
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
          if(x[0].Note){
            this.Note = x[0].Note
          }

        }
      )

  }
  previouspage() {
    //回列表
    this.goback.emit();
  }

  transSignForm: any
  private Sub_onChangeReviewMan$: BehaviorSubject<any> = new BehaviorSubject(0)
  onChangeReviewMan$: Observable<any> = this.Sub_onChangeReviewMan$; //切換換審核人員給選擇簽核人員使用
  FlowDynamic_Base: GetSelectBaseClass;
  checkTransSignForm(oneChangeData) {
    // console.log(oneChangeData)
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
    var ListProcessFlowID = this.getChangeDataTitle.ProcessFlowID
    this.LoadingPage.show()

    this.GetApiDataServiceService.getWebApiData_TakeSetFlowState(this.getChangeDataTitle.EmpCode, ListProcessFlowID)
      .pipe(takeWhile(() => this.api_subscribe))
      .subscribe(
        (x:any) => {
          if (x.Finish) {
            // this.changeSearchFlowSign.splice(this.changeSearchFlowSign.indexOf(this.takeForm), 1)
            this.getChangeDataTitle.Take = false
            this.getChangeDataTitle.State = '7'
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
