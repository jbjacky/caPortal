import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { GetApiDataServiceService } from 'src/app/Service/get-api-data-service.service';
import { GetApiUserService } from 'src/app/Service/get-api-user.service'
import { GetDeptaByEmpClass, GetDeptaByEmpTTClass } from 'src/app/Models/PostData_API_Class/GetDeptaByEmpClass';
import { doFormatDate } from 'src/app/UseVoid/void_doFormatDate';
declare let $: any; //use jquery
@Component({
  selector: 'app-choosedept',
  templateUrl: './choosedept.component.html',
  styleUrls: ['./choosedept.component.css'],
  providers: [GetDeptaByEmpClass]
})
export class ChoosedeptComponent implements OnInit {

  @Input() systemID: string
  @Input() searchkeymanID: string
  @Input() IsTop:boolean
  allSelectBox = [];//前端顯示下拉選單的資料
  base = []; //前端顯示部門人員資料
  searchDept = { Level: '', DeptID: '' }; //查詢選到的部門
  searchDept_Map = new Map(); //紀錄曾經選到的部門
  searchBase = [];
  api_sendEmpCode = '' //測試工號

  radioFormGroup: FormGroup

  constructor(private httpPostService: GetApiDataServiceService, private GetApiUserService: GetApiUserService) {
    this.radioFormGroup = new FormGroup({
      gender: new FormControl(),
      // selectControl: new FormControl()
    });
  }

  ngOnInit() {
    this.radioFormGroup.setValue({ gender: 'dept' })
    this.firstGetDeptData();

    if (this.systemID) {
      this.api_sendEmpCode = this.systemID;
      this.searchkeymanID = this.systemID;
      this.firstGetDeptData();
    } else {
      this.GetApiUserService.counter$.subscribe((x: any) => {
        if (x != 0) {
          this.api_sendEmpCode = x.EmpCode;
          this.firstGetDeptData();
        }
      })
    }
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

    var GetDeptaByEmpClass: GetDeptaByEmpTTClass = {
      EmpCode: this.api_sendEmpCode,
      DeptID: "",
      Level: 2,
      DeptNameKey: '',
      EmpCodeOrNameKey: '',
      EffectDate: _NowToday,
      IsTop:this.IsTop,
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
        if (x[0]) {
          var dept = {
            ParentID: x[0].Dept[0].ParentID,
            ParentDeptNameC: '',
            DeptID: x[0].Dept[0].DeptID,
            DeptNameC: x[0].Dept[0].DeptNameC,
            BaseArray: x[0].Dept[0].Base
          }
          this.saveDepttoView.emit(dept);
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
        DeptID: DeptID.toString(),
        Level: 2,
        DeptNameKey: '',
        EmpCodeOrNameKey: '',
        EffectDate: _NowToday,
        IsTop:this.IsTop,
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
    for (let i = 0; i < base.length; i++) {
      if (base[i].EmpNameC == null || base[i].EmpNameC == '' || base[i].EmpNameC == 'null') {
        this.searchBase.push(base[i])
      } else {
        this.searchBase.push(base[i])
      }
    }


    for (let i = 0; i < this.allSelectBox.length; i++) {
      if (this.searchDept.Level == this.allSelectBox[i].Level) {
        for (let k = 0; k < this.allSelectBox[i].Dept.length; k++) {
          if (this.searchDept.DeptID == this.allSelectBox[i].Dept[k].DeptID) {
            this.saveEmptoView.emit({ DeptName: this.allSelectBox[i].Dept[k].DeptNameC, BaseArray: this.searchBase });

            var dept = {
              ParentID: this.allSelectBox[i].Dept[k].ParentID,
              ParentDeptNameC: '',
              DeptID: this.allSelectBox[i].Dept[k].DeptID,
              DeptNameC: this.allSelectBox[i].Dept[k].DeptNameC,
              BaseArray: this.searchBase
            }
            this.saveDepttoView.emit(dept);
          }
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

  @Output() saveEmptoView: EventEmitter<any> = new EventEmitter<any>();//選到的員工回傳
  @Output() saveDepttoView: EventEmitter<any> = new EventEmitter<any>();//選到的員工回傳


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

  // search(event){
  //   if(event)
  //   this.saveEmptoView.emit(event[0].value);
  //   console.log(event)
  // }

  change(event) {
    this.saveDepttoView.emit(event);
    $('#chooseDeptdialog').modal('hide');

  }

}
