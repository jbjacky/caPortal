import { Component, OnDestroy, ChangeDetectionStrategy, Inject, Host, ChangeDetectorRef, Input } from '@angular/core';


import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE, MatDateFormats } from '@angular/material/core';
import { MatCalendar } from '@angular/material/datepicker';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { doFormatDate } from '../UseVoid/void_doFormatDate';

@Component({
    selector: 'example-header',
    styles: [`
    .example-header {
      display: flex;
      align-items: center;
      padding: 0.5em;c
    }

    .example-header-label {
      flex: 1;
      height: 1em;
      font-weight: 500;
      text-align: center;
    }

    .example-double-arrow .mat-icon {
      margin: -22%;
    }
    span:hover {
        color: #23b7e5;
    }
    .btClass{
        background: 0;
        border: 0;padding:0px 20px;
    }
    .btClass:hover{
        color: #23b7e5;
    }
    .caldiv{
        display: flex;
        align-items: center;
        padding: 20px 0px;
        
    }
    .calheader{
        flex: 1;
        font-weight: 500;
        text-align: center;
    }
  `],
    template: `
    <div class="caldiv">

      <button class="btClass" (click)="previousClicked('month')">
        <span class="glyphicon glyphicon-menu-left" aria-hidden="true"></span>
      </button>
      <div class="calheader">
        <span style="cursor: pointer;" (click)="yearViewClicked()">{{yearLable}}</span>
      </div>
      <button class="btClass" (click)="nextClicked('month')" >
        <span class="glyphicon glyphicon-menu-right" aria-hidden="true"></span>
      </button>

    </div>`,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExampleHeaderMonth<Moment> implements OnDestroy {

    private destroyed = new Subject<void>();

    constructor(
        private calendar: MatCalendar<any>, private dateAdapter: DateAdapter<any>,
        @Inject(MAT_DATE_FORMATS) private dateFormats: MatDateFormats, cdr: ChangeDetectorRef) {
        calendar.stateChanges
            .pipe(takeUntil(this.destroyed))
            .subscribe(() => cdr.markForCheck());
    }

    ngOnDestroy() {
        this.destroyed.next();
        this.destroyed.complete();
    }
    get monthLable(){
        return doFormatDate(this.calendar.activeDate).split('/')[1] 
    }
    get yearLable(){
        return doFormatDate(this.calendar.activeDate).split('/')[0] 
    }
    get periodLabel() {
        return this.dateAdapter
            .format(this.calendar.activeDate, this.dateFormats.display.monthYearLabel)
            .toLocaleUpperCase();
    }

    previousClicked(mode: 'month' | 'year') {
        this.calendar.activeDate = mode === 'year' ?
            this.dateAdapter.addCalendarMonths(this.calendar.activeDate, -1) :
            this.dateAdapter.addCalendarYears(this.calendar.activeDate, -1);
    }

    nextClicked(mode: 'month' | 'year') {
        this.calendar.activeDate = mode === 'year' ?
            this.dateAdapter.addCalendarMonths(this.calendar.activeDate, 1) :
            this.dateAdapter.addCalendarYears(this.calendar.activeDate, 1);
    }


    yearViewClicked() {
        this.calendar.currentView = 'multi-year';
    }
    monthViewClicked() {
        this.calendar.currentView = 'year';
    }
}