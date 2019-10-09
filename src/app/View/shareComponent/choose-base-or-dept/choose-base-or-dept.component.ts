import { Component, OnInit, Output, EventEmitter, OnDestroy, Input } from '@angular/core';
import { GetAttendInfoClass } from 'src/app/Models/PostData_API_Class/GetAttendInfoClass';
import { Attendance } from 'src/app/Models/Attendance';
import { GetApiUserService } from 'src/app/Service/get-api-user.service';
import { GetApiDataServiceService } from 'src/app/Service/get-api-data-service.service';
import { GetBaseByFormClass } from 'src/app/Models/PostData_API_Class/GetBaseByFormClass';
import { NgxSpinnerService } from 'ngx-spinner';
import { GetDeptaByEmpClass, GetDeptaByEmpTTClass } from 'src/app/Models/PostData_API_Class/GetDeptaByEmpClass';
import { takeWhile } from 'rxjs/operators';
import { doFormatDate } from 'src/app/UseVoid/void_doFormatDate';
import { GetBaseByListDeptaIDGetApiClass } from 'src/app/Models/PostData_API_Class/GetBaseByListDeptaIDGetApiClass';
import { GetBaseByAuthByEmpIDgetDeptInfoGetApiClass } from 'src/app/Models/PostData_API_Class/GetBaseByAuthByEmpIDgetDeptInfoGetApiClass';
import { GetBaseByAuthByEmpIDDataClass } from 'src/app/Models/GetBaseByAuthByEmpIDDataClass';
declare let $: any; //use jquery
@Component({
  selector: 'app-choose-base-or-dept',
  templateUrl: './choose-base-or-dept.component.html',
  styleUrls: ['./choose-base-or-dept.component.css'],
  providers: [GetAttendInfoClass, Attendance]
})
export class ChooseBaseOrDeptComponent implements OnInit, OnDestroy {
  ngOnDestroy(): void {
    // throw new Error("Method not implemented.");
    this.api_subscribe = false;
  }
  api_subscribe = true; //ngOnDestroy時要取消訂閱api的subscribe

  @Input() IsTop: boolean = false
  @Output() outPutChoose: EventEmitter<any> = new EventEmitter<any>();//選到的員工回傳

  showSearchCheckbok = false;
  EmpBase = { EmpCode: '', Name: '' }; //被查詢人
  SearhMan = { EmpCode: '', Name: '' }; //查詢人
  errorLeavemanState = { state: false, errorString: '' }

  downDept: boolean = false
  chooseDeptaID
  chooseDeptName = '';
  chooseDeptBase = [];
  radiogroup: any = [
    { id: 1, name: '查詢單一員工' },
    { id: 2, name: '查詢單位' }
  ];
  chooseRadio: number = 1;
  constructor(private GetApiUserService: GetApiUserService,
    private GetApiDataServiceService: GetApiDataServiceService,
    private LoadingPage: NgxSpinnerService) { }

