import { Component, OnInit, OnChanges, SimpleChanges, AfterViewInit, NgZone, ViewChild, ElementRef, DoCheck, OnDestroy } from '@angular/core';
import { FormBuilder, Validators, FormControl, ValidatorFn, AbstractControl, AsyncValidatorFn, ValidationErrors, FormGroup } from '@angular/forms';
import { GetApiDataServiceService } from 'src/app/Service/get-api-data-service.service';
import { Observable, timer, BehaviorSubject } from 'rxjs';
import { map, debounceTime, switchMap, takeWhile, distinctUntilChanged, filter } from 'rxjs/operators';
import { resolve, reject } from 'q';
import { jbUserLoginClass, jbLoginDataClass } from 'src/app/Models/PostData_API_Class/jbUserLoginClass';
import { GetOtCauseByFormDataClass } from 'src/app/Models/GetOtCauseByForm';
import { NgxSpinnerService } from 'ngx-spinner';
import { GetApiUserService } from 'src/app/Service/get-api-user.service';
import { GetBaseInfoDetailClass } from 'src/app/Models/GetBaseInfoDetailClass';
import { isValidTime, isValidDate } from 'src/app/UseVoid/void_isVaildDatetime';
import { doFormatDate, sumbit_formatTimetoString } from 'src/app/UseVoid/void_doFormatDate';
import { ExampleHeader } from 'src/app/Service/datepickerHeader';
import { GetOtCalculateGetApiClass } from 'src/app/Models/PostData_API_Class/GetOtCalculateGetApiClass';


declare let $: any; //use jquery

@Component({
  selector: 'app-otform',
  templateUrl: './otform.component.html',
  styleUrls: ['./otform.component.css']
})
export class OtformComponent implements OnInit, AfterViewInit, OnDestroy {
  exampleHeader = ExampleHeader //日期套件header
  NowIsWriteOtForm: boolean = true
  showOtform() {
    this.NowIsWriteOtForm = true
    this.resetFormGroup(this.EmpID.value.toString());
  }
  @ViewChild('Tname') Tnam: FormControl

  WriteEmp = { EmpID: null, EmpName: null }
  password
  otFormGroup: FormGroup
  //  = new FormGroup({
  //   EmpID: new FormControl('0004420', Validators.required, [this.getValidatorFn()]),
  //   StartDate: new FormControl('', this.checkDate()),
  //   EndDate: new FormControl('', this.checkDate()),
  //   StartTime: new FormControl('', this.checkTime()),
  //   EndTime: new FormControl('', this.checkTime()),
  //   CauseID: new FormControl('', Validators.required),
  //   DeptsID: new FormControl('', Validators.required),
  //   Note: new FormControl(),
  //   FileUpload: new FormControl()
  // });
  otFormArray: Array<otFormClass>;

  get EmpID() { return this.otFormGroup.get('EmpID'); }
  get StartDate() { return this.otFormGroup.get('StartDate'); }
  get EndDate() { return this.otFormGroup.get('EndDate'); }
  get StartTime() { return this.otFormGroup.get('StartTime'); }
  get EndTime() { return this.otFormGroup.get('EndTime'); }
  get CauseID() { return this.otFormGroup.get('CauseID'); }
  get DeptsID() { return this.otFormGroup.get('DeptsID'); }
  createForm(EmpID: string) {
    this.EmpID.setValue(EmpID)
    this.StartDate.setValue(new Date())
    this.EndDate.setValue(new Date())
    this.StartTime.setValue('00:00')
    this.EndTime.setValue('00:00')
  }
  constructor(private GetApiDataServiceService: GetApiDataServiceService,
    private GetApiUserService: GetApiUserService,
    private LoadingPage: NgxSpinnerService,
    private fb: FormBuilder) {
    var _otform: otFormClass = {
      OtType: ['1', Validators.required],
      EmpID: ['', Validators.required, [this.getValidatorFn()]],
      StartDate: ['', this.checkDate()],
      EndDate: ['', this.checkDate()],
      StartTime: ['', this.checkTime()],
      EndTime: ['', this.checkTime()],
      OtCat: ['1', Validators.required],
      CauseID: ['', Validators.required],
      DeptsID: ['', Validators.required],
      Note: '',
      FileUpload: ''
    }
    this.otFormGroup = this.fb.group(_otform)
  }
  dateTimeS = ''
  dateTimeE = ''
  CauseOption = []
  NgxDeptsSelectBox = [];
  leaveman_name = '';
  starttimeMask(): {
    mask: Array<string | RegExp>;
    keepCharPositions: boolean;
  } {
    return {
      mask: [/[0-2]/, this.dateTimeS.toString() && parseInt(this.dateTimeS[0].toString()) > 1 ? /[0-3]/ : /\d/, ':', /[0-5]/, /\d/],
      keepCharPositions: true
    };
  }

