import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { interval } from 'rxjs';
import { map, takeWhile, takeUntil } from 'rxjs/operators';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { ViewportScroller } from '@angular/common';

declare let $: any; //use jquery
@Component({
  selector: 'app-salary-search',
  templateUrl: './salary-search.component.html',
  styleUrls: ['./salary-search.component.css']
})
export class SalarySearchComponent implements OnInit {

  @ViewChild('contentPDF') contentPDF: ElementRef;
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
  downPdf() {
    // console.log(this.contentPDF.nativeElement.innerHTML)
    // console.log(document.getElementById('contentPDF'))
    html2canvas(document.querySelector("#contentPDF"), { scrollY: (window.pageYOffset * -1) }).then(canvas => {
      if (window.outerWidth > 800) {
        var img = canvas.toDataURL("image/PNG");
        var doc = new jsPDF('', 'pt', 'a4', 1);

        const bufferX = 5;
        const bufferY = 20;
        const imgProps = (<any>doc).getImageProperties(img);
        const pdfWidth = doc.internal.pageSize.getWidth() - 2 * bufferX;
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
        doc.addImage(img, 'PNG', bufferX, bufferY, pdfWidth, pdfHeight, undefined, 'FAST');
        doc.save('薪資單.pdf');
      } else {
        var imgDataRWD = canvas.toDataURL('image/png');
        var imgWidthRWD = 210;
        var pageHeightRWD = 295;
        var imgHeightRWD = canvas.height * imgWidthRWD / canvas.width;
        var heightLeftRWD = imgHeightRWD;
        var docRWD = new jsPDF('p', 'mm');
        var positionRWD = 0;

        docRWD.addImage(imgDataRWD, 'PNG', 0, positionRWD, imgWidthRWD, imgHeightRWD);
        heightLeftRWD -= pageHeightRWD;

        while (heightLeftRWD >= 0) {
          positionRWD = heightLeftRWD - imgHeightRWD;
          docRWD.addPage();
          docRWD.addImage(imgDataRWD, 'PNG', 0, positionRWD, imgWidthRWD, imgHeightRWD);
          heightLeftRWD -= pageHeightRWD;
        }
        docRWD.save('薪資單.pdf');
      }
    });
  }
}
