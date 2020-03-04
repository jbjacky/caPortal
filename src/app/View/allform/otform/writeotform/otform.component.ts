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
import { AsyncValidEmpIDDirective } from 'src/app/ShareDirective/ansyc-valid-emp-id.directive';


declare let $: any; //use jquery

@Component({
  selector: 'app-otform',
  templateUrl: './otform.component.html',
  styleUrls: ['./otform.component.css'],
})
export class OtFormComponent implements OnInit, AfterViewInit, OnDestroy {
  exampleHeader = ExampleHeader //日期套件header
  WriteformPage:boolean = true // 按下一步到明細頁才會是true
  NowIsWriteOtForm: boolean = true

  wOtFormState: string = ''
  otFormGroup: otFormClass
  otFormArray: Array<otFormClass> = [];
  OtType: string
  EmpInfo : EmpClass={
    empID : null,
    empName : null,
    writeEmpID : null,
    writeEmpName : null
  }
  constructor(private GetApiDataServiceService: GetApiDataServiceService,
    private GetApiUserService: GetApiUserService,
    private LoadingPage: NgxSpinnerService,
    private fb: FormBuilder,
    private FileDownload: FileDownloadService, ) {
  }

  @ViewChild('IptEmpID') IptEmpID: NgModel
  @ViewChild(AsyncValidEmpIDDirective) AsyncValidEmpIDDirective: AsyncValidEmpIDDirective
  ngAfterViewInit(): void {
    this.IptEmpID.statusChanges
      .pipe(takeWhile(() => this.api_subscribe))
      .subscribe(
        (status: string) => {
          if (status == 'VALID') {
            // console.log(this.IptEmpID)
            this.EmpInfo.empName = this.AsyncValidEmpIDDirective.EmpName
            this.setObIptEmpID(this.IptEmpID.value)
          }else if (this.IptEmpID.disabled){}
          else{
            this.EmpInfo.empName = ''
          }
        }
      )
  }