  ngOnInit() {
    this.GetApiUserService.counter$.subscribe(
      (x: any) => {
        if (x != 0) {
          this.SearhMan.EmpCode = x.EmpCode
          if (x.EmpNameC) {
            this.SearhMan.Name = x.EmpNameC;
          } else {
            this.SearhMan.Name = x.EmpNameE;
          }
          this.outPutEmpValue(this.SearhMan.EmpCode, this.SearhMan.Name)
          this.firstGetDeptData(x.EmpCode)
        }
      })

  }
  firstGetDeptData(searchEmpCode) {

    var _NowDate = new Date();
    var _NowToday = doFormatDate(_NowDate);

    var GetDeptaByEmpClass: GetDeptaByEmpTTClass = {
      EmpCode: searchEmpCode,
      DeptID: 0,
      Level: 2,
      DeptNameKey: '',
      EmpCodeOrNameKey: '',
      EffectDate: _NowToday,
      IsTop: this.IsTop,
      IsShift: false
    }
    var GetBaseByAuthByEmpIDgetDeptInfoGetApi: GetBaseByAuthByEmpIDgetDeptInfoGetApiClass =
    {
      "EmpID": searchEmpCode,
      "EffectDate": _NowToday
    }
    this.GetApiDataServiceService.getWebApiData_GetBaseByAuthByEmpIDgetDeptInfo(GetBaseByAuthByEmpIDgetDeptInfoGetApi)
      .pipe(takeWhile(() => this.api_subscribe))
      .subscribe(
        (GetBaseByAuthByEmpIDData: GetBaseByAuthByEmpIDDataClass) => {
          this.GetApiDataServiceService.getWebApiData_GetDeptaByEmp(GetDeptaByEmpClass)
            .subscribe((x: any) => {
              if (x.length > 0) {
                if (x[0]) {
                  if (GetBaseByAuthByEmpIDData.IsAdmin) {
                    var dept = {
                      ParentID: x[0].Dept[0].ParentID,
                      ParentDeptNameC: '',
                      DeptID: x[0].Dept[0].DeptID,
                      DeptNameC: x[0].Dept[0].DeptNameC,
                      BaseArray: x[0].Dept[0].Base
                    }
                    this.onSaveDeptatoView(dept)
                  } else {
                    if (GetBaseByAuthByEmpIDData.Dept) {
                      var Index = GetBaseByAuthByEmpIDData.Dept.findIndex((y) => {
                        return y.DeptID == parseInt(x[0].Dept[0].DeptID)
                      })
                      if (Index < 0) {
                        return ''
                      } else {
                        var dept = {
                          ParentID: x[0].Dept[0].ParentID,
                          ParentDeptNameC: '',
                          DeptID: x[0].Dept[0].DeptID,
                          DeptNameC: x[0].Dept[0].DeptNameC,
                          BaseArray: x[0].Dept[0].Base
                        }
                        this.onSaveDeptatoView(dept)
                      }
                    }
                  }
                }
              } else {
              }
            }, error => {

            })
        })
  }
  onSaveEmptoView(event) {
    // console.log(event)
    this.EmpBase.EmpCode = event.split('，')[0]
    this.EmpBase.Name = event.split('，')[1]
    if (event) {
      $('#chooseEmpdialog').modal('hide');
      if ($('#chooseEmpdialog').hasClass('modal in') || $('#chooseDeptdialog').hasClass('modal in')) {
        document.getElementById("phonetopdiv").style.position = 'unset';
      } else {
        var aa = $('#id1').css('visibility')
        if (aa == 'visible') {
          document.getElementById("phonetopdiv").style.position = 'fixed';
        }
      }
    }
    // this.outPutEmpValue(this.EmpBase.EmpCode, this.EmpBase.Name)
    this.blurEmpCode()

  }
  onSaveDeptatoView(event) {
    //簽核部門
    // console.log(event)
    var DeptName = event.DeptNameC;
    var BaseArray: EmpArray[] = [];
    if (event.BaseArray) {
      for (let base of event.BaseArray) {
        BaseArray.push({ EmpCode: base.EmpCode, EmpNameC: base.EmpNameC })
      }
    }

    this.chooseDeptName = DeptName;
    this.chooseDeptBase = BaseArray;
    this.chooseDeptaID = event.DeptID;
    this.outPutEmpValue(this.EmpBase.EmpCode, this.EmpBase.Name)
    if ($('#chooseEmpdialog').hasClass('modal in') || $('#chooseDeptdialog').hasClass('modal in')) {
      document.getElementById("phonetopdiv").style.position = 'unset';
    } else {
      var aa = $('#id1').css('visibility')
      if (aa == 'visible') {
        document.getElementById("phonetopdiv").style.position = 'fixed';
      }
    }

  }
  onSaveDepttoView_KeyDept(event) {
    // 編制部門
    var DeptName = event.DeptNameC;
    var BaseArray: EmpArray[] = [];
    if (event.BaseArray) {
      for (let base of event.BaseArray) {
        BaseArray.push({ EmpCode: base.EmpCode, EmpNameC: base.EmpNameC })
      }
    }

    this.chooseDeptName = DeptName;
    this.chooseDeptBase = BaseArray;
    this.chooseDeptaID = event.DeptID;
    this.outPutEmpValue(this.EmpBase.EmpCode, this.EmpBase.Name)
    var aa = $('#id1').css('visibility')
    if (aa == 'visible') {
      if (event.isSearchClick) {
        document.getElementById("phonetopdiv").style.position = 'fixed';
      } else {
        document.getElementById("phonetopdiv").style.position = 'unset';
      }
    } else {
      document.getElementById("phonetopdiv").style.position = 'unset';
    }
    // if ($('#chooseEmpdialog').hasClass('modal in') || $('#chooseDeptdialog').hasClass('modal in')) {

    //     document.getElementById("phonetopdiv").style.position = 'unset';

    // } else {
    //   var aa = $('#id1').css('visibility')
    //   if(aa=='visible'){
    //     document.getElementById("phonetopdiv").style.position = 'fixed';
    //   }
    // }

  }
  onChange() {
    this.outPutEmpValue(this.EmpBase.EmpCode, this.EmpBase.Name)
  }

