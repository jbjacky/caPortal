import { Injectable, Input } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { GetBaseByFormClass } from '../Models/PostData_API_Class/GetBaseByFormClass';
import { GetAttendInfoClass } from '../Models/PostData_API_Class/GetAttendInfoClass';
import { GetDeptaByEmpClass, GetDeptaByEmpTTClass } from '../Models/PostData_API_Class/GetDeptaByEmpClass';
import { GetAttendClass } from '../Models/PostData_API_Class/GetAttendClass';
import { GetHoliDayBalanceClass } from '../Models/PostData_API_Class/GetHoliDayBalanceClass';
import { GetCalculateClass } from '../Models/PostData_API_Class/GetCalculateClass';
import { AbsCheckClass } from '../Models/PostData_API_Class/AbsCheckClass';
import { SaveAttendWishClass } from '../Models/PostData_API_Class/SaveAttendWishClass';
import { GetAttendWishClass } from '../Models/PostData_API_Class/GetAttendWishClass';
import { SaveHoliDayFlowConditionClass } from '../Models/PostData_API_Class/SaveHoliDayFlowConditionClass';
import { GetAttendExceptionalClass } from '../Models/PostData_API_Class/GetAttendExceptionalClass';
import { SaveAndFlowStartClass, ForgetSaveAndFlowStartClass } from '../Models/PostData_API_Class/SaveAndFlowStartClass';
import { GetAttendWishByPersonClass } from '../Models/PostData_API_Class/GetAttendWishByPersonClass';
import { FlowCardCheckClass } from '../Models/PostData_API_Class/FlowCardCheckClass';
import { CardCheckClass } from '../Models/PostData_API_Class/CardCheckClass';
import { doFormatDate } from '../UseVoid/void_doFormatDate';
import { GetFlowSignRoleClass } from '../Models/PostData_API_Class/GetFlowSignRoleClass';
import { FlowNodeFinishClass } from '../Models/PostData_API_Class/FlowNodeFinishClass';
import { CalculateFlowDataClass } from '../Models/PostData_API_Class/CalculateFlowDataClass';
import { AbsSaveAndFlowStartClass } from '../Models/PostData_API_Class/AbsSaveAndFlowStart';
import { AbscIntegrationHandlerGetAbsFlowAppsClass } from '../Models/PostData_API_Class/AbscIntegrationHandlerGetAbsFlowAppsClass';
import { AbscFlowHandlerSaveAndFlowStartClass } from '../Models/PostData_API_Class/AbscFlowHandlerSaveAndFlowStartClass';
import { GetFlowViewClass } from '../Models/PostData_API_Class/GetFlowViewClass';
import { ShiftRoteSaveAndFlowStartClass } from '../Models/PostData_API_Class/ShiftRoteSaveAndFlowStartClass';
import { GetBaseInfoDetailClass } from '../Models/GetBaseInfoDetailClass';
import { ShiftRoteCheckByTwoPersonClass } from '../Models/PostData_API_Class/ShiftRoteCheckByTwoPersonClass';
import { SaveNewsClass } from '../Models/PostData_API_Class/SaveNewsClass';
import { GetNewsClass } from '../Models/PostData_API_Class/GetNewsClass';
import { GetAttendCalendarClass } from '../Models/PostData_API_Class/GetAttendCalendarClass';
import { GetAttendExceptionalByDeptClass } from '../Models/PostData_API_Class/GetAttendExceptionalByDeptClass';
import { ShiftRoteCheckClass } from '../Models/PostData_API_Class/ShiftRoteCheckClass';
import { GetHoliDayBalanceFlow } from '../Models/PostData_API_Class/GetHoliDayBalanceFlow';
import { FlowShiftRoteCheckClass } from '../Models/PostData_API_Class/FlowShiftRoteCheckClass';
import { InsertEmpAgentDateClass } from '../Models/PostData_API_Class/InsertEmpAgentDateClass';
import { GetFormMailClass } from '../Models/PostData_API_Class/GetFormMailClass';
import { SaveFormMailClass } from '../Models/PostData_API_Class/SaveFormMailClass';
import { InsertCheckAgentClass } from '../Models/PostData_API_Class/InsertCheckAgentClass';
import { UpdateEmpAgentDateClass } from '../Models/PostData_API_Class/UpdateEmpAgentDateClass';
import { UpdateCheckAgentClass } from '../Models/PostData_API_Class/UpdateCheckAgentClass';
import { InsertDeptHumanGetApiClass } from '../Models/PostData_API_Class/InsertDeptHumanGetApiClass';
import { UpdateDeptHumanGetApiClass } from '../Models/PostData_API_Class/UpdateDeptHumanGetApiClass';
import { GetDeptGetApiClass } from '../Models/PostData_API_Class/GetDeptGetApiClass';
import { InsertDeptSecretaryGetApiClass } from '../Models/PostData_API_Class/InsertDeptSecretaryGetApiClass';
import { UpdateDeptSecretaryGetApiClass } from '../Models/PostData_API_Class/UpdateDeptSecretaryGetApiClass';
import { GetBaseSpecialFlowGetApiClass } from '../Models/PostData_API_Class/GetBaseSpecialFlowGetApiClass';
import { UpdateBaseSpecialFlowGetApiClass } from '../Models/PostData_API_Class/UpdateBaseSpecialFlowGetApiClass';
import { InsertBaseSpecialFlowGetApiClass } from '../Models/PostData_API_Class/InsertBaseSpecialFlowGetApiClass';
import { SetDeptByEmpGetApiClass } from '../Models/PostData_API_Class/SetDeptByEmpGetApiClass';
import { GetBaseByListDeptIDGetApiClass } from '../Models/PostData_API_Class/GetBaseByListDeptIDGetApiClass';
import { SetRoleGetApiClass } from '../Models/PostData_API_Class/SetRoleGetApiClass';
import { SetRolePageByEmpGetApiClass } from '../Models/PostData_API_Class/SetRolePageByEmpGetApiClass';
import { CreateRoleGetApiClass } from '../Models/PostData_API_Class/CreateRoleGetApiClass';
import { DelDeptByEmpGetApiClass } from '../Models/PostData_API_Class/DelDeptByEmpGetApiClass';
import { UpdateRoleGetApiClass } from '../Models/PostData_API_Class/UpdateRoleGetApiClass';
import { GetNewsByDateNowGetApiClass } from '../Models/PostData_API_Class/GetNewsByDateNowGetApiClass';
import { GetNewsByIDGetApiClass } from '../Models/PostData_API_Class/GetNewsByIDGetApiClass';
import { GetAbsFlowSignTreeGetApiClass } from '../Models/PostData_API_Class/GetAbsFlowSignTreeGetApiClass';
import { DeviceDetectorService } from 'ngx-device-detector';
import { GetFormInfoGetApiClass } from '../Models/PostData_API_Class/GetFormInfoGetApiClass';
import { UpdateFormInfoGetApiClass } from '../Models/PostData_API_Class/UpdateFormInfoGetApiClass';
import { LogApiMsgGetApiClass } from '../Models/PostData_API_Class/LogApiMsgGetApiClass';
import { GetShiftRoteTwoPersonAfterGetApiClass } from '../Models/PostData_API_Class/GetShiftRoteTwoPersonAfterGetApiClass';
import { ShiftRoteCountGetApiClass } from '../Models/PostData_API_Class/ShiftRoteCountGetApiClass';
import { ShiftRoteCheckByWeekTypeGetApiClass } from '../Models/PostData_API_Class/ShiftRoteCheckByWeekTypeGetApiClass';
import { GetAttendCalendarExceptionalGetApiClass } from '../Models/PostData_API_Class/GetAttendCalendarExceptionalGetApiClass';
import { GetAbsDetailByListEmpIDGetApiClass } from '../Models/PostData_API_Class/GetAbsDetailByListEmpIDGetApiClass';
import { GetAttendCalendarAbsGetApiClass } from '../Models/PostData_API_Class/GetAttendCalendarAbsGetApiClass';
import { GetAbsDetailByDeptGetApiClass } from '../Models/PostData_API_Class/GetAbsDetailByDeptGetApiClass';
import { GetBaseByFormDeptGetApiClass } from '../Models/PostData_API_Class/GetBaseByFormDeptGetApiClass';
import { GetBaseByFormEmpGetApiClass } from '../Models/PostData_API_Class/GetBaseByFormEmpGetApiClass';
import { GetBaseByAuthByEmpIDgetDeptInfoGetApiClass } from '../Models/PostData_API_Class/GetBaseByAuthByEmpIDgetDeptInfoGetApiClass';
import { GetIdentityByEmpIDClass } from '../Models/PostData_API_Class/GetIdentityByEmpIDClass';
import { IsLoginPassGetApiClass } from '../Models/PostData_API_Class/IsLoginPassGetApiClass';
import { GetSendMailLogClass } from '../Models/PostData_API_Class/GetSendMailLogClass';
import { GetBaseByListDeptaIDGetApiClass } from '../Models/PostData_API_Class/GetBaseByListDeptaIDGetApiClass';
import { SettingClass } from '../Models/SettingClass';
import { GetAttendSumRoteGetApiClass } from '../Models/PostData_API_Class/GetAttendSumRoteGetApiClass';
import { TransSignStateGetApiClass } from '../Models/PostData_API_Class/TransSignStateGetApiClass';
import { GetAttendExceptionalCountClass } from '../Models/PostData_API_Class/GetAttendExceptionalCountClass';
import { GetAttendInfoByDeptGetApiClass } from '../Models/PostData_API_Class/GetAttendInfoByDeptGetApiClass';
import { GetEventDateGetApiClass } from '../Models/PostData_API_Class/GetEventDateGetApiClass';
import { GetAttendWishByDeptaGetApiClass } from '../Models/PostData_API_Class/GetAttendWishByDeptaGetApiClass';
import { GetFlowViewDeptClass } from '../Models/PostData_API_Class/GetFlowViewDeptClass';
import { GetFlowSignAbsGetApiClass, GetFlowSignAbsDataGetApiClass } from '../Models/PostData_API_Class/GetFlowSignAbsGetApiClass';
import { GetCheckAgentByTargetGetApiClass } from '../Models/PostData_API_Class/GetCheckAgentByTargetGetApiClass';
import { AttendUnusualSaveAndFlowStartClass } from '../Models/PostData_API_Class/AttendUnusualSaveAndFlowStart';
import { CardPatchSaveAndFlowStartClass } from '../Models/PostData_API_Class/CardPatchSaveAndFlowStartClass';
import { SaveAndFlowStartCombineClass } from '../Models/PostData_API_Class/SaveAndFlowStartCombineClass';
import { GetOtViewGetApi } from '../Models/PostData_API_Class/GetOtViewGetApi';
import { GetCardFlowAppsGetApi } from '../Models/PostData_API_Class/GetCardFlowAppsGetApi';

