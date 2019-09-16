import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { delSearchFlowSignClass } from '../search-del-form/search-del-form.component';
import { formatDateTime, getapi_formatTimetoString } from 'src/app/UseVoid/void_doFormatDate';
import { GetApiDataServiceService } from 'src/app/Service/get-api-data-service.service';
import { AbscIntegrationHandlerGetAbsFlowAppsClass } from 'src/app/Models/PostData_API_Class/AbscIntegrationHandlerGetAbsFlowAppsClass';
import { chinesenum } from 'src/app/UseVoid/void_chinesenumber';
import { FormSign } from '../../allform/reviewform/reviewform-detail-delform/reviewform-detail-delform.component';
import { NgxSpinnerService } from 'ngx-spinner';
import { takeWhile } from 'rxjs/operators';
import { BehaviorSubject, Observable } from 'rxjs';
import { GetSelectBaseClass } from 'src/app/Models/GetSelectBaseClass';
import { TransSignStateGetApiClass } from 'src/app/Models/PostData_API_Class/TransSignStateGetApiClass';
import { GetApiUserService } from 'src/app/Service/get-api-user.service';

declare let $: any; //use jquery

@Component({
  selector: 'app-search-del-detail',
  templateUrl: './search-del-detail.component.html',
  styleUrls: ['./search-del-detail.component.css']
})
export class SearchDelDetailComponent implements OnInit, OnDestroy {
  ngOnDestroy(): void {
    // throw new Error("Method not implemented.");
    this.api_subscribe = false;
  }
  api_subscribe = true; //ngOnDestroy時要取消訂閱api的subscribe

  @Input() getShowTransSignDetail: boolean
  @Input() getShowTakeDetail: boolean
  @Input() getDelDataTitle: delSearchFlowSignClass
  @Output() goback: EventEmitter<number> = new EventEmitter<number>();//回列表
  uishowDelDetail = [];
  delNote = '';
  constructor(private GetApiDataServiceService: GetApiDataServiceService,
    private LoadingPage: NgxSpinnerService,
    private GetApiUserService: GetApiUserService) { }

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
    var caldateArray = []
    for (let onedatetime of this.getDelDataTitle.dateArray) {
      caldateArray.push(formatDateTime(onedatetime).getDate)
      caldateArray.push(formatDateTime(onedatetime).getDate)
    }
    var sortdateArray = caldateArray.sort((a: any, b: any) => {
      let left = Number(new Date(a));
      let right = Number(new Date(b));
      return left - right;
    });
    var firstDate = sortdateArray[0]
    var lastDate = sortdateArray[sortdateArray.length - 1]
    var AbscIntegrationHandlerGetAbsFlowApps: AbscIntegrationHandlerGetAbsFlowAppsClass = {
      DateB: firstDate, //firstDate
      DateE: lastDate, //lastDate
      EmpID: this.getDelDataTitle.EmpCode
    }
    // console.log(AbscIntegrationHandlerGetAbsFlowApps)

