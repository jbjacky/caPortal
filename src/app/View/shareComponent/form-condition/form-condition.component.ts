import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { GetApiDataServiceService } from 'src/app/Service/get-api-data-service.service';
import { GetApiUserService } from 'src/app/Service/get-api-user.service';
import { ViewportScroller } from '@angular/common';
import { NgxSpinnerService } from 'ngx-spinner';
import { takeWhile } from 'rxjs/operators';
import { GetFlowViewClass } from 'src/app/Models/PostData_API_Class/GetFlowViewClass';
import { doFormatDate } from 'src/app/UseVoid/void_doFormatDate';
import { ExampleHeader } from 'src/app/Service/datepickerHeader';

declare let $: any; //use jquery

@Component({
  selector: 'app-form-condition',
  templateUrl: './form-condition.component.html',
  styleUrls: ['./form-condition.component.css']
})
export class FormConditionComponent implements OnInit, OnDestroy {
  exampleHeader = ExampleHeader //日期套件header
  isHandle: boolean = false

  ngOnDestroy(): void {
    this.api_subscribe = false;
  }
  api_subscribe = true; //ngOnDestroy時要取消訂閱api的subscribe

  @Input() ownerReview: boolean
  @Output() outPutSearch: EventEmitter<any> = new EventEmitter<any>();//選到的員工回傳


  constructor(private GetApiDataServiceService: GetApiDataServiceService,
    private GetApiUserService: GetApiUserService,
    private viewScroller: ViewportScroller,
    private LoadingPage: NgxSpinnerService) { }

  dateS = new Date()
  dateE = new Date()

  selectSearchForm = 'vaform'; //選擇表單種類
  selectState = '0'//選擇表單狀態
  selectFilterCondition: any = 'All' //選擇篩選條件
  selcetHolidayID = '';//選擇假別種類
  selcetTodaychooseID = '1'//選擇當日請假是或否

  isSearch: boolean = false; //第一次沒按不顯示查詢結果
  showSelectSearchForm = ''; //顯示表單種類
  HoliDay: HoliDay[] = []; //假別種類
  TodayVa = [{ id: '0', name: '否' }, { id: '1', name: '是' }]

  chooseForm = [{
    select: '請假單',
    value: 'vaform',
    filter: [{ value: 'All', name: '全部' }, { value: 'vaType', name: '假別種類' }, { value: 'Sameday', name: '當日請假' }]
  }, {
    select: '銷假單',
    value: 'delform',
    filter: [{ value: 'All', name: '全部' }, { value: 'vaType', name: '假別種類' }]
  }, {
    select: '調班單',
    value: 'changeform',
    filter: [{ value: 'All', name: '全部' }, { value: 'pleasechange', name: '請求調班' }, { value: 'twopeoplechange', name: '雙人調班' }, { value: 'rzchange', name: '例休互調' }]
  }, {
    select: '考勤異常簽認單',
    value: 'AttendUnusual',
    filter: [{ value: 'All', name: '全部' }, { value: 'lateState', name: '遲到' }, { value: 'earlyState', name: '早退' }, { value: 'forgetCard', name: '未刷卡' }, { value: 'OnBefore', name: '早到' }, { value: 'OffAfter', name: '晚退' }]
  }, {
    select: '補卡單',
    value: 'CardPatch',
    filter: [{ value: 'All', name: '全部' }, { value: 'lateState', name: '遲到' }, { value: 'earlyState', name: '早退' }, { value: 'forgetCard', name: '未刷卡' }]
  }
    // ,{
    //   select: '忘刷單',
    //   value: 'forgetform',
    //   filter: [{ value: 'All', name: '全部' },{ value: 'lateState', name: '遲到' },{ value: 'earlyState', name: '早退' },{ value: 'forgetCard', name: '未刷卡' }]
    // },

  ]

