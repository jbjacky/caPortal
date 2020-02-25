import { Component, OnInit, AfterViewInit, ViewChild, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, NgModel } from '@angular/forms';
import { GetApiDataServiceService } from 'src/app/Service/get-api-data-service.service';
import { Observable, BehaviorSubject } from 'rxjs';
import { takeWhile } from 'rxjs/operators';
import { NgxSpinnerService } from 'ngx-spinner';
import { GetApiUserService } from 'src/app/Service/get-api-user.service';
import { doFormatDate, sumbit_formatTimetoString, getapi_formatTimetoString } from 'src/app/UseVoid/void_doFormatDate';
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

  wOtFormState: string = ''
  WriteEmp = { EmpID: null, EmpName: null }
  otFormGroup: otFormClass
  otFormArray: Array<otFormClass> = [];
  LeaveEmpID
  LeaveEmpName
  OtType: string

  constructor(private GetApiDataServiceService: GetApiDataServiceService,
    private GetApiUserService: GetApiUserService,
    private LoadingPage: NgxSpinnerService,
    private fb: FormBuilder,
    private FileDownload: FileDownloadService,) {
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
    var RowIDMax = 0
    if(this.otFormArray!.length > 0 ){
      RowIDMax = Math.max(...this.otFormArray.map(p => p.RowID))
    }
    RowIDMax = RowIDMax + 1
    // console.log(this.otFormGroup)
    var getFormData: otFormClass = this.otFormGroup
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
    getFormData.OtType = this.OtType;
    getFormData.RowID = OtCheck.RowID;
    getFormData.OtAmount = OtAmount;
    getFormData.StartTime = getapi_formatTimetoString(getFormData.StartTime);
    getFormData.EndTime = getapi_formatTimetoString(getFormData.EndTime);
    this.otFormArray.push(getFormData);
    this.NowIsWriteOtForm = false;
  }


  private BeIptEmpID: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  ObIptEmpID$: Observable<any> = this.BeIptEmpID

  setObIptEmpID(iptEmpID: string) {
    this.BeIptEmpID.next(iptEmpID)
  }

  setForm(e: otFormClass) {
    this.otFormGroup = e
  }
  setFormState(s: string) {
    this.wOtFormState = s.toString()
  }

  
  base64(apiFile: uploadFileClass) {
    this.FileDownload.base64(apiFile)
  }

  delOtData(otForm:otFormClass,otFormArray:Array<otFormClass>){
   var delRowIndex = otFormArray.findIndex(x=>x.RowID  == otForm.RowID)
    this.otFormArray.splice(delRowIndex,1)
    if(this.otFormArray!.length == 0){
      this.NowIsWriteOtForm = true
    }
  }
  
  newOtForm(){
    this.NowIsWriteOtForm = true
  }
  disControl(){
    if(this.otFormArray!.length > 0){
      return true
    }else{
      return false
    }
  }
  disSendOtForm(){
    if(this.wOtFormState == "VALID" && this.IptEmpID.disabled){
      return false
    }else if(this.wOtFormState == "VALID" && this.IptEmpID.valid){
      return false
    }else{
      return true
    }
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
  UiEdit:boolean
}
