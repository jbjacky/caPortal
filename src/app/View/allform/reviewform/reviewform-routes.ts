import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ReviewformComponent } from 'src/app/View/allform/reviewform/reviewform.component';
import { ReviewformDetailVacationComponent } from 'src/app/View/allform/reviewform/reviewform-detail-vacation/reviewform-detail-vacation.component';
import { ReviewformDetailDelformComponent } from './reviewform-detail-delform/reviewform-detail-delform.component';
import { ReviewformDetailForgetformComponent } from './reviewform-detail-forgetform/reviewform-detail-forgetform.component';
import { ReviewformDetailChangeformComponent } from './reviewform-detail-changeform/reviewform-detail-changeform.component';
import { ReviewformDetailChangeformRRComponent } from './reviewform-detail-changeform-rr/reviewform-detail-changeform-rr.component';
import { ReviewformDetailChangeformRZComponent } from './reviewform-detail-changeform-rz/reviewform-detail-changeform-rz.component';
import { ReviewformDetailAttendUnusualformComponent } from './reviewform-detail-attend-unusualform/reviewform-detail-attend-unusualform.component';
import { ReviewformDetailCardPatchformComponent } from './reviewform-detail-card-patchform/reviewform-detail-card-patchform.component';

const routes: Routes = [
    {
        path: "",
        component: ReviewformComponent,
    },
    {
        path: "ReviewformDetailVacationComponent",
        component: ReviewformDetailVacationComponent,
    },
    
    {
        path: "ReviewformDetailDelformComponent",
        component: ReviewformDetailDelformComponent,
    },
    
    {
        path: "ReviewformDetailForgetformComponent",
        component: ReviewformDetailForgetformComponent,
    },
    {
        path: "ReviewformDetailChangeformComponent",
        component: ReviewformDetailChangeformComponent,
    },
    {
        path: "ReviewformDetailChangeformRRComponent",
        component: ReviewformDetailChangeformRRComponent,
    },
    {
        path: "ReviewformDetailChangeformRZComponent",
        component: ReviewformDetailChangeformRZComponent,
    },
    {
        path: "ReviewformDetailAttendUnusualformComponent",
        component: ReviewformDetailAttendUnusualformComponent,
    },
    {
        path: "ReviewformDetailCardPatchformComponent",
        component: ReviewformDetailCardPatchformComponent,
    },
    
];

@NgModule({
    imports: [
        RouterModule.forChild(routes),

    ],
    exports: [
        RouterModule
    ]
})
export class ReviewFormRoutingModule { }