  ngOnInit() {
    this.dateS.setMonth(this.dateS.getMonth() - 2)
    // this.dateE.setMonth(this.dateE.getMonth()+12)
    this.GetApiDataServiceService.getWebApiData_GetHoliDayByForm()
      .pipe(takeWhile(() => this.api_subscribe))
      .subscribe(
        (x: any) => {

          var getShowHoliday = []
          for (let data of x) {
            if (data.IsDisplay) {
              getShowHoliday.push(data)
            }
          }
          // this.showHoliDay = getShowHoliday
          // this.writeHoliday = getShowHoliday[0]

          this.HoliDay = JSON.parse(JSON.stringify(getShowHoliday))

          this.selcetHolidayID = this.HoliDay[0].HoliDayID.toString()

          // for (let data of x) {
          //   this.HoliDay.push(
          //     {
          //       HoliDayID: data.HoliDayID,
          //       HoliDayNameC: data.HoliDayNameC,
          //       AutoFlowStart: data.AutoFlowStart,
          //       HoliDayKindID: data.HoliDayKindID,
          //       HoliDayCode: data.HoliDayCode
          //     })
          // }
        },
        error => {
          // alert('與api連線異常,getWebApiData_GetHoliDayByForm')
        }
      )

    this.setSearchVal()
  }

  selectSearchFormChange() {
    this.selectFilterCondition = 'All'
    this.setSearchVal()
  }


