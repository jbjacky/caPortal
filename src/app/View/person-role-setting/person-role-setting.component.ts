import { Component, OnInit, OnDestroy } from '@angular/core';
import { GetDeptDataClass } from 'src/app/Models/GetDeptDataClass';
import { GetDeptGetApiClass } from 'src/app/Models/PostData_API_Class/GetDeptGetApiClass';
import { GetApiDataServiceService } from 'src/app/Service/get-api-data-service.service';
import { GetApiUserService } from 'src/app/Service/get-api-user.service';
import { takeWhile, mergeMap, map, toArray } from 'rxjs/operators';
import { SetDeptByEmpGetApiClass } from 'src/app/Models/PostData_API_Class/SetDeptByEmpGetApiClass';
import { GetAssistantByDeptIDDataClass } from 'src/app/Models/GetAssistantByDeptIDDataClass';
import { NgxSpinnerService } from 'ngx-spinner';
import { from } from 'rxjs';
import { GetRoleByAuthDataClass } from 'src/app/Models/GetRoleByAuthDataClass';
import { GetAllRoleDataClass } from 'src/app/Models/GetAllRoleDataClass';
import { GetBaseByListDeptIDGetApiClass } from 'src/app/Models/PostData_API_Class/GetBaseByListDeptIDGetApiClass';
import { SetRoleGetApiClass } from 'src/app/Models/PostData_API_Class/SetRoleGetApiClass';
import { ITreeState, ITreeOptions } from 'angular-tree-component';
import { nodeClass } from 'src/app/Models/nodeClass';
import { GetBaseInfoDetailClass } from 'src/app/Models/GetBaseInfoDetailClass';
import { doFormatDate } from 'src/app/UseVoid/void_doFormatDate';

declare let $: any; //use jquery

@Component({
  selector: 'app-person-role-setting',
  templateUrl: './person-role-setting.component.html',
  styleUrls: ['./person-role-setting.component.css']
})
export class PersonRoleSettingComponent implements OnInit, OnDestroy {
  ngOnDestroy(): void {
    // throw new Error("Method not implemented.");
    this.api_subscribe = false;
  }
  api_subscribe = true

  NgxBaseSelectBox: GetDeptDataClass[] = []
  NgxDeptSelectBox: GetDeptDataClass[] = []
  SearchDeptID: number
  constructor(private GetApiDataServiceService: GetApiDataServiceService,
    private GetApiUserService: GetApiUserService,
    private LoadingPage: NgxSpinnerService) { }

  setMan = { EmpCode: '', EmpName: '' }

  searchEmpID: string

  ngOnInit() {
    this.GetApiUserService.counter$.subscribe(
      (x: any) => {
        if (x == 0) {

        } else {
          this.setMan = {
            EmpCode: x.EmpCode,
            EmpName: x.EmpNameC
          }
          this.LoadingPage.show()

          this.GetApiDataServiceService.getWebApiData_GetDeptsByEmp(this.setMan.EmpCode)
            .pipe(takeWhile(() => this.api_subscribe))
            .subscribe(
              (GetDeptData: GetDeptDataClass[]) => {
                if (GetDeptData.length > 0) {
                  this.NgxBaseSelectBox = GetDeptData
                  for (let data of this.NgxBaseSelectBox) {
                    data.uiShowDeptCodeAndName = data.DeptCode + ' ' + data.DeptNameC
                  }
                  this.SearchDeptID = this.NgxBaseSelectBox[0].DeptID

                  this.NgxDeptSelectBox = GetDeptData
                  for (let data of this.NgxDeptSelectBox) {
                    data.uiShowDeptCodeAndName = data.DeptCode + ' ' + data.DeptNameC
                  }

                  this.LoadData()

                }

                this.LoadingPage.hide()
              }, error => {

                this.LoadingPage.hide()
              }
            )
        }
      }
    )

  }

