import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReviewFormRoutingModule } from 'src/app/View/allform/reviewform/reviewform-routes'
import { FormsModule } from '@angular/forms';
import { MatPaginatorIntl, MatPaginatorModule } from '@angular/material';
import { MatPaginatorIntlCro } from 'src/app/Sharemodel/my-paginator';

import { ReviewformComponent } from 'src/app/View/allform/reviewform/reviewform.component';
import { ReviewformDetailVacationComponent } from 'src/app/View/allform/reviewform/reviewform-detail-vacation/reviewform-detail-vacation.component';
import { chcekdialogModule } from '../../shareComponent/checkdialog/chcekdialog-module';
import { ReviewformDetailDelformComponent } from './reviewform-detail-delform/reviewform-detail-delform.component';
import { ReviewformDetailForgetformComponent } from './reviewform-detail-forgetform/reviewform-detail-forgetform.component';
import { ReviewformDetailChangeformComponent } from './reviewform-detail-changeform/reviewform-detail-changeform.component';
import { SharemodelModule } from 'src/app/Sharemodel/sharemodel.module';
import { ReviewformDetailChangeformRRComponent } from '../../../View/allform/reviewform/reviewform-detail-changeform-rr/reviewform-detail-changeform-rr.component';
import { ReviewformDetailChangeformRZComponent } from '../../../View/allform/reviewform/reviewform-detail-changeform-rz/reviewform-detail-changeform-rz.component';
import { ErrorHandler } from 'src/app/Service/error_handler';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { RequestInterceptor } from 'src/app/Service/http_interceptor';
import { TimeoutInterceptor } from 'src/app/_guards/TimeoutInterceptor';
import { ReviewformServiceService } from 'src/app/Service/reviewform-service.service';
import { ReviewformDetailAttendUnusualformComponent } from '../../../View/allform/reviewform/reviewform-detail-attend-unusualform/reviewform-detail-attend-unusualform.component';
import { ReviewformDetailCardPatchformComponent } from '../../../View/allform/reviewform/reviewform-detail-card-patchform/reviewform-detail-card-patchform.component';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    chcekdialogModule,
    MatPaginatorModule,
    ReviewFormRoutingModule,
    SharemodelModule

  ],
  declarations: [
    ReviewformComponent,
    ReviewformDetailVacationComponent,
    ReviewformDetailDelformComponent,
    ReviewformDetailForgetformComponent,
    ReviewformDetailChangeformComponent,
    ReviewformDetailChangeformRRComponent,
    ReviewformDetailChangeformRZComponent,
    ReviewformDetailAttendUnusualformComponent,
    ReviewformDetailCardPatchformComponent
  ],
  providers: [
    ReviewformServiceService,
    { provide: MatPaginatorIntl, useClass: MatPaginatorIntlCro },
    ErrorHandler,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: RequestInterceptor,
      multi: true,
    },
    [{ provide: HTTP_INTERCEPTORS, useClass: TimeoutInterceptor, multi: true }]
  ],
})
export class ReviewformModule { }
