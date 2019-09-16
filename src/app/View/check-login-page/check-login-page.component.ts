import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { GetApiDataServiceService } from 'src/app/Service/get-api-data-service.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { takeWhile } from 'rxjs/operators';
import { CaUserClass } from 'src/app/Models/CaUserClass';
import { IsLoginPassGetApiClass } from 'src/app/Models/PostData_API_Class/IsLoginPassGetApiClass';
import { doFormatDate } from 'src/app/UseVoid/void_doFormatDate';
import { IsLoginPassDataClass } from 'src/app/Models/IsLoginPassDataClass';
import { void_LogoutPage } from 'src/app/UseVoid/void_goLoginPage';
import { ErrorStateService } from 'src/app/Service/error-state.service';

@Component({
  selector: 'app-check-login-page',
  templateUrl: './check-login-page.component.html',
  styleUrls: ['./check-login-page.component.css']
})
export class CheckLoginPageComponent implements OnInit, OnDestroy {
  ngOnDestroy(): void {
    this.api_subscribe = false;
  }
  api_subscribe = true; //ngOnDestroy時要取消

  constructor(private route: Router,
    private ErrorStateService:ErrorStateService,
    private GetApiDataServiceService: GetApiDataServiceService,
    private LoadingPage: NgxSpinnerService
    // private GetApiUserService:GetApiUserService,
    // private LoadingPage: NgxSpinnerService,
  ) { }

  ngOnInit() {

    this.LoadingPage.show()
    this.GetApiDataServiceService.getWebApiData_GetAuthToken()
      .pipe(takeWhile(() => this.api_subscribe))
      .subscribe(
        (x: CaUserClass) => {
          if (x) {
            var _NowDate = new Date();
            var _NowToday = doFormatDate(_NowDate);
            var IsLoginPassGetApi: IsLoginPassGetApiClass = {
              "EmpID": x.EmpID,
              "EffectDate": _NowToday
            }

            this.GetApiDataServiceService.getWebApiData_IsAllowLogin(IsLoginPassGetApi)
              .pipe(takeWhile(() => this.api_subscribe))
              .subscribe(
                (IsAllowLoginPassData: IsLoginPassDataClass) => {
                  // console.log('login')
                  if (IsAllowLoginPassData.Pass) {
                    this.GetApiDataServiceService.getWebApiData_IsLoginPass(IsLoginPassGetApi)
                      .pipe(takeWhile(() => this.api_subscribe))
                      .subscribe(
                        (IsLoginPassData: IsLoginPassDataClass) => {
                          if (IsLoginPassData.Pass) {
                            this.route.navigateByUrl('/nav')
                            // this.LoadingPage.hide()
                          } else {
                            alert(IsLoginPassData.MessageContent)
                            this.ErrorStateService.errorState = 1
                            this.route.navigateByUrl('/ErrorPageComponent')
                            // this.LoadingPage.hide()
                          }
                        }, error => {
                        }
                      )
                  } else {
                    alert(IsAllowLoginPassData.MessageContent)
                    // this.LoadingPage.hide()
                    this.ErrorStateService.errorState = 1
                    this.route.navigateByUrl('/ErrorPageComponent')
                  }
                }, error => {
                })
          }

        }, error => {
          // this.LoadingPage.hide()
          // console.log('checklogin')
          this.ErrorStateService.errorState = 2
          this.route.navigateByUrl('/ErrorPageComponent')
        })

    
  }
}
