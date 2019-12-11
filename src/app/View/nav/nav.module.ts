import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NavRoutingModule } from './nav-routing.module';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatPaginatorIntl, MAT_DATE_LOCALE, MAT_DATE_FORMATS, NativeDateAdapter, DateAdapter } from '@angular/material';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatListModule } from '@angular/material/list';
// import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material';
import { MatRippleModule } from '@angular/material';
import { MatInputModule } from '@angular/material';
import { MatRadioModule } from '@angular/material/radio';
import { FileSaverModule } from 'ngx-filesaver';
import { NgxSelectModule } from 'ngx-select-ex';
import { LZStringModule, LZStringService } from 'ng-lz-string';

import { NavComponent } from 'src/app/View/nav/nav.component';
import { HomeComponent } from 'src/app/View/home/home.component';
import { DelformComponent } from 'src/app/View/allform/delform/delform.component';
import { ForgetformComponent } from 'src/app/View/allform/forgetform/forgetform.component';
import { ChangeformComponent } from 'src/app/View/allform/changeform/changeform.component';


import { GetApiDataServiceService } from 'src/app/Service/get-api-data-service.service';
import { GetApiUserService } from 'src/app/Service/get-api-user.service';

import { MatPaginatorIntlCro } from 'src/app/Sharemodel/my-paginator';
import { ForgetformWriteComponent } from 'src/app/View/allform/forgetform/forgetform-write/forgetform-write.component';
import { SharemodelModule } from 'src/app/Sharemodel/sharemodel.module';
import { OwnSearchComponent } from 'src/app/View/own-search/own-search.component';
import { SearchAttendanceComponent } from 'src/app/View/search-attendance/search-attendance.component';
import { PersonnelSearchComponent } from 'src/app/View/personnel-search/personnel-search.component';
import { AuthGuard } from 'src/app/_guards/auth.guard';

import { RemarksComponent } from 'src/app/View/remarks/remarks.component';
import { ExportExcelService } from 'src/app/Service/export-excel.service';

import { WriteremarksformComponent } from 'src/app/View/allform/writeremarksform/writeremarksform.component';
import { chcekdialogModule } from '../shareComponent/checkdialog/chcekdialog-module';
import { SearchkeydeptComponent } from '../shareComponent/searchkeydept/searchkeydept.component';
import { OrderByPipe } from 'src/app/UseVoid/order-by.pipe';
// import { CanapproviddayComponent } from '../canapprovidday/canapprovidday.component';
import { EditCanapproviddayComponent } from '../edit-canapprovidday/edit-canapprovidday.component';
import { ChangeNonShiftComponent } from '../allform/change-non-shift/change-non-shift.component';
import { ChangeRzComponent } from '../allform/change-rz/change-rz.component';

import { ChooseBaseOrDeptComponent } from '../shareComponent/choose-base-or-dept/choose-base-or-dept.component';
import { PersonnelSearchFormComponentComponent } from '../personnel-search-form-component/personnel-search-form-component.component';
// import { ReviewformServiceService } from 'src/app/Service/reviewform-service.service';
import { OwnSearchRoteComponent } from '../own-search-rote/own-search-rote.component';
import { PersonnelSearchRoteComponent } from '../personnel-search-rote/personnel-search-rote.component';
import { TreeModule } from 'angular-tree-component';
import { PersonnelSearchTreeviewComponent } from '../personnel-search-treeview/personnel-search-treeview.component';
import { PersonnelSearchSupervisorlVaRecordComponent } from '../personnel-search-supervisorl-va-record/personnel-search-supervisorl-va-record.component';
import { ChoosedeptComponent } from '../shareComponent/choosedept/choosedept.component';
import { TestGuard } from 'src/app/_guards/test.guard';
import { NewsShowAllComponent } from '../news-show-all/news-show-all.component';
import { NewsShowDetailComponent } from '../news-show-detail/news-show-detail.component';
import { NewsManageComponent } from '../news-manage/news-manage.component';
import { NewsDataEditComponent } from '../news-data-edit/news-data-edit.component';
import { QuillModule } from 'ngx-quill';
import { NewsAddComponent } from '../news-add/news-add.component';
import { NgxSpinnerModule } from 'ngx-spinner';
import { SlickCarouselModule } from 'ngx-slick-carousel';
import { TestWriteComponent } from 'src/app/test-write/test-write.component';
import { SurplusLeaveComponent } from '../surplus-leave/surplus-leave.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { DesignatedAuditorComponent } from '../designated-auditor/designated-auditor.component';
import { DeptAdministrativeComponent } from '../dept-administrative/dept-administrative.component';
import { AgentWriteComponent } from '../agent-write/agent-write.component';
import { HrDeptComponent } from '../hr-dept/hr-dept.component';
import { SignProxymanComponent } from '../sign-proxyman/sign-proxyman.component';

