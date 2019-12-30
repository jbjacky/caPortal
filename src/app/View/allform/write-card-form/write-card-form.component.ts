import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { GetApiDataServiceService } from 'src/app/Service/get-api-data-service.service';
import { isValidDate, isValidTime } from 'src/app/UseVoid/void_isVaildDatetime';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ExampleHeader } from 'src/app/Service/datepickerHeader';
import { BehaviorSubject, Observable } from 'rxjs';
import { GetSelectBaseClass } from 'src/app/Models/GetSelectBaseClass';
import { FormGroup, FormControl, Validators } from '@angular/forms';

declare let $: any; //use jquery

@Component({
  selector: 'app-write-card-form',
  templateUrl: './write-card-form.component.html',
  styleUrls: ['./write-card-form.component.css']
})
export class WriteCardFormComponent implements OnInit, AfterViewInit, OnDestroy {
  exampleHeader = ExampleHeader //日期套件header
  ngOnDestroy(): void {
    $(this.EndTimeView.nativeElement).off('change');
    this.api_subscribe = false;
  }
  api_subscribe = true; //ngOnDestroy時要取消訂閱api的subscribe
  ngAfterViewInit(): void {
    $("#id_bt_endtime").unbind();
    $("#id_bt_endtime").timeDropper({
      format: 'HH:mm',
      autoswitch: false,
      mousewheel: true,
      setCurrentTime: false
    });

    $("#id_bt_endtime").change(function () {
      $("#id_ipt_endtime").val($("#id_bt_endtime").val());
    });
  }

  WriteCardFromGroup: FormGroup = new FormGroup({
    EmpCode:new FormControl(''),
    WriteEmpCode:new FormControl(''),
    WriteCardDate:new FormControl(''),
    WriteCardTime:new FormControl(''),
    WriteCause:new FormControl(''),
    WriteNote:new FormControl('')
  })

  sendForgetForm: sendForgetForm = new sendForgetForm();

  Cause = []

  errorStartDate = { state: false, errorString: '' };
  errorStartTime = { state: false, errorString: '' };
  errorEndDate = { state: false, errorString: '' };
  errorEndTime = { state: false, errorString: '' };
  errorCause = { state: false, errorString: '' };
  errorSigner = { state: false, errorString: '' };


  private Sub_onChangeSignMan$: BehaviorSubject<any> = new BehaviorSubject(0)
  onChangeSingMan$: Observable<any> = this.Sub_onChangeSignMan$; //切換選擇簽核人員使用

  constructor(private GetApiDataServiceService: GetApiDataServiceService,
    private router: Router,
    private LoadingPage: NgxSpinnerService) { }

  selectOnWorkArray = []
  selectOffWorkArray = []
  OnWorkDate: string
  OffWorkDate: string


