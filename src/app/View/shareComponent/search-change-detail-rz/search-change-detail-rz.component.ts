import { Component, OnInit, Output, EventEmitter, Input, OnDestroy } from '@angular/core';
import { changeSearchFlowSignClass } from '../search-change-form/search-change-form.component';
import { GetApiDataServiceService } from 'src/app/Service/get-api-data-service.service';
import { mergeMap, takeWhile } from 'rxjs/operators';
import { doFormatDate_getMonthAndDay, formatDateTime, doFormatDate, getapi_formatTimetoString } from 'src/app/UseVoid/void_doFormatDate';
import { chinesenum } from 'src/app/UseVoid/void_chinesenumber';
import { oneP_Class, selectuiShow } from '../../allform/change-rz/change-rz.component';
import { GetAttendClass } from 'src/app/Models/PostData_API_Class/GetAttendClass';
import { FormSign } from '../../allform/reviewform/reviewform-detail-delform/reviewform-detail-delform.component';
import { NgxSpinnerService } from 'ngx-spinner';
import { GetShiftRoteFlowAppsByProcessFlowIDDataClass } from 'src/app/Models/GetShiftRoteFlowAppsByProcessFlowIDDataClass';
import { BehaviorSubject, Observable } from 'rxjs';
import { GetSelectBaseClass } from 'src/app/Models/GetSelectBaseClass';
import { TransSignStateGetApiClass } from 'src/app/Models/PostData_API_Class/TransSignStateGetApiClass';
import { GetApiUserService } from 'src/app/Service/get-api-user.service';

declare let $: any; //use jquery

@Component({
  selector: 'app-search-change-detail-rz',
  templateUrl: './search-change-detail-rz.component.html',
  styleUrls: ['./search-change-detail-rz.component.css']
})
export class SearchChangeDetailRZComponent implements OnInit, OnDestroy {
  ngOnDestroy(): void {
    // throw new Error("Method not implemented.");
    this.api_subscribe = false;
  }
  api_subscribe = true; //ngOnDestroy時要取消訂閱api的subscribe

  @Output() goback: EventEmitter<number> = new EventEmitter<number>();//回列表

  @Input() getShowTransSignDetail: boolean
  @Input() getShowTakeDetail: boolean
  @Input() getChangeDataTitle: changeSearchFlowSignClass

  oneP: oneP_Class = new oneP_Class()
  selectDay: selectuiShow
  selectChangeDay: selectuiShow

  Note: string = ''
  showAprovedName: string
  constructor(private GetApiDataServiceService: GetApiDataServiceService,
    private LoadingPage: NgxSpinnerService,
    private GetApiUserService: GetApiUserService) { }
  SearchMan = { EmpCode: '', EmpNameC: '' }