  endtimeMask(): {
    mask: Array<string | RegExp>;
    keepCharPositions: boolean;
  } {
    return {
      mask: [/[0-2]/, this.dateTimeE.toString() && parseInt(this.dateTimeE[0].toString()) > 1 ? /[0-3]/ : /\d/, ':', /[0-5]/, /\d/],
      keepCharPositions: true
    };
  }
  ngAfterViewInit(): void {
    var a = this;
    // $("#id_bt_starttime").change(() => {
    //   this.dateTimeS = $("#id_bt_starttime").val()
    //   this.StartTime.setValue($("#id_bt_starttime").val());
    // });
    // $("#id_bt_endtime").change(() => {
    //   this.dateTimeE = $("#id_bt_starttime").val()
    //   this.EndTime.setValue($("#id_bt_endtime").val());
    // });

  }

  @ViewChild('StartTimeView') StartTimeView: ElementRef;
  changeStartTimeView() {
    this.dateTimeS = $("#id_bt_starttime").val()

    $(this.StartTimeView.nativeElement)
      .on('change', (e, args) => {
        this.dateTimeS = $("#id_bt_starttime").val()
        this.StartTime.setValue($("#id_bt_starttime").val());
      });
  }
  @ViewChild('EndTimeView') EndTimeView: ElementRef;
  changeEndTimeView() {
    this.dateTimeE = $("#id_bt_endtime").val()
    $(this.EndTimeView.nativeElement)
      .on('change', (e, args) => {
        this.dateTimeE = $("#id_bt_endtime").val()
        this.EndTime.setValue($("#id_bt_endtime").val());
      });
  }

