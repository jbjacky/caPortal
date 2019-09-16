import { Component, OnInit, Output, EventEmitter, Input, OnDestroy, AfterViewInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { GetApiDataServiceService } from 'src/app/Service/get-api-data-service.service';
import { GetApiUserService } from 'src/app/Service/get-api-user.service'
import { GetDeptaByEmpClass, GetDeptaByEmpTTClass } from 'src/app/Models/PostData_API_Class/GetDeptaByEmpClass';
import { takeWhile } from 'rxjs/operators';
import { GetBaseByAuthByEmpIDgetDeptInfoGetApiClass } from 'src/app/Models/PostData_API_Class/GetBaseByAuthByEmpIDgetDeptInfoGetApiClass';
import { GetBaseByAuthByEmpIDDataClass } from 'src/app/Models/GetBaseByAuthByEmpIDDataClass';
import { doFormatDate } from 'src/app/UseVoid/void_doFormatDate';
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-choosebaselevel',
  templateUrl: './choosebaselevel.component.html',
  styleUrls: ['./choosebaselevel.component.css']
})
//////請假單選擇員工，包含行政、一級正以下
export class ChoosebaselevelComponent implements OnInit,AfterViewInit, OnDestroy {
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
  @Input() systemID: string
  @Input() IsTop: boolean

  searchkeymanID: string
  showAssistantOrAdmin: boolean = false

  allSelectBox_Assistant = [];//前端顯示下拉選單的資料
  base_Assistant = []; //前端顯示部門人員資料
  searchDept_Assistant = { Level: '', DeptID: '' }; //查詢選到的部門
  searchDept_Map_Assistant = new Map(); //紀錄曾經選到的部門
  searchBase_Assistant = [];
  api_sendEmpCode_Assistant = '' //測試工號
  showNonBase: string = '此單位無員工'
  val_GetBaseByAuthByEmpIDData: GetBaseByAuthByEmpIDDataClass
  IsAssistant: boolean = false

  allSelectBox_Level = [];//前端顯示下拉選單的資料
  base_Level = []; //前端顯示部門人員資料
  searchDept_Level = { Level: '', DeptID: '' }; //查詢選到的部門
  searchDept_Map_Level = new Map(); //紀錄曾經選到的部門
  searchBase_Level = [];
  api_sendEmpCode_Level = '' //測試工號


  allSelectBox = [];//前端顯示下拉選單的資料
  base = []; //前端顯示部門人員資料
  searchDept = { Level: '', DeptID: '' }; //查詢選到的部門
  searchDept_Map = new Map(); //紀錄曾經選到的部門
  searchBase = [];
  api_sendEmpCode = '' //測試工號

  radioFormGroup: FormGroup

  constructor(private router: Router,
    private httpPostService: GetApiDataServiceService,
    private GetApiUserService: GetApiUserService) {
    this.radioFormGroup = new FormGroup({
      gender: new FormControl(),
      // selectControl: new FormControl()
    });
  }

  ngOnInit() {
    this.GetApiUserService.counter$
      .pipe(takeWhile(() => this.api_subscribe))
      .subscribe((x: any) => {
        if (x != 0) {
          this.radioFormGroup.setValue({ gender: 'dept' })
          this.api_sendEmpCode_Assistant = x.EmpCode;
          this.api_sendEmpCode_Level = x.EmpCode;
          this.api_sendEmpCode = x.EmpCode;
          this.IsAssistant = x.IsAssistant
          this.firstGetDeptData();
          this.firstGetDeptData_Level();
          this.firstGetDeptData_Assistant();

        }
      })
    // console.log(this.radioFormGroup.get('gender'));
  }


