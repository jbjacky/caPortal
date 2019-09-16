import { Component, OnInit, Input, Output, EventEmitter, OnDestroy, AfterViewInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { GetApiDataServiceService } from 'src/app/Service/get-api-data-service.service';
import { GetApiUserService } from 'src/app/Service/get-api-user.service';
import { GetDeptaByEmpClass, GetDeptaByEmpTTClass } from 'src/app/Models/PostData_API_Class/GetDeptaByEmpClass';
import { takeWhile } from 'rxjs/operators';
import { GetBaseByAuthByEmpIDDataClass } from 'src/app/Models/GetBaseByAuthByEmpIDDataClass';
import { GetBaseByAuthByEmpIDgetDeptInfoGetApiClass } from 'src/app/Models/PostData_API_Class/GetBaseByAuthByEmpIDgetDeptInfoGetApiClass';
import { doFormatDate } from 'src/app/UseVoid/void_doFormatDate';
import { NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-choosebase-ma',
  templateUrl: './choosebase-ma.component.html',
  styleUrls: ['./choosebase-ma.component.css']
})
////行政選擇員工下拉選單
export class ChoosebaseMAComponent implements OnInit, AfterViewInit, OnDestroy {
  ngAfterViewInit(): void {
    // this.router.events
    //   .pipe(takeWhile(() => this.api_subscribe))
    //   .subscribe((e: any) => {
    //     // If it is a NavigationEnd event re-initalise the component
    //     if (e instanceof NavigationEnd) {
    //       this.ngOnInit()
    //     }
    //   });
  }
  ngOnDestroy(): void {
    // throw new Error("Method not implemented.");
    this.api_subscribe = false;
  }
  api_subscribe = true

  @Input() proxyLockID: string = ''; //傳入代理人工號時，不讓他選到這個工號
  @Input() systemID: string//下拉選單工號
  @Input() SearchEmpID: string //搜尋人工號
  @Input() IsTop: boolean = false //是否最大權限


  allSelectBox = [];//前端顯示下拉選單的資料
  base = []; //前端顯示部門人員資料
  searchDept = { Level: '', DeptID: '' }; //查詢選到的部門
  searchDept_Map = new Map(); //紀錄曾經選到的部門
  searchBase = [];
  api_sendEmpCode = '' //下拉選單工號
  api_SearchEmpID = '' //搜尋人工號

  radioFormGroup: FormGroup

  val_GetBaseByAuthByEmpIDData: GetBaseByAuthByEmpIDDataClass ///主管or行政權限可以選到的部門

  showNonBase: string = '此單位無員工'

  chooseBase:any

  selectBase(choose:string){
    console.log(choose)
  }

  constructor(private router: Router,
    private httpPostService: GetApiDataServiceService,
     private GetApiUserService: GetApiUserService) {
    this.radioFormGroup = new FormGroup({
      gender: new FormControl(),
      // selectControl: new FormControl()
    });
  }

  ngOnInit() {
    if (this.SearchEmpID) {
      this.api_SearchEmpID = this.SearchEmpID
      if (this.systemID) {
        this.radioFormGroup.setValue({ gender: 'dept' })
        this.api_sendEmpCode = this.systemID;
        this.firstGetDeptData();
      } else {
        this.GetApiUserService.counter$      
        .pipe(takeWhile(() => this.api_subscribe))
        .subscribe((x: any) => {
          if (x != 0) {
            this.radioFormGroup.setValue({ gender: 'dept' })
            this.api_sendEmpCode = x.EmpCode;
            this.firstGetDeptData();
          }
        })
      }
    } else {
      this.GetApiUserService.counter$
      .pipe(takeWhile(() => this.api_subscribe))
      .subscribe((x: any) => {
        if (x != 0) {
          this.api_SearchEmpID = x.EmpCode
          if (this.systemID) {
            this.radioFormGroup.setValue({ gender: 'dept' })
            this.api_sendEmpCode = this.systemID;
            this.firstGetDeptData();
          } else {
            this.radioFormGroup.setValue({ gender: 'dept' })
            this.api_sendEmpCode = x.EmpCode;
            this.firstGetDeptData();
          }
        }
      })
    }

    // if (this.systemID) {
    //   this.radioFormGroup.setValue({ gender: 'dept' })
    //   this.api_sendEmpCode = this.systemID;
    //   this.firstGetDeptData();
    // } else {
    //   this.GetApiUserService.counter$.subscribe((x: any) => {
    //     if (x != 0) {
    //       this.radioFormGroup.setValue({ gender: 'dept' })
    //       this.api_sendEmpCode = x.EmpCode;
    //       this.firstGetDeptData();
    //     }
    //   })
    // }
    // console.log(this.radioFormGroup.get('gender'));
  }