// import settingJson from '../../assets/setting.json';

declare let $: any; //use jquery

declare let apiPostURL: any
declare let apiGetFileURL: any

@Injectable({
  providedIn: 'root'
})
export class GetApiDataServiceService {
  settingData: SettingClass
  // localUrl = settingJson.apiPostURL
  constructor(private http: HttpClient) {
    // console.log(settingJson)
  }
  // localUrl = 'https://publish.jbjob.com.tw/ChinaAirlines/eepWebService/'
  localUrl = apiPostURL
  getFileURL = apiGetFileURL
  // localUrl = 'http://60.250.52.108/eepWebService/'

  // localUrl = 'https://192.168.1.24/ChinaAirlines/eepWebService/'
  // localUrl = 'https://localhost/eepWebService/'

  //華航的 localUrl = http://hdqhr05t/eepWebService/


  GetHeader_Admin() {
    var _credentials = 'q' + ":" + 'q';
    var _basic = "Basic " + btoa(_credentials);
    var _header = new HttpHeaders({
      // 'Access-Control-Allow-Origin': '*',
      // 'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
      // 'Access-Control-Allow-Headers': 'Authorization',
      'Content-Type': 'application/json',
      // 'Authorization': 'dGVzdDY2Njp0ZXN0NjY2'

      'Authorization': _basic
    })
    return _header
  }

  GetHeader() {
    var _credentials = localStorage.getItem('API_Token') + ":" + localStorage.getItem('API_Code');
    var _basic = "Basic " + btoa(_credentials);
    var _header = new HttpHeaders({
      // 'Access-Control-Allow-Origin': '*',
      // 'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
      // 'Access-Control-Allow-Headers': 'Authorization',
      'Content-Type': 'application/json',
      // 'Authorization': 'dGVzdDY2Njp0ZXN0NjY2'

      'Authorization': _basic
    })
    return _header
  }

  /**
   * @todo 登出刪除Token(需要傳入AuthorizationHeader)
   */
  getWebApiData_DeleteAuthToken() {
    return this.http.post(this.localUrl + 'AuthHandler.svc/DeleteAuthToken', '', {
      headers: this.GetHeader()
    })
  }
  /**
   * @todo 重新驗証Token 並延長時間(需要傳入AuthorizationHeader)
   */
  getWebApiData_GetAuthToken() {
    return this.http.post(this.localUrl + 'AuthHandler.svc/GetAuthToken', '', {
      headers: this.GetHeader()
    })
  }

  // /**
  //  * @todo 重新驗証Token 並延長時間(給每頁驗證用)
  //  */
  // getWebApiData_GetAuthToken_Auth(authheader: HttpHeaders) {

  //   return this.http.post(this.localUrl + 'AuthHandler.svc/GetAuthToken', '', {
  //     headers: authheader
  //   })
  // }


  /**
   * @todo 拿人員資料
   */
  getWebApiData_Token(urlCode) {
    return this.http.post(this.localUrl + 'AuthHandler.svc/GetToken', `'${urlCode}'`, {
      headers: this.GetHeader_Admin()
    })
  }


  /**
   * @todo  取得同部門即期向下
   * @author jacky
   */
  getWebApiData_GetBaseByFormDeptDown(GetBaseByFormClass: GetBaseByFormClass) {
    return this.http.post(this.localUrl + 'BaseHandler.svc/GetBaseByFormDeptDown',
      JSON.stringify(GetBaseByFormClass), {
      headers: this.GetHeader(),


    })
  }

  /**
   * @todo  取得被申請基本資料(含權限檢核)即期向下
   * @author jacky
   */
  getWebApiData_GetBaseByForm(GetBaseByFormClass: GetBaseByFormClass) {
    return this.http.post(this.localUrl + 'BaseHandler.svc/GetBaseByForm',
      JSON.stringify(GetBaseByFormClass), {
      headers: this.GetHeader(),


    })
  }

  /**
   * @todo  取得被申請基本資料(含權限檢核)不及其向下
   * @author jacky
   */
  getWebApiData_GetBaseByFormNotDown(GetBaseByFormClass: GetBaseByFormClass) {
    return this.http.post(this.localUrl + 'BaseHandler.svc/GetBaseByFormNotDown',
      JSON.stringify(GetBaseByFormClass), {
      headers: this.GetHeader(),


    })
  }

  /**
   * @todo  取得被申請基本資料(含權限檢核)不及其向下
   * @author jacky
   */
  getWebApiData_GetBaseByFormShift(GetBaseByFormClass: GetBaseByFormClass) {
    return this.http.post(this.localUrl + 'BaseHandler.svc/GetBaseByFormShift',
      JSON.stringify(GetBaseByFormClass), {
      headers: this.GetHeader(),


    })
  }

  /**
   * @todo  取得員工資料(在職人員) 行政
   * @author jacky
   */
  getWebApiData_GetBaseByFormStaff(GetBaseByFormClass: GetBaseByFormClass) {
    return this.http.post(this.localUrl + 'BaseHandler.svc/GetBaseByFormStaff',
      JSON.stringify(GetBaseByFormClass), {
      headers: this.GetHeader(),


    })
  }

  /**
   * @todo  員工延伸定義(可判斷是否可請假、申請表單)
   * @author jacky
   */
  getWebApiData_GetBaseParameter(EmpID: string) {
    return this.http.post(this.localUrl + 'BaseHandler.svc/GetBaseParameter',
      JSON.stringify([EmpID]), {
      headers: this.GetHeader(),


    })
  }

  /**
   * @todo 取得申請者可以幫那些部門及那些人申請資料
   * @author jacky
   */
  getWebApiData_GetDeptaByEmp(GetDeptaByEmpClass: GetDeptaByEmpTTClass) {
    return this.http.post(this.localUrl + 'BaseHandler.svc/GetDeptaByEmp',
      JSON.stringify(GetDeptaByEmpClass), {
      headers: this.GetHeader()
    })
  }

  /**
   * @todo 取得申請者可以幫那些部門及那些人申請資料(一級正以下)
   * @author jacky
   */
  getWebApiData_GetDeptaByEmpLevel(GetDeptaByEmpClass: GetDeptaByEmpClass) {
    return this.http.post(this.localUrl + 'BaseHandler.svc/GetDeptaByEmp1',
      JSON.stringify(GetDeptaByEmpClass), {
      headers: this.GetHeader()
    })
  }


  /**
   * @todo 取得假別代碼
   */
  getWebApiData_GetHoliDayByForm() {
    return this.http.post(this.localUrl + 'AttHandler.svc/GetHoliDayByForm',
      JSON.stringify({}), {
      headers: this.GetHeader()
    })
  }


  /**
   * @todo 取得呈核人員資訊(整合)
   */
  getWebApiData_GetDeptaBySign(_EmpID) {
    var date = new Date();
    var today = doFormatDate(date);
    return this.http.post(this.localUrl + 'BaseHandler.svc/GetDeptaBySign',
      JSON.stringify({ "EmpID": _EmpID, "DeptID": 0, "EffectDate": today }), {
      headers: this.GetHeader()
    })
  }
  /**
   * @todo 取得考勤資訊
   */
  getWebApiData_GetAttendInfo(GetAttendInfo: GetAttendInfoClass) {
    return this.http.post(this.localUrl + 'AttHandler.svc/GetAttendInfo',
      JSON.stringify(GetAttendInfo), {
      headers: this.GetHeader()
    })
  }

  /**
   * @todo 取得考勤資訊(整合flow)
   */
  getWebApiData_GetAttendInfo_Integration(GetAttendInfo: GetAttendInfoClass) {
    return this.http.post(this.localUrl + 'Integration/AbsIntegrationHandler.svc/GetAttendInfo',
      JSON.stringify(GetAttendInfo), {
      headers: this.GetHeader()
    })
  }

  /**
   * @todo 取得考勤資訊(依部門)(整合flow)
   */
  getWebApiData_GetAttendInfoByDept_Integration(GetAttendInfoByDeptGetApi: GetAttendInfoByDeptGetApiClass) {
    return this.http.post(this.localUrl + 'Integration/AbsIntegrationHandler.svc/GetAttendInfoByDept',
      JSON.stringify(GetAttendInfoByDeptGetApi), {
      headers: this.GetHeader()
    })
  }


  /**
   * @todo 取得出勤班別資訊
   */
  getWebApiData_GetAttend(GetAttend: GetAttendClass) {
    return this.http.post(this.localUrl + 'AttHandler.svc/GetAttend',
      JSON.stringify({ "DateB": GetAttend.DateB, "DateE": GetAttend.DateE, "ListEmpID": GetAttend.ListEmpID, "ListRoteID": null }), {
      headers: this.GetHeader()
    })
  }

  /**
   * @todo 請假檢查
   */
  getWebApiData_AbsCheck(AbsCheck: AbsCheckClass) {
    return this.http.post(this.localUrl + 'AbsHandler.svc/AbsCheck',
      JSON.stringify({
        "EmpID": AbsCheck.EmpID,
        "HoliDayID": AbsCheck.HoliDayID,
        "DateB": AbsCheck.DateB,
        "DateE": AbsCheck.DateE,
        "TimeB": AbsCheck.TimeB,
        "TimeE": AbsCheck.TimeB,
        "KeyName": AbsCheck.KeyName,
        "EventDate": AbsCheck.EventDate,
        "ProcessUse": AbsCheck.ProcessUse,
        "Time24": AbsCheck.Time24
      }), {
      headers: this.GetHeader()
    })
  }

