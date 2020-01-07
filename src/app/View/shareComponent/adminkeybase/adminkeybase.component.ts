import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { GetApiDataServiceService } from 'src/app/Service/get-api-data-service.service';
import { takeWhile } from 'rxjs/operators';
import { CaUserClass } from 'src/app/Models/CaUserClass';
import { doFormatDate } from 'src/app/UseVoid/void_doFormatDate';
import { GetDeptaByEmpClass, GetDeptaByEmpTTClass } from 'src/app/Models/PostData_API_Class/GetDeptaByEmpClass';
import { GetBaseByFormDeptGetApiClass } from 'src/app/Models/PostData_API_Class/GetBaseByFormDeptGetApiClass';
import { baseArrayClass } from 'src/app/Models/baseArrayClass';
import { GetIdentityByEmpIDDataClass } from 'src/app/Models/GetIdentityByEmpIDDataClass';
import { GetIdentityByEmpIDClass } from 'src/app/Models/PostData_API_Class/GetIdentityByEmpIDClass';
import { void_ReGoLoginPage, void_LogoutPage } from 'src/app/UseVoid/void_goLoginPage';
import { IsLoginPassGetApiClass } from 'src/app/Models/PostData_API_Class/IsLoginPassGetApiClass';
import { IsLoginPassDataClass } from 'src/app/Models/IsLoginPassDataClass';
import { Router } from '@angular/router';
import { ErrorStateService } from 'src/app/Service/error-state.service';
import { NgxSpinnerService } from 'ngx-spinner';

declare let $: any; //use jquery

@Component({
  selector: 'app-adminkeybase',
  templateUrl: './adminkeybase.component.html',
  styleUrls: ['./adminkeybase.component.css']
})
export class AdminkeybaseComponent implements OnInit, OnDestroy {
  ngOnDestroy(): void {
    // throw new Error("Method not implemented.");
    this.api_subscribe = false;
  }
  api_subscribe = true

  @Input() proxyLockID_keysearch: string = '';
  @Input() systemID: string
  @Input() IsTop: boolean = false  //是否最大權限

  base = []
  searchVal: any;//搜尋條件
  errorState = { show: false, errorString: '' }
  api_sendEmpCode = '' //測試工號
  constructor(private route: Router,
    private ErrorStateService: ErrorStateService,
    private LoadingPage: NgxSpinnerService,
    private GetApiDataServiceService: GetApiDataServiceService) {
  }

  ngOnInit() {
    if (this.systemID) {
      this.api_sendEmpCode = this.systemID
    } else {
      // this.GetApiUserService.counter$.subscribe(x => {
      //   this.api_sendEmpCode = x.EmpCode
      // })
      this.LoadingPage.show()
      this.GetApiDataServiceService.getWebApiData_GetAuthToken()
        .pipe(takeWhile(() => this.api_subscribe))
        .subscribe(
          (x: CaUserClass) => {
            if (x) {
              this.api_sendEmpCode = x.EmpID.toString()
            }else{
              
            }
            this.LoadingPage.hide()
          })
    }

  }

  boolCanSearch: boolean = true
  search(searchVal: string) {
    // console.log(searchVal.length)
    this.errorState.show = false;
    this.base = []
    searchVal = searchVal.trim()
    if (searchVal) {
      if (searchVal.length >= 2) {
        if (this.boolCanSearch) {


          this.boolCanSearch = false

          var _NowDate = new Date();
          var _NowToday = doFormatDate(_NowDate);

          var GetDeptaByEmp: GetDeptaByEmpTTClass = {
            EmpCode: this.api_sendEmpCode,
            DeptID: "",
            Level: 9,
            DeptNameKey: '',
            EmpCodeOrNameKey: searchVal,
            EffectDate: _NowToday,
            IsTop: this.IsTop,
            IsShift:false
          }
          this.GetApiDataServiceService.getWebApiData_GetDeptaByEmp(GetDeptaByEmp)
            .pipe(takeWhile(() => this.api_subscribe))
            .subscribe((x: any) => {
              if (x.length > 0) {
                this.pushBase(x);
                if (this.base.length != 0) {
                } else {

                  var _NowDate = new Date();
                  var _NowToday = doFormatDate(_NowDate);

                  var GetDeptaByEmpC: GetDeptaByEmpTTClass = {
                    EmpCode: this.api_sendEmpCode,
                    DeptID: "",
                    Level: 9,
                    DeptNameKey: searchVal,
                    EmpCodeOrNameKey: '',
                    EffectDate: _NowToday,
                    IsTop: this.IsTop,
                    IsShift:false
                  }
                  this.GetApiDataServiceService.getWebApiData_GetDeptaByEmp(GetDeptaByEmpC)
                    .pipe(takeWhile(() => this.api_subscribe))
                    .subscribe((y: any) => {
                      if (y.length > 0) {
                        this.pushBase(y);
                        if (this.base.length == 0) {
                          // alert('此條件查不到員工')
                          this.AssKeySearch_BaseAndDept(searchVal, _NowToday)
                        }
                        // console.log(y)
                      } else {
                        // alert('此條件查不到員工!!')
                        this.AssKeySearch_BaseAndDept(searchVal, _NowToday)
                      }
                    })
                }
                this.boolCanSearch = true
              }
            }, error => {
              this.boolCanSearch = true
            })
        }
      } else {
        // alert('請輸入2個字元以上')
        this.errorState.show = true;
        this.errorState.errorString = '請輸入2個字元以上'
      }
    }
    else {
      // alert('請不要空白')
      this.errorState.show = true;
      this.errorState.errorString = '請不要空白'
    }
  }
  pushBase(x) {
    for (let i = 0; i < x.length; i++) {
      if (x[i].Dept.length > 0) {
        for (let k = 0; k < x[i].Dept.length; k++) {
          if (x[i].Dept[k].Base.length > 0) {
            for (let u = 0; u < x[i].Dept[k].Base.length; u++) {
              if (x[i].Dept[k].Base[u].EmpNameC == null) {
                if (x[i].Dept[k].Base[u].EmpCode == this.proxyLockID_keysearch) {
                  //選擇代理人的語法，不要讓他選到自己
                } else {
                  this.base.push({ Dept: x[i].Dept[k].DeptNameC, ParentName: x[i].Dept[k].ParentName, EmpCode: x[i].Dept[k].Base[u].EmpCode, EmpNameC: x[i].Dept[k].Base[u].EmpNameE })
                }
              } else {
                if (x[i].Dept[k].Base[u].EmpCode == this.proxyLockID_keysearch) {
                  //選擇代理人的語法，不要讓他選到自己
                } else {
                  if (x[i].Dept[k].Base[u].EmpNameC.length == 0) {
                    this.base.push({ Dept: x[i].Dept[k].DeptNameC, ParentName: x[i].Dept[k].ParentName, EmpCode: x[i].Dept[k].Base[u].EmpCode, EmpNameC: x[i].Dept[k].Base[u].EmpNameE })
                  } else {
                    this.base.push({ Dept: x[i].Dept[k].DeptNameC, ParentName: x[i].Dept[k].ParentName, EmpCode: x[i].Dept[k].Base[u].EmpCode, EmpNameC: x[i].Dept[k].Base[u].EmpNameC })
                  }
                }
              }
            }
          }
        }
      }
    }
  }

