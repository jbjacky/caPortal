import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { Router, NavigationStart, NavigationEnd } from '@angular/router';
import { twonav, threenav } from './navmore';
import { fromEvent } from 'rxjs';
import { debounceTime, takeWhile } from 'rxjs/operators';
import { GetApiUserService } from 'src/app/Service/get-api-user.service'
import { GetApiDataServiceService } from 'src/app/Service/get-api-data-service.service';
import { GetBaseInfoDetailClass } from 'src/app/Models/GetBaseInfoDetailClass';
import { NgxSpinnerService } from 'ngx-spinner';
import { CaUserClass } from 'src/app/Models/CaUserClass';
import { GetPageByEmpClass } from 'src/app/Models/GetPageByEmpClass';
import { GetBaseByAuthByEmpIDgetDeptInfoGetApiClass } from 'src/app/Models/PostData_API_Class/GetBaseByAuthByEmpIDgetDeptInfoGetApiClass';
import { doFormatDate } from 'src/app/UseVoid/void_doFormatDate';
import { GetBaseByAuthByEmpIDDataClass } from 'src/app/Models/GetBaseByAuthByEmpIDDataClass';
import { void_LogoutPage } from 'src/app/UseVoid/void_goLoginPage';
import { baseArrayClass } from 'src/app/Models/baseArrayClass';
import { SwitchUserService } from 'src/app/Service/switch-user.service';
import { ErrorStateService } from 'src/app/Service/error-state.service';

declare let $: any; //use jquery
declare var desktopTitleString
declare var phoneTitleString
declare var footerString
declare var QAhref
declare var manualhref

// import settingJson from 'src/assets/setting.json';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})


export class NavComponent implements OnInit, AfterViewInit, OnDestroy {
  ngOnDestroy(): void {
    this.api_subscribe = false;

  }

  customCollapsedHeight: string = '48px'; //menu高度
  customExpandedHeight: string = '48px'; //menu高度

  api_subscribe = true; //ngOnDestroy時要取消

  IsHasSwitchUser: boolean = false //最大管理員或行政 (顯示切換)
  IsAdmin: boolean = false //最大管理員

