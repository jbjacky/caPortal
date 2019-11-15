import { Component, OnInit, Output, EventEmitter, Input, AfterViewInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';

import { AttendCard } from 'src/app/Models/AttendCard'
import { doFormatDate, getapi_formatTimetoString, sumbit_formatTimetoString, formatDateTime } from 'src/app/UseVoid/void_doFormatDate';
import { GetApiDataServiceService } from 'src/app/Service/get-api-data-service.service';
import { SaveAndFlowStartClass, ForgetSaveAndFlowStartClass } from 'src/app/Models/PostData_API_Class/SaveAndFlowStartClass';
import { isValidDate, isValidTime } from 'src/app/UseVoid/void_isVaildDatetime';
import { CardCheckClass } from 'src/app/Models/PostData_API_Class/CardCheckClass';
import { FlowCardCheckClass } from 'src/app/Models/PostData_API_Class/FlowCardCheckClass';
import { Router } from '@angular/router';
import { uploadFileClass } from 'src/app/Models/uploadFileClass';
import { NgxSpinnerService } from 'ngx-spinner';
import { ExampleHeader } from 'src/app/Service/datepickerHeader';
import { BehaviorSubject, Observable } from 'rxjs';
import { GetSelectBaseClass } from 'src/app/Models/GetSelectBaseClass';
import { takeWhile } from 'rxjs/operators';
import { MatSelectionList } from '@angular/material';
import { FormGroup, FormBuilder } from '@angular/forms';

declare let $: any; //use jquery

@Component({
  selector: 'app-rm-state-form-write',
  templateUrl: './rm-state-form-write.component.html',
  styleUrls: ['./rm-state-form-write.component.css']
})
export class RmStateFormWriteComponent implements OnInit, AfterViewInit, OnDestroy {
  exampleHeader = ExampleHeader //日期套件header

  ErrorStateOptionGroup: FormGroup
  ngOnDestroy(): void {
    this.api_subscribe = false;
  }
  api_subscribe = true; //ngOnDestroy時要取消訂閱api的subscribe
  ngAfterViewInit(): void {
  }

  ActualRote_calCrossDay: boolean = false //出勤是否跨天
  AttendCard_calCrossDay: boolean = false //刷卡紀錄是否跨天

  sendForgetForm: sendForgetForm = new sendForgetForm();

  Cause = []

  errorStartDate = { state: false, errorString: '' };
  errorStartTime = { state: false, errorString: '' };
  errorEndDate = { state: false, errorString: '' };
  errorEndTime = { state: false, errorString: '' };
  errorCause = { state: false, errorString: '' };
  errorSigner = { state: false, errorString: '' };

  @Input() getAttendCard: AttendCard;
  @Output() outputWriteforgetformChange: EventEmitter<any> = new EventEmitter<any>();//返回修改按鈕

  private Sub_onChangeSignMan$: BehaviorSubject<any> = new BehaviorSubject(0)
  onChangeSingMan$: Observable<any> = this.Sub_onChangeSignMan$; //切換選擇簽核人員使用

  constructor(private GetApiDataServiceService: GetApiDataServiceService,
    private router: Router,
    private LoadingPage: NgxSpinnerService,
    private formBuilder: FormBuilder) {
    this.ErrorStateOptionGroup = this.formBuilder.group({
      lateComeCard: false,
      earlyBackCard: false,
      nonCard: false,
      earlyComeCard: false,
      lateBackCard: false,
    });
  }

  selectOnWorkArray = []
  selectOffWorkArray = []
  OnWorkDate: string
  OffWorkDate: string


  ngOnInit() {
    this.Sub_onChangeSignMan$.next(this.getAttendCard.forget_man_code)

    this.GetApiDataServiceService.getWebApiData_GetCauseByForm()
      .pipe(takeWhile(() => this.api_subscribe))
      .subscribe(
        (data: any) => {
          for (let x of data) {
            this.Cause.push({ CauseID: x.CauseID, CauseNameC: x.CauseNameC })
          }

          this.selectOnWorkArray = []
          this.sendForgetForm.CauseID1 = data[0].CauseID
          this.sendForgetForm.CauseName1 = data[0].CauseNameC

          var calonDate = new Date(this.getAttendCard.AttendDate)
          this.selectOnWorkArray.push(doFormatDate(calonDate))
          calonDate.setDate(calonDate.getDate() - 1)
          this.selectOnWorkArray.push(doFormatDate(calonDate))

          var caloffDate = new Date(this.getAttendCard.AttendDate)
          this.selectOffWorkArray.push(doFormatDate(caloffDate))
          caloffDate.setDate(caloffDate.getDate() + 1)
          this.selectOffWorkArray.push(doFormatDate(caloffDate))

          this.OnWorkDate = this.selectOnWorkArray[0]
          this.OffWorkDate = this.selectOffWorkArray[0]

        }
      )
  }


  onpreviousForm() {
    //返回按鈕
    this.outputWriteforgetformChange.emit();
    // console.log(this.outputWriteforgetformChange)
  }
  FlowDynamic_Base: GetSelectBaseClass;
  chooseBase(GetSelectBase: GetSelectBaseClass) {
    this.FlowDynamic_Base = GetSelectBase
  }

  chooseCause(event) {
    var id = event.target.value
    var id_name = this.Cause.filter(item => {
      return item.CauseID == parseInt(id)
    });
    var name: string = id_name[0].CauseNameC.toString()

    this.sendForgetForm.CauseID1 = id;
    this.sendForgetForm.CauseName1 = name.trim()
  }

  checkError() {
    var checkTure = []

    Object.keys(this.ErrorStateOptionGroup.value).map(x => {
      if (this.ErrorStateOptionGroup.value[x] == true) {
        checkTure.push(x)
      }
    })
    if (checkTure.length == 0) {
      alert('請選擇異常狀態')
    } else {
      console.log(checkTure)
    }
    var all: number = 0
    for (let up of this.UploadFile) {
      all += (+up.Size)
    }

    if (all > 10485760) {
      alert('檔案不能超過10MB')
    } else if (!this.FlowDynamic_Base) {
      alert('請選擇簽核人員')
    } else {
      $('#checksenddialog').modal('show');
    }
  }
  onSubmit() {
    console.log(this.getAttendCard.forget_man_code)
    console.log(this.getAttendCard.write_man_code)
    console.log(this.sendForgetForm)
    console.log(this.UploadFile)
    console.log(this.FlowDynamic_Base)
  }

  reload() {
    this.router.navigateByUrl('', { skipLocationChange: true }).then(() =>
      this.router.navigate(["nav/forgetform"]));
  }


  RedAttendString_Title(e: boolean, b: boolean) {
    if (e || b) {
      return '#d0021b'
    } else {
      return 'rgb(150, 149, 148)'
    }
  }
  RedAttendString_Content(e: boolean, b: boolean) {
    if (e || b) {
      return '#d0021b'
    } else {
      return '#4c4c4c'
    }
  }

  UploadFile: uploadFileClass[] = []
  onSaveFile(event) {
    this.UploadFile = event
    // console.log(this.UploadFile)

  }

  onLoadingTime() {

    this.OnWorkDate = formatDateTime(this.getAttendCard.ActualRote_OnDateTime).getDate
    this.OffWorkDate = formatDateTime(this.getAttendCard.ActualRote_OffDateTime).getDate

    var showOnTime = getapi_formatTimetoString(formatDateTime(this.getAttendCard.ActualRote_OnDateTime).getTime)
    var showOffTime = getapi_formatTimetoString(formatDateTime(this.getAttendCard.ActualRote_OffDateTime).getTime)

    $('#id_ipt_starttime').val(showOnTime.toString())
    $('#id_ipt_endtime').val(showOffTime.toString())
    if (this.getAttendCard.ActualRote_calCrossDay) {
      var addDate = new Date(this.getAttendCard.AttendDate + ' ' + '00:00')
      addDate.setDate(addDate.getDate() + 1)
      this.OffWorkDate = doFormatDate(addDate)

    }

  }

  private Be_setGetRoteInfo$: BehaviorSubject<any> = new BehaviorSubject<Array<number>>(null);
  Ob_setGetRoteInfo$: Observable<any> = this.Be_setGetRoteInfo$;

  bt_Show_RoteInfo(oneSearchRoteID: number) {
    var searchRoteID: Array<number> = []
    if (oneSearchRoteID) {
      searchRoteID.push(oneSearchRoteID)
      this.Be_setGetRoteInfo$.next(searchRoteID)
      $('#RoteInf_write').modal('show')
    }
  }
}
class sendForgetForm {
  CauseID1: string;
  CauseName1: string;
  Note: string;
  ReviewEmpID: string
}
