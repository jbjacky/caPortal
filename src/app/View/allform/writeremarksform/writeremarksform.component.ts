import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, NgZone, OnDestroy } from '@angular/core';
import { isValidDate, isValidTime } from 'src/app/UseVoid/void_isVaildDatetime';
import { FormGroup, FormControl, Validators, ValidatorFn, AbstractControl, AsyncValidatorFn, ValidationErrors } from '@angular/forms';
import { doFormatDate, getapi_formatTimetoString, sumbit_formatTimetoString, timeZone_tw, formatDateTime } from 'src/app/UseVoid/void_doFormatDate';
import { Observable, timer } from 'rxjs';
import { map, switchMap, takeWhile } from 'rxjs/operators';
import { GetApiUserService } from 'src/app/Service/get-api-user.service';
import { GetApiDataServiceService } from 'src/app/Service/get-api-data-service.service';
import { SaveAttendWishClass } from 'src/app/Models/PostData_API_Class/SaveAttendWishClass';
import { GetAttendWishClass } from 'src/app/Models/PostData_API_Class/GetAttendWishClass';
import { GetAttendWishByPersonClass } from 'src/app/Models/PostData_API_Class/GetAttendWishByPersonClass';
import { NgxSpinnerService } from 'ngx-spinner';
import { ExampleHeader } from 'src/app/Service/datepickerHeader';
import { Router, NavigationEnd } from '@angular/router';
import { GetBaseParameterDataClass } from 'src/app/Models/GetBaseParameterDataClass';
declare var $;
@Component({
  selector: 'app-writeremarksform',
  templateUrl: './writeremarksform.component.html',
  styleUrls: ['./writeremarksform.component.css']
})
export class WriteremarksformComponent implements OnInit, AfterViewInit, OnDestroy {
  exampleHeader = ExampleHeader //日期套件header
  ngOnDestroy(): void {
    $(this.StartTimeView.nativeElement).off('change');
    $(this.EndTimeView.nativeElement).off('change');
    this.api_subscribe = false;
  }
  ngZone: NgZone = new NgZone({ enableLongStackTrace: true });

  api_subscribe = true; //ngOnDestroy時要取消
  otData: getData[] = []
  chData: getData[] = []
  vaData: getData[] = []

