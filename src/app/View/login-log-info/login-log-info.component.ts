import { Component, OnInit, OnDestroy } from '@angular/core';
import { GetApiDataServiceService } from 'src/app/Service/get-api-data-service.service';
import { takeWhile } from 'rxjs/operators';
import { GetLoginLogDataClass } from 'src/app/Models/GetLoginLogDataClass';
import { formatDateTime, getapi_formatTimetoString, doFormatDate } from 'src/app/UseVoid/void_doFormatDate';
import { ExampleHeader } from 'src/app/Service/datepickerHeader';

@Component({
  selector: 'app-login-log-info',
  templateUrl: './login-log-info.component.html',
  styleUrls: ['./login-log-info.component.css']
})
export class LoginLogInfoComponent implements OnInit, OnDestroy {
  exampleHeader = ExampleHeader //日期套件header
  
  ngOnDestroy(): void {
    // throw new Error("Method not implemented.");
    this.api_subscribe = false;
  }
  api_subscribe = true

  constructor(private GetApiDataServiceService: GetApiDataServiceService) { }
  LoginLogData: GetLoginLogDataClass[] = []
  showLoginLogData: GetLoginLogDataClass[] = []

  searchEmpID: string = ''

  NgxBaseSelectBox: Array<string> = []
  SearchDate :Date

  ngOnInit() {
    this.GetApiDataServiceService.getWebApiData_GetLoginLog()
      .pipe(takeWhile(() => this.api_subscribe))
      .subscribe(
        (GetLoginLogData: GetLoginLogDataClass[]) => {
          this.NgxBaseSelectBox = []
          var allLoginLogSet = new Set();
          this.NgxBaseSelectBox.push('全部')
          this.searchEmpID = '全部'
          for (let oneLogData of GetLoginLogData) {
            oneLogData.LoginDateTime = formatDateTime(oneLogData.LoginDateTime).getDate + ' ' + getapi_formatTimetoString(formatDateTime(oneLogData.LoginDateTime).getTime)

            allLoginLogSet.add(oneLogData.EmpID)
          }
          // console.log(allLoginLogSet)
          allLoginLogSet.forEach((x:any) => {
            var CalCount = 0
            for (let data of GetLoginLogData) {
              if (data.EmpID == x) {
                CalCount++;
              }
            }
            for (let data of GetLoginLogData) {
              if (data.EmpID == x) {
                data['LoginCount'] = CalCount
              }
            }
            this.NgxBaseSelectBox.push(x)

          })
          GetLoginLogData.sort((a, b) => {

            var aDate: any = new Date(a.LoginDateTime)
            var bDate: any = new Date(b.LoginDateTime)
            return bDate - aDate
          })
          this.LoginLogData = JSON.parse(JSON.stringify(GetLoginLogData))
          this.showLoginLogData = JSON.parse(JSON.stringify(GetLoginLogData))
        })
  }

  bt_search() {
    this.showLoginLogData = []
    if (this.searchEmpID == '全部') {
      if(this.SearchDate){
        for (let oneLoginLogData of this.LoginLogData) {
          if (doFormatDate(this.SearchDate) == doFormatDate(oneLoginLogData.LoginDateTime)) {
            this.showLoginLogData.push({
              EmpID: oneLoginLogData.EmpID,
              ChangeEmpID: oneLoginLogData.ChangeEmpID,
              LoginDateTime: oneLoginLogData.LoginDateTime,
              LoginCount: oneLoginLogData.LoginCount
            })
          }
        }
      }else{
        for (let oneLoginLogData of this.LoginLogData) {
            this.showLoginLogData.push({
              EmpID: oneLoginLogData.EmpID,
              ChangeEmpID: oneLoginLogData.ChangeEmpID,
              LoginDateTime: oneLoginLogData.LoginDateTime,
              LoginCount: oneLoginLogData.LoginCount
            })
        }
      }
      
    } else {
      if(this.SearchDate){
        for (let oneLoginLogData of this.LoginLogData) {
          if (this.searchEmpID == oneLoginLogData.EmpID) {
            if(doFormatDate(this.SearchDate) == doFormatDate(oneLoginLogData.LoginDateTime)){
              this.showLoginLogData.push({
                EmpID: oneLoginLogData.EmpID,
                ChangeEmpID: oneLoginLogData.ChangeEmpID,
                LoginDateTime: oneLoginLogData.LoginDateTime,
                LoginCount: oneLoginLogData.LoginCount
              })
            }
          }
        }
      }else{
        for (let oneLoginLogData of this.LoginLogData) {
          if (this.searchEmpID == oneLoginLogData.EmpID) {
              this.showLoginLogData.push({
                EmpID: oneLoginLogData.EmpID,
                ChangeEmpID: oneLoginLogData.ChangeEmpID,
                LoginDateTime: oneLoginLogData.LoginDateTime,
                LoginCount: oneLoginLogData.LoginCount
              })
          }
        }
      }
    }

    this.showLoginLogData.sort((a, b) => {

      var aDate: any = new Date(a.LoginDateTime)
      var bDate: any = new Date(b.LoginDateTime)
      return bDate - aDate
    })
  }

}
