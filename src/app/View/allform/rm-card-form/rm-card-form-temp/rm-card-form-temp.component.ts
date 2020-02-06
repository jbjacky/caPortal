import { Component, OnInit, Input, OnDestroy, Output, EventEmitter, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { uploadFileClass } from 'src/app/Models/uploadFileClass';
import { GetSelectBaseClass } from 'src/app/Models/GetSelectBaseClass';
import { BehaviorSubject, Observable } from 'rxjs';
import { AttendCard } from 'src/app/Models/AttendCard';
import { GetApiDataServiceService } from 'src/app/Service/get-api-data-service.service';
import { takeWhile } from 'rxjs/operators';
import { ExampleHeader } from 'src/app/Service/datepickerHeader';
import { doFormatDate, reSplTimeHHmm } from 'src/app/UseVoid/void_doFormatDate';
import { FormGroup, FormControl, FormBuilder, Validators, AbstractControl, ValidationErrors } from '@angular/forms';

declare let $: any; //use jquery
@Component({
  selector: 'app-rm-card-form-temp',
  templateUrl: './rm-card-form-temp.component.html',
  styleUrls: ['./rm-card-form-temp.component.css']
})
export class RmCardFormTempComponent implements OnInit, AfterViewInit, OnDestroy {
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
  get rcFirstCardDate() { return this.rmCardTempForm.get('rcFirstCardDate') }
  get rcFirstCardTime() { return this.rmCardTempForm.get('rcFirstCardTime') }
  get rcUploadData() { return this.rmCardTempForm.get('rcUploadData') }
  get rcCause() { return this.rmCardTempForm.get('rcCause') }

  id_ipt_endtime: string
  id_bt_endtime: string
  ngAfterViewInit(): void {
    this.endDateTimeChange()
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

  endDateTimeChange() {
    this.endTimeDropper = $("#" + this.id_bt_endtime).timeDropper({
      format: 'HH:mm',
      autoswitch: false,
      mousewheel: true,
      setCurrentTime: false
    });
  }
  @ViewChild('EndTimeView') EndTimeView: ElementRef;
  changeEndTimeView() {
    if(this.rcFirstCardTime.value == ''){
      this.rcFirstCardTime.setValue('00:00')
    }
    this.endTimeDropper[0].myprop1(reSplTimeHHmm(this.rcFirstCardTime.value).HH,reSplTimeHHmm(this.rcFirstCardTime.value).mm);
    $(this.EndTimeView.nativeElement)
      .on('change', (e, args) => {
        this.rcFirstCardTime.setValue($("#" + this.id_bt_endtime).val())
      });
  }
  constructor(private GetApiDataServiceService: GetApiDataServiceService, private fb: FormBuilder) {
    var data: rmCardTempFormClass = {
      'rcFirstCardDate': ['', Validators.required],
      'rcFirstCardTime': ['', Validators.required],
      'rcCause': ['', Validators.required],
      'rcUploadData': [[]],
      'rcNote': ['']
    }
    this.rmCardTempForm = this.fb.group(data)

  }
  selectOnWorkArray = []
  selectOffWorkArray = []
  Cause = []
  onSaveFile(event: Array<uploadFileClass>) {
    this.rcUploadData.setValue(event)
    // console.log(this.UploadFile)
  }
  ngOnInit() {
    this.id_ipt_endtime = 'id_ipt_endtime' + this.UiTemp
    this.id_bt_endtime = 'id_bt_endtime' + this.UiTemp
    this.GetApiDataServiceService.getWebApiData_GetCauseByForm()
      .pipe(takeWhile(() => this.api_subscribe))
      .subscribe(
        (data: any) => {
          // console.log(this.getAttendCard)
          for (let x of data) {
            this.Cause.push({ CauseID: x.CauseID, CauseNameC: x.CauseNameC })
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

          this.rcCause.setValue(this.Cause[0].CauseID)
          this.rcFirstCardDate.setValue(this.selectOnWorkArray[0])
        }
      )

    this.rmCardTempForm.valueChanges
      .pipe(takeWhile(() => this.api_subscribe))
      .subscribe((rmCardTempForm: rmCardTempFormClass) => {
        var data: rmCardTempFormStateClass = {
          FormState: this.rmCardTempForm.status,
          rmCardTempFormData: rmCardTempForm
        }
        this.formChange.emit(data);
        // console.log(data)
      })

  }


}
export interface rmCardTempFormStateClass {
  FormState: string
  rmCardTempFormData: rmCardTempFormClass
}
export interface rmCardTempFormClass {
  rcFirstCardDate: string | ValidationErrors,
  rcFirstCardTime: string | ValidationErrors,
  rcCause: string | ValidationErrors,
  rcUploadData: Array<uploadFileClass> | ValidationErrors,
  rcNote: string | ValidationErrors
}