  ngAfterViewInit(): void {
    var currentYear = new Date().getFullYear();

    $("#id_bt_starttime").change(function () {
      $("#id_ipt_starttime").val($("#id_bt_starttime").val());
    });
    $("#id_bt_endtime").change(function () {
      $("#id_ipt_endtime").val($("#id_bt_endtime").val());
    });

    //綁定顯示時間選擇器
    $("#id_bt_starttime").val('08:00');
    $("#id_bt_starttime").timeDropper({
      format: 'HH:mm',
      autoswitch: false,
      mousewheel: true,
      setCurrentTime: false
    });
    $("#id_bt_endtime").val('17:00');
    $("#id_bt_endtime").timeDropper({
      format: 'HH:mm',
      autoswitch: false,
      mousewheel: true,
      setCurrentTime: false
    });


    // this.router.events
    //   .pipe(takeWhile(() => this.api_subscribe))
    //   .subscribe((e: any) => {
    //     // If it is a NavigationEnd event re-initalise the component
    //     if (e instanceof NavigationEnd) {
    //       this.ngOnInit()
    //     }
    //   });

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
  starttimeMask(): {
    mask: Array<string | RegExp>;
    keepCharPositions: boolean;
  } {
    return {
      mask: [/[0-2]/, $("#id_ipt_starttime").val() && parseInt($("#id_ipt_starttime").val()[0]) > 1 ? /[0-3]/ : /\d/, ':', /[0-5]/, /\d/],
      keepCharPositions: true
    };
  }

  endtimeMask(): {
    mask: Array<string | RegExp>;
    keepCharPositions: boolean;
  } {
    return {
      mask: [/[0-2]/, $("#id_ipt_starttime").val() && parseInt($("#id_ipt_endtime").val()[0]) > 1 ? /[0-3]/ : /\d/, ':', /[0-5]/, /\d/],
      keepCharPositions: true
    };
  }


  radiogroup: any = [
    { id: 2, name: '加班' },
    { id: 3, name: '調班' },
    // { id: 1, name: '請假' },
  ];
  chooseRadio: number = 2;
  formgroup: FormGroup;
  toapiRemark: RemarksClass = new RemarksClass();
  errorStartDate = { state: false, errorString: '' };
  errorStartTime = { state: false, errorString: '' };
  errorEndDate = { state: false, errorString: '' };
  errorEndTime = { state: false, errorString: '' };
  errorRemarkString = { state: false, errorString: '' };
  dateB: Date = new Date()
  dateE: Date = new Date()
  constructor(private router: Router,
    private GetApiUserService: GetApiUserService,
    private GetApiDataServiceService: GetApiDataServiceService,
    private LoadingPage: NgxSpinnerService) { }

  get search_DateB() {
    var search_DateB = new Date()
    search_DateB.setDate(search_DateB.getDate() - 360)
    return search_DateB
  }
  get search_DateE() {
    var search_DateE = new Date()
    search_DateE.setDate(search_DateE.getDate() + 360)
    return search_DateE
  }
  ngOnInit() {

    this.GetApiUserService.counter$.subscribe(
      x => {
        // console.log (x)
        this.toapiRemark.write_man_code = x.EmpCode
        if (x.EmpNameC) {
          this.toapiRemark.write_man_name = x.EmpNameC;
        } else {
          this.toapiRemark.write_man_name = x.EmpNameE;
        }
        this.GetAttendWish_ot();
        this.GetAttendWish_ch();
        this.GetAttendWish_va();
      })

  }

  SerchStartDateChange() {
    if (this.dateE > this.dateB) {

    } else {
      this.dateE = new Date(this.dateB)
    }
    this.checkStartAndEndDate()
  }
  blurStartDate() {
    if (this.checkStartAndEndDate()) {

    }
    else {
      if ($("#id_ipt_startday").val().length == 0) {
        this.errorStartDate = { state: true, errorString: '請填寫起始日期' };
        $("#id_ipt_startday").addClass("errorInput");
        return true
      } else if (!isValidDate($("#id_ipt_startday").val())) {
        this.errorStartDate = { state: true, errorString: '日期格式錯誤' };
        $("#id_ipt_startday").addClass("errorInput");
        return true
      } else {
        this.errorStartDate = { state: false, errorString: '' };
        $("#id_ipt_startday").removeClass("errorInput");
        return false
      }
    }
  }
  blurEndDate() {
    if (this.checkStartAndEndDate()) {

    } else {
      if ($("#id_ipt_endday").val().length == 0) {
        this.errorEndDate = { state: true, errorString: '請填寫結束日期' };
        $("#id_ipt_endday").addClass("errorInput");
        return true

      } else if (!isValidDate($("#id_ipt_endday").val())) {
        this.errorEndDate = { state: true, errorString: '日期格式錯誤' };
        $("#id_ipt_endday").addClass("errorInput");
        return true

      } else {
        this.errorEndDate = { state: false, errorString: '' };
        $("#id_ipt_endday").removeClass("errorInput");
        return false

      }
    }
  }

  blurStartTime() {
    if (this.checkStartAndEndDate()) {

    }
    else {
      if ($("#id_ipt_starttime").val().length == 0) {
        this.errorStartTime = { state: true, errorString: '請填寫起始時間' };
        $("#id_ipt_starttime").addClass("errorInput");
        return true

      } else if (!isValidTime($("#id_ipt_starttime").val())) {
        this.errorStartTime = { state: true, errorString: '時間格式錯誤' };
        $("#id_ipt_starttime").addClass("errorInput");
        return true

      } else {
        this.errorStartTime = { state: false, errorString: '' };
        $("#id_ipt_starttime").removeClass("errorInput");
        return false

      }
    }
  }

  blurEndTime() {
    if (this.checkStartAndEndDate()) {

    }

    if ($("#id_ipt_endtime").val().length == 0) {
      this.errorEndTime = { state: true, errorString: '請填寫結束時間' };
      $("#id_ipt_endtime").addClass("errorInput");
      return true

    } else if (!isValidTime($("#id_ipt_endtime").val())) {
      this.errorEndTime = { state: true, errorString: '時間格式錯誤' };
      $("#id_ipt_endtime").addClass("errorInput");
      return true

    } else {
      this.errorEndTime = { state: false, errorString: '' };
      $("#id_ipt_endtime").removeClass("errorInput");
      return false

    }
  }
  blurRemarkString() {
    if (this.checkStartAndEndDate()) {

    } else {
      if ($("#remarkstring").val().length == 0) {
        this.errorRemarkString = { state: true, errorString: '請填寫申請備註' };
        $("#remarkstring").addClass("errorInput");
        return true

      } else {
        this.errorRemarkString = { state: false, errorString: '' };
        $("#remarkstring").removeClass("errorInput");
        return false

      }
    }
  }

  checkSendSubmit() {
    if (this.blurEndDate() || this.blurEndTime() ||
      this.blurRemarkString() || this.blurStartDate() || this.blurStartTime()) {
      return true
    } else {
      return false
    }
  }

  checkStartAndEndDate() {
    var startDate = doFormatDate(this.dateB).toString()
    var endDate = doFormatDate(this.dateE).toString()
    var startTime = $('#id_ipt_starttime').val()
    var endTime = $('#id_ipt_endtime').val()

    var start = new Date(startDate + ' ' + startTime)
    var end = new Date(endDate + ' ' + endTime)
    if (start > end) {
      this.errorStartDate = { state: true, errorString: '起始區間大於結束區間' }
      this.errorStartTime = { state: true, errorString: '起始區間大於結束區間' }
      this.errorEndDate = { state: true, errorString: '起始區間大於結束區間' }
      this.errorEndTime = { state: true, errorString: '起始區間大於結束區間' }

      $("#id_ipt_startday").addClass("errorInput");
      $("#id_ipt_endday").addClass("errorInput");
      $("#id_ipt_starttime").addClass("errorInput");
      $("#id_ipt_endtime").addClass("errorInput");
      return true
    } else {
      this.errorStartDate = { state: false, errorString: '' }
      this.errorStartTime = { state: false, errorString: '' }
      this.errorEndDate = { state: false, errorString: '' }
      this.errorEndTime = { state: false, errorString: '' }
      $("#id_ipt_startday").removeClass("errorInput");
      $("#id_ipt_endday").removeClass("errorInput");
      $("#id_ipt_starttime").removeClass("errorInput");
      $("#id_ipt_endtime").removeClass("errorInput");
      return false
    }
  }

  disableSendRemarksForm() {
    if (this.errorStartDate.state ||
      this.errorStartTime.state ||
      this.errorEndDate.state ||
      this.errorEndTime.state ||
      this.errorRemarkString.state ||
      this.isSubmit
    ) {
      return true
    } else {
      return false
    }
  }
  GetAttendWish_ot() {
    if (this.toapiRemark.write_man_code) {
      var lastDay = new Date()
      // lastDay.setDate(lastDay.getDate())
      // lastDay.setMinutes(lastDay.getMinutes() - lastDay.getTimezoneOffset())
      var GetAttendWish_otdata: GetAttendWishByPersonClass =
      {
        DateB: doFormatDate(lastDay),
        WishTypeID: "2",
        ListEmpID: this.toapiRemark.write_man_code.toString()
      }
      // console.log(GetAttendWish_otdata)
      this.GetAttendWish(GetAttendWish_otdata, '2');
    }
  }
  GetAttendWish_ch() {

    if (this.toapiRemark.write_man_code) {

      var lastDay = new Date()
      // lastDay.setDate(lastDay.getDate())
      // lastDay.setMinutes(lastDay.getMinutes() - lastDay.getTimezoneOffset())
      var GetAttendWish_chdata: GetAttendWishByPersonClass =
      {
        DateB: doFormatDate(lastDay),
        WishTypeID: "3",
        ListEmpID: this.toapiRemark.write_man_code.toString()
      }
      this.GetAttendWish(GetAttendWish_chdata, '3');
    }
  }
  GetAttendWish_va() {

    if (this.toapiRemark.write_man_code) {

      var lastDay = new Date()
      lastDay.setDate(lastDay.getDate() - 1)
      lastDay.setMinutes(lastDay.getMinutes() - lastDay.getTimezoneOffset())
      var GetAttendWish_vadata: GetAttendWishByPersonClass =
      {
        DateB: lastDay.toJSON(),
        WishTypeID: "1",
        ListEmpID: this.toapiRemark.write_man_code.toString()
      }
      this.GetAttendWish(GetAttendWish_vadata, '1');
    }
  }

  GetAttendWish(GetAttendWish_data, WishTypeID) {
    this.GetApiDataServiceService.getWebApiData_GetAttendWishByPerson(GetAttendWish_data)
      .pipe(takeWhile(() => this.api_subscribe))
      .subscribe(
        (x: any) => {
          if (WishTypeID == '2') {
            this.otData = x
            for (let ot of this.otData) {
              var DateB = new Date(ot.DateB)
              var DateE = new Date(ot.DateE)
              var UpdateDate = new Date(ot.UpdateDate)

              ot.DateB = doFormatDate(timeZone_tw(DateB))
              ot.DateE = doFormatDate(timeZone_tw(DateE))
              ot.TimeB = getapi_formatTimetoString(ot.TimeB)
              ot.TimeE = getapi_formatTimetoString(ot.TimeE)

              UpdateDate = timeZone_tw(UpdateDate)
              var hour = UpdateDate.getHours()
              var minute = UpdateDate.getMinutes()
              var UpdateDate_hour = hour.toString()
              var UpdateDate_minute = minute.toString()
              if (hour < 10) {
                UpdateDate_hour = '0' + UpdateDate_hour.toString()
              }
              if (minute < 10) {
                UpdateDate_minute = '0' + UpdateDate_minute.toString()
              }

              ot.UpdateDate = doFormatDate(UpdateDate) + ' ' + UpdateDate_hour + ":" + UpdateDate_minute
            }
          }

          if (WishTypeID == '1') {
            this.vaData = x
            for (let va of this.vaData) {
              var DateB = new Date(va.DateB)
              var DateE = new Date(va.DateE)
              var UpdateDate = new Date(va.UpdateDate)

              va.DateB = doFormatDate(timeZone_tw(DateB))
              va.DateE = doFormatDate(timeZone_tw(DateE))
              va.TimeB = getapi_formatTimetoString(va.TimeB)
              va.TimeE = getapi_formatTimetoString(va.TimeE)

              UpdateDate = timeZone_tw(UpdateDate)
              var hour = UpdateDate.getHours()
              var minute = UpdateDate.getMinutes()
              var UpdateDate_hour = hour.toString()
              var UpdateDate_minute = minute.toString()
              if (hour < 10) {
                UpdateDate_hour = '0' + UpdateDate_hour.toString()
              }
              if (minute < 10) {
                UpdateDate_minute = '0' + UpdateDate_minute.toString()
              }

              va.UpdateDate = doFormatDate(UpdateDate) + ' ' + UpdateDate_hour + ":" + UpdateDate_minute
            }
          }

          if (WishTypeID == '3') {
            this.chData = x
            for (let ch of this.chData) {
              var DateB = new Date(ch.DateB)
              var DateE = new Date(ch.DateE)
              var UpdateDate = new Date(ch.UpdateDate)

              ch.DateB = doFormatDate(timeZone_tw(DateB))
              ch.DateE = doFormatDate(timeZone_tw(DateE))
              ch.TimeB = getapi_formatTimetoString(ch.TimeB)
              ch.TimeE = getapi_formatTimetoString(ch.TimeE)

              UpdateDate = timeZone_tw(UpdateDate)
              var hour = UpdateDate.getHours()
              var minute = UpdateDate.getMinutes()
              var UpdateDate_hour = hour.toString()
              var UpdateDate_minute = minute.toString()
              if (hour < 10) {
                UpdateDate_hour = '0' + UpdateDate_hour.toString()
              }
              if (minute < 10) {
                UpdateDate_minute = '0' + UpdateDate_minute.toString()
              }

              ch.UpdateDate = doFormatDate(UpdateDate) + ' ' + UpdateDate_hour + ":" + UpdateDate_minute
            }
          }
        }
      )

  }
  checkCanSubmit() {
    if (this.checkSendSubmit() || this.checkStartAndEndDate()) {

    } else {

      this.GetApiDataServiceService.getWebApiData_GetBaseParameter(this.toapiRemark.write_man_code)
        .pipe(takeWhile(() => this.api_subscribe))
        .subscribe((GetBaseParameterData: GetBaseParameterDataClass[]) => {
          if (GetBaseParameterData.length > 0) {
            if (GetBaseParameterData[0].IsAllowLeave) {

              var calDate = new Date(this.dateB)
              calDate.setDate(calDate.getDate() - 1)
              calDate.setHours(8, 0, 0)
              calDate.setMinutes(0, 0, 0)
              calDate.setSeconds(0, 0)

              var today = new Date()
              if (calDate > today) {

                $('#checksenddialog').modal('show');
              } else {
                alert('最晚在\t' + doFormatDate(calDate) + '\t08:00前提出')
              }

            } else {
              alert(this.toapiRemark.write_man_code.toString() + '此員工無申請表單權限，如需申請表單請洽單位行政設定')
              this.LoadingPage.hide()
            }
          } else {
            alert(this.toapiRemark.write_man_code.toString() + '此員工無申請表單權限，如需申請表單請洽單位行政設定')
            this.LoadingPage.hide()
          }
        })


    }
  }
  isSubmit = false;
  onSubmit() {
    if (this.checkSendSubmit() || this.checkStartAndEndDate()) {

    } else {

      this.toapiRemark.rqtype = this.chooseRadio
      this.toapiRemark.startDate = $('#id_ipt_startday').val()
      this.toapiRemark.endDate = $('#id_ipt_endday').val()
      this.toapiRemark.startTime = sumbit_formatTimetoString($('#id_ipt_starttime').val())
      this.toapiRemark.endTime = sumbit_formatTimetoString($('#id_ipt_endtime').val())
      this.toapiRemark.remarkstring = $('#remarkstring').val()

      var SaveAttendWish: SaveAttendWishClass =
      {
        EmpID: this.toapiRemark.write_man_code,
        WishTypeID: this.toapiRemark.rqtype.toString(),
        DateB: this.toapiRemark.startDate,
        DateE: this.toapiRemark.endDate,
        TimeB: this.toapiRemark.startTime,
        TimeE: this.toapiRemark.endTime,
        Note: this.toapiRemark.remarkstring,
        KeyMan: this.toapiRemark.write_man_code
      }

      // console.log(SaveAttendWish)

      this.isSubmit = true
      if (this.isSubmit) {
        this.GetApiDataServiceService.getWebApiData_SaveAttendWish(SaveAttendWish)
          .pipe(takeWhile(() => this.api_subscribe))
          .subscribe(
            x => {
              if (x) {
                this.isSubmit = false
                $('#remarkstring').val('')
                if (SaveAttendWish.WishTypeID == '2') {
                  $('#ot_bt').trigger('click')
                  this.GetAttendWish_ot();
                } else if (SaveAttendWish.WishTypeID == '1') {
                  $('#va_bt').trigger('click')
                  this.GetAttendWish_va();
                } else if (SaveAttendWish.WishTypeID == '3') {
                  $('#ch_bt').trigger('click')
                  this.GetAttendWish_ch();

                }
                $('#sussesdialog').modal('show');
              } else {
                alert('送出失敗')
                this.isSubmit = false;
              }
            }
          )
      }
    }


  }

  updateDateToggle = false;
  buttonText = '降冪'
  get format() { return this.updateDateToggle ? 'UpdateDate' : '-UpdateDate'; }
  toggleFormat() {
    this.updateDateToggle = !this.updateDateToggle;
    this.updateDateToggle ? this.buttonText = '降冪' : this.buttonText = '升冪'
  }

  @ViewChild('StartTimeView') StartTimeView: ElementRef;
  changeStartTimeView() {
    $("#id_ipt_starttime").val($("#id_bt_starttime").val());
    this.blurStartTime()
    $(this.StartTimeView.nativeElement)
      .on('change', (e, args) => {
        $("#id_ipt_starttime").val($("#id_bt_starttime").val());
        this.blurStartTime()
        this.ngZone.run(() => { });

      });
  }
  @ViewChild('EndTimeView') EndTimeView: ElementRef;
  changeEndTimeView() {
    $("#id_ipt_endtime").val($("#id_bt_endtime").val());
    this.blurEndTime()
    $(this.EndTimeView.nativeElement)
      .on('change', (e, args) => {
        $("#id_ipt_endtime").val($("#id_bt_endtime").val());
        this.blurEndTime()
        this.ngZone.run(() => { });

      });
  }

  canSend() {
    var startdate = $('#id_ipt_startday').val()
    var starttime = $("#id_ipt_starttime").val()
    var enddate = $('#id_ipt_endday').val()
    var endtime = $("#id_ipt_endtime").val()

    if (!isValidDate(startdate)) {
      return true
    } else if (!isValidDate(enddate)) {
      return true
    } else if (!isValidTime(starttime)) {
      return true
    } else if (!isValidTime(endtime)) {
      return true
    } else {
      return false;
    }
  }

  sendDelData: getData
  checkDel(DelData: getData) {

    var calDate = new Date(DelData.DateB + ' ' + DelData.TimeB)
    calDate.setDate(calDate.getDate() - 1)
    calDate.setHours(8, 0, 0)
    calDate.setMinutes(0, 0, 0)
    calDate.setSeconds(0, 0)

    var today = new Date()

    if (calDate > today) {
      this.sendDelData = DelData
      $('#checkDeldialog').modal('show');
    } else {
      alert('最晚在\t' + doFormatDate(calDate) + '\t08:00前提出')
    }
  }
  delete() {
    this.GetApiDataServiceService.getWebApiData_UpdateAttendWish(this.sendDelData.AttendWishID, this.toapiRemark.write_man_code)
      .pipe(takeWhile(() => this.api_subscribe))
      .subscribe(x => {
        this.GetAttendWish_ot()
        this.GetAttendWish_ch()
        this.GetAttendWish_va()
      })
  }

}

class RemarksClass {
  write_man_code: string;
  write_man_name: string;
  rqtype: number;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  remarkstring: string;
}

class getData {
  AttendWishID: number
  EmpID: string
  EmpCode: string
  EmpNameC: string
  WishTypeID: string
  WishTypeName: string
  DateB: string
  DateE: string
  TimeB: string
  TimeE: string
  DateTimeB: string
  DateTimeE: string
  Note: string
  State: string
  UpdateDate: string
}
