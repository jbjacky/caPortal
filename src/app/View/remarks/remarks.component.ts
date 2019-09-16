import { Component, OnInit, AfterContentInit, OnDestroy } from '@angular/core';
import { ExportExcelService } from 'src/app/Service/export-excel.service';
import { timeZone_tw, doFormatDate, formatDateTime, getapi_formatTimetoString } from 'src/app/UseVoid/void_doFormatDate';
import { GetApiDataServiceService } from 'src/app/Service/get-api-data-service.service';
import { GetAttendWishClass } from 'src/app/Models/PostData_API_Class/GetAttendWishClass';
import { isValidDate } from 'src/app/UseVoid/void_isVaildDatetime';
import { from, fromEvent } from 'rxjs';
import { mergeMap, toArray, map, debounceTime, takeWhile } from 'rxjs/operators';
import { NgxSpinnerService } from 'ngx-spinner';
import { ExampleHeader } from 'src/app/Service/datepickerHeader';
declare var $;

@Component({
  selector: 'app-remarks',
  templateUrl: './remarks.component.html',
  styleUrls: ['./remarks.component.css']
})
export class RemarksComponent implements OnInit, AfterContentInit, OnDestroy {
  exampleHeader = ExampleHeader //日期套件header
  
  ngOnDestroy(): void {
    this.api_subscribe = false;
  }
  api_subscribe = true; //ngOnDestroy時要取消訂閱api的subscribe

  errorSearchDateState = { state: false, errorString: '' };
  onClick() {

    this.OtRowList = []
    var searchDate = $('#id_ipt_startday').val()
    var dept = $('#select_dept').val()
    // console.log(dept)
    if (searchDate.length == 0) {
      this.errorSearchDateState = { state: true, errorString: '請輸入查詢日期' }
      $("#id_ipt_startday").addClass("errorInput");
    } else if (!isValidDate(searchDate)) {
      this.errorSearchDateState = { state: true, errorString: '日期格式錯誤' }
      $("#id_ipt_startday").addClass("errorInput");
    } else if (dept == 0) {
      this.LoadingPage.show()
      this.errorSearchDateState = { state: false, errorString: '' }
      $("#id_ipt_startday").removeClass("errorInput");
      from(this.selectDept)
        .pipe(
          mergeMap(z => { return this.GetApiDataServiceService.getWebApiData_GetBaseByDeptID(z.DeptID) })
          , mergeMap((w: any) => from(w)),
          toArray()
        ).subscribe(
          (y: any) => {
            // console.log(y)
            var searchEmpID = []
            for (let data of y) {
              searchEmpID.push(data.EmpCode)
            }
            this.onSearch(searchDate, searchEmpID)

            this.LoadingPage.hide()
          },
          error => {
            this.LoadingPage.hide()
          }
        )
    }
    else {
      this.LoadingPage.show()
      this.errorSearchDateState = { state: false, errorString: '' }
      $("#id_ipt_startday").removeClass("errorInput");
      this.GetApiDataServiceService.getWebApiData_GetBaseByDeptID(dept).subscribe(
        (x: any) => {
          var searchEmpID = []
          for (let data of x) {
            searchEmpID.push(data.EmpCode)
          }
          this.onSearch(searchDate, searchEmpID)
          this.LoadingPage.hide()
        },
        error => {
          this.LoadingPage.hide()
        }
      )
    }

    // this.OtRowList = [
    //   { sysid: 1, EmpCode: '777777', EmpName: '李大仁', Category: '加班', StartDate: '2019/01/15 10:00', EndDate: '2019/01/15 18:00', RemarkString: '原1030A欲RQ10A謝謝領導' },
    //   { sysid: 2, EmpCode: '777777', EmpName: '李大仁', Category: '加班', StartDate: '2019/01/15 10:00', EndDate: '2019/01/15 18:00', RemarkString: '原1030A欲RQ10A謝謝領導' },
    //   { sysid: 3, EmpCode: '777777', EmpName: '李大仁', Category: '加班', StartDate: '2019/01/15 10:00', EndDate: '2019/01/15 18:00', RemarkString: '原1030A欲RQ10A謝謝領導' },
    //   { sysid: 4, EmpCode: '777777', EmpName: '李大仁', Category: '加班', StartDate: '2019/01/15 10:00', EndDate: '2019/01/15 18:00', RemarkString: '原1030A欲RQ10A謝謝領導' },
    //   { sysid: 5, EmpCode: '777777', EmpName: '李大仁', Category: '加班', StartDate: '2019/01/15 10:00', EndDate: '2019/01/15 18:00', RemarkString: '原1030A欲RQ10A謝謝領導' },
    //   { sysid: 6, EmpCode: '777777', EmpName: '李大仁', Category: '加班', StartDate: '2019/01/15 10:00', EndDate: '2019/01/15 18:00', RemarkString: '原1030A欲RQ10A謝謝領導' },
    //   { sysid: 7, EmpCode: '777777', EmpName: '李大仁', Category: '加班', StartDate: '2019/01/15 10:00', EndDate: '2019/01/15 18:00', RemarkString: '原1030A欲RQ10A謝謝領導' },
    //   { sysid: 8, EmpCode: '777777', EmpName: '李大仁', Category: '加班', StartDate: '2019/01/15 10:00', EndDate: '2019/01/15 18:00', RemarkString: '原1030A欲RQ10A謝謝領導' },
    // ]
    // $('#remarksTable').DataTable().clear().rows.add(this.OtRowList).draw();

  }

