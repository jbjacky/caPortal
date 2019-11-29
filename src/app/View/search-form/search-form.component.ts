import { Component, OnInit, AfterViewInit, OnDestroy, ViewChild } from '@angular/core';
import { fromEvent } from 'rxjs';
import { debounceTime, takeWhile } from 'rxjs/operators';
import { GetApiDataServiceService } from 'src/app/Service/get-api-data-service.service';
import { GetApiUserService } from 'src/app/Service/get-api-user.service';
import { SearchMan } from 'src/app/Models/CalendarClass';
import { GetFlowViewClass } from 'src/app/Models/PostData_API_Class/GetFlowViewClass';
import { SearchVaFormComponent } from '../shareComponent/search-va-form/search-va-form.component';
import { ViewportScroller } from '@angular/common';
import { SearchDelFormComponent } from '../shareComponent/search-del-form/search-del-form.component';
import { SearchForgetFormComponent } from '../shareComponent/search-forget-form/search-forget-form.component';
import { NgxSpinnerService } from 'ngx-spinner';
import { GetFlowViewAbsGetApiDataClass } from 'src/app/Models/GetFlowViewAbsGetApiDataClass';
import { GetFlowViewAbscGetApiDataClass } from 'src/app/Models/GetFlowViewAbscGetApiDataClass';
import { GetFlowViewCardGetApiDataClass } from 'src/app/Models/GetFlowViewCardGetApiDataClass';
import { GetFlowViewShiftRoteGetApiDataClass } from 'src/app/Models/GetFlowViewShiftRoteGetApiDataClass';
import { SearchChangeFormComponent } from '../shareComponent/search-change-form/search-change-form.component';
import { void_MonthDiff } from 'src/app/UseVoid/void_DateDiff';
import { GetFlowSignAttendUnusualApiDataClass } from 'src/app/Models/GetFlowSignAttendUnusualApiDataClass';
import { GetFlowViewAttendUnusualDataClass } from 'src/app/Models/GetFlowViewAttendUnusualDataClass';
import { SearchCardPatchFormComponent } from '../shareComponent/search-card-patch-form/search-card-patch-form.component';
declare let $: any; //use jquery

@Component({
  selector: 'app-search-form',
  templateUrl: './search-form.component.html',
  styleUrls: ['./search-form.component.css']
})
export class SearchFormComponent implements OnInit, AfterViewInit, OnDestroy {
  ngOnDestroy(): void {
    $('body').css("overflow-y", "auto");
    this.formEvent_WindowResize.unsubscribe();
    this.formEvent_TopDivGoTop.unsubscribe();
    this.api_subscribe = false;
  }
  api_subscribe = true; //ngOnDestroy時要取消訂閱api的subscribe


  diolog_state: boolean = false;
  Search_FormCondition: GetFlowViewClass = new GetFlowViewClass()
  isSearch: boolean = false; //第一次沒按不顯示查詢結果
  showSelectSearchForm: string = ''; //顯示表單種類
  SearchMan: SearchMan = new SearchMan();
  setFlowView: showFlowView[] = []//傳給查詢結果-表單

  chooseRadio: number = 1;

  constructor(private GetApiDataServiceService: GetApiDataServiceService,
    private GetApiUserService: GetApiUserService,
    private viewScroller: ViewportScroller,
    private LoadingPage: NgxSpinnerService) { }

  showTransSign: boolean = false
  showTake: boolean = true
  ngOnInit() {
    this.GetApiUserService.counter$
      .pipe(takeWhile(() => this.api_subscribe))
      .subscribe(
        (x: any) => {
          if (x != 0) {
            this.SearchMan.jobID = x.EmpCode
            // console.log(x)
            x.IsAssistant
            if (x.EmpNameC) {
              this.SearchMan.name = x.EmpNameC
            } else {
              this.SearchMan.name = x.EmpNameE

            }
          }
        }
      )
  }

