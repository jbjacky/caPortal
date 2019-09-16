import { Component, OnInit, OnDestroy } from '@angular/core';
import { baseArrayClass } from 'src/app/Models/baseArrayClass';
import { Router } from '@angular/router';
import { GetApiUserService } from 'src/app/Service/get-api-user.service';
import { GetApiDataServiceService } from 'src/app/Service/get-api-data-service.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { SwitchUserService } from 'src/app/Service/switch-user.service';
import { takeWhile } from 'rxjs/operators';
import { GetBaseInfoDetailClass } from 'src/app/Models/GetBaseInfoDetailClass';
import { GetPageByEmpClass } from 'src/app/Models/GetPageByEmpClass';
import { twonav } from '../nav/navmore';
import { CaUserClass } from 'src/app/Models/CaUserClass';
import { doFormatDate } from 'src/app/UseVoid/void_doFormatDate';
import { GetBaseByAuthByEmpIDgetDeptInfoGetApiClass } from 'src/app/Models/PostData_API_Class/GetBaseByAuthByEmpIDgetDeptInfoGetApiClass';
import { GetBaseByAuthByEmpIDDataClass } from 'src/app/Models/GetBaseByAuthByEmpIDDataClass';
import { void_ReGoLoginPage, void_goLoginPage } from 'src/app/UseVoid/void_goLoginPage';
import { SettingClass } from 'src/app/Models/SettingClass';

@Component({
  selector: 'app-switch-user',
  templateUrl: './switch-user.component.html',
  styleUrls: ['./switch-user.component.css']
})
export class SwitchUserComponent implements OnInit, OnDestroy {
  ngOnDestroy(): void {
    this.api_subscribe = false;
  }
  api_subscribe = true; //ngOnDestroy時要取消
  selectUserData: GetBaseInfoDetailClass = new GetBaseInfoDetailClass() //目前選到的人員
  IsAdmin: boolean = false

  constructor(private router: Router,
    private GetApiUserService: GetApiUserService,
    private GetApiDataServiceService: GetApiDataServiceService,
    private LoadingPage: NgxSpinnerService,
    private SwitchUser: SwitchUserService
  ) {
  }


  ngOnInit() {
    // this.IsAdmin = this.SwitchUser.getFirstEmpIsAdmin()

    this.GetApiDataServiceService.getWebApiData_GetAuthToken()
      .pipe(takeWhile(() => this.api_subscribe))
      .subscribe(
        (x: CaUserClass) => {
          if (x) {
            var _NowDate = new Date();
            var _NowToday = doFormatDate(_NowDate);
            var GetBaseByAuthByEmpIDgetDeptInfoGetApi: GetBaseByAuthByEmpIDgetDeptInfoGetApiClass =
            {
              "EmpID": x.EmpID,
              "EffectDate": _NowToday
            }
            this.GetApiDataServiceService.getWebApiData_GetBaseByAuthByEmpIDgetDeptInfo(GetBaseByAuthByEmpIDgetDeptInfoGetApi)
              .pipe(takeWhile(() => this.api_subscribe))
              .subscribe(
                (GetBaseByAuthByEmpIDData: GetBaseByAuthByEmpIDDataClass) => {

                  if (GetBaseByAuthByEmpIDData.IsAdmin) {
                    this.IsAdmin = true
                  } else {
                    this.IsAdmin = false
                  }
                }
              )

          } else {
            // alert('驗證失效，請重新登入')
            localStorage.removeItem('API_Token')
            localStorage.removeItem('API_Code')
            void_goLoginPage()
          }
        })
  }

  change(base: baseArrayClass) {
    //選到想切換的人員
    this.onSelectEmpClick(base)
  }

  onSelectEmpClick(base: baseArrayClass) {

    this.GetApiDataServiceService.getWebApiData_GetBaseInfoDetail(base.EmpCode)
      .pipe(takeWhile(() => this.api_subscribe))
      .subscribe(
        (GetBaseInfoDetail: GetBaseInfoDetailClass[]) => {

          this.GetApiUserService.onAllChange(GetBaseInfoDetail)
          //選到切換人員的時候把所有資料都進到這，給後續切換部門用
          for (let BaseInfoDetail of GetBaseInfoDetail) {
            if (BaseInfoDetail.PosType == 'M') {
              // this.GetApiUserService.onChange(BaseInfoDetail)
              this.selectUserData = BaseInfoDetail
            }
          }
          this.setMenu(this.selectUserData.EmpCode)
        }
      )

  }
  //切換人員尾

  setMenu(EmpID: string) {
    this.GetApiDataServiceService.getWebApiData_GetPageByEmp(EmpID)
      .pipe(takeWhile(() => this.api_subscribe))
      .subscribe(
        (GetPageByEmp: GetPageByEmpClass[]) => {
          var two_nav: twonav[] = []
          var hasSwitchUser: boolean = false

          for (let i = 0; i < GetPageByEmp.length; i++) {
            two_nav.push({ largetitle: GetPageByEmp[i].Title, routeurl: GetPageByEmp[i].Url, site: [] })
            for (let oneSite of GetPageByEmp[i].site) {
              two_nav[i].site.push(
                {
                  title: oneSite.Title,
                  routeurl: oneSite.Url
                }
              )
              if (oneSite.Url == 'SwitchUserComponent') {
                hasSwitchUser = true
              }
            }
          }

          if (hasSwitchUser) {
            this.SwitchUser.setTwo_navMenu(two_nav)
            this.GetApiUserService.onChange(this.selectUserData)
            this.router.navigate(["nav/"]);
          } else {
            //如果切換到的人員沒有切換頁面權限，就再從第一次進入的人員看有沒有切換的權限
            this.GetApiDataServiceService.getWebApiData_GetAuthToken()
              .pipe(takeWhile(() => this.api_subscribe))
              .subscribe(
                (x: CaUserClass) => {
                  if (x) {
                    this.GetApiDataServiceService.getWebApiData_GetPageByEmp(x.EmpID.toString())
                      .pipe(takeWhile(() => this.api_subscribe))
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

                          if (hasSwitchUser_FirstEmpCode) {
                            var findIndexCode = GetPageByEmp.findIndex((_Page: GetPageByEmpClass) => {
                              return _Page.Code == 'System'
                            })

                            if (findIndexCode < 0) {
                              two_nav.push({
                                largetitle: '系統管理', routeurl: null, site: [
                                  {
                                    routeurl: "SwitchUserComponent",
                                    title: "切換使用者"
                                  }]
                              })
                            } else {
                              var findSystemIndex = two_nav.findIndex((t: twonav) => {
                                return t.largetitle == '系統管理'
                              })
                              two_nav[findSystemIndex].site.push({
                                routeurl: "SwitchUserComponent",
                                title: "切換使用者"
                              })
                            }

                            this.SwitchUser.setTwo_navMenu(two_nav)
                            this.GetApiUserService.onChange(this.selectUserData)
                            this.router.navigate(["nav/"]);
                          }
                        })
                  }
                })
          }
        }
      )
  }
}
