import { Component, OnInit, AfterContentInit, OnDestroy } from '@angular/core';
import { ExampleHeader } from 'src/app/Service/datepickerHeader';
import { GetApiDataServiceService } from 'src/app/Service/get-api-data-service.service';
import { GetApiUserService } from 'src/app/Service/get-api-user.service';
import { GetBaseInfoDetailClass } from 'src/app/Models/GetBaseInfoDetailClass';
import { ManInfoClass } from 'src/app/Models/ManInfoClass';
import { GetCheckAgentClass } from 'src/app/Models/GetCheckAgentClass';
import { NgxSpinnerService } from 'ngx-spinner';
import { GetEmpAgentDateClass } from 'src/app/Models/GetEmpAgentDateClass';
import { formatDateTime, doFormatDate } from 'src/app/UseVoid/void_doFormatDate';
import { UpdateEmpAgentDateClass } from 'src/app/Models/PostData_API_Class/UpdateEmpAgentDateClass';
import { InsertEmpAgentDateClass } from 'src/app/Models/PostData_API_Class/InsertEmpAgentDateClass';
import { InsertCheckAgentClass } from 'src/app/Models/PostData_API_Class/InsertCheckAgentClass';
import { UpdateCheckAgentClass } from 'src/app/Models/PostData_API_Class/UpdateCheckAgentClass';
import { isValidDate } from 'src/app/UseVoid/void_isVaildDatetime';
import { takeWhile } from 'rxjs/operators';
import { GetBaseByFormClass } from 'src/app/Models/PostData_API_Class/GetBaseByFormClass';
import { GetCheckAgentByTargetGetApiClass } from 'src/app/Models/PostData_API_Class/GetCheckAgentByTargetGetApiClass';

declare let $: any; //use jquery
@Component({
  selector: 'app-sign-proxyman',
  templateUrl: './sign-proxyman.component.html',
  styleUrls: ['./sign-proxyman.component.css']
})
export class SignProxymanComponent implements OnInit, AfterContentInit, OnDestroy {
  exampleHeader = ExampleHeader //日期套件header
  dateS = new Date()
  dateE = new Date()
  checkIsValid: string = 'on'
  ngOnDestroy(): void {
    // throw new Error("Method not implemented.");
    this.api_subscribe = false;
  }
  api_subscribe = true
  ngAfterContentInit(): void {
  }

  constructor(
    private GetApiDataServiceService: GetApiDataServiceService,
    private GetApiUserService: GetApiUserService,
    private LoadingPage: NgxSpinnerService) { }

  BeProxyMan: GetBaseInfoDetailClass = new GetBaseInfoDetailClass()
  FirstMan: GetBaseInfoDetailClass = new GetBaseInfoDetailClass() ///左上角操作人員
  selectBeProxyMan_ManInfo: ManInfoClass

  errorBeProxyManState = { state: false, errorString: '' }

  getBeProxyMan_ManInfo: ManInfoClass[] = []

  ProxyMan = {
    EmpCode: '',
    EmpName: ''
  }
  chooseSortArray = [1, 2, 3, 4, 5, 6, 7, 8, 9]
  selectSort = 1

  SetAgentArray: GetCheckAgentClass[] = [] //取得代理人資訊
  SetBeApppointedAgentArray: GetCheckAgentClass[] = [] //取得你那些人設定你為代理人

  searchBeProxyMan: GetBaseInfoDetailClass = new GetBaseInfoDetailClass()