  ngOnDestroy(): void {
    this.api_subscribe = false;
  }
  api_subscribe = true; //ngOnDestroy時要取消訂閱api的subscribe
  ngOnInit(): void {
    this.OtType = "1"
    this.GetApiUserService.counter$
      .pipe(takeWhile(() => this.api_subscribe))
      .subscribe(
        (x: any) => {
          if (x == 0) {
          } else {
            this.EmpInfo.empID = x.EmpID
            this.setObIptEmpID(this.EmpInfo.empID)
            this.EmpInfo.writeEmpID = x.EmpID
            this.EmpInfo.writeEmpName = x.EmpNameC
          }
        })
  }
  onSubmit() {
    var OTCheckListGetApiArray: OTCheckListGetApiClass[] = []
    for (let otForm of this.otFormArray) {
      OTCheckListGetApiArray.push({
        "RowID": otForm.RowID,
        "EmpID": this.EmpInfo.empID,
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
    if (this.otFormArray) {
      if (this.otFormArray.length > 0) {
        RowIDMax = Math.max(...this.otFormArray.map(p => p.RowID))
      }
    }
    RowIDMax = RowIDMax + 1
    // console.log(this.otFormGroup)
    var getFormData: otFormClass = this.otFormGroup

    var OtCheck: OTCheckListGetApiClass = {
      "RowID": RowIDMax,
      "EmpID": this.EmpInfo.empID,
      "OtCat": getFormData.OtCat,
      "DateB": doFormatDate(getFormData.StartDate),
      "DateE": doFormatDate(getFormData.EndDate),
      "TimeB": sumbit_formatTimetoString(getFormData.StartTime),
      "TimeE": sumbit_formatTimetoString(getFormData.EndTime),
      "CauseID": getFormData.CauseID,
      "RoteID": "",
      "Card": false,
      "CalculateRes": true,
      "CalculateAtt": true,
      "Time24": false
    }
    OTCheckListGetApiArray.push(OtCheck)
    this.setApiOnSubmit(OTCheckListGetApiArray, OtCheck, getFormData);
  }

  private setApiOnSubmit(OTCheckListGetApiArray: OTCheckListGetApiClass[], OtCheck: OTCheckListGetApiClass, getFormData: otFormClass) {
    if (this.OtType == '1') {
      // 預估加班單
      this.LoadingPage.show();
      this.GetApiDataServiceService.getWebApiData_OTCheckEstimateList(OTCheckListGetApiArray)
        .pipe(takeWhile(() => this.api_subscribe))
        .subscribe((OTCheckListGetApiData: OTCheckListGetApiDataClass[]) => {
          if (this.valErrArray(OTCheckListGetApiData)) {
            this.addOrEditOtFormArray(OTCheckListGetApiData, OtCheck, getFormData);
          }
          this.LoadingPage.hide();
        });
    }
    else if (this.OtType == '2') {
      // 實際加班單
      this.LoadingPage.show();
      this.GetApiDataServiceService.getWebApiData_OTCheckList(OTCheckListGetApiArray)
        .pipe(takeWhile(() => this.api_subscribe))
        .subscribe((OTCheckListGetApiData: OTCheckListGetApiDataClass[]) => {
          if (this.valErrArray(OTCheckListGetApiData)) {
            this.addOrEditOtFormArray(OTCheckListGetApiData, OtCheck, getFormData);
          }
          this.LoadingPage.hide();
        });
    }
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

  /**
   * @todo 加班檢查api回傳Array對應RowID加入計算後的加班時數，假如沒有填寫過就新增，有就修改
   * @param OTCheckListGetApiData api Response data
   * @param OtCheck Request api data
   * @param getFormData 正在填寫的表單資料
   */
  private addOrEditOtFormArray(OTCheckListGetApiData: OTCheckListGetApiDataClass[], OtCheck: OTCheckListGetApiClass, getFormData: otFormClass) {
    var OtAmount = 0;
    OTCheckListGetApiData.forEach(x => {
      if (x.RowID == OtCheck.RowID) {
        OtAmount = x.OTAmount;
      }
    });
    getFormData.OtType = this.OtType;
    getFormData.RowID = OtCheck.RowID;
    getFormData.OtAmount = OtAmount;
    getFormData.StartDate = doFormatDate(getFormData.StartDate);
    getFormData.EndDate = doFormatDate(getFormData.EndDate);
    var isInRow = false //假如沒有填寫過就新增，有就修改
    // for (let o of this.otFormArray) {
    //   if (o.RowID == getFormData.RowID) {
    //     o = getFormData
    //     o.UiEdit = false
    //     isInRow = true
    //   }
    // }
    for(let i = 0 ;i<this.otFormArray.length ; i++){
      if(this.otFormArray[i].RowID == getFormData.RowID){
        this.otFormArray[i] = getFormData
        this.otFormArray[i].UiEdit = false
        isInRow = true
      }
    }
    if (!isInRow) {
      this.otFormArray.push(getFormData);
      this.NowIsWriteOtForm = false;
    }
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

  editOtForm: editOtForm[] = []
  setEditForm(e: otFormClass) {
    this.otFormGroup = e
    var isEditForm: boolean = false
    for (let a of this.editOtForm) {
      if (a.otForm.RowID == e.RowID) {
        a.otForm = e
        isEditForm = true
      }
    }
    if (!isEditForm && e.RowID != 0) {
      this.editOtForm.push({
        otForm: e,
        state: null
      })
    }
  }
  setEditFormState(s: string, eRowID: string) {
    for (let a of this.editOtForm) {
      if (a.otForm.RowID == eRowID) {
        a.state = s
      }
    }
  }

  disEditSendOtForm(eRowID: string) {
    for (let e of this.editOtForm) {
      if (e.otForm.RowID == eRowID) {
        if (e.state == "VALID" && this.IptEmpID.disabled) {
          return false
        } else if (e.state == "VALID" && this.IptEmpID.valid) {
          return false
        } else {
          return true
        }
      }
    }
  }

  onEditSubmit() {
    var OTCheckListGetApiArray: OTCheckListGetApiClass[] = []
    for (let otForm of this.otFormArray) {
      OTCheckListGetApiArray.push({
        "RowID": otForm.RowID,
        "EmpID": this.EmpInfo.empID,
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

    var OtCheck: OTCheckListGetApiClass
    var getFormData: otFormClass
    for (let i = 0; i < OTCheckListGetApiArray.length; i++) {
      for (let e = 0; e < this.editOtForm.length; e++) {
        if (OTCheckListGetApiArray[i].RowID == this.editOtForm[e].otForm.RowID) {
          OtCheck = {
            "RowID": this.editOtForm[e].otForm.RowID,
            "EmpID": this.EmpInfo.empID,
            "OtCat": this.editOtForm[e].otForm.OtCat,
            "DateB": doFormatDate(this.editOtForm[e].otForm.StartDate),
            "DateE": doFormatDate(this.editOtForm[e].otForm.EndDate),
            "TimeB": sumbit_formatTimetoString(this.editOtForm[e].otForm.StartTime),
            "TimeE": sumbit_formatTimetoString(this.editOtForm[e].otForm.EndTime),
            "CauseID": this.editOtForm[e].otForm.CauseID,
            "RoteID": "",
            "Card": false,
            "CalculateRes": true,
            "CalculateAtt": true,
            "Time24": false
          }
          OTCheckListGetApiArray[i] = OtCheck
          getFormData = this.editOtForm[e].otForm
        }
      }
    }
    this.setApiOnSubmit(OTCheckListGetApiArray, OtCheck, getFormData);
  }

  base64(apiFile: uploadFileClass) {
    this.FileDownload.base64(apiFile)
  }

  delOtData(otForm: otFormClass, otFormArray: Array<otFormClass>) {
    var delRowIndex = otFormArray.findIndex(x => x.RowID == otForm.RowID)
    this.otFormArray.splice(delRowIndex, 1)
    if (this.otFormArray!.length == 0) {
      this.NowIsWriteOtForm = true
    }
  }

  newOtForm() {
    this.NowIsWriteOtForm = true
  }
  disControl() {
    if (this.otFormArray!.length > 0) {
      return true
    } else {
      return false
    }
  }
  disSendOtForm() {
    if (this.wOtFormState == "VALID" && this.IptEmpID.disabled) {
      return false
    } else if (this.wOtFormState == "VALID" && this.IptEmpID.valid) {
      return false
    } else {
      return true
    }
  }
  nextPage(){
    this.WriteformPage = false;
    window.scroll(0, 0);
  }
  onCounterChange() {
    this.WriteformPage = true;
    window.scroll(0, 0);
    //返回修改按鈕，在vaformdetail.component.html
  }
}

class editOtForm {
  otForm: otFormClass;
  state: string;
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
  OtCatName: any
  CauseID: any
  CauseName: any
  DeptsID: any
  DeptsName: any
  Note: any
  FileUpload: uploadFileClass[]
  OtAmount: any
  UiEdit: boolean
}
export class EmpClass{
  empID : string
  empName : string
  writeEmpID : string
  writeEmpName : string
}
