import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DesignPageComponent } from './design-page.component';



const routes: Routes = [
  { path: '',component: DesignPageComponent , pathMatch: 'full' }
];

@NgModule({
  exports: [
    RouterModule
  ],
  imports: [
    RouterModule.forChild(routes)
  ]
})
export class DesignPageRoutingModule { }
