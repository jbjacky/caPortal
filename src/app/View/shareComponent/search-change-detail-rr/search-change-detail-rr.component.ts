import { Component, OnInit, Output, Input, EventEmitter, OnDestroy, AfterViewChecked } from '@angular/core';
import { changeSearchFlowSignClass } from '../search-change-form/search-change-form.component';
import { FormSign } from '../../allform/reviewform/reviewform-detail-delform/reviewform-detail-delform.component';
import { GetApiDataServiceService } from 'src/app/Service/get-api-data-service.service';
import { formatDateTime, getapi_formatTimetoString, doFormatDate_getMonthAndDay } from 'src/app/UseVoid/void_doFormatDate';
import { uiShow } from '../../allform/reviewform/reviewform-detail-changeform-rr/reviewform-detail-changeform-rr.component';
import { takeWhile, mergeMap } from 'rxjs/operators';
import { GetAttendClass } from 'src/app/Models/PostData_API_Class/GetAttendClass';
import { NgxSpinnerService } from 'ngx-spinner';
import { GetShiftRoteFlowAppsByProcessFlowIDDataClass } from 'src/app/Models/GetShiftRoteFlowAppsByProcessFlowIDDataClass';
import { reallyData_P } from 'src/app/Models/reallyData_P';
import { void_crossDay } from 'src/app/UseVoid/void_crossDay';
import { GetApiUserService } from 'src/app/Service/get-api-user.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { GetSelectBaseClass } from 'src/app/Models/GetSelectBaseClass';
import { TransSignStateGetApiClass } from 'src/app/Models/PostData_API_Class/TransSignStateGetApiClass';

declare let $: any; //use jquery

@Component({
  selector: 'app-search-change-detail-rr',
  templateUrl: './search-change-detail-rr.component.html',
  styleUrls: ['./search-change-detail-rr.component.css']
})
export class SearchChangeDetailRRComponent implements OnInit, OnDestroy, AfterViewChecked {
  ngAfterViewChecked(): void {
    var oneNumArray = [];
    var twoNumArray = [];

    for (let i = 0; i < 7; i++) {
      oneNumArray.push($("#oneCheckHeight_View2" + i).height())
      twoNumArray.push($("#twoCheckHeight_View2" + i).height())

      oneNumArray.push($("#twoCheckHeight_View2" + i).height())
      twoNumArray.push($("#oneCheckHeight_View2" + i).height())
    }


    var setoneCheckHeight = Math.max.apply(null, oneNumArray) //最大的高度
    var settwoCheckHeight = Math.max.apply(null, twoNumArray) //最大的高度


    if (setoneCheckHeight >= 22) {
      $('#onePadding_View2').css('padding', '21px 0px')
      $('#oneEmp_View2').css('height', (setoneCheckHeight + 21).toString())
      for (let i = 0; i < 7; i++) {
        $('#oneCheckHeight_View2' + i.toString()).css('height', setoneCheckHeight.toString())
      }
    } else {
      $('#onePadding_View2').css('padding', '10px 0px')
      // $('#oneEmp_View2').css('height','44px')
    }

    if (settwoCheckHeight >= 22) {
      $('#twoPadding_View2').css('padding', '21px 0px')
      $('#twoEmp_View2').css('height', (settwoCheckHeight + 21).toString())
      for (let i = 0; i < 7; i++) {
        $('#twoCheckHeight_View2' + i.toString()).css('height', settwoCheckHeight.toString())
      }
    } else {
      $('#twoPadding_View2').css('padding', '10px 0px')
    }
  }
  ngOnDestroy(): void {
    // throw new Error("Method not implemented.");
    this.api_subscribe = false;
  }

  loading: boolean = false;

  api_subscribe = true; //ngOnDestroy時要取消訂閱api的subscribe

  @Output() goback: EventEmitter<number> = new EventEmitter<number>();//回列表

  @Input() getShowTransSignDetail: boolean
  @Input() getShowTakeDetail: boolean
  @Input() getChangeDataTitle: changeSearchFlowSignClass

  constructor(private GetApiDataServiceService: GetApiDataServiceService,
    private LoadingPage: NgxSpinnerService,
    private GetApiUserService: GetApiUserService ) { }

  oneP: reallyData_P = new reallyData_P()
  twoP: reallyData_P = new reallyData_P()
  SimulationRoteData: GetShiftRoteFlowAppsByProcessFlowIDDataClass[] = []
  Note: string = ''
  showAprovedName: string

