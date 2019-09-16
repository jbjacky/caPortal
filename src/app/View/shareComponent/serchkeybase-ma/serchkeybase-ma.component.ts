import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { GetApiDataServiceService } from 'src/app/Service/get-api-data-service.service';
import { GetApiUserService } from 'src/app/Service/get-api-user.service';
import { takeWhile } from 'rxjs/operators';
import { GetBaseByFormDeptGetApiClass } from 'src/app/Models/PostData_API_Class/GetBaseByFormDeptGetApiClass';
import { doFormatDate } from 'src/app/UseVoid/void_doFormatDate';

@Component({
  selector: 'app-serchkeybase-ma',
  templateUrl: './serchkeybase-ma.component.html',
  styleUrls: ['./serchkeybase-ma.component.css']
})
export class SerchkeybaseMAComponent implements OnInit, OnDestroy {
  ngOnDestroy(): void {
    // throw new Error("Method not implemented.");
    this.api_subscribe = false;
  }
  api_subscribe = true

  @Input() proxyLockID_keysearch: string = '';
  @Input() systemID: string

  base = []
  searchVal: any;//搜尋條件
  errorState = { show: false, errorString: '' }
  api_sendEmpCode = '' //下拉選單工號
  constructor(private httpPostService: GetApiDataServiceService, private GetApiUserService: GetApiUserService) {
  }

  ngOnInit() {
    if (this.systemID) {
      this.api_sendEmpCode = this.systemID
    } else {
      this.GetApiUserService.counter$.subscribe(x => {
        this.api_sendEmpCode = x.EmpCode
      })
    }

  }

  search(searchVal) {
    // console.log(searchVal.length)
    this.errorState.show = false;
    this.base = []

    if (searchVal) {
      if (searchVal.length >= 2) {


        var _NowDate = new Date();
        var _NowToday = doFormatDate(_NowDate);

          var GetBaseByFormDeptGetApi: GetBaseByFormDeptGetApiClass = {
            "EmpCode": this.api_sendEmpCode,
            "Key": searchVal,
            "EffectDate": _NowToday
          }
          this.httpPostService.getWebApiData_GetBaseByFormEmp(GetBaseByFormDeptGetApi)
            .pipe(takeWhile(() => this.api_subscribe))
            .subscribe((y: any) => {

              this.base = [];
              if (y) {
                if(y.length>0){
                  this.errorState = { show: false, errorString: '' }
                  for (let data of y) {
                    this.base.push({
                      Dept: data.DeptaName,
                      ParentName: data.ParentDeptaName,
                      EmpCode: data.EmpCode,
                      EmpNameC: data.EmpNameC
                    })
                  }
                }else{
                  this.errorState = { show: true, errorString: '無此員工或無權限' }
                }
              } else {
                this.errorState = { show: true, errorString: '無此員工或無權限' }
              }

            })
      } else {
        // alert('請輸入2個字元以上')
        this.errorState.show = true;
        this.errorState.errorString = '請輸入2個字元以上'
      }
    }
    else {
      // alert('請不要空白')
      this.errorState.show = true;
      this.errorState.errorString = '請不要空白'
    }
  }


  @Output() click_saveEmptoView: EventEmitter<any> = new EventEmitter<any>();//選到的員工回傳
  onClick(base) {
    var baseIdandName = base.EmpCode + '，' + base.EmpNameC
    this.click_saveEmptoView.emit(baseIdandName)
  }


}

