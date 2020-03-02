import { Component, OnInit, Output, EventEmitter, Input, AfterViewInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';

import { AttendCard } from 'src/app/Models/AttendCard'
import { doFormatDate, getapi_formatTimetoString, sumbit_formatTimetoString, formatDateTime, reSplTimeHHmm } from 'src/app/UseVoid/void_doFormatDate';
import { GetApiDataServiceService } from 'src/app/Service/get-api-data-service.service';
import { SaveAndFlowStartClass, ForgetSaveAndFlowStartClass } from 'src/app/Models/PostData_API_Class/SaveAndFlowStartClass';
import { isValidDate, isValidTime } from 'src/app/UseVoid/void_isVaildDatetime';
import { CardCheckClass } from 'src/app/Models/PostData_API_Class/CardCheckClass';
import { FlowCardCheckClass } from 'src/app/Models/PostData_API_Class/FlowCardCheckClass';
import { Router } from '@angular/router';
import { uploadFileClass } from 'src/app/Models/uploadFileClass';
import { NgxSpinnerService } from 'ngx-spinner';
import { ExampleHeader } from 'src/app/Service/datepickerHeader';
import { BehaviorSubject, Observable } from 'rxjs';
import { GetSelectBaseClass } from 'src/app/Models/GetSelectBaseClass';
import { takeWhile } from 'rxjs/operators';
import { CardPatchSaveAndFlowStartClass } from 'src/app/Models/PostData_API_Class/CardPatchSaveAndFlowStartClass';
import { ResponeStateClass } from 'src/app/Models/ResponeStateClass';
import { rmCardTempFormStateClass } from '../rm-card-form-temp/rm-card-form-temp.component';
import { SaveAndFlowStartCombineClass, AttendUnusualFlowApp, CardFlowApp } from 'src/app/Models/PostData_API_Class/SaveAndFlowStartCombineClass';
import { CardTempFormStateClass } from '../card-form-temp/card-form-temp.component';
import { ShowVa } from 'src/app/Models/ShowVa';
import { GetOtViewGetApiData } from 'src/app/Models/GetOtViewGetApiData';
import { chinesenum } from 'src/app/UseVoid/void_chinesenumber';
import { GetAbsDetailByListEmpIDGetApiClass } from 'src/app/Models/PostData_API_Class/GetAbsDetailByListEmpIDGetApiClass';
import { GetAbsDetailByListEmpIDDataClass } from 'src/app/Models/GetAbsDetailByListEmpIDDataClass';
import { GetOtViewGetApi } from 'src/app/Models/PostData_API_Class/GetOtViewGetApi';
import { GetCardFlowAppsGetApi } from 'src/app/Models/PostData_API_Class/GetCardFlowAppsGetApi';
import { GetCardFlowAppsGetApiDataClass } from 'src/app/Models/GetCardFlowAppsGetApiDataClass';
import { void_completionTenNum } from 'src/app/UseVoid/void_CompletionTenNum';

declare let $: any; //use jquery
declare var otSysURL //加班系統網址

@Component({
  selector: 'app-rm-card-form-write',
  templateUrl: './rm-card-form-write.component.html',
  styleUrls: ['./rm-card-form-write.component.css']
})
export class RmCardFormWriteComponent implements OnInit, AfterViewInit, OnDestroy {
  startTimeDropper: any
  endTimeDropper: any

  CardFormTemp: CardTempFormStateClass
  CardForm(event) {
    this.CardFormTemp = event
  }

  OnBeforeMinsF: rmCardTempFormStateClass
  OffAfterMinsF: rmCardTempFormStateClass
  EarlyMinsF: rmCardTempFormStateClass
  LateMinsF: rmCardTempFormStateClass
  OnBeforeMinsForm(event) {
    this.OnBeforeMinsF = event
  }
  OffAfterMinsForm(event) {
    this.OffAfterMinsF = event
  }

  EarlyMinsForm(event) {
    this.EarlyMinsF = event
  }
  LateMinsForm(event) {
    this.LateMinsF = event
  }
  exampleHeader = ExampleHeader //日期套件header
  ngOnDestroy(): void {
    this.api_subscribe = false;
  }
  api_subscribe = true; //ngOnDestroy時要取消訂閱api的subscribe
  ngAfterViewInit(): void {
  }
  goWork: boolean = false;//到勤
  offWork: boolean = false;//離勤

  ActualRote_calCrossDay: boolean = false //出勤是否跨天
  AttendCard_calCrossDay: boolean = false //刷卡紀錄是否跨天

  @Input() getAttendCard: AttendCard;
  @Output() outputWriteforgetformChange: EventEmitter<any> = new EventEmitter<any>();//返回修改按鈕

  private Sub_onChangeSignMan$: BehaviorSubject<any> = new BehaviorSubject(0)
  onChangeSingMan$: Observable<any> = this.Sub_onChangeSignMan$; //切換選擇簽核人員使用

  constructor(private GetApiDataServiceService: GetApiDataServiceService,
    private router: Router,
    private LoadingPage: NgxSpinnerService) { }

  selectOnWorkArray = []
  selectOffWorkArray = []
  OnWorkDate: string
  OffWorkDate: string

  cR_OnBeforeMins = 1
  cR_OffAfterMins = 1

  cR_EarlyMins = 1
  cR_LateMins = 1

  cR_IsAbsent = 1

  checkdisable() {

    if (
      ((this.getAttendCard.OnBeforeMins && !this.getAttendCard.EliminateOnBefore) || (this.getAttendCard.OffAfterMins && !this.getAttendCard.EliminateOffAfter))
      &&
      (this.getAttendCard.EarlyMins || this.getAttendCard.LateMins)
    ) {
      //有遲到+晚退 或 早退+早到的狀況
      if (this.cR_OnBeforeMins == 0 && this.cR_OffAfterMins == 0 && this.cR_EarlyMins == 0 && this.cR_LateMins == 0) {
        return true
      } else if (this.cR_LateMins == 0 && this.cR_OffAfterMins == 0) {
        return true
      } else if (this.cR_EarlyMins == 0 && this.cR_OnBeforeMins == 0) {
        return true
      } else if (this.cR_LateMins == 0 && this.cR_OffAfterMins == 2) {
        return true
      } else if (this.cR_EarlyMins == 0 && this.cR_OnBeforeMins == 2) {
        return true
      } else if (this.cR_LateMins == 1 && this.cR_OffAfterMins == 0) {
        return true
      } else if (this.cR_EarlyMins == 1 && this.cR_OnBeforeMins == 0) {
        return true
      } else if (this.cR_LateMins == 1 && this.cR_OffAfterMins == 2) {
        return true
      } else if (this.cR_EarlyMins == 1 && this.cR_OnBeforeMins == 2) {
        return true
      } else {
        if (this.cR_OnBeforeMins == 3) {
          if (!this.OnBeforeMinsF) {
            return true
          } else if (this.OnBeforeMinsF.FormState != 'VALID')
            return true
        }
        if (this.cR_OffAfterMins == 3) {
          if (!this.OffAfterMinsF) {
            return true
          } else if (this.OffAfterMinsF.FormState != 'VALID')
            return true
        }
        if (this.cR_EarlyMins == 2) {
          if (!this.EarlyMinsF) {
            return true
          } else if (this.EarlyMinsF.FormState != 'VALID')
            return true
        }
        if (this.cR_LateMins == 2) {
          if (!this.LateMinsF) {
            return true
          } else if (this.LateMinsF.FormState != 'VALID')
            return true
        }
      }
      if ((this.cR_OnBeforeMins == 3 || this.cR_OffAfterMins == 3 || this.cR_EarlyMins == 2 || this.cR_LateMins == 2) && !this.FlowDynamic_Base) {
        return true
      }
      return false
    }
    if ((this.getAttendCard.OffAfterMins && !this.getAttendCard.EliminateOffAfter) && (this.getAttendCard.OnBeforeMins && !this.getAttendCard.EliminateOnBefore)) {
      //早到+晚退
      if (this.cR_OnBeforeMins == 0 || this.cR_OffAfterMins == 0) {
        return true
      }
      if (this.cR_OnBeforeMins != 3 && this.cR_OffAfterMins != 3) {
        return true
      }
      if (this.cR_OnBeforeMins == 3 && this.cR_OffAfterMins != 3) {
        if (!this.OnBeforeMinsF) {
          return true
        } else if (this.OnBeforeMinsF.FormState != 'VALID')
          return true
      }
      if (this.cR_OffAfterMins == 3 && this.cR_OnBeforeMins != 3) {
        if (!this.OffAfterMinsF) {
          return true
        } else if (this.OffAfterMinsF.FormState != 'VALID')
          return true
      }
      if (this.cR_OffAfterMins == 3 && this.cR_OnBeforeMins == 3) {
        if (!this.OnBeforeMinsF) {
          return true
        } else if (this.OnBeforeMinsF.FormState != 'VALID')
          return true
        if (!this.OffAfterMinsF) {
          return true
        } else if (this.OffAfterMinsF.FormState != 'VALID')
          return true
      }
    } else {

      if (this.getAttendCard.OnBeforeMins && !this.getAttendCard.EliminateOnBefore) {
        if (this.cR_OnBeforeMins == 0 || this.cR_OnBeforeMins == 2) {
          return true
        } else {
          if (this.cR_OnBeforeMins == 3) {
            if (!this.OnBeforeMinsF) {
              return true
            } else if (this.OnBeforeMinsF.FormState != 'VALID')
              return true
          }
        }
      }
      if (this.getAttendCard.OffAfterMins && !this.getAttendCard.EliminateOffAfter) {
        if (this.cR_OffAfterMins == 0 || this.cR_OffAfterMins == 2) {
          return true
        } else {
          if (this.cR_OffAfterMins == 3) {
            if (!this.OffAfterMinsF) {
              return true
            } else if (this.OffAfterMinsF.FormState != 'VALID')
              return true
          }
        }
      }
    }
    if (this.getAttendCard.EarlyMins && this.getAttendCard.LateMins) {
      //遲到+早退
      if (this.cR_EarlyMins == 0 && this.cR_LateMins == 0) {
        return true
      }
      if (this.cR_EarlyMins != 2 && this.cR_LateMins != 2) {
        return true
      }

      if (this.cR_EarlyMins == 2 && this.cR_LateMins != 2) {
        if (!this.EarlyMinsF) {
          return true
        } else if (this.EarlyMinsF.FormState != 'VALID')
          return true
      }
      if (this.cR_LateMins == 2 && this.cR_EarlyMins != 2) {
        if (!this.LateMinsF) {
          return true
        } else if (this.LateMinsF.FormState != 'VALID')
          return true
      }

      if (this.cR_EarlyMins == 2 && this.cR_LateMins == 2) {
        if (!this.EarlyMinsF) {
          return true
        } else if (this.EarlyMinsF.FormState != 'VALID')
          return true
        if (!this.LateMinsF) {
          return true
        } else if (this.LateMinsF.FormState != 'VALID')
          return true
      }
    } else {
      if (this.getAttendCard.EarlyMins) {
        if (this.cR_EarlyMins == 0 || this.cR_EarlyMins == 1) {
          return true
        } else {
          if (this.cR_EarlyMins == 2) {
            if (!this.EarlyMinsF) {
              return true
            } else if (this.EarlyMinsF.FormState != 'VALID')
              return true
          }
        }
      }
      if (this.getAttendCard.LateMins) {
        if (this.cR_LateMins == 0 || this.cR_LateMins == 1) {
          return true
        } else {
          if (this.cR_LateMins == 2) {
            if (!this.LateMinsF) {
              return true
            } else if (this.LateMinsF.FormState != 'VALID')
              return true
          }
        }
      }
    }
    var isHaveSingMan: boolean = false
    if (this.FlowDynamic_Base) {
      if (this.FlowDynamic_Base.EmpID.length > 0) {
        isHaveSingMan = true
      }
    }
    if ((this.cR_OnBeforeMins == 3 || this.cR_OffAfterMins == 3 || this.cR_EarlyMins == 2 || this.cR_LateMins == 2) && !isHaveSingMan) {
      return true
    }
    return false
  }
  disOnBeforeRadio(realRadio, uiRadio) {
    if (realRadio == uiRadio) {
      this.cR_OnBeforeMins = 0
    }
    this.clearFlowDynamic_Base()
  }
  disOffAfterRadio(realRadio, uiRadio) {
    if (realRadio == uiRadio) {
      this.cR_OffAfterMins = 0
    }
    this.clearFlowDynamic_Base()
  }
  disEarlyRadio(realRadio, uiRadio) {
    if (realRadio == uiRadio) {
      this.cR_EarlyMins = 0
    }
    this.clearFlowDynamic_Base()
  }
  disLateRadio(realRadio, uiRadio) {
    if (realRadio == uiRadio) {
      this.cR_LateMins = 0
    }
    this.clearFlowDynamic_Base()
  }
  disAbsentRadio(realRadio, uiRadio) {
    if (realRadio == uiRadio) {
      this.cR_IsAbsent = 0
    }
    this.clearFlowDynamic_Base()
  }
  clearFlowDynamic_Base() {
    if (!(this.cR_LateMins == 2 || this.cR_EarlyMins == 2 || this.cR_OnBeforeMins == 3 || this.cR_OffAfterMins == 3)) {
      this.FlowDynamic_Base = null
    }
  }

  ngOnInit() {
    this.Sub_onChangeSignMan$.next(this.getAttendCard.forget_man_code)
    this.inViewSearchCardFormFlow()
  }


  onpreviousForm() {
    //返回按鈕
    this.outputWriteforgetformChange.emit();
    // console.log(this.outputWriteforgetformChange)
  }
  FlowDynamic_Base: GetSelectBaseClass;
  chooseBase(GetSelectBase: GetSelectBaseClass) {
    this.FlowDynamic_Base = GetSelectBase
  }

  checkCardFormDisable() {
    if (!this.CardFormTemp) {
      return true
    } else if (this.CardFormTemp.FormState != 'VALID') {
      return true
    } else if (!this.FlowDynamic_Base) {
      return true
    } else if (!this.CardFormTemp.CardTempFormData.goWork && !this.CardFormTemp.CardTempFormData.offWork) {
      return true
    } else {
      return false
    }
  }
  checkError() {
    $('#checksenddialog').modal('show');
  }
  onSubmit() {
    var ErrorStateCode
    var ErrorStateName
    if (this.getAttendCard.IsAbsent) {
      ErrorStateCode = 3
      ErrorStateName = '未刷卡'
    } else {
      ErrorStateCode = 0
      ErrorStateName = '正常'
    }
    var DateTimeB = ''
    var DateTimeE = ''
    if (this.CardFormTemp.CardTempFormData.rcFirstCardDate && this.CardFormTemp.CardTempFormData.rcFirstCardTime) {
      DateTimeB = new Date(this.CardFormTemp.CardTempFormData.rcFirstCardDate + ' ' + this.CardFormTemp.CardTempFormData.rcFirstCardTime).toJSON()
    }
    if (this.CardFormTemp.CardTempFormData.rcSecondCardDate && this.CardFormTemp.CardTempFormData.rcSecondCardTime) {
      DateTimeE = new Date(this.CardFormTemp.CardTempFormData.rcSecondCardDate + ' ' + this.CardFormTemp.CardTempFormData.rcSecondCardTime).toJSON()
    }
    var SaveAndFlowStartCombine: SaveAndFlowStartCombineClass[] = [
      {
        "AttendUnusualFlowApp": null,
        "CardFlowApp": {
          "FlowApps": [
            {
              "EmpID": this.getAttendCard.forget_man_code.toString(),
              "EmpCode": this.getAttendCard.forget_man_code.toString(),
              "EmpNameC": this.getAttendCard.forget_man_name,
              "Date": this.getAttendCard.AttendDate,
              "RoteDateTimeB": this.getAttendCard.ActualRote_OnDateTime ? this.getAttendCard.ActualRote_OnDateTime : '',
              "RoteDateTimeE": this.getAttendCard.ActualRote_OffDateTime ? this.getAttendCard.ActualRote_OffDateTime : '',
              "CardDateTimeB": this.getAttendCard.AttendCard_OnDateTime ? this.getAttendCard.AttendCard_OnDateTime : '',
              "CardDateTimeE": this.getAttendCard.AttendCard_OffDateTime ? this.getAttendCard.AttendCard_OffDateTime : '',
              "DateB": this.CardFormTemp.CardTempFormData.rcFirstCardDate ? this.CardFormTemp.CardTempFormData.rcFirstCardDate.valueOf().toString() : '',
              "DateE": this.CardFormTemp.CardTempFormData.rcSecondCardDate ? this.CardFormTemp.CardTempFormData.rcSecondCardDate.valueOf().toString() : '',
              "TimeB": this.CardFormTemp.CardTempFormData.rcFirstCardTime ? sumbit_formatTimetoString(this.CardFormTemp.CardTempFormData.rcFirstCardTime.valueOf().toString()) : '',
              "TimeE": this.CardFormTemp.CardTempFormData.rcSecondCardTime ? sumbit_formatTimetoString(this.CardFormTemp.CardTempFormData.rcSecondCardTime.valueOf().toString()) : '',
              "DateTimeB": DateTimeB,
              "DateTimeE": DateTimeE,
              "CauseID1": parseInt(this.CardFormTemp.CardTempFormData.rcCauseID.valueOf().toString()),
              "CauseName1": this.CardFormTemp.CardTempFormData.rcCauseName,
              "CauseID2": 0,
              "CauseName2": "",
              "Note": this.CardFormTemp.CardTempFormData.rcNote.toString(),
              "Info": "",
              "MailBody": "",
              "State": "1",
              "UploadFile": this.CardFormTemp.CardTempFormData.rcUploadData,
              "ExceptionalCode": this.getExceptional().ExceptionalCode,
              "ExceptionalName": this.getExceptional().ExceptionalName, //有異常但沒註記
              "ExceptionalCodeCancel": this.getExceptional().ExceptionalCodeCancel,
              "ExceptionalNameCancel": this.getExceptional().ExceptionalNameCancel, //有異常且已經註記
              "ErrorStateCode": ErrorStateCode,
              "ErrorStateName": ErrorStateName
            }
          ],
          "EmpID": this.getAttendCard.write_man_code,
          "EmpCode": this.getAttendCard.write_man_code,
          "EmpNameC": this.getAttendCard.write_man_name,
          "State": "1"
        },
        "FlowDynamic": {
          "FlowNode": "519",
          "RoleID": "",
          "EmpID": this.FlowDynamic_Base.EmpID,
          "DeptID": this.FlowDynamic_Base.DeptaID.toString(),
          "PosID": this.FlowDynamic_Base.JobID.toString()
        },
        "ErrorState": ErrorStateName
      }
    ]
    // console.log(SaveAndFlowStartCombine)
    this.LoadingPage.show()
    /**
     * @todo 正常、未刷卡起單
     */
    this.GetApiDataServiceService.getWebApiData_SaveAndFlowStartCombine(SaveAndFlowStartCombine)
      .pipe(takeWhile(() => this.api_subscribe))
      .subscribe((ResponeStateArray: ResponeStateClass[]) => {
        // console.log(SaveAndFlowStart)
        if (ResponeStateArray[0].isOK) {
          $('#sussesdialog').modal('show');
        } else {
          var errMsg = ''
          for (let e of ResponeStateArray[0].ErrorMsg) {
            errMsg += e + '。 '
          }
          alert(errMsg);
        }
        this.LoadingPage.hide()
      },
        error => {
          this.LoadingPage.hide()
        })

  }

  getExceptional() {

    var ExceptionalCode = ''
    var ExceptionalName = ''

    if (this.getAttendCard.EarlyMins && !this.getAttendCard.EliminateEarly) {
      ExceptionalCode += '1,'
      ExceptionalName += '早退,'
    }
    if (this.getAttendCard.LateMins && !this.getAttendCard.EliminateLate) {
      ExceptionalCode += '2,'
      ExceptionalName += '遲到,'
    }
    if (this.getAttendCard.IsAbsent && !this.getAttendCard.EliminateAbsent) {
      ExceptionalCode += '3,'
      ExceptionalName += '未刷卡,'
    }
    if (this.getAttendCard.OnBeforeMins && !this.getAttendCard.EliminateOnBefore) {
      ExceptionalCode += '4,'
      ExceptionalName += '早到,'
    }
    if (this.getAttendCard.OffAfterMins && !this.getAttendCard.EliminateOffAfter) {
      ExceptionalCode += '5,'
      ExceptionalName += '晚退,'
    } else if (
      (!this.getAttendCard.LateMins || (this.getAttendCard.LateMins && this.getAttendCard.EliminateLate)) &&
      (!this.getAttendCard.EarlyMins || (this.getAttendCard.EarlyMins && this.getAttendCard.EliminateEarly)) &&
      (!this.getAttendCard.IsAbsent || (this.getAttendCard.IsAbsent && this.getAttendCard.EliminateAbsent)) &&
      (!this.getAttendCard.OnBeforeMins || (this.getAttendCard.OnBeforeMins && this.getAttendCard.EliminateOnBefore)) &&
      (!this.getAttendCard.OffAfterMins || (this.getAttendCard.OffAfterMins && this.getAttendCard.EliminateOffAfter))
    ) {

      ExceptionalCode += '0,'
      ExceptionalName += '正常,'
      if (this.getAttendCard.IsAbnormal) {
        ExceptionalCode += '-1,'
        ExceptionalName += '不判斷,'
      }
    }

    var ExceptionalCodeCancel = ''
    var ExceptionalNameCancel = ''
    if (this.getAttendCard.LateMins && this.getAttendCard.EliminateLate) {
      ExceptionalCodeCancel += '1,'
      ExceptionalNameCancel += '早退,'
    }
    if (this.getAttendCard.EarlyMins && this.getAttendCard.EliminateEarly) {
      ExceptionalCodeCancel += '2,'
      ExceptionalNameCancel += '遲到,'
    }
    if (this.getAttendCard.IsAbsent && this.getAttendCard.EliminateAbsent) {
      ExceptionalCodeCancel += '3,'
      ExceptionalNameCancel += '未刷卡,'
    }
    if (this.getAttendCard.OnBeforeMins && this.getAttendCard.EliminateOnBefore) {
      ExceptionalCodeCancel += '4,'
      ExceptionalNameCancel += '早到,'
    }
    if (this.getAttendCard.OffAfterMins && this.getAttendCard.EliminateOffAfter) {
      ExceptionalCodeCancel += '5,'
      ExceptionalNameCancel += '晚退,'
    }
    return {
      "ExceptionalCode": ExceptionalCode,
      "ExceptionalName": ExceptionalName,
      "ExceptionalCodeCancel": ExceptionalCodeCancel,
      "ExceptionalNameCancel": ExceptionalNameCancel,
    }
  }

  checkStateSubmit() {
    $('#errStateCheckDialog').modal('show')
  }

  
  OnBeforeAttendUnusual:boolean = false //送出早到註記單
  OnBeforeCardPatch:boolean = false //送出早到補卡單
  OffAfterAttendUnusual = false //送出晚退註記單
  OffAfterCardPatch:boolean = false //送出晚退補卡單
  LateCardPatch:boolean = false //送出遲到補卡單
  EarlyCardPatch:boolean = false //送出早退補卡單

  onStateSubmit() {


    var uiRmCardTempFormState: uiRmCardTempFormStateClass[] = []

    if (this.OnBeforeMinsF && this.cR_OnBeforeMins == 3) {
      uiRmCardTempFormState.push({
        ErrorStateCode: 4,
        ErrorStateName: "早到",
        rmCardTempFormState: this.OnBeforeMinsF
      })
    }
    if (this.OffAfterMinsF && this.cR_OffAfterMins == 3) {
      uiRmCardTempFormState.push({
        ErrorStateCode: 5,
        ErrorStateName: "晚退",
        rmCardTempFormState: this.OffAfterMinsF
      })
    }
    if (this.EarlyMinsF && this.cR_EarlyMins == 2) {
      uiRmCardTempFormState.push({
        ErrorStateCode: 1,
        ErrorStateName: "早退",
        rmCardTempFormState: this.EarlyMinsF
      })
    }
    if (this.LateMinsF && this.cR_LateMins == 2) {
      uiRmCardTempFormState.push({
        ErrorStateCode: 2,
        ErrorStateName: "遲到",
        rmCardTempFormState: this.LateMinsF
      })
    }
    var uiAttendUnusualFlowApp: AttendUnusualFlowApp = {
      "FlowApps": [
        {
          "EmpID": this.getAttendCard.forget_man_code.toString(),
          "EmpCode": this.getAttendCard.forget_man_code.toString(),
          "EmpNameC": this.getAttendCard.forget_man_name,
          "Date": this.getAttendCard.AttendDate,
          "RoteDateTimeB": this.getAttendCard.ActualRote_OnDateTime ? this.getAttendCard.ActualRote_OnDateTime : '',
          "RoteDateTimeE": this.getAttendCard.ActualRote_OffDateTime ? this.getAttendCard.ActualRote_OffDateTime : '',
          "CardDateTimeB": this.getAttendCard.AttendCard_OnDateTime ? this.getAttendCard.AttendCard_OnDateTime : '',
          "CardDateTimeE": this.getAttendCard.AttendCard_OffDateTime ? this.getAttendCard.AttendCard_OffDateTime : '',
          "EliminateLate": false,
          "EliminateEarly": false,
          "EliminateAbsent": false,
          "EliminateOnBefore": false,
          "EliminateOffAfter": false,
          "CauseID": 0,
          "CauseName": "個人因素",
          "Note": "",
          "Info": "",
          "MailBody": "",
          "State": "1",
          "UploadFile": [],
          "ExceptionalCode": this.getExceptional().ExceptionalCode,
          "ExceptionalName": this.getExceptional().ExceptionalName, //有異常但沒註記
          "ExceptionalCodeCancel": this.getExceptional().ExceptionalCodeCancel,
          "ExceptionalNameCancel": this.getExceptional().ExceptionalNameCancel, //有異常且已經註記
          "RoteID": this.getAttendCard.RoteID,
          "RoteNameC": this.getAttendCard.RoteNameC,
          "ErrorStateCode": "",
          "ErrorStateName": ""
        }
      ],
      "EmpID": this.getAttendCard.write_man_code,
      "EmpCode": this.getAttendCard.write_man_code,
      "EmpNameC": this.getAttendCard.write_man_name,
      "State": "3"
    }
    var AttendUnusualFlowApp: AttendUnusualFlowApp[] = []
    if ((this.getAttendCard.OnBeforeMins && !this.getAttendCard.EliminateOnBefore) && this.cR_OnBeforeMins == 1) {
      uiAttendUnusualFlowApp.FlowApps[0].ErrorStateCode = "4"
      uiAttendUnusualFlowApp.FlowApps[0].ErrorStateName = "早到"
      uiAttendUnusualFlowApp.FlowApps[0].EliminateOnBefore = true
      AttendUnusualFlowApp.push(uiAttendUnusualFlowApp)
    }
    if ((this.getAttendCard.OffAfterMins && !this.getAttendCard.EliminateOffAfter) && this.cR_OffAfterMins == 1) {
      uiAttendUnusualFlowApp.FlowApps[0].ErrorStateCode = "5"
      uiAttendUnusualFlowApp.FlowApps[0].ErrorStateName = "晚退"
      uiAttendUnusualFlowApp.FlowApps[0].EliminateOffAfter = true
      AttendUnusualFlowApp.push(uiAttendUnusualFlowApp)
    }


    var SaveAndFlowStartCombine: SaveAndFlowStartCombineClass[] = []
    for (let A of AttendUnusualFlowApp) {
      var FlowDynamic_Base_EmpID
      var FlowDynamic_Base_DeptaID
      var FlowDynamic_Base_JobID
      if (this.FlowDynamic_Base) {
        FlowDynamic_Base_EmpID = this.FlowDynamic_Base.EmpID
        FlowDynamic_Base_DeptaID = this.FlowDynamic_Base.DeptaID.toString()
        FlowDynamic_Base_JobID = this.FlowDynamic_Base.JobID.toString()
      }
      SaveAndFlowStartCombine.push(
        {
          "AttendUnusualFlowApp": A,
          "CardFlowApp": null,
          "FlowDynamic": {
            "FlowNode": "519",
            "RoleID": "",
            "EmpID": FlowDynamic_Base_EmpID,
            "DeptID": FlowDynamic_Base_DeptaID,
            "PosID": FlowDynamic_Base_JobID
          },
          "ErrorState": A.FlowApps[0].ErrorStateName
        })
    }

    for (let uiState of uiRmCardTempFormState) {
      var FlowDynamic_Base_EmpID
      var FlowDynamic_Base_DeptaID
      var FlowDynamic_Base_JobID
      if (this.FlowDynamic_Base) {
        FlowDynamic_Base_EmpID = this.FlowDynamic_Base.EmpID
        FlowDynamic_Base_DeptaID = this.FlowDynamic_Base.DeptaID.toString()
        FlowDynamic_Base_JobID = this.FlowDynamic_Base.JobID.toString()
      }
      var DateB: string = ''
      var DateE: string = ''
      var TimeB: string = ''
      var TimeE: string = ''
      var DateTimeB: string = ''
      var DateTimeE: string = ''
      if (uiState.ErrorStateName == "遲到" || uiState.ErrorStateName == "早到") {
        DateB = uiState.rmCardTempFormState.rmCardTempFormData.rcFirstCardDate.valueOf().toString()
        TimeB = uiState.rmCardTempFormState.rmCardTempFormData.rcFirstCardTime.valueOf().toString()
        var _DateTimeB = new Date(DateB + ' ' + TimeB)
        DateTimeB = _DateTimeB.toJSON()
        TimeB = sumbit_formatTimetoString(TimeB)
      }
      if (uiState.ErrorStateName == "早退" || uiState.ErrorStateName == "晚退") {
        DateE = uiState.rmCardTempFormState.rmCardTempFormData.rcFirstCardDate.valueOf().toString()
        TimeE = uiState.rmCardTempFormState.rmCardTempFormData.rcFirstCardTime.valueOf().toString()
        var _DateTimeE = new Date(DateE + ' ' + TimeE)
        DateTimeE = _DateTimeE.toJSON()
        TimeE = sumbit_formatTimetoString(TimeE)
      }
      SaveAndFlowStartCombine.push(
        {
          "AttendUnusualFlowApp": null,
          "CardFlowApp": {
            "FlowApps": [
              {
                "EmpID": this.getAttendCard.forget_man_code.toString(),
                "EmpCode": this.getAttendCard.forget_man_code.toString(),
                "EmpNameC": this.getAttendCard.forget_man_name,
                "Date": this.getAttendCard.AttendDate,
                "RoteDateTimeB": this.getAttendCard.ActualRote_OnDateTime ? this.getAttendCard.ActualRote_OnDateTime : '',
                "RoteDateTimeE": this.getAttendCard.ActualRote_OffDateTime ? this.getAttendCard.ActualRote_OffDateTime : '',
                "CardDateTimeB": this.getAttendCard.AttendCard_OnDateTime ? this.getAttendCard.AttendCard_OnDateTime : '',
                "CardDateTimeE": this.getAttendCard.AttendCard_OffDateTime ? this.getAttendCard.AttendCard_OffDateTime : '',
                "DateB": DateB,
                "DateE": DateE,
                "TimeB": TimeB,
                "TimeE": TimeE,
                "DateTimeB": DateTimeB,
                "DateTimeE": DateTimeE,
                "CauseID1": parseInt(uiState.rmCardTempFormState.rmCardTempFormData.rcCauseID.toString()),
                "CauseName1": uiState.rmCardTempFormState.rmCardTempFormData.rcCauseName,
                "CauseID2": 0,
                "CauseName2": "",
                "Info": "",
                "MailBody": "",
                "State": "1",
                "Note": uiState.rmCardTempFormState.rmCardTempFormData.rcNote.toString(),
                "UploadFile": uiState.rmCardTempFormState.rmCardTempFormData.rcUploadData.valueOf(),
                "ExceptionalCode": this.getExceptional().ExceptionalCode,
                "ExceptionalName": this.getExceptional().ExceptionalName,
                "ExceptionalCodeCancel": this.getExceptional().ExceptionalCodeCancel,
                "ExceptionalNameCancel": this.getExceptional().ExceptionalNameCancel,
                "ErrorStateCode": uiState.ErrorStateCode.toString(),
                "ErrorStateName": uiState.ErrorStateName
              }
            ],
            "EmpID": this.getAttendCard.write_man_code,
            "EmpCode": this.getAttendCard.write_man_code,
            "EmpNameC": this.getAttendCard.write_man_name,
            "State": "1"
          },
          "FlowDynamic": {
            "FlowNode": "519",
            "RoleID": "",
            "EmpID": FlowDynamic_Base_EmpID,
            "DeptID": FlowDynamic_Base_DeptaID,
            "PosID": FlowDynamic_Base_JobID
          },
          "ErrorState": uiState.ErrorStateName
        })
    }
    // console.log(SaveAndFlowStartCombine)

    /**
     * @todo 遲到、早退、早到、晚退起單
     */
    this.LoadingPage.show()
    this.GetApiDataServiceService.getWebApiData_SaveAndFlowStartCombine(SaveAndFlowStartCombine)
      .pipe(takeWhile(() => this.api_subscribe))
      .subscribe((ResponeStateArray: ResponeStateClass[]) => {
        // console.log(SaveAndFlowStart)
        var isOK = true
        for (let state of ResponeStateArray) {
          if (!state.isOK) {
            var errMsg = ''
            for (let e of state.ErrorMsg) {
              errMsg += e + '。 '
            }
            alert(errMsg);
            isOK = false
          }else{
          
            if(state.ErrorState =='早到' && state.FormCode == 'AttendUnusual'){
              this.cR_OnBeforeMins = 0
              this.OnBeforeAttendUnusual = true
            }
            if(state.ErrorState =='晚退' && state.FormCode == 'AttendUnusual'){
              this.cR_OffAfterMins = 0
              this.OffAfterAttendUnusual = true
            }
            if(state.ErrorState =='早到' && state.FormCode == 'CardPatch'){
              this.cR_OnBeforeMins = 0
              this.OnBeforeCardPatch = true
            }
            if(state.ErrorState =='晚退' && state.FormCode == 'CardPatch'){
              this.cR_OffAfterMins = 0
              this.OffAfterCardPatch = true
            }
            if(state.ErrorState =='遲到' && state.FormCode == 'CardPatch'){
              this.cR_LateMins = 0
              this.LateCardPatch = true
            }
            if(state.ErrorState =='早退' && state.FormCode == 'CardPatch'){
              this.cR_EarlyMins = 0
              this.EarlyCardPatch = true
            }
          }
        }
        if (isOK) {
          $('#sussesdialog').modal('show');
        }
        this.LoadingPage.hide()
      },
        error => {
          this.LoadingPage.hide()
          // console.log(error)
        })


  }


  UploadFile: uploadFileClass[] = []
  onSaveFile(event) {
    this.UploadFile = event
    // console.log(this.UploadFile)

  }

  private Be_setGetRoteInfo$: BehaviorSubject<any> = new BehaviorSubject<Array<number>>(null);
  Ob_setGetRoteInfo$: Observable<any> = this.Be_setGetRoteInfo$;

  bt_Show_RoteInfo(oneSearchRoteID: number) {
    var searchRoteID: Array<number> = []
    if (oneSearchRoteID) {
      searchRoteID.push(oneSearchRoteID)
      this.Be_setGetRoteInfo$.next(searchRoteID)
      $('#RoteInf_write').modal('show')
    }
  }


  ShowVa: ShowVa[] = []
  ShowOt: GetOtViewGetApiData[] = []
  SearchAttendDate: string = ''

  showDay(i) {
    return chinesenum(i + 1)
  }
  vaClick(YearMonthDday, EmpID) {
    // alert('請假單:' + YearMonthDday + ' ' + EmpID)
    this.SearchAttendDate = YearMonthDday
    var GetAbsDetailByListEmpIDGetApi: GetAbsDetailByListEmpIDGetApiClass = {
      "DateB": YearMonthDday,
      "DateE": YearMonthDday,
      "ListEmpID": [
        EmpID
      ]
    }
    this.LoadingPage.show()

    this.GetApiDataServiceService.getWebApiData_GetAbsDetailByListEmpID(GetAbsDetailByListEmpIDGetApi)
      .pipe(takeWhile(() => this.api_subscribe))
      .subscribe(
        (GetAbsDetailByListEmpIDData: GetAbsDetailByListEmpIDDataClass[]) => {
          this.ShowVa = []
          for (let data of GetAbsDetailByListEmpIDData) {
            var setDay = 0
            var setHour = 0
            var setMin = 0
            //計算日時分

            setDay = data.UseDayHourMinute.Day
            setHour = data.UseDayHourMinute.Hour
            setMin = data.UseDayHourMinute.Minute

            this.ShowVa.push({
              State: data.State,
              DateTimeB: data.DateTimeB,
              DateTimeE: data.DateTimeE,
              SignDate: data.CreatDate,
              HoliDayNameC: data.HoliDay.HoliDayNameC,
              Use: data.Use,

              showDateB: formatDateTime(data.DateTimeB).getDate,
              showDateE: formatDateTime(data.DateTimeE).getDate,
              showTimeB: getapi_formatTimetoString(formatDateTime(data.DateTimeB).getTime),
              showTimeE: getapi_formatTimetoString(formatDateTime(data.DateTimeE).getTime),
              showSignDate: formatDateTime(data.CreatDate).getDate,
              showSignTime: getapi_formatTimetoString(formatDateTime(data.CreatDate).getTime),
              day: setDay.toString(),
              hour: setHour.toString(),
              minute: setMin.toString()
            })
          }
          this.LoadingPage.hide()
          $('#RecentHoliday').modal('show')
        }, error => {
          this.LoadingPage.hide()
        }
      )
  }
  otClick(YearMonthDday, EmpID) {
    var GetOtViewGetApi: GetOtViewGetApi = {
      "EmpList": [
        EmpID
      ],
      "DateList": [
        YearMonthDday
      ]
    }
    this.LoadingPage.show()
    this.GetApiDataServiceService.getWebApiData_GetOtView(GetOtViewGetApi)
      .pipe(takeWhile(() => this.api_subscribe))
      .subscribe(
        (GetOtViewGetApiData: GetOtViewGetApiData[]) => {
          this.ShowOt = JSON.parse(JSON.stringify(GetOtViewGetApiData))
          for (let ot of this.ShowOt) {
            ot.DateTimeB = formatDateTime(ot.DateTimeB).getDate + ' ' + getapi_formatTimetoString(formatDateTime(ot.DateTimeB).getTime)
            ot.DateTimeE = formatDateTime(ot.DateTimeE).getDate + ' ' + getapi_formatTimetoString(formatDateTime(ot.DateTimeE).getTime)
            ot.ApproveDate = formatDateTime(ot.ApproveDate).getDate + ' ' + getapi_formatTimetoString(formatDateTime(ot.ApproveDate).getTime)
          }
          this.LoadingPage.hide()
          $('#OtDataDialog').modal('show')
        })
  }
  get vaFormHerf() {
    var originHerf = location.href.split('nav')[0]
    var vaFormHerf = originHerf + 'nav/vaform/writevaform'
    return vaFormHerf
  }
  goWriteVaPage() {
    // var originHerf =  location.href.split('nav')[1]
    // var vaFormHerf = originHerf+'/nav/vaform/writevaform'
    // console.log(vaFormHerf)
    var originHerf = location.href.split('nav')[0]
    var vaFormHerf = originHerf + 'nav/vaform/writevaform'
    // console.log(vaFormHerf)
    window.open(vaFormHerf, '_blank')
  }
  goOtPage() {
    window.open(otSysURL, '_blank')
  }

  showCardFlowDataDialog:boolean = true 
  showCardFlowData: GetCardFlowAppsGetApiDataClass[] = []
  searchCardFormFlow() {
    $('#searchCardFlowDataDialog').modal('show')
  }

  inViewSearchCardFormFlow(){
      var GetCardFlowApps: GetCardFlowAppsGetApi = {
        "ListEmpID": [this.getAttendCard.forget_man_code.toString()],
        "DateB": this.getAttendCard.AttendDate.toString(),
        "DateE": this.getAttendCard.AttendDate.toString(),
        "Miniature":true
      }
      this.LoadingPage.show()
      this.GetApiDataServiceService.getWebApiData_GetCardFlowApps(GetCardFlowApps)
        .pipe(takeWhile(() => this.api_subscribe))
        .subscribe((GetCardFlowAppsGetApiData: GetCardFlowAppsGetApiDataClass[]) => {
          // void_completionTenNum
          this.showCardFlowData = JSON.parse(JSON.stringify(GetCardFlowAppsGetApiData))
          for (let c of this.showCardFlowData) {
            c.ProcessID  = void_completionTenNum(c.ProcessID)
            if (c.DateTimeB) {
              c.DateTimeB = formatDateTime(c.DateTimeB).getDate + ' ' + getapi_formatTimetoString(formatDateTime(c.DateTimeB).getTime)
            }
            if (c.DateTimeE) {
              c.DateTimeE = formatDateTime(c.DateTimeE).getDate + ' ' + getapi_formatTimetoString(formatDateTime(c.DateTimeE).getTime)
            }
            if (c.ErrorStateName == '未刷卡') {
              c.uiIsForgetCard = true
            }
            if (c.ErrorStateName == '早退') {
              c.uiIsEarlyMins = true
            }
            if (c.ErrorStateName == '遲到') {
              c.uiIsLateMins = true
            }
            if (c.ErrorStateName == '正常') {
              c.uiIsNormal = true
            }
            if (c.ErrorStateName == '早到') {
              c.uiIsOnBeforeMins = true
            }
            if (c.ErrorStateName == '晚退') {
              c.uiIsOffAfterMins = true
            }
          }
          this.LoadingPage.hide()
        })
  }
}

class uiRmCardTempFormStateClass {
  ErrorStateCode: number
  ErrorStateName: string
  rmCardTempFormState: rmCardTempFormStateClass
}