  @ViewChild(SearchVaFormComponent) SearchVaFormComponent: SearchVaFormComponent;
  @ViewChild(SearchDelFormComponent) SearchDelFormComponent: SearchDelFormComponent;
  @ViewChild(SearchChangeFormComponent) SearchChangeFormComponent: SearchChangeFormComponent;
  @ViewChild(SearchForgetFormComponent) SearchForgetFormComponent: SearchForgetFormComponent;
  @ViewChild(SearchCardPatchFormComponent) SearchCardPatchFormComponent: SearchCardPatchFormComponent;
  showVaDataDetails: boolean // 每點一次搜尋Detil
  onSearchForm() {
    this.showSelectSearchForm = ''//勿刪!! 讓搜尋後的結果重新載入一遍

    if (window.outerWidth < 800) {
      $('#bt_sideMenu_text').text('展開查詢選單')
      $('#bt_sideMenu_img').css({ "transition": "transform 0.5s" });
      $('#bt_sideMenu_img').css({ "transform": "rotate(0deg)" });
      $('#searchMenu').collapse('hide')
      $('#phonetopdiv').css({ "height": "inherit" });

      $('body').css("overflow-y", "auto");
      this.diolog_state = false

    }

    this.Search_FormCondition.ListEmpID = [this.SearchMan.jobID]

    // console.log(this.Search_FormCondition)

    var searchDateB: Date = new Date(this.Search_FormCondition.DateB.toString())
    var searchDateE: Date = new Date(this.Search_FormCondition.DateE.toString())
    if (searchDateB > searchDateE) {
      alert('結束日不得大於起始日')
    } else if (void_MonthDiff(searchDateB, searchDateE) > 3) {
      alert('查詢起訖區間"月份"不得超過三個月')
    } else {
      this.getSearchFlowForm(this.Search_FormCondition)
    }

  }

  getApiVaData: GetFlowViewAbsGetApiDataClass[] = []
  getApiDelData: GetFlowViewAbscGetApiDataClass[] = []
  getApiForgetData: GetFlowViewCardGetApiDataClass[] = []
  getApiShiftRoteData: GetFlowViewShiftRoteGetApiDataClass[] = []
  getFlowSignAttendUnusualApiData: GetFlowViewAttendUnusualDataClass[] = []
  getApiCardPatchData: GetFlowViewCardGetApiDataClass[] = []

  getSearchFlowForm(GetFlowView: GetFlowViewClass) {
    // console.log(GetFlowView)

    this.LoadingPage.show()
    this.isSearch = false
    if (GetFlowView.FormCode == 'Abs') {

      this.GetApiDataServiceService.getWebApiData_GetFlowViewAbs(GetFlowView)
        .pipe(takeWhile(() => this.api_subscribe))
        .subscribe(
          (GetFlowViewAbsGetApiData: GetFlowViewAbsGetApiDataClass[]) => {
            this.getApiVaData = GetFlowViewAbsGetApiData
            this.showForm(GetFlowView)
            this.LoadingPage.hide()
          }, error => {
            this.LoadingPage.hide()
          }
        )

    } else if (GetFlowView.FormCode == 'Absc') {
      this.GetApiDataServiceService.getWebApiData_GetFlowViewAbsc(GetFlowView)
        .pipe(takeWhile(() => this.api_subscribe))
        .subscribe(
          (GetFlowViewAbscGetApiData: GetFlowViewAbscGetApiDataClass[]) => {
            this.getApiDelData = GetFlowViewAbscGetApiData
            this.showForm(GetFlowView)
            this.LoadingPage.hide()
          }, error => {
            this.LoadingPage.hide()
          }
        )
    } else if (GetFlowView.FormCode == 'Card') {

      this.GetApiDataServiceService.getWebApiData_GetFlowViewCard(GetFlowView)
        .pipe(takeWhile(() => this.api_subscribe))
        .subscribe(
          (GetFlowViewCardGetApiData: GetFlowViewCardGetApiDataClass[]) => {
            this.getApiForgetData = GetFlowViewCardGetApiData
            this.showForm(GetFlowView)
            this.LoadingPage.hide()
          }, error => {
            this.LoadingPage.hide()
          }
        )
    } else if (GetFlowView.FormCode == 'ShiftRote') {

      this.GetApiDataServiceService.getWebApiData_GetFlowViewShiftRote(GetFlowView)
        .pipe(takeWhile(() => this.api_subscribe))
        .subscribe(
          (GetFlowViewShiftRoteGetApiData: GetFlowViewShiftRoteGetApiDataClass[]) => {
            this.getApiShiftRoteData = GetFlowViewShiftRoteGetApiData
            this.showForm(GetFlowView)
            this.LoadingPage.hide()
          }, error => {
            this.LoadingPage.hide()
          }
        )
    } else if (GetFlowView.FormCode == 'AttendUnusual') {

      this.GetApiDataServiceService.getWebApiData_GetFlowViewAttendUnusual(GetFlowView)
        .pipe(takeWhile(() => this.api_subscribe))
        .subscribe(
          (GetFlowSignAttendUnusualApiData: GetFlowViewAttendUnusualDataClass[]) => {
            this.getFlowSignAttendUnusualApiData =  JSON.parse(JSON.stringify(GetFlowSignAttendUnusualApiData)) 
            this.showForm(GetFlowView)
            this.LoadingPage.hide()
          }, error => {
            this.LoadingPage.hide()
          }
        )
    } else if (GetFlowView.FormCode == 'CardPatch') {

      this.GetApiDataServiceService.getWebApiData_GetFlowViewCardPatch(GetFlowView)
        .pipe(takeWhile(() => this.api_subscribe))
        .subscribe(
          (GetFlowViewCardGetApiData: GetFlowViewCardGetApiDataClass[]) => {
            this.getApiCardPatchData = GetFlowViewCardGetApiData
            this.showForm(GetFlowView)
            this.LoadingPage.hide()
          }, error => {
            this.LoadingPage.hide()
          }
        )
    } 
  }