  /**
   * @todo 請假計算
   */
  getWebApiData_GetCalculate(GetCalculate: GetCalculateClass) {
    return this.http.post(this.localUrl + 'AbsHandler.svc/GetCalculate',
      JSON.stringify({ "EmpID": GetCalculate.EmpID, "HoliDayID": GetCalculate.HoliDayID, "DateB": GetCalculate.DateB, "DateE": GetCalculate.DateE, "TimeB": GetCalculate.TimeB, "TimeE": GetCalculate.TimeE, "CalculateWorkTime": true, "CalculateRes": true, "FixedCycle": GetCalculate.FixedCycle, "Exception": 0, "RoteID": 0, "Time24": true, "ListAbsFlow": null }), {
      headers: this.GetHeader()
    })
  }

  /**
   * @todo 儲存意願備註表
   */
  getWebApiData_SaveAttendWish(SaveAttendWish: SaveAttendWishClass) {
    return this.http.post(this.localUrl + 'AttHandler.svc/SaveAttendWish',
      JSON.stringify({ "EmpID": SaveAttendWish.EmpID, "WishTypeID": SaveAttendWish.WishTypeID, "DateB": SaveAttendWish.DateB, "DateE": SaveAttendWish.DateE, "TimeB": SaveAttendWish.TimeB, "TimeE": SaveAttendWish.TimeE, "Note": SaveAttendWish.Note, "KeyMan": SaveAttendWish.KeyMan }), {
      headers: this.GetHeader()
    })
  }
  /**
   * @todo 取得部門群組底下的單位並展現到幾級單位(for地服處)
   */
  getWebApiData_GetDeptaByDeptTree() {
    var date = new Date();
    var today = doFormatDate(date);
    return this.http.post(this.localUrl + 'BaseHandler.svc/GetDeptaByDeptTree',
      JSON.stringify({ "EmpID": '', "SuperDeptCode": "240_0", "DeptTree": 3, "EffectDate": today }), {
      headers: this.GetHeader()
    })
  }

  /**
   * @todo 取得員工資料(在職人員)
   */
  getWebApiData_GetBaseByDeptID(DeptID: string) {
    var date = new Date();
    var today = doFormatDate(date);
    return this.http.post(this.localUrl + 'BaseHandler.svc/GetBaseByDeptID',
      JSON.stringify({ "DeptID": DeptID, "EffectDate": today }), {
      headers: this.GetHeader()
    })
  }

  /**
   * @todo 取得意願備註表
   * @param WishTypeID 1:請假 2:加班 3:調班
   */
  getWebApiData_GetAttendWish(GetAttendWish: GetAttendWishClass) {
    return this.http.post(this.localUrl + 'AttHandler.svc/GetAttendWish',
      JSON.stringify({ "DateB": GetAttendWish.DateB, "DateE": GetAttendWish.DateE, "WishTypeID": GetAttendWish.WishTypeID, "ListState": GetAttendWish.ListState, "ListEmpID": GetAttendWish.ListEmpID }), {
      headers: this.GetHeader()
    })
  }


  /**
   * @todo 取得意願備註表(以部門取得)
   * @param WishTypeID 1:請假 2:加班 3:調班
   */
  getWebApiData_GetAttendWishByDepta(GetAttendWishByDeptaGetApi: GetAttendWishByDeptaGetApiClass) {
    return this.http.post(this.localUrl + 'AttHandler.svc/GetAttendWishByDepta',
      JSON.stringify(GetAttendWishByDeptaGetApi), {
      headers: this.GetHeader()
    })
  }
  /**
   * @todo 取得請假簽核檢視表
   */
  getWebApiData_GetHoliDayFlowConditionView() {
    return this.http.post(this.localUrl + 'AttHandler.svc/GetHoliDayFlowConditionView',
      JSON.stringify({}), {
      headers: this.GetHeader()
    })
  }

  /**
   * @todo 儲存或修改請假簽核權限表
   */
  getWebApiData_SaveHoliDayFlowCondition(SaveHoliDayFlowCondition: SaveHoliDayFlowConditionClass) {
    return this.http.post(this.localUrl + 'AttHandler.svc/SaveHoliDayFlowCondition',
      JSON.stringify({ "HoliDayCode": SaveHoliDayFlowCondition.HoliDayCode, "Tree": SaveHoliDayFlowCondition.Tree, "AbsUseDay": SaveHoliDayFlowCondition.AbsUseDay, "Note": SaveHoliDayFlowCondition.Note, "KeyMan": SaveHoliDayFlowCondition.KeyMan }), {
      headers: this.GetHeader()
    })
  }

  /**
   * @todo 取得班別異常資訊
   */
  getWebApiData_GetAttendExceptional(GetAttendExceptional: GetAttendExceptionalClass) {
    return this.http.post(this.localUrl + 'AttHandler.svc/GetAttendExceptional',
      JSON.stringify({ "DateB": GetAttendExceptional.DateB, "DateE": GetAttendExceptional.DateE, "ListEmpID": GetAttendExceptional.ListEmpID }), {
      headers: this.GetHeader()
    })
  }

  /**
   * @todo 取得銷假資料(交集)
   */
  getWebApiData_AbscIntegrationHandlerGetAbsFlowApps(AbscIntegrationHandlerGetAbsFlowApps: AbscIntegrationHandlerGetAbsFlowAppsClass) {
    return this.http.post(this.localUrl + 'Integration/AbscIntegrationHandler.svc/GetAbsFlowApps',
      JSON.stringify(AbscIntegrationHandlerGetAbsFlowApps), {
      headers: this.GetHeader()
    })
  }

  /**
   * @todo 取得忘刷原因代碼
   */
  getWebApiData_GetCauseByForm() {
    return this.http.post(this.localUrl + 'CardHandler.svc/GetCauseByForm',
      JSON.stringify({}), {
      headers: this.GetHeader()
    })
  }
  /**
   * @todo 忘刷-儲存並起單
   */
  getWebApiData_SaveAndFlowStart(ForgetSaveAndFlowStart: ForgetSaveAndFlowStartClass) {
    return this.http.post(this.localUrl + 'Flow/CardFlowHandler.svc/SaveAndFlowStart',
      JSON.stringify(ForgetSaveAndFlowStart), {
      headers: this.GetHeader()
    })
  }

  /**
   * @todo 補卡-儲存並起單
   */
  getWebApiData_CardPatchSaveAndFlowStart(CardPatchSaveAndFlowStart: CardPatchSaveAndFlowStartClass) {
    return this.http.post(this.localUrl + 'Flow/CardPatchFlowHandler.svc/SaveAndFlowStart',
      JSON.stringify(CardPatchSaveAndFlowStart), {
      headers: this.GetHeader()
    })
  }


  /**
   * @todo 取得意願備註表(個人)
   */
  getWebApiData_GetAttendWishByPerson(GetAttendWishByPerson: GetAttendWishByPersonClass) {
    return this.http.post(this.localUrl + 'AttHandler.svc/GetAttendWishByPerson',
      JSON.stringify({ "DateB": GetAttendWishByPerson.DateB, "WishTypeID": GetAttendWishByPerson.WishTypeID, "ListState": ["1"], "ListEmpID": [GetAttendWishByPerson.ListEmpID] }), {
      headers: this.GetHeader()
    })
  }
  /**
   * @todo 修改意願備註表(刪除)
   */
  getWebApiData_UpdateAttendWish(AttendWishID, KeyMan) {
    return this.http.post(this.localUrl + 'AttHandler.svc/UpdateAttendWish',
      JSON.stringify({ "AttendWishID": AttendWishID, "State": "2", "KeyMan": KeyMan }), {
      headers: this.GetHeader()
    })
  }

  /**
   * @todo 忘刷_檢查刷卡資料 (儲存並起單檢核)
   */
  getWebApiData_CardCheck(CardCheck: CardCheckClass) {
    return this.http.post(this.localUrl + 'CardHandler.svc/CardCheck',
      JSON.stringify({
        "EmpID": CardCheck.EmpID,
        "DateB": CardCheck.DateB,
        "DateE": CardCheck.DateE,
        "TimeB": CardCheck.TimeB,
        "TimeE": CardCheck.TimeE,
        "CauseID1": CardCheck.CauseID1,
        "CauseID2": CardCheck.CauseID1
      }), {
      headers: this.GetHeader()
    })
  }
  /**
   * @todo 忘刷_流程中重複檢查 (儲存並起單檢核)
   */
  getWebApiData_FlowCardCheck(FlowCardCheck: FlowCardCheckClass) {
    return this.http.post(this.localUrl + 'Flow/CardFlowHandler.svc/CardCheck',
      JSON.stringify({
        "EmpID": FlowCardCheck.EmpID,
        "DateB": FlowCardCheck.DateB,
        "DateE": FlowCardCheck.DateE,
        "TimeB": FlowCardCheck.TimeB,
        "TimeE": FlowCardCheck.TimeE
      }), {
      headers: this.GetHeader()
    })
  }
  /**
   * @todo 取得待審核名單(整合簽核權限判斷)
   */
  getWebApiData_GetFlowSignRole(GetFlowSignRole: GetFlowSignRoleClass) {
    var date = new Date();
    GetFlowSignRole.SignDate = doFormatDate(date);
    return this.http.post(this.localUrl + 'Integration/FlowMainIntegrationHandler.svc/GetFlowSignRole',
      JSON.stringify(GetFlowSignRole), {
      headers: this.GetHeader()
    })
  }

  /**
   * @todo 取得請假流程資料(審核頁面)
   */
  getWebApiData_GetAbsFlowAppsByProcessFlowID(ProcessFlowID, Miniature: boolean) {
    return this.http.post(this.localUrl + 'Integration/AbsIntegrationHandler.svc/GetAbsFlowAppsByProcessFlowID',
      JSON.stringify({ "ProcessFlowID": ProcessFlowID, "Miniature": Miniature }), {
      headers: this.GetHeader()
    })

  }
  /**
   * @todo 取得銷假流程資料(審核頁面)
   */
  getWebApiData_GetAbscFlowAppsByProcessFlowID(ProcessFlowID) {
    return this.http.post(this.localUrl + 'Integration/AbscIntegrationHandler.svc/GetAbscFlowAppsByProcessFlowID',
      ProcessFlowID, {
      headers: this.GetHeader()
    })

  }

