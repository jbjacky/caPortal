// import { registerLocaleData } from '@angular/common';
// import localezhHant from '@angular/common/locales/zh-Hant';
// registerLocaleData(localezhHant, 'zh-Hant');
import { NgModule, APP_INITIALIZER } from '@angular/core';
import { CommonModule, APP_BASE_HREF } from '@angular/common';
import { AppRoutingModule } from 'src/app/app-routing.module';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from 'src/app/app.component';
import { LoginComponent } from 'src/app/View/login/login.component';
import { FormsModule } from '@angular/forms';
import { ErrorPageComponent } from './View/error-page/error-page.component';
import { NgxSpinnerModule } from 'ngx-spinner';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { LinkOuthpageComponent } from './View/link-outhpage/link-outhpage.component';

import { DeviceDetectorModule } from 'ngx-device-detector';
import { RequestInterceptor } from './Service/http_interceptor';
import { ErrorHandler } from './Service/error_handler';
import { CheckLoginPageComponent } from './View/check-login-page/check-login-page.component';
import { RouteReuseStrategy } from '@angular/router';
import { AppRoutingCache } from './_guards/AppRoutingCache';
import { TimeoutInterceptor } from './_guards/TimeoutInterceptor';
import { ErrorStateService } from './Service/error-state.service';
import { MatSnackBarModule, MAT_SNACK_BAR_DATA } from '@angular/material';
@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    ErrorPageComponent,
    LinkOuthpageComponent,
    CheckLoginPageComponent,
  ],
  imports: [
    CommonModule,
    AppRoutingModule,
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    NgxSpinnerModule,
    HttpClientModule,
    DeviceDetectorModule.forRoot()

  ],
  providers: [
    ErrorStateService,
    ErrorHandler,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: RequestInterceptor,
      multi: true,
    },
    [{ provide: HTTP_INTERCEPTORS, useClass: TimeoutInterceptor, multi: true }],
    [ { provide: MAT_SNACK_BAR_DATA, useValue: {} }]
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }

