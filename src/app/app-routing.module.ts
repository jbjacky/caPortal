import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginComponent } from 'src/app/View/login/login.component';
import { ErrorPageComponent } from './View/error-page/error-page.component';
import { LinkOuthpageComponent } from './View/link-outhpage/link-outhpage.component';
import { CheckLoginPageComponent } from './View/check-login-page/check-login-page.component';


const routes: Routes = [
  { path: '',redirectTo:'LoginComponent' , pathMatch: 'full' },
  { path: 'nav', loadChildren: 'src/app/View/nav/nav.module#NavModule'},
  { path: 'LoginComponent', component: LoginComponent  },
  { path: 'LinkOuthpageComponent', component: LinkOuthpageComponent  },
  { path: 'ErrorPageComponent', component: ErrorPageComponent  },
  { path: 'CheckLoginPageComponent', component: CheckLoginPageComponent  },
  
];

@NgModule({
  exports: [
    RouterModule
  ],
  imports: [
    RouterModule.forRoot(routes, {
      scrollPositionRestoration: 'top',
      anchorScrolling: 'enabled',
      scrollOffset: [0, 64], // [x, y]回頂部按鈕設置，讓href到正確的位置,
      onSameUrlNavigation: 'reload'
    })
  ]
})
export class AppRoutingModule { }
