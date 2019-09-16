import { Component, OnInit, AfterContentInit, OnDestroy } from '@angular/core';
import { BaseSpecialFlowDataClass } from 'src/app/Models/BaseSpecialFlowDataClass';
import { GetApiDataServiceService } from 'src/app/Service/get-api-data-service.service';
import { GetApiUserService } from 'src/app/Service/get-api-user.service';
import { GetDeptDataClass } from 'src/app/Models/GetDeptDataClass';
import { GetDeptGetApiClass } from 'src/app/Models/PostData_API_Class/GetDeptGetApiClass';
import { takeWhile } from 'rxjs/operators';
import { GetBaseSpecialFlowGetApiClass } from 'src/app/Models/PostData_API_Class/GetBaseSpecialFlowGetApiClass';
import { UpdateBaseSpecialFlowGetApiClass } from 'src/app/Models/PostData_API_Class/UpdateBaseSpecialFlowGetApiClass';
import { InsertBaseSpecialFlowGetApiClass } from 'src/app/Models/PostData_API_Class/InsertBaseSpecialFlowGetApiClass';
import { NgxSpinnerService } from 'ngx-spinner';
import { doFormatDate } from 'src/app/UseVoid/void_doFormatDate';
declare let $: any; //use jquery

@Component({
  selector: 'app-designated-auditor',
  templateUrl: './designated-auditor.component.html',
  styleUrls: ['./designated-auditor.component.css']
})
export class DesignatedAuditorComponent implements OnInit, AfterContentInit, OnDestroy {
  ngOnDestroy(): void {
    // throw new Error("Method not implemented.");
    this.api_subscribe = false;
  }
  api_subscribe = true
  ngAfterContentInit(): void {
  }

  constructor(private GetApiDataServiceService: GetApiDataServiceService,
    private GetApiUserService: GetApiUserService,
    private LoadingPage: NgxSpinnerService) { }

  NgxDeptSelectBox: GetDeptDataClass[] = []
  setMan = { EmpCode: '', EmpName: '' }

  searchGetBaseSpecialFlowGetApi: GetBaseSpecialFlowGetApiClass = { "EmpID": "", "SearchCate": "" }

  ngOnInit() {
    this.GetApiUserService.counter$.subscribe(
      (x: any) => {
        if (x == 0) {

        } else {
          this.setMan = {
            EmpCode: x.EmpCode,
            EmpName: x.EmpNameC
          }
        }
      }
    )

    this.LoadBaseSpecialFlowData()

    var _NowDate = new Date();
    var _NowToday = doFormatDate(_NowDate);
    var GetDeptGetApi: GetDeptGetApiClass = { "DeptID": 0, "EffectDate": _NowToday, "ChildDept": false }
    this.GetApiDataServiceService.getWebApiData_GetDept(GetDeptGetApi)
      .pipe(takeWhile(() => this.api_subscribe))
      .subscribe(
        (GetDeptData: GetDeptDataClass[]) => {
          this.NgxDeptSelectBox = GetDeptData
          for (let data of this.NgxDeptSelectBox) {
            data.uiShowDeptCodeAndName = data.DeptCode + ' ' + data.DeptNameC
          }
        }
      )
  }
  BaseSpecialFlowData: BaseSpecialFlowDataClass[] = []

  LoadBaseSpecialFlowData() {
    this.LoadingPage.show()
    var GetBaseSpecialFlowGetApi: GetBaseSpecialFlowGetApiClass = { "EmpID": "", "SearchCate": "" }
    this.GetApiDataServiceService.getWebApiData_GetBaseSpecialFlow(GetBaseSpecialFlowGetApi)
      .pipe(takeWhile(() => this.api_subscribe))
      .subscribe(
        (GetBaseSpecialFlowData: BaseSpecialFlowDataClass[]) => {
          this.BaseSpecialFlowData = []
          this.BaseSpecialFlowData = GetBaseSpecialFlowData
          this.LoadingPage.hide()
        }, error => {
          this.LoadingPage.hide()
        }
      )

  }

  editDesignatedAuditor: BaseSpecialFlowDataClass = new BaseSpecialFlowDataClass()
  bt_editCheck(oneBaseSpecialFlowData: BaseSpecialFlowDataClass) {
    this.editDesignatedAuditor = JSON.parse(JSON.stringify(oneBaseSpecialFlowData));
    $('#editDesignatedAuditorDialog').modal('show')
  }
  bt_editSave() {
    var UpdateBaseSpecialFlowGetApi: UpdateBaseSpecialFlowGetApiClass = {
      "SpecialFlowID": this.editDesignatedAuditor.SpecialFlowID,
      "SourceEmpID": this.editDesignatedAuditor.SourceEmpID,
      "TargetEmpID": this.editDesignatedAuditor.TargetEmpID,
      "Sort": this.editDesignatedAuditor.Sort,
      "IsValid": true,
      "Note": this.editDesignatedAuditor.Note,
      "GroupName": this.editDesignatedAuditor.GroupName,
      "UpdateMan": this.setMan.EmpCode
    }
    this.GetApiDataServiceService.getWebApiData_UpdateBaseSpecialFlow(UpdateBaseSpecialFlowGetApi)
      .pipe(takeWhile(() => this.api_subscribe))
      .subscribe(
        (x: any) => {
          if (x == 1) {
            this.LoadBaseSpecialFlowData()
          } else {
            alert(x)
          }
        }, error => {
          // alert('與api連線異常getWebApiData_UpdateBaseSpecialFlow，請確認網路環境正常')
        }
      )

  }


