import { Component, OnInit, AfterContentInit, OnDestroy } from '@angular/core';
import { DeptSecretaryDataClass } from 'src/app/Models/DeptSecretaryDataClass';
import { GetApiDataServiceService } from 'src/app/Service/get-api-data-service.service';
import { GetApiUserService } from 'src/app/Service/get-api-user.service';
import { takeWhile } from 'rxjs/operators';
import { UpdateDeptSecretaryGetApiClass } from 'src/app/Models/PostData_API_Class/UpdateDeptSecretaryGetApiClass';
import { GetDeptGetApiClass } from 'src/app/Models/PostData_API_Class/GetDeptGetApiClass';
import { GetDeptDataClass } from 'src/app/Models/GetDeptDataClass';
import { InsertDeptSecretaryGetApiClass } from 'src/app/Models/PostData_API_Class/InsertDeptSecretaryGetApiClass';
import { NgxSpinnerService } from 'ngx-spinner';
import { doFormatDate } from 'src/app/UseVoid/void_doFormatDate';

declare let $: any; //use jquery

@Component({
  selector: 'app-agent-write',
  templateUrl: './agent-write.component.html',
  styleUrls: ['./agent-write.component.css']
})
export class AgentWriteComponent implements OnInit, AfterContentInit, OnDestroy {
  ngOnDestroy(): void {
    // throw new Error("Method not implemented.");
    this.api_subscribe = false;
  }
  api_subscribe = true
  ngAfterContentInit(): void {
  }


  NgxDeptSelectBox: GetDeptDataClass[] = []
  setMan = { EmpCode: '', EmpName: '' }
  searchInput:string=''

  constructor(private GetApiDataServiceService: GetApiDataServiceService,
    private GetApiUserService: GetApiUserService,
    private LoadingPage: NgxSpinnerService ) { }

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
    this.LoadDeptSecretaryData()
    var date = new Date();
    var today = doFormatDate(date);
    var GetDeptGetApi: GetDeptGetApiClass = { "DeptID": 0, "EffectDate": today, "ChildDept": false }
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
  DeptSecretaryData: DeptSecretaryDataClass[] = []
  LoadDeptSecretaryData() {
    this.LoadingPage.show()
    this.GetApiDataServiceService.getWebApiData_GetDeptSecretary('')
      .pipe(takeWhile(() => this.api_subscribe))
      .subscribe(
        (GetDeptSecretaryData: DeptSecretaryDataClass[]) => {
          this.DeptSecretaryData = []
          this.DeptSecretaryData = GetDeptSecretaryData
          this.LoadingPage.hide()
        },error=>{
          this.LoadingPage.hide()
        }
      )
  }

  editOneDeptSecretaryData: DeptSecretaryDataClass = new DeptSecretaryDataClass()
  bt_editCheck(OneDeptSecretaryData: DeptSecretaryDataClass) {
    this.editOneDeptSecretaryData = JSON.parse(JSON.stringify(OneDeptSecretaryData));
    $('#editAgentDialog').modal('show')
  }

  bt_editSave() {
    var UpdateDeptSecretaryGetApi: UpdateDeptSecretaryGetApiClass = {
      "DeptSecretaryID": this.editOneDeptSecretaryData.DeptSecretaryID,
      "DeptCode": this.editOneDeptSecretaryData.DeptCode,
      "EmpID": this.editOneDeptSecretaryData.EmpID,
      "IsValid": true,
      "Note": this.editOneDeptSecretaryData.Note,
      "UpdateMan": this.setMan.EmpCode
    }
    this.GetApiDataServiceService.getWebApiData_UpdateDeptSecretary(UpdateDeptSecretaryGetApi)
      .pipe(takeWhile(() => this.api_subscribe))
      .subscribe(
        (x: any) => {
          if (x == 1) {
            this.LoadDeptSecretaryData()
          } else {
            alert(x)
          }
        }
      )
  }

  delDeptSecretaryData: DeptSecretaryDataClass = new DeptSecretaryDataClass()
  bt_delCheck(oneDeptSecretaryData: DeptSecretaryDataClass) {
    this.delDeptSecretaryData = JSON.parse(JSON.stringify(oneDeptSecretaryData));
    $('#delAgent_checksenddialog').modal('show')
  }
  bt_delSend() {

    var UpdateDeptSecretaryGetApi: UpdateDeptSecretaryGetApiClass = {
      "DeptSecretaryID": this.delDeptSecretaryData.DeptSecretaryID,
      "DeptCode": this.delDeptSecretaryData.DeptCode,
      "EmpID": this.delDeptSecretaryData.EmpID,
      "IsValid": false,
      "Note": this.delDeptSecretaryData.Note,
      "UpdateMan": this.setMan.EmpCode
    }
    this.GetApiDataServiceService.getWebApiData_UpdateDeptSecretary(UpdateDeptSecretaryGetApi)
      .pipe(takeWhile(() => this.api_subscribe))
      .subscribe(
        (x: any) => {
          if (x == 1) {
            this.LoadDeptSecretaryData()
          } else {
            alert(x)
          }
        }
      )
  }

  insertDeptSecretaryData: InsertDeptSecretaryGetApiClass = new InsertDeptSecretaryGetApiClass()
  insertDeptSecretaryDataEmpName: string = ''
  bt_insertCheck() {

    this.insertDeptSecretaryData = new InsertDeptSecretaryGetApiClass()
    this.insertDeptSecretaryDataEmpName = ''
    $('#insertAgentDialog').modal('show')
  }
  bt_insertSave() {

    this.GetApiDataServiceService.getWebApiData_InsertDeptSecretary(this.insertDeptSecretaryData)
      .pipe(takeWhile(() => this.api_subscribe))
      .subscribe(
        (x: any) => {
          if (x == 1) {
            this.LoadDeptSecretaryData()
          } else {
            alert(x)
          }
        }
      )
  }

  onSaveEmptoView(event) {
    // console.log(event)
    this.editOneDeptSecretaryData.EmpID = event.split('，')[0]
    this.editOneDeptSecretaryData.EmpName = event.split('，')[1]

    this.insertDeptSecretaryData.EmpID = event.split('，')[0]
    this.insertDeptSecretaryDataEmpName = event.split('，')[1]
    
    if(event){
      $('#chooseEmpdialog').modal('hide');
    }

  }


  bt_search(){
    
    this.GetApiDataServiceService.getWebApiData_GetDeptSecretary(this.searchInput)
      .pipe(takeWhile(() => this.api_subscribe))
      .subscribe(
        (GetDeptSecretaryData: DeptSecretaryDataClass[]) => {
          if(GetDeptSecretaryData.length>0){
            this.DeptSecretaryData = []
            this.DeptSecretaryData = GetDeptSecretaryData
          }else{
            alert('查無資料，請確認查詢條件是否正確')
          }
        }
      )
  }
}