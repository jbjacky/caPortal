import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatSort } from '@angular/material';
import { GetNewsClass } from 'src/app/Models/PostData_API_Class/GetNewsClass';

@Component({
  selector: 'app-card-time-table',
  templateUrl: './card-time-table.component.html',
  styleUrls: ['./card-time-table.component.css']
})
export class CardTimeTableComponent implements OnInit {

  constructor() { }

  displayedColumns: string[] = ['ShowNewsHead', 'PostDate', 'PostDeadline', 'NewsID'];
  dataSource = new MatTableDataSource<any>();

  AllNewsList: GetNewsClass[] = []
  @ViewChild('sortTable') sortTable: MatSort;

  ngOnInit() {
    this.AllNewsList.push({

      ShowNewsHead: "0004420",
      UpdateDate: "3",
      PostDate: "曹博睿",
      PostDeadline: "2019/12/18 0800",
      NewsID: "2019/12/18 1700",
      NewsHead: "123",
      NewsBody: "3123",
      IsOn: true,
      Sort: 1,
      KeyMan: "3123",
      UploadFileOld: null,
      UploadFileNew: null,
    },{

      ShowNewsHead: "0004420",
      UpdateDate: "3",
      PostDate: "曹博睿",
      PostDeadline: "2019/12/17 0800",
      NewsID: "2019/12/17 1700",
      NewsHead: "123",
      NewsBody: "3123",
      IsOn: true,
      Sort: 1,
      KeyMan: "3123",
      UploadFileOld: null,
      UploadFileNew: null,
    },{

      ShowNewsHead: "0004420",
      UpdateDate: "3",
      PostDate: "曹博睿",
      PostDeadline: "2019/12/16 0800",
      NewsID: "2019/12/16 1700",
      NewsHead: "123",
      NewsBody: "3123",
      IsOn: true,
      Sort: 1,
      KeyMan: "3123",
      UploadFileOld: null,
      UploadFileNew: null,
    })
    this.dataSource.data = this.AllNewsList
    this.dataSource.sort = this.sortTable;
  }

}
