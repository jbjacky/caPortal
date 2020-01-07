import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { GetApiDataServiceService } from 'src/app/Service/get-api-data-service.service'
import { GetApiUserService } from 'src/app/Service/get-api-user.service';
import { GetDeptaByEmpClass, GetDeptaByEmpTTClass } from 'src/app/Models/PostData_API_Class/GetDeptaByEmpClass';
import { doFormatDate } from 'src/app/UseVoid/void_doFormatDate';

declare var $;
@Component({
  selector: 'app-searchkeydept',
  templateUrl: './searchkeydept.component.html',
  styleUrls: ['./searchkeydept.component.css'],
  providers: [GetDeptaByEmpClass]
})
export class SearchkeydeptComponent implements OnInit {

  @Input() systemID:string
  @Input() IsTop:boolean=false
  base = []
  searchVal: any;
  errorState = { show: false, errorString: '' }
  api_sendEmpCode = '' //測試工號
  dept: Array<Dept> = new Array<Dept>();

  constructor(private httpPostService: GetApiDataServiceService, private GetApiUserService: GetApiUserService) {
  }

  ngOnInit() {
    if(this.systemID){
      this.api_sendEmpCode = this.systemID
    }else{

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
      
        var GetDeptaByEmpClass: GetDeptaByEmpTTClass = {
          EmpCode: this.api_sendEmpCode,
          DeptID: "",
          Level: 9,
          DeptNameKey: searchVal,
          EmpCodeOrNameKey: '',
          EffectDate: _NowToday,
          IsTop:this.IsTop,
          IsShift:false
        }
        this.httpPostService.getWebApiData_GetDeptaByEmp(GetDeptaByEmpClass).subscribe((y: any) => {
          if (y.length > 0) {
            this.pushBase(y);
            if (this.dept.length == 0) {
              // alert('此條件查不到員工')
              this.errorState.show = true;
              this.errorState.errorString = '此條件查不到部門'
            }
          } else {
            // alert('此條件查不到員工!!')
            this.errorState.show = true;
            this.errorState.errorString = '此條件查不到部門'
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
  pushBase(x) {
    this.dept = [];
    for (let i = 0; i < x.length; i++) {
      if (x[i].Dept.length > 0) {
        for (let k = 0; k < x[i].Dept.length; k++) {
          if (x[i].Dept[k].Base.length > 0) {
            this.dept.push({
              ParentID:x[i].Dept[k].ParentID,
              ParentDeptNameC: x[i].Dept[k].ParentName,
              DeptID:x[i].Dept[k].DeptID,
              DeptNameC: x[i].Dept[k].DeptNameC,
              BaseArray: x[i].Dept[k].Base
            })
          }
        }
      }
    }
  }

  searchParentDeptName(x,ParentID){
    for (let i = 0; i < x.length; i++) {
      if (x[i].Dept.length > 0) {
        for (let k = 0; k < x[i].Dept.length; k++) {
          if (x[i].Dept[k].DeptID == ParentID) {
            return x[i].Dept[k].DeptNameC
          }else{
            return ''
          }
        }
      }else{
        return ''
      }
    }
  }


  @Output() click_saveEmptoView: EventEmitter<any> = new EventEmitter<any>();//選到的員工回傳
  onClick(dept) {
    this.click_saveEmptoView.emit(dept)
  }


}
class Dept {
  ParentID:number
  ParentDeptNameC: string
  DeptID:number
  DeptNameC: string
  BaseArray: Array<any>
}

