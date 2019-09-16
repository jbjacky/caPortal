import { Component, OnInit, Output, EventEmitter, OnDestroy, AfterContentInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FileSaverService } from 'ngx-filesaver';
import { LZStringService } from 'ng-lz-string';
import { uploadFileClass } from 'src/app/Models/uploadFileClass';
import { Router, NavigationEnd } from '@angular/router';
import { takeWhile } from 'rxjs/operators';
import { GetApiDataServiceService } from 'src/app/Service/get-api-data-service.service';
import { SettingClass } from 'src/app/Models/SettingClass';

// import  settingJson from 'src/assets/setting.json';

declare var FileUploadType

@Component({
  selector: 'app-fileuploadbutton',
  templateUrl: './fileuploadbutton.component.html',
  styleUrls: ['./fileuploadbutton.component.css']
})
export class FileuploadbuttonComponent implements OnInit, AfterContentInit, OnDestroy {
  ngAfterContentInit(): void {
    // this.router.events
    //   .pipe(takeWhile(() => this.api_subscribe))
    //   .subscribe((e: any) => {
    //     // If it is a NavigationEnd event re-initalise the component
    //     if (e instanceof NavigationEnd) {
    //       this.ngOnInit()
    //     }
    //   });
  }
  api_subscribe = true; //ngOnDestroy時要取消訂閱api的subscribe
  ngOnDestroy(): void {
    // throw new Error("Method not implemented.");
    this.api_subscribe = false;
  }
  fileArray: File[] = [];
  getApiFileData: any;
  errorState = { state: false, errorString: '' };
  constructor(private router: Router,
    private _httpClient: HttpClient,
    private _FileSaverService: FileSaverService,
    private lz: LZStringService,
    private GetApiDataServiceService: GetApiDataServiceService,
  ) {
  }

  ngOnInit() {
    this.fileArray = [];
    // this.GetApiDataServiceService.getWebApiData_GetFileTypeJson()
    //   .subscribe(
    //     (data: SettingClass) => {
    //       // console.log(data)
    //       this.dis_fileType = data.FileUploadType
    //     }
    //   )
    // this.dis_fileType = this.GetApiDataServiceService.getSetting().FileUploadType
    // console.log(this.dis_fileType)
    this.dis_fileType = FileUploadType
    // console.log(this.dis_fileType)
  }
  // ".doc", ".docx", ".ppt", ".pptx", ".xls", ".xlsx", ".jpg", ".txt", ".odt", ".odp", ".ods", ".htm", ".html", ".mht", ".pdf",".jpeg"
  dis_fileType = []
  @Output() fileChange: EventEmitter<any> = new EventEmitter<any>();//返回修改按鈕
  onChangefile(eventFile) {
    // console.log(eventFile[0].name.substr(eventFile[0].name.lastIndexOf('.')+1))
    if (this.dis_fileType.length > 0) {

      var filetypeName = '.' + eventFile[0].name.substr(eventFile[0].name.lastIndexOf('.') + 1)
      // function isVerification(element) {
      //   return element == filetypeName;
      // }
      // var Index = this.dis_fileType.findIndex(isVerification)
      
      var Index = this.dis_fileType.findIndex((element:string) => {
        var check_filetypeName = filetypeName.toLowerCase()
        return element == check_filetypeName;
      })
      if (Index < 0) {
        this.errorState = { state: true, errorString: '檔案格式不能為' + filetypeName }
      } else if (eventFile[0].size > 10485760) {
        //byte(位元組)為單位
        // alert('檔案超過')
        this.errorState = { state: true, errorString: '檔案大小不得超過10MB' }
      } else if (this.fileArray.length >= 5) {
        // alert('不得大於五筆')
        this.errorState = { state: true, errorString: '檔案筆數不得超過五筆' }
      }
      else {
        this.fileArray.push(eventFile[0])
        this.errorState = { state: false, errorString: '' }
        // console.log(this.fileArray)
      }
      this.uploadAllFile();
      this.fileChange.emit(this.getApiFileData);
    }else{
      alert('檔案類型限制失效')
    }

  }
  downloadOnefile(file) {
    const txtBlob = new Blob([file], { type: file.type })
    this._FileSaverService.save(txtBlob, file.name)
  }
  deleteOneFile(i) {
    this.fileArray.splice(i, 1)
    this.errorState = { state: false, errorString: '' }
    this.uploadAllFile();
    this.fileChange.emit(this.getApiFileData);
  }

  base64(apiFile: uploadFileClass) {
    var base64_name = apiFile.UploadName
    var base64_type = apiFile.Type
    // var base64_data = this.lz.decompress(apiFile.Blob)
    var base64_data = apiFile.Blob
    var base64_size = apiFile.Size
    // console.log('解壓縮' + base64_data.length)
    var byteCharacters = atob(base64_data);
    var byteNumbers = new Array(byteCharacters.length);
    for (var i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    var byteArray = new Uint8Array(byteNumbers);

    const txtBlob = new Blob([byteArray], { type: base64_type })
    this._FileSaverService.save(txtBlob, base64_name)
  }

  uploadAllFile() {
    var uploadAllFile_Data: uploadFileClass[] = []
    for (let i = 0; i < this.fileArray.length; i++) {
      // uploadAllFile_Data[i].UploadName = this.fileArray[i].name
      // uploadAllFile_Data[i].Size = this.fileArray[i].size
      // uploadAllFile_Data[i].Type = this.fileArray[i].type

      let reader = new FileReader();
      reader.readAsDataURL(this.fileArray[i]);
      // console.log(reader)
      reader.onload = () => {
        var pushBlob = reader.result.toString().split(',')[1]
        if (pushBlob === null || typeof pushBlob === "undefined") {
          pushBlob = ''
        }
        uploadAllFile_Data.push({
          UploadName: this.fileArray[i].name,
          // Blob: this.lz.compress(reader.result.toString().split(',')[1]),
          Blob: pushBlob,
          Type: this.fileArray[i].type,
          Size: this.fileArray[i].size,
          Description: ''
        })
        // console.log(pushBlob)
        // uploadAllFile_Data[i].Blob = this.lz.compress(reader.result.toString().split(',')[1]);//壓縮過了
        // console.log('壓縮過' + uploadAllFile_Data[i].Blob.length)

        // console.log(JSON.stringify(uploadAllFile_Data[i].Blob))
      };

    }
    uploadAllFile_Data.splice(uploadAllFile_Data.length - 1, 1)
    this.getApiFileData = uploadAllFile_Data;
    // console.log(this.getApiFileData)
  }

}

