import { Component, OnInit, OnDestroy } from '@angular/core';
import { GetFormInfoDataClass } from 'src/app/Models/GetFormInfoDataClass';
import { GetApiDataServiceService } from 'src/app/Service/get-api-data-service.service';
import { GetApiUserService } from 'src/app/Service/get-api-user.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { GetFormInfoGetApiClass } from 'src/app/Models/PostData_API_Class/GetFormInfoGetApiClass';
import { takeWhile } from 'rxjs/operators';
import { UpdateFormInfoGetApiClass } from 'src/app/Models/PostData_API_Class/UpdateFormInfoGetApiClass';

declare let $: any; //use jquery

@Component({
  selector: 'app-update-form-info',
  templateUrl: './update-form-info.component.html',
  styleUrls: ['./update-form-info.component.css']
})
export class UpdateFormInfoComponent implements OnInit, OnDestroy {
  ngOnDestroy(): void {
    // throw new Error("Method not implemented.");
    this.api_subscribe = false;
  }
  api_subscribe = true

  config = {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
      [{ 'align': [] }],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      [{ 'script': 'sub' }, { 'script': 'super' }],      // superscript/subscript
      [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
      [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
      ['link', 'image',],                      // link and image, video
    ],
  };

  NgxFormInfoSelectBox: GetFormInfoDataClass[] = []
  selectFormCode: string = ''
  editFormInfo: GetFormInfoDataClass = new GetFormInfoDataClass()

  constructor(private GetApiDataServiceService: GetApiDataServiceService,
    private GetApiUserService: GetApiUserService,
    private LoadingPage: NgxSpinnerService) { }

  SetMan = { EmpCode: '', EmpName: '' }

  ngOnInit() {

    this.GetApiUserService.counter$.subscribe(
      (x: any) => {
        if (x != 0) {
          this.SetMan = {
            EmpCode: x.EmpCode,
            EmpName: x.EmpNameC
          }
          this.reload()
        }
      })

  }
  reload(){
    var GetFormInfoGetApi: GetFormInfoGetApiClass = { "FormCode": "", "FlowTreeID": "" }
    this.LoadingPage.show()
    this.GetApiDataServiceService.getWebApiData_GetFormInfo(GetFormInfoGetApi)
      .pipe(takeWhile(() => this.api_subscribe))
      .subscribe(
        (GetFormInfoData: GetFormInfoDataClass[]) => {
          this.NgxFormInfoSelectBox = JSON.parse(JSON.stringify(GetFormInfoData))
          this.selectFormCode = GetFormInfoData[0].FormCode.toString()
          this.editFormInfo = GetFormInfoData[0]
          this.LoadingPage.hide()
        },error=>{
          
          this.LoadingPage.hide()
        }
      )
  }

  onSelectChange(selectFormCode) {

    var found = this.NgxFormInfoSelectBox.find(function (element) {
      return element.FormCode == selectFormCode
    });
    this.editFormInfo = found
  }
  
  bt_UpdateFormInfo() {
    var UpdateFormInfoGetApi: UpdateFormInfoGetApiClass = {
      FormInfo: this.editFormInfo,
      KeyMan: this.SetMan.EmpCode,
    }
    this.GetApiDataServiceService.getWebApiData_UpdateFormInfo(UpdateFormInfoGetApi)
      .pipe(takeWhile(() => this.api_subscribe))
      .subscribe(
        (x: any) => {
          if(x == 1){
            this.reload()
             $('#sussesdialog').modal('show')
          }
        },error=>{
        
        }
      )
  }

}
