import { Component, OnInit, Output, EventEmitter, Input, AfterViewInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { AttendCard } from 'src/app/Models/AttendCard'
import { doFormatDate, getapi_formatTimetoString, formatDateTime } from 'src/app/UseVoid/void_doFormatDate';
import { GetApiDataServiceService } from 'src/app/Service/get-api-data-service.service';
import { Router } from '@angular/router';
import { uploadFileClass } from 'src/app/Models/uploadFileClass';
import { NgxSpinnerService } from 'ngx-spinner';
import { ExampleHeader } from 'src/app/Service/datepickerHeader';
import { BehaviorSubject, Observable } from 'rxjs';
import { GetSelectBaseClass } from 'src/app/Models/GetSelectBaseClass';
import { takeWhile } from 'rxjs/operators';
import { FormGroup, FormBuilder, FormControl} from '@angular/forms';
import { AttendUnusualSaveAndFlowStartClass } from 'src/app/Models/PostData_API_Class/AttendUnusualSaveAndFlowStart';

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

    var StateFormControl = {
      EliminateLate: new FormControl(false),
      EliminateEarly: new FormControl(false),
      EliminateAbsent: new FormControl(false),
      EliminateOnBefore: new FormControl(false),
      EliminateOffAfter: new FormControl(false)
    }
    this.ErrorStateOptionGroup = this.formBuilder.group(StateFormControl);
  }
  disableCheckBox() {
    this.fnDisable(this.getAttendCard, "LateMins", "EliminateLate");
    this.fnDisable(this.getAttendCard, "EarlyMins", "EliminateEarly");
    this.fnDisable(this.getAttendCard, "IsAbsent", "EliminateAbsent");
    this.fnDisable(this.getAttendCard, "OnBeforeMins", "EliminateOnBefore");
    this.fnDisable(this.getAttendCard, "OffAfterMins", "EliminateOffAfter");
  }
  fnDisable(_CardData: AttendCard, eleMin: string, eleEliminate: string) {
    var CardData = JSON.parse(JSON.stringify(_CardData))
    if (CardData[eleMin] && !CardData[eleEliminate]) {
      //如果無異常分鐘數和無異常註記就可以勾選
      this.ErrorStateOptionGroup.get(eleEliminate).enable()
    } else {
      this.ErrorStateOptionGroup.get(eleEliminate).disable()
    }
  }

  selectOnWorkArray = []
  selectOffWorkArray = []
  OnWorkDate: string
  OffWorkDate: string


  ngOnInit() {
    this.Sub_onChangeSignMan$.next(this.getAttendCard.forget_man_code)

    this.disableCheckBox()
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
    var all: number = 0
    for (let up of this.UploadFile) {
      all += (+up.Size)
    }

    if (checkTure.length == 0) {
      alert('請選擇消除異常狀態')
    } else if (all > 10485760) {
      alert('檔案不能超過10MB')
    } else if (!this.FlowDynamic_Base) {
      alert('請選擇簽核人員')
    } else {
      $('#checksenddialog').modal('show');
    }
  }

  onSubmit() {
    var ExceptionalCode = ''
    var ExceptionalName = ''
    if (this.getAttendCard.EarlyMins) {
      ExceptionalCode += '1,'
      ExceptionalName += '早退,'
    }
    if (this.getAttendCard.LateMins) {
      ExceptionalCode += '2,'
      ExceptionalName += '遲到,'
    }
    if (this.getAttendCard.IsAbsent) {
      ExceptionalCode += '3,'
      ExceptionalName += '未刷卡,'
    }
    if (this.getAttendCard.OnBeforeMins) {
      ExceptionalCode += '4,'
      ExceptionalName += '早來,'
    }
    if (this.getAttendCard.OffAfterMins) {
      ExceptionalCode += '5,'
      ExceptionalName += '晚走,'
    }

    var ExceptionalCodeCancel=''
    var ExceptionalNameCancel=''
    if (this.getAttendCard.EarlyMins && this.getAttendCard.EliminateEarly) {
      ExceptionalCodeCancel += '1,'
      ExceptionalNameCancel += '早退,'
    }
    if (this.getAttendCard.LateMins && this.getAttendCard.EliminateLate) {
      ExceptionalCodeCancel += '2,'
      ExceptionalNameCancel += '遲到,'
    }
    if (this.getAttendCard.IsAbsent && this.getAttendCard.EliminateAbsent) {
      ExceptionalCodeCancel += '3,'
      ExceptionalNameCancel += '未刷卡,'
    }
    if (this.getAttendCard.OnBeforeMins && this.getAttendCard.EliminateOnBefore) {
      ExceptionalCodeCancel += '4,'
      ExceptionalNameCancel += '早來,'
    }
    if (this.getAttendCard.OffAfterMins && this.getAttendCard.EliminateOffAfter) {
      ExceptionalCodeCancel += '5,'
      ExceptionalNameCancel += '晚走,'
    }

    var State: StateClass = this.ErrorStateOptionGroup.value
    var AttendUnusualSaveAndFlowStart: AttendUnusualSaveAndFlowStartClass = new AttendUnusualSaveAndFlowStartClass()
    AttendUnusualSaveAndFlowStart = {
      "FlowApp": {
        "FlowApps": [
          {
            "EmpID": this.getAttendCard.forget_man_code.toString(),
            "EmpCode": this.getAttendCard.forget_man_code.toString(),
            "EmpNameC": this.getAttendCard.forget_man_name,
            "Date": this.getAttendCard.AttendDate,
            "RoteDateTimeB": this.getAttendCard.ActualRote_OnDateTime,
            "RoteDateTimeE": this.getAttendCard.ActualRote_OffDateTime,
            "CardDateTimeB": this.getAttendCard.AttendCard_OnDateTime,
            "CardDateTimeE": this.getAttendCard.AttendCard_OffDateTime,
            "EliminateLate": State.EliminateLate ? State.EliminateLate : false,
            "EliminateEarly": State.EliminateEarly ? State.EliminateEarly : false,
            "EliminateAbsent": State.EliminateAbsent ? State.EliminateAbsent : false,
            "EliminateOnBefore": State.EliminateOnBefore ? State.EliminateOnBefore : false,
            "EliminateOffAfter": State.EliminateOffAfter ? State.EliminateOffAfter : false,
            "CauseID": parseInt(this.sendForgetForm.CauseID1),
            "CauseName": this.sendForgetForm.CauseName1,
            "Note": this.sendForgetForm.Note,
            "Info": "",
            "MailBody": "",
            "State": "1",
            "UploadFile": this.UploadFile,
            "ExceptionalCode": ExceptionalCode,
            "ExceptionalName": ExceptionalName, //有異常但沒註記
            "ExceptionalCodeCancel": ExceptionalCodeCancel,
            "ExceptionalNameCancel": ExceptionalNameCancel, //有異常且已經註記
            "RoteID": this.getAttendCard.RoteID,
            "RoteNameC": this.getAttendCard.RoteNameC
          }
        ],
        "EmpID": this.getAttendCard.write_man_code,
        "EmpCode": this.getAttendCard.write_man_code,
        "EmpNameC": this.getAttendCard.write_man_name,
        "State": "1"
      },
      "FlowDynamic": {
        "FlowNode": "519",
        "RoleID": "",
        "EmpID": this.FlowDynamic_Base.EmpID,
        "DeptID": this.FlowDynamic_Base.DeptaID.toString(),
        "PosID": this.FlowDynamic_Base.JobID.toString()
      }
    }
    // console.log(AttendUnusualSaveAndFlowStart)

    this.LoadingPage.show()
    this.GetApiDataServiceService.getWebApiData_AttendUnusualSaveAndFlowStart(AttendUnusualSaveAndFlowStart)
      .pipe(takeWhile(() => this.api_subscribe))
      .subscribe((x: any) => {
        if (x.isOK) {
          $('#sussesdialog').modal('show');
        } else {
          alert(x.ErrorMsg);
        }
        this.LoadingPage.hide()
      })

    // console.log(this.getAttendCard.forget_man_code)
    // console.log(this.getAttendCard.write_man_code)
    // console.log(this.sendForgetForm)
    // console.log(this.UploadFile)
    // console.log(this.FlowDynamic_Base)
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

class StateClass {
  EliminateLate: boolean;
  EliminateEarly: boolean;
  EliminateAbsent: boolean;
  EliminateOnBefore: boolean;
  EliminateOffAfter: boolean;
}