  ngOnDestroy(): void {
    // throw new Error("Method not implemented.");
    this.api_subscribe = false;

    $(this.StartTimeView.nativeElement).unbind()
    $(this.EndTimeView.nativeElement).unbind()
  }
  api_subscribe = true; //ngOnDestroy時要取消訂閱api的subscribe
  ngOnInit(): void {
    this.StartTime.valueChanges.subscribe(
      (x: any) => {
        this.dateTimeS = x
      }
    )
    this.EndTime.valueChanges.subscribe(
      (x: any) => {
        this.dateTimeE = x
      }
    )
    this.GetApiUserService.counter$.subscribe(
      (x: any) => {
        if (x == 0) {
        } else {
          this.testText = x.EmpID
          this.Be_Text.next(this.testText)

          this.WriteEmp = { EmpID: x.EmpID, EmpName: x.EmpNameC }
          this.createForm(x.EmpID)
          this.GetApiDataServiceService.getWebApiData_GetOtCauseByForm()
            .pipe(takeWhile(() => this.api_subscribe))
            .subscribe(
              (GetOtCauseByForm: GetOtCauseByFormDataClass[]) => {
                // console.log(x)
                this.CauseOption = GetOtCauseByForm
                this.CauseID.setValue(GetOtCauseByForm[0].CauseID)
                this.GetApiDataServiceService.getWebApiData_GetDepts()
                  .pipe(takeWhile(() => this.api_subscribe))
                  .subscribe(
                    (y: any[]) => {
                      this.NgxDeptsSelectBox = JSON.parse(JSON.stringify(y))
                      this.DeptsID.setValue(x.DeptcID)
                    })
              }
            )
        }
      })
  }
  onSubmit() {
    console.log(this.otFormGroup.value)
    var getData: otFormClass = this.otFormGroup.value
    var GetOtCalculateGetApi: GetOtCalculateGetApiClass = {
      "EmpID": getData.EmpID,
      "OtCat": getData.OtCat,
      "DateB": doFormatDate(getData.StartDate),
      "DateE": doFormatDate(getData.EndDate),
      "TimeB": sumbit_formatTimetoString(getData.StartTime),
      "TimeE": sumbit_formatTimetoString(getData.EndTime),
      "CauseID": getData.CauseID,
      "RoteID": "",
      "CalculateRes": true,
      "CalculateAtt": true,
      "Time24": false
    }
    this.LoadingPage.show()
    this.GetApiDataServiceService.getWebApiData_GetOtCalculate(GetOtCalculateGetApi)
      .pipe(takeWhile(() => this.api_subscribe))
      .subscribe(
        (x: any) => {
          alert(x)
          this.NowIsWriteOtForm = false
          this.LoadingPage.hide()
        })

  }
  resetFormGroup(EmpID: string) {
    var _otform: otFormClass = {
      OtType: ['1', Validators.required],
      EmpID: [EmpID, Validators.required, [this.getValidatorFn()]],
      StartDate: ['', this.checkDate()],
      EndDate: ['', this.checkDate()],
      StartTime: ['', this.checkTime()],
      EndTime: ['', this.checkTime()],
      OtCat: ['1', Validators.required],
      CauseID: ['', Validators.required],
      DeptsID: ['', Validators.required],
      Note: '',
      FileUpload: ''
    }
    this.otFormGroup = this.fb.group(_otform)
    this.createForm(EmpID)
    this.CauseID.setValue(this.CauseOption[0].CauseID)
  }
  login() {
    var checkData = this.otFormGroup.value
    var jbUserLogin: jbUserLoginClass = {
      Account: checkData.EmpID,
      Password: checkData.address
    }
    this.GetApiDataServiceService.getWebApiData_jbLoggin(jbUserLogin)
      .pipe(takeWhile(() => this.api_subscribe))
      .subscribe(
        (x: jbLoginDataClass) => {
          if (x.Pass) {
            alert('pass')
          } else {
            this.EmpID.setErrors({
              errorEmpID: true
            })
          }
        }
      )

  }
  getValidatorFn(): AsyncValidatorFn {
    return (control: AbstractControl): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> => {
      let debounceTime = 1500; //milliseconds
      return timer(debounceTime).pipe(
        switchMap(() => {
          this.LoadingPage.show()
          var req = this.GetApiDataServiceService.getWebApiData_GetBaseInfoDetail(control.value)
            .pipe(
              map(
                (serviceResponse: GetBaseInfoDetailClass[]) => {
                  // console.log(serviceResponse)
                  this.LoadingPage.hide()
                  if (serviceResponse.length > 0) {
                    this.leaveman_name = serviceResponse[0].EmpNameC
                    this.DeptsID.setValue(serviceResponse[0].DeptcID)
                    return null
                  } else {
                    this.leaveman_name = '';
                    return { errorEmpID: 'errorEmpIDS' }
                  }
                })
            )
          // console.log(req)
          // console.log(this.EmpID.status)
          return req
        })
      )
    };
  }

  checkUpdate() {
    if (this.Tnam.valid) {
      return false
    } else {
      return true
    }
  }