  /**
   * @todo 取得忘刷流程資料(審核頁面)
   */
  getWebApiData_GetCardFlowAppsByProcessFlowID(ProcessFlowID, Miniature) {
    return this.http.post(this.localUrl + 'Flow/CardFlowHandler.svc/GetCardFlowAppsByProcessFlowID',
      JSON.stringify({ "ProcessFlowID": ProcessFlowID, "Miniature": Miniature }), {
      headers: this.GetHeader()
    })
  }
  /**
   * @todo 取得調班流程資料(審核頁面)
   */
  getWebApiData_GetShiftFlowAppsByProcessFlowID(ProcessFlowID) {
    return this.http.post(this.localUrl + 'Flow/ShiftRoteFlowHandler.svc/GetShiftRoteFlowAppsByProcessFlowID',
      ProcessFlowID, {
      headers: this.GetHeader()
    })

  }
  /**
   * @todo 取得調班流程資料(審核頁面)(新)
   */
  getWebApiData_GetShiftRoteFlowAppsByProcessFlowID(ProcessFlowID) {
    return this.http.post(this.localUrl + 'Integration/ShiftRoteIntegrationHandler.svc/GetShiftRoteFlowAppsByProcessFlowID',
      ProcessFlowID, {
      headers: this.GetHeader()
    })

  }
  /**
   * @todo 取得註記單流程資料(審核頁面)
   */
  getWebApiData_GetAttendUnusualFlowAppsByProcessFlowID(ProcessFlowID,Miniature) {
    return this.http.post(this.localUrl + 'Flow/AttendUnusualFlowHandler.svc/GetAttendUnusualFlowAppsByProcessFlowID',
    JSON.stringify({ "ProcessFlowID": ProcessFlowID, "Miniature": Miniature }), {
      headers: this.GetHeader()
    })

  }
  /**
   * @todo 取得補卡單流程資料(審核頁面)
   */
  getWebApiData_GetCardPatchFlowAppsByProcessFlowID(ProcessFlowID,Miniature) {
    return this.http.post(this.localUrl + 'Flow/CardPatchFlowHandler.svc/GetCardFlowAppsByProcessFlowID',
    JSON.stringify({ "ProcessFlowID": ProcessFlowID, "Miniature": Miniature }), {
      headers: this.GetHeader()
    })

  }

  /**
   * @todo 取得角色資訊
   */
  getWebApiData_GetManInfo(ListEmpID) {
    var date = new Date();
    var today = doFormatDate(date);
    return this.http.post(this.localUrl + 'Flow/FlowMainHandler.svc/GetManInfo',
      JSON.stringify({ "ListEmpID": [ListEmpID], "EffectDate": today }), {
      headers: this.GetHeader()
    })
  }

  /**
   * @todo 節點審核(整合版)
   */
  getWebApiData_FlowNodeFinish(FlowNodeFinish: FlowNodeFinishClass) {
    return this.http.post(this.localUrl + 'Integration/FlowMainIntegrationHandler.svc/FlowNodeFinish',
      JSON.stringify(FlowNodeFinish), {
      headers: this.GetHeader()
    })
  }

  /**
   * @todo 批次節點審核(整合版)
   */
  getWebApiData_ListFlowNodeFinish(FlowNodeFinish: FlowNodeFinishClass[]) {
    return this.http.post(this.localUrl + 'Integration/FlowMainIntegrationHandler.svc/ListFlowNodeFinish',
      JSON.stringify(FlowNodeFinish), {
      headers: this.GetHeader()
    })
  }
  /**
   * @todo 檢查部門請假限額
   */
  getWebApiData_AbsLimitCheck(ProcessFlowID) {
    return this.http.post(this.localUrl + 'Integration/AbsIntegrationHandler.svc/AbsLimitCheck',
      JSON.stringify(ProcessFlowID), {
      headers: this.GetHeader()
    })
  }
  /**
   * @todo 檢查考勤異常確認單
   */
  getWebApiData_CardCheckByProcessFlowID(ProcessFlowID) {
    return this.http.post(this.localUrl + 'Flow/CardFlowHandler.svc/CardCheckByProcessFlowID',
      JSON.stringify(ProcessFlowID), {
      headers: this.GetHeader()
    })
  }



  /**
   * @todo 取得簽核資訊
   */
  getWebApiData_GetFormSign(ProcessFlowID) {
    return this.http.post(this.localUrl + 'Flow/FlowMainHandler.svc/GetFormSign',
      JSON.stringify(ProcessFlowID), {
      headers: this.GetHeader()
    })
  }

  /**
   * @todo 請假計算(NEW)
  */
  getWebApiData_GetCalculateFlowData(CalculateFlowData: CalculateFlowDataClass) {
    var sendCalculateFlowData: CalculateFlowDataClass = {
      EmpID: CalculateFlowData.EmpID,
      HoliDayID: CalculateFlowData.HoliDayID,
      DateB: CalculateFlowData.DateB,
      DateE: CalculateFlowData.DateE,
      TimeB: CalculateFlowData.TimeB,
      TimeE: CalculateFlowData.TimeE,
      CalculateWorkTime: true,
      CalculateRes: true,
      FixedCycle: CalculateFlowData.FixedCycle,
      Exception: 0,
      RoteID: 0,
      Time24: true,
      KeyName: CalculateFlowData.KeyName,
      EventDate: CalculateFlowData.EventDate,
      FlowApps: CalculateFlowData.FlowApps
    }
    return this.http.post(this.localUrl + 'Integration/AbsIntegrationHandler.svc/GetCalculateFlowData',
      JSON.stringify(sendCalculateFlowData), {
      headers: this.GetHeader()
    })
  }

  /**
   * @todo 請假_儲存並起單
  */
  getWebApiData_AbsSaveAndFlowStart(AbsSaveAndFlowStart: AbsSaveAndFlowStartClass) {
    return this.http.post(this.localUrl + 'Integration/AbsIntegrationHandler.svc/SaveAndFlowStart',
      JSON.stringify(AbsSaveAndFlowStart), {
      headers: this.GetHeader()
    })
  }


  /**
   * @todo 銷假_儲存並起單
  */
  getWebApiData_AbscFlowHandlerSaveAndFlowStart(AbscFlowHandlerSaveAndFlowStart: AbscFlowHandlerSaveAndFlowStartClass) {
    return this.http.post(this.localUrl + 'Integration/AbscIntegrationHandler.svc/SaveAndFlowStart',
      JSON.stringify(AbscFlowHandlerSaveAndFlowStart), {
      headers: this.GetHeader()
    })
  }

  /**
     * @todo 表單查詢_流程檢視
     * Flow/FlowMainHandler.svc/GetFlowView
  */
  getWebApiData_GetFlowView(GetFlowView: GetFlowViewClass) {
    return this.http.post(this.localUrl + 'Integration/FlowMainIntegrationHandler.svc/GetFlowView',
      JSON.stringify(GetFlowView), {
      headers: this.GetHeader()
    })
  }

  /**
   * @todo 取得七天的班所需要雙日期
   */
  getWebApiData_GetShiftRoteDateRange(DateB: string, EmpID: string) {
    return this.http.post(this.localUrl + 'ShiftRoteHandler.svc/GetShiftRoteDateRange',
      JSON.stringify({ "DateB": DateB, "EmpID": EmpID }), {
      headers: this.GetHeader()
    })
  }

  /**
   * @todo 取得假日班別代碼(轉置過)
   */
  getWebApiData_GetRoteMappingByHoliday() {
    return this.http.post(this.localUrl + 'AttHandler.svc/GetRoteMappingByHoliday',
      null, {
      headers: this.GetHeader()
    })
  }


  /**
   * @todo 取得班別資訊
   */
  getWebApiData_GetRote(RoteID: Array<number>) {
    return this.http.post(this.localUrl + 'AttHandler.svc/GetRote',
      JSON.stringify(RoteID), {
      headers: this.GetHeader()
    })
  }


  /**
   * @todo 調班單-儲存並起單
   */
  getWebApiData_ShiftRoteSaveAndFlowStart(ShiftRoteSaveAndFlowStart: ShiftRoteSaveAndFlowStartClass) {
    return this.http.post(this.localUrl + 'Flow/ShiftRoteFlowHandler.svc/SaveAndFlowStart',
      JSON.stringify(ShiftRoteSaveAndFlowStart), {
      headers: this.GetHeader()
    })
  }


  /**
   * @todo 取得員工資料-超詳細
   */
  getWebApiData_GetBaseInfoDetail(ListEmpID: string) {
    var today = doFormatDate(new Date())
    return this.http.post(this.localUrl + 'BaseHandler.svc/GetBaseInfoDetail',
      JSON.stringify({ "ListEmpID": [ListEmpID], "EffectDate": today }), {
      headers: this.GetHeader()
    })
  }

  /**
   * @todo 取得RZ互換選擇休息日或例假日
   */
  getWebApiData_GetHolidayShiftRote(DateB: string, EmpID: string) {
    return this.http.post(this.localUrl + 'ShiftRoteHandler.svc/GetHolidayShiftRote',
      JSON.stringify({ "DateB": DateB, "EmpID": EmpID }), {
      headers: this.GetHeader()
    })
  }

  /**
   * @todo 調班檢查(雙人)
   */
  getWebApiData_ShiftRoteCheckByTwoPerson(ShiftRoteCheckByTwoPerson: ShiftRoteCheckByTwoPersonClass) {
    return this.http.post(this.localUrl + 'ShiftRoteHandler.svc/ShiftRoteCheckByTwoPerson',
      JSON.stringify(ShiftRoteCheckByTwoPerson), {
      headers: this.GetHeader()
    })
  }

  /**
   * @todo 儲存新聞內容
   */
  getWebApiData_SaveNews(SaveNews: SaveNewsClass) {
    return this.http.post(this.localUrl + 'MainHandler.svc/SaveNews',
      JSON.stringify(SaveNews), {
      headers: this.GetHeader()
    })
  }

  /**
   * @todo 取得新聞內容(全部)
   */
  getWebApiData_GetNews() {
    return this.http.post(this.localUrl + 'MainHandler.svc/GetNews', false, {
      headers: this.GetHeader()
    })
  }
  /**
   * @todo 取得新聞資訊(只顯示生效的資料)
   */
  getWebApiData_GetNewsByDateNow(GetNewsByDateNowGetApi: GetNewsByDateNowGetApiClass) {
    return this.http.post(this.localUrl + 'MainHandler.svc/GetNewsByDateNow',
      JSON.stringify(GetNewsByDateNowGetApi), {
      headers: this.GetHeader()
    })
  }

