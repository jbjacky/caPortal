import { Component, OnInit, Input, OnDestroy, Output } from '@angular/core';
import { GetAttendInfoClass } from 'src/app/Models/PostData_API_Class/GetAttendInfoClass';
import { GetApiDataServiceService } from 'src/app/Service/get-api-data-service.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { takeWhile } from 'rxjs/operators';
import { AttendError } from 'src/app/Models/AttendError';
import { formatDateTime, getapi_formatTimetoString } from 'src/app/UseVoid/void_doFormatDate';
import { void_crossDay } from 'src/app/UseVoid/void_crossDay';
import { Observable } from 'rxjs';
import {  HourAndMin } from 'src/app/UseVoid/void_timeofday';

declare let $: any; //use jquery
@Component({
  selector: 'app-day-rote',
  templateUrl: './day-rote.component.html',
  styleUrls: ['./day-rote.component.css']
})
export class DayRoteComponent implements OnInit, OnDestroy {
  ngOnDestroy(): void {
    this.api_subscribe = false;
  }

  api_subscribe = true; //ngOnDestroy時要取消

  @Input() GetAttendInfo$: Observable<GetAttendInfoClass>


  showAttendArray = []
  constructor(
    private GetApiDataServiceService: GetApiDataServiceService,
    private LoadingPage: NgxSpinnerService) {
  }

  ngOnInit() {

    this.showAttendArray = []
    this.GetAttendInfo$
      .pipe(takeWhile(() => this.api_subscribe))
      .subscribe(
        (GetAttendInfo: GetAttendInfoClass) => {
          if (GetAttendInfo) {
            this.LoadingPage.show()
            this.GetApiDataServiceService.getWebApiData_GetAttendInfo(GetAttendInfo)
              .pipe(takeWhile(() => this.api_subscribe))
              .subscribe(
                (x: AttendError[]) => {
                  this.showAttendArray = JSON.parse(JSON.stringify(x))
                  for (let aa of this.showAttendArray) {
                    aa.AttendDate = formatDateTime(aa.AttendDate).getDate
                    aa.ActualRote.OnTime = getapi_formatTimetoString(void_crossDay(aa.ActualRote.OnTime).EndTime)
                    aa.ActualRote.OffTime = getapi_formatTimetoString(void_crossDay(aa.ActualRote.OffTime).EndTime)

                    aa.ActualRote_OnTime_calCrossDay = void_crossDay(aa.ActualRote.OnTime).isCrossDay
                    aa.ActualRote_OffTime_calCrossDay = void_crossDay(aa.ActualRote.OffTime).isCrossDay
                    // aa.ActualRote_OnTime = formatDateTime(aa.AttendDate).getDate + ' ' + getapi_formatTimetoString(void_crossDay(aa.ActualRote.OnTime).EndTime)
                    // aa.ActualRote_OffTime = formatDateTime(aa.AttendDate).getDate + ' ' + getapi_formatTimetoString(void_crossDay(aa.ActualRote.OffTime).EndTime)
                    aa.ActualRote.uiWorkTime = {
                      Hour: HourAndMin(aa.ActualRote.WorkHours).hour,
                      Min: HourAndMin(aa.ActualRote.WorkHours).min
                    }
                  }
                  this.LoadingPage.hide()
                }, error => {
                  this.LoadingPage.hide()
                }
              )
          }
        }
      )

  }

}
