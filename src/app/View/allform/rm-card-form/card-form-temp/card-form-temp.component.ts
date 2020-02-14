import { Component, OnInit, Input, OnDestroy, Output, EventEmitter, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { uploadFileClass } from 'src/app/Models/uploadFileClass';
import { AttendCard } from 'src/app/Models/AttendCard';
import { GetApiDataServiceService } from 'src/app/Service/get-api-data-service.service';
import { takeWhile } from 'rxjs/operators';
import { ExampleHeader } from 'src/app/Service/datepickerHeader';
import { doFormatDate, reSplTimeHHmm, formatDateTime } from 'src/app/UseVoid/void_doFormatDate';
import { FormGroup, FormControl, FormBuilder, Validators, AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { isValidTime } from 'src/app/UseVoid/void_isVaildDatetime';

declare let $: any; //use jquery

@Component({
  selector: 'app-card-form-temp',
  templateUrl: './card-form-temp.component.html',
  styleUrls: ['./card-form-temp.component.css']
})
export class CardFormTempComponent implements OnInit, AfterViewInit, OnDestroy {
  startTimeDropper: any
  endTimeDropper: any
  exampleHeader = ExampleHeader //日期套件header
  ngOnDestroy(): void {
    this.api_subscribe = false;
  }
  api_subscribe = true; //ngOnDestroy時要取消訂閱api的subscribe
  @Input() UiTemp: string
  @Input() getAttendCard: AttendCard;
  @Output() formChange: EventEmitter<any> = new EventEmitter<any>();
  rmCardTempForm: FormGroup
  get goWork() { return this.rmCardTempForm.get('goWork') }
  get offWork() { return this.rmCardTempForm.get('offWork') }
  get rcFirstCardDate() { return this.rmCardTempForm.get('rcFirstCardDate') }
  get rcFirstCardTime() { return this.rmCardTempForm.get('rcFirstCardTime') }
  get rcSecondCardDate() { return this.rmCardTempForm.get('rcSecondCardDate') }
  get rcSecondCardTime() { return this.rmCardTempForm.get('rcSecondCardTime') }
  get rcUploadData() { return this.rmCardTempForm.get('rcUploadData') }
  get rcCauseID() { return this.rmCardTempForm.get('rcCauseID') }

  id_ipt_starttime: string
  id_bt_starttime: string
  id_ipt_endtime: string
  id_bt_endtime: string
  ngAfterViewInit(): void {
  }
  StartTimeMask(): {
    mask: Array<string | RegExp>;
    keepCharPositions: boolean;
  } {
    return {
      mask: [/[0-2]/, $("#" + this.id_ipt_starttime).val() && parseInt($("#" + this.id_ipt_starttime).val()[0]) > 1 ? /[0-3]/ : /\d/, ':', /[0-5]/, /\d/],
      keepCharPositions: true
    };
  }
  EndTimeMask(): {
    mask: Array<string | RegExp>;
    keepCharPositions: boolean;
  } {
    return {
      mask: [/[0-2]/, $("#" + this.id_ipt_endtime).val() && parseInt($("#" + this.id_ipt_endtime).val()[0]) > 1 ? /[0-3]/ : /\d/, ':', /[0-5]/, /\d/],
      keepCharPositions: true
    };
  }

  startDateTimeChange() {
    this.startTimeDropper = $("#" + this.id_bt_starttime).timeDropper({
      format: 'HH:mm',
      autoswitch: false,
      mousewheel: true,
      setCurrentTime: false
    });
  }
  endDateTimeChange() {
    this.endTimeDropper = $("#" + this.id_bt_endtime).timeDropper({
      format: 'HH:mm',
      autoswitch: false,
      mousewheel: true,
      setCurrentTime: false
    });
  }
  @ViewChild('StartTimeView') StartTimeView: ElementRef;
  changeStartTimeView() {
    if (this.goWork.value) {
      if (this.rcFirstCardTime.value == '') {
        this.rcFirstCardTime.setValue('00:00')
      }
      if (!($(('#') + this.id_ipt_starttime).hasClass("uiTimeDropper"))) {
        $(('#') + this.id_ipt_starttime).addClass("uiTimeDropper")
      }
      this.startTimeDropper[0].myprop1(reSplTimeHHmm(this.rcFirstCardTime.value).HH, reSplTimeHHmm(this.rcFirstCardTime.value).mm);
      $(this.StartTimeView.nativeElement)
        .on('change', (e, args) => {
          this.rcFirstCardTime.setValue($("#" + this.id_bt_starttime).val())
        });
    }
  }
  @ViewChild('EndTimeView') EndTimeView: ElementRef;
  changeEndTimeView() {
    if (this.offWork.value) {
      if (this.rcSecondCardTime.value == '') {
        this.rcSecondCardTime.setValue('00:00')
      }
      if (!($(('#') + this.id_ipt_endtime).hasClass("uiTimeDropper"))) {
        $(('#') + this.id_ipt_endtime).addClass("uiTimeDropper")
      }
      this.endTimeDropper[0].myprop1(reSplTimeHHmm(this.rcSecondCardTime.value).HH, reSplTimeHHmm(this.rcSecondCardTime.value).mm);
      $(this.EndTimeView.nativeElement)
        .on('change', (e, args) => {
          this.rcSecondCardTime.setValue($("#" + this.id_bt_endtime).val())
        });
    }
  }
  constructor(private GetApiDataServiceService: GetApiDataServiceService, private fb: FormBuilder) {
    var UploadData: Array<uploadFileClass> = []
    var data: CardTempFormClass = {
      'goWork': new FormControl(false),
      'rcFirstCardDate': new FormControl('', Validators.required),
      'rcFirstCardTime': new FormControl('', this.checkFirstTime()),
      'offWork': new FormControl(false),
      'rcSecondCardDate': new FormControl('', Validators.required),
      'rcSecondCardTime': new FormControl('', this.checkSecondTime()),
      'rcCauseID': new FormControl('', Validators.required),
      'rcCauseName': '',
      'rcUploadData': new FormControl(UploadData),
      'rcNote': new FormControl('')
    }
    this.rmCardTempForm = this.fb.group(data)
  }
  selectOnWorkArray = []
  selectOffWorkArray = []
  CauseArray = []
  onSaveFile(event: Array<uploadFileClass>) {
    this.rcUploadData.setValue(event)
    // console.log(this.UploadFile)
  }
  ngOnInit() {
    this.id_ipt_starttime = 'id_ipt_starttime' + this.UiTemp
    this.id_bt_starttime = 'id_bt_starttime' + this.UiTemp
    this.id_ipt_endtime = 'id_ipt_endtime' + this.UiTemp
    this.id_bt_endtime = 'id_bt_endtime' + this.UiTemp
    this.rcFirstCardDate.disable()
    this.rcFirstCardTime.disable()
    this.rcSecondCardDate.disable()
    this.rcSecondCardTime.disable()
    this.GetApiDataServiceService.getWebApiData_GetCauseByForm()
      .pipe(takeWhile(() => this.api_subscribe))
      .subscribe(
        (data: any) => {
          // console.log(this.getAttendCard)
          for (let x of data) {
            this.CauseArray.push({ CauseID: x.CauseID, CauseNameC: x.CauseNameC })
          }
          this.selectOnWorkArray = []

          var calonDate = new Date(this.getAttendCard.AttendDate)
          this.selectOnWorkArray.push(doFormatDate(calonDate))
          calonDate.setDate(calonDate.getDate() - 1)
          this.selectOnWorkArray.push(doFormatDate(calonDate))

          var caloffDate = new Date(this.getAttendCard.AttendDate)
          this.selectOffWorkArray.push(doFormatDate(caloffDate))
          caloffDate.setDate(caloffDate.getDate() + 1)
          this.selectOffWorkArray.push(doFormatDate(caloffDate))

          this.rcCauseID.setValue(this.CauseArray[0].CauseID)
          this.rcFirstCardDate.setValue(this.selectOnWorkArray[0])
          this.rcSecondCardDate.setValue(this.selectOnWorkArray[0])
        }
      )

    this.rmCardTempForm.valueChanges
      .pipe(takeWhile(() => this.api_subscribe))
      .subscribe((rmCardTempForm: CardTempFormClass) => {
        var Cause = this.CauseArray.filter(item => {
          return item.CauseID == rmCardTempForm.rcCauseID
        })
        rmCardTempForm.rcCauseName = Cause[0].CauseNameC

        var data: CardTempFormStateClass = {
          FormState: this.rmCardTempForm.status,
          CardTempFormData: rmCardTempForm
        }
        this.formChange.emit(data);
        // console.log(this.rmCardTempForm)
      })

    this.goWork.valueChanges
    .pipe(takeWhile(() => this.api_subscribe))
    .subscribe(
      (work: boolean) => {
        if (work) {
          this.rcFirstCardDate.enable()
          this.rcFirstCardTime.enable()
          $("#" + this.id_bt_starttime).unbind()
          this.startDateTimeChange()
        } else {
          $("#" + this.id_bt_starttime).unbind()
          this.rcFirstCardDate.disable()
          this.rcFirstCardTime.disable()
        }
      }
    )
    
    this.offWork.valueChanges
    .pipe(takeWhile(() => this.api_subscribe))
    .subscribe(
      (work: boolean) => {
        if (work) {
          this.rcSecondCardDate.enable()
          this.rcSecondCardTime.enable()
          $("#" + this.id_bt_endtime).unbind()
          this.endDateTimeChange()
        } else {
          $("#" + this.id_bt_endtime).unbind()
          this.rcSecondCardDate.disable()
          this.rcSecondCardTime.disable()
        }
      }
    )

    this.rcFirstCardDate.valueChanges
    .pipe(takeWhile(() => this.api_subscribe))
    .subscribe(
      (chooseDate: string) => {
        this.rcFirstCardTime.updateValueAndValidity()
      }
    )

    this.rcSecondCardDate.valueChanges
    .pipe(takeWhile(() => this.api_subscribe))
    .subscribe(
      (chooseDate: string) => {
        this.rcSecondCardTime.updateValueAndValidity()
      }
    )
  }

  checkFirstTime(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      // console.log(control.value)
      if (!control.value) {
        return { 'forbiddenName': 'timeNull' }
      } else if (!isValidTime(control.value)) {
        return { 'forbiddenName': 'timeFail' }
      } else if (this.isInCardTimeRange(this.rcFirstCardDate, this.rcFirstCardTime)) {
        return { 'forbiddenName': 'timeInCardTimeRange' }
      } else {
        return null
      }
    };
  }
  checkSecondTime(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      // console.log(control.value)
      if (!control.value) {
        return { 'forbiddenName': 'timeNull' }
      } else if (!isValidTime(control.value)) {
        return { 'forbiddenName': 'timeFail' }
      } else if (this.isInCardTimeRange(this.rcSecondCardDate, this.rcSecondCardTime)) {
        return { 'forbiddenName': 'timeInCardTimeRange' }
      } else {
        return null
      }
    };
  }
  isInCardTimeRange(CardDate: AbstractControl, CardTime: AbstractControl) {
    if (this.getAttendCard.AttendCard_OnDateTime && this.getAttendCard.AttendCard_OffDateTime) {
      var AttendCard_OnDateTime = new Date(this.getAttendCard.AttendCard_OnDateTime)
      var AttendCard_OffDateTime = new Date(this.getAttendCard.AttendCard_OffDateTime)

      var iptDateTime = new Date(CardDate.value + ' ' + CardTime.value)
      if (iptDateTime > AttendCard_OnDateTime && iptDateTime < AttendCard_OffDateTime) {
        return true
      }
    } else {
      return false
    }
  }


  onLoadingTime() {
    this.goWork.setValue(true)
    this.offWork.setValue(true)
    this.rcFirstCardDate.setValue(formatDateTime(this.getAttendCard.ActualRote_OnDateTime).getDate)
    this.rcFirstCardTime.setValue(this.getAttendCard.ActualRote_OnTime)
    this.rcSecondCardDate.setValue(formatDateTime(this.getAttendCard.ActualRote_OnDateTime).getDate)
    this.rcSecondCardTime.setValue(this.getAttendCard.ActualRote_OffTime)
    if (!($(('#') + this.id_ipt_starttime).hasClass("uiTimeDropper"))) {
      $(('#') + this.id_ipt_starttime).addClass("uiTimeDropper")
    }
    if (!($(('#') + this.id_ipt_endtime).hasClass("uiTimeDropper"))) {
      $(('#') + this.id_ipt_endtime).addClass("uiTimeDropper")
    }
  }

}
export interface CardTempFormStateClass {
  FormState: string
  CardTempFormData: CardTempFormClass
}
export interface CardTempFormClass {
  goWork: FormControl,
  rcFirstCardDate: FormControl,
  rcFirstCardTime: FormControl,
  offWork: FormControl,
  rcSecondCardDate: FormControl,
  rcSecondCardTime: FormControl,
  rcCauseID: FormControl,
  rcCauseName: string,
  rcUploadData: FormControl,
  rcNote: FormControl
}
