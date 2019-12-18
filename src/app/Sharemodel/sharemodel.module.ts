import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule,ReactiveFormsModule }   from '@angular/forms';

import { NgxSelectModule } from 'ngx-select-ex';
import { LZStringModule, LZStringService } from 'ng-lz-string';
import { SelectSignerComponent } from 'src/app/View/select-signer/select-signer.component';
import { ChoosebaseComponent } from '../View/shareComponent/choosebase/choosebase.component';
import { FileuploadbuttonComponent } from '../View/shareComponent/fileuploadbutton/fileuploadbutton.component';
import { SerchkeybaseComponent } from '../View/shareComponent/serchkeybase/serchkeybase.component';
import { ChoosedatetimeSeComponent } from '../View/shareComponent/choosedatetime-se/choosedatetime-se.component';
import { TextMaskModule } from 'angular2-text-mask';
import { CanapproviddayComponent } from '../View/canapprovidday/canapprovidday.component';
import { SpyngifDirective } from '../View/allform/vaform/spyngif.directive';
import { SearchForgetFormComponent } from '../View/shareComponent/search-forget-form/search-forget-form.component';
import { SearchFormComponent } from '../View/search-form/search-form.component';
import { SearchDelFormComponent } from '../View/shareComponent/search-del-form/search-del-form.component';
import { SearchVaFormComponent } from '../View/shareComponent/search-va-form/search-va-form.component';
import { SharecalendarComponent } from '../View/shareComponent/sharecalendar/sharecalendar.component';
import { SearchVaDetailComponent } from '../View/shareComponent/search-va-detail/search-va-detail.component';
import { SearchDelDetailComponent } from '../View/shareComponent/search-del-detail/search-del-detail.component';
import { SearchForgetDetailComponent } from '../View/shareComponent/search-forget-detail/search-forget-detail.component';
import { SpyReformNgifDirective } from '../View/allform/reviewform/spy-reform-ngif.directive';
import { FileDownloadService } from '../Service/file-download.service';
import { SpyChangeformNgifDirective } from '../View/allform/changeform/spy-changeform-ngif.directive';
import { SearchChangeFormComponent } from '../View/shareComponent/search-change-form/search-change-form.component';
import { SearchChangeDetailRRComponent } from '../View/shareComponent/search-change-detail-rr/search-change-detail-rr.component';
import { SearchChangeDetailRZComponent } from '../View/shareComponent/search-change-detail-rz/search-change-detail-rz.component';
import { SearchChangeDetailDRComponent } from '../View/shareComponent/search-change-detail-dr/search-change-detail-dr.component';
import { QuillModule } from 'ngx-quill'
import { SafeHtmlPipe } from '../UseVoid/safeHtmlPipe';
import { MatPaginatorModule, MatSnackBarModule, MatIconModule, MatButtonModule, MatSortModule, MatTableModule } from '@angular/material';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { NgxSpinnerModule } from 'ngx-spinner';
import { FormConditionComponent } from '../View/shareComponent/form-condition/form-condition.component';
import { NgxMyDatePickerModule } from 'ngx-mydatepicker/dist/ngx-my-date-picker.module';
import { SimulationClalenderComponent } from '../View/shareComponent/simulation-clalender/simulation-clalender.component';
import { ChoosebaselevelComponent } from '../View/shareComponent/choosebaselevel/choosebaselevel.component';
import { SerchkeybaselevelComponent } from '../View/shareComponent/serchkeybaselevel/serchkeybaselevel.component';
import { ChoosebaseMAComponent } from '../View/shareComponent/choosebase-ma/choosebase-ma.component';
import { ChoosedeptMAComponent } from '../View/shareComponent/choosedept-ma/choosedept-ma.component';
import { SearchkeydeptMAComponent } from '../View/shareComponent/searchkeydept-ma/searchkeydept-ma.component';
import { SerchkeybaseMAComponent } from '../View/shareComponent/serchkeybase-ma/serchkeybase-ma.component';
import { AdminkeybaseComponent } from '../View/shareComponent/adminkeybase/adminkeybase.component';
import { ShowAttendDirective } from '../View/home/show-attend.directive';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { HolidayblockDirective } from '../View/allform/vaform/holidayblock.directive';
import { DayRoteComponent } from '../View/shareComponent/day-rote/day-rote.component';
import { FromSignComponent } from '../View/shareComponent/from-sign/from-sign.component';
import { FromSignTableComponent } from '../View/shareComponent/from-sign-table/from-sign-table.component';
import { SearchRoteSumComponent } from '../View/shareComponent/search-rote-sum/search-rote-sum.component';
import { RoteInfComponent } from '../View/shareComponent/rote-inf/rote-inf.component';
import { SussesSnackComponent } from '../View/shareComponent/snackbar/susses-snack/susses-snack.component';
import { ErrorSnackComponent } from '../View/shareComponent/snackbar/error-snack/error-snack.component';
import { SussesApproveSnackComponent } from '../View/shareComponent/snackbar/susses-approve-snack/susses-approve-snack.component';
import { ErrorApproveSnackComponent } from '../View/shareComponent/snackbar/error-approve-snack/error-approve-snack.component';
import { ErrorPutForwardSnackComponent } from '../View/shareComponent/snackbar/error-put-forward-snack/error-put-forward-snack.component';
import { SussesPutForwardSnackComponent } from '../View/shareComponent/snackbar/susses-put-forward-snack/susses-put-forward-snack.component';
import { SussesSendbackSnackComponent } from '../View/shareComponent/snackbar/susses-sendback-snack/susses-sendback-snack.component';
import { ErrorSendbackSnackComponent } from '../View/shareComponent/snackbar/error-sendback-snack/error-sendback-snack.component';
import { SearchAttendUnusualFormComponent } from '../View/shareComponent/search-attend-unusual-form/search-attend-unusual-form.component';
import { SearchAttendUnusualFormDetailComponent } from '../View/shareComponent/search-attend-unusual-form-detail/search-attend-unusual-form-detail.component';
import { SearchCardPatchFormComponent } from '../View/shareComponent/search-card-patch-form/search-card-patch-form.component';
import { SearchCardPatchDetailComponent } from '../View/shareComponent/search-card-patch-detail/search-card-patch-detail.component';
import { ShowSearchSalaryDirective } from '../show-search-salary.directive';
import { CardTimeTableComponent } from '../View/shareComponent/card-time-table/card-time-table.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgxSelectModule,
    LZStringModule,
    TextMaskModule,
    MatPaginatorModule,
    MatDatepickerModule,
    NgxSpinnerModule,
    NgxMyDatePickerModule.forRoot(),
    MatIconModule,
    MatButtonModule,
    MatSnackBarModule,
    MatCheckboxModule,
    MatSortModule,
    MatTableModule
  ],
  exports:[
    AdminkeybaseComponent,
    SerchkeybaseComponent,
    SerchkeybaselevelComponent,
    FileuploadbuttonComponent,
    ChoosebaseComponent,
    ChoosebaselevelComponent,
    SelectSignerComponent,
    ChoosedatetimeSeComponent,
    CanapproviddayComponent,
    TextMaskModule,
    SpyngifDirective,
    SpyReformNgifDirective,
    SearchForgetFormComponent,
    SearchFormComponent,
    SearchDelFormComponent,
    SearchVaFormComponent,
    SearchChangeFormComponent,
    SearchAttendUnusualFormComponent,
    SharecalendarComponent,
    SimulationClalenderComponent,
    SearchVaDetailComponent,
    SearchDelDetailComponent,
    SearchForgetDetailComponent,
    SearchChangeDetailRRComponent,
    SearchChangeDetailRZComponent,
    SearchChangeDetailDRComponent,
    SearchCardPatchFormComponent,
    SearchCardPatchDetailComponent,
    SearchAttendUnusualFormDetailComponent,
    SafeHtmlPipe,
    SpyChangeformNgifDirective,
    NgxSpinnerModule,
    MatDatepickerModule,
    FormConditionComponent,
    NgxMyDatePickerModule,
    MatSnackBarModule,
    MatIconModule,
    MatButtonModule,
    ChoosebaseMAComponent,
    ChoosedeptMAComponent,
    SearchkeydeptMAComponent,
    SerchkeybaseMAComponent,
    ShowAttendDirective,
    ShowSearchSalaryDirective,
    MatCheckboxModule,
    HolidayblockDirective,
    DayRoteComponent,
    FromSignComponent,
    FromSignTableComponent,
    SearchRoteSumComponent,
    RoteInfComponent,
    CardTimeTableComponent,
    SussesSnackComponent,
    ErrorSnackComponent,
    SussesApproveSnackComponent,
    ErrorApproveSnackComponent,
    ErrorPutForwardSnackComponent,
    SussesPutForwardSnackComponent,
    SussesSendbackSnackComponent,
    ErrorSendbackSnackComponent,
  ],
  providers: [
    LZStringService,
    FileDownloadService
  ],
  declarations: [
    AdminkeybaseComponent,
    SerchkeybaseComponent,
    SerchkeybaselevelComponent,
    ChoosebaseComponent,
    ChoosebaselevelComponent,
    FileuploadbuttonComponent,
    SelectSignerComponent,
    ChoosedatetimeSeComponent,
    CanapproviddayComponent,
    SpyngifDirective,
    SpyReformNgifDirective,
    SearchForgetFormComponent,
    SearchFormComponent,
    SearchDelFormComponent,
    SearchVaFormComponent,
    SearchChangeFormComponent,
    SearchAttendUnusualFormComponent,
    SearchCardPatchFormComponent,
    SearchCardPatchDetailComponent,
    SharecalendarComponent,
    SimulationClalenderComponent,
    SearchVaDetailComponent,
    SearchDelDetailComponent,
    SearchForgetDetailComponent,
    SearchChangeDetailRRComponent,
    SearchChangeDetailRZComponent,
    SearchChangeDetailDRComponent,
    SearchAttendUnusualFormDetailComponent,
    SpyChangeformNgifDirective,
    SafeHtmlPipe,
    FormConditionComponent,
    ChoosebaseMAComponent,
    ChoosedeptMAComponent,
    SearchkeydeptMAComponent,
    SerchkeybaseMAComponent,
    ShowAttendDirective,
    ShowSearchSalaryDirective,
    HolidayblockDirective,
    DayRoteComponent,
    FromSignComponent,
    FromSignTableComponent,
    SearchRoteSumComponent,
    RoteInfComponent,
    CardTimeTableComponent,
    
    SussesSnackComponent,
    ErrorSnackComponent,
    SussesApproveSnackComponent,
    ErrorApproveSnackComponent,
    ErrorPutForwardSnackComponent,
    SussesPutForwardSnackComponent,
    SussesSendbackSnackComponent,
    ErrorSendbackSnackComponent,

  ],
  entryComponents: [
    SussesSnackComponent,
    ErrorSnackComponent,
    SussesApproveSnackComponent,
    ErrorApproveSnackComponent,
    ErrorPutForwardSnackComponent,
    SussesPutForwardSnackComponent,
    SussesSendbackSnackComponent,
    ErrorSendbackSnackComponent,
  ],
})
export class SharemodelModule { }