import { ExampleHeader } from '../../Service/datepickerHeader'
import { ChangeRzNRComponent } from '../allform/change-rz-nr/change-rz-nr.component';
import { ChangeTwoRComponent } from '../allform/change-two-r/change-two-r.component';
import { ChangeNonShiftSameComponent } from '../allform/change-non-shift-same/change-non-shift-same.component';
import { EmailContentEditComponent } from '../email-content-edit/email-content-edit.component';
import { ChangeTwoPTComponent } from '../allform/change-two-pt/change-two-pt.component';
import { RoleSettingComponent } from '../role-setting/role-setting.component';
import { PageRoleSettingComponent } from '../page-role-setting/page-role-setting.component';
import { PersonRoleSettingComponent } from '../person-role-setting/person-role-setting.component';

import { TreeviewModule } from 'ngx-treeview';
import { PersonnelSearchSurplusLeaveComponent } from '../personnel-search-surplus-leave/personnel-search-surplus-leave.component';
import { NgxFullCalendarModule } from 'ngx-fullcalendar';
import { DeptVaSearchComponent } from '../dept-va-search/dept-va-search.component';
import { DeptCalendarSearchComponent } from '../dept-calendar-search/dept-calendar-search.component';
import { UpdateFormInfoComponent } from '../update-form-info/update-form-info.component';
import { ErrorHandler } from 'src/app/Service/error_handler';
import { RequestInterceptor } from 'src/app/Service/http_interceptor';
import { SwitchUserComponent } from '../switch-user/switch-user.component';
import { SwitchUserService } from 'src/app/Service/switch-user.service';
import { LoginLogInfoComponent } from '../login-log-info/login-log-info.component';
import { EmailLogInfoComponent } from '../email-log-info/email-log-info.component';
import { ExampleHeaderMonth } from 'src/app/Service/datepickerHeaderMonth';
import { TimeoutInterceptor } from 'src/app/_guards/TimeoutInterceptor';
import { PersonnelSearchVaComponent } from '../personnel-search-va/personnel-search-va.component';
import { OtformComponent } from '../allform/otform/writeotform/otform.component';
import { SalarySearchComponent } from '../salary-search/salary-search.component';
import { OtformdetailComponent } from '../allform/otform/otformdetail/otformdetail.component';
import { RmStateFormComponent } from '../allform/rm-state-form/rm-state-form.component';
import { RmStateFormWriteComponent } from '../allform/rm-state-form/rm-state-form-write/rm-state-form-write.component';
import { CardPatchFormComponent } from '../allform/card-patch-form/card-patch-form.component';
import { CardPatchFormWriteComponent } from '../allform/card-patch-form/card-patch-form-write/card-patch-form-write.component';
import {NgxPrintModule} from 'ngx-print';

const MY_DATE_FORMATS = {
  parse: {
    dateInput: { month: 'short', year: 'numeric', day: 'numeric' },
  },
  display: {
    dateInput: 'input',
    monthYearLabel: { year: 'numeric', month: 'numeric' },
    dateA11yLabel: { year: 'numeric', month: 'long', day: 'numeric' },
    monthYearA11yLabel: { year: 'numeric', month: 'long' },
  }
};

