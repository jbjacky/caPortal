import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { chinesenum } from 'src/app/UseVoid/void_chinesenumber';
import { GetApiDataServiceService } from 'src/app/Service/get-api-data-service.service';
import { formatDateTime, getapi_formatTimetoString } from 'src/app/UseVoid/void_doFormatDate';
import { AbsFlowAppsDetailClass } from 'src/app/Models/PostData_API_Class/AbsSaveAndFlowStart';
import { showAbsFlowAppsDetailClass, vaRestClass, vaRote } from 'src/app/Models/vaform';
import { FileDownloadService } from 'src/app/Service/file-download.service';
import { takeWhile, mergeMap, map, toArray } from 'rxjs/operators';
import { showUploadFileClass } from 'src/app/Models/showUploadFileClass';
import { NgxSpinnerService } from 'ngx-spinner';
import { GetApiUserService } from 'src/app/Service/get-api-user.service';
import { Router } from '@angular/router';
import { void_crossDay } from 'src/app/UseVoid/void_crossDay';
import { NewVaSearchFlowSignClass } from 'src/app/Models/NewVaSearchFlowSignClass';
import { BehaviorSubject, Observable } from 'rxjs';
import { GetSelectBaseClass } from 'src/app/Models/GetSelectBaseClass';
import { TransSignStateGetApiClass } from 'src/app/Models/PostData_API_Class/TransSignStateGetApiClass';
import { void_completionTenNum } from 'src/app/UseVoid/void_CompletionTenNum';
declare let $: any; //use jquery

@Component({
  selector: 'app-search-va-detail',
  templateUrl: './search-va-detail.component.html',
  styleUrls: ['./search-va-detail.component.css']
})
export class SearchVaDetailComponent implements OnInit, OnDestroy {
  ngOnDestroy(): void {
    // throw new Error("Method not implemented.");
    this.api_subscribe = false;
  }
  api_subscribe = true; //ngOnDestroy時要取消訂閱api的subscribe

  @Input() getVaDataTitle: NewVaSearchFlowSignClass
  @Input() getShowTransSignDetail: boolean
  @Input() getShowTakeDetail: boolean
  // @Input() getVaDataDetail: vaGetAbsFlowApps[] = [];



  @Output() goback: EventEmitter<number> = new EventEmitter<number>();//回列表

  previouspage() {
    //回列表
    this.goback.emit();
  }
  constructor(private GetApiDataServiceService: GetApiDataServiceService,
    private FileDownloadService: FileDownloadService,
    private LoadingPage: NgxSpinnerService,
    private GetApiUserService: GetApiUserService,
    private router: Router) { }

  uishowVaDetail: uishowVaDetailClass[] = [];//顯示差假時段資料

  showAprovedName: string

  SearchMan = { EmpCode: '', EmpNameC: '' }
  ngOnInit() {
    this.GetApiUserService.counter$
      .subscribe(
        x => {
          this.SearchMan.EmpCode = x.EmpID
          this.SearchMan.EmpNameC = x.EmpNameC
        }
      )
    // 差假時段多筆資料
    if (this.getVaDataTitle.ProcessFlowID > 0) {
      //取得流程資料差假時段料
      this.GetProcessFlowIDData()
    } else {
      //取得實體資料差假時段
      this.GetKeyData()
    }
  }

