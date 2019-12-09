import { Component, OnInit, AfterContentInit, OnDestroy } from '@angular/core';
import { GetApiDataServiceService } from 'src/app/Service/get-api-data-service.service';
import { GetNewsClass } from 'src/app/Models/PostData_API_Class/GetNewsClass';
import { formatDateTime } from 'src/app/UseVoid/void_doFormatDate';
import { asQueryList } from '@angular/core/src/view';
import { Router } from '@angular/router';
import { takeWhile } from 'rxjs/operators';
import { NgxSpinnerService } from 'ngx-spinner';
import { GetFormMailClass } from 'src/app/Models/PostData_API_Class/GetFormMailClass';
import { GetFormMailDataClass } from 'src/app/Models/GetFormMailDataClass';
import { FormColumnsClass } from 'src/app/Models/FormColumnsClass';
import { GetApiUserService } from 'src/app/Service/get-api-user.service';
import { GetBaseInfoDetailClass } from 'src/app/Models/GetBaseInfoDetailClass';
import { GetFormInfoGetApiClass } from 'src/app/Models/PostData_API_Class/GetFormInfoGetApiClass';
import { GetFormInfoDataClass } from 'src/app/Models/GetFormInfoDataClass';


declare var $;

@Component({
  selector: 'app-email-content-edit',
  templateUrl: './email-content-edit.component.html',
  styleUrls: ['./email-content-edit.component.css']
})
export class EmailContentEditComponent implements OnInit, AfterContentInit, OnDestroy {
  ngOnDestroy(): void {
    // throw new Error("Method not implemented.");
    this.api_subscribe = false;
  }
  api_subscribe = true
  ngAfterContentInit(): void {
  }

  GetFormMailDataArray: GetFormMailDataClass[] = []
  chooseFormCode: any = ''
  constructor(private GetApiDataServiceService: GetApiDataServiceService,
    private GetApiUserService: GetApiUserService,
    private router: Router,
    private LoadingPage: NgxSpinnerService) { }


  FirstMan: GetBaseInfoDetailClass = new GetBaseInfoDetailClass() ///左上角操作人員
  GetFormInfos: GetFormInfoDataClass[]=[]
  loading = false
  ngOnInit() {
    this.GetApiUserService.counter$.subscribe(
      (x: any) => {
        if (x == 0) {
        } else {
          this.FirstMan = x

          var GetFormInfoGetApi: GetFormInfoGetApiClass = { "FormCode": "", "FlowTreeID": "" }
          this.GetApiDataServiceService.getWebApiData_GetFormInfo(GetFormInfoGetApi)
            .pipe(takeWhile(() => this.api_subscribe))
            .subscribe(
              (GetFormInfoData: GetFormInfoDataClass) => {
                this.GetFormInfos = JSON.parse(JSON.stringify(GetFormInfoData))
                this.loading = true 
                this.onGetFormMailData()
                this.onGetFormColumns()
              }
            )
        }
      }
    )
  }

  onGetFormMailData() {
    this.LoadingPage.show()
    var GetFormMail: GetFormMailClass = { "FormCode": this.chooseFormCode, "Code": "" }
    this.GetApiDataServiceService.getWebApiData_GetFormMail(GetFormMail)
      .pipe(takeWhile(() => this.api_subscribe))
      .subscribe(
        (x: GetFormMailDataClass[]) => {
          this.GetFormMailDataArray = x
          for (let one of this.GetFormMailDataArray) {
            one.KeyDate = formatDateTime(one.KeyDate).getDate
          }
          this.LoadingPage.hide()
        }, error => {
          this.LoadingPage.hide()
        }
      )
  }
  changeChooseFormCode() {

    var GetFormMail: GetFormMailClass = { "FormCode": this.chooseFormCode, "Code": "" }
    this.GetApiDataServiceService.getWebApiData_GetFormMail(GetFormMail)
      .subscribe(
        (x: GetFormMailDataClass[]) => {
          this.GetFormMailDataArray = x
          for (let one of this.GetFormMailDataArray) {
            one.KeyDate = formatDateTime(one.KeyDate).getDate
          }
        }
      )
  }
  editFormMailData: GetFormMailDataClass = new GetFormMailDataClass()
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
  bt_editEmail(GetFormMailData: GetFormMailDataClass) {
    this.editFormMailData = GetFormMailData
    $('#editEmailDialog').modal('show')
  }

  bt_SaveFormMail(GetFormMailData: GetFormMailDataClass) {
    var save = {
      "FormCode": GetFormMailData.FormCode,
      "Code": GetFormMailData.Code,
      "Name": GetFormMailData.Name,
      "Subject": GetFormMailData.Subject,
      "Body": GetFormMailData.Body,
      "Note": GetFormMailData.Note,
      "KeyMan": this.FirstMan.EmpCode
    }
    this.GetApiDataServiceService.getWebApiData_SaveFormMail(save)
      .subscribe(
        (x: any) => {
          if (x == 1) {
            $('#editEmailDialog').modal('hide')
            this.onGetFormMailData()
          }
        },
        error => {

        }
      )
  }

  delEmail: GetFormMailDataClass
  chechDelEmail(GetFormMailData: GetFormMailDataClass) {
    this.delEmail = GetFormMailData
    $('#delEmail_checksenddialog').modal('show')
  }

  bt_delEmail() {
    this.GetApiDataServiceService.getWebApiData_DeleteFormMail(this.delEmail.AutoKey)
      .subscribe(
        (x: any) => {
          this.onGetFormMailData()
        }, error => {

        }
      )
  }

  showFormColumns: FormColumnsClass[] = []
  onGetFormColumns() {
    this.GetApiDataServiceService.getWebApiData_GetFormColumn()
      .subscribe(
        (x: FormColumnsClass[]) => {
          this.showFormColumns = x
        },
        error => {

        }
      )

  }
}