  ngOnInit() {

    this.GetApiUserService.counter$
      .subscribe(
        (x: any) => {
          if (x != 0) {
            this.SearchMan.EmpCode = x.EmpID
            this.SearchMan.EmpNameC = x.EmpNameC
          }
        }
      )
    this.GetApiDataServiceService.getWebApiData_GetShiftRoteFlowAppsByProcessFlowID(this.getChangeDataTitle.ProcessFlowID)
      .pipe(takeWhile(() => this.api_subscribe))
      .subscribe(
        (GetShiftRoteFlowAppsByProcessFlowIDData: GetShiftRoteFlowAppsByProcessFlowIDDataClass[]) => {
          if (GetShiftRoteFlowAppsByProcessFlowIDData[0].Note) {
            this.Note = GetShiftRoteFlowAppsByProcessFlowIDData[0].Note
          }
          var first = this.GetApiDataServiceService.getWebApiData_GetShiftRoteDateRange(this.getChangeDataTitle.dateArray[0], this.getChangeDataTitle.EmpID1)
            .pipe(
              mergeMap(
                (x: any) => {
                  if (x.MessageCode) {
                    //判斷資料進行中是否有異常錯誤
                    alert(this.getChangeDataTitle.EmpID1 + x.MessageContent)
                    first.unsubscribe()
                  } else {
                    var Attend: GetAttendClass = {
                      DateB: x.DateA,
                      DateE: x.DateD,
                      ListEmpID: [this.getChangeDataTitle.EmpID1],
                      ListRoteID: null
                    }
                    return this.GetApiDataServiceService.getWebApiData_GetAttend(Attend)
                  }
                }
              )
            )
            .pipe(takeWhile(() => this.api_subscribe))
            .subscribe(
              (x: any) => {
                // console.log(x)
                this.selectDay = null
                this.selectChangeDay = null
                this.oneP = {
                  EmpCode: this.getChangeDataTitle.EmpID1,
                  EmpName: this.getChangeDataTitle.EmpNameC1,
                  work: []
                }
                for (let data of x) {
                  var setAttendDate = doFormatDate_getMonthAndDay(formatDateTime(data.AttendDate).getDate)
                  var isSelect: boolean = false
                  var dataAttenDate = formatDateTime(data.AttendDate).getDate
                  var calDate = new Date(formatDateTime(data.AttendDate).getDate + ' ' + getapi_formatTimetoString(formatDateTime(data.AttendDate).getTime))
                  var calDate_dayofweek = calDate.getDay()
                  if (calDate_dayofweek == 0) {
                    calDate_dayofweek = 7
                  }
                  if (dataAttenDate == this.getChangeDataTitle.dateArray[0] || dataAttenDate == this.getChangeDataTitle.dateArray[1]) {
                    isSelect = true
                    // var showDayofWeek = ''
                    // if (calDate_dayofweek == 7) {
                    //   showDayofWeek = '日'
                    // } else {
                    //   showDayofWeek = chinesenum(calDate_dayofweek)
                    // }

                    // if (!this.selectDay) {

                    //   this.selectDay = {
                    //     date: setAttendDate,
                    //     job: data.ActualRote.RoteCode,
                    //     RoteName: data.ActualRote.RoteNameC,
                    //     RoteID: data.ActualRote.RoteID,
                    //     realdate: formatDateTime(data.AttendDate).getDate,
                    //     isSelect: isSelect,
                    //     dayofweek: showDayofWeek
                    //   }
                    // } else {
                    //   this.selectChangeDay = {
                    //     date: setAttendDate,
                    //     job: data.ActualRote.RoteCode,
                    //     RoteName: data.ActualRote.RoteNameC,
                    //     RoteID: data.ActualRote.RoteID,
                    //     realdate: formatDateTime(data.AttendDate).getDate,
                    //     isSelect: isSelect,
                    //     dayofweek: showDayofWeek
                    //   }
                    // }

                  }
                  this.oneP.work.push(
                    {
                      date: setAttendDate,
                      job: data.ActualRote.RoteCode,
                      realdate: formatDateTime(data.AttendDate).getDate,
                      RoteName: data.ActualRote.RoteNameC,
                      RoteID: data.ActualRote.RoteID,
                      isSelect: isSelect,
                      dayofweek: chinesenum(calDate_dayofweek)
                    })
                }

                for (let onePwork of this.oneP.work) {
                  for (let data of GetShiftRoteFlowAppsByProcessFlowIDData[0].ShiftRoteFlowAppsDetail) {
                    if (onePwork.realdate == formatDateTime(data.ShiftRoteDate).getDate) {
                      onePwork.RoteID = data.RoteID1.toString()
                      onePwork.RoteName = data.RoteName1.toString()
                      onePwork.job = data.RoteCode1.toString()
                    }

                  }
                }

                var sel_ShiftRoteFlowAppsDetail = GetShiftRoteFlowAppsByProcessFlowIDData[0].ShiftRoteFlowAppsDetail[0]
                var calDate_selectDay = new Date(formatDateTime(sel_ShiftRoteFlowAppsDetail.ShiftRoteDate).getDate + ' ' + getapi_formatTimetoString(formatDateTime(sel_ShiftRoteFlowAppsDetail.ShiftRoteDate).getTime))
                var calDate_dayofweek_selectDay = calDate_selectDay.getDay()
                if (calDate_dayofweek_selectDay == 0) {
                  calDate_dayofweek_selectDay = 7
                }
                var showDayofWeek_selectDay = ''
                if (calDate_dayofweek_selectDay == 7) {
                  showDayofWeek_selectDay = '日'
                } else {
                  showDayofWeek_selectDay = chinesenum(calDate_dayofweek_selectDay)
                }

                this.selectDay = {
                  date: doFormatDate_getMonthAndDay(formatDateTime(sel_ShiftRoteFlowAppsDetail.ShiftRoteDate).getDate),
                  job: sel_ShiftRoteFlowAppsDetail.RoteCode1.toString(),
                  RoteName: sel_ShiftRoteFlowAppsDetail.RoteName1,
                  RoteID: sel_ShiftRoteFlowAppsDetail.RoteID1.toString(),
                  realdate: formatDateTime(sel_ShiftRoteFlowAppsDetail.ShiftRoteDate).getDate,
                  isSelect: isSelect,
                  dayofweek: showDayofWeek_selectDay
                }


                var selectChangeDay_ShiftRoteFlowAppsDetail = GetShiftRoteFlowAppsByProcessFlowIDData[0].ShiftRoteFlowAppsDetail[1]
                var calDate_selectChangeDay = new Date(formatDateTime(selectChangeDay_ShiftRoteFlowAppsDetail.ShiftRoteDate).getDate + ' ' + getapi_formatTimetoString(formatDateTime(sel_ShiftRoteFlowAppsDetail.ShiftRoteDate).getTime))
                var calDate_dayofweek_selectChangeDay = calDate_selectChangeDay.getDay()
                if (calDate_dayofweek_selectChangeDay == 0) {
                  calDate_dayofweek_selectChangeDay = 7
                }
                var showDayofWeek_selectChangeDay = ''
                if (calDate_dayofweek_selectChangeDay == 7) {
                  showDayofWeek_selectChangeDay = '日'
                } else {
                  showDayofWeek_selectChangeDay = chinesenum(calDate_dayofweek_selectChangeDay)
                }

                this.selectChangeDay = {
                  date: doFormatDate_getMonthAndDay(formatDateTime(selectChangeDay_ShiftRoteFlowAppsDetail.ShiftRoteDate).getDate),
                  job: selectChangeDay_ShiftRoteFlowAppsDetail.RoteCode1.toString(),
                  RoteName: selectChangeDay_ShiftRoteFlowAppsDetail.RoteName1,
                  RoteID: selectChangeDay_ShiftRoteFlowAppsDetail.RoteID1.toString(),
                  realdate: formatDateTime(selectChangeDay_ShiftRoteFlowAppsDetail.ShiftRoteDate).getDate,
                  isSelect: isSelect,
                  dayofweek: showDayofWeek_selectChangeDay
                }
                // this.SetUiChangeDate()
                // console.log(this.oneP)
              },
              (error: any) => {
                // alert('與api連線異常，第一個人員，getWebApiData_GetShiftRoteDateRange')
              }
            )
        }
        , error => {

        })

  }

