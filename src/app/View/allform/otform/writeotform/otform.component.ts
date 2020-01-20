import { Component, OnInit, OnChanges, SimpleChanges, AfterViewInit, NgZone, ViewChild, ElementRef, DoCheck, OnDestroy } from '@angular/core';
import { FormBuilder, Validators, FormControl, ValidatorFn, AbstractControl, AsyncValidatorFn, ValidationErrors, FormGroup } from '@angular/forms';
import { GetApiDataServiceService } from 'src/app/Service/get-api-data-service.service';
import { Observable, timer } from 'rxjs';
import { map, debounceTime, switchMap, takeWhile } from 'rxjs/operators';
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
    $("#id_bt_starttime").timeDropper({
      format: 'HH:mm',
      autoswitch: false,
      mousewheel: true,
      setCurrentTime: false
    });
    $("#id_bt_endtime").timeDropper({
      format: 'HH:mm',
      autoswitch: false,
      mousewheel: true,
      setCurrentTime: false
    });
    $("#id_bt_starttime").change(() => {
      this.dateTimeS = $("#id_bt_starttime").val()
      this.StartTime.setValue($("#id_bt_starttime").val());
    });
    $("#id_bt_endtime").change(() => {
      this.dateTimeE = $("#id_bt_starttime").val()
      this.EndTime.setValue($("#id_bt_endtime").val());
    });

  }

  ngOnDestroy(): void {
    // throw new Error("Method not implemented.");
    this.api_subscribe = false;
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
          this.LoadingPage.hide()
        })

  }
  resetFormGroup() {
    this.otFormGroup.reset()
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


class otFormClass {
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
