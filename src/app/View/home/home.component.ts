import { Component, OnInit, ViewChild, AfterViewInit, OnDestroy, } from '@angular/core';
import { Observable, from, BehaviorSubject } from 'rxjs';
import { fromEvent } from 'rxjs';
import { map, takeWhile, takeUntil, mergeMap, toArray, debounceTime } from 'rxjs/operators';
import { HttpClient, HttpResponse, HttpHeaders } from '@angular/common/http';
import { GetApiDataServiceService } from '../../Service/get-api-data-service.service'
import { isNgTemplate } from '@angular/compiler';
import { GetApiUserService } from 'src/app/Service/get-api-user.service';
import { GetNewsClass } from 'src/app/Models/PostData_API_Class/GetNewsClass';
import { formatDateTime, doFormatDate, getapi_formatTimetoString, doFormatDate_getMonthAndDay, timeZone_tw } from 'src/app/UseVoid/void_doFormatDate';
import { NgxSpinnerService } from 'ngx-spinner';
import { GetFlowSignRoleClass } from 'src/app/Models/GetFlowSignRoleClass';
import { AllformReview, dateArrayClass } from 'src/app/Models/AllformReview';
import { GetBaseInfoDetailClass } from 'src/app/Models/GetBaseInfoDetailClass';
import { GetAttendExceptionalByDeptClass } from 'src/app/Models/PostData_API_Class/GetAttendExceptionalByDeptClass';
import { GetAttendCalendarClass } from 'src/app/Models/PostData_API_Class/GetAttendCalendarClass';
import { chinesenum } from 'src/app/UseVoid/void_chinesenumber';
import { ShowVa } from 'src/app/Models/ShowVa';
import { AttendError } from 'src/app/Models/AttendError';
import { GetNewsByDateNowGetApiClass } from 'src/app/Models/PostData_API_Class/GetNewsByDateNowGetApiClass';
import { showUploadFileClass } from 'src/app/Models/showUploadFileClass';
import { FileDownloadService } from 'src/app/Service/file-download.service';
import { GetHoliDayBalanceFlow } from 'src/app/Models/PostData_API_Class/GetHoliDayBalanceFlow';
import { GetAttendCalendarSimplifyData } from 'src/app/Models/GetAttendCalendarSimplifyData';
import { vaSearchFlowSignClass } from 'src/app/Models/vaSearchFlowSignClass';
import { GetAbsDetailByDeptGetApiClass } from 'src/app/Models/PostData_API_Class/GetAbsDetailByDeptGetApiClass';
import { GetAbsDetailByListEmpIDGetApiClass } from 'src/app/Models/PostData_API_Class/GetAbsDetailByListEmpIDGetApiClass';
import { GetAbsDetailByListEmpIDDataClass } from 'src/app/Models/GetAbsDetailByListEmpIDDataClass';
import { showBalanceClass } from 'src/app/Models/showBalanceClass';
import { Router, NavigationEnd } from '@angular/router';
import { void_crossDay } from 'src/app/UseVoid/void_crossDay';
import { Location } from '@angular/common';
declare var $: any;
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit, AfterViewInit, OnDestroy {
  ngOnDestroy(): void {
    // throw new Error("Method not implemented.");
    this.api_subscribe = false;
    this.formEvent_WindowResize.unsubscribe()
  }
  api_subscribe = true; //ngOnDestroy時要取消訂閱api的subscribe

  showDeptaName = ''
  showTodayString = '' // YYYY/MM/DD
  showTodayDateString = ''// MM/DD
  showLastdayDateString = ''// MM/DD

  showAllHoliDayBalance: showBalanceClass[] = []

  showHoliDayBalanceDateE: showBalanceClass[] = [] //即將到期

  showMangerBlock: boolean = false //員工考勤異常、今日假人數區塊顯示

  EmpCode: string = ''

  navigationSubscription;
  constructor(private router: Router,
    private GetApiUserService: GetApiUserService,
    private GetApiDataServiceService: GetApiDataServiceService,
    private LoadingPage: NgxSpinnerService,
    private FileDownloadService: FileDownloadService,
    private location: Location) {
  }

  ngOnInit() {
    var today = new Date()
    var todayString = doFormatDate(today.toJSON().toString())

    today.setDate(today.getDate() - 1)
    var lastdayString = doFormatDate(today.toJSON().toString())

    this.showTodayDateString = doFormatDate_getMonthAndDay(todayString)
    this.showTodayString = todayString


    this.showLastdayDateString = doFormatDate_getMonthAndDay(lastdayString)

    this.GetApiUserService.counter$
      .pipe(takeWhile(() => this.api_subscribe))
      .subscribe(
        (x: any) => {
          if (x != 0) {
            // console.log(x)
            this.EmpCode = x.EmpID
            this.showDeptaName = x.DeptaName
            var intChiefCode = parseInt(x.ChiefCode)
            if (intChiefCode <= 4 || x.ChiefCode == '999' && x.PosType == 'M') {
              this.showMangerBlock = false
            } else {
              this.showMangerBlock = true
              this.showAbsDetailByDept(x)
              this.showAttendExceptionalByDept_Today(x)
              this.showAttendExceptionalByDept_Lastday(x)
            }

            this.showReviewCount(x.EmpID)
            this.showHoliDayBalance(x.EmpID)
            this.setWeekjobs(x)

          }
        }
      )
    this.showallnews();


  }
  slideConfig = {
    slidesToShow: 1,
    slidesToScroll: 1,
    dots: true,//顯示下方分頁的點
    infinite: false,//無窮
    speed: 300,
    centerMode: true,//置中
    variableWidth: true, //投影片寬度自己控制
    initialSlide: 3,
  }
  ngAfterViewInit(): void {
    // $(".slideblock").not('.slick-initialized').slick({
    //   slidesToShow: 7,
    //   slidesToScroll: 7,
    //   dots: false,//顯示下方分頁的點
    //   infinite: false,//無窮
    //   speed: 300,
    //   centerMode: false,//置中
    //   variableWidth: true, //投影片寬度自己控制
    //   responsive: [
    //     {
    //       breakpoint: 1900,
    //       settings: {
    //         slidesToShow: 1,
    //         slidesToScroll: 1,
    //         initialSlide: 3,//從第三頁開始
    //         dots: false,//顯示下方分頁的點
    //         infinite: false,//無窮
    //         speed: 300,
    //         centerMode: true,//置中
    //         variableWidth: true,//投影片寬度自己控制
    //       }
    //     }
    //   ]

    // }

    // )

    this.formEvent_WindowResize
    this.windowSize()

    // this.router.events
    //   .pipe(takeWhile(() => this.api_subscribe))
    //   .subscribe((e: any) => {
    //     // If it is a NavigationEnd event re-initalise the component
    //     if (e instanceof NavigationEnd) {
    //       this.ngOnInit()
    //     }
    //   });
  }


  formEvent_WindowResize = fromEvent(window, 'resize')
    //視窗大小改變時，修正width:800~1024的phonediv寬度及位置
    .pipe(debounceTime(0))
    .subscribe((event) => {
      this.windowSize()
    })

  windowSize() {
    if (window.innerWidth > 1860) {
      $('.slick-next.slick-arrow').css({ "display": "none" });
      $('.slick-prev.slick-arrow').css({ "display": "none" });
      $('.slick-dots').css({ "display": "none" });

    } else {
      $('.slick-next.slick-arrow').css({ "display": "block" });
      $('.slick-prev.slick-arrow').css({ "display": "block" });
      $('.slick-dots').css({ "display": "block" });
    }
  }

  ReviewCount: ReviewCountClass = {
    allCount: 0,
    vaCount: 0,
    delCount: 0,
    changeCount: 0,
    forgetCount: 0
  }
  showReviewCount(EmpID: string) {
    this.LoadingPage.show()
    var GetFlowSignRole: GetFlowSignRoleClass = {
      "SignEmpID": EmpID,
      "SignRoleID": "",
      "RealSignEmpID": "",
      "RealSignRoleID": "",
      "FlowTreeID": "",
      "SignDate": ""
    }
    this.GetApiDataServiceService.getWebApiData_GetFlowSignRole(GetFlowSignRole)
      .pipe(takeWhile(() => this.api_subscribe))
      .subscribe(
        (x: AllformReview[]) => {
          this.ReviewCount = {
            allCount: 0,
            vaCount: 0,
            delCount: 0,
            forgetCount: 0,
            changeCount: 0
          }
          if (x.length > 0) {
            for (let data of x) {
              this.ReviewCount.allCount += parseInt(data.Count)
              for (let ApiFlowSignForm of data.FlowSignForm) {
                if (ApiFlowSignForm.FormCode == 'Abs') {
                  //請假單
                  this.ReviewCount.vaCount += parseInt(ApiFlowSignForm.Count)

                } else if (ApiFlowSignForm.FormCode == 'Absc') {
                  //銷假單
                  this.ReviewCount.delCount += parseInt(ApiFlowSignForm.Count)

                } else if (ApiFlowSignForm.FormCode == 'Card') {
                  //調班單
                  this.ReviewCount.forgetCount += parseInt(ApiFlowSignForm.Count)

                } else if (ApiFlowSignForm.FormCode == 'ShiftRote') {
                  //忘刷單
                  this.ReviewCount.changeCount += parseInt(ApiFlowSignForm.Count)
                }
              }
            }
          }

          this.LoadingPage.hide()
        },
        error => {
          // alert('與api連線異常，getWebApiData_GetFlowSignRole')
          this.LoadingPage.hide()
        }
      )
  }


  AllNewsList: GetNewsClass[] = []
  showallnews() {

    var DateB = new Date()
    var GetNewsByDateNowGetApi: GetNewsByDateNowGetApiClass = {
      "DateNow": doFormatDate(DateB.toString()),
      "Miniature": true
    }
    this.GetApiDataServiceService.getWebApiData_GetNewsByDateNow(GetNewsByDateNowGetApi)
      .pipe(takeWhile(() => this.api_subscribe))
      .subscribe(
        (x: GetNewsClass[]) => {
          this.AllNewsList = []
          if (x.length != 0) {
            for (let data of x) {
              data.PostDate = formatDateTime(data.PostDate).getDate
            }
            // x.sort(
            //   function custom_sort(a, b) {
            //     return new Date(b.PostDate).getTime() - new Date(a.PostDate).getTime();
            //   })
            let fontlength = 50
            for (let oneNewList of x) {
              if (oneNewList.NewsHead.length > fontlength) {
                var title_slice = oneNewList.NewsHead.slice(0, fontlength)
                title_slice += '......';
                oneNewList.ShowNewsHead = title_slice;
              } else {
                oneNewList.ShowNewsHead = oneNewList.NewsHead
              }
            }
            if (x.length >= 5) {
              for (let i = 0; i < 5; i++) {
                this.AllNewsList.push(x[i])
              }
            } else {
              for (let data_news of x) {
                this.AllNewsList.push(data_news)
              }
            }

            // console.log(this.AllNewsList)
          }
          this.LoadingPage.hide()
        },
        error => {
          // alert('與api連線異常，getWebApiData_GetNewsByDateNow')
        }
      )
  }


  base64_NotFlow(upload: showUploadFileClass) {
    // console.log(upload)
    // this.LoadingPage.show()

    this.GetApiDataServiceService.getWebApiData_GetUploadFileByStreamOnly(upload.ServerName)
    // .pipe(takeWhile(() => this.api_subscribe))
    // .subscribe(
    //   (data: Array<any>) => {
    //     // console.log(data)
    //     // if (data) {
    //     //   if (data.length > 0) {
    //     //     this.FileDownloadService.base64(data[0])
    //     //   } else {
    //     //     alert('Not found file')
    //     //   }
    //     // } else {
    //     //   alert('Not found file')
    //     // }
    //     this.LoadingPage.hide()
    //   }
    //   , error => {
    //     this.LoadingPage.hide()
    //   }
    // )
  }

  TodayAttend: Array<any> = []
  showAttendExceptionalByDept_Today(GetBaseInfoDetail: GetBaseInfoDetailClass) {
    var GetAttendExceptionalByDept: GetAttendExceptionalByDeptClass = {
      DateB: this.showTodayString,
      DateE: this.showTodayString,
      DeptaID: GetBaseInfoDetail.DeptaID.toString()
    }
    this.GetApiDataServiceService.getWebApiData_GetAttendExceptionalByDept(GetAttendExceptionalByDept)
      .pipe(takeWhile(() => this.api_subscribe))
      .subscribe(
        (x: any) => {
          this.TodayAttend = x
        }, error => {
          // alert('與api連線異常,getWebApiData_GetAttendExceptionalByDept')
        }
      )
  }

  LastdayAttend: Array<any> = []
  showAttendExceptionalByDept_Lastday(GetBaseInfoDetail: GetBaseInfoDetailClass) {
    var today = new Date()
    today.setDate(today.getDate() - 1)
    var lastday = doFormatDate(today.toJSON().toString())

    var GetAttendExceptionalByDept: GetAttendExceptionalByDeptClass = {
      DateB: lastday,
      DateE: lastday,
      DeptaID: GetBaseInfoDetail.DeptaID.toString()
    }
    this.GetApiDataServiceService.getWebApiData_GetAttendExceptionalByDept(GetAttendExceptionalByDept)
      .pipe(takeWhile(() => this.api_subscribe))
      .subscribe(
        (x: any) => {
          this.LastdayAttend = x
        }, error => {
          // alert('與api連線異常,getWebApiData_GetAttendExceptionalByDept')
        }
      )
  }

  AllAbsEmp: showAllAbsEmpClass[] = []
  showAbsDetailByDept(GetBaseInfoDetail: GetBaseInfoDetailClass) {

    var GetAbsDetailByDept: GetAbsDetailByDeptGetApiClass = {
      DateB: this.showTodayString,
      DateE: this.showTodayString,
      DeptID: GetBaseInfoDetail.DeptID.toString()
    }
    // var GetAbsDetailByDept: GetAbsDetailByDeptClass = {
    //   DateB: "2018/12/11",
    //   DateE: "2018/12/11",
    //   DeptID: "3611"
    // }
    var allAbsSet = new Set();
    var allAbsMap = new Map();
    var showAllAbsEmp: showAllAbsEmpClass[] = []
    this.GetApiDataServiceService.getWebApiData_GetAbsDetailByDept(GetAbsDetailByDept)
      .pipe(takeWhile(() => this.api_subscribe))
      .subscribe(
        (y: Array<any>) => {
          // console.log(y)
          for (let data of y) {
            allAbsSet.add(data.EmpID)
          }
          allAbsSet.forEach(x => {
            var setArray = []
            for (let data of y) {
              if (data.EmpID == x) {
                setArray.push(data)
              }
            }
            allAbsMap.set(x, setArray)
          })
          allAbsMap.forEach(
            function logMapElements(value, key, map) {
              var c_AbsInf: AbsInf[] = []
              var c_EmpName = ''
              if (value[0].Base.EmpNameC.length > 0) {
                c_EmpName = value[0].Base.EmpNameC
              } else {
                c_EmpName = value[0].Base.EmpNameE
              }
              for (var o_val of value) {
                c_AbsInf.push({
                  startTime: getapi_formatTimetoString(formatDateTime(o_val.DateTimeB).getTime),
                  endTime: getapi_formatTimetoString(formatDateTime(o_val.DateTimeE).getTime),
                  holiday: o_val.HoliDay
                })
              }
              showAllAbsEmp.push({
                EmpID: key,
                EmpName: c_EmpName,
                AbsInf: c_AbsInf
              })
            }
          )
          // console.log(showAllAbsEmp)
          this.AllAbsEmp = showAllAbsEmp

          this.LoadingPage.hide()
        },
        error => {
          // alert('與api連線異常，getWebApiData_GetAbsDetailByDep')
          this.LoadingPage.hide()
        }
      )
  }

  weekjobs: weekjobs[] = [];

  setWeekjobs(GetBaseInfoDetail: GetBaseInfoDetailClass) {
    this.LoadingPage.show()
    var today = new Date()
    today.setDate(today.getDate() - 3)
    var searchDateA = today.getFullYear().toString() + '/' + (today.getMonth() + 1).toString() + '/' + today.getDate().toString()
    today.setDate(today.getDate() + 6)
    var searchDateB = today.getFullYear().toString() + '/' + (today.getMonth() + 1).toString() + '/' + today.getDate().toString()
    var GetAttendCalendar: GetAttendCalendarClass = {
      DateB: searchDateA,
      DateE: searchDateB,
      EmpID: GetBaseInfoDetail.EmpID
    }
    this.GetApiDataServiceService.getWebApiData_GetAttendCalendarSimplify(GetAttendCalendar)
      .pipe(takeWhile(() => this.api_subscribe))
      .subscribe(
        (x: GetAttendCalendarSimplifyData[]) => {
          // console.log(x)
          var weekjobs: weekjobs[] = []
          var calnum = 0
          var showNum = 0
          for (let data of x) {
            var daAtt = new Date(formatDateTime(data.AttendDate).getDate)
            // console.log(daAtt)
            var showWeekofDay = ''
            if (daAtt.getDay() == 0) {
              showWeekofDay = '日'
            } else {
              showWeekofDay = chinesenum(daAtt.getDay())
            }

            // console.log(showWeekofDay)
            var v_today = false
            var v_jobtime = ''
            var v_isVa = false
            var v_isAttend = false

            if (formatDateTime(data.AttendDate).getDate == this.showTodayString) {
              v_today = true
              showNum = calnum
            }

            if (data.Holiday) {
              //這天是否為放假
              v_jobtime = data.ActualRoteName
            } else {
              v_jobtime = getapi_formatTimetoString(void_crossDay(data.OnTime).EndTime) + '-' + getapi_formatTimetoString(void_crossDay(data.OffTime).EndTime)
            }


            if (data.Abs || data.AbsFlow) {
              //db 或 flow 有請假資料
              v_isVa = true
            } else {
              v_isVa = false
            }

            if (data.AttendExceptional) {
              v_isAttend = true
            } else {
              v_isAttend = false
            }

            weekjobs.push({
              realdate: formatDateTime(data.AttendDate).getDate,
              date: doFormatDate_getMonthAndDay(formatDateTime(data.AttendDate).getDate) + '(' + showWeekofDay + ')',
              jobtime: v_jobtime,
              isVa: v_isVa,
              isAttend: v_isAttend,
              today: v_today,
            })
            calnum = calnum + 1;
          }

          this.weekjobs = JSON.parse(JSON.stringify(weekjobs));

          this.slideConfig.initialSlide = showNum

          this.LoadingPage.hide()
        },
        error => {
          this.LoadingPage.hide()
        }
      )
  }
  showOneNew: GetNewsClass = new GetNewsClass()
  goToNewsPage(oneNews: GetNewsClass) {
    // console.log(oneNews)
    this.showOneNew = oneNews
    // this.router.navigate([`/nav/NewsShowDetailComponent/${oneNews.NewsID}`]);
    // [routerLink]="['/nav/NewsShowDetailComponent/'+oneNews.NewsID]"
  }

  showHoliDayBalance(EmpID: string) {
    this.LoadingPage.show()
    var GetHoliDayBalanceFlow: GetHoliDayBalanceFlow = {
      EmpID: EmpID,
      DateB: doFormatDate(new Date()),
      DateE: doFormatDate(new Date()),
      HoliDayID: 0,
      KeyName: "",
      EventDate: "",
      ListAbsFlow: null
    }

    this.GetApiDataServiceService.getWebApiData_GetHoliDayBalanceFlow(GetHoliDayBalanceFlow)
      .pipe(takeWhile(() => this.api_subscribe))
      .subscribe((x: any) => {


        var showBalance = []
        this.showAllHoliDayBalance = []
        this.showHoliDayBalanceDateE = []
        var _showHoliDayBalanceDateE = []
        for (let data of x) {
          // if (data.Sort > 0) {
          //要顯示
          showBalance.push(data)
          // }
        }

        //計算日時分
        for (let oneHoliday of showBalance) {
          //45天內的多筆剩餘時數加總
          var calRestAmount = {
            Day: 0,
            Hour: 0,
            Minute: 0
          }
          if (oneHoliday.AbsAddition.length > 0) {
            for (let oneAbsAddition of oneHoliday.AbsAddition) {
              var today: any = new Date()
              var DateE: any = new Date(oneAbsAddition.DateE) //失效日
              var DateLarge: boolean = true
              var calDate = 0
              if (today > DateE) {
                DateLarge = false
              } else {
                calDate = (DateE - today) / (24 * 60 * 60 * 1000)
              }
              if (calDate < 45 && DateLarge) {
                var setDay = 0
                var setHour = 0
                var setMinute = 0
                if (oneAbsAddition.RestAmountDayHourMinute) {
                  setDay = oneAbsAddition.RestAmountDayHourMinute.Day
                  setHour = oneAbsAddition.RestAmountDayHourMinute.Hour
                  setMinute = oneAbsAddition.RestAmountDayHourMinute.Minute
                }
                calRestAmount.Day += setDay
                calRestAmount.Hour += setHour
                calRestAmount.Minute += setMinute

              }
            }
            if (calRestAmount) {
              if (calRestAmount.Day > 0 || calRestAmount.Hour > 0 || calRestAmount.Minute > 0) {
                _showHoliDayBalanceDateE.push({
                  HoliDayKindNameC: oneHoliday.HoliDayKindNameC,
                  Balance: 0,
                  Sort: oneHoliday.Sort,
                  useday: calRestAmount.Day.toString(),
                  usehour: calRestAmount.Hour.toString(),
                  useminute: calRestAmount.Minute.toString()
                })
              }
            }
          }
        }

        for (let a of _showHoliDayBalanceDateE) {
          if (a.Sort > 0) {
            this.showHoliDayBalanceDateE.push({
              HoliDayKindNameC: a.HoliDayKindNameC,
              Balance: 0,
              Sort: a.Sort,
              useday: a.useday.toString(),
              usehour: a.usehour.toString(),
              useminute: a.useminute.toString()
            })
          }
        }
        //計算日時分
        for (let oneBalance of showBalance) {
          //001國內補休、002特休、053福利補休
          if (oneBalance.HoliDayKindCode == '001' || oneBalance.HoliDayKindCode == '002' || oneBalance.HoliDayKindCode == '053')
            if (oneBalance.BalanceRealDayHourMinute) {
              this.showAllHoliDayBalance.push({
                HoliDayKindNameC: oneBalance.HoliDayKindNameC,
                Balance: oneBalance.Balance,
                Sort: oneBalance.Sort,
                useday: oneBalance.BalanceRealDayHourMinute.Day.toString(),
                usehour: oneBalance.BalanceRealDayHourMinute.Hour.toString(),
                useminute: oneBalance.BalanceRealDayHourMinute.Minute.toString()
              })
            }
        }

        this.LoadingPage.hide()
      }, error => {
        this.LoadingPage.hide()
        // alert('與api連線異常，getWebApiData_GetHoliDayBalance')
      });

  }

  showContentClass(weekjob) {
    // console.log(weekjob)
    var lastday = new Date()
    lastday.setDate(lastday.getDate() + 3)
    if (weekjob.realdate == formatDateTime(lastday).getDate) {
      return "weekdatecontent_lastday"
    } else {
      return "weekdatecontent"
    }
  }
  showTitleClass(weekjob) {
    // console.log(weekjob)
    var lastday = new Date()
    lastday.setDate(lastday.getDate() + 3)
    if (weekjob.realdate == formatDateTime(lastday).getDate) {
      return "weekdate_lastday"
    } else {
      return "weekdate"
    }
  }

  //查詢請假單

  vaSearchFlowSign: vaSearchFlowSignClass[] = []; //近期假單


  ShowVa: ShowVa[] = []
  SearchAttendDate: string = ''

  vaClick(YearMonthDday, EmpID) {
    // alert('請假單:' + YearMonthDday + ' ' + EmpID)
    this.SearchAttendDate = YearMonthDday
    var GetAbsDetailByListEmpIDGetApi: GetAbsDetailByListEmpIDGetApiClass = {
      "DateB": YearMonthDday,
      "DateE": YearMonthDday,
      "ListEmpID": [
        EmpID
      ]
    }
    this.LoadingPage.show()

    this.GetApiDataServiceService.getWebApiData_GetAbsDetailByListEmpID(GetAbsDetailByListEmpIDGetApi)
      .pipe(takeWhile(() => this.api_subscribe))
      .subscribe(
        (GetAbsDetailByListEmpIDData: GetAbsDetailByListEmpIDDataClass[]) => {
          this.ShowVa = []
          for (let data of GetAbsDetailByListEmpIDData) {
            var setDay = 0
            var setHour = 0
            var setMin = 0
            //計算日時分

            setDay = data.UseDayHourMinute.Day
            setHour = data.UseDayHourMinute.Hour
            setMin = data.UseDayHourMinute.Minute

            this.ShowVa.push({
              State: data.State,
              DateTimeB: data.DateTimeB,
              DateTimeE: data.DateTimeE,
              SignDate: data.CreatDate,
              HoliDayNameC: data.HoliDay.HoliDayNameC,
              Use: data.Use,

              showDateB: formatDateTime(data.DateTimeB).getDate,
              showDateE: formatDateTime(data.DateTimeE).getDate,
              showTimeB: getapi_formatTimetoString(formatDateTime(data.DateTimeB).getTime),
              showTimeE: getapi_formatTimetoString(formatDateTime(data.DateTimeE).getTime),
              showSignDate: formatDateTime(data.CreatDate).getDate,
              showSignTime: getapi_formatTimetoString(formatDateTime(data.CreatDate).getTime),
              day: setDay.toString(),
              hour: setHour.toString(),
              minute: setMin.toString()
            })
          }
          this.LoadingPage.hide()
          $('#RecentHoliday').modal('show')
        }, error => {
          this.LoadingPage.hide()
        }
      )
  }

  showDay(i) {
    return chinesenum(i + 1)
  }

  //考勤異常查詢

  AttendanceApiData: AttendError[] = []
  AtterrorClick(YearMonthDay) {
    // alert('出勤:' + YearMonthDay + ' ' + EmpID)
    var today = new Date
    var GetAttendInfoClass = {
      DateB: YearMonthDay,
      DateE: YearMonthDay,
      ListEmpID: [this.EmpCode],
      EffectDate: doFormatDate(today),
      Display: "1",
      ListState: ["1", "2", "3"]
    }
    this.LoadingPage.show()
    this.GetApiDataServiceService.getWebApiData_GetAttendInfo(GetAttendInfoClass)
      .pipe(takeWhile(() => this.api_subscribe))
      .subscribe(
        (x: AttendError[]) => {
          this.AttendanceApiData = []
          this.AttendanceApiData = x
          this.SearchAttendDate = formatDateTime(this.AttendanceApiData[0].AttendDate).getDate
          this.AttendanceApiData[0].AttendDate = formatDateTime(this.AttendanceApiData[0].AttendDate).getDate
          for (let AttendDate of this.AttendanceApiData) {
            AttendDate.ActualRote_OnTime_calCrossDay = void_crossDay(AttendDate.OnTime).isCrossDay
            AttendDate.ActualRote_OffTime_calCrossDay = void_crossDay(AttendDate.OffTime).isCrossDay

            AttendDate.AttendCard_OnTime_calCrossDay = void_crossDay(AttendDate.OnCardTime).isCrossDay
            AttendDate.AttendCard_OffTime_calCrossDay = void_crossDay(AttendDate.OffCardTime).isCrossDay
            AttendDate.OnTime = getapi_formatTimetoString(void_crossDay(AttendDate.OnTime).EndTime)
            AttendDate.OffTime = getapi_formatTimetoString(void_crossDay(AttendDate.OffTime).EndTime)
            AttendDate.OnCardTime = getapi_formatTimetoString(void_crossDay(AttendDate.OnCardTime).EndTime)
            AttendDate.OffCardTime = getapi_formatTimetoString(void_crossDay(AttendDate.OffCardTime).EndTime)
          }
          this.LoadingPage.hide()
          $('#AttendanceError').modal('show')
        },
        error => {
          // alert('與api連線異常，getWebApiData_GetAttendInfo')
          this.LoadingPage.hide()
        }
      )

  }

  RedAttendString_Title(e: boolean, b: boolean) {
    if (e || b) {
      return '#d0021b'
    } else {
      return 'rgb(150, 149, 148)'
    }
  }
  RedAttendString_Content(e: boolean, b: boolean) {
    if (e || b) {
      return '#d0021b'
    } else {
      return '#4c4c4c'
    }
  }


}
class weekjobs {
  realdate: string;
  date: string;
  jobtime: string;
  today: boolean;
  isVa: boolean;
  isAttend: boolean;
}


class ReviewCountClass {
  allCount: number;
  vaCount: number;
  delCount: number;
  changeCount: number;
  forgetCount: number;
}


class showAllAbsEmpClass {
  EmpID: string
  EmpName: string
  AbsInf: Array<AbsInf>
}

class AbsInf {
  startTime: string
  endTime: string
  holiday: any
}
