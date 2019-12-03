import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { GetApiDataServiceService } from 'src/app/Service/get-api-data-service.service';
import { HttpClient } from '@angular/common/http';
import { void_LogoutPage, void_goLoginPage } from 'src/app/UseVoid/void_goLoginPage';
import { GetApiUserService } from 'src/app/Service/get-api-user.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ErrorStateService } from 'src/app/Service/error-state.service';

declare let $: any; //use jquery

@Component({
  selector: 'app-error-page',
  templateUrl: './error-page.component.html',
  styleUrls: ['./error-page.component.css']
})
export class ErrorPageComponent implements OnInit ,AfterViewInit{
  ngAfterViewInit(): void {
    $('div').removeClass('modal-backdrop in')
  }

  constructor(
    private ErrorStateService: ErrorStateService,
    private LoadingPage: NgxSpinnerService,
    private router:Router) { }

  errorState: number = 0 //1-沒權限，2-連線逾時
  ngOnInit() {
    this.errorState = this.ErrorStateService.errorState
    // this.LoadingPage.hide()
    if (this.errorState == 0) {
      this.relogin()
    }
  }
  relogin() {
    localStorage.removeItem('API_Token')
    // localStorage.removeItem('API_Code')
    // void_goLoginPage()
    this.router.navigateByUrl('/LoginComponent')
  }


  logout() {
    localStorage.removeItem('API_Token')
    this.router.navigateByUrl('/LoginComponent')
    // void_LogoutPage()
  }
}
