import { Component, OnInit, Output, EventEmitter, Input, OnDestroy, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { BehaviorSubject, Observable, timer } from 'rxjs';
import { FormGroup, FormBuilder, Validators, ValidatorFn, AbstractControl, AsyncValidatorFn, ValidationErrors } from '@angular/forms';
import { GetApiDataServiceService } from 'src/app/Service/get-api-data-service.service';
import { GetApiUserService } from 'src/app/Service/get-api-user.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { otFormClass } from '../writeotform/otform.component';
import { isValidTime, isValidDate } from 'src/app/UseVoid/void_isVaildDatetime';
import { doFormatDate, reSplTimeHHmm } from 'src/app/UseVoid/void_doFormatDate';
import { switchMap, map, takeWhile, first } from 'rxjs/operators';
import { GetBaseInfoDetailClass } from 'src/app/Models/GetBaseInfoDetailClass';
import { GetOtCauseByFormDataClass } from 'src/app/Models/GetOtCauseByForm';
import { ExampleHeader } from 'src/app/Service/datepickerHeader';
import { uploadFileClass } from 'src/app/Models/uploadFileClass';
import { GetDeptsGetApiData } from 'src/app/Models/GetDeptsGetApiData';
import { isInDateArray, SEDate } from 'src/app/UseVoid/void_isInDateArray';

declare let $: any; //use jquery

@Component({
  selector: 'app-ot-form-temp',
  templateUrl: './ot-form-temp.component.html',
  styleUrls: ['./ot-form-temp.component.css']
})
export class OtFormTempComponent implements OnInit, AfterViewInit, OnDestroy {
  exampleHeader = ExampleHeader //日期套件header

  @Input() editFileArray: uploadFileClass[] //表單陣列內的上傳檔案
  @Input() OtFormArray: Array<otFormClass> //現在表單的陣列
  startTimeDropper: any
  endTimeDropper: any
  @Input() UiTemp: string //給日期、時間多組不同id設定
  id_bt_starttime
  id_bt_endtime
  id_ipt_starttime
  id_ipt_endtime
  ngAfterViewInit(): void {
    this.startTimeDropper = $("#" + this.id_bt_starttime).timeDropper({
      format: 'HH:mm',
      autoswitch: false,
      mousewheel: true,
      setCurrentTime: false
    });
    // $("#id_bt_endtime").val('17:00');
    this.endTimeDropper = $("#" + this.id_bt_endtime).timeDropper({
      format: 'HH:mm',
      autoswitch: false,
      mousewheel: true,
      setCurrentTime: false
    });
  }
  @ViewChild('StartTimeView') StartTimeView: ElementRef;
  changeStartTimeView() {
    if (this.StartTime.value == '') {
      this.StartTime.setValue('00:00')
    }
    if (!$('#' + this.id_ipt_starttime).hasClass('uiTimeDropper')) {
      !$('#' + this.id_ipt_starttime).addClass('uiTimeDropper')
    }
    this.startTimeDropper[0].myprop1(reSplTimeHHmm(this.StartTime.value).HH, reSplTimeHHmm(this.StartTime.value).mm);
    $(this.StartTimeView.nativeElement)
      .on('change', (e, args) => {
        this.StartTime.setValue($("#" + this.id_bt_starttime).val())
      });
  }
  @ViewChild('EndTimeView') EndTimeView: ElementRef;
  changeEndTimeView() {
    if (this.EndTime.value == '') {
      this.EndTime.setValue('00:00')
    }
    if (!$('#' + this.id_ipt_endtime).hasClass('uiTimeDropper')) {
      !$('#' + this.id_ipt_endtime).addClass('uiTimeDropper')
    }
    this.endTimeDropper[0].myprop1(reSplTimeHHmm(this.EndTime.value).HH, reSplTimeHHmm(this.EndTime.value).mm);
    $(this.EndTimeView.nativeElement)
      .on('change', (e, args) => {
        this.EndTime.setValue($("#" + this.id_bt_endtime).val())
      });
  }


  ngOnDestroy(): void {
    this.api_subscribe = false;
  }
  api_subscribe = true; //ngOnDestroy時要取消訂閱api的subscribe

  @Input() ObIptEmpID$: Observable<any> //取得目前表單內容(修改功能用)
  @Output() SetOtForm: EventEmitter<any> = new EventEmitter<any>(); //使用者輸入表單的資料
  @Output() SetOtFormState: EventEmitter<any> = new EventEmitter<any>(); //使用者輸入表單驗證

  private Be_setOtFormData$: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  Ob_setOtFormData$: Observable<any> = this.Be_setOtFormData$;
  dateTimeS = ''
  dateTimeE = ''
  CauseOption: GetOtCauseByFormDataClass[] = []
  NgxDeptsSelectBox: GetDeptsGetApiData[] = [];
  starttimeMask(): {
    mask: Array<string | RegExp>;
    keepCharPositions: boolean;
  } {
    return {
      mask: [/[0-2]/, $("#" + this.id_ipt_starttime).val() && parseInt($("#" + this.id_ipt_starttime).val()[0]) > 1 ? /[0-3]/ : /\d/, ':', /[0-5]/, /\d/],
      keepCharPositions: true
    };
  }

  endtimeMask(): {
    mask: Array<string | RegExp>;
    keepCharPositions: boolean;
  } {
    return {
      mask: [/[0-2]/, $("#" + this.id_ipt_endtime).val() && parseInt($("#" + this.id_ipt_endtime).val()[0]) > 1 ? /[0-3]/ : /\d/, ':', /[0-5]/, /\d/],
      keepCharPositions: true
    };
  }
  constructor(private GetApiDataServiceService: GetApiDataServiceService,
    private GetApiUserService: GetApiUserService,
    private LoadingPage: NgxSpinnerService,
    private fb: FormBuilder) {
    var _otform: otFormClass = {
      RowID: 0,
      OtType: ['1'],
      EmpID: [''],
      StartDate: ['', this.checkDate()],
      EndDate: ['', this.checkDate()],
      StartTime: ['', this.checkTime()],
      EndTime: ['', this.checkTime()],
      OtCat: ['1', Validators.required],
      CauseID: ['', Validators.required],
      CauseName: '',
      DeptsID: ['', Validators.required],
      DeptsName: '',
      Note: '',
      FileUpload: '',
      OtAmount: null,
      UiEdit: false
    }
    this.otFormGroup = this.fb.group(_otform)
  }

  otFormGroup: FormGroup
  get EmpID() { return this.otFormGroup.get('EmpID'); }
  get StartDate() { return this.otFormGroup.get('StartDate'); }
  get EndDate() { return this.otFormGroup.get('EndDate'); }
  get StartTime() { return this.otFormGroup.get('StartTime'); }
  get EndTime() { return this.otFormGroup.get('EndTime'); }
  get CauseID() { return this.otFormGroup.get('CauseID'); }
  get CauseName() { return this.otFormGroup.get('CauseName'); }
  get DeptsID() { return this.otFormGroup.get('DeptsID'); }
  get DeptsName() { return this.otFormGroup.get('DeptsName'); }
  createForm(EmpID: string) {
    this.EmpID.setValue(EmpID)
    this.StartDate.setValue(new Date())
    this.EndDate.setValue(new Date())
    this.StartTime.setValue('00:00')
    this.EndTime.setValue('00:00')
  }
  ngOnInit() {
    this.onSaveFile(this.editFileArray)
    this.id_bt_starttime = 'id_bt_starttime' + this.UiTemp
    this.id_bt_endtime = 'id_bt_endtime' + this.UiTemp

    this.id_ipt_starttime = 'id_ipt_starttime' + this.UiTemp
    this.id_ipt_endtime = 'id_ipt_endtime' + this.UiTemp

    this.otFormGroup.valueChanges
      .pipe(takeWhile(() => this.api_subscribe))
      .subscribe(
        (x: otFormClass) => {
          this.SetOtForm.emit(x);
        }
      )
    this.otFormGroup.statusChanges
      .pipe(takeWhile(() => this.api_subscribe))
      .subscribe(
        (state: string) => {
          this.SetOtFormState.emit(state);
        }
      )
    this.CauseID.valueChanges
      .pipe(takeWhile(() => this.api_subscribe))
      .subscribe(
        (CauseID: string) => {
          for (let c of this.CauseOption) {
            if (c.CauseID == CauseID) {
              this.CauseName.setValue(c.CauseNameC)
            }
          }
        }
      )
    this.DeptsID.valueChanges
      .pipe(takeWhile(() => this.api_subscribe))
      .subscribe(
        (DeptsID: string) => {
          for (let d of this.NgxDeptsSelectBox) {
            if (d.DeptsID == DeptsID) {
              this.DeptsName.setValue(d.DeptsName)
            }
          }
        }
      )
    this.ObIptEmpID$
      .pipe(takeWhile(() => this.api_subscribe))
      .subscribe(
        (EmpID: string) => {
          if (EmpID) {
            // console.log(EmpID)
            this.createForm(EmpID)
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
                      (y: GetDeptsGetApiData[]) => {
                        this.NgxDeptsSelectBox = JSON.parse(JSON.stringify(y))

                        this.GetApiDataServiceService.getWebApiData_GetBaseInfoDetail(EmpID)
                          .pipe(takeWhile(() => this.api_subscribe))
                          .subscribe(
                            (serviceResponse: GetBaseInfoDetailClass[]) => {
                              if (serviceResponse.length > 0) {
                                this.DeptsID.setValue(serviceResponse[0].DeptcID)
                              }
                            })
                      })
                }
              )
          } else {

          }
        }
      )
  }
  InOtArrayRowId:string =''
  checkInOtFormDateTime() {
    if (this.OtFormArray!.length > 0) {
      var LDate: Array<SEDate> = []
      var IDate: SEDate
      this.OtFormArray.forEach(x => {
        LDate.push({
          rowID:x.RowID,
          startDateTime: new Date(x.StartDate + ' ' + x.StartTime),
          endDateTime: new Date(x.EndDate + ' ' + x.EndTime)
        })
      })
      IDate = {
        rowID:null,
        startDateTime: new Date(doFormatDate(this.StartDate.value) + ' ' + this.StartTime.value),
        endDateTime: new Date(doFormatDate(this.EndDate.value) + ' ' + this.EndTime.value)
      }
      var isIn: boolean = isInDateArray(LDate, IDate).isIn
      if (isIn) {
        this.InOtArrayRowId = isInDateArray(LDate, IDate).rowID
        var err = { 'forbiddenName': 'datTimeInFormArray' }
        this.StartDate.setErrors(err)
        this.EndDate.setErrors(err)
        this.StartTime.setErrors(err)
        this.EndTime.setErrors(err)
      }
      return isIn
    } else {
      return false
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
        if (!this.StartDate.value) {
          return { 'forbiddenName': 'StartDateNull' }
        } else if (!this.EndDate.value) {
          return { 'forbiddenName': 'EndDateNull' }
        } else if (this.isStartNoLargeEndDateTime(StartDateTime, EndDateTime)) {
          return { 'forbiddenName': 'dateTimeFail' }
        } else if (this.checkInOtFormDateTime()) {
          return { 'forbiddenName': 'datTimeInFormArray' }
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
        if (!this.StartDate.value) {
          return { 'forbiddenName': 'StartDateNull' }
        } else if (!this.EndDate.value) {
          return { 'forbiddenName': 'EndDateNull' }
        } else if (this.isStartNoLargeEndDateTime(StartDateTime, EndDateTime)) {
          return { 'forbiddenName': 'dateTimeFail' }
        } else if (this.checkInOtFormDateTime()) {
          return { 'forbiddenName': 'datTimeInFormArray' }
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
  }
}
