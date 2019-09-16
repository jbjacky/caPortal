import { Component, OnInit, Output, EventEmitter, Input, OnDestroy } from '@angular/core';
import { GetDeptaByEmpClass } from 'src/app/Models/PostData_API_Class/GetDeptaByEmpClass';
import { GetApiDataServiceService } from 'src/app/Service/get-api-data-service.service';
import { GetApiUserService } from 'src/app/Service/get-api-user.service';
import { GetBaseByFormDeptGetApiClass } from 'src/app/Models/PostData_API_Class/GetBaseByFormDeptGetApiClass';
import { takeWhile } from 'rxjs/operators';
import { doFormatDate } from 'src/app/UseVoid/void_doFormatDate';

@Component({
  selector: 'app-searchkeydept-ma',
  templateUrl: './searchkeydept-ma.component.html',
  styleUrls: ['./searchkeydept-ma.component.css']
})
export class SearchkeydeptMAComponent implements OnInit, OnDestroy {
  ngOnDestroy(): void {
    // throw new Error("Method not implemented.");
    this.api_subscribe = false;
  }
  api_subscribe = true

  @Input() systemID: string
  base = []
  searchVal: any;
  errorState = { show: false, errorString: '' }
  api_sendEmpCode = '' //測試工號
  dept: Array<Dept> = new Array<Dept>();

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
        this.httpPostService.getWebApiData_GetBaseByFormDept(GetBaseByFormDeptGetApi)
          .pipe(takeWhile(() => this.api_subscribe))
          .subscribe((y: any) => {
            this.dept = [];
            if (y) {
              if (y.length > 0) {
                for (let data of y) {
                  this.dept.push({
                    ParentID: data.ParentID,
                    ParentDeptNameC: data.ParentName,
                    DeptID: data.DeptID,
                    DeptNameC: data.DeptNameC,
                    BaseArray: null
                  })
                }
              } else {
                this.errorState = { show: true, errorString: '無此部門或無權限' }
              }
            } else {
              this.errorState = { show: true, errorString: '無此部門或無權限' }
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
  onClick(dept) {
    this.click_saveEmptoView.emit(dept)
  }


}
class Dept {
  ParentID: number
  ParentDeptNameC: string
  DeptID: number
  DeptNameC: string
  BaseArray: Array<any>
}

