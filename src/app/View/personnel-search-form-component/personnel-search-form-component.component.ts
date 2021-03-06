import { Component, OnInit, AfterViewInit, OnDestroy, ViewChild } from '@angular/core';
import { fromEvent } from 'rxjs';
import { debounceTime, takeWhile } from 'rxjs/operators';
import { GetApiDataServiceService } from 'src/app/Service/get-api-data-service.service';
import { EmpArray } from 'src/app/Models/EmpArray';
import { GetFlowViewClass } from 'src/app/Models/PostData_API_Class/GetFlowViewClass';
import { ViewportScroller } from '@angular/common';
import { GetApiUserService } from 'src/app/Service/get-api-user.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { showFlowView } from '../search-form/search-form.component';
import { SearchVaFormComponent } from '../shareComponent/search-va-form/search-va-form.component';
import { SearchDelFormComponent } from '../shareComponent/search-del-form/search-del-form.component';
import { SearchForgetFormComponent } from '../shareComponent/search-forget-form/search-forget-form.component';
import { GetFlowViewAbsGetApiDataClass } from 'src/app/Models/GetFlowViewAbsGetApiDataClass';
import { GetFlowViewAbscGetApiDataClass } from 'src/app/Models/GetFlowViewAbscGetApiDataClass';
import { GetFlowViewCardGetApiDataClass } from 'src/app/Models/GetFlowViewCardGetApiDataClass';
import { GetFlowViewShiftRoteGetApiDataClass } from 'src/app/Models/GetFlowViewShiftRoteGetApiDataClass';
import { SearchChangeFormComponent } from '../shareComponent/search-change-form/search-change-form.component';
import { void_DateDiff, void_MonthDiff } from 'src/app/UseVoid/void_DateDiff';
import { OutPutValClass } from '../shareComponent/choose-base-or-dept/choose-base-or-dept.component';
import { GetFlowViewDeptClass } from 'src/app/Models/PostData_API_Class/GetFlowViewDeptClass';
import { doFormatDate } from 'src/app/UseVoid/void_doFormatDate';
import { GetFlowSignAttendUnusualApiDataClass } from 'src/app/Models/GetFlowSignAttendUnusualApiDataClass';
import { SearchAttendUnusualFormComponent } from '../shareComponent/search-attend-unusual-form/search-attend-unusual-form.component';
import { GetFlowViewAttendUnusualDataClass } from 'src/app/Models/GetFlowViewAttendUnusualDataClass';
import { SearchCardPatchDetailComponent } from '../shareComponent/search-card-patch-detail/search-card-patch-detail.component';
import { SearchCardPatchFormComponent } from '../shareComponent/search-card-patch-form/search-card-patch-form.component';
declare let $: any; //use jquerysrc/app/View/shareComponent/search-attend-unusual-form/search-attend-unusual-form.component

@Component({
  selector: 'app-personnel-search-form-component',
  templateUrl: './personnel-search-form-component.component.html',
  styleUrls: ['./personnel-search-form-component.component.css']
})
export class PersonnelSearchFormComponentComponent implements OnInit, AfterViewInit, OnDestroy {
  ngOnDestroy(): void {
    $('body').css("overflow-y", "auto");
    this.formEvent_WindowResize.unsubscribe();
    this.formEvent_TopDivGoTop.unsubscribe();
    $('#chooseEmpdialog').off('show.bs.modal')
    $('#chooseEmpdialog').off('hidden.bs.modal')
    $('#chooseDeptdialog').off('show.bs.modal')
    $('#chooseDeptdialog').off('hidden.bs.modal')
    this.api_subscribe = false;
  }
  api_subscribe = true; //ngOnDestroy時要取消訂閱api的subscribe


  constructor(private GetApiDataServiceService: GetApiDataServiceService,
    private GetApiUserService: GetApiUserService,
    private viewScroller: ViewportScroller,
    private LoadingPage: NgxSpinnerService) { }

  diolog_state: boolean = false; //點選手機展開選單的黑色區塊
  Search_EmpArray: EmpArray[] = [] //搜尋員工工號陣列
  Search_FormCondition: GetFlowViewClass = new GetFlowViewClass()


  setFlowView: showFlowView[] = []//傳給查詢結果-表單

