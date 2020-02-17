import { NgModule, ErrorHandler} from '@angular/core';
import { CommonModule } from '@angular/common';

import { OtFormMoudleRoutingModule } from './ot-form-moudle-routing.module';
import { OtFormComponent } from './writeotform/otform.component';
import { OtFormTempComponent } from './ot-form-temp/ot-form-temp.component';
import { OtFormDetailComponent } from './otformdetail/otformdetail.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FileSaverModule } from 'ngx-filesaver';
import { NgxSelectModule } from 'ngx-select-ex';
import { NgxSpinnerModule } from 'ngx-spinner';
import { TextMaskModule } from 'angular2-text-mask';
import { SharemodelModule } from 'src/app/Sharemodel/sharemodel.module';
import { RequestInterceptor } from 'src/app/Service/http_interceptor';
import { AsyncValidEmpIDDirective } from 'src/app/ShareDirective/ansyc-valid-emp-id.directive';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatDatepickerModule,
    FileSaverModule,
    TextMaskModule,
    NgxSelectModule,
    NgxSpinnerModule,
    SharemodelModule,
    OtFormMoudleRoutingModule
  ],
  declarations: [
    // FileuploadbuttonComponent,
    OtFormComponent,
    OtFormTempComponent,
    OtFormDetailComponent,
    AsyncValidEmpIDDirective
  ],
  providers: [
    ErrorHandler,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: RequestInterceptor,
      multi: true,
    }
  ],
})
export class OtFormMoudle { }
