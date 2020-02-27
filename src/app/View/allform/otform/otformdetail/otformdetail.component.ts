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

  @Input()  getEmpInfo : EmpClass; // 被申請與填寫人
  @Input()  getOtFormArray: Array<otFormClass>; // 填寫送出表單
  @Output() counterChange: EventEmitter<number> = new EventEmitter<number>();//返回修改按鈕
  
  constructor(private GetApiDataServiceService: GetApiDataServiceService,
    private LoadingPage: NgxSpinnerService,
    private FileDownload: FileDownloadService ) {
  }

  ngOnInit() {
  }
  checkOnSubmit(){
    $('#checksenddialog').modal('show');
  }
  onSubmit(){
    var OtSaveGetApi:OtSaveGetApiClass[]=[]
    for(let o of this.getOtFormArray){
      OtSaveGetApi.push({
        "RowID" : o.RowID,
        "EmpID" : o.EmpID,
        "OtCat" : o.OtCat,
        "DateB" : o.StartDate,
        "DateE": o.EndDate,
        "DateA" : "",
        "DateD": "",
        "TimeB" : sumbit_formatTimetoString(o.StartTime),
        "TimeE" : sumbit_formatTimetoString(o.EndTime),
        "Amount" : o.OtAmount,
        "CauseID" :o.CauseID,
        "RoteID" :"",
        "DeptcID" :o.DeptsID,
        "Note" : o.Note,
        "KeyMan" : this.getEmpInfo.writeEmpID,
        "Serno" :"",
        "Time24" : false
      })
    }
    if(this.getOtFormArray[0].OtType == "1"){
      // 預估加班單sussesdialog
      this.LoadingPage.show()
      this.GetApiDataServiceService.getWebApiData_OtSave(OtSaveGetApi)
      .pipe(takeWhile(() => this.api_subscribe))
      .subscribe(
        (OTCheckListGetApiData: OTCheckListGetApiDataClass[])=>{
          this.valErrArray(OTCheckListGetApiData);
          this.LoadingPage.hide();
        }
      )
    }else if(this.getOtFormArray[0].OtType == "2"){
      // 實際加班單
      this.LoadingPage.show()
      this.GetApiDataServiceService.getWebApiData_OtEstimateSave(OtSaveGetApi)
      .pipe(takeWhile(() => this.api_subscribe))
      .subscribe(
        (OTCheckListGetApiData: OTCheckListGetApiDataClass[])=>{
          this.valErrArray(OTCheckListGetApiData)
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
