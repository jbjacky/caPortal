import { Injectable, OnDestroy } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { HttpErrorResponse, HttpRequest, HttpHeaders } from '@angular/common/http';
import { DeviceDetectorService } from 'ngx-device-detector';
import { GetApiUserService } from './get-api-user.service';
import { LogApiMsgGetApiClass } from '../Models/PostData_API_Class/LogApiMsgGetApiClass';
import { GetApiDataServiceService } from './get-api-data-service.service';
import { void_goLoginPage, void_ReGoLoginPage } from '../UseVoid/void_goLoginPage';
import { SettingClass } from '../Models/SettingClass';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { takeWhile } from 'rxjs/operators';
import { ErrorStateService } from './error-state.service';

@Injectable()
export class ErrorHandler implements OnDestroy {
    ngOnDestroy(): void {
        this.api_subscribe = false;
    }
    api_subscribe = true; //ngOnDestroy時要取消
    KeyMan: string = ''
    constructor(private router: Router,
        private ErrorStateService: ErrorStateService,
        private deviceService: DeviceDetectorService,
        private GetApiDataServiceService: GetApiDataServiceService,
        private LoadingPage: NgxSpinnerService
    ) {
    }

    checkEverRequestError: boolean = false

    public handleError(request: HttpRequest<any>, error: HttpErrorResponse) {
        if (error.error instanceof ErrorEvent) {
            // console.log(`Error: ${error.error.message}`);
            // console.log(error)
        }
        else {  // Server Side Error
            // console.log(`Error Code: ${error.status},  Message: ${error.message}`);
        }
        if (error.name == "TimeoutError") {
            // alert('連線時間逾時，TimeOut')
            this.ErrorStateService.errorState = 4
            this.router.navigateByUrl('/ErrorPageComponent')
            this.LoadingPage.hide()
        } else {
            this.CheckError(request, error, false);
        }
    }

    private CheckError(request: HttpRequest<any>, error: HttpErrorResponse, ifTimeOut: boolean) {
        var today = new Date();
        today.setMinutes(today.getMinutes() - today.getTimezoneOffset());
        this.deviceService = new DeviceDetectorService('browser');
        var credentials = localStorage.getItem('API_Token') + ":" + localStorage.getItem('API_Code');
        var basic = "Basic " + btoa(credentials);
        var headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': basic
        });
        if (!this.checkEverRequestError) {
            this.checkEverRequestError = true;
            this.GetApiDataServiceService.getWebApiData_GetAuthToken()
                .pipe(takeWhile(() => this.api_subscribe))
                .subscribe((x: any) => {
                    if (x) {
                        var NowUrl = window.location.href.toString()
                        this.KeyMan = x.EmpID;
                        var errorString = '' + NowUrl
                        if (ifTimeOut) {
                            errorString += 'TimeOut'
                        } else {
                            errorString += error.error.toString()
                            errorString += error.message
                        }
                        var LogApiMsgGetApi: LogApiMsgGetApiClass = {
                            userAgent: this.deviceService.userAgent,
                            os: this.deviceService.os,
                            browser: this.deviceService.browser,
                            device: this.deviceService.device,
                            os_version: this.deviceService.os_version,
                            browser_version: this.deviceService.browser_version,
                            isDesktop: this.deviceService.isDesktop(),
                            isMobile: this.deviceService.isMobile(),
                            isTablet: this.deviceService.isTablet(),
                            UserID: this.KeyMan,
                            EditDate: today.toJSON(),
                            postMethod: request.urlWithParams,
                            postData: request.body,
                            errorResponse: errorString //出錯的response
                        };
                        // console.log(LogApiMsgGetApi)
                        this.GetApiDataServiceService.getWebApiData_LogApiMsg(LogApiMsgGetApi)
                            .pipe(takeWhile(() => this.api_subscribe))
                            .subscribe((x: any) => {
                            }, error => {
                            });
                    }
                    else {
                        this.ErrorStateService.errorState = 2;
                        // console.log(error)
                        this.router.navigateByUrl('/ErrorPageComponent');
                        this.LoadingPage.hide();
                    }
                }, error => {
                    this.ErrorStateService.errorState = 2;
                    // console.log(error)
                    this.router.navigateByUrl('/ErrorPageComponent');
                    this.LoadingPage.hide();
                });
        }
    }
}
