import { Component, OnInit, Output, EventEmitter, Input, OnDestroy } from '@angular/core';
import { otFormClass, EmpClass } from '../writeotform/otform.component';
import { uploadFileClass } from 'src/app/Models/uploadFileClass';
import { NgxSpinnerService } from 'ngx-spinner';
import { FileDownloadService } from 'src/app/Service/file-download.service';
import { GetApiDataServiceService } from 'src/app/Service/get-api-data-service.service';
import { OtSaveGetApiClass } from 'src/app/Models/PostData_API_Class/OtSaveGetApiClass';
import { takeWhile } from 'rxjs/operators';
import { sumbit_formatTimetoString } from 'src/app/UseVoid/void_doFormatDate';
import { OTCheckListGetApiDataClass } from 'src/app/Models/OTCheckListGetApiDataClass';
import { OTSaveAndFlowStartGetApiClass } from 'src/app/Models/PostData_API_Class/OTSaveAndFlowStartGetApiClass';

declare let $: any; //use jquery

@Component({
  selector: 'app-otformdetail',
  templateUrl: './otformdetail.component.html',
  styleUrls: ['./otformdetail.component.css']
})
export class OtFormDetailComponent implements OnInit, OnDestroy {
  ngOnDestroy(): void {
    this.api_subscribe = false;
  }
  api_subscribe = true; //ngOnDestroy時要取消訂閱api的subscribe

  @Input() getOtType: string; // 表單類型
  @Input() getEmpInfo: EmpClass; // 被申請與填寫人
  @Input() getOtFormArray: Array<otFormClass>; // 填寫送出表單
  @Output() counterChange: EventEmitter<number> = new EventEmitter<number>();//返回修改按鈕

  constructor(private GetApiDataServiceService: GetApiDataServiceService,
    private LoadingPage: NgxSpinnerService,
    private FileDownload: FileDownloadService) {
  }

  ngOnInit() {
  }
  checkOnSubmit() {
    $('#checksenddialog').modal('show');
  }
  onSubmit() {
    var OTSaveAndFlowStartGetApi: OTSaveAndFlowStartGetApiClass = {
      "FlowApp": {
        "FlowApps": [],
        "EmpID": this.getEmpInfo.writeEmpID,
        "EmpCode": this.getEmpInfo.writeEmpID,
        "EmpNameC": this.getEmpInfo.writeEmpName,
        "State": "1"
      },
      "FlowDynamic": {
        "FlowNode": "",
        "RoleID": "",
        "EmpID": "",
        "DeptID": "",
        "PosID": ""
      }
    }
    for (let o of this.getOtFormArray) {
      OTSaveAndFlowStartGetApi.FlowApp.FlowApps.push({
          "EmpID":  this.getEmpInfo.empID,
          "EmpNameC":  this.getEmpInfo.empName,
          "OtCat": o.OtCat,
          "DateB": o.StartDate,
          "DateE": o.EndDate,
          "TimeB": sumbit_formatTimetoString(o.StartTime),
          "TimeE": sumbit_formatTimetoString(o.EndTime),
          "DateTimeB": (new Date(o.StartDate + ' ' + o.StartTime)).toJSON(),
          "DateTimeE": (new Date(o.EndDate + ' ' + o.EndTime)).toJSON(),
          "Amount": o.OtAmount,
          "CauseID": o.CauseID,
          "RoteID": "",
          "DeptcID": o.DeptsID,
          "Note": o.Note,
          "KeyMan": this.getEmpInfo.writeEmpID,
          "UploadFile": o.FileUpload,
          "Serno": "",
          "MailBody": "",
          "State": "1"
        })
    }
    if (this.getOtFormArray[0].OtType == "1") {
      // 預估加班單sussesdialog
      this.LoadingPage.show()
      // console.log(OTSaveAndFlowStartGetApi)
      OTSaveAndFlowStartGetApi.FlowDynamic.FlowNode = "73"
      this.GetApiDataServiceService.getWebApiData_OTEstimateSaveAndFlowStart(OTSaveAndFlowStartGetApi)
        .pipe(takeWhile(() => this.api_subscribe))
        .subscribe(
          (OTCheckListGetApiData: OTCheckListGetApiDataClass[]) => {
            if(this.valErrArray(OTCheckListGetApiData)){
              $('#sussesdialog').modal('show')
            }
            this.LoadingPage.hide();
          }
        )
    } else if (this.getOtFormArray[0].OtType == "2") {
      // 實際加班單
      this.LoadingPage.show()
      // console.log(OTSaveAndFlowStartGetApi)
      OTSaveAndFlowStartGetApi.FlowDynamic.FlowNode = "16"
      this.GetApiDataServiceService.getWebApiData_OTSaveAndFlowStart(OTSaveAndFlowStartGetApi)
        .pipe(takeWhile(() => this.api_subscribe))
        .subscribe(
          (OTCheckListGetApiData: OTCheckListGetApiDataClass[]) => {
            if(this.valErrArray(OTCheckListGetApiData)){
              $('#sussesdialog').modal('show')
            }
            this.LoadingPage.hide();
          }
        )
    }
  }
  previouspage() {
    //返回修改按鈕
    this.counterChange.emit();
  }
  base64(apiFile: uploadFileClass) {
    this.FileDownload.base64(apiFile)
  }
  /**
   * @todo 驗證加班檢查api回傳有無錯誤
   */
  private valErrArray(OTCheckListGetApiData: OTCheckListGetApiDataClass[]) {
    var okInArray: boolean = true
    for (let otData of OTCheckListGetApiData) {
      if (!otData.isOK) {
        var e = ''
        for (let err of otData.ErrorMsg) {
          e = e + err
        }
        alert(e)
        okInArray = false
      }
    }
    return okInArray
  }
}
