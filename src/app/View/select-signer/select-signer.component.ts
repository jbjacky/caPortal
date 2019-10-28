import { Component, OnInit, Output, EventEmitter, Input, OnDestroy } from '@angular/core';
import { GetApiDataServiceService } from 'src/app/Service/get-api-data-service.service';
import { GetApiUserService } from 'src/app/Service/get-api-user.service';
import { Observable, BehaviorSubject } from 'rxjs';
import { GetSelectBaseClass } from 'src/app/Models/GetSelectBaseClass';
import { takeWhile } from 'rxjs/operators';

@Component({
  selector: 'app-select-signer',
  templateUrl: './select-signer.component.html',
  styleUrls: ['./select-signer.component.css']
})
export class SelectSignerComponent implements OnInit, OnDestroy {
  ngOnDestroy(): void {
    // throw new Error("Method not implemented.");
    this.api_subscribe = false;
  }
  api_subscribe: boolean = true
  SelectApiData = [];
  DeptSelectBox = [];
  NgxBaseSelectBox = [];
  SelectDeptVal: any //簽核人員的部門
  selectBase: any

  constructor(private GetApiDataServiceService: GetApiDataServiceService, private GetApiUserService: GetApiUserService) { }
  // @Input() sysEmpID: string
  @Output() selectBaseChange: EventEmitter<any> = new EventEmitter<any>();
  @Input() sysEmp$: Observable<any>

  ngOnInit() {
    this.sysEmp$
      .pipe(takeWhile(() => this.api_subscribe))
      .subscribe(
        (y:any) => {
          if (y == 0) {

          } else {
            this.SelectApiData = [];
            this.DeptSelectBox = [];
            this.NgxBaseSelectBox = [];
            this.selectboxValue(y.toString())
          }
        }
      )
  }

  selectboxValue(_EmpCode:string) {
    // console.log(_EmpCode)
    if (_EmpCode) {

      this.GetApiDataServiceService.getWebApiData_GetDeptaBySign(_EmpCode)
        .pipe(takeWhile(() => this.api_subscribe))
        .subscribe((x: any) => {
          if (x) {
            this.SelectApiData = x;
            for (let Dept of x) {
              this.DeptSelectBox.push({ DeptID: Dept.DeptID, DeptNameC: Dept.DeptNameC, Base: Dept.Base })
            }
            this.SelectDeptVal = this.DeptSelectBox[0].DeptID
            for (let Base of x[0].Base) {
              if (Base.PosType == 'S') {
                if (Base.ChiefCode != 999) {
                  // this.NgxBaseSelectBox.push(Base.EmpCode + '，' + Base.EmpNameC + '，' + Base.JobName + '，' + Base.ChiefCode + '，' + '兼職')
                  this.NgxBaseSelectBox.push({ BaseData: Base, ShowBaseText: Base.EmpCode + ' ' + Base.EmpNameC + ' ' + Base.JobName + ' '  +"("+ Base.ChiefCode +")"+ ' ' + '兼職' })
                } else {
                  // this.NgxBaseSelectBox.push(Base.EmpCode + '，' + Base.EmpNameC + '，' + Base.ChiefCode + '，' + '兼職')
                  this.NgxBaseSelectBox.push({ BaseData: Base, ShowBaseText: Base.EmpCode + ' ' + Base.EmpNameC + ' ' + '兼職' })
                }
              } else {
                if (Base.ChiefCode != 999) {
                  // this.NgxBaseSelectBox.push(Base.EmpCode + '，' + Base.EmpNameC + '，' + Base.JobName + '，' + Base.ChiefCode)
                  this.NgxBaseSelectBox.push({ BaseData: Base, ShowBaseText: Base.EmpCode + ' ' + Base.EmpNameC + ' ' + Base.JobName + ' '  +"("+ Base.ChiefCode +")"})
                } else {
                  // this.NgxBaseSelectBox.push(Base.EmpCode + '，' + Base.EmpNameC + '，' + Base.ChiefCode)
                  this.NgxBaseSelectBox.push({ BaseData: Base, ShowBaseText: Base.EmpCode + ' ' + Base.EmpNameC })
                }
              }
            }

            this.NgxBaseSelectBox.sort((a, b) => {
              return a.BaseData.ChiefCode - b.BaseData.ChiefCode
            })
            //按職等排序 不論是否兼職
          }
        })
    }
  }
  onChangeDept(event) {
    // console.log(event.target.value)
    var bases: Array<any> = [];
    for (let SelectApiData of this.SelectApiData) {
      if (SelectApiData.DeptID == event.target.value) {
        for (let Base of SelectApiData.Base) {
          if (Base.PosType == 'S') {
            if (Base.ChiefCode != 999) {
              // bases.push(Base.EmpCode + '，' + Base.EmpNameC + '，' + Base.JobName + '，' + Base.ChiefCode + '，' + '兼職')
              bases.push({ BaseData: Base, ShowBaseText: Base.EmpCode + ' ' + Base.EmpNameC + ' ' + Base.JobName + ' ' + "(" + Base.ChiefCode + ")" + ' ' + '兼職' })
            } else {
              // bases.push(Base.EmpCode + '，' + Base.EmpNameC + '，' + Base.ChiefCode + '，' + '兼職')
              bases.push({ BaseData: Base, ShowBaseText: Base.EmpCode + ' ' + Base.EmpNameC + ' ' + '兼職' })
            }
          } else {
            if (Base.ChiefCode != 999) {
              // bases.push(Base.EmpCode + '，' + Base.EmpNameC + '，' + Base.JobName + '，' + Base.ChiefCode)
              bases.push({ BaseData: Base, ShowBaseText: Base.EmpCode + ' ' + Base.EmpNameC + ' ' + Base.JobName + ' ' + "(" + Base.ChiefCode + ")" })
            } else {
              // bases.push(Base.EmpCode + '，' + Base.EmpNameC + '，' + Base.ChiefCode)
              bases.push({ BaseData: Base, ShowBaseText: Base.EmpCode + ' ' + Base.EmpNameC })
            }
          }
        }
      }
    }

    this.NgxBaseSelectBox = bases;

    this.NgxBaseSelectBox.sort((a, b) => {
      return a.BaseData.ChiefCode - b.BaseData.ChiefCode
    })
    //按職等排序 不論是否兼職
    this.selectBaseChange.emit(null);
  }

  onChangeBase(event: GetSelectBaseClass) {
    // console.log(event)
    this.selectBaseChange.emit(event);
  }


}
