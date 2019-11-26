import { Component, OnInit, Output, EventEmitter, Input, OnDestroy } from '@angular/core';
import { GetApiDataServiceService } from 'src/app/Service/get-api-data-service.service';
import { formatDateTime, getapi_formatTimetoString } from 'src/app/UseVoid/void_doFormatDate';
import { takeWhile } from 'rxjs/operators';
import { NgxSpinnerService } from 'ngx-spinner';
import { showUploadFileClass } from 'src/app/Models/showUploadFileClass';
import { FileDownloadService } from 'src/app/Service/file-download.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { GetSelectBaseClass } from 'src/app/Models/GetSelectBaseClass';
import { TransSignStateGetApiClass } from 'src/app/Models/PostData_API_Class/TransSignStateGetApiClass';
import { GetApiUserService } from 'src/app/Service/get-api-user.service';
import { AttendUnusualSearchFlowSignClass } from '../search-attend-unusual-form/search-attend-unusual-form.component';
import { GetAttendUnusualFlowAppsByProcessFlowIDDataClass } from 'src/app/Models/GetAttendUnusualFlowAppsByProcessFlowIDDataClass';
declare let $: any; //use jquery

@Component({
  selector: 'app-search-attend-unusual-form-detail',
  templateUrl: './search-attend-unusual-form-detail.component.html',
  styleUrls: ['./search-attend-unusual-form-detail.component.css']
})
export class SearchAttendUnusualFormDetailComponent implements OnInit, OnDestroy {
  ngOnDestroy(): void {
    // throw new Error("Method not implemented.");
    this.api_subscribe = false;
  }
  api_subscribe = true; //ngOnDestroy時要取消訂閱api的subscribe

  @Output() goback: EventEmitter<number> = new EventEmitter<number>();//回列表

  @Input() getShowTransSignDetail: boolean
  @Input() getShowTakeDetail: boolean
  @Input() getAttendUnusualDataTitle: AttendUnusualSearchFlowSignClass

  constructor(private GetApiDataServiceService: GetApiDataServiceService,
    private LoadingPage: NgxSpinnerService,
    private FileDownloadService: FileDownloadService,
    private GetApiUserService: GetApiUserService) { }

  GetAttendUnusualFlowAppsByProcessFlowIDData: GetAttendUnusualFlowAppsByProcessFlowIDDataClass = new GetAttendUnusualFlowAppsByProcessFlowIDDataClass()

  RoteDateB: string = ''
  RoteTimeB: string = ''
  RoteDateE: string = ''
  RoteTimeE: string = ''
  CardDateB: string = ''
  CardTimeB: string = ''
  CardDateE: string = ''
  CardTimeE: string = ''
  showAprovedName: string

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
    this.GetApiDataServiceService.getWebApiData_GetAttendUnusualFlowAppsByProcessFlowID(this.getAttendUnusualDataTitle.ProcessFlowID, true)
      .pipe(takeWhile(() => this.api_subscribe))
      .subscribe(
        (data: GetAttendUnusualFlowAppsByProcessFlowIDDataClass) => {
          this.GetAttendUnusualFlowAppsByProcessFlowIDData = data[0]
          this.GetAttendUnusualFlowAppsByProcessFlowIDData.Date = formatDateTime(data[0].Date).getDate

          this.RoteDateB = formatDateTime(data[0].RoteDateTimeB).getDate
          this.RoteTimeB = getapi_formatTimetoString(formatDateTime(data[0].RoteDateTimeB).getTime)
          this.RoteDateE = formatDateTime(data[0].RoteDateTimeE).getDate
          this.RoteTimeE = getapi_formatTimetoString(formatDateTime(data[0].RoteDateTimeE).getTime)

          this.CardDateB = formatDateTime(data[0].CardDateTimeB).getDate
          this.CardTimeB = getapi_formatTimetoString(formatDateTime(data[0].CardDateTimeB).getTime)
          this.CardDateE = formatDateTime(data[0].CardDateTimeE).getDate
          this.CardTimeE = getapi_formatTimetoString(formatDateTime(data[0].CardDateTimeE).getTime)
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
    var ListProcessFlowID = this.getAttendUnusualDataTitle.ProcessFlowID
    this.LoadingPage.show()

    this.GetApiDataServiceService.getWebApiData_TakeSetFlowState(this.getAttendUnusualDataTitle.EmpID, ListProcessFlowID)
      .pipe(takeWhile(() => this.api_subscribe))
      .subscribe(
        (x: any) => {
          if (x.Finish) {
            // this.changeSearchFlowSign.splice(this.changeSearchFlowSign.indexOf(this.takeForm), 1)
            this.getAttendUnusualDataTitle.Take = false
            this.getAttendUnusualDataTitle.State = '7'
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

  color_CardOnTime() {

    if (this.getAttendUnusualDataTitle.EliminateLate || this.getAttendUnusualDataTitle.EliminateAbsent) {
      return '#d0021b'
    } else {
      return '#4c4c4c'
    }
  }
  color_CardOffTime() {

    if (this.getAttendUnusualDataTitle.EliminateEarly || this.getAttendUnusualDataTitle.EliminateAbsent) {
      return '#d0021b'
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
