import { Component, OnInit, OnDestroy } from '@angular/core';
import { GetSendMailLogClass } from 'src/app/Models/PostData_API_Class/GetSendMailLogClass';
import { NgxSpinnerService } from 'ngx-spinner';
import { GetApiDataServiceService } from 'src/app/Service/get-api-data-service.service';
import { takeWhile } from 'rxjs/operators';
import { GetSendMailLogDataClass } from 'src/app/Models/GetSendMailLogDataClass';
import { formatDateTime, getapi_formatTimetoString } from 'src/app/UseVoid/void_doFormatDate';

declare let $: any; //use jquery
@Component({
  selector: 'app-email-log-info',
  templateUrl: './email-log-info.component.html',
  styleUrls: ['./email-log-info.component.css']
})
export class EmailLogInfoComponent implements OnInit , OnDestroy {
  ngOnDestroy(): void {
    // throw new Error("Method not implemented.");
    this.api_subscribe = false;
  }

  api_subscribe = true; //ngOnDestroy時要取消訂閱api的subscribe
  constructor(private GetApiDataServiceService: GetApiDataServiceService,
    private LoadingPage: NgxSpinnerService) { }

  ngOnInit() {
  }

  showGetSendMailLog = {
    "ProcessFlowID":0,
    "ToAddress":"",
    "Subject":"",
    "Body":""
  }

  showGetSendMailLogData:GetSendMailLogDataClass[] = []
  showBodyString:string = ''

  bt_search(){

    var GetSendMailLog:GetSendMailLogClass = this.showGetSendMailLog
    if(!GetSendMailLog.ProcessFlowID){
      GetSendMailLog.ProcessFlowID = 0
    }
    this.GetApiDataServiceService.getWebApiData_GetSendMailLog(GetSendMailLog)
    .pipe(takeWhile(() => this.api_subscribe))
    .subscribe(
      (GetSendMailLogData:GetSendMailLogDataClass[])=>{
        this.showGetSendMailLogData = JSON.parse(JSON.stringify(GetSendMailLogData));
        for(let LogData of this.showGetSendMailLogData){
          LogData.KeyDate = formatDateTime(LogData.KeyDate).getDate + ' ' +getapi_formatTimetoString(formatDateTime(LogData.KeyDate).getTime)
        }
      }
    )

  }


  showBodyDetail(bodyString:string){
    this.showBodyString = bodyString
    $('#ShowBodyDialog').modal('show')
  }
}