  showForm(GetFlowView: GetFlowViewClass) {

    this.showSelectSearchForm = GetFlowView.FormCode; //顯示查詢結果
    this.isSearch = true;//顯示查詢結果

    if (this.SearchVaFormComponent) {
      this.SearchVaFormComponent.onGoBackFunction();
    } else if (this.SearchForgetFormComponent) {
      this.SearchForgetFormComponent.onGoBackFunction();
    } else if (this.SearchDelFormComponent) {
      this.SearchDelFormComponent.onGoBackFunction();
    } else if (this.SearchChangeFormComponent) {
      this.SearchChangeFormComponent.onGoBackFunction();
    } else if (this.SearchCardPatchFormComponent) {
      this.SearchCardPatchFormComponent.onGoBackFunction();
    } 

    this.TopresizeNav();
    this.windowSize()
  }

  ngAfterViewInit(): void {
    this.formEvent_TopDivGoTop;
    this.formEvent_WindowResize;
    this.windowSize()
    $("#id_bt_startday").change(function () {
      $("#id_ipt_startday").val($("#id_bt_startday").val())
      $("#id_ipt_endday").val($("#id_bt_startday").val())
    });
  }

  onCheckCollapseIn() {
    //確認是否收合
    if ($('#bt_sideMenu').hasClass('collapsed')) {
      $('#bt_sideMenu_text').text('收合查詢選單')
      $('#bt_sideMenu_img').css({ "transition": "transform 0.5s" });
      $('#bt_sideMenu_img').css({ "transform": "rotate(-180deg)" });
      $('#showFormPalce').addClass('showForm_openDialog');
      $('#showFormPalce').removeClass('showForm_closeDialog');

      var setHeight = ''
      // console.log(document.getElementById("phonetopdiv").style.top)
      var topString = document.getElementById("phonetopdiv").style.top.split('px')
      var topInt = parseInt(topString[0])
      // console.log(bb)
      setHeight = (window.innerHeight - topInt).toString() + 'px'
      document.getElementById("phonetopdiv").style.height = setHeight;
      // document.getElementById("phonetopdiv").style.height = '400px';

      $('#searchMenu').collapse('show')

      this.diolog_state = true
      $('body').css("overflow-y", "hidden");

    } else {
      $('#bt_sideMenu_text').text('展開查詢選單')
      $('#bt_sideMenu_img').css({ "transition": "transform 0.5s" });
      $('#bt_sideMenu_img').css({ "transform": "rotate(0deg)" });
      $('#showFormPalce').addClass('showForm_closeDialog');
      $('#showFormPalce').removeClass('showForm_openDialog');
      document.getElementById("phonetopdiv").style.height = '90px';
      $('#searchMenu').collapse('hide')

      this.diolog_state = false
      $('body').css("overflow-y", "auto");
    }
  }

  formEvent_WindowResize = fromEvent(window, 'resize')
    //視窗大小改變時，修正width:800~1024的phonediv寬度及位置
    .pipe(debounceTime(0))
    .subscribe((event) => {
      // alert('改變視窗大小了')
      this.TopresizeNav();
      this.windowSize()
    })