  GetProcessFlowIDData() {
    //取得流程資料差假時段料


    this.GetApiDataServiceService.getWebApiData_GetAbsFlowAppsByProcessFlowID(this.getVaDataTitle.ProcessFlowID, true)
      .pipe(takeWhile(() => this.api_subscribe))
      .subscribe(
        (xData: any) => {


          this.uishowVaDetail = []
          var i = 0
          for (let data of xData.FlowApps) {
            this.getVaDataTitle.showProcessFlowID = void_completionTenNum(data.ProcessID)
            this.getVaDataTitle.State =data.State
            this.getVaDataTitle.EmpCode =data.EmpCode
            this.getVaDataTitle.EmpNameC =data.EmpNameC
            this.getVaDataTitle.WriteEmpCode =data.AppEmpCode
            this.getVaDataTitle.WriteEmpNameC =data.AppEmpNameC

            i++
            var getSetAbsFlowAppsDetail: showAbsFlowAppsDetailClass[] = []

            for (let AbsFlowAppsDetail of data.AbsFlowAppsDetail) {

              var _vaOneOffTime = void_crossDay(formatDateTime(AbsFlowAppsDetail.DateTimeE).getTime).EndTime
              var _ActualRote_calCrossDay = void_crossDay(formatDateTime(AbsFlowAppsDetail.DateTimeE).getTime).isCrossDay
              var _vaRestClass: vaRestClass[] = []
              var _vaRote: vaRote
              if (AbsFlowAppsDetail.Rote) {
                _vaRote = JSON.parse(JSON.stringify(AbsFlowAppsDetail.Rote))
                if (AbsFlowAppsDetail.Rote.RoteRest.length > 0) {
                  for (let aa of AbsFlowAppsDetail.Rote.RoteRest) {
                    _vaRestClass.push({
                      vaRestOnTime: getapi_formatTimetoString(aa.TimeB),
                      vaRestOffTime: getapi_formatTimetoString(aa.TimeE)
                    })
                  }
                }
              }
              getSetAbsFlowAppsDetail.push(
                {
                  vaOneDate: formatDateTime(AbsFlowAppsDetail.DateTimeB).getDate,
                  vaOneOnTime: getapi_formatTimetoString(formatDateTime(AbsFlowAppsDetail.DateTimeB).getTime),
                  vaOneOffTime: getapi_formatTimetoString(_vaOneOffTime),
                  vaRest: _vaRestClass,
                  vaRote: _vaRote,
                  AllUse: AbsFlowAppsDetail.Use,
                  vaUseDay: AbsFlowAppsDetail.UseDayHourMinute.Day.toString(),
                  vaUseHour: AbsFlowAppsDetail.UseDayHourMinute.Hour.toString(),
                  vaUseMinute: AbsFlowAppsDetail.UseDayHourMinute.Minute.toString(),
                  ActualRote_calCrossDay: _ActualRote_calCrossDay,
                  IsDelete: AbsFlowAppsDetail.IsDelete
                })
            }


            if (data.EventDate) {
              data.EventDate = formatDateTime(data.EventDate).getDate
            }
            this.uishowVaDetail.push({
              uitext: chinesenum(i),
              startDate: formatDateTime(data.DateTimeB).getDate,
              startTime: getapi_formatTimetoString(formatDateTime(data.DateTimeB).getTime),
              endDate: formatDateTime(data.DateTimeE).getDate,
              endTime: getapi_formatTimetoString(formatDateTime(data.DateTimeE).getTime),
              proxyName: data.AgentName1,
              cause: data.Note,
              AllUseDay: data.UseDayHourMinute.Day,
              AllUseHour: data.UseDayHourMinute.Hour,
              AllUseMinute: data.UseDayHourMinute.Minute,
              HolidayName: data.HoliDayNameC,
              uploadFile: data.UploadFile,
              AbsFlowAppsDetail: data.AbsFlowAppsDetail,
              uishowAbsFlowAppsDetail: getSetAbsFlowAppsDetail,
              Circulate: data.Circulate,
              Today: data.Today,
              Appointment: data.Appointment,
              KeyName: data.KeyName,
              EventDate: data.EventDate
            })

          }
        },
        (error) => {
          // alert('與api取得資料錯誤，GetAbsFlowAppsByProcessFlowID')
          // console.log(error)
        }
      )

  }

