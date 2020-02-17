import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OtFormComponent } from './writeotform/otform.component';
import { OtFormDetailComponent } from './otformdetail/otformdetail.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: "full",
    component: OtFormComponent,
    children: [
      // { path: '',component: NavComponent, pathMatch: 'full' },
    ]
  },
  {
    path: "OtFormDetailComponent",
    component: OtFormDetailComponent
  }
]
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OtFormMoudleRoutingModule { }
