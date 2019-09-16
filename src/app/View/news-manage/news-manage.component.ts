import { Component, OnInit, AfterContentInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { GetApiDataServiceService } from 'src/app/Service/get-api-data-service.service';
import { GetNewsClass } from 'src/app/Models/PostData_API_Class/GetNewsClass';
import { formatDateTime } from 'src/app/UseVoid/void_doFormatDate';
import { Router } from '@angular/router';
import { takeWhile, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { NgxSpinnerService } from 'ngx-spinner';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { fromEvent } from 'rxjs';
declare var $;

export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}

@Component({
  selector: 'app-news-manage',
  templateUrl: './news-manage.component.html',
  styleUrls: ['./news-manage.component.css']
})
export class NewsManageComponent implements OnInit, AfterContentInit, OnDestroy {
  ngOnDestroy(): void {
    // throw new Error("Method not implemented.");
    this.api_subscribe = false;
  }
  api_subscribe = true
  ngAfterContentInit(): void {
  }
  constructor(private GetApiDataServiceService: GetApiDataServiceService,
    private router: Router,
    private LoadingPage: NgxSpinnerService) { }

  displayedColumns: string[] = ['ShowNewsHead', 'PostDate', 'PostDeadline', 'Sort','KeyMan','UpdateDate', 'NewsID'];
  dataSource = new MatTableDataSource<any>();
  totalCount
  AllNewsList:GetNewsClass[] = []
  @ViewChild('filter') filter: ElementRef;
  @ViewChild('sortTable') sortTable: MatSort;
  @ViewChild('paginator') paginator: MatPaginator;
  ngOnInit() {
    fromEvent(this.filter.nativeElement, 'keyup').pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(() => {
      this.dataSource.filter = (this.filter.nativeElement as HTMLInputElement).value;
    });
    this.getAllEditNews();
    // this.totalCount = ELEMENT_DATA.length;
    // this.dataSource.data =  ELEMENT_DATA
    // this.dataSource.paginator = this.paginator;
  }
  getAllEditNews() {
    this.LoadingPage.show()
    this.GetApiDataServiceService.getWebApiData_GetNews()
      .pipe(takeWhile(() => this.api_subscribe))
      .subscribe(
        (x: GetNewsClass[]) => {

          let fontlength = 35

          for (let data of x) {
            data.PostDate = formatDateTime(data.PostDate).getDate
            data.PostDeadline = formatDateTime(data.PostDeadline).getDate
            data.UpdateDate = formatDateTime(data.UpdateDate).getDate

            if (data.NewsHead.length > fontlength) {
              var title_slice = data.NewsHead.slice(0, fontlength)
              title_slice += '......';
              data.ShowNewsHead = title_slice;
            } else {
              data.ShowNewsHead = data.NewsHead
            }

          }
          this.AllNewsList = x

          this.totalCount = this.AllNewsList.length;
          this.dataSource.data = this.AllNewsList
          this.dataSource.sort = this.sortTable;
          this.dataSource.paginator = this.paginator;

          this.LoadingPage.hide()
        },
        error => {
          // alert('與api連線異常，getWebApiData_GetNews')
          this.LoadingPage.hide()
        }
      )
  }

  delID: string; //刪除的ID
  delOneNewsData() {

    this.LoadingPage.show()
    this.GetApiDataServiceService.getWebApiData_DeleteNews(this.delID)
      .pipe(takeWhile(() => this.api_subscribe))
      .subscribe(
        (x: any) => {
          // console.log(x)
          if (x == 1) {
            this.getAllEditNews();
            this.LoadingPage.hide()
          }
        },
        error => {
          // alert('與api連線失敗，getWebApiData_DeleteNews')
          this.LoadingPage.hide()
        }
      )
  }
  delButtonClick(NewsID: string) {
    // alert('del'+NewsID)
    this.delID = NewsID;
    $('#delNews_checksenddialog').modal('show');

  }
  editButtonClick(NewsID: string) {
    this.router.navigate(['/nav/NewsDataEditComponent', NewsID])
  }

  newEditorClick() {
    this.router.navigate(['/nav/NewsAddComponent'])
  }

}
