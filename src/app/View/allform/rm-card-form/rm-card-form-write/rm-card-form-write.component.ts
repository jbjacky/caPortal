import { Component, OnInit, Output, EventEmitter, Input, AfterViewInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';

import { AttendCard } from 'src/app/Models/AttendCard'
import { doFormatDate, getapi_formatTimetoString, sumbit_formatTimetoString, formatDateTime, reSplTimeHHmm } from 'src/app/UseVoid/void_doFormatDate';
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
import { CardPatchSaveAndFlowStartClass } from 'src/app/Models/PostData_API_Class/CardPatchSaveAndFlowStartClass';
import { ResponeStateClass } from 'src/app/Models/ResponeStateClass';
import { rmCardTempFormStateClass } from '../rm-card-form-temp/rm-card-form-temp.component';
import { SaveAndFlowStartCombineClass, AttendUnusualFlowApp, CardFlowApp } from 'src/app/Models/PostData_API_Class/SaveAndFlowStartCombineClass';

declare let $: any; //use jquery

@Component({
  selector: 'app-rm-card-form-write',
  templateUrl: './rm-card-form-write.component.html',
  styleUrls: ['./rm-card-form-write.component.css']
})
export class RmCardFormWriteComponent implements OnInit, AfterViewInit, OnDestroy {
  startTimeDropper: any
  endTimeDropper: any

  OnBeforeMinsF: rmCardTempFormStateClass
  OffAfterMinsF: rmCardTempFormStateClass
  EarlyMinsF: rmCardTempFormStateClass
  LateMinsF: rmCardTempFormStateClass
  OnBeforeMinsForm(event) {
    this.OnBeforeMinsF = event
  }
  OffAfterMinsForm(event) {
    this.OffAfterMinsF = event
  }

  EarlyMinsForm(event) {
    this.EarlyMinsF = event
  }
  LateMinsForm(event) {
    this.LateMinsF = event
  }
  exampleHeader = ExampleHeader //日期套件header
  ngOnDestroy(): void {
    if (this.StartTimeView) {
      $(this.StartTimeView.nativeElement).off('change');
    }
    if (this.EndTimeView) {
      $(this.EndTimeView.nativeElement).off('change');
    }
    this.api_subscribe = false;
  }
  api_subscribe = true; //ngOnDestroy時要取消訂閱api的subscribe
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

  cR_OnBeforeMins = 1
  cR_OffAfterMins = 1

  cR_EarlyMins = 1
  cR_LateMins = 1

  checkdisable() {

    if (
      ((this.getAttendCard.OnBeforeMins && !this.getAttendCard.EliminateOnBefore) || (this.getAttendCard.OffAfterMins && !this.getAttendCard.EliminateOffAfter))
      &&
      (this.getAttendCard.EarlyMins || this.getAttendCard.LateMins)
    ) {
      //有遲到+晚退 或 早退+早到的狀況
      if (this.cR_OnBeforeMins == 0 && this.cR_OffAfterMins == 0 && this.cR_EarlyMins == 0 && this.cR_LateMins == 0) {
        return true
      } else if (this.cR_LateMins == 0 && this.cR_OffAfterMins == 0) {
        return true
      } else if (this.cR_EarlyMins == 0 && this.cR_OnBeforeMins == 0) {
        return true
      } else if (this.cR_LateMins == 0 && this.cR_OffAfterMins == 2) {
        return true
      } else if (this.cR_EarlyMins == 0 && this.cR_OnBeforeMins == 2) {
        return true
      } else if (this.cR_LateMins == 1 && this.cR_OffAfterMins == 0) {
        return true
      } else if (this.cR_EarlyMins == 1 && this.cR_OnBeforeMins == 0) {
        return true
      } else if (this.cR_LateMins == 1 && this.cR_OffAfterMins == 2) {
        return true
      } else if (this.cR_EarlyMins == 1 && this.cR_OnBeforeMins == 2) {
        return true
      } else {
        if (this.cR_OnBeforeMins == 3) {
          if (!this.OnBeforeMinsF) {
            return true
          } else if (this.OnBeforeMinsF.FormState != 'VALID')
            return true
        }
        if (this.cR_OffAfterMins == 3) {
          if (!this.OffAfterMinsF) {
            return true
          } else if (this.OffAfterMinsF.FormState != 'VALID')
            return true
        }
        if (this.cR_EarlyMins == 2) {
          if (!this.EarlyMinsF) {
            return true
          } else if (this.EarlyMinsF.FormState != 'VALID')
            return true
        }
        if (this.cR_LateMins == 2) {
          if (!this.LateMinsF) {
            return true
          } else if (this.LateMinsF.FormState != 'VALID')
            return true
        }
      }
      if((this.cR_OnBeforeMins == 3 || this.cR_OffAfterMins == 3 || this.cR_EarlyMins == 2 || this.cR_LateMins == 2) && !this.FlowDynamic_Base){
        return true
      }
      return false
    }
    if (this.getAttendCard.OnBeforeMins && !this.getAttendCard.EliminateOnBefore) {
      if (this.cR_OnBeforeMins == 0 || this.cR_OnBeforeMins == 2) {
        return true
      } else {
        if (this.cR_OnBeforeMins == 3) {
          if (!this.OnBeforeMinsF) {
            return true
          } else if (this.OnBeforeMinsF.FormState != 'VALID')
            return true
        }
      }
    }
    if (this.getAttendCard.OffAfterMins && !this.getAttendCard.EliminateOffAfter) {
      if (this.cR_OffAfterMins == 0 || this.cR_OffAfterMins == 2) {
        return true
      } else {
        if (this.cR_OffAfterMins == 3) {
          if (!this.OffAfterMinsF) {
            return true
          } else if (this.OffAfterMinsF.FormState != 'VALID')
            return true
        }
      }
    }
    if (this.getAttendCard.EarlyMins) {
      if (this.cR_EarlyMins == 0 || this.cR_EarlyMins == 1) {
        return true
      } else {
        if (this.cR_EarlyMins == 2) {
          if (!this.EarlyMinsF) {
            return true
          } else if (this.EarlyMinsF.FormState != 'VALID')
            return true
        }
      }
    }
    if (this.getAttendCard.LateMins) {
      if (this.cR_LateMins == 0 || this.cR_LateMins == 1) {
        return true
      } else {
        if (this.cR_LateMins == 2) {
          if (!this.LateMinsF) {
            return true
          } else if (this.LateMinsF.FormState != 'VALID')
            return true
        }
      }
    }
    if((this.cR_OnBeforeMins == 3 || this.cR_OffAfterMins == 3 || this.cR_EarlyMins == 2 || this.cR_LateMins == 2) && !this.FlowDynamic_Base){
      return true
    }
    return false
  }
  disOnBeforeRadio(realRadio, uiRadio) {
    if (realRadio == uiRadio) {
      this.cR_OnBeforeMins = 0
    }
  }
  disOffAfterRadio(realRadio, uiRadio) {
    if (realRadio == uiRadio) {
      this.cR_OffAfterMins = 0
    }
  }
  disEarlyRadio(realRadio, uiRadio) {
    if (realRadio == uiRadio) {
      this.cR_EarlyMins = 0
    }
  }
  disLateRadio(realRadio, uiRadio) {
    if (realRadio == uiRadio) {
      this.cR_LateMins = 0
    }
  }
  adata = []
  ngOnInit() {
    this.Sub_onChangeSignMan$.next(this.getAttendCard.forget_man_code)

    this.GetApiDataServiceService.getWebApiData_GetCauseByForm()
      .pipe(takeWhile(() => this.api_subscribe))
      .subscribe(
        (data: any) => {
          // console.log(this.getAttendCard)
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

    this.startTimeDropper = $("#id_bt_starttime").timeDropper({
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


    this.endTimeDropper = $("#id_bt_endtime").timeDropper({
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
    this.startTimeDropper[0].myprop1(reSplTimeHHmm($("#id_ipt_starttime").val()).HH, reSplTimeHHmm($("#id_ipt_starttime").val()).mm);
    $(this.StartTimeView.nativeElement)
      .on('change', (e, args) => {
        $("#id_ipt_starttime").val($("#id_bt_starttime").val());
        this.blurStartTime();
      });
  }

  @ViewChild('EndTimeView') EndTimeView: ElementRef;
  changeEndTimeView() {
    this.endTimeDropper[0].myprop1(reSplTimeHHmm($("#id_ipt_endtime").val()).HH, reSplTimeHHmm($("#id_ipt_endtime").val()).mm);
    $(this.EndTimeView.nativeElement)
      .on('change', (e, args) => {
        $("#id_ipt_endtime").val($("#id_bt_endtime").val());
        this.blurEndTime();
      });
  }

  forgetShowCheckText = ''
  forgetShowCheckFlowText = ''
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
    } else if (!this.goWork && !this.offWork) {
      alert('請補到勤時間或補離勤時間')
    } else {
      if (this.getAttendCard.AttendCard_OnDateTime && this.getAttendCard.AttendCard_OffDateTime) {
        var AttendCard_OnDateTime = new Date(this.getAttendCard.AttendCard_OnDateTime)
        var AttendCard_OffDateTime = new Date(this.getAttendCard.AttendCard_OffDateTime)
        var write_start_First = new Date(doFormatDate(this.OnWorkDate) + ' ' + $('#id_ipt_starttime').val())
        var write_end_First = new Date(doFormatDate(this.OffWorkDate) + ' ' + $('#id_ipt_endtime').val())
        if (write_start_First > AttendCard_OnDateTime && write_start_First < AttendCard_OffDateTime) {
          alert('補到勤刷卡時間不能在刷卡期間')
        } else if (write_end_First > AttendCard_OnDateTime && write_end_First < AttendCard_OffDateTime) {
          alert('補離勤刷卡時間不能在刷卡期間')
        } else {
          $('#checksenddialog').modal('show');
        }
      } else {
        $('#checksenddialog').modal('show');
      }
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

    var ExceptionalCode = ''
    var ExceptionalName = ''
    var ErrorStateCode = ''
    var ErrorStateName = ''

    if (this.getAttendCard.LateMins && !this.getAttendCard.EliminateLate) {
      ExceptionalCode += '1,'
      ExceptionalName += '早退,'
      ErrorStateCode = '1'
      ErrorStateName = '早退'
    }
    if (this.getAttendCard.EarlyMins && !this.getAttendCard.EliminateEarly) {
      ExceptionalCode += '2,'
      ExceptionalName += '遲到,'
      ErrorStateCode = '2'
      ErrorStateName = '遲到'
    }
    if (this.getAttendCard.IsAbsent && !this.getAttendCard.EliminateAbsent) {
      ExceptionalCode += '3,'
      ExceptionalName += '未刷卡,'
      ErrorStateCode = '3'
      ErrorStateName = '未刷卡'
    }
    if (this.getAttendCard.OnBeforeMins && !this.getAttendCard.EliminateOnBefore) {
      ExceptionalCode += '4,'
      ExceptionalName += '早到,'
      ErrorStateCode = '4'
      ErrorStateName = '早到'
    }
    if (this.getAttendCard.OffAfterMins && !this.getAttendCard.EliminateOffAfter) {
      ExceptionalCode += '5,'
      ExceptionalName += '晚退,'
      ErrorStateCode = '5'
      ErrorStateName = '晚退'
    } else if (
      (!this.getAttendCard.LateMins || (this.getAttendCard.LateMins && this.getAttendCard.EliminateLate)) &&
      (!this.getAttendCard.EarlyMins || (this.getAttendCard.EarlyMins && this.getAttendCard.EliminateEarly)) &&
      (!this.getAttendCard.IsAbsent || (this.getAttendCard.IsAbsent && this.getAttendCard.EliminateAbsent)) &&
      (!this.getAttendCard.OnBeforeMins || (this.getAttendCard.OnBeforeMins && this.getAttendCard.EliminateOnBefore)) &&
      (!this.getAttendCard.OffAfterMins || (this.getAttendCard.OffAfterMins && this.getAttendCard.EliminateOffAfter))
    ) {

      ExceptionalCode += '0,'
      ExceptionalName += '正常,'
      ErrorStateCode = '0'
      ErrorStateName = '正常'
      if (this.getAttendCard.IsAbnormal) {
        ExceptionalCode += '-1,'
        ExceptionalName += '不判斷,'
      }
    }

    var ExceptionalCodeCancel = ''
    var ExceptionalNameCancel = ''
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
      ExceptionalNameCancel += '早到,'
    }
    if (this.getAttendCard.OffAfterMins && this.getAttendCard.EliminateOffAfter) {
      ExceptionalCodeCancel += '5,'
      ExceptionalNameCancel += '晚退,'
    }

    SaveAndFlowStart.CauseID1 = this.sendForgetForm.CauseID1
    SaveAndFlowStart.CauseName1 = this.sendForgetForm.CauseName1
    SaveAndFlowStart.Note = this.sendForgetForm.Note
    SaveAndFlowStart.ReviewEmpID = this.sendForgetForm.ReviewEmpID


    if (this.FlowDynamic_Base) {
      if (this.getAttendCard.ActualRote_OnDateTime === null) {
        this.getAttendCard.ActualRote_OnDateTime = ''
      }
      if (this.getAttendCard.ActualRote_OffDateTime === null) {
        this.getAttendCard.ActualRote_OffDateTime = ''
      }
      if (this.getAttendCard.AttendCard_OnDateTime === null) {
        this.getAttendCard.AttendCard_OnDateTime = ''
      }
      if (this.getAttendCard.AttendCard_OffDateTime === null) {
        this.getAttendCard.AttendCard_OffDateTime = ''
      }

      // console.log(ForgetSaveAndFlowStart)

      // console.log(SaveAndFlowStart)
      this.LoadingPage.show()

      var SaveAndFlowStartCombine: SaveAndFlowStartCombineClass[] = [
        {
          "AttendUnusualFlowApp": null,
          "CardFlowApp": {
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
                "CauseID1": parseInt(SaveAndFlowStart.CauseID1),
                "CauseName1": SaveAndFlowStart.CauseName1,
                "CauseID2": parseInt(SaveAndFlowStart.CauseID1),
                "CauseName2": SaveAndFlowStart.CauseName1,
                "Note": SaveAndFlowStart.Note,
                "Info": "",
                "MailBody": "",
                "State": "1",
                "UploadFile": SaveAndFlowStart.UploadFile,
                "ExceptionalCode": ExceptionalCode,
                "ExceptionalName": ExceptionalName, //有異常但沒註記
                "ExceptionalCodeCancel": ExceptionalCodeCancel,
                "ExceptionalNameCancel": ExceptionalNameCancel, //有異常且已經註記
                "ErrorStateCode": ErrorStateCode,
                "ErrorStateName": ErrorStateName
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
          },
          "ErrorState": ErrorStateName
        }
      ]

      this.GetApiDataServiceService.getWebApiData_SaveAndFlowStartCombine(SaveAndFlowStartCombine)
        .pipe(takeWhile(() => this.api_subscribe))
        .subscribe((ResponeStateArray: ResponeStateClass[]) => {
          // console.log(SaveAndFlowStart)
          if (ResponeStateArray[0].isOK) {
            $('#sussesdialog').modal('show');
          } else {
            var errMsg = ''
            for (let e of ResponeStateArray[0].ErrorMsg) {
              errMsg += e + '。 '
            }
            alert(errMsg);
          }
          this.LoadingPage.hide()
        },
          error => {
            this.LoadingPage.hide()
            // console.log(error)
          })
    } else {
      alert('請選擇簽核人員')
    }

  }


  checkStateSubmit() {
    // console.log(this.OnBeforeMinsF.rmCardTempFormData)
    // console.log(this.OffAfterMinsF)
    // console.log(this.EarlyMinsF)
    // console.log(this.LateMinsF)
    $('#errStateCheckDialog').modal('show')
  }
  onStateSubmit() {

    var ExceptionalCode = ''
    var ExceptionalName = ''

    if (this.getAttendCard.LateMins && !this.getAttendCard.EliminateLate) {
      ExceptionalCode += '1,'
      ExceptionalName += '遲到,'
    }
    if (this.getAttendCard.EarlyMins && !this.getAttendCard.EliminateEarly) {
      ExceptionalCode += '2,'
      ExceptionalName += '早退,'
    }
    if (this.getAttendCard.IsAbsent && !this.getAttendCard.EliminateAbsent) {
      ExceptionalCode += '3,'
      ExceptionalName += '未刷卡,'
    }
    if (this.getAttendCard.OnBeforeMins && !this.getAttendCard.EliminateOnBefore) {
      ExceptionalCode += '4,'
      ExceptionalName += '早到,'
    }
    if (this.getAttendCard.OffAfterMins && !this.getAttendCard.EliminateOffAfter) {
      ExceptionalCode += '5,'
      ExceptionalName += '晚退,'
    } else if (
      (!this.getAttendCard.LateMins || (this.getAttendCard.LateMins && this.getAttendCard.EliminateLate)) &&
      (!this.getAttendCard.EarlyMins || (this.getAttendCard.EarlyMins && this.getAttendCard.EliminateEarly)) &&
      (!this.getAttendCard.IsAbsent || (this.getAttendCard.IsAbsent && this.getAttendCard.EliminateAbsent)) &&
      (!this.getAttendCard.OnBeforeMins || (this.getAttendCard.OnBeforeMins && this.getAttendCard.EliminateOnBefore)) &&
      (!this.getAttendCard.OffAfterMins || (this.getAttendCard.OffAfterMins && this.getAttendCard.EliminateOffAfter))
    ) {

      ExceptionalCode += '0,'
      ExceptionalName += '正常,'
      if (this.getAttendCard.IsAbnormal) {
        ExceptionalCode += '-1,'
        ExceptionalName += '不判斷,'
      }
    }

    var ExceptionalCodeCancel = ''
    var ExceptionalNameCancel = ''
    if (this.getAttendCard.EarlyMins && this.getAttendCard.EliminateEarly) {
      ExceptionalCodeCancel += '1,'
      ExceptionalNameCancel += '遲到,'
    }
    if (this.getAttendCard.LateMins && this.getAttendCard.EliminateLate) {
      ExceptionalCodeCancel += '2,'
      ExceptionalNameCancel += '早退,'
    }
    if (this.getAttendCard.IsAbsent && this.getAttendCard.EliminateAbsent) {
      ExceptionalCodeCancel += '3,'
      ExceptionalNameCancel += '未刷卡,'
    }
    if (this.getAttendCard.OnBeforeMins && this.getAttendCard.EliminateOnBefore) {
      ExceptionalCodeCancel += '4,'
      ExceptionalNameCancel += '早到,'
    }
    if (this.getAttendCard.OffAfterMins && this.getAttendCard.EliminateOffAfter) {
      ExceptionalCodeCancel += '5,'
      ExceptionalNameCancel += '晚退,'
    }

    var uiRmCardTempFormState: uiRmCardTempFormStateClass[] = []

    if (this.OnBeforeMinsF && this.cR_OnBeforeMins == 3) {
      uiRmCardTempFormState.push({
        ErrorStateCode: 4,
        ErrorStateName: "早到",
        rmCardTempFormState: this.OnBeforeMinsF
      })
    }
    if (this.OffAfterMinsF && this.cR_OffAfterMins == 3) {
      uiRmCardTempFormState.push({
        ErrorStateCode: 5,
        ErrorStateName: "晚退",
        rmCardTempFormState: this.OffAfterMinsF
      })
    }
    if (this.LateMinsF && this.cR_LateMins == 2) {
      uiRmCardTempFormState.push({
        ErrorStateCode: 1,
        ErrorStateName: "遲到",
        rmCardTempFormState: this.LateMinsF
      })
    }
    if (this.EarlyMinsF && this.cR_EarlyMins == 2) {
      uiRmCardTempFormState.push({
        ErrorStateCode: 2,
        ErrorStateName: "早退",
        rmCardTempFormState: this.EarlyMinsF
      })
    }
    var uiAttendUnusualFlowApp: AttendUnusualFlowApp = {
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
          "EliminateLate": false,
          "EliminateEarly": false,
          "EliminateAbsent": false,
          "EliminateOnBefore": false,
          "EliminateOffAfter": false,
          "CauseID": parseInt(this.sendForgetForm.CauseID1),
          "CauseName": "個人因素",
          "Note": "",
          "Info": "",
          "MailBody": "",
          "State": "3",
          "UploadFile": [],
          "ExceptionalCode": ExceptionalCode,
          "ExceptionalName": ExceptionalName, //有異常但沒註記
          "ExceptionalCodeCancel": ExceptionalCodeCancel,
          "ExceptionalNameCancel": ExceptionalNameCancel, //有異常且已經註記
          "RoteID": this.getAttendCard.RoteID,
          "RoteNameC": this.getAttendCard.RoteNameC,
          "ErrorStateCode": "",
          "ErrorStateName": ""
        }
      ],
      "EmpID": this.getAttendCard.write_man_code,
      "EmpCode": this.getAttendCard.write_man_code,
      "EmpNameC": this.getAttendCard.write_man_name,
      "State": "3"
    }
    var AttendUnusualFlowApp: AttendUnusualFlowApp[] = []
    if ((this.getAttendCard.OnBeforeMins && !this.getAttendCard.EliminateOnBefore) && this.cR_OnBeforeMins == 1) {
      uiAttendUnusualFlowApp.FlowApps[0].ErrorStateCode = "4"
      uiAttendUnusualFlowApp.FlowApps[0].ErrorStateName = "早到"
      uiAttendUnusualFlowApp.FlowApps[0].EliminateOnBefore = true
      AttendUnusualFlowApp.push(uiAttendUnusualFlowApp)
    }
    if ((this.getAttendCard.OffAfterMins && !this.getAttendCard.EliminateOffAfter) && this.cR_OffAfterMins == 1) {
      uiAttendUnusualFlowApp.FlowApps[0].ErrorStateCode = "5"
      uiAttendUnusualFlowApp.FlowApps[0].ErrorStateName = "晚退"
      uiAttendUnusualFlowApp.FlowApps[0].EliminateOffAfter = true
      AttendUnusualFlowApp.push(uiAttendUnusualFlowApp)
    }


    var SaveAndFlowStartCombine: SaveAndFlowStartCombineClass[] = []
    for (let A of AttendUnusualFlowApp) {
      var FlowDynamic_Base_EmpID
      var FlowDynamic_Base_DeptaID
      var FlowDynamic_Base_JobID
      if(this.FlowDynamic_Base){
        FlowDynamic_Base_EmpID = this.FlowDynamic_Base.EmpID
        FlowDynamic_Base_DeptaID = this.FlowDynamic_Base.DeptaID.toString()
        FlowDynamic_Base_JobID = this.FlowDynamic_Base.JobID.toString()
      }
      SaveAndFlowStartCombine.push(
        {
          "AttendUnusualFlowApp": A,
          "CardFlowApp": null,
          "FlowDynamic": {
            "FlowNode": "519",
            "RoleID": "",
            "EmpID": FlowDynamic_Base_EmpID,
            "DeptID": FlowDynamic_Base_DeptaID,
            "PosID": FlowDynamic_Base_JobID
          },
          "ErrorState": A.FlowApps[0].ErrorStateName
        })
    }

    for (let uiState of uiRmCardTempFormState) {
      var FlowDynamic_Base_EmpID
      var FlowDynamic_Base_DeptaID
      var FlowDynamic_Base_JobID
      if(this.FlowDynamic_Base){
        FlowDynamic_Base_EmpID = this.FlowDynamic_Base.EmpID
        FlowDynamic_Base_DeptaID = this.FlowDynamic_Base.DeptaID.toString()
        FlowDynamic_Base_JobID = this.FlowDynamic_Base.JobID.toString()
      }
      var DateB:string
      var DateE:string
      var TimeB:string
      var TimeE:string
      var DateTimeB:string
      var DateTimeE:string
      if (uiState.ErrorStateName == "遲到" || uiState.ErrorStateName == "早到") {
        DateB = uiState.rmCardTempFormState.rmCardTempFormData.rcFirstCardDate.valueOf().toString()
        TimeB = uiState.rmCardTempFormState.rmCardTempFormData.rcFirstCardTime.valueOf().toString()
        var _DateTimeB = new Date(DateB + ' ' + TimeB)
        DateTimeB = _DateTimeB.toJSON()
        TimeB = sumbit_formatTimetoString(TimeB)
      }
      if (uiState.ErrorStateName == "早退" || uiState.ErrorStateName == "晚退") {
        DateE = uiState.rmCardTempFormState.rmCardTempFormData.rcFirstCardDate.valueOf().toString()
        TimeE = uiState.rmCardTempFormState.rmCardTempFormData.rcFirstCardTime.valueOf().toString()
        var _DateTimeE = new Date(DateE + ' ' + TimeE)
        DateTimeE = _DateTimeE.toJSON()
        TimeE = sumbit_formatTimetoString(TimeE)
      }
      SaveAndFlowStartCombine.push(
        {
          "AttendUnusualFlowApp": null,
          "CardFlowApp": {
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
                "DateB": DateB,
                "DateE": DateE,
                "TimeB": TimeB,
                "TimeE": TimeE,
                "DateTimeB": DateTimeB,
                "DateTimeE": DateTimeE,
                "CauseID1": parseInt(uiState.rmCardTempFormState.rmCardTempFormData.rcCause.valueOf().toString()),
                "CauseName1": "",
                "CauseID2": 0,
                "CauseName2": "",
                "Info": "",
                "MailBody": "",
                "State": "1",
                "Note":  uiState.rmCardTempFormState.rmCardTempFormData.rcNote.valueOf().toString(),
                "UploadFile": uiState.rmCardTempFormState.rmCardTempFormData.rcUploadData.values,
                "ExceptionalCode": ExceptionalCode,
                "ExceptionalName": ExceptionalName,
                "ExceptionalCodeCancel": ExceptionalCodeCancel,
                "ExceptionalNameCancel": ExceptionalNameCancel,
                "ErrorStateCode": uiState.ErrorStateCode.toString(),
                "ErrorStateName": uiState.ErrorStateName
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
            "EmpID": FlowDynamic_Base_EmpID,
            "DeptID": FlowDynamic_Base_DeptaID,
            "PosID": FlowDynamic_Base_JobID
          },
          "ErrorState": uiState.ErrorStateName
        })
    }
    console.log(SaveAndFlowStartCombine)
    // this.LoadingPage.show()
    // this.GetApiDataServiceService.getWebApiData_SaveAndFlowStartCombine(SaveAndFlowStartCombine)
    //   .pipe(takeWhile(() => this.api_subscribe))
    //   .subscribe((ResponeStateArray: ResponeStateClass[]) => {
    //     // console.log(SaveAndFlowStart)
    //     if (ResponeStateArray[0].isOK) {
    //       $('#sussesdialog').modal('show');
    //     } else {
    //       var errMsg = ''
    //       for (let e of ResponeStateArray[0].ErrorMsg) {
    //         errMsg += e + '。 '
    //       }
    //       alert(errMsg);
    //     }
    //     this.LoadingPage.hide()
    //   },
    //     error => {
    //       this.LoadingPage.hide()
    //       // console.log(error)
    //     })


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


class uiRmCardTempFormStateClass {
  ErrorStateCode: number
  ErrorStateName: string
  rmCardTempFormState: rmCardTempFormStateClass
}