  delDesignatedAuditor: BaseSpecialFlowDataClass = new BaseSpecialFlowDataClass()
  bt_delCheck(oneBaseSpecialFlowData: BaseSpecialFlowDataClass) {
    this.delDesignatedAuditor = JSON.parse(JSON.stringify(oneBaseSpecialFlowData));
    $('#delDesignatedAuditor_checksenddialog').modal('show')
  }
  bt_delSend() {

    var UpdateBaseSpecialFlowGetApi: UpdateBaseSpecialFlowGetApiClass = {
      "SpecialFlowID": this.delDesignatedAuditor.SpecialFlowID,
      "SourceEmpID": this.delDesignatedAuditor.SourceEmpID,
      "TargetEmpID": this.delDesignatedAuditor.TargetEmpID,
      "Sort": this.delDesignatedAuditor.Sort,
      "IsValid": false,
      "Note": this.delDesignatedAuditor.Note,
      "GroupName": this.delDesignatedAuditor.GroupName,
      "UpdateMan": this.setMan.EmpCode
    }
    this.GetApiDataServiceService.getWebApiData_UpdateBaseSpecialFlow(UpdateBaseSpecialFlowGetApi)
      .pipe(takeWhile(() => this.api_subscribe))
      .subscribe(
        (x: any) => {
          if (x == 1) {
            this.LoadBaseSpecialFlowData()
          } else {
            alert(x)
          }
        }, error => {
          // alert('與api連線異常getWebApiData_UpdateBaseSpecialFlow，請確認網路環境正常')
        }
      )
  }

  insertBaseSpecialFlow: InsertBaseSpecialFlowGetApiClass = new InsertBaseSpecialFlowGetApiClass()
  insertBaseSpecialFlowSourceName: string = ''
  insertBaseSpecialFlowTargetName: string = ''
  bt_insertCheck() {
    this.insertBaseSpecialFlowSourceName = ''
    this.insertBaseSpecialFlowTargetName = ''
    this.insertBaseSpecialFlow = new InsertBaseSpecialFlowGetApiClass()
    $('#insertDesignatedAuditorDialog').modal('show')
  }
  bt_insertSave() {
    var InsertBaseSpecialFlowGetApi: InsertBaseSpecialFlowGetApiClass = {
      "SourceEmpID": this.insertBaseSpecialFlow.SourceEmpID,
      "TargetEmpID": this.insertBaseSpecialFlow.TargetEmpID,
      "Sort": 0,
      "Note": this.insertBaseSpecialFlow.Note,
      "GroupName": "",
      "KeyMan": this.setMan.EmpCode
    }
    this.GetApiDataServiceService.getWebApiData_InsertBaseSpecialFlow(InsertBaseSpecialFlowGetApi)
      .pipe(takeWhile(() => this.api_subscribe))
      .subscribe(
        (x: any) => {
          if (x == 1) {
            this.LoadBaseSpecialFlowData()
          } else {
            alert(x)
          }
        }, error => {
          // alert('與api連線異常getWebApiData_UpdateBaseSpecialFlow，請確認網路環境正常')
        }
      )
  }



  onSaveEmptoView(event) {
    // console.log(event)
    this.editDesignatedAuditor.SourceEmpID = event.split('，')[0]
    this.editDesignatedAuditor.SourceName = event.split('，')[1]

    this.insertBaseSpecialFlow.SourceEmpID = event.split('，')[0]
    this.insertBaseSpecialFlowSourceName = event.split('，')[1]

    if (event) {
      $('#chooseEmpdialog').modal('hide');
    }

  }


  onSaveTargetEmptoView(event) {
    // console.log(event)
    this.editDesignatedAuditor.TargetEmpID = event.split('，')[0]
    this.editDesignatedAuditor.TargetName = event.split('，')[1]

    this.insertBaseSpecialFlow.TargetEmpID = event.split('，')[0]
    this.insertBaseSpecialFlowTargetName = event.split('，')[1]

    if (event) {
      $('#chooseTargetEmpdialog').modal('hide');
    }

  }

  bt_search() {

    this.GetApiDataServiceService.getWebApiData_GetBaseSpecialFlow(this.searchGetBaseSpecialFlowGetApi)
      .pipe(takeWhile(() => this.api_subscribe))
      .subscribe(
        (GetBaseSpecialFlowData: BaseSpecialFlowDataClass[]) => {
          if (GetBaseSpecialFlowData.length > 0) {
            this.BaseSpecialFlowData = []
            this.BaseSpecialFlowData = GetBaseSpecialFlowData
          } else {
            alert('查無資料，請確認查詢條件是否正確')
          }
        }
      )
  }
}
