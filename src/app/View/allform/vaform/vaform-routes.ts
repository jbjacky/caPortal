import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WritevaformComponent } from 'src/app/View/allform/vaform/writevaform/writevaform.component';
import { VaformdetailComponent } from 'src/app/View/allform/vaform/vaformdetail/vaformdetail.component';



const routes: Routes = [
    {
      path: "",
      redirectTo: "writevaform",
      pathMatch: "full"
    },
    {
      path: "writevaform",
      component: WritevaformComponent
    },
    {
      path: "vaformdetail",
      component: VaformdetailComponent
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
export class VaFormRoutingModule { }
