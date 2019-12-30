import { Injectable } from '@angular/core';
import { FileSaverService } from "ngx-filesaver";
import { uploadFileClass } from '../Models/uploadFileClass';
import { Location } from '@angular/common';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class FileDownloadService {
  constructor(private router: Router,
    private _FileSaverService: FileSaverService,
    private location: Location) { }

  base64(apiFile: uploadFileClass) {
    var base64_name = apiFile.UploadName
    var base64_type = apiFile.Type
    // var base64_data = this.lz.decompress(apiFile.Blob)
    var base64_data = apiFile.Blob
    var base64_size = apiFile.Size
    // console.log('解壓縮' + base64_data.length)
    var byteCharacters
    var byteNumbers 
    if  (base64_data === null || typeof  base64_data === "undefined") {
      byteCharacters = base64_data
      byteNumbers = []
      // console.log('null')
    } else {
      // console.log('havedata')
      byteCharacters = atob(base64_data);
      byteNumbers = new Array(byteCharacters.length);
      for (var i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
    }

    var byteArray = new Uint8Array(byteNumbers);

    const txtBlob = new Blob([byteArray], { type: base64_type })
    this._FileSaverService.save(txtBlob, base64_name)

    // this.location.go('?NewTab=Y')
    // this.location.replaceState('?NewTab=Y')
    
    this.location.replaceState(this.router.url+'?NewTab=Y');//手機開啟附件回頁面用
  }
}