  /**
   * @todo 取得新聞內容(依照ID)
   */
  getWebApiData_GetNewsByID(GetNewsByIDGetApi: GetNewsByIDGetApiClass) {
    return this.http.post(this.localUrl + 'MainHandler.svc/GetNewsByID',
      JSON.stringify(GetNewsByIDGetApi), {
      headers: this.GetHeader()
    })
  }

  /**
   * @todo 刪除新聞資訊
   */
  getWebApiData_DeleteNews(NewsID: string) {
    return this.http.post(this.localUrl + 'MainHandler.svc/DeleteNews',
      JSON.stringify(NewsID), {
      headers: this.GetHeader()
    })
  }


  /**
   * @todo 取得檔案內容(單檔)
   */
  getWebApiData_GetUploadFileByOnly(ServerName: string) {
    return this.http.post(this.localUrl + 'Flow/MultiFlowHandler.svc/GetUploadFileByOnly',
      JSON.stringify(ServerName), {
      headers: this.GetHeader()
    })
  }

  /**
   * @todo 取得檔案內容(單檔)-後端
   */
  getWebApiData_GetUploadFileByOnly_NotFlow(ServerName: string) {
    return this.http.post(this.localUrl + 'MultiHandler.svc/GetUploadFileByOnly',
      JSON.stringify(ServerName), {
      headers: this.GetHeader()
    })
  }

  /**
   * @todo 取得檔案(Stream單檔)
   */
  getWebApiData_GetUploadFileByStreamOnly(ServerName: string) {
    // var _getFileURL = this.getFileURL + 'FileManage.svc/GetUploadFileByStreamOnly' + '?ServerName=' + ServerName
    // return this.http.get(_getFileURL.toString())
    window.open(this.getFileURL + 'FileManage.svc/GetUploadFileByStreamOnly' + '?ServerName=' + ServerName + '&NewTab=Y')
  }

  /**
   * @todo 出勤資料(行事曆)
   */
  getWebApiData_GetAttendCalendar(GetAttendCalendar: GetAttendCalendarClass) {
    return this.http.post(this.localUrl + 'Integration/AbsIntegrationHandler.svc/GetAttendCalendar',
      JSON.stringify(GetAttendCalendar), {
      headers: this.GetHeader()
    })
  }

  /**
   * @todo 出勤資料簡易版(行事曆)
   */
  getWebApiData_GetAttendCalendarSimplify(GetAttendCalendar: GetAttendCalendarClass) {
    return this.http.post(this.localUrl + 'Integration/AbsIntegrationHandler.svc/GetAttendCalendarSimplify',
      JSON.stringify(GetAttendCalendar), {
      headers: this.GetHeader()
    })
  }

  /**
   * @todo 取得員工考勤異常資料-依部門
   */
  getWebApiData_GetAttendExceptionalByDept(GetAttendExceptionalByDept: GetAttendExceptionalByDeptClass) {
    return this.http.post(this.localUrl + 'AttHandler.svc/GetAttendExceptionalByDept',
      JSON.stringify(GetAttendExceptionalByDept), {
      headers: this.GetHeader()
    })
  }

  /**
   * @todo 取得班別代碼(依工號)
   */
  getWebApiData_GetRoteByEmpID(EmpID: string, DateB: string) {
    return this.http.post(this.localUrl + 'AttHandler.svc/GetRoteByEmpID',
      JSON.stringify({ "EmpID": EmpID, "DateB": DateB }), {
      headers: this.GetHeader()
    })
  }

  /**
   * @todo 抽單,流程狀態設定(整合版),enumState(Approve,Reject,Cancel,Delete,Take,TransSign)
   */
  getWebApiData_TakeSetFlowState(EmpID: string, ListProcessFlowID: number) {
    return this.http.post(this.localUrl + 'Integration/FlowMainIntegrationHandler.svc/SetFlowState',
      JSON.stringify({
        "ListProcessFlowID": [ListProcessFlowID],
        "enumState": "Take",
        "EmpID": EmpID,
        "SignEmpID": null
      }), {
      headers: this.GetHeader()
    })
  }

  /**
   * @todo 轉呈,流程狀態設定(整合版),enumState(Approve,Reject,Cancel,Delete,Take,TransSign)
   */
  getWebApiData_TransSignState(TransSignStateGetApi: TransSignStateGetApiClass) {
    return this.http.post(this.localUrl + 'Integration/FlowMainIntegrationHandler.svc/SetFlowState',
      JSON.stringify(TransSignStateGetApi), {
      headers: this.GetHeader()
    })
  }

  /**
   * @todo 當天是否請假存入(審核-請假單 當日請假勾勾)
   */
  getWebApiData_SaveToday(AutoKey, Today: boolean) {
    return this.http.post(this.localUrl + 'Flow/AbsFlowHandler.svc/SaveToday',
      JSON.stringify({ "AutoKey": AutoKey, "Today": Today }), {
      headers: this.GetHeader()
    })

  }


  /**
   * @todo 調班檢查(單人)
   */
  getWebApiData_ShiftRoteCheck(ShiftRoteCheckClass: ShiftRoteCheckClass) {
    return this.http.post(this.localUrl + 'ShiftRoteHandler.svc/ShiftRoteCheck',
      JSON.stringify(ShiftRoteCheckClass), {
      headers: this.GetHeader()
    })

  }


  /**
   * @todo 取得餘假時數(包含流程進行中)
   */
  getWebApiData_GetHoliDayBalanceFlow(GetHoliDayBalanceFlow: GetHoliDayBalanceFlow) {
    return this.http.post(this.localUrl + 'Integration/AbsIntegrationHandler.svc/GetHoliDayBalance',
      JSON.stringify(GetHoliDayBalanceFlow), {
      headers: this.GetHeader()
    })
  }

  /**
   * @todo 調班單-流程檢查
   */
  getWebApiData_FlowShiftRoteCheck(FlowShiftRoteCheck: FlowShiftRoteCheckClass) {
    return this.http.post(this.localUrl + 'Flow/ShiftRoteFlowHandler.svc/ShiftRoteCheck',
      JSON.stringify(FlowShiftRoteCheck), {
      headers: this.GetHeader()
    })
  }

  /**
   * @todo 新增代理人
   */
  getWebApiData_InsertCheckAgent(InsertCheckAgent: InsertCheckAgentClass) {
    return this.http.post(this.localUrl + 'Flow/FlowMainHandler.svc/InsertCheckAgent',
      JSON.stringify(InsertCheckAgent), {
      headers: this.GetHeader()
    })
  }


  /**
   * @todo 取得代理人資訊
   */
  getWebApiData_GetCheckAgent(EmpID: string) {
    return this.http.post(this.localUrl + 'Flow/FlowMainHandler.svc/GetCheckAgent',
      JSON.stringify(EmpID), {
      headers: this.GetHeader()
    })
  }

  /**
   * @todo 取得"被"代理人資訊
   */
  getWebApiData_GetCheckAgentBySource(EmpID: string) {
    return this.http.post(this.localUrl + 'Flow/FlowMainHandler.svc/GetCheckBeAgent',
      JSON.stringify(EmpID), {
      headers: this.GetHeader()
    })
  }


  /**
   * @todo 修改代理人日期
   */
  getWebApiData_UpdateCheckAgent(UpdateCheckAgent: UpdateCheckAgentClass) {
    return this.http.post(this.localUrl + 'Flow/FlowMainHandler.svc/UpdateCheckAgent',
      JSON.stringify(UpdateCheckAgent), {
      headers: this.GetHeader()
    })
  }


  /**
   * @todo 根據工號取得頁面結構
   */
  getWebApiData_GetPageByEmp(EmpID: string) {
    return this.http.post(this.localUrl + 'AuthHandler.svc/GetPageByEmp',
      JSON.stringify(EmpID), {
      headers: this.GetHeader()
    })
  }

  /**
   * @todo 取得信件主檔(主要是內容資訊)
   */
  getWebApiData_GetFormMail(GetFormMail: GetFormMailClass) {
    return this.http.post(this.localUrl + 'Flow/FlowMainHandler.svc/GetFormMail',
      JSON.stringify(GetFormMail), {
      headers: this.GetHeader()
    })
  }

  /**
   * @todo 儲存信件主檔
   */
  getWebApiData_SaveFormMail(SaveFormMail: SaveFormMailClass) {
    return this.http.post(this.localUrl + 'Flow/FlowMainHandler.svc/SaveFormMail',
      JSON.stringify(SaveFormMail), {
      headers: this.GetHeader()
    })
  }


  /**
   * @todo 取得信件欄位
   */
  getWebApiData_GetFormColumn() {
    return this.http.post(this.localUrl + 'Flow/FlowMainHandler.svc/GetFormColumns',
      JSON.stringify(''), {
      headers: this.GetHeader()
    })
  }

  /**
   * @todo 刪除信件欄位
   */
  getWebApiData_DeleteFormMail(AutoKey: number) {
    return this.http.post(this.localUrl + 'Flow/FlowMainHandler.svc/DeleteFormMail',
      JSON.stringify(AutoKey), {
      headers: this.GetHeader()
    })
  }


  /**
   * @todo 取得班別代碼(依是否允許調班)
   */
  getWebApiData_GetRoteByShift(isChange: string) {
    return this.http.post(this.localUrl + 'AttHandler.svc/GetRoteByShift',
      JSON.stringify(isChange), {
      headers: this.GetHeader()
    })
  }

  /**
   * @todo 取得班別代碼(依是否允許不等工時調班)
   */
  getWebApiData_GetRoteDifferShift(isChange: string) {
    return this.http.post(this.localUrl + 'AttHandler.svc/GetRoteDifferShift',
      JSON.stringify(isChange), {
      headers: this.GetHeader()
    })
  }

  /**
   * @todo 取得人力處管轄單位
   */
  getWebApiData_GetDeptHuman(search: string) {
    return this.http.post(this.localUrl + 'BaseHandler.svc/GetDeptHuman',
      JSON.stringify(search), {
      headers: this.GetHeader()
    })
  }

  /**
   * @todo 新增人力處管轄單位
   */
  getWebApiData_InsertDeptHuman(InsertDeptHumanGetApi: InsertDeptHumanGetApiClass) {
    return this.http.post(this.localUrl + 'BaseHandler.svc/InsertDeptHuman',
      JSON.stringify(InsertDeptHumanGetApi), {
      headers: this.GetHeader()
    })
  }

