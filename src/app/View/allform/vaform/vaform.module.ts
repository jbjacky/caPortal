import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { VaFormRoutingModule } from 'src/app/View/allform/vaform/vaform-routes'
import { WritevaformComponent } from 'src/app/View/allform/vaform/writevaform/writevaform.component';
import { VaformdetailComponent } from 'src/app/View/allform/vaform/vaformdetail/vaformdetail.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SpyngifDirective } from 'src/app/View/allform/vaform/spyngif.directive';
import { TextMaskModule } from 'angular2-text-mask';
import { SharemodelModule } from 'src/app/Sharemodel/sharemodel.module'
import { NgxSelectModule } from 'ngx-select-ex';
import { chcekdialogModule } from '../../shareComponent/checkdialog/chcekdialog-module';
import { ErrorHandler } from 'src/app/Service/error_handler';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { RequestInterceptor } from 'src/app/Service/http_interceptor';
import { TimeoutInterceptor } from 'src/app/_guards/TimeoutInterceptor';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    chcekdialogModule,
    VaFormRoutingModule,
    TextMaskModule,
    SharemodelModule,
    NgxSelectModule,
  ],
  declarations: [
    WritevaformComponent,
    VaformdetailComponent,
    //   SpyngifDirective,
  ],
  exports: [
    RouterModule
  ],
  providers: [

    ErrorHandler,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: RequestInterceptor,
      multi: true,
    },
    [{ provide: HTTP_INTERCEPTORS, useClass: TimeoutInterceptor, multi: true }]
  ],
})
export class VaformModule { }