  onSearch(searchDate, searchEmpID) {
    this.LoadingPage.show()
    var GetAttendWish: GetAttendWishClass = {
      DateB: searchDate,
      DateE: searchDate,
      WishTypeID: this.chooseRadio.toString(),
      ListState: ['1'],
      ListEmpID: searchEmpID
    }
    // console.log(searchEmpID)
    console.log(GetAttendWish)
    this.GetApiDataServiceService.getWebApiData_GetAttendWish(GetAttendWish).subscribe(
      (x: any) => {
        // console.log(x)
        this.clickSearch++
        if (x.length == 0) {
          $('#remarksTable').DataTable().clear().rows.add(this.OtRowList).draw();
        } else {

          for (let data of x) {

            var DateB = formatDateTime(data.DateB).getDate
            var DateE = formatDateTime(data.DateE).getDate
            var TimeB = getapi_formatTimetoString(data.TimeB)
            var TimeE = getapi_formatTimetoString(data.TimeE)
            this.OtRowList.push({
              sysid: data.AttendWishID,
              EmpCode: data.EmpCode,
              EmpName: data.EmpNameC,
              Category: data.WishTypeName,
              StartDate: DateB + ' ' + TimeB,
              EndDate: DateE + ' ' + TimeE,
              RemarkString: data.Note
            })
            console.log(this.OtRowList)


          }

          $('#remarksTable').DataTable().clear().rows.add(this.OtRowList).draw();
          // $('#remarksTable').DataTable().clear().rows.add(this.OtRowList).draw();

        }
        this.LoadingPage.hide()
      }, error => {
        // alert('與api連線異常，getWebApiData_GetAttendWish')
        this.LoadingPage.hide()
      }
    )
  }

  ngAfterContentInit(): void {

    this.bindDataTable();
    $('.btn-main-nav').click(function() {
        $('#lastheader').trigger('click')
    });
  }