  /**
   * @todo 修改人力處管轄單位
   */
  getWebApiData_UpdateDeptHuman(UpdateDeptHumanGetApi: UpdateDeptHumanGetApiClass) {
    return this.http.post(this.localUrl + 'BaseHandler.svc/UpdateDeptHuman',
      JSON.stringify(UpdateDeptHumanGetApi), {
      headers: this.GetHeader()
    })
  }


  /**
   * @todo 取得編制部門
   */
  getWebApiData_GetDept(GetDeptGetApi: GetDeptGetApiClass) {
    return this.http.post(this.localUrl + 'BaseHandler.svc/GetDept',
      JSON.stringify(GetDeptGetApi), {
      headers: this.GetHeader()
    })
  }

  /**
   * @todo 取得主管代填人設定
   */
  getWebApiData_GetDeptSecretary(search: string) {
    return this.http.post(this.localUrl + 'BaseHandler.svc/GetDeptSecretary',
      JSON.stringify(search), {
      headers: this.GetHeader()
    })
  }
  /**
   * @todo 新增主管代填人設定
   */
  getWebApiData_InsertDeptSecretary(InsertDeptSecretaryGetApi: InsertDeptSecretaryGetApiClass) {
    return this.http.post(this.localUrl + 'BaseHandler.svc/InsertDeptSecretary',
      JSON.stringify(InsertDeptSecretaryGetApi), {
      headers: this.GetHeader()
    })
  }

  /**
   * @todo 修改主管代填人設定
   */
  getWebApiData_UpdateDeptSecretary(UpdateDeptSecretaryGetApi: UpdateDeptSecretaryGetApiClass) {
    return this.http.post(this.localUrl + 'BaseHandler.svc/UpdateDeptSecretary',
      JSON.stringify(UpdateDeptSecretaryGetApi), {
      headers: this.GetHeader()
    })
  }


  /**
   * @todo 取得特殊呈核流程(SearchCate=1=呈核;SearchCate=2=被呈核)
   */
  getWebApiData_GetBaseSpecialFlow(GetBaseSpecialFlowGetApi: GetBaseSpecialFlowGetApiClass) {
    return this.http.post(this.localUrl + 'BaseHandler.svc/GetBaseSpecialFlow',
      JSON.stringify(GetBaseSpecialFlowGetApi), {
      headers: this.GetHeader()
    })
  }


  /**
   * @todo 新增特殊呈核流程
   */
  getWebApiData_InsertBaseSpecialFlow(InsertBaseSpecialFlowGetApi: InsertBaseSpecialFlowGetApiClass) {
    return this.http.post(this.localUrl + 'BaseHandler.svc/InsertBaseSpecialFlow',
      JSON.stringify(InsertBaseSpecialFlowGetApi), {
      headers: this.GetHeader()
    })
  }

  /**
   * @todo 修改特殊呈核流程
   */
  getWebApiData_UpdateBaseSpecialFlow(UpdateBaseSpecialFlowGetApiClass: UpdateBaseSpecialFlowGetApiClass) {
    return this.http.post(this.localUrl + 'BaseHandler.svc/UpdateBaseSpecialFlow',
      JSON.stringify(UpdateBaseSpecialFlowGetApiClass), {
      headers: this.GetHeader()
    })
  }

  /**
   * @todo 設定單位管理員
   */
  getWebApiData_SetDeptByEmp(SetDeptByEmpGetApi: SetDeptByEmpGetApiClass) {
    return this.http.post(this.localUrl + 'AuthHandler.svc/SetDeptByEmp',
      JSON.stringify(SetDeptByEmpGetApi), {
      headers: this.GetHeader()
    })
  }


  /**
   * @todo 取得部門單位管理員 (回傳擁有該部門權限的人員)
   */
  getWebApiData_GetAssistantByDeptID(DeptID) {
    return this.http.post(this.localUrl + 'AuthHandler.svc/GetAssistantByDeptID',
      JSON.stringify(DeptID), {
      headers: this.GetHeader()
    })
  }

  /**
   * @todo 根據工號取得角色
   */
  getWebApiData_GetRoleByAuth(EmpID) {
    return this.http.post(this.localUrl + 'AuthHandler.svc/GetRoleByAuth',
      JSON.stringify(EmpID), {
      headers: this.GetHeader()
    })
  }

  /**
   * @todo 取得所有角色
   */
  getWebApiData_GetAllRole() {
    return this.http.post(this.localUrl + 'AuthHandler.svc/GetAllRole', null, {
      headers: this.GetHeader()
    })
  }

  /**
   * @todo 取得員工資料(在職人員) 以簽核部門id取得(Depta)
   */
  getWebApiData_GetBaseByListDeptaID(GetBaseByListDeptaIDGetApi: GetBaseByListDeptaIDGetApiClass) {
    return this.http.post(this.localUrl + 'BaseHandler.svc/GetBaseByListDeptaID',
      JSON.stringify(GetBaseByListDeptaIDGetApi), {
      headers: this.GetHeader()
    })
  }

  /**
   * @todo 取得員工資料(在職人員) 以編制部門id取得(Dept)
   */
  getWebApiData_GetBaseByListDeptID(GetBaseByListDeptIDGetApi: GetBaseByListDeptIDGetApiClass) {
    return this.http.post(this.localUrl + 'BaseHandler.svc/GetBaseByListDeptID',
      JSON.stringify(GetBaseByListDeptIDGetApi), {
      headers: this.GetHeader()
    })
  }

  /**
   * @todo 設定角色
   */
  getWebApiData_SetRole(SetRoleGetApi: SetRoleGetApiClass) {
    return this.http.post(this.localUrl + 'AuthHandler.svc/SetRole',
      JSON.stringify(SetRoleGetApi), {
      headers: this.GetHeader()
    })
  }

  /**
   * @todo 刪除角色
   */
  getWebApiData_DelRole(SetRoleGetApi: SetRoleGetApiClass) {
    return this.http.post(this.localUrl + 'AuthHandler.svc/DelRole',
      JSON.stringify(SetRoleGetApi), {
      headers: this.GetHeader()
    })
  }


  /**
  * @todo 取得所有頁面結構
  */
  getWebApiData_GetPageStructure() {
    return this.http.post(this.localUrl + 'AuthHandler.svc/GetPageStructure', null, {
      headers: this.GetHeader()
    })
  }

  /**
  * @todo 根據角色取得頁面結構
  */
  getWebApiData_GetPageByRoleCode(RoleCode: string) {
    return this.http.post(this.localUrl + 'AuthHandler.svc/GetPageByRoleCode',
      JSON.stringify(RoleCode), {
      headers: this.GetHeader()
    })
  }

  /**
  * @todo 設定角色可見頁面權限
  */
  getWebApiData_SetRolePageByEmp(SetRolePageByEmpGetApi: SetRolePageByEmpGetApiClass) {
    return this.http.post(this.localUrl + 'AuthHandler.svc/SetRolePageByEmp',
      JSON.stringify(SetRolePageByEmpGetApi), {
      headers: this.GetHeader()
    })
  }

  /**
  * @todo 新增角色
  */
  getWebApiData_CreateRole(CreateRoleGetApi: CreateRoleGetApiClass) {
    return this.http.post(this.localUrl + 'AuthHandler.svc/CreateRole',
      JSON.stringify(CreateRoleGetApi), {
      headers: this.GetHeader()
    })
  }

  /**
  * @todo 更新角色
  */
  getWebApiData_UpdateRole(UpdateRoleGetApi: UpdateRoleGetApiClass) {
    return this.http.post(this.localUrl + 'AuthHandler.svc/UpdateRole',
      JSON.stringify(UpdateRoleGetApi), {
      headers: this.GetHeader()
    })
  }

  /**
  * @todo 取得單位管理員部門權限By工號
  */
  getWebApiData_GetDeptsByEmp(EmpID: string) {
    return this.http.post(this.localUrl + 'AuthHandler.svc/GetDeptsByEmp',
      JSON.stringify(EmpID), {
      headers: this.GetHeader()
    })
  }

  /**
  * @todo 取得單位管理員部門權限By工號
  */
  getWebApiData_GetDeptByEmpCode(EmpID: string) {
    var today = new Date()
    return this.http.post(this.localUrl + 'BaseHandler.svc/GetDeptByEmpCode',
      JSON.stringify({ "EmpCode": EmpID, "EffectDate": doFormatDate(today) }), {
      headers: this.GetHeader()
    })
  }
  /**
  * @todo 刪除單位管理員
  */
  getWebApiData_DelDeptByEmp(DelDeptByEmpGetApi: DelDeptByEmpGetApiClass) {
    return this.http.post(this.localUrl + 'AuthHandler.svc/DelDeptByEmp',
      JSON.stringify(DelDeptByEmpGetApi), {
      headers: this.GetHeader()
    })
  }

  /**
  * @todo 判斷請假需簽核層級
  */
  getWebApiData_GetAbsFlowSignTree(GetAbsFlowSignTreeGetApi: GetAbsFlowSignTreeGetApiClass[]) {
    return this.http.post(this.localUrl + 'Integration/AbsIntegrationHandler.svc/GetAbsFlowSignTree',
      JSON.stringify(GetAbsFlowSignTreeGetApi), {
      headers: this.GetHeader()
    })
  }

  /**
  * @todo 取得表單資訊
  */
  getWebApiData_GetFormInfo(GetFormInfoGetApi: GetFormInfoGetApiClass) {
    return this.http.post(this.localUrl + 'Flow/FlowMainHandler.svc/GetFormInfo',
      JSON.stringify(GetFormInfoGetApi), {
      headers: this.GetHeader()
    })
  }

  /**
  * @todo 修改表單資訊
  */
  getWebApiData_UpdateFormInfo(UpdateFormInfoGetApi: UpdateFormInfoGetApiClass) {
    return this.http.post(this.localUrl + 'Flow/FlowMainHandler.svc/UpdateFormInfo',
      JSON.stringify(UpdateFormInfoGetApi), {
      headers: this.GetHeader()
    })
  }


  /**
  * @todo 紀錄呼叫API錯誤
  */
  getWebApiData_LogApiMsg(LogApiMsgGetApi: LogApiMsgGetApiClass) {
    return this.http.post(this.localUrl + 'MultiHandler.svc/LogApiMsg',
      JSON.stringify(LogApiMsgGetApi), {
      headers: this.GetHeader()
    })
  }