  SetDeptManData: GetAssistantByDeptIDDataClass[] = []
  showDeptManRoleData: showDeptManRoleDataClass[] = []
  LoadData() {
    this.LoadingPage.show();
    this.GetApiDataServiceService.getWebApiData_GetRoleByAuth(this.setMan.EmpCode)
      .pipe(mergeMap((d: GetRoleByAuthDataClass[]) =>

        this.GetApiDataServiceService.getWebApiData_GetAllRole()
          .pipe(
            map(
              (GetAllRoleData: GetAllRoleDataClass[]) => {
                var _NowDate = new Date();
                var _NowToday = doFormatDate(_NowDate);
                var GetBaseByListDeptIDGetApi: GetBaseByListDeptIDGetApiClass = {
                  ListDeptID: [this.SearchDeptID.toString()],
                  EffectDate: _NowToday
                }
                return { GetBaseByListDeptIDGetApi: GetBaseByListDeptIDGetApi, GetAllRoleData: GetAllRoleData }
              }
            ),
            mergeMap((a: any) => this.GetApiDataServiceService.getWebApiData_GetBaseByListDeptID(a.GetBaseByListDeptIDGetApi)
              .pipe(
                mergeMap((w: GetAssistantByDeptIDDataClass[]) => from(w)),
                mergeMap((y: GetAssistantByDeptIDDataClass) => this.GetApiDataServiceService.getWebApiData_GetRoleByAuth(y.EmpCode).pipe(
                  map((z: GetRoleByAuthDataClass[]) => {
                    var setShowData: showDeptManRoleDataClass = {
                      GetAssistantByDeptIDData: y,
                      GetRoleByAuth: z,
                      GetAllRoleData: a.GetAllRoleData,
                      SearchManGetRoleByAuth: d
                    }
                    return setShowData
                  }
                  ))
                ),
                toArray())
            )
          )
      ))
      .pipe(takeWhile(() => this.api_subscribe))
      .subscribe(
        (x: showDeptManRoleDataClass[]) => {
          // console.log(x)
          var datas = JSON.parse(JSON.stringify(x))
          for (let data of datas) {
            var minLevel = Math.min.apply(null, data.SearchManGetRoleByAuth.map(function (o) {
              return o.Level;
            }))//最大層級-左上角人員可搜尋的最大層級
            // console.log(minLevel)
            var minLevelDisabalAnotherData = []//取得最大層級的所有角色
            for (let oneSearchManGetRoleByAuth of data.SearchManGetRoleByAuth) {
              if (oneSearchManGetRoleByAuth.Level == minLevel) {
                minLevelDisabalAnotherData.push(oneSearchManGetRoleByAuth)
              }
            }

            for (let oneAllRoleData of data.GetAllRoleData) {
              oneAllRoleData.uiIsCheck = false
              oneAllRoleData.uiIsDisabled = false
              for (let oneRoleByAuth of data.GetRoleByAuth) {

                if (oneAllRoleData.RoleCode == oneRoleByAuth.RoleCode) {
                  oneAllRoleData.uiIsCheck = true
                }

                if (oneAllRoleData.Level < minLevel) {
                  //如果左上角人員的最大層級小於資料內的層級
                  oneAllRoleData.uiIsDisabled = true
                } else if (oneAllRoleData.Level == minLevel) {

                  var found = minLevelDisabalAnotherData.find(function (element) {
                    if (element.RoleCode == oneAllRoleData.RoleCode) {
                      return true;
                    } else {
                      return false;
                    }
                  });

                  if (!found) {

                    oneAllRoleData.uiIsDisabled = true
                  }
                }

              }
            }
          }

          this.showDeptManRoleData = JSON.parse(JSON.stringify(datas));

          this.LoadingPage.hide();
        }, error => {
          this.LoadingPage.hide();
        }
      )
  }

  onSelectChange() {
    this.LoadData()
  }