  NowURL = ''
  ngAfterViewInit(): void {

    this.NowURL = this.router.url.toString()
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.changeSencondTitle(event.url);
        if (event.url != '/nav') {
          if (event.url == this.NowURL || event.urlAfterRedirects == this.NowURL) {
            this.router.navigateByUrl('/nav', { skipLocationChange: true }).then(() => {
              this.router.navigate([event.url])
            });
          }
        }
        this.NowURL = this.router.url.toString()
      }
    });//route位址改變時
  }
  selectUserData: GetBaseInfoDetailClass = new GetBaseInfoDetailClass() //目前選到的人員
  UserAllData: GetBaseInfoDetailClass[] = [] //選擇部門下拉選單

  constructor(private router: Router,
    private ErrorStateService: ErrorStateService,
    private GetApiUserService: GetApiUserService,
    private GetApiDataServiceService: GetApiDataServiceService,
    private LoadingPage: NgxSpinnerService,
    private SwitchUserService: SwitchUserService
  ) {
  }


  LoadBalanceString = ''
  DesktopBlockTitleString = ''
  PhoneBlockTitleString = ''
  FooterBlockString = ''
  manualhrefString = ''
  QAhrefString = ''
  CheckAllSetting() {
    if (desktopTitleString) {
      this.DesktopBlockTitleString = desktopTitleString.toString()
    }
    if (phoneTitleString) {
      this.PhoneBlockTitleString = phoneTitleString.toString()
    }
    if (footerString) {
      this.FooterBlockString = footerString.toString()
    }
    if (manualhref) {
      this.manualhrefString = manualhref.toString()
    }
    if (QAhref) {
      this.QAhrefString = QAhref.toString()
    }
  }
  ngOnInit() {
    this.void_showLang()
    this.CheckAllSetting()
    var _NowDate = new Date();
    var _NowToday = doFormatDate(_NowDate);

    if (localStorage.getItem('API_Token') && localStorage.getItem('API_Code')) {
      this.GetApiUserService.counter$
        .subscribe(
          (x: any) => {
            if (x != 0) {
              this.selectUserData = x
              this.two_nav = this.SwitchUserService.getTwo_navMenu()
            }
          }
        )
      this.LoadingPage.show()
      this.GetApiDataServiceService.getWebApiData_GetAuthToken()
        .pipe(takeWhile(() => this.api_subscribe))
        .subscribe(
          (x: CaUserClass) => {
            if (x) {
              // console.log('nav')
              this.GetApiDataServiceService.getWebApiData_GetBaseInfoDetail(x.EmpID)
                .pipe(takeWhile(() => this.api_subscribe))
                .subscribe(

                  (GetBaseInfoDetail: GetBaseInfoDetailClass[]) => {
                    // this.LoadingPage.show()
                    // console.log(GetBaseInfoDetail)
                    this.GetApiUserService.onAllChange(GetBaseInfoDetail)

                    for (let BaseInfoDetail of GetBaseInfoDetail) {
                      if (BaseInfoDetail.PosType == 'M') {
                        this.GetApiUserService.onChange(BaseInfoDetail)
                        // this.selectUserData = BaseInfoDetail
                      }
                    }



                    // this.LoadingPage.hide()
                    this.setMenu(this.selectUserData.EmpCode)
                    if (GetBaseInfoDetail) {
                      if (GetBaseInfoDetail.length > 0) {

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
                              this.LoadingPage.hide()

                            }
                          )
                      } else {
                        this.LoadingPage.hide()
                        this.ErrorStateService.errorState = 1
                        this.router.navigateByUrl('/ErrorPageComponent')

                      }
                    } else {

                      this.LoadingPage.hide()
                      this.ErrorStateService.errorState = 1
                      this.router.navigateByUrl('/ErrorPageComponent')

                    }
                  },
                  error => {
                    // alert('與api連線異常，getWebApiData_GetBaseInfoDetail')
                    // this.router.navigate(['ErrorPageComponent']);
                    this.LoadingPage.hide()
                  }
                )
              this.changeSencondTitle(this.router.url);

              // console.log(this.router)
            } else {
            }
          }, error => {
          }
        )
    }


    this.checkdesktop();
    this.GetApiUserService.AllOneBaseDetailcounter$
      .pipe(takeWhile(() => this.api_subscribe))
      .subscribe(x => {
        this.UserAllData = x
      })


  }
  // <!--透明黑色區塊處理開始-->
  state: boolean = false; //透明黑色區塊顯示狀態
  checkdesktop() {
    //判斷是否為桌機
    //ngOnInit、點透明黑色區塊執行
    //civd2015-systemMain.js修正，手機畫面，就收合導覽列

    //$('body').css("position", "unset");
    // $('body').css("overflow-y", "auto");
    if (window.innerWidth > 1024) {
      // $('body').addClass("offcanvas-active");
      //civd2015-systemMain.js修正
    } else {
      $('body').removeClass("offcanvas-active");//如果是手機畫面，就收合導覽列
      this.state = false;
    }
  }

  // clickNav(routeurl: string) {
  //   console.log(routeurl)
  //   this.checkdesktop()
  //   if (this.router.url.toString().split('/')[2] == routeurl) {
  //     // location.reload()
  //     // this.ngOnInit()
  //   } else {
  //     this.router.navigate(['nav/' + routeurl]);
  //   }

  // }
  phone_bt_toggleactive() {
    if (window.innerWidth > 1024) {

    } else {
      this.bt_toggleactive()
    }
  }
  bt_toggleactive() {
    if ($('body').hasClass("offcanvas-active")) {
      $('body').removeClass('offcanvas-active');
    } else {
      $('body').addClass('offcanvas-active');
    }

    //左上角收合導覽列按鈕
    if (window.innerWidth > 1024) {
    } else {
      if (!$('body').hasClass("offcanvas-active")) {
        this.state = false;
        //$('body').css("position", "unset");
        // $('body').css("overflow-y", "auto");
      } else {
        this.state = true;
        // $('body').css("position", "fixed");
        // $('body').css("overflow-y", "hidden");
      }
    }
  }
  formEvent_reisze = fromEvent(window, 'resize')
    .pipe(debounceTime(500))
    .pipe(takeWhile(() => this.api_subscribe))
    .subscribe((event) => {
      this.state = false;
      //$('body').css("position", "unset");
      // $('body').css("overflow-y", "auto");
    })
  // <!--透明黑色區塊處理結束-->
  two_nav: twonav[] = []

  secondtitle: any;

  changeSencondTitle(eventRouteurl) {

    var oneurl = eventRouteurl.split('/nav/')[1]
    var ifscecond = eventRouteurl = eventRouteurl.split('/')[2]

    for (let i = 0; i < this.two_nav.length; i++) {
      if (this.two_nav[i].site.length > 0) {
        for (let j = 0; j < this.two_nav[i].site.length; j++) {
          // console.log(oneurl)
          if (oneurl == this.two_nav[i].site[j].routeurl) {
            this.secondtitle = this.two_nav[i].site[j].title.toString();
          } else if (ifscecond == this.two_nav[i].site[j].routeurl) {
            this.secondtitle = this.two_nav[i].site[j].title.toString();
          }
        }
      }
      else {
        if (oneurl == this.two_nav[i].routeurl) {
          this.secondtitle = this.two_nav[i].largetitle.toString()
        }
      }
    }//兩層nav

    if (!oneurl || oneurl == 'home') {
      this.secondtitle = null
    }
  }

  signOut() {
    this.GetApiDataServiceService.getWebApiData_DeleteAuthToken()
      .pipe(takeWhile(() => this.api_subscribe))
      .subscribe(
        x => {
          void_LogoutPage()
        }
      )
  }

  //切換人員起
  baseArray: baseArrayClass[] = []
  searchVal: string;//搜尋條件
  errorState = { show: false, errorString: '' }
  searchLoading = false


  change(base: baseArrayClass) {
    //選到想切換的人員
    $('#switchEmpDialog').modal('hide')
    this.onSelectEmpClick(base)
  }


  /**
   * @todo 選擇部門後會把Serivce人員資料置換
   * @param BaseInfoDetail 
   */
  onChangeDept(BaseInfoDetail: GetBaseInfoDetailClass) {
    this.GetApiUserService.onChange(BaseInfoDetail)
    // this.router.navigateByUrl('', { skipLocationChange: true }).then(() =>
    // this.router.navigate(["nav/"]));
  }

  onSelectEmpClick(base: baseArrayClass) {
    this.LoadingPage.show()
    this.GetApiDataServiceService.getWebApiData_GetBaseInfoDetail(base.EmpCode)
      .pipe(takeWhile(() => this.api_subscribe))
      .subscribe(
        (GetBaseInfoDetail: GetBaseInfoDetailClass[]) => {

          this.GetApiUserService.onAllChange(GetBaseInfoDetail)
          //選到切換人員的時候把所有資料都進到這，給後續切換部門用
          for (let BaseInfoDetail of GetBaseInfoDetail) {
            if (BaseInfoDetail.PosType == 'M') {
              this.GetApiUserService.onChange(BaseInfoDetail)
              this.selectUserData = BaseInfoDetail
            }
          }
          this.router.navigate(["nav/"]);
          // this.router.navigateByUrl('', { skipLocationChange: true }).then(() =>
          //   this.router.navigate(["nav/"]));
          this.LoadingPage.hide()

          this.setMenu(this.selectUserData.EmpCode)
        }
      )
    $('#switchEmpDialog').modal('hide')

  }
  //切換人員尾

  setMenu(EmpID: string) {
    this.GetApiDataServiceService.getWebApiData_GetPageByEmp(EmpID)
      .pipe(takeWhile(() => this.api_subscribe))
      .subscribe(
        (GetPageByEmp: GetPageByEmpClass[]) => {
          this.two_nav = []
          var hasSwitchUser: boolean = false

          for (let i = 0; i < GetPageByEmp.length; i++) {
            this.two_nav.push({ largetitle: GetPageByEmp[i].Title, routeurl: GetPageByEmp[i].Url, site: [] })
            for (let oneSite of GetPageByEmp[i].site) {
              this.two_nav[i].site.push(
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

          this.IsHasSwitchUser = hasSwitchUser

          this.changeSencondTitle(this.router.url);

          if (!this.IsHasSwitchUser) {
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
                              this.two_nav.push({
                                largetitle: '系統管理', routeurl: null, site: [
                                  {
                                    routeurl: "SwitchUserComponent",
                                    title: "切換使用者"
                                  }]
                              })
                            } else {
                              var findSystemIndex = this.two_nav.findIndex((t: twonav) => {
                                return t.largetitle == '系統管理'
                              })
                              this.two_nav[findSystemIndex].site.push({
                                routeurl: "SwitchUserComponent",
                                title: "切換使用者"
                              })
                            }
                            this.IsHasSwitchUser = hasSwitchUser_FirstEmpCode
                          }
                        })
                  }
                })
          }
        }
      )
  }
  showSwitchEmpDialog: boolean = false
  bt_showSwitchEmpDialog() {
    this.showSwitchEmpDialog = true
    $("#switchEmpDialog").modal('show')
  }

  showLang = 'English'
  void_showLang() {
    var nowPathName = window.location.pathname
    var nowLangArray = nowPathName.split('/')
    var nowLang = ''
    for (let i = 0; i < nowLangArray.length; i++) {
      if (nowLangArray[i] == 'en' || nowLang[i] == 'zh') {
        nowLang = nowLangArray[i]
      }
    }
    if (nowLang == 'en') {
      this.showLang = '中文'
    } else if (nowLang == 'zh') {
      this.showLang = 'English'
    }
  }
  changeLang() {
    var nowPathName = window.location.pathname
    var nowLangArray = nowPathName.split('/')
    var goURL = this.LangCh(nowLangArray, nowPathName)
    // console.log(goURL)
    window.location.href = goURL  
  }
  LangCh(nowLangArray: Array<string>, nowPathName: string) {
    var nowOrigin = window.location.origin
    var returnGoURL = ''
    var changeURL = ''
    var nowLang = ''
    for (let i = 0; i < nowLangArray.length; i++) {
      if (nowLangArray[i] == 'en' || nowLangArray[i] == 'zh') {
        nowLang = nowLangArray[i]
      }
    }
    if (nowLang == 'en') {
      changeURL = nowPathName.replace('en', 'zh')
    } else if (nowLang == 'zh') {
      changeURL = nowPathName.replace('zh', 'en')
    }


    returnGoURL = nowOrigin + changeURL

    return returnGoURL
  }
}