  bindDataTable() {

    var table = $('#remarksTable').DataTable({
    });
    table.destroy();

    table = $('#remarksTable').DataTable({
      data: this.OtRowList,
      columnDefs: [{ "searchable": false, "orderable": false, "visible": false, targets: 'no-sort' }],

      columns: [
        // {
        //   data: "sysid",
        //   render: function (data, type, obj, meta) {
        //     return '<input type="checkbox" id="' + data + '">';
        //   },
        //   width: "10%",
        //   sorting: false,
        //   orderable: false,
        //   class: 'qwe'
        // },
        {
          title: "工號", data: "EmpCode", sorting: false, orderable: false,className: "dt-center"
          // , render: function (data, type, row, meta) {
          //   if (row.qwe != null) {
          //     return row.qwe
          //   }
          //   return row.id
          // }
        },
        {
          title: "姓名", data: "EmpName", sorting: false,className: "dt-center"
        },
        {
          title: "類別", data: "Category", sorting: false,className: "dt-center"
        },
        {
          title: "開始日期", data: "StartDate",className: "dt-center"
        },
        {
          title: "結束日期", data: "EndDate",className: "dt-center"
        },
        {
          title: "備註", data: "RemarkString", sorting: false
        }
      ],
      scrollY: "500px",
      scrollX: true,
      searching: false,
      info: false,
      scrollCollapse: true,
      paging: true,
      lengthChange: false,
      iDisplayLength: 10,  //預設顯示比數
      language: {
        zeroRecords: "",
        emptyTable: "查無資料",
        paginate: {
          previous: "<",
          next: ">"
        }
      },
    });


    // new $.fn.dataTable.FixedColumns(table, {
    //   leftColumns: 3,
    //   heightMatch: 'auto'
    // });
  }
  OtRowList = []
  clickSearch = 0;
  radiogroup: any = [
    { id: 0, name: '全部顯示' },
    { id: 2, name: '加班意願' },
    { id: 3, name: '調班意願' },
    // { id: 1, name: '請假意願' }
  ];
  chooseRadio: number = 0;
  constructor(private excelService: ExportExcelService,
    private GetApiDataServiceService: GetApiDataServiceService,
    private LoadingPage: NgxSpinnerService) { }
  selectDept = []
  dateS = new Date()
  ngOnInit() {
    // for (let i = 0; i < 30; i++) {
    //   var startDates = new Date();
    //   var endDates = new Date();
    //   startDates.setDate(startDates.getDate() - this.getRandomInt(1, 100))
    //   endDates.setDate(endDates.getDate() + this.getRandomInt(1, 100))
    //   var random_startDates = doFormatDate(timeZone_tw(startDates))
    //   var random_endDates = doFormatDate(timeZone_tw(endDates))

    //   this.OtRowList.push({ sysid: i, EmpCode: this.getRandomInt(600000, 699999), EmpName: '李大仁', Category: '加班', StartDate: random_startDates + ' 10:00', EndDate: random_endDates + ' 18:00', RemarkString: '原1030A欲RQ10A謝謝領導' })

    // }
    
    this.LoadingPage.show()
    this.GetApiDataServiceService.getWebApiData_GetDeptaByDeptTree().subscribe(
      (x: any) => {
        this.selectDept.push({ DeptID: 0, DeptNameC: '全部' })
        for (let data of x) {
          this.selectDept.push({ DeptID: data.DeptID, DeptNameC: data.DeptNameC })
        }
        this.LoadingPage.hide()
      },error=>{
        
        this.LoadingPage.hide()
      }
    )
  }
  onChange(e) {

  }
  getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
  }

  onExportExcel() {
    var exportData = []
    for (let OtRow of this.OtRowList) {
      exportData.push({
        工號: OtRow.EmpCode,
        姓名: OtRow.EmpName,
        類別: OtRow.Category,
        開始日期: OtRow.StartDate,
        結束日期: OtRow.EndDate,
        備註: OtRow.RemarkString
      })
    }
    if (exportData.length > 0) {
      this.excelService.exportAsExcelFile(exportData, '意願備註表');
    } else {
      alert('請先查詢意願備註表')
    }
  }
  visibility() {
    if (this.OtRowList.length > 0) {
      return 'visible'
    } else {
      return 'hidden'
    }
  }

  dayMask(): {
    mask: Array<string | RegExp>;
    keepCharPositions: boolean;
  } {
    return {
      mask: [/[2]/, /[0]/, /\d/, /\d/, '/', /[0-1]/, /\d/, '/', /[0-3]/, /\d/],
      keepCharPositions: true,
    };
  }
}