  SearchMan = { EmpCode: '', EmpNameC: '' }
  ngOnInit() {
    this.GetApiUserService.counter$
      .subscribe(
        (x:any) => {
          if(x!=0){
            this.SearchMan.EmpCode = x.EmpID
            this.SearchMan.EmpNameC = x.EmpNameC
          }
        }
      )
    this.GetApiDataServiceService.getWebApiData_GetShiftRoteFlowAppsByProcessFlowID(this.getChangeDataTitle.ProcessFlowID)
      .pipe(takeWhile(() => this.api_subscribe))
      .subscribe(
        (GetShiftRoteFlowAppsByProcessFlowIDData: GetShiftRoteFlowAppsByProcessFlowIDDataClass[]) => {
          this.SimulationRoteData = []
          this.SimulationRoteData = GetShiftRoteFlowAppsByProcessFlowIDData

          this.Note = GetShiftRoteFlowAppsByProcessFlowIDData[0].Note
          var first = this.GetApiDataServiceService.getWebApiData_GetShiftRoteDateRange(this.getChangeDataTitle.dateArray[0], this.getChangeDataTitle.EmpCode1)
            .pipe(
              mergeMap(
                (x: any) => {
                  if (x.MessageCode) {
                    //判斷資料進行中是否有異常錯誤
                    alert(this.getChangeDataTitle.EmpCode1 + x.MessageContent)
                    first.unsubscribe()
                  } else {

                    var Attend: GetAttendClass = {
                      DateB: x.DateA,
                      DateE: x.DateD,
                      ListEmpID: [this.getChangeDataTitle.EmpCode1],
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

                this.oneP = {
                  code: this.getChangeDataTitle.EmpCode1,
                  name: this.getChangeDataTitle.EmpNameC1,
                  work: []
                }
                for (let data of x) {
                  var setAttendDate = doFormatDate_getMonthAndDay(formatDateTime(data.AttendDate).getDate)
                  this.oneP.work.push({
                    realDate: formatDateTime(data.AttendDate).getDate,
                    date: setAttendDate,
                    job: data.ActualRote.RoteCode,
                    RoteID: data.ActualRote.RoteID,
                    RoteName: data.ActualRote.RoteNameC,
                    OnTime: data.ActualRote.OnTime,
                    OffTime: data.ActualRote.OffTime,

                  })
                }
                // this.SetUiChangeDate()
                var second = this.GetApiDataServiceService.getWebApiData_GetShiftRoteDateRange(this.getChangeDataTitle.dateArray[0], this.getChangeDataTitle.EmpCode2)
                  .pipe(
                    mergeMap(
                      (x: any) => {
                        if (x.MessageCode) {
                          //判斷資料進行中是否有異常錯誤
                          alert(this.getChangeDataTitle.EmpCode2 + x.MessageContent)
                          second.unsubscribe()
                        } else {

                          var Attend: GetAttendClass = {
                            DateB: x.DateA,
                            DateE: x.DateD,
                            ListEmpID: [this.getChangeDataTitle.EmpCode2],
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

                      this.twoP = {
                        code: this.getChangeDataTitle.EmpCode2,
                        name: this.getChangeDataTitle.EmpNameC2,
                        work: []
                      }
                      for (let data of x) {
                        var setAttendDate = doFormatDate_getMonthAndDay(formatDateTime(data.AttendDate).getDate)
                        this.twoP.work.push({
                          realDate: formatDateTime(data.AttendDate).getDate,
                          date: setAttendDate, job: data.ActualRote.RoteCode,
                          RoteID: data.ActualRote.RoteID,
                          RoteName: data.ActualRote.RoteNameC,
                          OnTime: data.ActualRote.OnTime,
                          OffTime: data.ActualRote.OffTime,
                        })
                      }

                      // this.loading = false
                      this.SetUiChangeDate()
                    }
                    ,
                    (error: any) => {
                      // alert('與api連線異常，第二個人員，getWebApiData_GetShiftRoteDateRange')
                    }

                  )
              },
              (error: any) => {
                // alert('與api連線異常，第一個人員，getWebApiData_GetShiftRoteDateRange')
              }
            )
        }
      )

  }

  SetUiChangeDate() {
    this.RealRote = [];
    for (let oP of this.oneP.work) {
      this.RealRote.push({
        realDate: oP.realDate,
        date: oP.date,
        oneP: oP.job,
        onePRoteID:oP.RoteID,
        oneP_OnTime: oP.OnTime,
        oneP_OffTime: oP.OffTime,
        onePRoteName: oP.RoteName,
        twoP: '',
        twoPRoteID:null,
        twoP_OnTime: '',
        twoP_OffTime: '',
        twoPRoteName: '',
        disable: false,
        Clickselect: false
      })
    }

    for (let Real of this.RealRote) {
      for (let date of this.getChangeDataTitle.dateArray) {
        var da = date.split('/')[1] + '/' + date.split('/')[2]
        if (Real.date == da) {
          Real.Clickselect = true
        }
      }
    }

    for (let tP of this.twoP.work) {
      for (let ui of this.RealRote) {
        if (ui.date == tP.date) {
          ui.twoP = tP.job
          ui.twoPRoteID = tP.RoteID
          ui.twoPRoteName = tP.RoteName
          ui.twoP_OnTime = tP.OnTime
          ui.twoP_OffTime = tP.OffTime
        }
      }
    }

    //因核准後 真正的班型已經調換，所以要靠先前模擬的班型還原當時送單前的班型
    for (let re of this.RealRote) {
      for (let ss of this.SimulationRoteData[0].ShiftRoteFlowAppsDetail) {
        if (re.realDate == formatDateTime(ss.ShiftRoteDate).getDate) {
          re.oneP = ss.RoteCode1
          re.onePRoteID = ss.RoteID1
          re.onePRoteName = ss.RoteName1
          re.oneP_OnTime = void_crossDay(ss.RoteID1Info.OnTime).EndTime
          re.oneP_OffTime = void_crossDay(ss.RoteID1Info.OffTime).EndTime
          re.twoP = ss.RoteCode2
          re.twoPRoteID = ss.RoteID2
          re.twoPRoteName = ss.RoteName2
          re.twoP_OnTime = void_crossDay(ss.RoteID2Info.OnTime).EndTime
          re.twoP_OffTime = void_crossDay(ss.RoteID2Info.OffTime).EndTime
        }
      }
    }
    this.uiShow = []
    for (let Real of this.RealRote) {
      this.uiShow.push({
        realDate: Real.realDate,
        date: Real.date,
        oneP: Real.oneP,
        onePRoteID:Real.onePRoteID,
        onePRoteName: Real.onePRoteName,
        oneP_OnTime: void_crossDay(Real.oneP_OnTime).EndTime,
        oneP_OffTime: void_crossDay(Real.oneP_OffTime).EndTime,
        twoP: Real.twoP,
        twoPRoteID:Real.twoPRoteID,
        twoPRoteName: Real.twoPRoteName,
        twoP_OnTime: void_crossDay(Real.twoP_OnTime).EndTime,
        twoP_OffTime: void_crossDay(Real.twoP_OffTime).EndTime,
        disable: Real.disable,
        Clickselect: Real.Clickselect
      })
    }
  }
  RealRote: uiShow[] = []
  uiShow: uiShow[] = []
  selectDay: uiShow[] = []
  SimulationRoteClickOne = false
  OriginalRote() {
    //原始調班前
    this.SimulationRoteClickOne = false
    this.uiShow = []
    for (let Real of this.RealRote) {
      this.uiShow.push({
        realDate: Real.realDate,
        date: Real.date,
        oneP: Real.oneP,
        onePRoteID:Real.onePRoteID,
        onePRoteName: Real.onePRoteName,
        oneP_OnTime: void_crossDay(Real.oneP_OnTime).EndTime,
        oneP_OffTime: void_crossDay(Real.oneP_OffTime).EndTime,
        twoP: Real.twoP,
        twoPRoteID:Real.twoPRoteID,
        twoPRoteName: Real.twoPRoteName,
        twoP_OnTime: void_crossDay(Real.twoP_OnTime).EndTime,
        twoP_OffTime: void_crossDay(Real.twoP_OffTime).EndTime,
        disable: Real.disable,
        Clickselect: Real.Clickselect
      })
    }
    $('#bt_RoteShow').addClass('onShowButton')
    $('#bt_RoteShow').removeClass('offShowButton')
    $('#bt_TimeShow').addClass('offShowButton')
    $('#bt_TimeShow').removeClass('onShowButton')


  }
  SimulationRote() {
    //模擬調班後
    if (!this.SimulationRoteClickOne) {
      for (let s_ui of this.uiShow) {
        for (let oneShiftRoteFlowAppsDetail of this.SimulationRoteData[0].ShiftRoteFlowAppsDetail) {
          if (s_ui.Clickselect && s_ui.realDate == formatDateTime(oneShiftRoteFlowAppsDetail.ShiftRoteDate).getDate) {
            s_ui.oneP = oneShiftRoteFlowAppsDetail.RoteCode1c
            s_ui.twoP = oneShiftRoteFlowAppsDetail.RoteCode2c

            s_ui.onePRoteID = oneShiftRoteFlowAppsDetail.RoteID1c
            s_ui.twoPRoteID = oneShiftRoteFlowAppsDetail.RoteID2c

            s_ui.onePRoteName = oneShiftRoteFlowAppsDetail.RoteName1c
            s_ui.twoPRoteName = oneShiftRoteFlowAppsDetail.RoteName2c

            s_ui.oneP_OnTime = void_crossDay(oneShiftRoteFlowAppsDetail.RoteID1cInfo.OnTime).EndTime
            s_ui.oneP_OffTime = void_crossDay(oneShiftRoteFlowAppsDetail.RoteID1cInfo.OffTime).EndTime

            s_ui.twoP_OnTime = void_crossDay(oneShiftRoteFlowAppsDetail.RoteID2cInfo.OnTime).EndTime
            s_ui.twoP_OffTime = void_crossDay(oneShiftRoteFlowAppsDetail.RoteID2cInfo.OffTime).EndTime

            s_ui.Clickselect = false
          }
        }
      }
      this.SimulationRoteClickOne = true
    }
    $('#bt_RoteShow').addClass('offShowButton')
    $('#bt_RoteShow').removeClass('onShowButton')
    $('#bt_TimeShow').addClass('onShowButton')
    $('#bt_TimeShow').removeClass('offShowButton')
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
    // console.log(oneChangeData)
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
              }else{
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

  FormatDate(date) {
    return doFormatDate_getMonthAndDay(formatDateTime(date).getDate)
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