  showSelectSearchForm: any = ''; //顯示表單種類

  isSearch: boolean = false; //第一次沒按不顯示查詢結果
  @ViewChild(SearchVaFormComponent) SearchVaFormComponent: SearchVaFormComponent;
  @ViewChild(SearchDelFormComponent) SearchDelFormComponent: SearchDelFormComponent;
  @ViewChild(SearchChangeFormComponent) SearchChangeFormComponent: SearchChangeFormComponent;
  @ViewChild(SearchForgetFormComponent) SearchForgetFormComponent: SearchForgetFormComponent;
  @ViewChild(SearchAttendUnusualFormComponent) SearchAttendUnusualFormComponent: SearchAttendUnusualFormComponent;
  @ViewChild(SearchCardPatchFormComponent) SearchCardPatchFormComponent: SearchCardPatchFormComponent;
  showTransSign: boolean = false
  showTake: boolean = false
  ngOnInit() {

    this.GetApiUserService.counter$
      .pipe(takeWhile(() => this.api_subscribe))
      .subscribe(
        (x: any) => {
          if (x != 0) {
            this.showTransSign = x.IsAssistant
            this.showTake = x.IsAssistant
          }
        }
      )
  }

  CatchMoreGetFlowViewDept: GetFlowViewDeptClass
  // MoreSearchPage = 1
  CanSerchMore: boolean = false
  // MoreOnSearchForm() {
  //   if(this.CanSerchMore){
  //     this.MoreSearchPage = this.MoreSearchPage + 1
  //     this.CatchMoreGetFlowViewDept.PageCurrent = this.MoreSearchPage
  //     this.getMoreSearchFlowForm_Dept(this.CatchMoreGetFlowViewDept)
  //   }else{
  //     alert('無更多資料')
  //   }
  // }

  onSearchForm() {

    var ListEmpIDArray = []
    // console.log(this.SearchVal)
    if (this.SearchVal.chooseRadio == 1) {

      for (let oneEmp of this.SearchVal.chooseEmp.EmpArray) {
        ListEmpIDArray.push(oneEmp.EmpCode.toString())
      }
      this.Search_FormCondition.ListEmpID = ListEmpIDArray
      if (this.Search_FormCondition.ListEmpID) {
        if (this.Search_FormCondition.ListEmpID.length > 0) {
          if (this.CheckSearch()) {
            this.getSearchFlowForm(this.Search_FormCondition)
          }
        } else {
          alert('請輸入工號或選擇部門(該部門可能沒有人員)')
        }
      }

    } else if (this.SearchVal.chooseRadio == 2) {
      var today = new Date()
      var GetFlowViewDept: GetFlowViewDeptClass = {
        DeptaID: this.SearchVal.chooseDepta.DeptaID,
        ChildDept: this.SearchVal.chooseDepta.isChildDept,
        PageCurrent: 1,
        PageRows: 100, //100
        EffectDate: doFormatDate(today),
        DateB: this.Search_FormCondition.DateB,
        DateE: this.Search_FormCondition.DateE,
        FormCode: this.Search_FormCondition.FormCode,
        State: this.Search_FormCondition.State,
        ProcessFlowID: this.Search_FormCondition.ProcessFlowID,
        Cond1: this.Search_FormCondition.Cond1,
        Cond2: this.Search_FormCondition.Cond2,
        Cond3: this.Search_FormCondition.Cond3,
        Handle: this.Search_FormCondition.Handle
      }

      if (this.SearchVal.chooseDepta.DeptaID) {
        if (this.CheckSearch()) {
          this.CatchMoreGetFlowViewDept = JSON.parse(JSON.stringify(GetFlowViewDept))
          this.getSearchFlowForm_Dept(GetFlowViewDept)
        }
      }else{
        alert('請選擇查詢單位')
      }
    }
  }
  CheckSearch(): boolean {
    var CanSearch: boolean = false
    this.showSelectSearchForm = '' //勿刪!! 讓搜尋後的結果重新載入一遍
    if (window.outerWidth < 800) {
      $('#' + '1_text').text('展開查詢選單')
      $('#' + '1_img').css({ "transition": "transform 0.5s" });
      $('#' + '1_img').css({ "transform": "rotate(0deg)" });
      $('#post1').collapse('hide')
      $('#phonetopdiv').css({ "height": "inherit" });
      this.diolog_state = false
      $('body').css("overflow-y", "auto");
    }

    var searchDateB: Date = new Date(this.Search_FormCondition.DateB.toString())
    var searchDateE: Date = new Date(this.Search_FormCondition.DateE.toString())
    if (searchDateB > searchDateE) {
      alert('結束日不得大於起始日')
    } else if (void_MonthDiff(searchDateB, searchDateE) > 3) {
      alert('查詢起訖區間"月份"不得超過三個月')
    } else {
      CanSearch = true
    }
    return CanSearch
  }


