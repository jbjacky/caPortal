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

declare let $: any; //use jquery

@Component({
  selector: 'app-forgetform-write',
  templateUrl: './forgetform-write.component.html',
  styleUrls: ['./forgetform-write.component.css']
})
export class ForgetformWriteComponent implements OnInit, AfterViewInit, OnDestroy {
  exampleHeader = ExampleHeader //日期套件header
  ngOnDestroy(): void {
    $(this.StartTimeView.nativeElement).off('change');
    $(this.EndTimeView.nativeElement).off('change');
  }
  ngAfterViewInit(): void {
  }
  goWork: boolean = false;//到勤
  offWork: boolean = false;//離勤

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
    private LoadingPage: NgxSpinnerService) { }

  selectOnWorkArray = []
  selectOffWorkArray = []
  OnWorkDate: string
  OffWorkDate: string


  ngOnInit() {
    this.Sub_onChangeSignMan$.next(this.getAttendCard.forget_man_code)

    this.GetApiDataServiceService.getWebApiData_GetCauseByForm().subscribe(
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

  startDateTimeChange() {
    $('#id_ipt_startday').val('')
    $('#id_ipt_starttime').val('')
    $("#id_bt_starttime").unbind();

    this.errorStartDate = { state: false, errorString: '' };
    this.errorStartTime = { state: false, errorString: '' };

    $("#id_bt_startday").change(function () {
      $("#id_ipt_startday").val($("#id_bt_startday").val())
    });

    $("#id_bt_starttime").timeDropper({
      format: 'HH:mm',
      autoswitch: false,
      mousewheel: true,
      setCurrentTime: false
    });

    $("#id_bt_starttime").change(function () {
      $("#id_ipt_starttime").val($("#id_bt_starttime").val());
    });
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
  blurStartDate() {
    if (this.goWork && $('#id_ipt_startday').val().length == 0) {
      this.errorStartDate = { state: true, errorString: '請輸入實際到勤日期' };
    } else if (!isValidDate($('#id_ipt_startday').val())) {
      this.errorStartDate = { state: true, errorString: '日期格式不正確' };
    } else {
      this.errorStartDate = { state: false, errorString: '' }
    }
  }
  blurStartTime() {
    if (this.goWork && $('#id_ipt_starttime').val().length == 0) {
      this.errorStartTime = { state: true, errorString: '請輸入實際到勤時間' }
    } else if (!isValidTime($('#id_ipt_starttime').val())) {
      this.errorStartTime = { state: true, errorString: '時間格式不正確' }
    }
    else {
      this.errorStartTime = { state: false, errorString: '' }
    }
  }

  blurEndDate() {
    if (this.offWork && $('#id_ipt_endday').val().length == 0) {
      this.errorEndDate = { state: true, errorString: '請輸入實際離勤日期' };
    } else if (!isValidDate($('#id_ipt_endday').val())) {
      this.errorEndDate = { state: true, errorString: '日期格式不正確' };
    } else {
      this.errorEndDate = { state: false, errorString: '' };
    }
  }

  blurEndTime() {
    if (this.offWork && $('#id_ipt_endtime').val().length == 0) {
      this.errorEndTime = { state: true, errorString: '請輸入實際離勤時間' }
    } else if (!isValidTime($('#id_ipt_endtime').val())) {
      this.errorEndTime = { state: true, errorString: '日期格式不正確' }
    }
    else {
      this.errorEndTime = { state: false, errorString: '' }
    }
  }

  dayMask(): {
    mask: Array<string | RegExp>;
    keepCharPositions: boolean;
  } {
    return {
      mask: [/[2]/, /[0]/, /\d/, /\d/, '/', /[0-1]/, /\d/, '/', /[0-3]/, /\d/],
      keepCharPositions: true,
    };
  }

  StartTimeMask(): {
    mask: Array<string | RegExp>;
    keepCharPositions: boolean;
  } {
    return {
      mask: [/[0-2]/, $("#id_ipt_starttime").val() && parseInt($("#id_ipt_starttime").val()[0]) > 1 ? /[0-3]/ : /\d/, ':', /[0-5]/, /\d/],
      keepCharPositions: true
    };
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

  @ViewChild('StartTimeView') StartTimeView: ElementRef;
  changeStartTimeView() {
    $(this.StartTimeView.nativeElement)
      .on('change', (e, args) => {
        $("#id_ipt_starttime").val($("#id_bt_starttime").val());
        this.blurStartTime();
      });
  }

  @ViewChild('EndTimeView') EndTimeView: ElementRef;
  changeEndTimeView() {
    $(this.EndTimeView.nativeElement)
      .on('change', (e, args) => {
        $("#id_ipt_endtime").val($("#id_bt_endtime").val());
        this.blurEndTime();
      });
  }
  checkError() {
    // console.log(this.OnWorkDate)
    // console.log(this.OffWorkDate)
    var all: number = 0
    for (let up of this.UploadFile) {
      all += (+up.Size)
    }

    if (all > 10485760) {
      alert('檔案不能超過10MB')
    } else if (!this.FlowDynamic_Base) {
      alert('請選擇簽核人員')
    } else if (this.goWork && $('#id_ipt_starttime').val().length == 0) {
      this.errorStartTime = { state: true, errorString: '請輸入實際到勤時間' };
    } else if (this.offWork && $('#id_ipt_endtime').val().length == 0) {
      this.errorEndTime = { state: true, errorString: '請輸入實際離勤時間' };
    } else if (!this.sendForgetForm.CauseID1) {
      this.errorCause = { state: true, errorString: '請選擇異常原因' };
    } else if (!this.goWork && !this.offWork){
      alert('請輸入實際到勤時間或實際離勤時間')
    } else {
      $('#checksenddialog').modal('show');
    }
  }
  onSubmit() {
    var SaveAndFlowStart: SaveAndFlowStartClass = new SaveAndFlowStartClass();
    SaveAndFlowStart.EmpID = this.getAttendCard.forget_man_code.toString()
    SaveAndFlowStart.EmpNameC = this.getAttendCard.forget_man_name
    SaveAndFlowStart.Date = this.getAttendCard.AttendDate
    if (this.goWork) {
      SaveAndFlowStart.DateB = this.OnWorkDate
      SaveAndFlowStart.TimeB = sumbit_formatTimetoString($('#id_ipt_starttime').val())
      var DateTime_nB = new Date(this.OnWorkDate + ' ' + $('#id_ipt_starttime').val())
      SaveAndFlowStart.DateTimeB = DateTime_nB.toJSON()
    } else {
      SaveAndFlowStart.DateB = ''
      SaveAndFlowStart.TimeB = ''
      SaveAndFlowStart.DateTimeB = ''
    }
    if (this.offWork) {
      SaveAndFlowStart.DateE = this.OffWorkDate
      SaveAndFlowStart.TimeE = sumbit_formatTimetoString($('#id_ipt_endtime').val())
      var DateTime_nE = new Date(this.OffWorkDate + ' ' + $('#id_ipt_endtime').val())
      SaveAndFlowStart.DateTimeE = DateTime_nE.toJSON()
    } else {
      SaveAndFlowStart.DateE = ''
      SaveAndFlowStart.TimeE = ''
      SaveAndFlowStart.DateTimeE = ''
    }
    SaveAndFlowStart.UploadFile = this.UploadFile

    SaveAndFlowStart.ExceptionalCode = ''
    SaveAndFlowStart.ExceptionalName = ''
    if (this.getAttendCard.EarlyMins) {
      SaveAndFlowStart.ExceptionalCode += '1,'
      SaveAndFlowStart.ExceptionalName += '早退,'
    }
    if (this.getAttendCard.LateMins) {
      SaveAndFlowStart.ExceptionalCode += '2,'
      SaveAndFlowStart.ExceptionalName += '遲到,'
    }
    if (this.getAttendCard.IsAbsent) {
      SaveAndFlowStart.ExceptionalCode += '3,'
      SaveAndFlowStart.ExceptionalName += '未刷卡,'
    }

    SaveAndFlowStart.CauseID1 = this.sendForgetForm.CauseID1
    SaveAndFlowStart.CauseName1 = this.sendForgetForm.CauseName1
    SaveAndFlowStart.Note = this.sendForgetForm.Note
    SaveAndFlowStart.ReviewEmpID = this.sendForgetForm.ReviewEmpID


    var CardCheck: CardCheckClass = {
      EmpID: SaveAndFlowStart.EmpID,
      DateB: this.OnWorkDate,
      DateE: this.OffWorkDate,
      TimeB: $('#id_ipt_starttime').val(),
      TimeE: $('#id_ipt_endtime').val(),
      CauseID1: SaveAndFlowStart.CauseID1
    }
    var FlowCardCheck: FlowCardCheckClass = {
      EmpID: SaveAndFlowStart.EmpID,
      DateB: this.OnWorkDate,
      DateE: this.OffWorkDate,
      TimeB: $('#id_ipt_starttime').val(),
      TimeE: $('#id_ipt_endtime').val(),
    }
    if (this.FlowDynamic_Base) {
      if(this.getAttendCard.ActualRote_OnDateTime === null){
        this.getAttendCard.ActualRote_OnDateTime =''
      }
      if(this.getAttendCard.ActualRote_OffDateTime === null){
        this.getAttendCard.ActualRote_OffDateTime =''
      }
      if(this.getAttendCard.AttendCard_OnDateTime === null){
        this.getAttendCard.AttendCard_OnDateTime =''
      }
      if(this.getAttendCard.AttendCard_OffDateTime === null){
        this.getAttendCard.AttendCard_OffDateTime =''
      }
      
      var ForgetSaveAndFlowStart: ForgetSaveAndFlowStartClass = {
        "FlowApp": {
          "FlowApps": [
            {
              "EmpID": SaveAndFlowStart.EmpID,
              "EmpCode": SaveAndFlowStart.EmpID,
              "EmpNameC": SaveAndFlowStart.EmpNameC,
              "Date": SaveAndFlowStart.Date,
              "RoteDateTimeB": this.getAttendCard.ActualRote_OnDateTime,
              "RoteDateTimeE": this.getAttendCard.ActualRote_OffDateTime,
              "CardDateTimeB": this.getAttendCard.AttendCard_OnDateTime,
              "CardDateTimeE": this.getAttendCard.AttendCard_OffDateTime,
              "DateB": SaveAndFlowStart.DateB,
              "DateE": SaveAndFlowStart.DateE,
              "TimeB": SaveAndFlowStart.TimeB,
              "TimeE": SaveAndFlowStart.TimeE,
              "DateTimeB": SaveAndFlowStart.DateTimeB,
              "DateTimeE": SaveAndFlowStart.DateTimeE,
              "CauseID1": SaveAndFlowStart.CauseID1,
              "CauseName1": SaveAndFlowStart.CauseName1,
              "CauseID2": SaveAndFlowStart.CauseID1,
              "CauseName2": SaveAndFlowStart.CauseName1,
              "Note": SaveAndFlowStart.Note,
              "Info": "",
              "MailBody": "",
              "State": "1",
              "UploadFile": SaveAndFlowStart.UploadFile,
              "ExceptionalCode": SaveAndFlowStart.ExceptionalCode,
              "ExceptionalName": SaveAndFlowStart.ExceptionalName,
            }
          ],
          "EmpID": this.getAttendCard.write_man_code,
          "EmpCode": this.getAttendCard.write_man_code,
          "EmpNameC": this.getAttendCard.write_man_name,
          "State": "1"
        },
        "FlowDynamic": {
          "FlowNode": "504",
          "RoleID": "",
          "EmpID": this.FlowDynamic_Base.EmpID,
          "DeptID": this.FlowDynamic_Base.DeptaID.toString(),
          "PosID": this.FlowDynamic_Base.JobID.toString()
        }
      }
      // console.log(ForgetSaveAndFlowStart)
      this.GetApiDataServiceService.getWebApiData_CardCheck(CardCheck).subscribe(
        y => {
          if (y == 1) {
            this.GetApiDataServiceService.getWebApiData_FlowCardCheck(FlowCardCheck).subscribe(
              r => {
                if (r == 1) {
                  // console.log(SaveAndFlowStart)
                  this.LoadingPage.show()
                  this.GetApiDataServiceService.getWebApiData_SaveAndFlowStart(ForgetSaveAndFlowStart).subscribe(x => {
                    // console.log(SaveAndFlowStart)
                    if (x == 1) {
                      $('#sussesdialog').modal('show');
                    } else {
                      alert('送出失敗');
                    }
                    this.LoadingPage.hide()
                  },
                    error => {
                      this.LoadingPage.hide()
                      // console.log(error)
                    })
                }
              }
            )
          }
        }
      )
    } else {
      alert('請選擇簽核人員')
    }

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
    this.goWork = true
    this.offWork = true
    this.startDateTimeChange()
    this.endDateTimeChange()
    // var calDate = new Date(this.getAttendCard.AttendDate)
    // if (this.getAttendCard.ActualRote_calCrossDay) {
    //   calDate.setDate(calDate.getDate() + 1)
    // }

    // $('#id_ipt_startday').val(this.getAttendCard.AttendDate.toString())
    // $('#id_ipt_endday').val(doFormatDate(calDate).toString())
    
    this.OnWorkDate = formatDateTime(this.getAttendCard.ActualRote_OnDateTime).getDate
    this.OffWorkDate = formatDateTime(this.getAttendCard.ActualRote_OffDateTime).getDate

    var showOnTime  = getapi_formatTimetoString(formatDateTime(this.getAttendCard.ActualRote_OnDateTime).getTime)
    var showOffTime  = getapi_formatTimetoString(formatDateTime(this.getAttendCard.ActualRote_OffDateTime).getTime)

    $('#id_ipt_starttime').val(showOnTime.toString())
    $('#id_ipt_endtime').val(showOffTime.toString())
    if(this.getAttendCard.ActualRote_calCrossDay){
      var addDate = new Date(this.getAttendCard.AttendDate+' '+'00:00')
      addDate.setDate(addDate.getDate()+1)
      this.OffWorkDate = doFormatDate(addDate)
      
    }

  }

  private Be_setGetRoteInfo$: BehaviorSubject<any> = new BehaviorSubject<Array<number>>(null);
  Ob_setGetRoteInfo$: Observable<any> = this.Be_setGetRoteInfo$;
  
  bt_Show_RoteInfo(oneSearchRoteID:number) {
    var searchRoteID: Array<number> = []
    if(oneSearchRoteID){
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