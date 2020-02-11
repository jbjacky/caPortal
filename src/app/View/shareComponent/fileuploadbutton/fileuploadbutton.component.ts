import { Component, OnInit, Output, EventEmitter, OnDestroy, AfterContentInit, Input } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FileSaverService } from 'ngx-filesaver';
import { uploadFileClass } from 'src/app/Models/uploadFileClass';
import { Router, NavigationEnd } from '@angular/router';
import { takeWhile } from 'rxjs/operators';
import { GetApiDataServiceService } from 'src/app/Service/get-api-data-service.service';
import { SettingClass } from 'src/app/Models/SettingClass';
import { FileDownloadService } from 'src/app/Service/file-download.service';

// import  settingJson from 'src/assets/setting.json';

declare var FileUploadType

@Component({
  selector: 'app-fileuploadbutton',
  templateUrl: './fileuploadbutton.component.html',
  styleUrls: ['./fileuploadbutton.component.css']
})
export class FileuploadbuttonComponent implements OnInit, OnDestroy {
  api_subscribe = true; //ngOnDestroy時要取消訂閱api的subscribe
  ngOnDestroy(): void {
    this.api_subscribe = false;
  }
  getApiFileData: uploadFileClass[] = [];
  errorState = { state: false, errorString: '' };
  constructor(private FileDownload: FileDownloadService) {
  }
  @Input() editFileArray: uploadFileClass[]
  ngOnInit() {
    if (this.editFileArray) {
      this.getApiFileData = JSON.parse(JSON.stringify(this.editFileArray))
    } else {
      this.getApiFileData = []
    }

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
      var Index = this.dis_fileType.findIndex((element: string) => {
        var check_filetypeName = filetypeName.toLowerCase()
        return element == check_filetypeName;
      })
      if (Index < 0) {
        this.errorState = { state: true, errorString: '檔案格式不能為' + filetypeName }
      } else if (eventFile[0].size > 10485760) {
        //byte(位元組)為單位
        // alert('檔案超過')
        this.errorState = { state: true, errorString: '檔案大小不得超過10MB' }
      } else if (this.getApiFileData.length >= 5) {
        // alert('不得大於五筆')
        this.errorState = { state: true, errorString: '檔案筆數不得超過五筆' }
      }
      else {
        this.errorState = { state: false, errorString: '' }
        let reader = new FileReader();
        reader.readAsDataURL(eventFile[0]);
        reader.onload = () => {
          var pushBlob = reader.result.toString().split(',')[1]
          if (pushBlob === null || typeof pushBlob === "undefined") {
            pushBlob = ''
          }
          this.getApiFileData.push({
            UploadName: eventFile[0].name,
            Blob: pushBlob,
            Type: eventFile[0].type,
            Size: eventFile[0].size,
            Description: ''
          })
          this.fileChange.emit(this.getApiFileData);
        };
      }
    } else {
      alert('檔案類型限制失效')
    }

  }
  downloadOnefile(apiFile: uploadFileClass) {
    this.FileDownload.base64(apiFile)
  }
  deleteOneFile(i) {
    this.getApiFileData.splice(i, 1)
    this.errorState = { state: false, errorString: '' }
    this.fileChange.emit(this.getApiFileData);
  }

}