  bt_search() {
    this.LoadingPage.show();
    this.GetApiDataServiceService.getWebApiData_GetBaseInfoDetail(this.searchEmpID)
      .pipe(
        mergeMap(
          (GetBaseInfoDetail: GetBaseInfoDetailClass[]) => this.GetApiDataServiceService.getWebApiData_GetDeptsByEmp(this.setMan.EmpCode)
            .pipe(
              map((GetDeptData: GetDeptDataClass[]) => {
                // console.log(GetDeptData)
                // console.log(GetBaseInfoDetail)
                if (GetBaseInfoDetail.length > 0) {
                  var found = GetDeptData.find(function (element) {
                    return element.DeptID == GetBaseInfoDetail[0].DeptID;
                  });

                  if (typeof found === "undefined" || found === null) {
                    return false
                  } else {
                    return true
                  }
                } else {
                  alert('查無此工號')
                  return false
                }
              })
            )

        )
      )
      .subscribe(
        (isCanSearch: boolean) => {
          //取得查詢人的deptid與可被搜尋的deptid比較
          //如果相同表示搜尋的工號可被搜尋
          // console.log(isCanSearch)
          // isCanSearch = true
          if (isCanSearch) {

            this.GetApiDataServiceService.getWebApiData_GetRoleByAuth(this.setMan.EmpCode)
              .pipe(mergeMap((d: GetRoleByAuthDataClass[]) =>

                this.GetApiDataServiceService.getWebApiData_GetAllRole()
                  .pipe(
                    map(
                      (GetAllRoleData: GetAllRoleDataClass[]) => {
                        var _NowDate = new Date();
                        var _NowToday = doFormatDate(_NowDate);
                        var GetBaseByListDeptIDGetApi: GetBaseByListDeptIDGetApiClass = {
                          ListDeptID: [this.SearchDeptID.toString()],
                          EffectDate: _NowToday
                        }
                        return { GetBaseByListDeptIDGetApi: GetBaseByListDeptIDGetApi, GetAllRoleData: GetAllRoleData }
                      }
                    ),
                    mergeMap((a: any) => this.GetApiDataServiceService.getWebApiData_GetRoleByAuth(this.searchEmpID).pipe(

                      mergeMap((t: any) => this.GetApiDataServiceService.getWebApiData_GetBaseInfoDetail(this.searchEmpID).pipe(
                        map((GetBaseInfoDetail: GetBaseInfoDetailClass[]) => {
                          var setShowData: showDeptManRoleDataClass = {
                            GetAssistantByDeptIDData: {
                              EmpID: GetBaseInfoDetail[0].EmpID,
                              EmpCode: GetBaseInfoDetail[0].EmpCode,
                              EmpNameC: GetBaseInfoDetail[0].EmpNameC,
                              EmpNameE: GetBaseInfoDetail[0].EmpNameE,
                            },
                            GetRoleByAuth: t,
                            GetAllRoleData: a.GetAllRoleData,
                            SearchManGetRoleByAuth: d
                          }
                          return setShowData
                        }
                        ))
                      )
                    )),
                    toArray()
                  ),
              )
              )
              .pipe(takeWhile(() => this.api_subscribe))
              .subscribe(
                (x: any) => {
                  // console.log(x)
                  var datas = JSON.parse(JSON.stringify(x))
                  for (let data of datas) {
                    var minLevel = Math.min.apply(null, data.SearchManGetRoleByAuth.map(function (o) {
                      return o.Level;
                    }))//最大層級-左上角人員可搜尋的最大層級
                    // console.log(minLevel)
                    var minLevelDisabalAnotherData = []//取得最大層級的所有角色
                    for (let oneSearchManGetRoleByAuth of data.SearchManGetRoleByAuth) {
                      if (oneSearchManGetRoleByAuth.Level == minLevel) {
                        minLevelDisabalAnotherData.push(oneSearchManGetRoleByAuth)
                      }
                    }

                    for (let oneAllRoleData of data.GetAllRoleData) {
                      oneAllRoleData.uiIsCheck = false
                      oneAllRoleData.uiIsDisabled = false
                      for (let oneRoleByAuth of data.GetRoleByAuth) {

                        if (oneAllRoleData.RoleCode == oneRoleByAuth.RoleCode) {
                          oneAllRoleData.uiIsCheck = true
                        }

                        if (oneAllRoleData.Level < minLevel) {
                          //如果左上角人員的最大層級小於資料內的層級
                          oneAllRoleData.uiIsDisabled = true
                        } else if (oneAllRoleData.Level == minLevel) {

                          var found = minLevelDisabalAnotherData.find(function (element) {
                            if (element.RoleCode == oneAllRoleData.RoleCode) {
                              return true;
                            } else {
                              return false;
                            }
                          });

                          if (!found) {

                            oneAllRoleData.uiIsDisabled = true
                          }
                        }

                      }
                    }
                  }

                  this.showDeptManRoleData = JSON.parse(JSON.stringify(datas));

                  this.LoadingPage.hide();
                }, error => {
                  this.LoadingPage.hide();
                }
              )
          } else {
            alert('沒有權限查詢')
          }
          this.LoadingPage.hide()
        }, error => {
          this.LoadingPage.hide()
        }
      )
  }

