import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { GetApiUserService } from '../Service/get-api-user.service';
import { GetApiDataServiceService } from '../Service/get-api-data-service.service';
import { HttpHeaders } from '@angular/common/http';
import { CaUserClass } from '../Models/CaUserClass';

import { GetPageByEmpClass } from '../Models/GetPageByEmpClass';
import { takeWhile } from 'rxjs/operators';
import { void_ReGoLoginPage } from '../UseVoid/void_goLoginPage';

@Injectable()
export class AuthGuard implements CanActivate {

    constructor(private router: Router,
        private GetApiDataServiceService: GetApiDataServiceService,
        private GetApiUserService: GetApiUserService, ) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        if (localStorage.getItem('API_Token') &&
            localStorage.getItem('API_Code')) {

            var take = true
            this.GetApiUserService.counter$
                .pipe(takeWhile(() => take))
                .subscribe(
                    (x: any) => {
                        if (x == 0) {

                        } else {

                            this.GetApiDataServiceService.getWebApiData_GetPageByEmp(x.EmpID)
                                .subscribe(
                                    (GetPageByEmp: GetPageByEmpClass[]) => {
                                        var CanSearchPage = []
                                        for (let oneGetPage of GetPageByEmp) {
                                            for (let oneSite of oneGetPage.site) {
                                                CanSearchPage.push(oneSite.Url)
                                            }
                                        }
                                        if (route) {
                                            if (route.url.length > 0) {
                                                var checkCanSearch = CanSearchPage.find(function (element) {
                                                    return element == route.url[0].path;
                                                });
                                                if (route.url.toString() == 'TestWriteComponent' ||
                                                    route.url.toString() == 'NewsShowAllComponent' ||
                                                    route.url[0].toString() == 'NewsShowDetailComponent'
                                                    // route.url.toString() == 'RoleSettingComponent' ||
                                                    // route.url.toString() == 'PageRoleSettingComponent' ||
                                                    // route.url.toString() == 'PersonRoleSettingComponent'
                                                ) {
                                                    //等RoleSettingComponent、PageRoleSettingComponent、PersonRoleSettingComponen、頁面上資料庫時要拿掉
                                                    checkCanSearch = true
                                                } else if (route.url[0].path == 'NewsDataEditComponent') {
                                                    checkCanSearch = CanSearchPage.find(function (element) {
                                                        return element == 'NewsManageComponent';
                                                    });
                                                } else if (route.url[0].path == 'NewsAddComponent') {
                                                    checkCanSearch = CanSearchPage.find(function (element) {
                                                        return element == 'NewsManageComponent';
                                                    });
                                                }
                                                if (!checkCanSearch && route.url[0].path != 'SwitchUserComponent') {
                                                    alert('沒有訪問此頁面的權限')
                                                    this.router.navigate(["nav/"]);
                                                    return;
                                                }

                                                if (!checkCanSearch && route.url[0].path == 'SwitchUserComponent') {

                                                    //如果切換到的人員沒有切換頁面權限，就再從第一次進入的人員看有沒有切換的權限
                                                    this.GetApiDataServiceService.getWebApiData_GetAuthToken()
                                                        .subscribe(
                                                            (x: CaUserClass) => {
                                                                if (x) {
                                                                    
                                                                    this.GetApiDataServiceService.getWebApiData_GetPageByEmp(x.EmpID.toString())
                                                                        .subscribe(
                                                                            (GetPageByEmp_FirstEmpCode: GetPageByEmpClass[]) => {
                                                                                var hasSwitchUser_FirstEmpCode: boolean = false

                                                                                for (let i = 0; i < GetPageByEmp_FirstEmpCode.length; i++) {
                                                                                    for (let oneSite of GetPageByEmp_FirstEmpCode[i].site) {
                                                                                        if (oneSite.Url == 'SwitchUserComponent') {
                                                                                            hasSwitchUser_FirstEmpCode = true
                                                                                        }
                                                                                    }
                                                                                }
                                                                                if (!hasSwitchUser_FirstEmpCode) {
                                                                                    alert('沒有訪問此頁面的權限')
                                                                                    this.router.navigate(["nav/"]);
                                                                                    return;
                                                                                }
                                                                            })
                                                                }
                                                            })
                                                }

                                            }
                                        }
                                        take = false
                                    }, err => {
                                        take = false
                                    }
                                )
                        }
                    }
                )
            return true;
        } else {// not logged in so redirect to login page with the return url
            this.router.navigate(['/LoginComponent']);
            return false;
        }

    }
}