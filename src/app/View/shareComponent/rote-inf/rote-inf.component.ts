import { Component, OnInit, Input, OnDestroy, Output } from '@angular/core';
import { GetApiDataServiceService } from 'src/app/Service/get-api-data-service.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { takeWhile } from 'rxjs/operators';
import { getapi_formatTimetoString } from 'src/app/UseVoid/void_doFormatDate';
import { void_crossDay } from 'src/app/UseVoid/void_crossDay';
import { Observable } from 'rxjs';
import { HourAndMin } from 'src/app/UseVoid/void_timeofday';
import { GetRoteApiDataClass } from 'src/app/Models/GetRoteApiDataClass';

declare let $: any; //use jquery

@Component({
  selector: 'app-rote-inf',
  templateUrl: './rote-inf.component.html',
  styleUrls: ['./rote-inf.component.css']
})
export class RoteInfComponent implements OnInit, OnDestroy {
  ngOnDestroy(): void {
    this.api_subscribe = false;
  }

  api_subscribe = true; //ngOnDestroy時要取消

  @Input() GetRoteInfo$: Observable<any>


  showAttendArray: GetRoteApiDataClass[] = []
  constructor(
    private GetApiDataServiceService: GetApiDataServiceService,
    private LoadingPage: NgxSpinnerService) {
  }

  ngOnInit() {

    this.showAttendArray = []
    this.GetRoteInfo$
      .pipe(takeWhile(() => this.api_subscribe))
      .subscribe(
        (GetRoteID: Array<number>) => {
          if (GetRoteID) {
            this.LoadingPage.show()
            this.GetApiDataServiceService.getWebApiData_GetRote(GetRoteID)
              .pipe(takeWhile(() => this.api_subscribe))
              .subscribe(
                (x: GetRoteApiDataClass[]) => {
                  this.showAttendArray = JSON.parse(JSON.stringify(x))
                  for (let aa of this.showAttendArray) {
                    // aa.AttendDate = formatDateTime(aa.AttendDate).getDate
                    aa.OnTime = getapi_formatTimetoString(void_crossDay(aa.OnTime).EndTime)
                    aa.OffTime = getapi_formatTimetoString(void_crossDay(aa.OffTime).EndTime)

                    aa.OnTime_calCrossDay = void_crossDay(aa.OnTime).isCrossDay
                    aa.OffTime_calCrossDay = void_crossDay(aa.OffTime).isCrossDay
                    // aa.ActualRote_OnTime = formatDateTime(aa.AttendDate).getDate + ' ' + getapi_formatTimetoString(void_crossDay(aa.ActualRote.OnTime).EndTime)
                    // aa.ActualRote_OffTime = formatDateTime(aa.AttendDate).getDate + ' ' + getapi_formatTimetoString(void_crossDay(aa.ActualRote.OffTime).EndTime)
                    aa.uiWorkTime = {
                      Hour: HourAndMin(aa.WorkHours).hour,
                      Min: HourAndMin(aa.WorkHours).min
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