  GetKeyData() {
    //取得實體資料差假時段
    this.GetApiDataServiceService.getWebApiData_GetAbsByFlowStructure(this.getVaDataTitle.key, true)
      .pipe(takeWhile(() => this.api_subscribe))
      .subscribe(
        (xData: any) => {
          // this.showVaDetail = x;
          this.uishowVaDetail = []
          var i = 0
          for (let data of xData.FlowApps) {
            if(data.AutoKey){
              if(data.AutoKey > 0){
                this.getVaDataTitle.key =data.AutoKey.toString()
              }else{
                this.getVaDataTitle.key =data.key.toString()
              }
            }else{
              this.getVaDataTitle.key =data.key.toString()
            }
            
            this.getVaDataTitle.State =data.State
            this.getVaDataTitle.EmpCode =data.EmpCode
            this.getVaDataTitle.EmpNameC =data.EmpNameC
            this.getVaDataTitle.WriteEmpCode =data.AppEmpCode
            this.getVaDataTitle.WriteEmpNameC =data.AppEmpNameC
            this.getVaDataTitle.day =data.UseDayHourMinute.Day
            this.getVaDataTitle.hour =data.UseDayHourMinute.Hour
            this.getVaDataTitle.minute =data.UseDayHourMinute.Minute

            i++
            var getSetAbsFlowAppsDetail: showAbsFlowAppsDetailClass[] = []

            for (let AbsFlowAppsDetail of data.AbsFlowAppsDetail) {
              var _vaOneOffTime = void_crossDay(formatDateTime(AbsFlowAppsDetail.DateTimeE).getTime).EndTime
              var _ActualRote_calCrossDay = void_crossDay(formatDateTime(AbsFlowAppsDetail.DateTimeE).getTime).isCrossDay
              var _vaRestClass: vaRestClass[] = []
              var _vaRote: vaRote
              if (AbsFlowAppsDetail.Rote) {
                _vaRote = JSON.parse(JSON.stringify(AbsFlowAppsDetail.Rote))
                if (AbsFlowAppsDetail.Rote.RoteRest) {
                  for (let aa of AbsFlowAppsDetail.Rote.RoteRest) {
                    _vaRestClass.push({
                      vaRestOnTime: getapi_formatTimetoString(aa.TimeB),
                      vaRestOffTime: getapi_formatTimetoString(aa.TimeE)
                    })
                  }
                }
              }
              //計算日時分
              getSetAbsFlowAppsDetail.push(
                {
                  vaOneDate: formatDateTime(AbsFlowAppsDetail.DateB).getDate,
                  vaOneOnTime: getapi_formatTimetoString(formatDateTime(AbsFlowAppsDetail.DateTimeB).getTime),
                  vaOneOffTime: getapi_formatTimetoString(_vaOneOffTime),
                  vaRest: _vaRestClass,
                  vaRote: _vaRote,
                  AllUse: AbsFlowAppsDetail.Use,
                  vaUseDay: AbsFlowAppsDetail.UseDayHourMinute.Day.toString(),
                  vaUseHour: AbsFlowAppsDetail.UseDayHourMinute.Hour.toString(),
                  vaUseMinute: AbsFlowAppsDetail.UseDayHourMinute.Minute.toString(),
                  ActualRote_calCrossDay: _ActualRote_calCrossDay,
                  IsDelete: AbsFlowAppsDetail.IsDelete
                })
            }

            if (data.EventDate) {
              data.EventDate = formatDateTime(data.EventDate).getDate
            }
            this.uishowVaDetail.push({
              uitext: chinesenum(i),
              startDate: formatDateTime(data.DateTimeB).getDate,
              startTime: getapi_formatTimetoString(formatDateTime(data.DateTimeB).getTime),
              endDate: formatDateTime(data.DateTimeE).getDate,
              endTime: getapi_formatTimetoString(formatDateTime(data.DateTimeE).getTime),
              proxyName: data.AgentName1,
              cause: data.Note,
              AllUseDay: data.UseDayHourMinute.Day.toString(),
              AllUseHour: data.UseDayHourMinute.Hour.toString(),
              AllUseMinute: data.UseDayHourMinute.Minute.toString(),
              HolidayName: data.HoliDayNameC,
              uploadFile: data.UploadFile,
              AbsFlowAppsDetail: data.AbsFlowAppsDetail,
              uishowAbsFlowAppsDetail: getSetAbsFlowAppsDetail,
              Circulate: data.Circulate,
              Today: data.Today,
              Appointment: data.Appointment,
              KeyName: data.KeyName,
              EventDate: data.EventDate
            })
            // console.log(this.uishowVaDetail)
            // console.log(data)

          }
          // console.log(x[0].EmpID)
        },
        (error) => {
          // alert('與api取得資料錯誤，GetAbsFlowAppsByProcessFlowID')
          // console.log(error)
        }
      )

  }
  // uishowVaDetailLoading: boolean = false;
  base64(upload: showUploadFileClass) {
    // console.log(upload)
    // this.uishowVaDetailLoading = true
    this.GetApiDataServiceService.getWebApiData_GetUploadFileByStreamOnly(upload.ServerName)
    // .pipe(takeWhile(() => this.api_subscribe))
    // .subscribe(
    //   (data: Array<any>) => {
    //     // console.log(data)
    //     // this.FileDownloadService.base64(data[0])
    //     this.uishowVaDetailLoading = false
    //   }
    //   , error => {
    //     this.uishowVaDetailLoading = false
    //   }
    // )
  }
  onCheckCollapseIn(i) {
    //確認是否收合請假明細
    if ($('#id_vadetail' + i).hasClass('collapsed')) {
      $('#' + i + 'vadetail_text').text('收合請假明細')
      $('#' + i + 'vadetail_img').css({ "transition": "transform 0.5s" });
      $('#' + i + 'vadetail_img').css({ "transform": "rotate(-180deg)" });

    } else {
      $('#' + i + 'vadetail_text').text('展開請假明細')
      $('#' + i + 'vadetail_img').css({ "transition": "transform 0.5s" });
      $('#' + i + 'vadetail_img').css({ "transform": "rotate(0deg)" });
    }
  }

