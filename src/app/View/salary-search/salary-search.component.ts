import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { interval } from 'rxjs';
import { map, takeWhile, takeUntil } from 'rxjs/operators';
import { ViewportScroller } from '@angular/common';

declare let $: any; //use jquery
@Component({
  selector: 'app-salary-search',
  templateUrl: './salary-search.component.html',
  styleUrls: ['./salary-search.component.css']
})
export class SalarySearchComponent implements OnInit {
  printSectionId = 'contentPDF8'
  constructor(
    private viewScroller: ViewportScroller) { }

  time = 180
  get getTime() { return this.time }
  resetTime() {
    this.time = 180
  }
  time_subscribe = true;
  ngOnInit() {
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

  scrollTo() {
    // $("body").addClass("offcanvas-active")
    if ($("body").hasClass("body-small")) {

    } else {
      if (!$("body").hasClass("offcanvas-active")) {
        $(".col").click();
      }
    }
    this.viewScroller.scrollToAnchor('goPageChange');
    //tag=id連結位置
  }
}
