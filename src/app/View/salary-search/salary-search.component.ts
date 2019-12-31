import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { interval } from 'rxjs';
import { map, takeWhile, takeUntil } from 'rxjs/operators';
import { ViewportScroller } from '@angular/common';
import { Router } from '@angular/router';
import { GetApiDataServiceService } from 'src/app/Service/get-api-data-service.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { GetApiUserService } from 'src/app/Service/get-api-user.service';
import { BlockClass, GetblockDetailDetailApiDataClass } from 'src/app/Models/GetblockDetailDetailApiDataClass';
import { chinesenum } from 'src/app/UseVoid/void_chinesenumber';

declare let $: any; //use jquery
@Component({
  selector: 'app-salary-search',
  templateUrl: './salary-search.component.html',
  styleUrls: ['./salary-search.component.css']
})
export class SalarySearchComponent implements OnInit, OnDestroy {
  ngOnDestroy(): void {
    this.api_subscribe = false;
  }
  api_subscribe = true; //ngOnDestroy時要取消訂閱api的subscribe
  constructor(
    private GetApiUserService: GetApiUserService,
    private GetApiDataServiceService: GetApiDataServiceService,
    private viewScroller: ViewportScroller,
    private LoadingPage: NgxSpinnerService,
    private router: Router) { }

  time = 180
  get getTime() { return this.time }
  resetTime() {
    this.time = 180
  }
  time_subscribe = true;
  styleFileHref = window.location.href.split(this.router.url)[0] + '/assets/css/bootstrap.css'
  styleFileHrefPage = window.location.href.split(this.router.url)[0] + '/assets/css/SalarySearchComponent.css'

  searchSalary = { year: '', Month: '', period: '' };
  yearSelectArray = []
  monthSelectArray = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
  periodSelectArray = [1, 2, 3, 4]

  ngOnInit() {
    // var ch_periodSelectArray = []
    // for (let i of this.periodSelectArray) {
    //   ch_periodSelectArray.push(chinesenum(i))
    // }
    // this.periodSelectArray = JSON.parse(JSON.stringify(ch_periodSelectArray))
    var todayYear = new Date()
    this.yearSelectArray.push((todayYear.getFullYear() + 1).toString())
    this.yearSelectArray.push(todayYear.getFullYear().toString())
    this.yearSelectArray.push((todayYear.getFullYear() - 1).toString())

    this.searchSalary = {
      year: todayYear.getFullYear().toString(),
      Month: (todayYear.getMonth() + 1).toString(),
      period: '2'
    };
    // console.log(this.styleFileHref)
    interval(1000)
      .pipe(
        map((x) => {
          if (this.time > 1) {
            this.time = this.time - 1
          } else if (this.time == 1) {
            this.time = this.time - 1
            // console.log('執行')
          }
        })
      ).toPromise();
  }

  firstPwFromGroup: FormGroup = new FormGroup({
    empID: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required),
    checkPassword: new FormControl('', Validators.required)
  })
  submit() {
  }

  showSarly: uiGetblockDetailDetailApiDataClass
  bt_Search() {
    this.LoadingPage.show()
    var year = this.searchSalary.year.toString()
    var Month = this.searchSalary.Month.toString()
    var period = this.searchSalary.period.toString()
    this.GetApiDataServiceService.getWebApiData_GetblockDetailDetail(year, Month, period)
      .pipe(takeWhile(() => this.api_subscribe))
      .subscribe(
        (x: GetblockDetailDetailApiDataClass) => {
          this.showSarly = JSON.parse(JSON.stringify(x))
          if (x.BlockClass) {
            for (let i of x.BlockClass) {
              switch (i.order) {
                case 1:
                  this.showSarly.oneBlockClass = JSON.parse(JSON.stringify(i));
                  break;
                case 2:
                  this.showSarly.twoBlockClass = JSON.parse(JSON.stringify(i));
                  break;
                case 3:
                  this.showSarly.threeBlockClass = JSON.parse(JSON.stringify(i));
                  break;
                case 4:
                  this.showSarly.fourBlockClass = JSON.parse(JSON.stringify(i));
                  break;
                case 5:
                  this.showSarly.fiveBlockClass = JSON.parse(JSON.stringify(i));
                  break;
                case 6:
                  this.showSarly.sixBlockClass = JSON.parse(JSON.stringify(i));
                  break;
                case 7:
                  this.showSarly.sevenBlockClass = JSON.parse(JSON.stringify(i));
                  break;
                case 8:
                  this.showSarly.eightBlockClass = JSON.parse(JSON.stringify(i));
                  break;
              }
            }
          }

          // console.log(this.showSarly)
          this.GetApiUserService.scrollTo();
          this.LoadingPage.hide()
        }, error => {
          this.LoadingPage.hide()
        }
      )
  }
}

interface uiGetblockDetailDetailApiDataClass {
  Title: string;
  DateIntervalTitle: string;
  TransferTitle: string;
  useTemplate: string;
  NoteBloc: string;
  oneBlockClass: BlockClass;
  twoBlockClass: BlockClass;
  threeBlockClass: BlockClass;
  fourBlockClass: BlockClass;
  fiveBlockClass: BlockClass;
  sixBlockClass: BlockClass;
  sevenBlockClass: BlockClass;
  eightBlockClass: BlockClass;
}