  firstGetDeptData() {
    this.allSelectBox = [];//前端顯示下拉選單的資料
    this.base = []; //前端顯示部門人員資料
    this.searchDept = { Level: '', DeptID: '' }; //查詢選到的部門
    this.searchDept_Map = new Map(); //紀錄曾經選到的部門
    this.searchBase = [];

    var _NowDate = new Date();
    var _NowToday = doFormatDate(_NowDate);

    var GetBaseByAuthByEmpIDgetDeptInfoGetApi: GetBaseByAuthByEmpIDgetDeptInfoGetApiClass =
    {
      "EmpID": this.api_SearchEmpID,
      "EffectDate": _NowToday
    }
    this.httpPostService.getWebApiData_GetBaseByAuthByEmpIDgetDeptInfo(GetBaseByAuthByEmpIDgetDeptInfoGetApi)
      .pipe(takeWhile(() => this.api_subscribe))
      .subscribe(
        (GetBaseByAuthByEmpIDData: GetBaseByAuthByEmpIDDataClass) => {
          this.val_GetBaseByAuthByEmpIDData = GetBaseByAuthByEmpIDData

          var _NowDate = new Date();
          var _NowToday = doFormatDate(_NowDate);

          var GetDeptaByEmp: GetDeptaByEmpTTClass = {
            EmpCode: this.api_sendEmpCode,
            DeptID: 0,
            Level: 2,
            DeptNameKey: '',
            EmpCodeOrNameKey: '',
            EffectDate: _NowToday,
            IsTop: this.IsTop,
            IsShift:false
          }
          this.httpPostService.getWebApiData_GetDeptaByEmp(GetDeptaByEmp)
            .pipe(takeWhile(() => this.api_subscribe))
            .subscribe((x: any) => {
              if (x.length > 0) {
                this.allSelectBox = x;
                this.searchDept.Level = x[0].Level;
                this.searchDept.DeptID = x[0].Dept[0].DeptID;
                this.searchDept_Map.set(this.searchDept.Level, this.searchDept.DeptID)
                this.bt_search(this.searchDept)
              } else {
                this.allSelectBox = [];
                this.searchDept = { Level: '', DeptID: '' };
                this.searchDept_Map = new Map();
                this.base = [];
                // alert('工號不正確')
              }

            })
        }
      )
  }
  onChange(event, selectIndex, selectLevel) {
    var DeptID = event.target.value; //選到的部門id
    // console.log(DeptID)
    this.allSelectBox = this.allSelectBox.splice(0, selectIndex + 1) //清除選到的下拉選單之下的所有下拉選單
    if (DeptID == -1) {
      // console.log('===請選擇===')
      this.searchDept.Level = (selectLevel - 1).toString()
      this.searchDept.DeptID = this.searchDept_Map.get(selectLevel - 1)
      // console.log(this.searchDept_Map)
      this.bt_search(this.searchDept)

    } else {

      var _NowDate = new Date();
      var _NowToday = doFormatDate(_NowDate);
      
      var GetDeptaByEmpClass: GetDeptaByEmpTTClass = {
        EmpCode: this.api_sendEmpCode,
        DeptID: DeptID,
        Level: 2,
        DeptNameKey: '',
        EmpCodeOrNameKey: '',
        EffectDate: _NowToday,
        IsTop: this.IsTop,
        IsShift: false
      }
      this.httpPostService.getWebApiData_GetDeptaByEmp(GetDeptaByEmpClass)
        .pipe(takeWhile(() => this.api_subscribe))
        .subscribe((x: any) => {
          //x[0]為本層部門，x[1]為下一層部門，假如只有x[0]，代表沒有下一層部門
          if (x.length == 1) {
            // console.log('最後一層了')
            this.searchDept.DeptID = DeptID
            this.searchDept.Level = x[0].Level
            this.searchDept_Map.set(this.searchDept.Level, this.searchDept.DeptID)
            this.bt_search(this.searchDept)
          } else {
            var ch_Level = this.allSelectBox.filter(item => {
              return item.Level == x[1].Level
            })
            if (ch_Level.length == 0) {
              //如果選到的部門，在目前畫面上沒有下層的下拉選單
              //新建下拉選單
              this.allSelectBox.push(x[1])
              this.searchDept.DeptID = DeptID
              this.searchDept.Level = x[0].Level
              this.searchDept_Map.set(this.searchDept.Level, this.searchDept.DeptID)
              this.bt_search(this.searchDept)
            } else {
              //如果選到的部門，在目前畫面上有下層的下拉選單
              //就把選到的部門的下層資料帶到下一個下拉選單
              for (let i = 0; i < this.allSelectBox.length; i++) {
                if (this.allSelectBox[i].Level == x[1].Level) {
                  this.allSelectBox[i] = x[1]
                }
              }
            }
          }
        })
    }

  }
  bt_search(searchDept) {
    // console.log(searchDept);//選到查詢的部門id跟名稱
    this.base = []
    for (let i = 0; i < this.allSelectBox.length; i++) {
      if (this.allSelectBox[i].Level == searchDept.Level) {
        for (let k = 0; k < this.allSelectBox[i].Dept.length; k++) {
          if (this.allSelectBox[i].Dept[k].DeptID == searchDept.DeptID) {
            this.base = this.allSelectBox[i].Dept[k].Base;
          }
        }
      }
    }

    if (this.val_GetBaseByAuthByEmpIDData.IsAdmin) {
      this.baseSearch(this.base);
    } else {
      var Index = this.val_GetBaseByAuthByEmpIDData.Dept.findIndex((x) => {
        return x.DeptID == searchDept.DeptID
      })
      if (Index < 0) {
        this.searchBase = [];
        this.showNonBase = '無權限選擇該部門員工'
      } else {
        this.showNonBase = '此單位無員工'
        this.baseSearch(this.base);
      }
    }
  }
  baseSearch(base) {
    this.searchBase = [];
    base.sort((a,b)=>{
      return a.EmpCode - b.EmpCode
    })
    base.sort((a,b)=>{
      return a.ChiefCode - b.ChiefCode
    })
    for (let i = 0; i < base.length; i++) {
      if (this.proxyLockID == base[i].EmpCode) {
        //選擇代理人的語法，不要讓他選到自己
      } else {

        if (base[i].EmpNameC == null || base[i].EmpNameC == '' || base[i].EmpNameC == 'null') {
          this.searchBase.push(base[i].EmpCode + '，' + base[i].EmpNameE)
        } else {
          this.searchBase.push(base[i].EmpCode + '，' + base[i].EmpNameC)
        }
      }
    }
  }
  selectBase_disable() {
    if (this.searchBase.length > 0) {
      return false
    } else {
      return true
    }
  }
  DeptName() {
    for (let i = 0; i < this.allSelectBox.length; i++) {
      if (this.searchDept.Level == this.allSelectBox[i].Level) {
        for (let k = 0; k < this.allSelectBox[i].Dept.length; k++) {
          if (this.searchDept.DeptID == this.allSelectBox[i].Dept[k].DeptID) {
            return this.allSelectBox[i].Dept[k].DeptNameC
          }
        }
      }
    }
  }

  @Output() saveEmptoView: EventEmitter<any> = new EventEmitter<any>();//選到的員工回傳
  search(event) {
    if (event) {
      if (event.length == 0) {
        this.saveEmptoView.emit('');
      } else {
        this.saveEmptoView.emit(event[0].value);
      }
    }
  }
  change(event) {
    this.saveEmptoView.emit(event);
  }

}