  firstGetDeptData_Assistant() {
    this.allSelectBox_Assistant = [];//前端顯示下拉選單的資料
    this.base_Assistant = []; //前端顯示部門人員資料
    this.searchDept_Assistant = { Level: '', DeptID: '' }; //查詢選到的部門
    this.searchDept_Map_Assistant = new Map(); //紀錄曾經選到的部門
    this.searchBase_Assistant = [];

    var _NowDate = new Date();
    var _NowToday = doFormatDate(_NowDate);

    var GetBaseByAuthByEmpIDgetDeptInfoGetApi: GetBaseByAuthByEmpIDgetDeptInfoGetApiClass =
    {
      "EmpID": this.api_sendEmpCode_Assistant,
      "EffectDate": _NowToday
    }
    this.httpPostService.getWebApiData_GetBaseByAuthByEmpIDgetDeptInfo(GetBaseByAuthByEmpIDgetDeptInfoGetApi)
      .pipe(takeWhile(() => this.api_subscribe))
      .subscribe(
        (GetBaseByAuthByEmpIDData: GetBaseByAuthByEmpIDDataClass) => {
          this.val_GetBaseByAuthByEmpIDData = GetBaseByAuthByEmpIDData
          if (this.val_GetBaseByAuthByEmpIDData.IsAdmin || this.IsAssistant) {
            this.showAssistantOrAdmin = true
          } else {
            this.showAssistantOrAdmin = false
          }

          var _NowDate = new Date();
          var _NowToday = doFormatDate(_NowDate);

          var GetDeptaByEmp: GetDeptaByEmpTTClass = {
            EmpCode: this.api_sendEmpCode,
            DeptID: 0,
            Level: 2,
            DeptNameKey: '',
            EmpCodeOrNameKey: '',
            EffectDate: _NowToday,
            IsTop: true,
            IsShift:false
          }
          this.httpPostService.getWebApiData_GetDeptaByEmp(GetDeptaByEmp)
            .pipe(takeWhile(() => this.api_subscribe))
            .subscribe((x: any) => {
              if (x.length > 0) {
                this.allSelectBox_Assistant = x;
                this.searchDept_Assistant.Level = x[0].Level;
                this.searchDept_Assistant.DeptID = x[0].Dept[0].DeptID;
                this.searchDept_Map_Assistant.set(this.searchDept_Assistant.Level, this.searchDept_Assistant.DeptID)
                this.bt_search_Assistant(this.searchDept_Assistant)
              } else {
                this.allSelectBox_Assistant = [];
                this.searchDept_Assistant = { Level: '', DeptID: '' };
                this.searchDept_Map_Assistant = new Map();
                this.base_Assistant = [];
                // alert('工號不正確')
              }

            })
        }
      )
  }
  onChange_Assistant(event, selectIndex, selectLevel) {

    var DeptID = event.target.value; //選到的部門id
    // console.log(DeptID)
    this.allSelectBox_Assistant = this.allSelectBox_Assistant.splice(0, selectIndex + 1) //清除選到的下拉選單之下的所有下拉選單
    if (DeptID == -1) {
      // console.log('===請選擇===')
      this.searchDept_Assistant.Level = (selectLevel - 1).toString()
      this.searchDept_Assistant.DeptID = this.searchDept_Map_Assistant.get(selectLevel - 1)
      // console.log(this.searchDept_Map)
      this.bt_search_Assistant(this.searchDept_Assistant)

    } else {

      var _NowDate = new Date();
      var _NowToday = doFormatDate(_NowDate);

      var GetDeptaByEmpClass: GetDeptaByEmpTTClass = {
        EmpCode: this.api_sendEmpCode_Assistant,
        DeptID: DeptID,
        Level: 2,
        DeptNameKey: '',
        EmpCodeOrNameKey: '',
        EffectDate: _NowToday,
        IsTop: this.IsTop,
        IsShift:false
      }
      this.httpPostService.getWebApiData_GetDeptaByEmp(GetDeptaByEmpClass)
        .pipe(takeWhile(() => this.api_subscribe))
        .subscribe((x: any) => {
          //x[0]為本層部門，x[1]為下一層部門，假如只有x[0]，代表沒有下一層部門
          if (x.length == 1) {
            // console.log('最後一層了')
            this.searchDept_Assistant.DeptID = DeptID
            this.searchDept_Assistant.Level = x[0].Level
            this.searchDept_Map_Assistant.set(this.searchDept_Assistant.Level, this.searchDept_Assistant.DeptID)
            this.bt_search_Assistant(this.searchDept_Assistant)
          } else {
            var ch_Level = this.allSelectBox_Assistant.filter(item => {
              return item.Level == x[1].Level
            })
            if (ch_Level.length == 0) {
              //如果選到的部門，在目前畫面上沒有下層的下拉選單
              //新建下拉選單
              this.allSelectBox_Assistant.push(x[1])
              this.searchDept_Assistant.DeptID = DeptID
              this.searchDept_Assistant.Level = x[0].Level
              this.searchDept_Map_Assistant.set(this.searchDept_Assistant.Level, this.searchDept_Assistant.DeptID)
              this.bt_search_Assistant(this.searchDept_Assistant)
            } else {
              //如果選到的部門，在目前畫面上有下層的下拉選單
              //就把選到的部門的下層資料帶到下一個下拉選單
              for (let i = 0; i < this.allSelectBox_Assistant.length; i++) {
                if (this.allSelectBox_Assistant[i].Level == x[1].Level) {
                  this.allSelectBox_Assistant[i] = x[1]
                }
              }
            }
          }
        })
    }

  }
  bt_search_Assistant(searchDept) {
    // console.log(searchDept);//選到查詢的部門id跟名稱
    this.base_Assistant = []
    for (let i = 0; i < this.allSelectBox_Assistant.length; i++) {
      if (this.allSelectBox_Assistant[i].Level == searchDept.Level) {
        for (let k = 0; k < this.allSelectBox_Assistant[i].Dept.length; k++) {
          if (this.allSelectBox_Assistant[i].Dept[k].DeptID == searchDept.DeptID) {
            this.base_Assistant = this.allSelectBox_Assistant[i].Dept[k].Base;
          }
        }
      }
    }

    if (this.val_GetBaseByAuthByEmpIDData.IsAdmin) {
      this.baseSearch_Assistant(this.base_Assistant);
    } else {
      var Index = this.val_GetBaseByAuthByEmpIDData.Dept.findIndex((x) => {
        return x.DeptID == searchDept.DeptID
      })
      if (Index < 0) {
        this.searchBase_Assistant = [];
        this.showNonBase = '無權限選擇該部門員工'
      } else {
        this.showNonBase = '此單位無員工'
        this.baseSearch_Assistant(this.base_Assistant);
      }
    }
  }
  baseSearch_Assistant(base) {
    this.searchBase_Assistant = [];
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
          this.searchBase_Assistant.push(base[i].EmpCode + '，' + base[i].EmpNameE)
        } else {
          this.searchBase_Assistant.push(base[i].EmpCode + '，' + base[i].EmpNameC)
        }
      }
    }
  }
  selectBase_disable_Assistant() {
    if (this.searchBase_Assistant.length > 0) {
      return false
    } else {
      return true
    }
  }
  DeptName_Assistant() {
    for (let i = 0; i < this.allSelectBox_Assistant.length; i++) {
      if (this.searchDept_Assistant.Level == this.allSelectBox_Assistant[i].Level) {
        for (let k = 0; k < this.allSelectBox_Assistant[i].Dept.length; k++) {
          if (this.searchDept_Assistant.DeptID == this.allSelectBox_Assistant[i].Dept[k].DeptID) {
            return this.allSelectBox_Assistant[i].Dept[k].DeptNameC
          }
        }
      }
    }
  }

  firstGetDeptData_Level() {
    this.allSelectBox_Level = [];//前端顯示下拉選單的資料
    this.base_Level = []; //前端顯示部門人員資料
    this.searchDept_Level = { Level: '', DeptID: '' }; //查詢選到的部門
    this.searchDept_Map_Level = new Map(); //紀錄曾經選到的部門
    this.searchBase_Level = [];

    var _NowDate = new Date();
    var _NowToday = doFormatDate(_NowDate);

    var GetDeptaByEmpClass: GetDeptaByEmpClass = {
      EmpCode: this.api_sendEmpCode_Level,
      DeptID: 0,
      Level: 2,
      DeptNameKey: '',
      EmpCodeOrNameKey: '',
      EffectDate: _NowToday,
      IsTop: this.IsTop
    }
    this.httpPostService.getWebApiData_GetDeptaByEmpLevel(GetDeptaByEmpClass)
      .subscribe((x: any) => {
        if (x.length > 0) {
          this.allSelectBox_Level = x;
          this.searchDept_Level.Level = x[0].Level;
          this.searchDept_Level.DeptID = x[0].Dept[0].DeptID;
          this.searchDept_Map_Level.set(this.searchDept_Level.Level, this.searchDept_Level.DeptID)
          this.bt_search_Level(this.searchDept_Level)
        } else {
          this.allSelectBox_Level = [];
          this.searchDept_Level = { Level: '', DeptID: '' };
          this.searchDept_Map_Level = new Map();
          this.base_Level = [];
          // alert('工號不正確')
        }

      })
  }
  onChange_Level(event, selectIndex, selectLevel) {
    var DeptID = event.target.value; //選到的部門id
    this.allSelectBox_Level = this.allSelectBox_Level.splice(0, selectIndex + 1) //清除選到的下拉選單之下的所有下拉選單
    if (DeptID == -1) {
      // console.log('===請選擇===')
      this.searchDept_Level.Level = (selectLevel - 1).toString()
      this.searchDept_Level.DeptID = this.searchDept_Map_Level.get(selectLevel - 1)
      // console.log(this.searchDept_Map)
      this.bt_search_Level(this.searchDept_Level)

    } else {

      var _NowDate = new Date();
      var _NowToday = doFormatDate(_NowDate);

      var GetDeptaByEmpClass: GetDeptaByEmpClass = {
        EmpCode: this.api_sendEmpCode_Level,
        DeptID: DeptID,
        Level: 2,
        DeptNameKey: '',
        EmpCodeOrNameKey: '',
        EffectDate: _NowToday,
        IsTop: this.IsTop
      }
      this.httpPostService.getWebApiData_GetDeptaByEmpLevel(GetDeptaByEmpClass)
        .subscribe((x: any) => {
          //x[0]為本層部門，x[1]為下一層部門，假如只有x[0]，代表沒有下一層部門
          if (x.length == 1) {
            // console.log('最後一層了')
            this.searchDept_Level.DeptID = DeptID
            this.searchDept_Level.Level = x[0].Level
            this.searchDept_Map_Level.set(this.searchDept_Level.Level, this.searchDept_Level.DeptID)
            this.bt_search_Level(this.searchDept_Level)
          } else {
            var ch_Level = this.allSelectBox_Level.filter(item => {
              return item.Level == x[1].Level
            })
            if (ch_Level.length == 0) {
              //如果選到的部門，在目前畫面上沒有下層的下拉選單
              //新建下拉選單
              this.allSelectBox_Level.push(x[1])
              this.searchDept_Level.DeptID = DeptID
              this.searchDept_Level.Level = x[0].Level
              this.searchDept_Map_Level.set(this.searchDept_Level.Level, this.searchDept_Level.DeptID)
              this.bt_search_Level(this.searchDept_Level)
            } else {
              //如果選到的部門，在目前畫面上有下層的下拉選單
              //就把選到的部門的下層資料帶到下一個下拉選單
              for (let i = 0; i < this.allSelectBox_Level.length; i++) {
                if (this.allSelectBox_Level[i].Level == x[1].Level) {
                  this.allSelectBox_Level[i] = x[1]
                }
              }
            }
          }
        })
    }

  }
  bt_search_Level(searchDept) {
    // console.log(searchDept);//選到查詢的部門id跟名稱
    this.base_Level = []
    for (let i = 0; i < this.allSelectBox_Level.length; i++) {
      if (this.allSelectBox_Level[i].Level == searchDept.Level) {
        for (let k = 0; k < this.allSelectBox_Level[i].Dept.length; k++) {
          if (this.allSelectBox_Level[i].Dept[k].DeptID == searchDept.DeptID) {
            this.base_Level = this.allSelectBox_Level[i].Dept[k].Base;
          }
        }
      }
    }
    this.baseSearch_Level(this.base_Level);
  }
  baseSearch_Level(base) {
    this.searchBase_Level = [];
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
          this.searchBase_Level.push(base[i].EmpCode + '，' + base[i].EmpNameE)
        } else {
          this.searchBase_Level.push(base[i].EmpCode + '，' + base[i].EmpNameC)
        }
      }
    }
  }
  selectBase_disable_Level() {
    if (this.searchBase_Level.length > 0) {
      return false
    } else {
      return true
    }
  }
  DeptName_Level() {
    for (let i = 0; i < this.allSelectBox_Level.length; i++) {
      if (this.searchDept_Level.Level == this.allSelectBox_Level[i].Level) {
        for (let k = 0; k < this.allSelectBox_Level[i].Dept.length; k++) {
          if (this.searchDept_Level.DeptID == this.allSelectBox_Level[i].Dept[k].DeptID) {
            return this.allSelectBox_Level[i].Dept[k].DeptNameC
          }
        }
      }
    }
  }


  firstGetDeptData() {
    this.allSelectBox = [];//前端顯示下拉選單的資料
    this.base = []; //前端顯示部門人員資料
    this.searchDept = { Level: '', DeptID: '' }; //查詢選到的部門
    this.searchDept_Map = new Map(); //紀錄曾經選到的部門
    this.searchBase = [];

    var _NowDate = new Date();
    var _NowToday = doFormatDate(_NowDate);

    var GetDeptaByEmpClass: GetDeptaByEmpTTClass = {
      EmpCode: this.api_sendEmpCode,
      DeptID: 0,
      Level: 2,
      DeptNameKey: '',
      EmpCodeOrNameKey: '',
      EffectDate: _NowToday,
      IsTop: this.IsTop,
      IsShift:false
    }
    this.httpPostService.getWebApiData_GetDeptaByEmp(GetDeptaByEmpClass)
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
  onChange(event, selectIndex, selectLevel) {
    var DeptID = event.target.value; //選到的部門id
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
        IsShift:false
      }
      this.httpPostService.getWebApiData_GetDeptaByEmp(GetDeptaByEmpClass)
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
    this.baseSearch(this.base);
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