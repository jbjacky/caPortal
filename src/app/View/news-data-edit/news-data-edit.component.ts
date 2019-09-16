import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { GetApiDataServiceService } from 'src/app/Service/get-api-data-service.service';
import { GetNewsClass } from 'src/app/Models/PostData_API_Class/GetNewsClass';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import { formatDateTime, doFormatDate } from 'src/app/UseVoid/void_doFormatDate';
import { SaveNewsClass } from 'src/app/Models/PostData_API_Class/SaveNewsClass';
import { NgxSpinnerService } from 'ngx-spinner';
import { ExampleHeader } from 'src/app/Service/datepickerHeader';
import { uploadFileClass } from 'src/app/Models/uploadFileClass';
import { GetNewsByIDGetApiClass } from 'src/app/Models/PostData_API_Class/GetNewsByIDGetApiClass';
import { showUploadFileClass } from 'src/app/Models/showUploadFileClass';
import { takeWhile } from 'rxjs/operators';
import { FileDownloadService } from 'src/app/Service/file-download.service';
import { GetApiUserService } from 'src/app/Service/get-api-user.service';
import { GetBaseInfoDetailClass } from 'src/app/Models/GetBaseInfoDetailClass';
declare var $
@Component({
  selector: 'app-news-data-edit',
  templateUrl: './news-data-edit.component.html',
  styleUrls: ['./news-data-edit.component.css']
})
export class NewsDataEditComponent implements OnInit, AfterViewInit, OnDestroy {
  ngOnDestroy(): void {
    // throw new Error("Method not implemented.");
    this.api_subscribe = false;
  }
  api_subscribe = true; //ngOnDestroy時要取消訂閱api的subscribe
  exampleHeader = ExampleHeader
  id: any;
  config = {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
      [{ 'align': [] }],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      [{ 'script': 'sub' }, { 'script': 'super' }],      // superscript/subscript
      [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
      [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
      ['link', 'image',],                      // link and image, video

      // [{'font': []}],
      // [{ 'header': 1 }, { 'header': 2 }],               // custom button values
      // [{ 'indent': '-1' }, { 'indent': '+1' }],          // outdent/indent
      // [{ 'direction': 'rtl' }],                         // text direction
      // ['blockquote', 'code-block'],
      // [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      // ['link', 'image', 'video'],                      // link and image, video
      // ['clean'],                                         // remove formatting button
    ],
  };

  ngAfterViewInit(): void {

  }
  getNewsDetail: GetNewsClass = new GetNewsClass();
  constructor(private route: ActivatedRoute,
    private GetApiUserService: GetApiUserService,
    private GetApiDataServiceService: GetApiDataServiceService,
    private router: Router,
    private LoadingPage: NgxSpinnerService,
    private FileDownloadService: FileDownloadService, ) { }
  SearchMan: GetBaseInfoDetailClass = new GetBaseInfoDetailClass()
  ngOnInit() {
    this.route.paramMap.subscribe((params: ParamMap) => {
      this.id = params.get('id'); // (+) converts string 'id' to a number
      // console.log(this.id)

      this.GetApiUserService.counter$
        .pipe(takeWhile(() => this.api_subscribe))
        .subscribe(
          (x: any) => {
            if (x != 0) {
              this.SearchMan = x
              var GetNewsByIDGetApi: GetNewsByIDGetApiClass = {
                "NewsID": this.id,
                "Miniature": true
              }
              this.GetApiDataServiceService.getWebApiData_GetNewsByID(GetNewsByIDGetApi)
                .subscribe(
                  (x: GetNewsClass[]) => {
                    // console.log(x)
        
                    x[0].PostDate = new Date(formatDateTime(x[0].PostDate).getDate)
                    x[0].PostDeadline = new Date(formatDateTime(x[0].PostDeadline).getDate)
                    this.getNewsDetail = x[0]
                    // console.log(this.getNewsDetail)
                  }, error => {
                    // alert('與api連線異常，getWebApiData_GetNewsByID')
                  }
                )
            }
          }
        )
    });
  }

  checkUploadClick() {
    // console.log(this.upload)
    $('#AddNews_checksenddialog').modal('show');
  }

  editClick() {
    var PostDate = doFormatDate(this.getNewsDetail.PostDate.toString())
    var PostDeadline = doFormatDate(this.getNewsDetail.PostDeadline.toString())
    if (PostDeadline < PostDate) {
      alert('失效日不得小於生效日')
    } else {

      this.getNewsDetail.PostDate = PostDate
      this.getNewsDetail.PostDeadline = PostDeadline
      var SaveNews: SaveNewsClass = {

        NewsID: this.getNewsDetail.NewsID,
        NewsHead: this.getNewsDetail.NewsHead,
        NewsBody: this.getNewsDetail.NewsBody,
        PostDate: PostDate,
        PostDeadline: PostDeadline,
        IsOn: this.getNewsDetail.IsOn,
        Sort: this.getNewsDetail.Sort,
        KeyMan: this.SearchMan.EmpID,
        UploadFileOld: this.getNewsDetail.UploadFileOld,
        UploadFileNew: this.getNewsDetail.UploadFileNew
      }
      this.LoadingPage.show()
      this.GetApiDataServiceService.getWebApiData_SaveNews(SaveNews)
        .subscribe(
          x => {
            if (x == 1) {
              alert('修改成功')
              this.router.navigate(['/nav/NewsManageComponent'])
              this.LoadingPage.hide()
            }
          }, error => {
            // alert('與api連線異常，getWebApiData_SaveNews')
            this.LoadingPage.hide()
          }

        )
    }
  }

  onSaveFile(event) {
    this.getNewsDetail.UploadFileNew = event;
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
      //     //   } else {
      //     //     alert('Not found file')
      //     //   }
      //     // } else {
      //     //   alert('Not found file')
      //     // }
      //     this.LoadingPage.hide()
      //   }
      //   , error => {
      //     this.LoadingPage.hide()
      //   }
      // )
  }


  bt_delUploadClick(upload: showUploadFileClass) {
    // console.log(upload)
    // console.log(this.getNewsDetail.UploadFileOld)
    var foundIndex = this.getNewsDetail.UploadFileOld.findIndex((x) => {
      return x.ServerName == upload.ServerName
    })
    this.getNewsDetail.UploadFileOld.splice(foundIndex, 1);
    // console.log(this.getNewsDetail)
  }

}
