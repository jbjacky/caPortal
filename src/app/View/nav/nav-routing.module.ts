import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NavComponent } from 'src/app/View/nav/nav.component';

import { HomeComponent } from 'src/app/View/home/home.component';
//首頁
import { DelformComponent } from 'src/app/View/allform/delform/delform.component';
import { ChangeformComponent } from 'src/app/View/allform/changeform/changeform.component';
import { ForgetformComponent } from 'src/app/View/allform/forgetform/forgetform.component';
//電子簽核


import { OwnSearchComponent } from 'src/app/View/own-search/own-search.component';
import { SearchAttendanceComponent } from 'src/app/View/search-attendance/search-attendance.component';
import { PersonnelSearchComponent } from 'src/app/View/personnel-search/personnel-search.component';


import { SelectSignerComponent } from 'src/app/View/select-signer/select-signer.component';
import { AuthGuard } from 'src/app/_guards/auth.guard';
import { RemarksComponent } from 'src/app/View/remarks/remarks.component';
import { WriteremarksformComponent } from 'src/app/View/allform/writeremarksform/writeremarksform.component';
import { ChoosedeptComponent } from '../shareComponent/choosedept/choosedept.component';
import { SearchkeydeptComponent } from '../shareComponent/searchkeydept/searchkeydept.component';
import { ChoosebaseComponent } from '../shareComponent/choosebase/choosebase.component';
import { ChoosedatetimeSeComponent } from '../shareComponent/choosedatetime-se/choosedatetime-se.component';
import { CanapproviddayComponent } from '../canapprovidday/canapprovidday.component';
import { EditCanapproviddayComponent } from '../edit-canapprovidday/edit-canapprovidday.component';
import { ChangeNonShiftComponent } from '../allform/change-non-shift/change-non-shift.component';
import { ChangeRzComponent } from '../allform/change-rz/change-rz.component';
import { SearchForgetFormComponent } from '../shareComponent/search-forget-form/search-forget-form.component';
import { SearchFormComponent } from '../search-form/search-form.component';
import { ChooseBaseOrDeptComponent } from '../shareComponent/choose-base-or-dept/choose-base-or-dept.component';
import { PersonnelSearchFormComponentComponent } from '../personnel-search-form-component/personnel-search-form-component.component';
import { SharecalendarComponent } from '../shareComponent/sharecalendar/sharecalendar.component';
import { OwnSearchRoteComponent } from '../own-search-rote/own-search-rote.component';
import { PersonnelSearchRoteComponent } from '../personnel-search-rote/personnel-search-rote.component';
import { SearchDelDetailComponent } from '../shareComponent/search-del-detail/search-del-detail.component';
import { SearchForgetDetailComponent } from '../shareComponent/search-forget-detail/search-forget-detail.component';
import { PersonnelSearchTreeviewComponent } from '../personnel-search-treeview/personnel-search-treeview.component';
import { PersonnelSearchSupervisorlVaRecordComponent } from '../personnel-search-supervisorl-va-record/personnel-search-supervisorl-va-record.component';
import { SearchChangeDetailRRComponent } from '../shareComponent/search-change-detail-rr/search-change-detail-rr.component';
import { SearchChangeDetailRZComponent } from '../shareComponent/search-change-detail-rz/search-change-detail-rz.component';
import { SearchChangeDetailDRComponent } from '../shareComponent/search-change-detail-dr/search-change-detail-dr.component';
import { NewsShowDetailComponent } from '../news-show-detail/news-show-detail.component';
import { NewsShowAllComponent } from '../news-show-all/news-show-all.component';
import { NewsManageComponent } from '../news-manage/news-manage.component';
import { NewsDataEditComponent } from '../news-data-edit/news-data-edit.component';
import { NewsAddComponent } from '../news-add/news-add.component';
import { TestWriteComponent } from 'src/app/test-write/test-write.component';
import { FormConditionComponent } from '../shareComponent/form-condition/form-condition.component';
import { SurplusLeaveComponent } from '../surplus-leave/surplus-leave.component';
import { DesignatedAuditorComponent } from '../designated-auditor/designated-auditor.component';
import { DeptAdministrativeComponent } from '../dept-administrative/dept-administrative.component';
import { AgentWriteComponent } from '../agent-write/agent-write.component';
import { HrDeptComponent } from '../hr-dept/hr-dept.component';
import { SignProxymanComponent } from '../sign-proxyman/sign-proxyman.component';
import { ChangeRzNRComponent } from '../allform/change-rz-nr/change-rz-nr.component';
import { ChangeTwoRComponent } from '../allform/change-two-r/change-two-r.component';
import { ChangeNonShiftSameComponent } from '../allform/change-non-shift-same/change-non-shift-same.component';
import { EmailContentEditComponent } from '../email-content-edit/email-content-edit.component';
import { ChangeTwoPTComponent } from '../allform/change-two-pt/change-two-pt.component';
import { RoleSettingComponent } from '../role-setting/role-setting.component';
import { PageRoleSettingComponent } from '../page-role-setting/page-role-setting.component';
import { PersonRoleSettingComponent } from '../person-role-setting/person-role-setting.component';
import { PersonnelSearchSurplusLeaveComponent } from '../personnel-search-surplus-leave/personnel-search-surplus-leave.component';
import { DeptVaSearchComponent } from '../dept-va-search/dept-va-search.component';
import { DeptCalendarSearchComponent } from '../dept-calendar-search/dept-calendar-search.component';
import { ChoosebaselevelComponent } from '../shareComponent/choosebaselevel/choosebaselevel.component';
import { UpdateFormInfoComponent } from '../update-form-info/update-form-info.component';
import { SwitchUserComponent } from '../switch-user/switch-user.component';
import { LoginLogInfoComponent } from '../login-log-info/login-log-info.component';
import { EmailLogInfoComponent } from '../email-log-info/email-log-info.component';
import { DayRoteComponent } from '../shareComponent/day-rote/day-rote.component';
import { PersonnelSearchVaComponent } from '../personnel-search-va/personnel-search-va.component';
import { SalarySearchComponent } from '../salary-search/salary-search.component';
import { OtformComponent } from '../allform/otform/writeotform/otform.component';
import { RmStateFormComponent } from '../allform/rm-state-form/rm-state-form.component';
import { RmStateFormWriteComponent } from '../allform/rm-state-form/rm-state-form-write/rm-state-form-write.component';
import { CardPatchFormComponent } from '../allform/card-patch-form/card-patch-form.component';
import { OwnSearchCardTimeComponent } from '../own-search-card-time/own-search-card-time.component';
import { PersonnelSearchCardTimeComponent } from '../personnel-search-card-time/personnel-search-card-time.component';
import { WriteCardFormComponent } from '../allform/write-card-form/write-card-form.component';
import { SetSalaryTemplateComponent } from '../set-salary-template/set-salary-template.component';
import { SearchEmpInfoComponent } from '../search-emp-info/search-emp-info.component';

