import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { FullCalendarOptions, EventObject, FullCalendarComponent } from 'ngx-fullcalendar';
import { NgxSpinnerService } from 'ngx-spinner';
import { GetApiDataServiceService } from 'src/app/Service/get-api-data-service.service';
import { GetApiUserService } from 'src/app/Service/get-api-user.service';
import { takeWhile, mergeMap, map, toArray } from 'rxjs/operators';
import { doFormatDate, formatDateTime, getapi_formatTimetoString } from 'src/app/UseVoid/void_doFormatDate';
import { GetDeptDataClass } from 'src/app/Models/GetDeptDataClass';
import { GetAbsDetailByDeptGetApiClass } from 'src/app/Models/PostData_API_Class/GetAbsDetailByDeptGetApiClass';
declare var $: any;
@Component({
  selector: 'app-dept-calendar-search',
  templateUrl: './dept-calendar-search.component.html',
  styleUrls: ['./dept-calendar-search.component.css']
})
export class DeptCalendarSearchComponent implements OnInit, OnDestroy {
  ngOnDestroy(): void {
    // throw new Error("Method not implemented.");
    this.api_subscribe = false;
  }
  api_subscribe = true; //ngOnDestroy時要取消訂閱api的subscribe
  options: FullCalendarOptions;
  events: EventObject[];
  constructor(
    private GetApiUserService: GetApiUserService,
    private GetApiDataServiceService: GetApiDataServiceService,
    private LoadingPage: NgxSpinnerService, ) { }
  @ViewChild('calendar') calendar: FullCalendarComponent;
  today = new Date()
  setMan = { EmpCode: '', EmpName: '', DeptID: '', DeptaName: '' }
  plugin: any

  SearchDeptID

  NgxDeptSelectBox: GetDeptDataClass[] = []

  ngOnInit() {
    this.options = {
      defaultDate: this.today,
      editable: false,
      droppable: false,
      eventLimit: 5, // for all non-TimeGrid views
      header: {
        left: ['prev', 'next', 'today'].join(','),
        center: 'title',
        right: ['month', 'agendaWeek', 'agendaDay'].join(',')
      },
      titleFormat: { year: 'numeric', month: 'long', day: 'numeric' },
      titleRangeSeparator: '-',
      eventStartEditable: false
    };

    this.GetApiUserService.counter$
      .pipe(takeWhile(() => this.api_subscribe))
      .subscribe(
        (x: any) => {
          if (x != 0) {
            this.setMan = {
              EmpCode: x.EmpCode,
              EmpName: x.EmpNameC,
              DeptID: x.DeptID,
              DeptaName: x.DeptaName
            }
            this.SearchDeptID = this.setMan.DeptID.toString()
            this.SearchDeptCalendar(this.SearchDeptID)


            this.LoadingPage.show()
            this.GetApiDataServiceService.getWebApiData_GetDeptsByEmp(this.setMan.EmpCode)
              .pipe(takeWhile(() => this.api_subscribe))
              .subscribe(
                (GetDeptData: GetDeptDataClass[]) => {
                  
                  var aa: GetDeptDataClass = new GetDeptDataClass()
                  aa.DeptID = parseInt(this.setMan.DeptID)
                  aa.uiShowDeptCodeAndName = this.setMan.DeptaName
                  var found = this.NgxDeptSelectBox.find(function (element) {
                    return element.DeptID == aa.DeptID
                  });

                  if (GetDeptData.length > 0) {
                    this.NgxDeptSelectBox = GetDeptData
                    for (let data of this.NgxDeptSelectBox) {
                      data.uiShowDeptCodeAndName = data.DeptCode + ' ' + data.DeptNameC
                    }
                    // console.log(this.NgxDeptSelectBox)
  
                    if (!found) {
                      this.NgxDeptSelectBox.push(aa)
                    }
                    this.SearchDeptID = aa.DeptID
                    // this.SearchDeptID = this.NgxDeptSelectBox[0].DeptID
                  }else{
                    this.NgxDeptSelectBox.push(aa)
                    this.SearchDeptID = aa.DeptID
                  }
                  this.LoadingPage.hide()
                }, error => {

                  this.LoadingPage.hide()
                }
              )
          }
        }
      )
  }
  SearchDeptCalendar(DeptID) {
    if (this.calendar.calendar) {
      var searchStartDate = this.calendar.calendar.state.dateProfile.renderRange.start
      var searchEndDate = this.calendar.calendar.state.dateProfile.renderRange.end

      var GetAbsDetailByDept: GetAbsDetailByDeptGetApiClass = {
        DateB: doFormatDate(searchStartDate),
        DateE: doFormatDate(searchEndDate),
        DeptID: DeptID
      }
      if (this.setMan.DeptID.length == 0) {
      } else {
        this.LoadingPage.show()
        this.GetApiDataServiceService.getWebApiData_GetAbsDetailByDept(GetAbsDetailByDept)
          .pipe(takeWhile(() => this.api_subscribe))
          .subscribe(
            (data: any) => {
              this.events = []
              // console.log(data)
              for (let emp of data) {

                var setDateTimeB = new Date(formatDateTime(emp.DateB).getDate + ' ' + getapi_formatTimetoString(emp.TimeB))
                var setDateTimeE = new Date(formatDateTime(emp.DateB).getDate + ' ' + getapi_formatTimetoString(emp.TimeE))

                this.events.push(
                  { id: emp.EmpID, title: emp.Base.EmpNameC, start: setDateTimeB.toJSON(), end: setDateTimeE.toJSON(), startEditable: false }
                )
              }
              this.LoadingPage.hide()
            }, error => {
              this.LoadingPage.hide()

            }
          )
      }
    }

  }

  showDialogDate = ''
  showDialogTitles = []
  dateClick(e) {
    // console.log(e)
    // console.log(this.events)
    this.showDialogTitles = []
    var setTitles = []
    this.events.sort((a ,b)=>{
      var s = parseInt(a.id.toString()) 
      var e = parseInt(b.id.toString())
      return s - e
    })
    for (let ev of this.events) {
      if (formatDateTime(ev.start).getDate == formatDateTime(e.event.start).getDate) {
        setTitles.push(ev.title)
      }
    }
    if (setTitles.length > 0) {
      this.showDialogDate = formatDateTime(e.event.start).getDate
      this.showDialogTitles = setTitles
      $('#showPerson').modal('show')
    }
  }


  onSelectChange() {
    this.SearchDeptCalendar(this.SearchDeptID)
  }
}