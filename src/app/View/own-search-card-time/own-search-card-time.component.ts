import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { GetApiDataServiceService } from 'src/app/Service/get-api-data-service.service';
import { chinesenum } from 'src/app/UseVoid/void_chinesenumber'
import { GetAttendInfoClass } from 'src/app/Models/PostData_API_Class/GetAttendInfoClass';
import { doFormatDate, timeZone_tw, formatDateTime } from 'src/app/UseVoid/void_doFormatDate';
import { BehaviorSubject, Observable } from 'rxjs';
import { Attendance } from 'src/app/Models/Attendance';
import { GetApiUserService } from 'src/app/Service/get-api-user.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ExampleHeader } from 'src/app/Service/datepickerHeader';
import { void_MonthDiff } from 'src/app/UseVoid/void_DateDiff';
import { takeWhile } from 'rxjs/operators';
declare let $: any; //use jquery

@Component({
  selector: 'app-own-search-card-time',
  templateUrl: './own-search-card-time.component.html',
  styleUrls: ['./own-search-card-time.component.css']
})
export class OwnSearchCardTimeComponent implements OnInit, AfterViewInit, OnDestroy {
  exampleHeader = ExampleHeader //日期套件header
  ngAfterViewInit(): void {
  }

  ngOnDestroy(): void {
    this.api_subscribe = false;
  }
  api_subscribe = true;

  EmpBase = { EmpCode: '', Name: '' };

  errorStartDateState = { state: false, errorString: '' }
  errorEndtDateState = { state: false, errorString: '' }

  constructor(private GetApiUserService: GetApiUserService,
    private GetApiDataServiceService: GetApiDataServiceService,
    private LoadingPage: NgxSpinnerService) { }

  SearchDateB: Date
  SearchDateE: Date
  SelectDisplay = 1

  ngOnInit() {
    this.GetApiUserService.counter$.subscribe(
      (x: any) => {
        if (x != 0) {
          this.EmpBase.EmpCode = x.EmpCode
          if (x.EmpNameC) {
            this.EmpBase.Name = x.EmpNameC;
          } else {
            this.EmpBase.Name = x.EmpNameE;
          }
          this.SearchDateB = new Date()
          this.SearchDateE = new Date()
          this.SearchDateB.setDate(this.SearchDateB.getDate() - 7)
          this.SearchDateE.setDate(this.SearchDateE.getDate())
          this.onSearchClick()
        }
      })
  }

  SerchStartDateChang() {
    if (this.SearchDateE > this.SearchDateB) {

    } else {
      this.SearchDateE = new Date(this.SearchDateB)
    }
    this.blurStartDate()
  }
  blurStartDate() {
    if (!this.SearchDateB) {
      $("#id_ipt_startday").addClass("errorInput");
      this.errorStartDateState = { state: true, errorString: '請填寫起始日期' }
      return true
    } else {
      var today = new Date()
      today.setHours(0, 0, 0)
      today.setMinutes(0, 0, 0)
      today.setSeconds(0, 0)

      this.SearchDateB.setHours(0, 0, 0)
      this.SearchDateB.setMinutes(0, 0, 0)
      this.SearchDateB.setSeconds(0, 0)

      this.SearchDateE.setHours(0, 0, 0)
      this.SearchDateE.setMinutes(0, 0, 0)
      this.SearchDateE.setSeconds(0, 0)

      var startdate = this.SearchDateB
      var enddate = this.SearchDateE

      if (startdate > enddate) {
        $("#id_ipt_startday").addClass("errorInput");
        this.errorStartDateState = { state: true, errorString: '起始日期不能大於結束日期' }
      } else {
        $("#id_ipt_startday").removeClass("errorInput");
        this.errorStartDateState = { state: false, errorString: '' }
      }

      if (enddate > today) {
        $("#id_ipt_endday").addClass("errorInput");
        this.errorEndtDateState = { state: true, errorString: '結束日不得大於今天' }
      } else {
        $("#id_ipt_endday").removeClass("errorInput");
        this.errorEndtDateState = { state: false, errorString: '' }
      }

      if (enddate <= today && startdate <= enddate) {
        return false
      } else {
        return true
      }
    }
  }
  blurEndDate() {
    if (!this.SearchDateE) {
      $("#id_ipt_endday").addClass("errorInput");
      this.errorEndtDateState = { state: true, errorString: '請填寫結束日期' }
      return true
    } else {

      var today = new Date()
      today.setHours(0, 0, 0)
      today.setMinutes(0, 0, 0)
      today.setSeconds(0, 0)

      this.SearchDateB.setHours(0, 0, 0)
      this.SearchDateB.setMinutes(0, 0, 0)
      this.SearchDateB.setSeconds(0, 0)

      this.SearchDateE.setHours(0, 0, 0)
      this.SearchDateE.setMinutes(0, 0, 0)
      this.SearchDateE.setSeconds(0, 0)

      var startdate = this.SearchDateB
      var enddate = this.SearchDateE

      if (startdate > enddate) {
        $("#id_ipt_startday").addClass("errorInput");
        this.errorStartDateState = { state: true, errorString: '起始日期不能大於結束日期' }
      } else {
        $("#id_ipt_startday").removeClass("errorInput");
        this.errorStartDateState = { state: false, errorString: '' }
      }

      if (enddate > today) {
        $("#id_ipt_endday").addClass("errorInput");
        this.errorEndtDateState = { state: true, errorString: '結束日不得大於今天' }
      } else {
        $("#id_ipt_endday").removeClass("errorInput");
        this.errorEndtDateState = { state: false, errorString: '' }
      }

      if (enddate <= today && startdate <= enddate) {
        return false
      } else {
        return true
      }
    }
  }

  onSearchClick() {
    var today = new Date()
    today.setHours(0, 0, 0)
    today.setMinutes(0, 0, 0)
    today.setSeconds(0, 0)

    this.SearchDateE.setHours(0, 0, 0)
    this.SearchDateE.setMinutes(0, 0, 0)
    this.SearchDateE.setSeconds(0, 0)

    var searchDateB: Date = new Date(this.SearchDateB.toString())
    var searchDateE: Date = new Date(this.SearchDateE.toString())
    if (this.SearchDateE > today) {
      $("#id_ipt_endday").addClass("errorInput");
      this.errorEndtDateState = { state: true, errorString: '結束日不得大於今天' }
    } else if (this.blurStartDate() || this.blurEndDate()) {
    } else if (void_MonthDiff(searchDateB, searchDateE) > 3) {
      alert('查詢起訖區間"月份"不得超過三個月')
    } else {


    }
  }


}
