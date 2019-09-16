import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { UUID } from 'angular2-uuid';
import { GetApiDataServiceService } from 'src/app/Service/get-api-data-service.service';
import { CaUserClass } from 'src/app/Models/CaUserClass';
import { NgxSpinnerService } from 'ngx-spinner';
import { void_goLoginPage } from 'src/app/UseVoid/void_goLoginPage';
import { SettingClass } from 'src/app/Models/SettingClass';
import { takeWhile } from 'rxjs/operators';
// declare var OAuthPath
// declare var _client_id
// declare var _redirect_uri_LinkOuthpage

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit{
  
  constructor(private route: Router,
    private LoadingPage: NgxSpinnerService,
  ) { }

  ngOnInit() {
    this.LoadingPage.show()
    if (localStorage.getItem('API_Token') &&
      localStorage.getItem('API_Code')) {
      this.route.navigate(['/CheckLoginPageComponent']);
    } else {
      this.login()
    }

  }

  login() {

    void_goLoginPage();

  }

}