  changeRole(oneGetAllRoleData: showDeptManRoleDataClass, selectOneGetAllRoleData: GetAllRoleDataClass) {
    if (selectOneGetAllRoleData.uiIsCheck) {
      //如果打勾
      var SetRoleGetApi: SetRoleGetApiClass = {
        EmpID: oneGetAllRoleData.GetAssistantByDeptIDData.EmpID,
        RoleCode: selectOneGetAllRoleData.RoleCode,
        SetMan: this.setMan.EmpCode
      }
      // console.log(SetRoleGetApi)
      this.LoadingPage.show()
      this.GetApiDataServiceService.getWebApiData_SetRole(SetRoleGetApi)
        .subscribe(
          (x: any) => {
            if (x.isOK) {

            } else {
              alert(x.ErrorMsg)
              for (let aa of this.showDeptManRoleData) {
                if (aa.GetAssistantByDeptIDData == oneGetAllRoleData.GetAssistantByDeptIDData) {
                  for (let bb of aa.GetAllRoleData) {
                    if (bb == selectOneGetAllRoleData) {
                      bb.uiIsCheck = false
                    }
                  }
                }
              }
            }
            this.LoadingPage.hide()
          }, error => {
            this.LoadingPage.hide()
          }
        )
    } else {
      //如果沒打勾
      var DelRoleGetApi: SetRoleGetApiClass = {
        EmpID: oneGetAllRoleData.GetAssistantByDeptIDData.EmpID,
        RoleCode: selectOneGetAllRoleData.RoleCode,
        SetMan: this.setMan.EmpCode
      }
      // console.log(DelRoleGetApi)
      this.LoadingPage.show()
      this.GetApiDataServiceService.getWebApiData_DelRole(DelRoleGetApi)
        .subscribe(
          (x: any) => {

            if (x.isOK) {

            } else {
              alert(x.ErrorMsg)
              for (let aa of this.showDeptManRoleData) {
                if (aa.GetAssistantByDeptIDData == oneGetAllRoleData.GetAssistantByDeptIDData) {
                  for (let bb of aa.GetAllRoleData) {
                    if (bb == selectOneGetAllRoleData) {
                      bb.uiIsCheck = true
                    }
                  }
                }
              }
            }
            this.LoadingPage.hide()
          }, error => {
            this.LoadingPage.hide()
          }
        )
    }
  }


  state: ITreeState;
  nodes: nodeClass[] = [];

  options: ITreeOptions = {
    useCheckbox: false,
  };
  serchTreeEmpID: string = ''
  PageView(EmpID) {
    this.serchTreeEmpID = EmpID
    this.LoadingPage.show()
    this.GetApiDataServiceService.getWebApiData_GetPageByEmp(EmpID)
      .subscribe(
        (x: any) => {
          this.nodes = []
          for (let i = 0; i < x.length; i++) {
            this.nodes.push({
              id: x[i].Code,
              name: x[i].Title,
              children: [],
              parentId: x[i].ParentCode
            })
            var site = x[i].site
            for (let i_site of site) {
              this.nodes[i].children.push({
                id: i_site.Code,
                name: i_site.Title,
                children: [],
                parentId: i_site.ParentCode
              })
            }
          }

          this.LoadingPage.hide()
          $('#canPageDialog').modal('show')
        }, error => {

          this.LoadingPage.hide()
        }
      )
  }

}

class showDeptManRoleDataClass {
  GetAssistantByDeptIDData: GetAssistantByDeptIDDataClass
  GetRoleByAuth: GetRoleByAuthDataClass[]
  GetAllRoleData: GetAllRoleDataClass[]
  SearchManGetRoleByAuth: GetRoleByAuthDataClass[]
}