  /**
  * @todo 雙人不等工時調班調後的結果(模擬用)
  */
  getWebApiData_GetShiftRoteTwoPersonAfter(GetShiftRoteTwoPersonAfterGetApi: GetShiftRoteTwoPersonAfterGetApiClass[]) {
    return this.http.post(this.localUrl + 'ShiftRoteHandler.svc/GetShiftRoteTwoPersonAfter',
      JSON.stringify(GetShiftRoteTwoPersonAfterGetApi), {
      headers: this.GetHeader()
    })
  }

  /**
  * @todo 計算調班次數
  */
  getWebApiData_ShiftRoteCount(ShiftRoteCountGetApi: ShiftRoteCountGetApiClass) {
    return this.http.post(this.localUrl + 'Flow/ShiftRoteFlowHandler.svc/ShiftRoteCount',
      JSON.stringify(ShiftRoteCountGetApi), {
      headers: this.GetHeader()
    })
  }
  /**
  * @todo 判斷變形週期需要的例假及休息日(單人)
  */
  getWebApiData_ShiftRoteCheckByWeekType(ShiftRoteCheckByWeekTypeGetApi: ShiftRoteCheckByWeekTypeGetApiClass) {
    return this.http.post(this.localUrl + 'ShiftRoteHandler.svc/ShiftRoteCheckByWeekType',
      JSON.stringify(ShiftRoteCheckByWeekTypeGetApi), {
      headers: this.GetHeader()
    })
  }


  /**
   * @todo 取得出勤異常資料(行事曆)
   */
  getWebApiData_GetAttendCalendarExceptional(GetAttendCalendarExceptionalGetApi: GetAttendCalendarExceptionalGetApiClass) {
    return this.http.post(this.localUrl + 'Integration/AbsIntegrationHandler.svc/GetAttendCalendarExceptional',
      JSON.stringify(GetAttendCalendarExceptionalGetApi), {
      headers: this.GetHeader()
    })
  }


  /**
   * @todo 取得出勤請假資料(行事曆)
   */
  getWebApiData_GetAttendCalendarAbs(GetAttendCalendarAbsGetApi: GetAttendCalendarAbsGetApiClass) {
    return this.http.post(this.localUrl + 'Integration/AbsIntegrationHandler.svc/GetAttendCalendarAbs',
      JSON.stringify(GetAttendCalendarAbsGetApi), {
      headers: this.GetHeader()
    })
  }


  /**
   * @todo 是否是地服處輪班人員(TZTT)
   */
  getWebApiData_IsTZTT(EmpCode: string) {
    return this.http.post(this.localUrl + 'ShiftRoteHandler.svc/IsTZTT',
      JSON.stringify(EmpCode), {
      headers: this.GetHeader()
    })
  }


  /**
   * @todo 流程檢視(請假)-部門
   */
  getWebApiData_GetFlowViewAbsByDept(GetFlowViewDept: GetFlowViewDeptClass) {
    return this.http.post(this.localUrl + 'Integration/FlowMainIntegrationHandler.svc/GetFlowViewAbsByDept',
      JSON.stringify(GetFlowViewDept), {
      headers: this.GetHeader()
    })
  }

  /**
   * @todo 流程檢視(請假)
   */
  getWebApiData_GetFlowViewAbs(GetFlowView: GetFlowViewClass) {
    return this.http.post(this.localUrl + 'Integration/FlowMainIntegrationHandler.svc/GetFlowViewAbs',
      JSON.stringify(GetFlowView), {
      headers: this.GetHeader()
    })
  }

  /**
   * @todo 流程檢視(銷假)-部門
   */
  getWebApiData_GetFlowViewAbscByDept(GetFlowViewDept: GetFlowViewDeptClass) {
    return this.http.post(this.localUrl + 'Integration/FlowMainIntegrationHandler.svc/GetFlowViewAbscByDept',
      JSON.stringify(GetFlowViewDept), {
      headers: this.GetHeader()
    })
  }
  /**
   * @todo 流程檢視(銷假)
   */
  getWebApiData_GetFlowViewAbsc(GetFlowView: GetFlowViewClass) {
    return this.http.post(this.localUrl + 'Integration/FlowMainIntegrationHandler.svc/GetFlowViewAbsc',
      JSON.stringify(GetFlowView), {
      headers: this.GetHeader()
    })
  }

  /**
   * @todo 流程檢視(忘刷)-部門
   */
  getWebApiData_GetFlowViewCardByDept(GetFlowViewDept: GetFlowViewDeptClass) {
    return this.http.post(this.localUrl + 'Integration/FlowMainIntegrationHandler.svc/GetFlowViewCardByDept',
      JSON.stringify(GetFlowViewDept), {
      headers: this.GetHeader()
    })
  }
  /**
   * @todo 流程檢視(忘刷)
   */
  getWebApiData_GetFlowViewCard(GetFlowView: GetFlowViewClass) {
    return this.http.post(this.localUrl + 'Integration/FlowMainIntegrationHandler.svc/GetFlowViewCard',
      JSON.stringify(GetFlowView), {
      headers: this.GetHeader()
    })
  }

  /**
   * @todo 流程檢視(調班)-部門
   */
  getWebApiData_GetFlowViewShiftRoteByDept(GetFlowViewDept: GetFlowViewDeptClass) {
    return this.http.post(this.localUrl + 'Integration/FlowMainIntegrationHandler.svc/GetFlowViewShiftRoteByDept',
      JSON.stringify(GetFlowViewDept), {
      headers: this.GetHeader()
    })
  }
  /**
   * @todo 流程檢視(調班)
   */
  getWebApiData_GetFlowViewShiftRote(GetFlowView: GetFlowViewClass) {
    return this.http.post(this.localUrl + 'Integration/FlowMainIntegrationHandler.svc/GetFlowViewShiftRote',
      JSON.stringify(GetFlowView), {
      headers: this.GetHeader()
    })
  }

  /**
   * @todo 取得請假資料(Flow結構)(實體資料)
   */
  getWebApiData_GetAbsByFlowStructure(Key, Miniature: boolean) {
    return this.http.post(this.localUrl + 'Integration/AbsIntegrationHandler.svc/GetAbsByFlowStructure',
      JSON.stringify({ "Key": Key, "Miniature": Miniature }), {
      headers: this.GetHeader()
    })

  }

  /**
   * @todo 請假資料明細-依部門(區間含流程資料)-單位查詢用-限制
   */
  getWebApiData_GetAbsDetailByDeptHide(GetAbsDetailByDeptGetApi: GetAbsDetailByDeptGetApiClass) {
    return this.http.post(this.localUrl + 'Integration/AbsIntegrationHandler.svc/GetAbsDetailByDeptHide',
      JSON.stringify(GetAbsDetailByDeptGetApi), {
      headers: this.GetHeader()
    })

  }

  /**
   * @todo 請假資料明細-依工號(區間)-單位查詢用-限制
   */
  getWebApiData_GetAbsDetailByListEmpIDHide(GetAbsDetailByListEmpIDGetApi: GetAbsDetailByListEmpIDGetApiClass) {
    return this.http.post(this.localUrl + 'Integration/AbsIntegrationHandler.svc/GetAbsDetailByListEmpIDHide',
      JSON.stringify(GetAbsDetailByListEmpIDGetApi), {
      headers: this.GetHeader()
    })

  }
  /**
   * @todo 取得請假資料-依部門
   */
  getWebApiData_GetAbsDetailByDept(GetAbsDetailByDeptGetApi: GetAbsDetailByDeptGetApiClass) {
    return this.http.post(this.localUrl + 'Integration/AbsIntegrationHandler.svc/GetAbsDetailByDept',
      JSON.stringify(GetAbsDetailByDeptGetApi), {
      headers: this.GetHeader()
    })
  }

  /**
   * @todo 請假資料明細-依工號(區間)
   */
  getWebApiData_GetAbsDetailByListEmpID(GetAbsDetailByListEmpIDGetApi: GetAbsDetailByListEmpIDGetApiClass) {
    return this.http.post(this.localUrl + 'Integration/AbsIntegrationHandler.svc/GetAbsDetailByListEmpID',
      JSON.stringify(GetAbsDetailByListEmpIDGetApi), {
      headers: this.GetHeader()
    })

  }



  /**
   * @todo 取得員工資料(在職人員) 權限判斷
   */
  getWebApiData_GetBaseByFormAuth(GetBaseByForm: GetBaseByFormClass) {
    return this.http.post(this.localUrl + 'BaseHandler.svc/GetBaseByFormAuth',
      JSON.stringify(GetBaseByForm), {
      headers: this.GetHeader()
    })

  }

  /**
   * @todo 取得員工資料-簡易
   */
  getWebApiData_GetBase(ListEmpID: Array<string>, EffectDate: string) {
    return this.http.post(this.localUrl + 'BaseHandler.svc/GetBase',
      JSON.stringify({ "ListEmpID": ListEmpID, "EffectDate": EffectDate }), {
      headers: this.GetHeader()
    })

  }

  /**
   * @todo 取得員工資料(在職人員) 權限判斷-員工關鍵字
   */
  getWebApiData_GetBaseByFormEmp(GetBaseByFormEmpGetApi: GetBaseByFormEmpGetApiClass) {
    return this.http.post(this.localUrl + 'BaseHandler.svc/GetBaseByFormEmp',
      JSON.stringify(GetBaseByFormEmpGetApi), {
      headers: this.GetHeader()
    })
  }

  /**
   * @todo 取得員工資料(在職人員) 權限判斷-部門關鍵字
   */
  getWebApiData_GetBaseByFormDept(GetBaseByFormDeptGetApi: GetBaseByFormDeptGetApiClass) {
    return this.http.post(this.localUrl + 'BaseHandler.svc/GetBaseByFormDept',
      JSON.stringify(GetBaseByFormDeptGetApi), {
      headers: this.GetHeader()
    })
  }


  /**
   * @todo 登入者權限判定(只列出部門)
   */
  getWebApiData_GetBaseByAuthByEmpIDgetDeptInfo(GetBaseByAuthByEmpIDgetDeptInfoGetApi: GetBaseByAuthByEmpIDgetDeptInfoGetApiClass) {
    return this.http.post(this.localUrl + 'BaseHandler.svc/GetBaseByAuthByEmpIDgetDeptInfo',
      JSON.stringify(GetBaseByAuthByEmpIDgetDeptInfoGetApi), {
      headers: this.GetHeader()
    })
  }

