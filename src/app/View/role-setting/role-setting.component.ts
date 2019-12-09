import { Component, OnInit, OnDestroy } from '@angular/core';
import { GetApiDataServiceService } from 'src/app/Service/get-api-data-service.service';
import { GetApiUserService } from 'src/app/Service/get-api-user.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { takeWhile } from 'rxjs/operators';
import { CreateRoleGetApiClass } from 'src/app/Models/PostData_API_Class/CreateRoleGetApiClass';
import { UpdateRoleGetApiClass } from 'src/app/Models/PostData_API_Class/UpdateRoleGetApiClass';
import { ResponeStateClass } from 'src/app/Models/ResponeStateClass';

declare let $: any; //use jquery

@Component({
  selector: 'app-role-setting',
  templateUrl: './role-setting.component.html',
  styleUrls: ['./role-setting.component.css']
})
export class RoleSettingComponent implements OnInit, OnDestroy {
  ngOnDestroy(): void {
    // throw new Error("Method not implemented.");
    this.api_subscribe = false;
  }
  api_subscribe = true

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
          this.LoadData()
        }
      }
    )
  }

  showAllRole:GetAllRoleDataClass[] = []
  LoadData(){
    this.LoadingPage.show()
    this.GetApiDataServiceService.getWebApiData_GetAllRole()
    .pipe(takeWhile(() => this.api_subscribe))
    .subscribe(
      (x:GetAllRoleDataClass[])=>{
        this.showAllRole = JSON.parse(JSON.stringify(x));
        this.showAllRole.sort(
          (a,b)=>{
            return a.Level - b.Level  
          }
          
        )
        this.LoadingPage.hide()
      },error=>{
        this.LoadingPage.hide()
      }
    )
  }

  insertData:CreateRoleGetApiClass = new CreateRoleGetApiClass()
  bt_insertCheck(){
    this.insertData = new CreateRoleGetApiClass()
    $('#insertRoleDialog').modal('show')
  }
  bt_insertSave(){
    this.insertData.SetMan = this.setMan.EmpCode
    this.LoadingPage.show()
    this.GetApiDataServiceService.getWebApiData_CreateRole(this.insertData)
    .subscribe(
      (x:ResponeStateClass)=>{
        if(x.isOK){
          this.LoadData()
        }else{
          var errMsg = ''
          for (let e of x.ErrorMsg) {
            errMsg += e + '。 '
          }
          alert(errMsg);
        }
        this.LoadingPage.hide()
        $('#insertRoleDialog').modal('hide')
      },error=>{
        this.LoadingPage.hide()
      }
    )
  }


  changeisIncludeChild(oneAllRole:GetAllRoleDataClass){
    // console.log(oneAllRole)
    var UpdateRoleGetApi: UpdateRoleGetApiClass = {
      "RoleCode":oneAllRole.RoleCode,
      "SetMan":this.setMan.EmpCode,
      "IsAssistant": oneAllRole.isAssistant,
      "IsIncludeChild":oneAllRole.isIncludeChild
    }
    this.GetApiDataServiceService.getWebApiData_UpdateRole(UpdateRoleGetApi)
    .subscribe(
      (x:ResponeStateClass)=>{
        if(x.isOK){
          
        }else{
          var errMsg = ''
          for (let e of x.ErrorMsg) {
            errMsg += e + '。 '
          }
          alert(errMsg);
        }
      },error=>{
        
      }
    )
  }
  changeisisAssistant(oneAllRole:GetAllRoleDataClass){
    // console.log(oneAllRole)
    var UpdateRoleGetApi: UpdateRoleGetApiClass = {
      "RoleCode":oneAllRole.RoleCode,
      "SetMan":this.setMan.EmpCode,
      "IsAssistant": oneAllRole.isAssistant,
      "IsIncludeChild":oneAllRole.isIncludeChild
    }
    this.GetApiDataServiceService.getWebApiData_UpdateRole(UpdateRoleGetApi)
    .subscribe(
      (x:ResponeStateClass)=>{
        if(x.isOK){
          
        }else{
          var errMsg = ''
          for (let e of x.ErrorMsg) {
            errMsg += e + '。 '
          }
          alert(errMsg);
        }
      },error=>{
        
      }
    )
  }
}

class GetAllRoleDataClass{
  RoleCode: string
  RoleName: string
  isAdmin: boolean
  Level: number
  isAssistant: boolean
  isIncludeChild: boolean
}