  AssKeySearch_BaseAndDept(searchVal, _NowToday) {
    //行政關鍵字查詢-員工>部門模糊查詢

    var GetBaseByFormDeptGetApi: GetBaseByFormDeptGetApiClass = {
      "EmpCode": this.api_sendEmpCode,
      "Key": searchVal,
      "EffectDate": _NowToday
    }
    this.GetApiDataServiceService.getWebApiData_GetBaseByFormEmp(GetBaseByFormDeptGetApi)
      .pipe(takeWhile(() => this.api_subscribe))
      .subscribe((y: any) => {

        this.base = [];
        if (y) {
          if (y.length > 0) {
            this.errorState = { show: false, errorString: '' }
            for (let data of y) {
              this.base.push({
                Dept: data.DeptaName,
                ParentName: data.ParentDeptaName,
                EmpCode: data.EmpCode,
                EmpNameC: data.EmpNameC
              })
            }
          } else {
            // this.errorState = { show: true, errorString: '無此員工或無權限' }
            this.AssKeySearch_Dept(searchVal, _NowToday)
          }
        } else {
          // this.errorState = { show: true, errorString: '無此員工或無權限' }
          this.AssKeySearch_Dept(searchVal, _NowToday)
        }

      })
  }
  AssKeySearch_Dept(searchVal, _NowToday) {
    //行政關鍵字查詢-部門

    var GetBaseByFormDeptGetApi: GetBaseByFormDeptGetApiClass = {
      "EmpCode": this.api_sendEmpCode,
      "Key": searchVal,
      "EffectDate": _NowToday
    }
    this.GetApiDataServiceService.getWebApiData_GetBaseByFormEmp(GetBaseByFormDeptGetApi)
      .pipe(takeWhile(() => this.api_subscribe))
      .subscribe((y: any) => {

        this.base = [];
        if (y) {
          if (y.length > 0) {
            this.errorState = { show: false, errorString: '' }
            for (let data of y) {
              this.base.push({
                Dept: data.DeptaName,
                ParentName: data.ParentDeptaName,
                EmpCode: data.EmpCode,
                EmpNameC: data.EmpNameC
              })
            }
          } else {
            this.errorState = { show: true, errorString: '無此員工或無權限' }
          }
        } else {
          this.errorState = { show: true, errorString: '無此員工或無權限' }
        }

      })
  }
  @Output() click_saveEmptoView: EventEmitter<any> = new EventEmitter<any>();//選到的員工回傳
  onClick(base: baseArrayClass) {

    var _NowDate = new Date();
    var _NowToday = doFormatDate(_NowDate);
    var IsLoginPassGetApi: IsLoginPassGetApiClass = {
      "EmpID": base.EmpCode,
      "EffectDate": _NowToday
    }
    this.GetApiDataServiceService.getWebApiData_IsLoginPass(IsLoginPassGetApi)
      .pipe(takeWhile(() => this.api_subscribe))
      .subscribe(
        (IsLoginPassData: IsLoginPassDataClass) => {
          if (IsLoginPassData.Pass) {
            this.click_saveEmptoView.emit(base)
          } else {
            alert(IsLoginPassData.MessageContent)
            $('#switchEmpDialog').modal('hide') // 勿刪，在切換腳色時遇到沒有員別導登出頁時，要把dialog隱藏
            this.ErrorStateService.errorState = 1
            this.route.navigateByUrl('/ErrorPageComponent')
          }
        }, error => {
        })
  }


}