  ngOnInit() {

    this.GetApiUserService.counter$.subscribe(
      (x: any) => {
        if (x == 0) {

        } else {
          this.FirstMan = JSON.parse(JSON.stringify(x));
          this.BeProxyMan = JSON.parse(JSON.stringify(x));
          this.searchBeProxyMan = JSON.parse(JSON.stringify(x));
          this.onGetCheckAgent(x.EmpCode)
          this.GetManInfo(this.BeProxyMan.EmpCode)
        }
      }
    )
  }
  GetManInfo(EmpCode) {
    this.LoadingPage.show()
    this.GetApiDataServiceService.getWebApiData_GetManInfo(EmpCode)
      .subscribe(
        (x: ManInfoClass[]) => {
          this.getBeProxyMan_ManInfo = []
          this.selectBeProxyMan_ManInfo = x[0]
          this.getBeProxyMan_ManInfo = x
          this.BeProxyMan.EmpNameC = x[0].EmpName
          this.LoadingPage.hide()
        }, error => {
          this.LoadingPage.hide()
        }
      )
  }
  blurBeProxyManEmpCode() {
    if (this.BeProxyMan.EmpCode.length == 7) {
      this.LoadingPage.show()
      if (this.BeProxyMan.EmpCode == this.FirstMan.EmpCode) {
        this.GetManInfo(this.BeProxyMan.EmpCode)
        this.errorBeProxyManState = { state: false, errorString: '' };
        $("#leavejobid").removeClass("errorInput");
      } else {

        var _NowDate = new Date();
        var _NowToday = doFormatDate(_NowDate);

        var GetBaseByForm: GetBaseByFormClass = {
          EmpCode: this.FirstMan.EmpCode,
          AppEmpCode: this.BeProxyMan.EmpCode,
          EffectDate: _NowToday
        }
        this.Assistant(GetBaseByForm)
      }
    } else {
      this.BeProxyMan.EmpNameC = ''
      $("#leavejobid").addClass("errorInput");
      this.errorBeProxyManState = { state: true, errorString: '無該部門的行政權限' };
    }
  }
  private Assistant(GetBaseByForm: GetBaseByFormClass) {
    //行政權限
    this.GetApiDataServiceService.getWebApiData_GetBaseByFormStaff(GetBaseByForm)
      .pipe(takeWhile(() => this.api_subscribe))
      .subscribe((x: any) => {
        if (x == null) {
          // alert('工號輸入錯誤')
          this.errorBeProxyManState = { state: true, errorString: '無該部門的行政權限' };
          this.BeProxyMan.EmpNameC = ''
          $("#leavejobid").addClass("errorInput");
          this.LoadingPage.hide();
        }
        else if (x.length == 0) {
          // alert('工號輸入錯誤')
          this.BeProxyMan.EmpNameC = ''
          this.errorBeProxyManState = { state: true, errorString: '無該部門的行政權限' };
          $("#leavejobid").addClass("errorInput");
          this.LoadingPage.hide();
        }
        else {
          // alert('工號正確')
          if (x[0].EmpNameC == null) {
            this.BeProxyMan.EmpNameC = x[0].EmpNameE;
          }
          else if (x[0].EmpNameC.length == 0) {
            this.BeProxyMan.EmpNameC = x[0].EmpNameE;
          }
          else {
            this.BeProxyMan.EmpNameC = x[0].EmpNameC;
          }
          this.errorBeProxyManState = { state: false, errorString: '' };
          $("#leavejobid").removeClass("errorInput");
          this.GetManInfo(this.BeProxyMan.EmpCode)
        }
      }, error => {
        this.LoadingPage.hide();
      });
  }
  CanSearchGetCheckAgent(EmpID: string) {
    if (EmpID == this.FirstMan.EmpCode) {
      this.onGetCheckAgent(EmpID)
    } else {
      this.LoadingPage.show()

      var _NowDate = new Date();
      var _NowToday = doFormatDate(_NowDate);

      var GetBaseByForm: GetBaseByFormClass = {
        EmpCode: this.FirstMan.EmpCode,
        AppEmpCode: EmpID,
        EffectDate: _NowToday
      }
      this.GetApiDataServiceService.getWebApiData_GetBaseByFormStaff(GetBaseByForm)
        .pipe(takeWhile(() => this.api_subscribe))
        .subscribe((x: any) => {
          if (x == null) {
            // alert('工號輸入錯誤')
            alert('無部門行政權限')
            this.LoadingPage.hide()
          }
          else if (x.length == 0) {
            // alert('工號輸入錯誤')
            alert('無部門行政權限')
            this.LoadingPage.hide()
          }
          else {
            // alert('工號正確')
            this.onGetCheckAgent(EmpID)
          }
        }, error => {
          this.LoadingPage.hide();
        });
    }
  }
  onGetCheckAgent(EmpID: string) {
    //取得代理人資訊
    this.LoadingPage.show()
    this.GetApiDataServiceService.getWebApiData_GetCheckAgent(EmpID)
      .pipe(takeWhile(() => this.api_subscribe))
      .subscribe(
        (x: GetCheckAgentClass[]) => {
          this.SetAgentArray = JSON.parse(JSON.stringify(x))
          for (let oneAgent of this.SetAgentArray) {
            oneAgent.DateB = formatDateTime(oneAgent.DateB).getDate
            oneAgent.DateE = formatDateTime(oneAgent.DateE).getDate
            oneAgent.KeyDate = formatDateTime(oneAgent.KeyDate).getDate
          }
          this.SetAgentArray.sort((a: GetCheckAgentClass, b: GetCheckAgentClass) => {
            return a.Sort - b.Sort;
          });
          
          this.GetApiDataServiceService.getWebApiData_GetCheckAgentBySource(EmpID)
            .pipe(takeWhile(() => this.api_subscribe))
            .subscribe(
              (y: GetCheckAgentClass[]) => {
                this.SetBeApppointedAgentArray = JSON.parse(JSON.stringify(y))
                for (let oneBeAgent of this.SetBeApppointedAgentArray) {
                  oneBeAgent.DateB = formatDateTime(oneBeAgent.DateB).getDate
                  oneBeAgent.DateE = formatDateTime(oneBeAgent.DateE).getDate
                  oneBeAgent.KeyDate = formatDateTime(oneBeAgent.KeyDate).getDate
                }
                this.SetBeApppointedAgentArray.sort((a: GetCheckAgentClass, b: GetCheckAgentClass) => {
                  return a.Sort - b.Sort;
                });
                // console.log(this.SetBeApppointedAgentArray)
                this.LoadingPage.hide()
              })

        }, error => {
          this.LoadingPage.hide()
        }
      )
  }
  onSaveEmptoView_ProxyMan(event) {
    // event.split('，')[0]
    // event.split('，')[1]
    // console.log(event)

    this.ProxyMan = {
      EmpCode: event.split('，')[0],
      EmpName: event.split('，')[1]
    }
    if (event) {
      $('#chooseEmpdialog_Proxy').modal('hide');
      this.blurProxyManCode()
    }
  }
  onSaveEmptoView(event) {
    // event.split('，')[0]
    // event.split('，')[1]
    // console.log(event)

    this.BeProxyMan.EmpCode = event.split('，')[0]
    this.BeProxyMan.EmpNameC = event.split('，')[1]
    if (event) {
      $('#chooseEmpdialog').modal('hide');
      this.blurBeProxyManEmpCode()
    }
  }
  OnSubmit() {
    // console.log(SaveCheckAgent)
    if (this.errorBeProxyManState.state) {

    } else if (this.errorProxyManCodeState.state) {

    } else if (!this.ProxyMan.EmpCode) {
      this.errorProxyManCodeState = { state: true, errorString: '無該部門的行政權限' };
      $("#leavejobid_Proxy").addClass("errorInput");
    } else if (!this.BeProxyMan.EmpCode) {
      this.errorBeProxyManState = { state: true, errorString: '無該部門的行政權限' };
      $("#leavejobid").addClass("errorInput");
    } else if (!this.dateS) {
      alert('請輸入生效日')
    } else if (!this.dateE) {
      alert('請輸入失效日')
    } else {
      this.LoadingPage.show()
      var InsertCheckAgent: InsertCheckAgentClass = {
        "RoleIdSource": this.selectBeProxyMan_ManInfo.RoleID,
        "EmpIdSource": this.selectBeProxyMan_ManInfo.EmpID,
        "EmpIdTarget": this.ProxyMan.EmpCode,
        "DateB": formatDateTime(this.dateS).getDate,
        "DateE": formatDateTime(this.dateE).getDate,
        "KeyMan": this.FirstMan.EmpID
      }

      this.GetApiDataServiceService.getWebApiData_InsertCheckAgent(InsertCheckAgent)
        .subscribe(
          x => {
            if (x == 1) {
              alert('儲存成功')
              this.onGetCheckAgent(this.BeProxyMan.EmpCode)
              this.LoadingPage.hide()
            } else {
              alert('已有相同代理人')
              this.LoadingPage.hide()
            }
          }, error => {
            // alert('與api連線失敗，getWebApiData_SaveCheckAgent，請洽資訊人員')
            this.LoadingPage.hide()
          }
        )
    }


  }

