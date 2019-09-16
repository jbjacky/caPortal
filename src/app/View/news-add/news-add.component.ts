import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { GetApiDataServiceService } from 'src/app/Service/get-api-data-service.service';
import { SaveNewsClass } from 'src/app/Models/PostData_API_Class/SaveNewsClass';
import { GetNewsClass } from 'src/app/Models/PostData_API_Class/GetNewsClass';
import { Router } from '@angular/router';
import { takeWhile } from 'rxjs/operators';
import { doFormatDate } from 'src/app/UseVoid/void_doFormatDate';
import { ExampleHeader } from 'src/app/Service/datepickerHeader';
import { uploadFileClass } from 'src/app/Models/uploadFileClass';
import { GetApiUserService } from 'src/app/Service/get-api-user.service';
import { GetBaseInfoDetailClass } from 'src/app/Models/GetBaseInfoDetailClass';
declare var $
@Component({
  selector: 'app-news-add',
  templateUrl: './news-add.component.html',
  styleUrls: ['./news-add.component.css']
})
export class NewsAddComponent implements OnInit, AfterViewInit, OnDestroy {
  exampleHeader = ExampleHeader //日期套件header
  ngOnDestroy(): void {
    // throw new Error("Method not implemented.");
    this.api_subscribe = false;
  }
  api_subscribe = true
  ngAfterViewInit(): void {
  }
  // fonts = ['Helvetica','fantasy','SimSun', 'SimHei', 'Microsoft-YaHei', 'KaiTi', 'FangSong', 'Arial', 'Times-New-Roman', 'sans-serif'];
  htmlContent: any = ``
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
  constructor(
    private GetApiUserService: GetApiUserService,
    private GetApiDataServiceService: GetApiDataServiceService,
    private router: Router, ) { }

  SearchMan: GetBaseInfoDetailClass = new GetBaseInfoDetailClass()
  ngOnInit() {
    this.getNewsDetail.Sort = 0

    this.GetApiUserService.counter$
      .pipe(takeWhile(() => this.api_subscribe))
      .subscribe(
        (x: any) => {
          if (x != 0) {
            this.SearchMan = x
          }
        }
      )
  }
  checkUploadClick() {
    // console.log(this.upload)
    $('#AddNews_checksenddialog').modal('show');
  }

  getNewsDetail: GetNewsClass = new GetNewsClass();
  uploadClick() {

    var PostDate = doFormatDate(this.getNewsDetail.PostDate.toString())
    var PostDeadline = doFormatDate(this.getNewsDetail.PostDeadline.toString())
    if (PostDeadline < PostDate) {
      alert('失效日不得小於生效日')
    } {
      var SaveNews: SaveNewsClass = {

        NewsID: '',
        NewsHead: this.getNewsDetail.NewsHead,
        NewsBody: this.htmlContent,
        PostDate: PostDate,
        PostDeadline: PostDeadline,
        IsOn: true,
        Sort: this.getNewsDetail.Sort,
        KeyMan: this.SearchMan.EmpID,
        UploadFileOld: null,
        UploadFileNew: this.getNewsDetail.UploadFileNew
      }
      // console.log(SaveNewsClass)
      this.GetApiDataServiceService.getWebApiData_SaveNews(SaveNews)
        .pipe(takeWhile(() => this.api_subscribe))
        .subscribe(
          x => {
            // console.log(x)
            if (x == 2) {
              this.router.navigate(['nav/NewsManageComponent']);
            }
          },
          error => {
            // alert('與api連線異常，getWebApiData_SaveNews')
          }
        )

    }
  }

  onSaveFile(event) {
    this.getNewsDetail.UploadFileNew = event;
  }

}

