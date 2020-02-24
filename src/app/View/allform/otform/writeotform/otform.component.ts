import { Component, OnInit, AfterViewInit, ViewChild, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, NgModel } from '@angular/forms';
import { GetApiDataServiceService } from 'src/app/Service/get-api-data-service.service';
import { Observable, BehaviorSubject } from 'rxjs';
import { takeWhile } from 'rxjs/operators';
import { NgxSpinnerService } from 'ngx-spinner';
import { GetApiUserService } from 'src/app/Service/get-api-user.service';
import { doFormatDate, sumbit_formatTimetoString } from 'src/app/UseVoid/void_doFormatDate';
import { ExampleHeader } from 'src/app/Service/datepickerHeader';
import { OTCheckListGetApiClass } from 'src/app/Models/PostData_API_Class/OTCheckListGetApiClass';
import { OTCheckListGetApiDataClass } from 'src/app/Models/OTCheckListGetApiDataClass';
import { uploadFileClass } from 'src/app/Models/uploadFileClass';
import { FileDownloadService } from 'src/app/Service/file-download.service';


declare let $: any; //use jquery

@Component({
  selector: 'app-otform',
  templateUrl: './otform.component.html',
  styleUrls: ['./otform.component.css'],
})
export class OtFormComponent implements OnInit, AfterViewInit, OnDestroy {
  exampleHeader = ExampleHeader //日期套件header
  NowIsWriteOtForm: boolean = true
  showOtform() {
    this.NowIsWriteOtForm = true
  }

  wOtFormState: string = ''
  WriteEmp = { EmpID: null, EmpName: null }
  otFormGroup: FormGroup
  otFormArray: Array<otFormClass> = [];
  LeaveEmpID
  LeaveEmpName
  OtType: string

  constructor(private GetApiDataServiceService: GetApiDataServiceService,
    private GetApiUserService: GetApiUserService,
    private LoadingPage: NgxSpinnerService,
    private fb: FormBuilder,
    private FileDownload: FileDownloadService,) {
    var _otform: otFormClass = new otFormClass()
    this.otFormGroup = this.fb.group(_otform)
  }

  @ViewChild('IptEmpID') IptEmpID: NgModel
  ngAfterViewInit(): void {
  }

  ngOnDestroy(): void {
    this.api_subscribe = false;
  }
  api_subscribe = true; //ngOnDestroy時要取消訂閱api的subscribe
  ngOnInit(): void {
    this.OtType = "1"
    this.IptEmpID.control.statusChanges
      .pipe(takeWhile(() => this.api_subscribe))
      .subscribe(
        (status: string) => {
          if (status == 'VALID') {
            // console.log(this.IptEmpID)
            this.setObIptEmpID(this.IptEmpID.value)
          }
        }
      )
    this.GetApiUserService.counter$
      .pipe(takeWhile(() => this.api_subscribe))
      .subscribe(
        (x: any) => {
          if (x == 0) {
          } else {
            this.LeaveEmpID = x.EmpID
            this.setObIptEmpID(this.LeaveEmpID)

            this.WriteEmp = { EmpID: x.EmpID, EmpName: x.EmpNameC }
          }
        })
  }
  onSubmit() {
    console.log(this.otFormGroup)
    this.LoadingPage.show()
    var OTCheckListGetApiArray: OTCheckListGetApiClass[] = []
    for (let otForm of this.otFormArray) {
      OTCheckListGetApiArray.push({
        "RowID": otForm.RowID,
        "EmpID": this.LeaveEmpID,
        "OtCat": otForm.OtCat,
        "DateB": doFormatDate(otForm.StartDate),
        "DateE": doFormatDate(otForm.EndDate),
        "TimeB": sumbit_formatTimetoString(otForm.StartTime),
        "TimeE": sumbit_formatTimetoString(otForm.EndTime),
        "CauseID": otForm.CauseID,
        "RoteID": "",
        "Card": false,
        "CalculateRes": true,
        "CalculateAtt": true,
        "Time24": false
      })
    }
    var RowIDMax = 1 
    if(this.otFormArray!.length > 0 ){
      Math.max(...this.otFormArray.map(p => p.RowID))
    }
    RowIDMax = RowIDMax + 1
    var getFormData: otFormClass = this.otFormGroup.value
    getFormData.StartDate = doFormatDate(getFormData.StartDate)
    getFormData.EndDate =  doFormatDate(getFormData.EndDate),
    getFormData.StartTime =  sumbit_formatTimetoString(getFormData.StartTime),
    getFormData.EndTime =  sumbit_formatTimetoString(getFormData.EndTime)
    
    var OtCheck: OTCheckListGetApiClass = {
      "RowID": RowIDMax,
      "EmpID": this.LeaveEmpID,
      "OtCat": getFormData.OtCat,
      "DateB": getFormData.StartDate,
      "DateE": getFormData.EndDate,
      "TimeB": getFormData.StartTime,
      "TimeE": getFormData.EndTime,
      "CauseID": getFormData.CauseID,
      "RoteID": "",
      "Card": false,
      "CalculateRes": true,
      "CalculateAtt": true,
      "Time24": false
    }
    OTCheckListGetApiArray.push(OtCheck)
    if (this.OtType == '1') {
      // 預估加班單
      this.GetApiDataServiceService.getWebApiData_OTCheckEstimateList(OTCheckListGetApiArray)
        .pipe(takeWhile(() => this.api_subscribe))
        .subscribe(
          (OTCheckListGetApiData: OTCheckListGetApiDataClass[]) => {
            if(this.valErrArray(OTCheckListGetApiData)){
              this.addOtFormArray(OTCheckListGetApiData, OtCheck, getFormData);
            }
            this.LoadingPage.hide()
          })
    } else if (this.OtType == '2') {
      // 實際加班單
      this.GetApiDataServiceService.getWebApiData_OTCheckList(OTCheckListGetApiArray)
        .pipe(takeWhile(() => this.api_subscribe))
        .subscribe(
          (OTCheckListGetApiData: OTCheckListGetApiDataClass[]) => {
            if(this.valErrArray(OTCheckListGetApiData)){
              this.addOtFormArray(OTCheckListGetApiData, OtCheck, getFormData);
            }
            this.LoadingPage.hide()
          })
    }
  }

