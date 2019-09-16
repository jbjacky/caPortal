import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { GetApiDataServiceService } from 'src/app/Service/get-api-data-service.service';
import { Router, NavigationEnd } from '@angular/router';
import { takeWhile } from 'rxjs/operators';
declare var $;

@Component({
  selector: 'app-canapprovidday',
  templateUrl: './canapprovidday.component.html',
  styleUrls: ['./canapprovidday.component.css']
})
export class CanapproviddayComponent implements OnInit,AfterViewInit , OnDestroy {
  ngAfterViewInit(): void {
    // this.router.events
    //   .pipe(takeWhile(() => this.api_subscribe))
    //   .subscribe((e: any) => {
    //     // If it is a NavigationEnd event re-initalise the component
    //     if (e instanceof NavigationEnd) {
    //       this.ngOnInit()
    //     }
    //   });
  }
  api_subscribe = true; //ngOnDestroy時要取消訂閱api的subscribe
  ngOnDestroy(): void {
    // throw new Error("Method not implemented.");
    this.api_subscribe = false;
  }
  constructor(private router: Router,
    private GetApiDataServiceService: GetApiDataServiceService) {
   }

  HoliDayFlowConditionView: View[] = []
  ngOnInit() {

    this.GetApiDataServiceService.getWebApiData_GetHoliDayFlowConditionView()
    .pipe(takeWhile(() => this.api_subscribe))
    .subscribe(
      (x: any) => {
        this.HoliDayFlowConditionView = x;
      }
    )
  }

}
class View {
  HoliDayCode: string
  HoliDayNameC: string
  Max1: number
  Max2: number
  Max3: number
}