  sussesSend() {
    window.location.reload();
  }

  transSignForm: any
  private Sub_onChangeReviewMan$: BehaviorSubject<any> = new BehaviorSubject(0)
  onChangeReviewMan$: Observable<any> = this.Sub_onChangeReviewMan$; //切換換審核人員給選擇簽核人員使用
  FlowDynamic_Base: GetSelectBaseClass;
  checkTransSignForm(oneVaData) {
    // console.log(oneVaData)
    this.transSignForm = oneVaData
    this.Sub_onChangeReviewMan$.next(oneVaData.EmpCode)

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
    var ListProcessFlowID = this.getVaDataTitle.ProcessFlowID
    this.LoadingPage.show()

    this.GetApiDataServiceService.getWebApiData_TakeSetFlowState(this.SearchMan.EmpCode, ListProcessFlowID)
      .pipe(takeWhile(() => this.api_subscribe))
      .subscribe(
        (x: any) => {
          if (x.Finish) {
            // this.vaSearchFlowSign.splice(this.vaSearchFlowSign.indexOf(this.takeForm), 1)
            this.getVaDataTitle.Take = false
            this.getVaDataTitle.State = '7'
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

  bt_Show_RoteInfo(oneSearchRoteID: number) {
    var searchRoteID: Array<number> = []
    if (oneSearchRoteID) {
      searchRoteID.push(oneSearchRoteID)
      this.Be_setGetRoteInfo$.next(searchRoteID)
      $('#RoteInf').modal('show')
    }
  }

}





class uishowVaDetailClass {
  uitext: string
  startDate: string
  startTime: string
  endDate: string
  endTime: string
  proxyName: string
  cause: string
  AllUseDay: number
  AllUseHour: number
  AllUseMinute: number
  HolidayName: string
  uploadFile: showUploadFileClass[]
  AbsFlowAppsDetail: AbsFlowAppsDetailClass[]
  uishowAbsFlowAppsDetail: showAbsFlowAppsDetailClass[]
  Circulate: boolean
  Today: boolean
  Appointment: boolean
  KeyName: string
  EventDate: string
}

class ReviewVaDetailClass {
  ProcessID: number
  Serno: string
  HoliDayName: string
  DateB: string
  DateE: string
  DateTimeB: string
  DateTimeE: string
  EventDate: string
  AbsFlowAppsDetail: AbsFlowAppsDetailClass[]
  EmpID: string
  EmpCode: string
  EmpNameC: string
  RoteID: string
  TimeB: string
  TimeE: string
  HoliDayID: string
  HoliDayNameC: string
  Use: string
  Day: string
  Balance: string
  HoliDayUnitName: string
  AgentNobr1: string
  AgentName1: string
  AgentNote: string
  Note: string
  Info: string
  KeyName: string
  UploadFile: any[]
  MailBody: string
  State: string
  Today: boolean
  Circulate: boolean
  Appointment: boolean
}
class FormSign {
  DeptNameC: string
  EmpCode: string
  EmpID: string
  EmpNameC: string
  JobName: string
  Key1: string
  Key2: string
  NodeName: string
  Note: string
  ProcessFlowID: number
  SignDate: string
}