  changeChooseForm() {
    for (let i = 0; i < this.chooseForm.length; i++) {
      if (this.selectSearchForm == this.chooseForm[i].value) {
        return this.chooseForm[i].filter
      }
    }
  }
  StartDateChange() {
    if (this.dateE > this.dateS) {

    } else {
      this.dateE = new Date(this.dateS)
    }
    this.setSearchVal()
  }
  EndDateChange() {
    this.setSearchVal()
  }
  isHandleChange() {
    this.setSearchVal()
  }
  setSearchVal() {
    //表單狀態-State-0全部、1呈核中、2重擬、3已核准、7已抽單
    //篩選條件-請假單-Cond1-0全部、1假別種類、2當日請假
    //假別種類-請假單-假別種類-Cond2-HoliDayID
    //假別種類-請假單-當日請假-Cond2-0否、1是

    switch (this.selectSearchForm) {
      case 'vaform':
        // console.log(this.selectState)
        var va_setCond1 = '0'
        var va_setCond2 = '0'
        if (this.selectFilterCondition == 'All') {
          va_setCond1 = '0'
          va_setCond2 = '0'
        }
        else if (this.selectFilterCondition == 'vaType') {
          //篩選條件-假別種類
          va_setCond1 = '1'
          va_setCond2 = this.selcetHolidayID
        }
        else if (this.selectFilterCondition == 'Sameday') {
          //篩選條件-當日請假
          va_setCond1 = '2'
          va_setCond2 = this.selcetTodaychooseID
        }

        var GetFlowView_Abs: GetFlowViewClass = {
          "ListEmpID": [
            // this.SearchMan.jobID
          ],
          "DateB": doFormatDate(this.dateS),
          "DateE": doFormatDate(this.dateE),
          "FormCode": "Abs",
          "State": this.selectState,
          "ProcessFlowID": "0",
          "Cond1": va_setCond1,
          "Cond2": va_setCond2,
          "Cond3": "0",
          "Handle": this.isHandle
        }
        this.outPutSearchVal(GetFlowView_Abs)
        break;
      case 'delform':
        // code block
        var del_setCond1 = '0'
        var del_setCond2 = '0'
        if (this.selectFilterCondition == 'All') {
          del_setCond1 = '0'
          del_setCond2 = '0'
        }
        else if (this.selectFilterCondition == 'vaType') {
          //篩選條件-假別種類
          del_setCond1 = '1'
          del_setCond2 = this.selcetHolidayID
        }
        else if (this.selectFilterCondition == 'Sameday') {
          //篩選條件-當日請假
          del_setCond1 = '2'
          del_setCond2 = this.selcetTodaychooseID
        }
        var GetFlowView_Absc: GetFlowViewClass = {
          "ListEmpID": [''],
          "DateB": doFormatDate(this.dateS),
          "DateE": doFormatDate(this.dateE),
          "FormCode": "Absc",
          "State": this.selectState,
          "ProcessFlowID": "0",
          "Cond1": del_setCond1,
          "Cond2": del_setCond2,
          "Cond3": "0",
          "Handle": this.isHandle
        }
        this.outPutSearchVal(GetFlowView_Absc)
        break;
      case 'changeform':
        // code block
        var change_setCond1 = '0'
        if (this.selectFilterCondition == 'All') {
          change_setCond1 = '0'
        }
        else if (this.selectFilterCondition == 'pleasechange') {
          //篩選條件-請求調班
          change_setCond1 = '1'
        } else if (this.selectFilterCondition == 'twopeoplechange') {
          //篩選條件-雙人調班
          change_setCond1 = '2'
        } else if (this.selectFilterCondition == 'rzchange') {
          //篩選條件-例休互調
          change_setCond1 = '3'
        }

        var GetFlowView_ShiftRote: GetFlowViewClass = {
          "ListEmpID": [''],
          "DateB": doFormatDate(this.dateS),
          "DateE": doFormatDate(this.dateE),
          "FormCode": "ShiftRote",
          "State": this.selectState,
          "ProcessFlowID": "0",
          "Cond1": change_setCond1,
          "Cond2": "0",
          "Cond3": "0",
          "Handle": this.isHandle
        }
        this.outPutSearchVal(GetFlowView_ShiftRote)
        break;
      case 'forgetform':
        // code block
        var forget_setCond1 = '0'
        if (this.selectFilterCondition == 'All') {
          forget_setCond1 = '0'
        }
        else if (this.selectFilterCondition == 'lateState') {
          forget_setCond1 = '1'
        }
        else if (this.selectFilterCondition == 'earlyState') {
          forget_setCond1 = '2'
        }
        else if (this.selectFilterCondition == 'forgetCard') {
          forget_setCond1 = '3'
        }
        var GetFlowView_Card: GetFlowViewClass = {
          "ListEmpID": [''],
          "DateB": doFormatDate(this.dateS),
          "DateE": doFormatDate(this.dateE),
          "FormCode": "Card",
          "State": this.selectState,
          "ProcessFlowID": "0",
          "Cond1": forget_setCond1,
          "Cond2": "0",
          "Cond3": "0",
          "Handle": this.isHandle
        }
        this.outPutSearchVal(GetFlowView_Card)
        break;
      case 'AttendUnusual':
        // code block
        var forget_setCond1 = '0'
        if (this.selectFilterCondition == 'All') {
          forget_setCond1 = '0'
        }
        else if (this.selectFilterCondition == 'lateState') {
          forget_setCond1 = '1'
        }
        else if (this.selectFilterCondition == 'earlyState') {
          forget_setCond1 = '2'
        }
        else if (this.selectFilterCondition == 'forgetCard') {
          forget_setCond1 = '3'
        }
        else if (this.selectFilterCondition == 'OnBefore') {
          forget_setCond1 = '4'
        }
        else if (this.selectFilterCondition == 'OffAfter') {
          forget_setCond1 = '5'
        }

        var GetFlowView_Card: GetFlowViewClass = {
          "ListEmpID": [''],
          "DateB": doFormatDate(this.dateS),
          "DateE": doFormatDate(this.dateE),
          "FormCode": "AttendUnusual",
          "State": this.selectState,
          "ProcessFlowID": "0",
          "Cond1": forget_setCond1,
          "Cond2": "0",
          "Cond3": "0",
          "Handle": this.isHandle
        }
        this.outPutSearchVal(GetFlowView_Card)
        break;
      case 'CardPatch':
        // code block
        var forget_setCond1 = '0'
        if (this.selectFilterCondition == 'All') {
          forget_setCond1 = '0'
        }
        else if (this.selectFilterCondition == 'lateState') {
          forget_setCond1 = '1'
        }
        else if (this.selectFilterCondition == 'earlyState') {
          forget_setCond1 = '2'
        }
        else if (this.selectFilterCondition == 'forgetCard') {
          forget_setCond1 = '3'
        }
        var GetFlowView_Card: GetFlowViewClass = {
          "ListEmpID": [''],
          "DateB": doFormatDate(this.dateS),
          "DateE": doFormatDate(this.dateE),
          "FormCode": "CardPatch",
          "State": this.selectState,
          "ProcessFlowID": "0",
          "Cond1": forget_setCond1,
          "Cond2": "0",
          "Cond3": "0",
          "Handle": this.isHandle
        }
        this.outPutSearchVal(GetFlowView_Card)
        break;
    }


  }
  outPutSearchVal(GetFlowView: GetFlowViewClass) {
    this.outPutSearch.emit(GetFlowView)
  }
}

class HoliDay {
  HoliDayID: string
  HoliDayNameC: string
  AutoFlowStart: string
  HoliDayKindID: string
  HoliDayCode: string
}
