import { Component, OnInit, Output, EventEmitter, Input, OnDestroy } from '@angular/core';
import { GetApiUserService } from 'src/app/Service/get-api-user.service';
import { GetDeptaByEmpClass } from 'src/app/Models/PostData_API_Class/GetDeptaByEmpClass';
import { GetApiDataServiceService } from 'src/app/Service/get-api-data-service.service';
import { takeWhile } from 'rxjs/operators';
import { GetBaseByFormDeptGetApiClass } from 'src/app/Models/PostData_API_Class/GetBaseByFormDeptGetApiClass';
import { doFormatDate } from 'src/app/UseVoid/void_doFormatDate';
declare var $;

@Component({
  selector: 'app-serchkeybaselevel',
  templateUrl: './serchkeybaselevel.component.html',
  styleUrls: ['./serchkeybaselevel.component.css']
})
export class SerchkeybaselevelComponent implements OnInit, OnDestroy {
  ngOnDestroy(): void {
    // throw new Error("Method not implemented.");
    this.api_subscribe = false;
  }
  api_subscribe = true

  @Input() proxyLockID_keysearch: string = '';
  @Input() systemID: string
  @Input() IsTop: boolean = false

  base = []
  searchVal: any;//搜尋條件
  errorState = { show: false, errorString: '' }
  api_sendEmpCode = '' //測試工號
  constructor(private httpPostService: GetApiDataServiceService, private GetApiUserService: GetApiUserService) {
  }

  ngOnInit() {
    if (this.systemID) {
      this.api_sendEmpCode = this.systemID
    } else {
      this.GetApiUserService.counter$.subscribe(x => {
        this.api_sendEmpCode = x.EmpCode
      })
    }
  }

  boolCanSearch: boolean = true
  search(searchVal) {
    // console.log(searchVal.length)
    this.errorState.show = false;
    this.base = []

    if (searchVal) {
      if (searchVal.length >= 2) {
        if (this.boolCanSearch) {


          this.boolCanSearch = false

          var _NowDate = new Date();
          var _NowToday = doFormatDate(_NowDate);

          var GetDeptaByEmpClass: GetDeptaByEmpClass = {
            EmpCode: this.api_sendEmpCode,
            DeptID: 0,
            Level: 9,
            DeptNameKey: '',
            EmpCodeOrNameKey: searchVal,
            EffectDate: _NowToday,
            IsTop: this.IsTop
          }
          this.httpPostService.getWebApiData_GetDeptaByEmpLevel(GetDeptaByEmpClass)
            .pipe(takeWhile(() => this.api_subscribe))
            .subscribe((x: any) => {
              if (x.length > 0) {
                this.pushBase(x);
                if (this.base.length != 0) {
                } else {

                  var _NowDate = new Date();
                  var _NowToday = doFormatDate(_NowDate);

                  var GetDeptaByEmpClass: GetDeptaByEmpClass = {
                    EmpCode: this.api_sendEmpCode,
                    DeptID: 0,
                    Level: 9,
                    DeptNameKey: searchVal,
                    EmpCodeOrNameKey: '',
                    EffectDate: _NowToday,
                    IsTop: this.IsTop
                  }
                  this.httpPostService.getWebApiData_GetDeptaByEmpLevel(GetDeptaByEmpClass)
                    .pipe(takeWhile(() => this.api_subscribe))
                    .subscribe((y: any) => {
                      if (y.length > 0) {
                        this.pushBase(y);
                        if (this.base.length == 0) {
                          // alert('此條件查不到員工')

                          var _NowDate = new Date();
                          var _NowToday = doFormatDate(_NowDate);

                          var GetBaseByFormDeptGetApi: GetBaseByFormDeptGetApiClass = {
                            "EmpCode": this.api_sendEmpCode,
                            "Key": searchVal,
                            "EffectDate": _NowToday
                          }
                          this.httpPostService.getWebApiData_GetBaseByFormEmp(GetBaseByFormDeptGetApi)
                            .pipe(takeWhile(() => this.api_subscribe))
                            .subscribe((y: any) => {

                              this.base = [];
                              if (y) {
                                if (y.length > 0) {
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
                        // console.log(y)
                      } else {
                        // alert('此條件查不到員工!!')

                        var _NowDate = new Date();
                        var _NowToday = doFormatDate(_NowDate);

                        var GetBaseByFormDeptGetApi: GetBaseByFormDeptGetApiClass = {
                          "EmpCode": this.api_sendEmpCode,
                          "Key": searchVal,
                          "EffectDate": _NowToday
                        }
                        this.httpPostService.getWebApiData_GetBaseByFormEmp(GetBaseByFormDeptGetApi)
                          .pipe(takeWhile(() => this.api_subscribe))
                          .subscribe((y: any) => {

                            this.base = [];
                            if (y) {
                              if (y.length > 0) {
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


  @Output() click_saveEmptoView: EventEmitter<any> = new EventEmitter<any>();//選到的員工回傳
  onClick(base) {
    var baseIdandName = base.EmpCode + '，' + base.EmpNameC
    this.click_saveEmptoView.emit(baseIdandName)
  }


}