  EditAgent: GetCheckAgentClass = new GetCheckAgentClass()
  editDateS: Date
  editDateE: Date

  editAgentDate(GetCheckAgent: GetCheckAgentClass) {
    this.EditAgent = GetCheckAgent
    this.editDateS = new Date(GetCheckAgent.DateB)
    this.editDateE = new Date(GetCheckAgent.DateE)
    $('#editAgentDialog').modal('show')
  }
  bt_EditAgent() {
    //修改代理人
    this.LoadingPage.show()
    if (!this.editDateS) {
      alert('請輸入生效日')
    } else if (!this.editDateE) {
      alert('請輸入失效日')
    } else {

      var UpdateCheckAgent: UpdateCheckAgentClass = {
        "Key": this.EditAgent.Key,
        "DateB": formatDateTime(this.editDateS).getDate,
        "DateE": formatDateTime(this.editDateE).getDate,
        "IsValid": true,
        "KeyMan": this.FirstMan.EmpCode
      }
      this.GetApiDataServiceService.getWebApiData_UpdateCheckAgent(UpdateCheckAgent)
        .subscribe(
          (x: any) => {
            if (x == '1') {
              this.onGetCheckAgent(this.BeProxyMan.EmpCode)
              $('#editAgentDialog').modal('hide')
            } else {
              alert('修改失敗')
            }
            this.LoadingPage.hide()
          }, error => {
            this.LoadingPage.hide()
          }
        )
    }
  }