  /**
   * @todo 驗證加班檢查api回傳有無錯誤
   */
  private valErrArray(OTCheckListGetApiData: OTCheckListGetApiDataClass[]){
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

  /**
   * @todo 加班檢查api回傳Array對應RowID加入計算後的加班時數
   */
  private addOtFormArray(OTCheckListGetApiData: OTCheckListGetApiDataClass[], OtCheck: OTCheckListGetApiClass, getFormData: otFormClass) {
    var OtAmount = 0;
    OTCheckListGetApiData.forEach(x => {
      if (x.RowID == OtCheck.RowID) {
        OtAmount = x.OTAmount;
      }
    });
    getFormData.RowID = OtCheck.RowID;
    getFormData.OtAmount = OtAmount;
    this.otFormArray.push(getFormData);
  }


  private BeIptEmpID: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  ObIptEmpID$: Observable<any> = this.BeIptEmpID

  setObIptEmpID(iptEmpID: string) {
    this.BeIptEmpID.next(iptEmpID)
  }

  setForm(e: otFormClass) {
    this.otFormGroup = this.fb.group(e)
  }
  setFormState(s: string) {
    this.wOtFormState = s.toString()
  }

  eFileArray = [{
    UploadName: "sql降版還原.txt",
    Blob: "Ly8gc3FsIDIwMTazxqX3ICAyMDA4IMHZrewNCg0Kpf2mYjIwMTYiq/ypdyK46q7Grnela8HkwkmkdadALT6216VYuOquxrxowLOlzrV7pqEgsqOlzS5iYWNwYWPAya7XDQoNCrG1tdumQTIwMDgguOquxq53pWvB5MJJttekSrjqrsa8aMCzpc61e6ahDQoNCrCypnCyo6XNv/m7fiANCg0Kp+K/+bt+wMmu16W0tn2s3axPrf6t06v8pU+9WL/5DQoNCrG1tdumYqfis8al96q6uOquxq53LmJhY3BhY8DJpVsuemlwIMX9pUzF3MCjwVnAyQ0KDQqltLZ9wKPBWcDJDQoNCqZBrden77jMrbGqum1vZGFsLnhtbLjyT3JpZ2luLnhtbA0KDQptb2RhbC54bWwgrW6t16fvv/m7fqq6q/ylT71YILCypnCsT0dyYW50tE6n4iBFbGVtZW50IFR5cGU9IkdyYW50IiCms8P2qrql/qzlDQoNCqfvp7ltb2RhbC54bWwgq+GmXaywwMmu12hhc2i9WLd8xdyn8yCp0qVIrW6n709yaWdpbi54bWwNCg0Kpf2o7HBvd2Vyc2hlbGwgpFUgR2V0LUZpbGVIYXNoIC1QYXRoIC5cbW9kYWwueG1sDQoNCqj6sW+l2KtlIG1vZGFsLnhtbCCquiBoYXNovVgNCg0KpkGo7E9yaWdpbi54bWwNCq3Xp+88Q2hlY2tzdW0gVXJpPSIvbW9kZWwueG1sIj6p8Whhc2g8L0NoZWNrc3VtPg0KDQqt16fvbW9kYWwueG1soUJPcmlnaW4ueG1sq+GmQafiemlwwMmn76ZeLmJhY3BhY8DJDQoNCq2rt3OmQbbXpEq46q7GrnekQKa4DQoNCrCypnDB2aazv/kgtE6tq73GpFetsaq6sMqnQA0KDQoNCg0KDQo=",
    Type: "text/plain",
    Size: 704,
    Description: ""
  }]
  
  base64(apiFile: uploadFileClass) {
    this.FileDownload.base64(apiFile)
  }

}



export class otFormClass {
  RowID: any
  OtType: any
  EmpID: any
  StartDate: any
  EndDate: any
  StartTime: any
  EndTime: any
  OtCat: any
  CauseID: any
  CauseName: any
  DeptsID: any
  DeptsName: any
  Note: any
  FileUpload: any
  OtAmount: any
}