const routes: Routes = [
  {
    path: '',
    component: NavComponent,
    children: [
      { path: '', component: HomeComponent },
      { path: 'home', component: HomeComponent },
      // { path: '',component: NavComponent, pathMatch: 'full' },
      { path: 'NavComponent', component: NavComponent },
      // {
      //   path: 'vaform',
      //   loadChildren: () => VaFormModule
      // },
      {
        path: 'vaform', loadChildren: 'src/app/View/allform/vaform/vaform.module#VaformModule',
        canActivate: [AuthGuard],
      },

      //請假單
      {
        path: 'delform', component: DelformComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'changeform', component: ChangeformComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'forgetform', component: ForgetformComponent,
        canActivate: [AuthGuard],
      },
      //lazylodingtest
      { path: 'reviewform', loadChildren: 'src/app/View/allform/reviewform/reviewform.module#ReviewformModule' },

      // { path: 'reviewform', component: ReviewformComponent },
      // { path: 'reviewformdetailvacation', component: ReviewformDetailVacationComponent },
      {
        path: 'ChoosebaseComponent', component: ChoosebaseComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'ChoosebaselevelComponent', component: ChoosebaselevelComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'OwnSearchComponent', component: OwnSearchComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'SearchAttendanceComponent', component: SearchAttendanceComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'PersonnelSearchComponent', component: PersonnelSearchComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'ChoosedeptComponent', component: ChoosedeptComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'SearchkeydeptComponent', component: SearchkeydeptComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'SelectSignerComponent', component: SelectSignerComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'RemarksComponent', component: RemarksComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'WriteremarksformComponent', component: WriteremarksformComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'ChoosedatetimeSeComponent', component: ChoosedatetimeSeComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'CanapproviddayComponent', component: CanapproviddayComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'EditCanapproviddayComponent', component: EditCanapproviddayComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'ChangeNonShiftComponent', component: ChangeNonShiftComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'ChangeRzComponent', component: ChangeRzComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'SearchForgetFormComponent', component: SearchForgetFormComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'SearchFormComponent', component: SearchFormComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'ChooseBaseOrDeptComponent', component: ChooseBaseOrDeptComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'PersonnelSearchFormComponentComponent', component: PersonnelSearchFormComponentComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'SharecalendarComponent', component: SharecalendarComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'OwnSearchRoteComponent', component: OwnSearchRoteComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'PersonnelSearchRoteComponent', component: PersonnelSearchRoteComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'SearchDelDetailComponent', component: SearchDelDetailComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'SearchForgetDetailComponent', component: SearchForgetDetailComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'PersonnelSearchTreeviewComponent', component: PersonnelSearchTreeviewComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'PersonnelSearchSupervisorlVaRecordComponent', component: PersonnelSearchSupervisorlVaRecordComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'SearchChangeDetailRRComponent', component: SearchChangeDetailRRComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'SearchChangeDetailRZComponent', component: SearchChangeDetailRZComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'SearchChangeDetailDRComponent', component: SearchChangeDetailDRComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'NewsShowDetailComponent/:id', component: NewsShowDetailComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'NewsShowAllComponent', component: NewsShowAllComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'NewsManageComponent', component: NewsManageComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'NewsDataEditComponent/:id', component: NewsDataEditComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'NewsAddComponent', component: NewsAddComponent,
        canActivate: [AuthGuard],
      },

      {
        path: 'TestWriteComponent', component: TestWriteComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'FormConditionComponent', component: FormConditionComponent,
        canActivate: [AuthGuard],
      },

      {
        path: 'SurplusLeaveComponent', component: SurplusLeaveComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'DesignatedAuditorComponent', component: DesignatedAuditorComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'DeptAdministrativeComponent', component: DeptAdministrativeComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'AgentWriteComponent', component: AgentWriteComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'HrDeptComponent', component: HrDeptComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'SignProxymanComponent', component: SignProxymanComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'ChangeRzNRComponent', component: ChangeRzNRComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'ChangeTwoRComponent', component: ChangeTwoRComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'ChangeNonShiftSameComponent', component: ChangeNonShiftSameComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'EmailContentEditComponent', component: EmailContentEditComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'ChangeTwoPTComponent', component: ChangeTwoPTComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'RoleSettingComponent', component: RoleSettingComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'PageRoleSettingComponent', component: PageRoleSettingComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'PersonRoleSettingComponent', component: PersonRoleSettingComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'PersonnelSearchSurplusLeaveComponent', component: PersonnelSearchSurplusLeaveComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'DeptVaSearchComponent', component: DeptVaSearchComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'DeptCalendarSearchComponent', component: DeptCalendarSearchComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'UpdateFormInfoComponent', component: UpdateFormInfoComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'SwitchUserComponent', component: SwitchUserComponent,
        canActivate: [AuthGuard],
      },
      { path: 'LoginLogInfoComponent', component: LoginLogInfoComponent },
      {
        path: 'EmailLogInfoComponent', component: EmailLogInfoComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'PersonnelSearchVaComponent', component: PersonnelSearchVaComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'OtformComponent', component: OtformComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'SalarySearchComponent', component: SalarySearchComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'RmStateFormComponent', component: RmStateFormComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'CardPatchFormComponent', component: CardPatchFormComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'OwnSearchCardTimeComponent', component: OwnSearchCardTimeComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'PersonnelSearchCardTimeComponent', component: PersonnelSearchCardTimeComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'WriteCardFormComponent', component: WriteCardFormComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'SetSalaryTemplateComponent', component: SetSalaryTemplateComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'SearchEmpInfoComponent', component: SearchEmpInfoComponent,
        canActivate: [AuthGuard],
      }
      
    ]
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NavRoutingModule { }
