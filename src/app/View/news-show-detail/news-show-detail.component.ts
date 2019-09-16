import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { GetNewsClass } from 'src/app/Models/PostData_API_Class/GetNewsClass';

import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import { GetApiDataServiceService } from 'src/app/Service/get-api-data-service.service';
import { formatDateTime } from 'src/app/UseVoid/void_doFormatDate';
import { GetNewsByIDGetApiClass } from 'src/app/Models/PostData_API_Class/GetNewsByIDGetApiClass';
import { showUploadFileClass } from 'src/app/Models/showUploadFileClass';
import { takeWhile } from 'rxjs/operators';
import { NgxSpinnerService } from 'ngx-spinner';
import { FileDownloadService } from 'src/app/Service/file-download.service';

@Component({
  selector: 'app-news-show-detail',
  templateUrl: './news-show-detail.component.html',
  styleUrls: ['./news-show-detail.component.css']
})
export class NewsShowDetailComponent implements OnInit , OnDestroy {
  ngOnDestroy(): void {
    // throw new Error("Method not implemented.");
    this.api_subscribe = false;
  }
  api_subscribe = true; //ngOnDestroy時要取消訂閱api的subscribe
  id: any;
  getNewsDetail:GetNewsClass = new GetNewsClass();
  
  @Output() goback: EventEmitter<number> = new EventEmitter<number>();//回列表
  constructor(private route: ActivatedRoute,
    private GetApiDataServiceService: GetApiDataServiceService,
    private router: Router,
    private LoadingPage: NgxSpinnerService,
    private FileDownloadService: FileDownloadService,) {}

  ngOnInit() {
    this.route.paramMap.subscribe((params: ParamMap) => {
       this.id = params.get('id'); // (+) converts string 'id' to a number
        // console.log(this.id)
      var GetNewsByIDGetApi: GetNewsByIDGetApiClass = {
        "NewsID":this.id,
        "Miniature":false
      }
        this.GetApiDataServiceService.getWebApiData_GetNewsByID(GetNewsByIDGetApi)
        .subscribe(
          (x:GetNewsClass[])=>{
            // console.log(x)
            x[0].PostDate = formatDateTime(x[0].PostDate).getDate
            this.getNewsDetail = x[0]
          }
        )
    });
  }
  
  previouspage() {
    //回列表
      this.router.navigate(['/nav/NewsShowAllComponent']);
  }

  base64_NotFlow(upload: showUploadFileClass) {
    // console.log(upload)
    // this.LoadingPage.show()
    this.GetApiDataServiceService.getWebApiData_GetUploadFileByStreamOnly(upload.ServerName)
      // .pipe(takeWhile(() => this.api_subscribe))
      // .subscribe(
      //   (data: Array<any>) => {
      //     // console.log(data)
      //     // if (data) {
      //     //   if (data.length > 0) {
      //     //     this.FileDownloadService.base64(data[0])
      //     //   }else{
      //     //     alert('Not found file')
      //     //   }
      //     // }else{
      //     //   alert('Not found file')
      //     // }
      //     this.LoadingPage.hide()
      //   }
      //   , error => {
      //     this.LoadingPage.hide()
      //   }
      // )
  }

}