  setDivStyle(selectData: selectuiShow) {
    if (selectData.isSelect) {
      return 'selectDiv'
    } else {
      return 'DivStyle'
    }
  }

  previouspage() {
    //回列表
    this.goback.emit();
  }

  transSignForm: any
  private Sub_onChangeReviewMan$: BehaviorSubject<any> = new BehaviorSubject(0)
  onChangeReviewMan$: Observable<any> = this.Sub_onChangeReviewMan$; //切換換審核人員給選擇簽核人員使用
  FlowDynamic_Base: GetSelectBaseClass;
  checkTransSignForm(oneChangeData) {
    // console.log(oneforgetData)
    this.transSignForm = oneChangeData
    this.Sub_onChangeReviewMan$.next(oneChangeData.EmpCode1)

    $('#TransSignformdialog').modal('show')
  }
  chooseBase(GetSelectBase: GetSelectBaseClass) {
    this.FlowDynamic_Base = GetSelectBase
  }
  /**
   * @todo 轉呈
   */
  TransSignform_Click() {

    if (this.FlowDynamic_Base.EmpID) {
      if (this.FlowDynamic_Base.EmpID.length) {
        this.LoadingPage.show()

        var ListProcessFlowID = this.transSignForm.ProcessFlowID
        var TransSignStateGetApi: TransSignStateGetApiClass = {
          "ListProcessFlowID": [
            ListProcessFlowID
          ],
          "enumState": "TransSign",
          "EmpID": this.SearchMan.EmpCode,
          "SignEmpID": this.FlowDynamic_Base.EmpID

        }
        this.GetApiDataServiceService.getWebApiData_TransSignState(TransSignStateGetApi)
          .pipe(takeWhile(() => this.api_subscribe))
          .subscribe(
            (x: any) => {
              if (x.Finish) {
                $('#TransSignformSussesdialog').modal('show')
              } else {
                alert(x.MessageContent)
              }
              this.LoadingPage.hide()
            }
          )
      } else {
        alert('請選擇簽核人員')
      }
    } else {
      alert('請選擇簽核人員')
    }
  }
  /**
   * @todo 抽單
   */
  Cancelform_Click() {
    // console.log(this.SearchMan.EmpCode)
    // console.log(this.takeForm.ProcessFlowID)
    var ListProcessFlowID = this.getChangeDataTitle.ProcessFlowID
    this.LoadingPage.show()

    this.GetApiDataServiceService.getWebApiData_TakeSetFlowState(this.SearchMan.EmpCode, ListProcessFlowID)
      .pipe(takeWhile(() => this.api_subscribe))
      .subscribe(
        (x: any) => {
          if (x.Finish) {
            // this.changeSearchFlowSign.splice(this.changeSearchFlowSign.indexOf(this.takeForm), 1)
            this.getChangeDataTitle.Take = false
            this.getChangeDataTitle.State = '7'
            $('#sussesdialog').modal('show')
          } else {
            alert(x.MessageContent)
          }
          this.LoadingPage.hide()
        },
        error => {
          this.LoadingPage.hide()
          // alert('與api連線異常，getWebApiData_TakeSetFlowState')
        }
      )
  }


  signRecordDialog: boolean = false
  show_signRecord() {
    if (!this.signRecordDialog) {
      this.signRecordDialog = true
    }
    $('#signRecord').modal('show')
  }

  
  private Be_setGetRoteInfo$: BehaviorSubject<any> = new BehaviorSubject<Array<number>>(null);
  Ob_setGetRoteInfo$: Observable<any> = this.Be_setGetRoteInfo$;
  
  bt_Show_RoteInfo(oneSearchRoteID:number) {
    var searchRoteID: Array<number> = []
    if(oneSearchRoteID){
      searchRoteID.push(oneSearchRoteID)
      this.Be_setGetRoteInfo$.next(searchRoteID)
      $('#RoteInf').modal('show')
    }
  }
}
