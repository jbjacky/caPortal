import { Component, OnInit, AfterContentInit, OnDestroy } from '@angular/core';
import { GetApiDataServiceService } from 'src/app/Service/get-api-data-service.service';
import { takeWhile } from 'rxjs/operators';
import { GetDeptHumanDataClass } from 'src/app/Models/GetDeptHumanDataClass';
import { GetApiUserService } from 'src/app/Service/get-api-user.service';
import { GetDeptDataClass } from 'src/app/Models/GetDeptDataClass';
import { GetDeptGetApiClass } from 'src/app/Models/PostData_API_Class/GetDeptGetApiClass';
import { DeptAdministrativeComponent } from '../dept-administrative/dept-administrative.component';
import { UpdateDeptHumanGetApiClass } from 'src/app/Models/PostData_API_Class/UpdateDeptHumanGetApiClass';
import { InsertDeptHumanGetApiClass } from 'src/app/Models/PostData_API_Class/InsertDeptHumanGetApiClass';
import { NgxSpinnerService } from 'ngx-spinner';
import { doFormatDate } from 'src/app/UseVoid/void_doFormatDate';

declare let $: any; //use jquery
@Component({
  selector: 'app-hr-dept',
  templateUrl: './hr-dept.component.html',
  styleUrls: ['./hr-dept.component.css']
})
export class HrDeptComponent implements OnInit, AfterContentInit, OnDestroy {
  ngOnDestroy(): void {
    // throw new Error("Method not implemented.");
    this.api_subscribe = false;
  }
  api_subscribe = true
  ngAfterContentInit(): void {
  }

  constructor(private GetApiDataServiceService: GetApiDataServiceService,
    private GetApiUserService: GetApiUserService,
    private LoadingPage: NgxSpinnerService  ) { }

  DeptHumanData: GetDeptHumanDataClass[] = []
  NgxDeptSelectBox: GetDeptDataClass[] = []
  setMan = { EmpCode: '', EmpName: '' }
  seachInput:string =''

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

    this.LoadGetDeptHumanData()

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

  editOneDeptHumanData: GetDeptHumanDataClass = new GetDeptHumanDataClass()
  bt_editCheck(oneDeptHumanData: GetDeptHumanDataClass) {
    this.editOneDeptHumanData = JSON.parse(JSON.stringify(oneDeptHumanData));
    $('#editHrDialog').modal('show')
  }

  onSaveEmptoView(event) {
    // console.log(event)
    this.editOneDeptHumanData.EmpID = event.split('，')[0]
    this.editOneDeptHumanData.EmpName = event.split('，')[1]

    this.insertOneDeptHumanData.EmpID = event.split('，')[0]
    this.insertShowEmpName = event.split('，')[1]
    
    if(event){
      $('#chooseEmpdialog').modal('hide');
    }

  }
  bt_editSave() {
    var UpdateDeptHumanGetApi: UpdateDeptHumanGetApiClass = {
      "DeptHumanID": this.editOneDeptHumanData.DeptHumanID,
      "DeptCode": this.editOneDeptHumanData.DeptCode,
      "EmpID": this.editOneDeptHumanData.EmpID,
      "IsValid": true,
      "Note": this.editOneDeptHumanData.Note,
      "UpdateMan": this.setMan.EmpCode
    }
    this.GetApiDataServiceService.getWebApiData_UpdateDeptHuman(UpdateDeptHumanGetApi)
      .pipe(takeWhile(() => this.api_subscribe))
      .subscribe(
        (x: any) => {
          if (x == 1) {
            this.LoadGetDeptHumanData()
          } else {
            alert(x)
          }
        }, error => {
          // alert('與api連線異常getWebApiData_UpdateDeptHuman，請確認網路環境正常')
        }
      )

  }

  delOneDeptHumanData: GetDeptHumanDataClass = new GetDeptHumanDataClass()
  bt_delCheck(oneDeptHumanData: GetDeptHumanDataClass) {
    this.delOneDeptHumanData = JSON.parse(JSON.stringify(oneDeptHumanData));
    $('#delHr_checksenddialog').modal('show')
  }

  bt_delSend() {

    var UpdateDeptHumanGetApi: UpdateDeptHumanGetApiClass = {
      "DeptHumanID": this.delOneDeptHumanData.DeptHumanID,
      "DeptCode": this.delOneDeptHumanData.DeptCode,
      "EmpID": this.delOneDeptHumanData.EmpID,
      "IsValid": false,
      "Note": this.delOneDeptHumanData.Note,
      "UpdateMan": this.setMan.EmpCode
    }
    this.GetApiDataServiceService.getWebApiData_UpdateDeptHuman(UpdateDeptHumanGetApi)
      .pipe(takeWhile(() => this.api_subscribe))
      .subscribe(
        (x: any) => {
          if (x == 1) {
            this.LoadGetDeptHumanData()
          } else {
            alert(x)
          }
        }, error => {
          // alert('與api連線異常getWebApiData_UpdateDeptHuman，請確認網路環境正常')
        }
      )
  }



  insertOneDeptHumanData: InsertDeptHumanGetApiClass = new InsertDeptHumanGetApiClass()
  insertShowEmpName:string = '' //dialog新增的人員姓名顯示
  insertCheck() {
    this.insertOneDeptHumanData = new InsertDeptHumanGetApiClass()
    this.insertShowEmpName = ''
    $('#insertHrDialog').modal('show')
  }

  bt_insertSend() {

    var InsertDeptHumanGetApi: InsertDeptHumanGetApiClass = {
      "DeptCode": this.insertOneDeptHumanData.DeptCode,
      "EmpID": this.insertOneDeptHumanData.EmpID,
      "Note": "",
      "KeyMan": this.setMan.EmpCode
    }
    this.GetApiDataServiceService.getWebApiData_InsertDeptHuman(InsertDeptHumanGetApi)
      .pipe(takeWhile(() => this.api_subscribe))
      .subscribe(
        (x: any) => {
          if (x == 1) {
            this.LoadGetDeptHumanData()
          } else {
            alert(x)
          }
        }, error => {
          // alert('與api連線異常getWebApiData_UpdateDeptHuman，請確認網路環境正常')
        }
      )
  }

  LoadGetDeptHumanData() {
    this.LoadingPage.show()
    this.GetApiDataServiceService.getWebApiData_GetDeptHuman('')
      .pipe(takeWhile(() => this.api_subscribe))
      .subscribe(
        (GetDeptHumanData: GetDeptHumanDataClass[]) => {
          this.DeptHumanData = []
          this.DeptHumanData = GetDeptHumanData
          this.LoadingPage.hide()
        },error=>{
          this.LoadingPage.hide()
        }
      )
  }


  bt_Search(){
    
    this.GetApiDataServiceService.getWebApiData_GetDeptHuman(this.seachInput)
      .pipe(takeWhile(() => this.api_subscribe))
      .subscribe(
        (GetDeptHumanData: GetDeptHumanDataClass[]) => {
          if(GetDeptHumanData.length >0){
            this.DeptHumanData = []
            this.DeptHumanData = GetDeptHumanData
          }else{
            alert('查無資料，請確認查詢條件是否正確')
          }
        }
      )
  }
}