export class MyDateAdapter extends NativeDateAdapter {
  format(date: Date, displayFormat: Object): string {
    if (displayFormat == "input") {
      let day = date.getDate();
      let month = date.getMonth() + 1;
      let year = date.getFullYear();
      return year + '/' + this._to2digit(month) + '/' + this._to2digit(day);
    } else {
      return date.toDateString();
    }
  }
  getDateNames(): string[] {
    const dateNames: string[] = [];
    for (let i = 0; i < 31; i++) {
      dateNames[i] = String(i + 1);
    }
    return dateNames;
  }

  private _to2digit(n: number) {
    return ('00' + n).slice(-2);
  }
}
@NgModule({
  imports: [
    CommonModule,
    NavRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MatSortModule,
    MatPaginatorModule,
    MatTableModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    MatListModule,
    // MatCheckboxModule,
    MatTooltipModule,
    MatRippleModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatInputModule,
    HttpClientModule,
    chcekdialogModule,
    FileSaverModule,
    NgxSelectModule,
    LZStringModule,
    SharemodelModule,
    QuillModule,
    TreeModule.forRoot(),
    NgxSpinnerModule,
    SlickCarouselModule,
    MatExpansionModule,
    MatRadioModule,
    TreeviewModule.forRoot(),

    NgxFullCalendarModule,
    NgxPrintModule

  ],
  declarations: [
    NavComponent,
    HomeComponent,
    DelformComponent,
    ForgetformComponent,
    ChangeformComponent,
    ChangeRzNRComponent,
    ForgetformWriteComponent,
    OtformComponent,
    CardPatchFormComponent,
    CardPatchFormWriteComponent,
    OwnSearchComponent,
    SearchAttendanceComponent,
    PersonnelSearchComponent,
    SearchkeydeptComponent,
    // SelectSignerComponent,
    RemarksComponent,
    WriteremarksformComponent,
    // CanapproviddayComponent,
    EditCanapproviddayComponent,
    ChangeNonShiftComponent,
    ChangeRzComponent,
    ChangeNonShiftSameComponent,
    ChangeTwoRComponent,
    OwnSearchRoteComponent,


    OrderByPipe,

    ChooseBaseOrDeptComponent,
    PersonnelSearchFormComponentComponent,
    PersonnelSearchRoteComponent,
    PersonnelSearchTreeviewComponent,
    PersonnelSearchSupervisorlVaRecordComponent,


    TestWriteComponent,

    ChoosedeptComponent,

    NewsShowAllComponent,
    NewsShowDetailComponent,
    NewsManageComponent,
    NewsDataEditComponent,
    NewsAddComponent,

    SurplusLeaveComponent,

    DesignatedAuditorComponent,
    DeptAdministrativeComponent,
    AgentWriteComponent,
    HrDeptComponent,
    SignProxymanComponent,
    ExampleHeader,
    ExampleHeaderMonth,
    EmailContentEditComponent,
    ChangeTwoPTComponent,
    RoleSettingComponent,
    PageRoleSettingComponent,
    PersonRoleSettingComponent,
    PersonnelSearchSurplusLeaveComponent,

    DeptVaSearchComponent,
    DeptCalendarSearchComponent,

    UpdateFormInfoComponent,
    SwitchUserComponent,
    LoginLogInfoComponent,
    EmailLogInfoComponent,
    
    SalarySearchComponent,
    PersonnelSearchVaComponent,
    OtformdetailComponent,
    RmStateFormComponent,
    RmStateFormWriteComponent,

  ],
  providers: [
    AuthGuard,
    TestGuard,
    GetApiDataServiceService,
    GetApiUserService,
    LZStringService,
    ExportExcelService,
    // ReviewformServiceService,
    MatDatepickerModule,
    SwitchUserService,
    { provide: DateAdapter, useClass: MyDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS },
    { provide: MAT_DATE_LOCALE, useValue: 'zh-tw' },
    { provide: MatPaginatorIntl, useClass: MatPaginatorIntlCro },

    ErrorHandler,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: RequestInterceptor,
      multi: true,
    },
    [{ provide: HTTP_INTERCEPTORS, useClass: TimeoutInterceptor, multi: true }]

  ],
  entryComponents: [
    ExampleHeader,
    ExampleHeaderMonth
  ],
})
export class NavModule { }