  ngOnInit() {
    this.Sub_onChangeSignMan$.next("0004420");

    // this.GetApiDataServiceService.getWebApiData_GetCauseByForm()
    //   .pipe(takeWhile(() => this.api_subscribe))
    //   .subscribe(
    //     (data: any) => {
    //       // console.log(this.getAttendCard)
    //       for (let x of data) {
    //         this.Cause.push({ CauseID: x.CauseID, CauseNameC: x.CauseNameC })
    //       }


    //     }
    //   )
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

  endDateTimeChange() {
    $('#id_ipt_endday').val('')
    $('#id_ipt_endtime').val('')
    $("#id_bt_endtime").unbind();

    this.errorEndDate = { state: false, errorString: '' };
    this.errorEndTime = { state: false, errorString: '' };


    $("#id_bt_endtime").timeDropper({
      format: 'HH:mm',
      autoswitch: false,
      mousewheel: true,
      setCurrentTime: false
    });

    $("#id_bt_endtime").change(function () {
      $("#id_ipt_endtime").val($("#id_bt_endtime").val());
    });
  }

  blurEndDate() {
    if ($('#id_ipt_endday').val().length == 0) {
      this.errorEndDate = { state: true, errorString: '請輸入實際離勤日期' };
    } else if (!isValidDate($('#id_ipt_endday').val())) {
      this.errorEndDate = { state: true, errorString: '日期格式不正確' };
    } else {
      this.errorEndDate = { state: false, errorString: '' };
    }
  }

  blurEndTime() {
    if ($('#id_ipt_endtime').val().length == 0) {
      this.errorEndTime = { state: true, errorString: '請輸入實際離勤時間' }
    } else if (!isValidTime($('#id_ipt_endtime').val())) {
      this.errorEndTime = { state: true, errorString: '日期格式不正確' }
    }
    else {
      this.errorEndTime = { state: false, errorString: '' }
    }
  }

  EndTimeMask(): {
    mask: Array<string | RegExp>;
    keepCharPositions: boolean;
  } {
    return {
      mask: [/[0-2]/, $("#id_ipt_endtime").val() && parseInt($("#id_ipt_endtime").val()[0]) > 1 ? /[0-3]/ : /\d/, ':', /[0-5]/, /\d/],
      keepCharPositions: true
    };
  }

  @ViewChild('EndTimeView') EndTimeView: ElementRef;
  changeEndTimeView() {
    // $(this.EndTimeView.nativeElement)
    //   .on('change', (e, args) => {
    //     $("#id_ipt_endtime").val($("#id_bt_endtime").val());
    //     this.blurEndTime();
    //   });
  }

  forgetShowCheckText = ''
  forgetShowCheckFlowText = ''
  checkError() {
    // console.log(this.OnWorkDate)
    // console.log(this.OffWorkDate)
    if (!this.sendForgetForm.Note) {
      alert('請填寫補充說明')
    } else if (!this.FlowDynamic_Base) {
      alert('請選擇簽核人員')
    } else if ($('#id_ipt_endtime').val().length == 0) {
      this.errorEndTime = { state: true, errorString: '請輸入實際離勤時間' };
    } else if (!this.sendForgetForm.CauseID1) {
      this.errorCause = { state: true, errorString: '請選擇異常原因' };
    } else {
      $('#checksenddialog').modal('show');
    }
  }
  onSubmit() {
    // this.checkError();
  }
  // onSubmit() {
  //   var SaveAndFlowStart: SaveAndFlowStartClass = new SaveAndFlowStartClass();
  //   SaveAndFlowStart.EmpID = this.getAttendCard.forget_man_code.toString()
  //   SaveAndFlowStart.EmpNameC = this.getAttendCard.forget_man_name
  //   SaveAndFlowStart.Date = this.getAttendCard.AttendDate
  //   if (this.goWork) {
  //     SaveAndFlowStart.DateB = this.OnWorkDate
  //     SaveAndFlowStart.TimeB = sumbit_formatTimetoString($('#id_ipt_starttime').val())
  //     var DateTime_nB = new Date(this.OnWorkDate + ' ' + $('#id_ipt_starttime').val())
  //     SaveAndFlowStart.DateTimeB = DateTime_nB.toJSON()
  //   } else {
  //     SaveAndFlowStart.DateB = ''
  //     SaveAndFlowStart.TimeB = ''
  //     SaveAndFlowStart.DateTimeB = ''
  //   }
  //   if (this.offWork) {
  //     SaveAndFlowStart.DateE = this.OffWorkDate
  //     SaveAndFlowStart.TimeE = sumbit_formatTimetoString($('#id_ipt_endtime').val())
  //     var DateTime_nE = new Date(this.OffWorkDate + ' ' + $('#id_ipt_endtime').val())
  //     SaveAndFlowStart.DateTimeE = DateTime_nE.toJSON()
  //   } else {
  //     SaveAndFlowStart.DateE = ''
  //     SaveAndFlowStart.TimeE = ''
  //     SaveAndFlowStart.DateTimeE = ''
  //   }
  //   SaveAndFlowStart.UploadFile = this.UploadFile

  //   var ExceptionalCode = ''
  //   var ExceptionalName = ''

  //   var ExceptionalCodeCancel = ''
  //   var ExceptionalNameCancel = ''

  //   SaveAndFlowStart.CauseID1 = this.sendForgetForm.CauseID1
  //   SaveAndFlowStart.CauseName1 = this.sendForgetForm.CauseName1
  //   SaveAndFlowStart.Note = this.sendForgetForm.Note
  //   SaveAndFlowStart.ReviewEmpID = this.sendForgetForm.ReviewEmpID


  //   if (this.FlowDynamic_Base) {

  //     var CardPatchSaveAndFlowStart: CardPatchSaveAndFlowStartClass = {
  //       "FlowApp": {
  //         "FlowApps": [
  //           {
  //             "EmpID": SaveAndFlowStart.EmpID,
  //             "EmpCode": SaveAndFlowStart.EmpID,
  //             "EmpNameC": SaveAndFlowStart.EmpNameC,
  //             "Date": SaveAndFlowStart.Date,
  //             "RoteDateTimeB": this.getAttendCard.ActualRote_OnDateTime,
  //             "RoteDateTimeE": this.getAttendCard.ActualRote_OffDateTime,
  //             "CardDateTimeB": this.getAttendCard.AttendCard_OnDateTime,
  //             "CardDateTimeE": this.getAttendCard.AttendCard_OffDateTime,
  //             "DateB": SaveAndFlowStart.DateB,
  //             "DateE": SaveAndFlowStart.DateE,
  //             "TimeB": SaveAndFlowStart.TimeB,
  //             "TimeE": SaveAndFlowStart.TimeE,
  //             "DateTimeB": SaveAndFlowStart.DateTimeB,
  //             "DateTimeE": SaveAndFlowStart.DateTimeE,
  //             "CauseID1": SaveAndFlowStart.CauseID1,
  //             "CauseName1": SaveAndFlowStart.CauseName1,
  //             "CauseID2": SaveAndFlowStart.CauseID1,
  //             "CauseName2": SaveAndFlowStart.CauseName1,
  //             "Note": SaveAndFlowStart.Note,
  //             "Info": "",
  //             "MailBody": "",
  //             "State": "1",
  //             "UploadFile": SaveAndFlowStart.UploadFile,
  //             "ExceptionalCode": ExceptionalCode,
  //             "ExceptionalName": ExceptionalName, //有異常但沒註記
  //             "ExceptionalCodeCancel": ExceptionalCodeCancel,
  //             "ExceptionalNameCancel": ExceptionalNameCancel, //有異常且已經註記
  //           }
  //         ],
  //         "EmpID": this.getAttendCard.write_man_code,
  //         "EmpCode": this.getAttendCard.write_man_code,
  //         "EmpNameC": this.getAttendCard.write_man_name,
  //         "State": "1"
  //       },
  //       "FlowDynamic": {
  //         "FlowNode": "519",
  //         "RoleID": "",
  //         "EmpID": this.FlowDynamic_Base.EmpID,
  //         "DeptID": this.FlowDynamic_Base.DeptaID.toString(),
  //         "PosID": this.FlowDynamic_Base.JobID.toString()
  //       }
  //     }

  //     // console.log(SaveAndFlowStart)
  //     this.LoadingPage.show()
  //     this.GetApiDataServiceService.getWebApiData_CardPatchSaveAndFlowStart(CardPatchSaveAndFlowStart)
  //       .pipe(takeWhile(() => this.api_subscribe))
  //       .subscribe((x: ResponeStateClass) => {
  //         // console.log(SaveAndFlowStart)
  //         if (x.isOK) {
  //           $('#sussesdialog').modal('show');
  //         } else {
  //           var errMsg = ''
  //           for (let e of x.ErrorMsg) {
  //             errMsg += e + '。 '
  //           }
  //           alert(errMsg);
  //         }
  //         this.LoadingPage.hide()
  //       },
  //         error => {
  //           this.LoadingPage.hide()
  //           // console.log(error)
  //         })
  //   } else {
  //     alert('請選擇簽核人員')
  //   }

  // }
}
class sendForgetForm {
  CauseID1: string;
  CauseName1: string;
  Note: string;
  ReviewEmpID: string
}