    // this.GetApiDataServiceService.getWebApiData_GetBaseInfoDetail(this.getDelDataTitle.EmpCode)
    //   .pipe(takeWhile(() => this.api_subscribe))
    //   .subscribe(
    //     (GetBaseInfoDetail: GetBaseInfoDetailClass[]) => {
    this.GetApiDataServiceService.getWebApiData_GetAbscFlowAppsByProcessFlowID(this.getDelDataTitle.ProcessFlowID)
      .pipe(takeWhile(() => this.api_subscribe))
      .subscribe(
        (d: any) => {
          if (d) {
            this.getDelDataTitle.Note = d.FlowAppsExtend[0].Note
          }
          this.GetApiDataServiceService.getWebApiData_AbscIntegrationHandlerGetAbsFlowApps(AbscIntegrationHandlerGetAbsFlowApps)
            .pipe(takeWhile(() => this.api_subscribe))
            .subscribe(
              (x: any) => {

                // var foundGetBaseInfoDetail = GetBaseInfoDetail.find(function (element) {
                //   return element.PosType == 'M'
                // });

                if (x.length == 0) {
                  // this.loading = false
                  // this.showdataIsEmpty = true 
                } else {
                  // console.log(x)
                  for (let i = 0; i < x.length; i++) {
                    this.uishowDelDetail.push({
                      titletext: '銷假時段' + chinesenum((i + 1)),
                      startdate: formatDateTime(x[i].DateB).getDate,
                      starttime: getapi_formatTimetoString(x[i].TimeB),
                      enddate: formatDateTime(x[i].DateE).getDate,
                      endtime: getapi_formatTimetoString(x[i].TimeE),
                      everyday: x[i].Circulate,
                      holiday: { id: x[i].HoliDayID, name: x[i].HoliDayNameC },
                      note: x[i].Note,
                      calday: 0,
                      calhour: 0,
                      calminute: 0,
                      eventDate:formatDateTime(x[i].EventDate).getDate,
                      keyName:x[i].KeyName,

                      detail_delform: []
                    })
                    for (let detail of x[i].AbsFlowAppsDetail) {
                      // console.log(w)
                      // console.log(this.uishowDelDetail[i])
                      var real = false
                      // console.log(this.ReviewformServiceService.delDetail.dateArray)
                      // console.log(detail)
                      for (let onedateArray of this.getDelDataTitle.dateArray) {
                        if (detail.DateTimeB == onedateArray.DateB && detail.DateTimeE == onedateArray.DateE) {
                          real = true
                        }
                      }
                      var setDay = 0
                      var setHour = 0
                      var setMin = 0
                      //計算日時分
                      setDay = detail.UseDayHourMinute.Day
                      setHour = detail.UseDayHourMinute.Hour
                      setMin = detail.UseDayHourMinute.Minute

                      this.uishowDelDetail[i].detail_delform.push({
                        disable: 1,
                        state: detail.State,
                        checkState: false,
                        reallyDelShowState: real,
                        startdate: formatDateTime(detail.DateTimeB).getDate,
                        starttime: getapi_formatTimetoString(formatDateTime(detail.DateTimeB).getTime),
                        endtime: getapi_formatTimetoString(formatDateTime(detail.DateTimeE).getTime),
                        calday: setDay,
                        calhour: setHour,
                        calminute: setMin
                      })
                      this.uishowDelDetail[i].calday = this.uishowDelDetail[i].calday + setDay
                      this.uishowDelDetail[i].calhour = this.uishowDelDetail[i].calhour + setHour
                      this.uishowDelDetail[i].calminute = this.uishowDelDetail[i].calminute + setMin

                      // console.log(this.uishowDelDetail[i].detail_delform)

                      this.delNote = this.uishowDelDetail[0].note
                      // this.loading = false

                    }

                  }
                }
              },
              (error: any) => {
                // alert('api連線錯誤，AbscIntegrationHandlerGetAbsFlowApps')
              }
            )
        }, error => {

        }
      )
    // }, error => {

    // })

  }


  previouspage() {
    //回列表
    this.goback.emit();
  }

  onCheckCollapseIn(i) {
    //確認是否收合請假明細
    if ($('#id_deldetail' + i).hasClass('collapsed')) {
      $('#' + i + 'deldetail_text').text('收合請假明細')
      $('#' + i + 'deldetail_img').css({ "transition": "transform 0.5s" });
      $('#' + i + 'deldetail_img').css({ "transform": "rotate(-180deg)" });

    } else {
      $('#' + i + 'deldetail_text').text('展開請假明細')
      $('#' + i + 'deldetail_img').css({ "transition": "transform 0.5s" });
      $('#' + i + 'deldetail_img').css({ "transform": "rotate(0deg)" });
    }
  }

  transSignForm: any
  private Sub_onChangeReviewMan$: BehaviorSubject<any> = new BehaviorSubject(0)
  onChangeReviewMan$: Observable<any> = this.Sub_onChangeReviewMan$; //切換換審核人員給選擇簽核人員使用
  FlowDynamic_Base: GetSelectBaseClass;
  checkTransSignForm(oneforgetData) {
    // console.log(oneforgetData)
    this.transSignForm = oneforgetData
    this.Sub_onChangeReviewMan$.next(oneforgetData.EmpCode)

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
    var ListProcessFlowID = this.getDelDataTitle.ProcessFlowID
    this.LoadingPage.show()

    this.GetApiDataServiceService.getWebApiData_TakeSetFlowState(this.SearchMan.EmpCode, ListProcessFlowID)
      .pipe(takeWhile(() => this.api_subscribe))
      .subscribe(
        (x: any) => {
          if (x.Finish) {
            // this.changeSearchFlowSign.splice(this.changeSearchFlowSign.indexOf(this.takeForm), 1)
            this.getDelDataTitle.Take = false
            this.getDelDataTitle.State = '7'
            $('#sussesdialog').modal('show')
          }else{
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

  
  signRecordDialog:boolean = false
  show_signRecord(){
    if(!this.signRecordDialog){
      this.signRecordDialog = true
    }
    $('#signRecord').modal('show')
  }

}
