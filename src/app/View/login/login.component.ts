import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { UUID } from 'angular2-uuid';
import { GetApiDataServiceService } from 'src/app/Service/get-api-data-service.service';
import { CaUserClass } from 'src/app/Models/CaUserClass';
import { NgxSpinnerService } from 'ngx-spinner';
import { void_goLoginPage } from 'src/app/UseVoid/void_goLoginPage';
import { SettingClass } from 'src/app/Models/SettingClass';
import { takeWhile } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { jbLoginDataClass, jbUserLoginClass } from 'src/app/Models/PostData_API_Class/jbUserLoginClass';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { VALID } from '@angular/forms/src/model';
// declare var OAuthPath
// declare var _client_id
// declare var _redirect_uri_LinkOuthpage

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit, OnDestroy {
  ngOnDestroy(): void {
    this.api_subscribe = false;
  }
  api_subscribe: boolean = true
  loginFromGroup: FormGroup = new FormGroup({
    account: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required)
  })
  constructor(private route: Router,
    private LoadingPage: NgxSpinnerService,
    private http: HttpClient,
    private GetApiDataServiceService: GetApiDataServiceService
  ) { 
  }
  @ViewChild('user_password') user_password: ElementRef;
  get account() { return this.loginFromGroup.get('account') }
  get accountError_required() { return this.loginFromGroup.get('account').hasError('required'); }
  get password() { return this.loginFromGroup.get('password') }
  get passwordError_required() { return this.loginFromGroup.get('password').hasError('required'); }
  ngOnInit() {
    // this.user_password.nativeElement.addEventListener('keyup', function(event) {
    //   if (event.getModifierState("CapsLock")) {
    //     console.log('大寫')
    //   } else {
    //     console.log('小寫')
    //   }
    // });
    
    // this.LoadingPage.show()
    // if (localStorage.getItem('API_Token') &&
    //   localStorage.getItem('API_Code')) {
    //   this.route.navigate(['/CheckLoginPageComponent']);
    // } else {
    //   this.login()
    // }
  }

  login() {
    // void_goLoginPage();
    // console.log(this.GetApiDataServiceService.localUrl)
    if (this.loginFromGroup.status == 'VALID') {
      this.LoadingPage.show()
      var loginFromGroup = this.loginFromGroup.value
      var userLogin: jbUserLoginClass = {
        "Account": loginFromGroup.account.toString(),
        "Password": loginFromGroup.password.toString()
      }
      this.GetApiDataServiceService.getWebApiData_jbLoggin(userLogin)

        .pipe(takeWhile(() => this.api_subscribe))
        .subscribe(
          (jbLoginData: jbLoginDataClass) => {

            if (jbLoginData.Pass) {
              localStorage.setItem('API_Token', jbLoginData.EmpID)
              this.route.navigateByUrl('/nav')
            } else {
              alert('密碼輸入錯誤')
              this.LoadingPage.hide()
            }
          },errors=>{
            this.LoadingPage.hide()
            alert('api連線錯誤')
            alert(JSON.parse(JSON.stringify(userLogin)).toString())
            alert(JSON.parse(JSON.stringify(errors)).toString())
          }
        )
    }
  }

}