  ngAfterViewInit(): void {
    this.formEvent_TopDivGoTop;
    this.formEvent_WindowResize;
    this.windowSize()
  }

  onCheckCollapseIn() {
    //確認是否收合
    if ($('#id1').hasClass('collapsed')) {
      $('#' + '1_text').text('收合查詢選單')
      $('#' + '1_img').css({ "transition": "transform 0.5s" });
      $('#' + '1_img').css({ "transform": "rotate(-180deg)" });
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

      this.diolog_state = true
      $('body').css("overflow-y", "hidden");
    } else {
      $('#chooseEmpdialog').modal('hide')
      $('#chooseDeptdialog').modal('hide')
      $('#' + '1_text').text('展開查詢選單')
      $('#' + '1_img').css({ "transition": "transform 0.5s" });
      $('#' + '1_img').css({ "transform": "rotate(0deg)" });
      $('#showFormPalce').addClass('showForm_closeDialog');
      $('#showFormPalce').removeClass('showForm_openDialog');
      document.getElementById("phonetopdiv").style.height = '90px';
      this.diolog_state = false
      $('body').css("overflow-y", "auto");

    }
  }

  formEvent_WindowResize = fromEvent(window, 'resize')
    //視窗大小改變時，修正width:800~1024的phonediv寬度及位置
    .pipe(debounceTime(0))
    .subscribe((event) => {
      if (this.isSearch) {
        this.TopresizeNav();
        this.windowSize()
      } else {
        if (window.outerWidth > 800) {
          document.getElementById("phonetopdiv").style.position = 'unset';
        } else {

        }

      }
    })
  windowSize() {

    if (this.isSearch && window.outerWidth < 800) {

      $('#chooseEmpdialog').modal('hide')
      $('#chooseDeptdialog').modal('hide')
      if ($('#chooseEmpdialog').hasClass('modal in') || $('#chooseDeptdialog').hasClass('modal in')) {
        document.getElementById("phonetopdiv").style.position = 'unset';
      } else {
        document.getElementById("phonetopdiv").style.position = 'fixed';
      }
      document.getElementById("phonetopdiv").style.height = '90px';
      // document.getElementById("phonetopdiv").style.height = '400px';
      document.getElementById("phonetopdiv").style.overflowY = 'auto';

      $('#' + '1_text').text('展開查詢選單')
      $('#' + '1_img').css({ "transition": "transform 0.5s" });
      $('#' + '1_img').css({ "transform": "rotate(0deg)" });
      $('#post1').collapse('hide')
      document.getElementById("id1").style.visibility = 'visible'
      // $('#id1').css({ "display": "block" });
      $("#showP_margin").addClass("P_margin");

      this.diolog_state = false
      $('body').css("overflow-y", "auto");
    } else {

      document.getElementById("phonetopdiv").style.position = 'unset';
      document.getElementById("id1").style.visibility = 'hidden';
      // $('#id1').css({ "display": "none" });   
      $("#showP_margin").removeClass("P_margin");
      $('#post1').collapse('show')
      document.getElementById("phonetopdiv").style.overflowY = 'unset';
      document.getElementById("phonetopdiv").style.height = ' 100%';
      $('#' + '1_text').text('收合查詢選單')
      $('#' + '1_img').css({ "transition": "transform 0.5s" });
      $('#' + '1_img').css({ "transform": "rotate(-180deg)" });
      this.diolog_state = false
      $('body').css("overflow-y", "auto");
    }
  }
  hideSearchDialog() {
    document.getElementById("phonetopdiv").style.position = 'fixed';
    document.getElementById("phonetopdiv").style.height = '90px';
    // document.getElementById("phonetopdiv").style.height = '400px';
    document.getElementById("phonetopdiv").style.overflowY = 'auto';

    $('#' + '1_text').text('展開查詢選單')
    $('#' + '1_img').css({ "transition": "transform 0.5s" });
    $('#' + '1_img').css({ "transform": "rotate(0deg)" });
    $('#post1').collapse('hide')
    document.getElementById("id1").style.visibility = 'visible';
    // $('#id1').css({ "display": "block" });  
    $("#showP_margin").addClass("P_margin");

    this.diolog_state = false
    $('body').css("overflow-y", "auto");

  }
  formEvent_TopDivGoTop = fromEvent(window, 'scroll')
    //scroll向下拖拉把藍色區塊副標題蓋住
    .pipe(debounceTime(0)) //當使用者在0.01秒內沒動作就執行
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
    this.CanSerchMore = false
    if (GetFlowView.FormCode == 'Abs') {

      this.LoadingPage.show()
      this.GetApiDataServiceService.getWebApiData_GetFlowViewAbs(GetFlowView)
        .pipe(takeWhile(() => this.api_subscribe))
        .subscribe(
          (GetFlowViewAbsGetApiData: GetFlowViewAbsGetApiDataClass[]) => {
            this.getApiVaData = GetFlowViewAbsGetApiData
            this.showForm(GetFlowView.FormCode)
            this.LoadingPage.hide()
          }, error => {
            this.LoadingPage.hide()
          }
        )

    } else if (GetFlowView.FormCode == 'Absc') {
      this.LoadingPage.show()
      this.GetApiDataServiceService.getWebApiData_GetFlowViewAbsc(GetFlowView)
        .pipe(takeWhile(() => this.api_subscribe))
        .subscribe(
          (GetFlowViewAbscGetApiData: GetFlowViewAbscGetApiDataClass[]) => {
            this.getApiDelData = GetFlowViewAbscGetApiData
            this.showForm(GetFlowView.FormCode)
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
            this.showForm(GetFlowView.FormCode)
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
            this.showForm(GetFlowView.FormCode)
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
            this.showForm(GetFlowView.FormCode)
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
            this.showForm(GetFlowView.FormCode)
            this.LoadingPage.hide()
          }, error => {
            this.LoadingPage.hide()
          }
        )
    }
  }



  getSearchFlowForm_Dept(GetFlowViewDept: GetFlowViewDeptClass) {
    // console.log(GetFlowView)

    this.LoadingPage.show()
    this.isSearch = false
    if (GetFlowViewDept.FormCode == 'Abs') {

      this.LoadingPage.show()
      this.GetApiDataServiceService.getWebApiData_GetFlowViewAbsByDept(GetFlowViewDept)
        .pipe(takeWhile(() => this.api_subscribe))
        .subscribe(
          (GetFlowViewAbsGetApiData: GetFlowViewAbsGetApiDataClass[]) => {
            this.getApiVaData = GetFlowViewAbsGetApiData
            this.showForm(GetFlowViewDept.FormCode)
            if (GetFlowViewAbsGetApiData.length > 0) {
              this.CanSerchMore = true
            } else {
              this.CanSerchMore = false
            }
            this.LoadingPage.hide()
          }
        )

    } else if (GetFlowViewDept.FormCode == 'Absc') {
      this.LoadingPage.show()
      this.GetApiDataServiceService.getWebApiData_GetFlowViewAbscByDept(GetFlowViewDept)
        .pipe(takeWhile(() => this.api_subscribe))
        .subscribe(
          (GetFlowViewAbscGetApiData: GetFlowViewAbscGetApiDataClass[]) => {
            this.getApiDelData = GetFlowViewAbscGetApiData
            this.showForm(GetFlowViewDept.FormCode)
            if (GetFlowViewAbscGetApiData.length > 0) {
              this.CanSerchMore = true
            } else {
              this.CanSerchMore = false
            }
            this.LoadingPage.hide()
          }
        )
    } else if (GetFlowViewDept.FormCode == 'Card') {

      this.GetApiDataServiceService.getWebApiData_GetFlowViewCardByDept(GetFlowViewDept)
        .pipe(takeWhile(() => this.api_subscribe))
        .subscribe(
          (GetFlowViewCardGetApiData: GetFlowViewCardGetApiDataClass[]) => {
            this.getApiForgetData = GetFlowViewCardGetApiData
            this.showForm(GetFlowViewDept.FormCode)
            if (GetFlowViewCardGetApiData.length > 0) {
              this.CanSerchMore = true
            } else {
              this.CanSerchMore = false
            }
            this.LoadingPage.hide()
          }
        )
    } else if (GetFlowViewDept.FormCode == 'ShiftRote') {

      this.GetApiDataServiceService.getWebApiData_GetFlowViewShiftRoteByDept(GetFlowViewDept)
        .pipe(takeWhile(() => this.api_subscribe))
        .subscribe(
          (GetFlowViewShiftRoteGetApiData: GetFlowViewShiftRoteGetApiDataClass[]) => {
            this.getApiShiftRoteData = GetFlowViewShiftRoteGetApiData
            this.showForm(GetFlowViewDept.FormCode)
            if (GetFlowViewShiftRoteGetApiData.length > 0) {
              this.CanSerchMore = true
            } else {
              this.CanSerchMore = false
            }
            this.LoadingPage.hide()
          }
        )
    } else if (GetFlowViewDept.FormCode == 'AttendUnusual') {

      this.GetApiDataServiceService.getWebApiData_GetFlowViewAttendUnusualByDept(GetFlowViewDept)
        .pipe(takeWhile(() => this.api_subscribe))
        .subscribe(
          (GetFlowSignAttendUnusualApiData: GetFlowViewAttendUnusualDataClass[]) => {
            this.getFlowSignAttendUnusualApiData =  JSON.parse(JSON.stringify(GetFlowSignAttendUnusualApiData)) 
            this.showForm(GetFlowViewDept.FormCode)
            if (GetFlowSignAttendUnusualApiData.length > 0) {
              this.CanSerchMore = true
            } else {
              this.CanSerchMore = false
            }
            this.LoadingPage.hide()
          }
        )
    } else if (GetFlowViewDept.FormCode == 'CardPatch') {

      this.GetApiDataServiceService.getWebApiData_GetFlowViewCardPatchByDept(GetFlowViewDept)
        .pipe(takeWhile(() => this.api_subscribe))
        .subscribe(
          (GetFlowViewCardGetApiData: GetFlowViewCardGetApiDataClass[]) => {
            this.getApiCardPatchData = GetFlowViewCardGetApiData
            this.showForm(GetFlowViewDept.FormCode)
            if (GetFlowViewCardGetApiData.length > 0) {
              this.CanSerchMore = true
            } else {
              this.CanSerchMore = false
            }
            this.LoadingPage.hide()
          }
        )
    } 
  }


  // getMoreSearchFlowForm_Dept(GetFlowViewDept: GetFlowViewDeptClass) {
  //   // console.log(GetFlowView)

  //   this.LoadingPage.show()
  //   this.isSearch = false
  //   if (GetFlowViewDept.FormCode == 'Abs') {

  //     this.LoadingPage.show()
  //     this.GetApiDataServiceService.getWebApiData_GetFlowViewAbsByDept(GetFlowViewDept)
  //       .pipe(takeWhile(() => this.api_subscribe))
  //       .subscribe(
  //         (GetFlowViewAbsGetApiData: GetFlowViewAbsGetApiDataClass[]) => {
  //           if (GetFlowViewAbsGetApiData.length > 0) {
  //             for (let g of GetFlowViewAbsGetApiData) {
  //               this.getApiVaData.push(g)
  //             }
  //             // console.log(this.getApiVaData)
  //             this.CanSerchMore = true
  //           } else {
  //             this.CanSerchMore = false
  //             alert('無更多資料')
  //           }
  //           this.isSearch = true
  //           this.LoadingPage.hide()
  //         }, error => {
  //           this.LoadingPage.hide()
  //         }
  //       )

  //   } else if (GetFlowViewDept.FormCode == 'Absc') {
  //     this.LoadingPage.show()
  //     this.GetApiDataServiceService.getWebApiData_GetFlowViewAbscByDept(GetFlowViewDept)
  //       .pipe(takeWhile(() => this.api_subscribe))
  //       .subscribe(
  //         (GetFlowViewAbscGetApiData: GetFlowViewAbscGetApiDataClass[]) => {
  //           if (GetFlowViewAbscGetApiData.length > 0) {
  //             for (let g of GetFlowViewAbscGetApiData) {
  //               this.getApiDelData.push(g)
  //             }
  //             this.CanSerchMore = true
  //           } else {
  //             this.CanSerchMore = false
  //             alert('無更多資料')
  //           }
  //           this.isSearch = true
  //           this.LoadingPage.hide()
  //         }, error => {
  //           this.LoadingPage.hide()
  //         }
  //       )
  //   } else if (GetFlowViewDept.FormCode == 'Card') {

  //     this.GetApiDataServiceService.getWebApiData_GetFlowViewCardByDept(GetFlowViewDept)
  //       .pipe(takeWhile(() => this.api_subscribe))
  //       .subscribe(
  //         (GetFlowViewCardGetApiData: GetFlowViewCardGetApiDataClass[]) => {
  //           if (GetFlowViewCardGetApiData.length > 0) {
  //             for (let g of GetFlowViewCardGetApiData) {
  //               this.getApiForgetData.push(g)
  //             }
  //             this.CanSerchMore = true
  //           } else {
  //             this.CanSerchMore = false
  //             alert('無更多資料')
  //           }
  //           this.isSearch = true
  //           this.LoadingPage.hide()
  //         }, error => {
  //           this.LoadingPage.hide()
  //         }
  //       )
  //   } else if (GetFlowViewDept.FormCode == 'ShiftRote') {

  //     this.GetApiDataServiceService.getWebApiData_GetFlowViewShiftRoteByDept(GetFlowViewDept)
  //       .pipe(takeWhile(() => this.api_subscribe))
  //       .subscribe(
  //         (GetFlowViewShiftRoteGetApiData: GetFlowViewShiftRoteGetApiDataClass[]) => {

  //           if (GetFlowViewShiftRoteGetApiData.length > 0) {
  //             for (let g of GetFlowViewShiftRoteGetApiData) {
  //               this.getApiShiftRoteData.push(g)
  //             }
  //             this.CanSerchMore = true
  //           } else {
  //             this.CanSerchMore = false
  //             alert('無更多資料')
  //           }
  //           this.isSearch = true
  //           this.LoadingPage.hide()
  //         }, error => {
  //           this.LoadingPage.hide()
  //         }
  //       )
  //   }
  // }

  showForm(FormCode) {

    this.showSelectSearchForm = FormCode; //顯示查詢結果
    this.isSearch = true;//顯示查詢結果

    if (this.SearchVaFormComponent) {
      this.SearchVaFormComponent.onGoBackFunction();
    } else if (this.SearchForgetFormComponent) {
      this.SearchForgetFormComponent.onGoBackFunction();
    } else if (this.SearchDelFormComponent) {
      this.SearchDelFormComponent.onGoBackFunction();
    } else if (this.SearchChangeFormComponent) {
      this.SearchChangeFormComponent.onGoBackFunction();
    } else if (this.SearchAttendUnusualFormComponent) {
      this.SearchAttendUnusualFormComponent.onGoBackFunction();
    } else if (this.SearchCardPatchFormComponent) {
      this.SearchCardPatchFormComponent.onGoBackFunction();
    }
    this.TopresizeNav();
    this.windowSize()
  }

  // getEmpCode(emp: EmpArray[]) {
  //   this.Search_EmpArray = emp;
  //   // console.log(r)
  // }
  SearchVal: OutPutValClass
  HideCondition: boolean = false
  getSearhVal(OutPutVal: OutPutValClass) {
    this.SearchVal = JSON.parse(JSON.stringify(OutPutVal))
    if (this.SearchVal.chooseRadio == 3) {
      this.HideCondition = true
    } else {
      this.HideCondition = false
    }
  }
  getSearchFormCondition(flowcondition: GetFlowViewClass) {
    this.Search_FormCondition = flowcondition
    // console.log(q)
  }

  scrollTo(tag: string) {
    this.viewScroller.scrollToAnchor(tag);
    //tag=id連結位置
  }


}


