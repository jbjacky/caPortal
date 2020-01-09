import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { GetApiDataServiceService } from 'src/app/Service/get-api-data-service.service';
import { GetApiUserService } from 'src/app/Service/get-api-user.service';
import { takeWhile } from 'rxjs/operators';
import { doFormatDate } from 'src/app/UseVoid/void_doFormatDate';
import { GetEmpInfoDataClass } from 'src/app/Models/GetEmpInfoDataClass';

@Component({
  selector: 'app-search-emp-info',
  templateUrl: './search-emp-info.component.html',
  styleUrls: ['./search-emp-info.component.css']
})
export class SearchEmpInfoComponent implements OnInit, OnDestroy {

  ngOnDestroy(): void {
    // throw new Error("Method not implemented.");
    this.api_subscribe = false;
  }
  api_subscribe = true
  constructor(
    private GetApiUserService: GetApiUserService,
    private GetApiDataServiceService: GetApiDataServiceService,
    private LoadingPage: NgxSpinnerService) { }

  GetEmpInfoData: GetEmpInfoDataClass

  ngOnInit() {
    this.GetApiUserService.counter$.subscribe(
      (x: any) => {
        if (x == 0) {
        } else {
          var today = new Date()
          var GetEmpInfoGetApi = {
            EmpCode: x.EmpCode,
            today: doFormatDate(today)
          }
          this.GetApiDataServiceService.getWebApiData_GetEmpInfo(GetEmpInfoGetApi.EmpCode, GetEmpInfoGetApi.today)
            .pipe(takeWhile(() => this.api_subscribe))
            .subscribe((x: GetEmpInfoDataClass) => {
              this.GetEmpInfoData = JSON.parse(JSON.stringify(x));
            })
        }
      })
  }

}