  windowSize() {

    if (this.isSearch && window.outerWidth < 800) {

      document.getElementById("phonetopdiv").style.position = 'fixed';
      document.getElementById("phonetopdiv").style.height = '90px';
      // document.getElementById("phonetopdiv").style.height = '400px';
      document.getElementById("phonetopdiv").style.overflowY = 'auto';

      $('#bt_sideMenu_text').text('展開查詢選單')
      $('#bt_sideMenu_img').css({ "transition": "transform 0.5s" });
      $('#bt_sideMenu_img').css({ "transform": "rotate(0deg)" });
      $('#searchMenu').collapse('hide')
      // document.getElementById("bt_sideMenu").style.visibility = 'visible';
      $('#bt_sideMenu').css({ "visibility": "visible" });
      $('#bt_sideMenu').css({ "display": "block" });
      $("#showP_margin").addClass("P_margin");
      this.diolog_state = false
      $('body').css("overflow-y", "auto");

    } else {

      document.getElementById("phonetopdiv").style.position = 'unset';
      // document.getElementById("bt_sideMenu").style.visibility = 'hidden';
      $('#bt_sideMenu').css({ "visibility": "hidden" });
      $('#bt_sideMenu').css({ "display": "none" });
      $("#showP_margin").removeClass("P_margin");
      $('#searchMenu').collapse('show')
      document.getElementById("phonetopdiv").style.overflowY = 'unset';
      document.getElementById("phonetopdiv").style.height = ' 100%';
      $('#bt_sideMenu_text').text('收合查詢選單')
      $('#bt_sideMenu_img').css({ "transition": "transform 0.5s" });
      $('#bt_sideMenu_img').css({ "transform": "rotate(-180deg)" });


      this.diolog_state = false
      $('body').css("overflow-y", "auto");
    }


  }
  hideSearchDialog() {
    document.getElementById("phonetopdiv").style.position = 'fixed';
    document.getElementById("phonetopdiv").style.height = '90px';
    // document.getElementById("phonetopdiv").style.height = '400px';
    document.getElementById("phonetopdiv").style.overflowY = 'auto';

    $('#bt_sideMenu_text').text('展開查詢選單')
    $('#bt_sideMenu_img').css({ "transition": "transform 0.5s" });
    $('#bt_sideMenu_img').css({ "transform": "rotate(0deg)" });
    $('#searchMenu').collapse('hide')
    // document.getElementById("bt_sideMenu").style.visibility = 'visible';
    $('#bt_sideMenu').css({ "visibility": "visible" });
    $('#bt_sideMenu').css({ "display": "block" });
    $("#showP_margin").addClass("P_margin");

    this.diolog_state = false
    $('body').css("overflow-y", "auto");

  }
  formEvent_TopDivGoTop = fromEvent(window, 'scroll')
    //scroll向下拖拉把藍色區塊副標題蓋住
    .pipe(debounceTime(0)) //當使用者在0.01秒內沒動作就執行
    .pipe(takeWhile(() => this.api_subscribe))
    .subscribe((event) => { //66~138
      var _wYnow = 0;
      if (window.scrollY > 71) {
        document.getElementById("phonetopdiv").style.top = '66px';
      } else {
        _wYnow = window.scrollY;
        var divtop = 138 - _wYnow;
        document.getElementById("phonetopdiv").style.top = divtop + 'px';
        //div隨著scroll拖拉上下移動
      }
      this.TopresizeNav();
    })
  TopresizeNav() {
    //修正width:800~1024的phonediv寬度及位置
    if (window.outerWidth > 800 && window.outerWidth < 1024) {
      if ($("body").hasClass("offcanvas-active")) {
        document.getElementById('phonetopdiv').style.left = '0px';
        document.getElementById('phonetopdiv').style.width = '100%';
      } else {
        document.getElementById('phonetopdiv').style.left = '220px';
        // var rightwidth = window.outerWidth - 220;
        // document.getElementById('phonetopdiv').style.width = rightwidth + 'px';
        document.getElementById('phonetopdiv').style.width = '100%';
      }
    } else if (window.outerWidth < 800) {
      document.getElementById('phonetopdiv').style.left = '0px';
      document.getElementById('phonetopdiv').style.width = '100%';
    }
  }

  scrollTo(tag: string) {
    this.viewScroller.scrollToAnchor(tag);
    //tag=id連結位置
  }


  getSearchFormCondition(flowcondition: GetFlowViewClass) {
    this.Search_FormCondition = flowcondition
    // console.log(q)
  }

}

class HoliDay {
  HoliDayID: string
  HoliDayNameC: string
  AutoFlowStart: string
  HoliDayKindID: string
  HoliDayCode: string
}





export class showFlowView {
  ProcessFlowID: number
  FormName: string
  AppEmpID: string
  AppEmpName: string
  AppDeptName: string
  ManageEmpName: string
  RealManageEmpName: string
  SignDate: string
  PendingDay: number
  Info: string
  State: string
  Take: boolean
}