  outPutEmpValue(EmpCode, EmpNameC) {
    if (this.chooseRadio == 1) {
      var EmpArray: EmpArray[] = []
      if (EmpCode && EmpNameC) {
        EmpArray.push({ EmpCode: EmpCode, EmpNameC: EmpNameC })
      } else {
        EmpArray = []
      }
      var _OutPutVal_Emp: OutPutValClass = {
        chooseRadio: this.chooseRadio,
        chooseEmp: {
          EmpArray: EmpArray
        },
        chooseDepta: null
      }
      this.outPutChoose.emit(_OutPutVal_Emp)
    } else if (this.chooseRadio == 2) {
      // console.log(this.chooseDeptBase)

      var _OutPutVal_Dept: OutPutValClass = {
        chooseRadio: this.chooseRadio,
        chooseEmp: {
          EmpArray: this.chooseDeptBase
        },
        chooseDepta: {
          DeptaID: this.chooseDeptaID,
          isChildDept: this.downDept
        }
      }
      this.outPutChoose.emit(_OutPutVal_Dept)
    }
  }
  blurEmpCode() {
    if (this.EmpBase.EmpCode.length == 6) {

      var _NowDate = new Date();
      var _NowToday = doFormatDate(_NowDate);

      var GetBaseByFormClass: GetBaseByFormClass = {
        EmpCode: this.SearhMan.EmpCode,
        AppEmpCode: this.EmpBase.EmpCode,
        EffectDate: _NowToday
      }
      this.LoadingPage.show()
      this.GetApiDataServiceService.getWebApiData_GetBaseByFormAuth(GetBaseByFormClass).
        subscribe((x: any) => {
          if (x == null) {
            // alert('工號輸入錯誤')
            this.EmpBase.Name = ''
            this.outPutEmpValue('', '')
            this.errorLeavemanState = { state: true, errorString: '非同單位或無該部門的行政權限' }
            $("#leavejobid").addClass("errorInput");
          } else if (x.length == 0) {
            // alert('工號輸入錯誤')this.EmpBase.Name = ''
            this.EmpBase.Name = ''
            this.outPutEmpValue('', '')
            this.errorLeavemanState = { state: true, errorString: '非同單位或無該部門的行政權限' }
            $("#leavejobid").addClass("errorInput");
          } else {
            // alert('工號正確')
            if (x[0].EmpNameC == null) {
              this.EmpBase.Name = x[0].EmpNameE
            } else if (x[0].EmpNameC.length == 0) {
              this.EmpBase.Name = x[0].EmpNameE
            } else {
              this.EmpBase.Name = x[0].EmpNameC
            }
            this.outPutEmpValue(this.EmpBase.EmpCode, this.EmpBase.Name)
            this.errorLeavemanState = { state: false, errorString: '' }
            $("#leavejobid").removeClass("errorInput");

          }

          this.LoadingPage.hide()
        }, error => {
          this.LoadingPage.hide()
        })
    } else {
      this.EmpBase.Name = ''
      this.errorLeavemanState = { state: true, errorString: '非同單位或無該部門的行政權限' }
      $("#leavejobid").addClass("errorInput");
      this.outPutEmpValue(null, null)
      this.LoadingPage.hide()
    }
  }


  chooseEmpdialog_ShowDialog: boolean = false
  bt_ShowDialog_chooseEmpdialog() {
    this.chooseEmpdialog_ShowDialog = true
    $('#chooseEmpdialog').modal('show')
    if (window.innerWidth < 800) {
      $('.modal-backdrop in').css({ "display": "none" });
      if ($('#chooseEmpdialog').hasClass('modal in') || $('#chooseDeptdialog').hasClass('modal in')) {
        document.getElementById("phonetopdiv").style.position = 'unset';
      } else {
        var aa = $('#id1').css('visibility')
        if (aa == 'visible') {
          document.getElementById("phonetopdiv").style.position = 'fixed';
        }
      }
    }
  }

  chooseDeptdialog_ShowDialog: boolean = false
  bt_ShowDialog_chooseDeptdialog() {
    this.chooseDeptdialog_ShowDialog = true
    $('#chooseDeptdialog').modal('show')
    if (window.innerWidth < 800) {
      $('.modal-backdrop in').css({ "display": "none" });
      if ($('#chooseEmpdialog').hasClass('modal in') || $('#chooseDeptdialog').hasClass('modal in')) {
        document.getElementById("phonetopdiv").style.position = 'unset';
      } else {
        var aa = $('#id1').css('visibility')
        if (aa == 'visible') {
          document.getElementById("phonetopdiv").style.position = 'fixed';
        }
      }
    }
  }


  chooseEmpdialog_HideDialog() {
    $('#chooseEmpdialog').modal('hide')
    if ($('#chooseEmpdialog').hasClass('modal in') || $('#chooseDeptdialog').hasClass('modal in')) {
      document.getElementById("phonetopdiv").style.position = 'unset';
    } else {
      var aa = $('#id1').css('visibility')
      if (aa == 'visible') {
        document.getElementById("phonetopdiv").style.position = 'fixed';
      }
    }
  }
  chooseDeptdialog_HideDialog() {
    $('#chooseDeptdialog').modal('hide')
    if ($('#chooseEmpdialog').hasClass('modal in') || $('#chooseDeptdialog').hasClass('modal in')) {
      document.getElementById("phonetopdiv").style.position = 'unset';
    } else {
      var aa = $('#id1').css('visibility')
      if (aa == 'visible') {
        document.getElementById("phonetopdiv").style.position = 'fixed';
      }
    }
  }
}

class EmpArray {
  EmpCode: string;
  EmpNameC: string;
}

export class OutPutValClass {
  chooseRadio: number;
  chooseEmp: {
    EmpArray: Array<EmpArray>
  }
  chooseDepta: {
    DeptaID: number
    isChildDept: boolean
  }
}