  checkDate(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      if (!control.value) {
        return { 'forbiddenName': 'dateNull' }
      } else if (!isValidDate(doFormatDate(control.value))) {
        return { 'forbiddenName': 'dateFail' }
      } else {

        var StartDateTime = new Date(doFormatDate(this.StartDate.value) + ' ' + this.StartTime.value)
        var EndDateTime = new Date(doFormatDate(this.EndDate.value) + ' ' + this.EndTime.value)

        if (this.isStartNoLargeEndDateTime(StartDateTime, EndDateTime)) {
          return { 'forbiddenName': 'dateTimeFail' }
        } else if (control.value) {
          return null
        }

      }
    };
  }
  checkTime(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      // console.log(control.value)
      if (!control.value) {
        return { 'forbiddenName': 'timeNull' }
      } else if (!isValidTime(control.value)) {
        return { 'forbiddenName': 'timeFail' }
      } else {

        var StartDateTime = new Date(doFormatDate(this.StartDate.value) + ' ' + this.StartTime.value)
        var EndDateTime = new Date(doFormatDate(this.EndDate.value) + ' ' + this.EndTime.value)
        if (this.isStartNoLargeEndDateTime(StartDateTime, EndDateTime)) {
          return { 'forbiddenName': 'dateTimeFail' }
        } else if (control.value) {
          return null
        }
      }
    };
  }

  isStartNoLargeEndDateTime(StartDateTime: Date, EndDateTime: Date) {
    if (StartDateTime > EndDateTime) {
      return true
    } else {
      if (isValidDate(doFormatDate(this.StartDate.value)))
        this.StartDate.setErrors(null)
      if (isValidTime(this.StartTime.value))
        this.StartTime.setErrors(null)
      if (isValidDate(doFormatDate(this.EndDate.value)))
        this.EndDate.setErrors(null)
      if (isValidTime(this.EndTime.value))
        this.EndTime.setErrors(null)
      return false
    }
  }
  onSaveFile(event) {
    this.otFormGroup.get('FileUpload').setValue(event);
    // console.log(event)
  }


  testText = ""
  private Be_Text: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  Ob_Text$: Observable<any> = this.Be_Text.pipe(
    debounceTime(1000), // 當 300 毫秒沒有新資料時，才進行搜尋
  )
  cText() {
    this.Be_Text.next(this.testText)
  }
  setForm(e) {
    // console.log(e)
  }

  eFileArray = [{
    UploadName: "sql降版還原.txt",
    Blob: "Ly8gc3FsIDIwMTazxqX3ICAyMDA4IMHZrewNCg0Kpf2mYjIwMTYiq/ypdyK46q7Grnela8HkwkmkdadALT6216VYuOquxrxowLOlzrV7pqEgsqOlzS5iYWNwYWPAya7XDQoNCrG1tdumQTIwMDgguOquxq53pWvB5MJJttekSrjqrsa8aMCzpc61e6ahDQoNCrCypnCyo6XNv/m7fiANCg0Kp+K/+bt+wMmu16W0tn2s3axPrf6t06v8pU+9WL/5DQoNCrG1tdumYqfis8al96q6uOquxq53LmJhY3BhY8DJpVsuemlwIMX9pUzF3MCjwVnAyQ0KDQqltLZ9wKPBWcDJDQoNCqZBrden77jMrbGqum1vZGFsLnhtbLjyT3JpZ2luLnhtbA0KDQptb2RhbC54bWwgrW6t16fvv/m7fqq6q/ylT71YILCypnCsT0dyYW50tE6n4iBFbGVtZW50IFR5cGU9IkdyYW50IiCms8P2qrql/qzlDQoNCqfvp7ltb2RhbC54bWwgq+GmXaywwMmu12hhc2i9WLd8xdyn8yCp0qVIrW6n709yaWdpbi54bWwNCg0Kpf2o7HBvd2Vyc2hlbGwgpFUgR2V0LUZpbGVIYXNoIC1QYXRoIC5cbW9kYWwueG1sDQoNCqj6sW+l2KtlIG1vZGFsLnhtbCCquiBoYXNovVgNCg0KpkGo7E9yaWdpbi54bWwNCq3Xp+88Q2hlY2tzdW0gVXJpPSIvbW9kZWwueG1sIj6p8Whhc2g8L0NoZWNrc3VtPg0KDQqt16fvbW9kYWwueG1soUJPcmlnaW4ueG1sq+GmQafiemlwwMmn76ZeLmJhY3BhY8DJDQoNCq2rt3OmQbbXpEq46q7GrnekQKa4DQoNCrCypnDB2aazv/kgtE6tq73GpFetsaq6sMqnQA0KDQoNCg0KDQo=",
    Type: "text/plain",
    Size: 704,
    Description: ""
  }]

}

export function forbiddenNameValidator(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    console.log(control.value)
    if (control.value == '644488') {
      return null
    } else {
      return { 'forbiddenName': control.value }
    }
  };
}


export class otFormClass {
  OtType: any
  EmpID: any
  StartDate: any
  EndDate: any
  StartTime: any
  EndTime: any
  OtCat: any
  CauseID: any
  DeptsID: any
  Note: any
  FileUpload: any
}