  DelAgentKey: GetCheckAgentClass
  checkDelAgent(Key: GetCheckAgentClass) {
    this.DelAgentKey = Key
    $('#DelAgentDialog').modal('show')
  }
  bt_DelAgent(GetCheckAgent: GetCheckAgentClass) {
    //刪除代理人
    this.LoadingPage.show()
    var UpdateCheckAgent: UpdateCheckAgentClass = {
      "Key": GetCheckAgent.Key,
      "DateB": GetCheckAgent.DateB,
      "DateE": GetCheckAgent.DateE,
      "IsValid": false,
      "KeyMan": this.FirstMan.EmpCode
    }
    this.GetApiDataServiceService.getWebApiData_UpdateCheckAgent(UpdateCheckAgent)
      .subscribe(
        (x: any) => {
          if (x == '1') {
            this.onGetCheckAgent(this.BeProxyMan.EmpCode)
          } else {
            alert('刪除失敗')
          }
          this.LoadingPage.hide()
        }, error => {
          this.LoadingPage.hide()
        }
      )
  }

  errorProxyManCodeState = { state: false, errorString: "" }
  blurProxyManCode() {
    if (this.ProxyMan.EmpCode.length == 7) {

      this.LoadingPage.show()
      this.GetApiDataServiceService.getWebApiData_GetBase([this.ProxyMan.EmpCode], '')
        .pipe(takeWhile(() => this.api_subscribe))
        .subscribe((x: any) => {
          if (x == null) {
            // alert('工號輸入錯誤')
            this.ProxyMan.EmpName = '';
            this.errorProxyManCodeState = { state: true, errorString: '請確認員工號是否正確' };
            $("#leavejobid_Proxy").addClass("errorInput");
            this.LoadingPage.hide();
          } else if (x.length == 0) {
            // alert('工號輸入錯誤')
            this.ProxyMan.EmpName = '';
            this.errorProxyManCodeState = { state: true, errorString: '請確認員工號是否正確' };
            $("#leavejobid_Proxy").addClass("errorInput");
            this.LoadingPage.hide();
          } else {
            // alert('工號正確')
            if (x[0].EmpNameC == null) {
              this.ProxyMan.EmpName = x[0].EmpNameE;
            }
            else if (x[0].EmpNameC.length == 0) {
              this.ProxyMan.EmpName = x[0].EmpNameE;
            }
            else {
              this.ProxyMan.EmpName = x[0].EmpNameC;
            }
            this.errorProxyManCodeState = { state: false, errorString: '' };
            $("#leavejobid_Proxy").removeClass("errorInput");
            this.LoadingPage.hide()
          }
        }, error => {
          this.LoadingPage.hide()
        })
    } else {
      this.errorProxyManCodeState = { state: true, errorString: '無該部門的行政權限' };
      this.ProxyMan.EmpName = '';
      $("#leavejobid_Proxy").addClass("errorInput");
      this.LoadingPage.hide();
    }
  }


}
