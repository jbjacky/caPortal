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
import { ITreeState, ITreeOptions } from 'angular-tree-component';
import { nodeClass } from 'src/app/Models/nodeClass';
import { DelDeptByEmpGetApiClass } from 'src/app/Models/PostData_API_Class/DelDeptByEmpGetApiClass';
import { GetBaseByFormClass } from 'src/app/Models/PostData_API_Class/GetBaseByFormClass';
import { doFormatDate } from 'src/app/UseVoid/void_doFormatDate';
import { ResponeStateClass } from 'src/app/Models/ResponeStateClass';

declare let $: any; //use jquery

@Component({
  selector: 'app-dept-administrative',
  templateUrl: './dept-administrative.component.html',
  styleUrls: ['./dept-administrative.component.css']
})
export class DeptAdministrativeComponent implements OnInit, OnDestroy {
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
          this.FirstgetDept(this.setMan.EmpCode);
        }
      }
    )

  }
  insertSetDeptByEmpGetApi: SetDeptByEmpGetApiClass = new SetDeptByEmpGetApiClass()
  insertShowEmpName: string = ''
  private FirstgetDept(EmpCode: string) {
    this.NgxBaseSelectBox = []
    this.showDeptManRoleData = []
    this.GetApiDataServiceService.getWebApiData_GetDeptsByEmp(EmpCode)
      .pipe(takeWhile(() => this.api_subscribe))
      .subscribe((GetDeptData: GetDeptDataClass[]) => {
        if (GetDeptData.length > 0) {
          this.NgxBaseSelectBox = GetDeptData;
          for (let data of this.NgxBaseSelectBox) {
            var ParentName = data.ParentName
            if (ParentName) {
              ParentName = ' '+ParentName + ' / '
            } else {
              ParentName = ' '
            }
            data.uiShowDeptCodeAndName = data.DeptCode + ParentName + data.DeptNameC;
          }

          this.SearchDeptID = this.NgxBaseSelectBox[0].DeptID;

          this.NgxDeptSelectBox = GetDeptData;
          for (let data of this.NgxDeptSelectBox) {
            var ParentName = data.ParentName
            if (ParentName) {
              ParentName = ' '+ParentName + ' / '
            } else {
              ParentName = ' '
            }
            data.uiShowDeptCodeAndName = data.DeptCode + ParentName + data.DeptNameC;
          }

          this.LoadGetAssistantByDeptID();
        }
        this.LoadingPage.hide();
      }, error => {
        this.LoadingPage.hide();
      });
  }

  private ChangeEmpIDgetDept(EmpCode: string) {
    this.NgxBaseSelectBox = []
    this.showDeptManRoleData = []
    this.GetApiDataServiceService.getWebApiData_GetDeptsByEmp(EmpCode)
      .pipe(takeWhile(() => this.api_subscribe))
      .subscribe((GetDeptData: GetDeptDataClass[]) => {
        if (GetDeptData.length > 0) {
          this.NgxBaseSelectBox = GetDeptData;
          for (let data of this.NgxBaseSelectBox) {
            var ParentName = data.ParentName
            if (ParentName) {
              ParentName = ' '+ParentName + ' / '
            } else {
              ParentName = ' '
            }
            data.uiShowDeptCodeAndName = data.DeptCode + ParentName + data.DeptNameC;
          }

          this.SearchDeptID = this.NgxBaseSelectBox[0].DeptID;

          this.LoadGetAssistantByDeptID();
        }
        this.LoadingPage.hide();
      }, error => {
        this.LoadingPage.hide();
      });
  }
  insertCheck() {
    this.insertSetDeptByEmpGetApi = new SetDeptByEmpGetApiClass()
    this.insertShowEmpName = ''
    $('#insertDeptmanDialog').modal('show')
  }

  bt_insertSend() {
    if (this.errorEmpCodeState.state) {
      //沒有權限
    } else if (!this.insertSetDeptByEmpGetApi.EmpID) {
      this.errorEmpCodeState = { state: true, errorString: '無該部門的行政權限' }
    } else if (!this.insertSetDeptByEmpGetApi.DeptID) {
      alert('請輸入管理單位')
    } else {

      var insert: SetDeptByEmpGetApiClass = {
        "EmpID": this.insertSetDeptByEmpGetApi.EmpID,
        "DeptID": this.insertSetDeptByEmpGetApi.DeptID,
        "SetMan": this.setMan.EmpCode
      }
      this.GetApiDataServiceService.getWebApiData_SetDeptByEmp(insert)
        .pipe(takeWhile(() => this.api_subscribe))
        .subscribe(
          (x: ResponeStateClass) => {
            if (x.isOK) {
              this.LoadGetAssistantByDeptID()
              $('#insertDeptmanDialog').modal('hide')
            } else {
              var errMsg = ''
              for (let e of x.ErrorMsg) {
                errMsg += e + '。 '
              }
              alert(errMsg);
            }
          }
        )
    }
  }


  onSaveEmptoView(event) {
    // console.log(event)
    this.insertSetDeptByEmpGetApi.EmpID = event.split('，')[0]
    this.insertShowEmpName = event.split('，')[1]

    if (event) {
      $('#chooseEmpdialog').modal('hide');
      this.blurEmpCode()
    }

  }
  delData: GetAssistantByDeptIDDataClass
  bt_delCheck(delData) {
    this.delData = delData
    $('#delSetDept_checksenddialog').modal('show');
  }
  bt_delSend() {
    this.LoadingPage.show()
    var DelDeptByEmpGetApi: DelDeptByEmpGetApiClass = {
      EmpID: this.delData.EmpCode,
      DeptID: this.SearchDeptID,
      SetMan: this.setMan.EmpCode
    }
    this.GetApiDataServiceService.getWebApiData_DelDeptByEmp(DelDeptByEmpGetApi)
      .pipe(takeWhile(() => this.api_subscribe))
      .subscribe(
        (x: any) => {
          this.LoadingPage.hide()
          this.LoadGetAssistantByDeptID()
        }, error => {
          this.LoadingPage.hide()
        }
      )
  }

  SetDeptManData: GetAssistantByDeptIDDataClass[] = []
  showDeptManRoleData: showDeptManRoleDataClass[] = []
  LoadGetAssistantByDeptID() {
    this.LoadingPage.show();
    this.GetApiDataServiceService.getWebApiData_GetAssistantByDeptID(this.SearchDeptID)
      .pipe(
        mergeMap((w: GetAssistantByDeptIDDataClass[]) => from(w)),
        mergeMap((y: GetAssistantByDeptIDDataClass) => this.GetApiDataServiceService.getWebApiData_GetRoleByAuth(y.EmpCode).pipe(
          map((z: any) => {
            var setShowData: showDeptManRoleDataClass = {
              GetAssistantByDeptIDData: y,
              GetRoleByAuth: z
            }
            return setShowData
          }
          ))
        ),
        toArray()
      )
      .pipe(takeWhile(() => this.api_subscribe))
      .subscribe(
        (x: showDeptManRoleDataClass[]) => {
          this.showDeptManRoleData = []
          this.showDeptManRoleData = x

          this.LoadingPage.hide();
        }, error => {
          this.LoadingPage.hide();
        }
      )
  }

  onSelectChange() {
    this.LoadGetAssistantByDeptID()
  }




  state: ITreeState;
  nodes: nodeClass[] = [];

  options: ITreeOptions = {
    useCheckbox: false,
  };

  serchTreeEmpID: string = ''
  PageView(EmpID) {
    this.serchTreeEmpID = EmpID
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

  errorEmpCodeState = { state: false, errorString: '' };
  blurEmpCode() {
    //部門、行政權限
    if (this.insertSetDeptByEmpGetApi.EmpID) {

      if (this.insertSetDeptByEmpGetApi.EmpID.length == 6) {

        this.LoadingPage.show()
        var _NowDate = new Date();
        var _NowToday = doFormatDate(_NowDate);
        var GetBaseByForm: GetBaseByFormClass = {
          EmpCode: this.setMan.EmpCode,
          AppEmpCode: this.insertSetDeptByEmpGetApi.EmpID,
          EffectDate: _NowToday
        }
        this.GetApiDataServiceService.getWebApiData_GetBaseByFormStaff(GetBaseByForm)
          .pipe(takeWhile(() => this.api_subscribe))
          .subscribe((x: any) => {
            if (x == null) {
              // alert('工號輸入錯誤')
              this.errorEmpCodeState = { state: true, errorString: '無該部門的行政權限' };
              this.insertShowEmpName = '';
              $("#leavejobid").addClass("errorInput");
              this.LoadingPage.hide();
            }
            else if (x.length == 0) {
              // alert('工號輸入錯誤')
              this.insertShowEmpName = '';
              this.errorEmpCodeState = { state: true, errorString: '無該部門的行政權限' };
              $("#leavejobid").addClass("errorInput");
              this.LoadingPage.hide();
            }
            else {
              // alert('工號正確')
              if (x[0].EmpNameC == null) {
                this.insertShowEmpName = x[0].EmpNameE;
              }
              else if (x[0].EmpNameC.length == 0) {
                this.insertShowEmpName = x[0].EmpNameE;
              }
              else {
                this.insertShowEmpName = x[0].EmpNameC;
              }
              this.errorEmpCodeState = { state: false, errorString: '' };
              $("#leavejobid").removeClass("errorInput");
              this.LoadingPage.hide();

            }
          }, error => {
            this.LoadingPage.hide()
          })
      } else {
        this.errorEmpCodeState = { state: true, errorString: '無該部門的行政權限' };
        this.insertShowEmpName = '';
        $("#leavejobid").addClass("errorInput");
        this.LoadingPage.hide();
      }
    }
  }

  SearchEmp = { EmpID: '', EmpNameC: '' }

  onSaveSearchEmptoView(event) {
    // console.log(event)
    this.SearchEmp.EmpID = event.split('，')[0]
    this.SearchEmp.EmpNameC = event.split('，')[1]
    if (event) {
      $('#chooseSearchEmpdialog').modal('hide');
      this.blurSearchEmpCode()
    }
  }

  errorSearchEmpCodeState = { state: false, errorString: '' };
  blurSearchEmpCode() {
    //部門、行政權限
    if (this.SearchEmp.EmpID) {

      if (this.SearchEmp.EmpID.length == 6) {

        this.LoadingPage.show()
        var _NowDate = new Date();
        var _NowToday = doFormatDate(_NowDate);
        var GetBaseByForm: GetBaseByFormClass = {
          EmpCode: this.setMan.EmpCode,
          AppEmpCode: this.SearchEmp.EmpID,
          EffectDate: _NowToday
        }
        this.GetApiDataServiceService.getWebApiData_GetBaseByFormStaff(GetBaseByForm)
          .pipe(takeWhile(() => this.api_subscribe))
          .subscribe((x: any) => {
            if (x == null) {
              // alert('工號輸入錯誤')
              this.errorSearchEmpCodeState = { state: true, errorString: '無該部門的行政權限' };
              this.SearchEmp.EmpNameC = '';
              $("#leaveSearchEmpCode").addClass("errorInput");
              this.LoadingPage.hide();
            }
            else if (x.length == 0) {
              // alert('工號輸入錯誤')
              this.SearchEmp.EmpNameC = '';
              this.errorSearchEmpCodeState = { state: true, errorString: '無該部門的行政權限' };
              $("#leaveSearchEmpCode").addClass("errorInput");
              this.LoadingPage.hide();
            }
            else {
              // alert('工號正確')
              if (x[0].EmpNameC == null) {
                this.SearchEmp.EmpNameC = x[0].EmpNameE;
              }
              else if (x[0].EmpNameC.length == 0) {
                this.SearchEmp.EmpNameC = x[0].EmpNameE;
              }
              else {
                this.SearchEmp.EmpNameC = x[0].EmpNameC;
              }
              this.errorSearchEmpCodeState = { state: false, errorString: '' };
              $("#leaveSearchEmpCode").removeClass("errorInput");
              this.LoadingPage.hide();
              this.ChangeEmpIDgetDept(this.SearchEmp.EmpID)

            }
          }, error => {
            this.LoadingPage.hide()
          })
      } else {
        this.errorSearchEmpCodeState = { state: true, errorString: '無該部門的行政權限' };
        this.SearchEmp.EmpNameC = '';
        $("#leaveSearchEmpCode").addClass("errorInput");
        this.LoadingPage.hide();
      }
    }
  }
  onSearchEmpIDClick() {
    this.LoadingPage.show()
    if (this.errorSearchEmpCodeState.state) {

    } else {
      this.GetApiDataServiceService.getWebApiData_GetRoleByAuth(this.SearchEmp.EmpID)
        .pipe(takeWhile(() => this.api_subscribe))
        .subscribe(
          (x: any) => {
            var SearchEmpDeptIDData: GetAssistantByDeptIDDataClass = {
              EmpID: this.SearchEmp.EmpID,
              EmpCode: this.SearchEmp.EmpID,
              EmpNameC: this.SearchEmp.EmpNameC,
              EmpNameE: this.SearchEmp.EmpNameC
            }
            var setShowData: showDeptManRoleDataClass = {
              GetAssistantByDeptIDData: SearchEmpDeptIDData,
              GetRoleByAuth: x
            }
            this.showDeptManRoleData = []
            this.showDeptManRoleData.push(
              setShowData
            )

            this.LoadingPage.hide();
          }
        )
    }

  }

}

class showDeptManRoleDataClass {
  GetAssistantByDeptIDData: GetAssistantByDeptIDDataClass
  GetRoleByAuth: GetRoleByAuthDataClass[]
}