  /**
   * @todo 是否可以登入
   */
  getWebApiData_IsLoginPass(IsLoginPassGetApi: IsLoginPassGetApiClass) {
    return this.http.post(this.localUrl + 'AuthHandler.svc/IsLoginPass',
      JSON.stringify(IsLoginPassGetApi), {
      headers: this.GetHeader()
    })
  }

  /**
   * @todo 是否允許以登入(白名單)
   */
  getWebApiData_IsAllowLogin(IsLoginPassGetApi: IsLoginPassGetApiClass) {
    return this.http.post(this.localUrl + 'AuthHandler.svc/IsAllowLogin',
      JSON.stringify(IsLoginPassGetApi), {
      headers: this.GetHeader()
    })
  }

  /**
   * @todo 取得登入資訊
   */
  getWebApiData_GetLoginLog() {
    return this.http.post(this.localUrl + 'AuthHandler.svc/GetLoginLog',
      null, {
      headers: this.GetHeader()
    })
  }

  /**
   * @todo 取得寄信的內容(Log)
   */
  getWebApiData_GetSendMailLog(GetSendMailLog: GetSendMailLogClass) {
    return this.http.post(this.localUrl + 'Flow/FlowMainHandler.svc/GetSendMailLog',
      JSON.stringify(GetSendMailLog), {
      headers: this.GetHeader()
    })
  }

  /**
   * @todo 取得出勤資料-統計班別總數(區間)
   */
  getWebApiData_GetAttendSumRote(GetAttendSumRoteGetApi: GetAttendSumRoteGetApiClass) {
    return this.http.post(this.localUrl + 'AttHandler.svc/GetAttendSumRote',
      JSON.stringify(GetAttendSumRoteGetApi), {
      headers: this.GetHeader()
    })
  }


  /**
   * @todo 考勤異常筆數(異常的)
   */
  getWebApiData_GetAttendExceptionalCount(GetAttendExceptionalCount: GetAttendExceptionalCountClass) {
    return this.http.post(this.localUrl + 'AttHandler.svc/GetAttendExceptionalCount',
      JSON.stringify(GetAttendExceptionalCount), {
      headers: this.GetHeader()
    })
  }


  /**
   * @todo 事件假之事件發生日紀錄
   */
  getWebApiData_GetEventDate(GetEventDateGetApi: GetEventDateGetApiClass) {
    return this.http.post(this.localUrl + 'Integration/AbsIntegrationHandler.svc/GetEventDate',
      JSON.stringify(GetEventDateGetApi), {
      headers: this.GetHeader()
    })
  }

  /**
   * @todo 取得目前待審核的表單-請假
   */
  getWebApiData_GetFlowSignAbs(GetFlowSignAbsGetApi: GetFlowSignAbsGetApiClass) {
    return this.http.post(this.localUrl + 'Integration/FlowMainIntegrationHandler.svc/GetFlowSignAbs',
      JSON.stringify(GetFlowSignAbsGetApi), {
      headers: this.GetHeader()
    })
  }
  /**
   * @todo 取得目前待審核的表單-請假(外框是總筆數)
   */
  getWebApiData_GetFlowSignAbsData(GetFlowSignAbsDataGetApi: GetFlowSignAbsDataGetApiClass) {
    return this.http.post(this.localUrl + 'Integration/FlowMainIntegrationHandler.svc/GetFlowSignAbsData',
      JSON.stringify(GetFlowSignAbsDataGetApi), {
      headers: this.GetHeader()
    })
  }

  /**
   * @todo 取得目前待審核的表單-銷假
   */
  getWebApiData_GetFlowSignAbsc(GetFlowSignAbsGetApi: GetFlowSignAbsGetApiClass) {
    return this.http.post(this.localUrl + 'Integration/FlowMainIntegrationHandler.svc/GetFlowSignAbsc',
      JSON.stringify(GetFlowSignAbsGetApi), {
      headers: this.GetHeader()
    })
  }

  /**
   * @todo 取得目前待審核的表單-忘刷
   */
  getWebApiData_GetFlowSignCard(GetFlowSignAbsGetApi: GetFlowSignAbsGetApiClass) {
    return this.http.post(this.localUrl + 'Integration/FlowMainIntegrationHandler.svc/GetFlowSignCard',
      JSON.stringify(GetFlowSignAbsGetApi), {
      headers: this.GetHeader()
    })
  }

  /**
   * @todo 取得目前待審核的表單-調班
   */
  getWebApiData_GetFlowSignShiftRote(GetFlowSignAbsGetApi: GetFlowSignAbsGetApiClass) {
    return this.http.post(this.localUrl + 'Integration/FlowMainIntegrationHandler.svc/GetFlowSignShiftRote',
      JSON.stringify(GetFlowSignAbsGetApi), {
      headers: this.GetHeader()
    })
  }
  /**
   * @todo 取得目前待審核的表單-異常註記單
   */
  getWebApiData_GetFlowSignAttendUnusual(GetFlowSignAbsGetApi: GetFlowSignAbsGetApiClass) {
    return this.http.post(this.localUrl + 'Integration/FlowMainIntegrationHandler.svc/GetFlowSignAttendUnusual',
      JSON.stringify(GetFlowSignAbsGetApi), {
      headers: this.GetHeader()
    })
  }

  /**
   * @todo 取得目前待審核的表單-補卡
   */
  getWebApiData_GetFlowSignCardPatch(GetFlowSignAbsGetApi: GetFlowSignAbsGetApiClass) {
    return this.http.post(this.localUrl + 'Integration/FlowMainIntegrationHandler.svc/GetFlowSignCardPatch',
      JSON.stringify(GetFlowSignAbsGetApi), {
      headers: this.GetHeader()
    })
  }


  /**
   * @todo 取得班別異常資訊-註記單
   */
  getWebApiData_GetAttendExceptionalNew(GetAttendExceptional: GetAttendExceptionalClass) {
    return this.http.post(this.localUrl + 'AttHandler.svc/GetAttendExceptionalNew',
      JSON.stringify({ "DateB": GetAttendExceptional.DateB, "DateE": GetAttendExceptional.DateE, "ListEmpID": GetAttendExceptional.ListEmpID }), {
      headers: this.GetHeader()
    })
  }

  /**
   * @todo 註記單_儲存並起單
   */
  getWebApiData_AttendUnusualSaveAndFlowStart(AttendUnusualSaveAndFlowStart: AttendUnusualSaveAndFlowStartClass) {
    return this.http.post(this.localUrl + 'Flow/AttendUnusualFlowHandler.svc/SaveAndFlowStart',
      JSON.stringify(AttendUnusualSaveAndFlowStart), {
      headers: this.GetHeader()
    })
  }
  /**
   * @todo 流程檢視(異常註記單)
   */
  getWebApiData_GetFlowViewAttendUnusual(GetFlowView: GetFlowViewClass) {
    return this.http.post(this.localUrl + 'Integration/FlowMainIntegrationHandler.svc/GetFlowViewAttendUnusual',
      JSON.stringify(GetFlowView), {
      headers: this.GetHeader()
    })
  }

  /**
   * @todo 流程檢視(異常註記單)-部門
   */
  getWebApiData_GetFlowViewAttendUnusualByDept(GetFlowViewDept: GetFlowViewDeptClass) {
    return this.http.post(this.localUrl + 'Integration/FlowMainIntegrationHandler.svc/GetFlowViewAttendUnusualByDept',
      JSON.stringify(GetFlowViewDept), {
      headers: this.GetHeader()
    })
  }
  

  /**
   * @todo 取得班別資訊-補卡單
   */
  getWebApiData_GetAttendForCardPatch(GetAttendExceptional: GetAttendExceptionalClass) {
    return this.http.post(this.localUrl + 'AttHandler.svc/GetAttendForCardPatch',
      JSON.stringify({ "DateB": GetAttendExceptional.DateB, "DateE": GetAttendExceptional.DateE, "ListEmpID": GetAttendExceptional.ListEmpID }), {
      headers: this.GetHeader()
    })
  }

  /**
   * @todo 取得班別資訊-考勤修正單(合併)
   */
  getWebApiData_GetAttendForCardPatchIntegration(GetAttendExceptional: GetAttendExceptionalClass) {
    return this.http.post(this.localUrl + 'Integration/AbsIntegrationHandler.svc/GetAttendForCardPatch',
      JSON.stringify(GetAttendExceptional), {
      headers: this.GetHeader()
    })
  }
  
  /**
   * @todo 流程檢視(補卡)-部門
   */
  getWebApiData_GetFlowViewCardPatchByDept(GetFlowViewDept: GetFlowViewDeptClass) {
    return this.http.post(this.localUrl + 'Integration/FlowMainIntegrationHandler.svc/GetFlowViewCardPatchByDept',
      JSON.stringify(GetFlowViewDept), {
      headers: this.GetHeader()
    })
  }
  /**
   * @todo 流程檢視(補卡)
   */
  getWebApiData_GetFlowViewCardPatch(GetFlowView: GetFlowViewClass) {
    return this.http.post(this.localUrl + 'Integration/FlowMainIntegrationHandler.svc/GetFlowViewCardPatch',
      JSON.stringify(GetFlowView), {
      headers: this.GetHeader()
    })
  }


  
  /**
   * @todo 考勤修正單(合併)-儲存並起單
   */
  getWebApiData_SaveAndFlowStartCombine(SaveAndFlowStartCombine: SaveAndFlowStartCombineClass[]) {
    return this.http.post(this.localUrl + 'Integration/FlowMainIntegrationHandler.svc/SaveAndFlowStartCombine',
      JSON.stringify(SaveAndFlowStartCombine), {
      headers: this.GetHeader()
    })
  }


  /**
   * @todo 加班API
   */
  getWebApiData_GetOtView(GetOtView: GetOtViewGetApi) {
    return this.http.post(this.localUrl + 'OtHandler.svc/GetOtView',
      JSON.stringify(GetOtView), {
      headers: this.GetHeader()
    })
  }

  
  /**
   * @todo 取得補卡單流程資料
   */
  getWebApiData_GetCardFlowApps(GetCardFlowApps:GetCardFlowAppsGetApi) {
    return this.http.post(this.localUrl + 'Flow/CardPatchFlowHandler.svc/GetCardFlowApps',
    JSON.stringify(GetCardFlowApps), {
      headers: this.GetHeader()
    })
  }

}




















