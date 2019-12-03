import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { GetApiDataServiceService } from 'src/app/Service/get-api-data-service.service';
import { GetApiUserService } from 'src/app/Service/get-api-user.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { CaUserClass } from 'src/app/Models/CaUserClass';
import { takeWhile } from 'rxjs/operators';
import { doFormatDate } from 'src/app/UseVoid/void_doFormatDate';
import { IsLoginPassGetApiClass } from 'src/app/Models/PostData_API_Class/IsLoginPassGetApiClass';
import { void_LogoutPage } from 'src/app/UseVoid/void_goLoginPage';
import { ErrorStateService } from 'src/app/Service/error-state.service';

@Component({
  selector: 'app-link-outhpage',
  templateUrl: './link-outhpage.component.html',
  styleUrls: ['./link-outhpage.component.css']
})
export class LinkOuthpageComponent implements OnInit, OnDestroy {
  ngOnDestroy(): void {
    this.api_subscribe = false;
  }
  api_subscribe = true; //ngOnDestroy時要取消

  constructor(private route: Router,
    private ErrorStateService: ErrorStateService,
    private GetApiDataServiceService: GetApiDataServiceService,
    private LoadingPage: NgxSpinnerService) { }

  ngOnInit() {
    var urlQuery: any = this.queryString()
    // console.log(urlQuery.token)
    this.regitToken(urlQuery)
  }


  regitToken(urlQuery) {
    //auth
    this.LoadingPage.show()
    if (urlQuery.token) {
      // console.log(urlQuery.token)

      localStorage.setItem('API_Token', urlQuery.token)
      this.GetApiDataServiceService.getWebApiData_GetAuthToken()
        .pipe(takeWhile(() => this.api_subscribe))
        .subscribe(
          (x: CaUserClass) => {
            this.route.navigateByUrl('/nav')
          }
        )
    } else {
      this.LoadingPage.hide()
      this.ErrorStateService.errorState = 5
      this.route.navigateByUrl('/ErrorPageComponent')
    }
  }

  queryString() {
    // This function is anonymous, is executed immediately and
    // the return value is assigned to QueryString!
    var query_string = {};
    var query = window.location.search.substring(1);
    var vars = query.split("&");
    for (var i = 0; i < vars.length; i++) {
      var pair = vars[i].split("=");
      // If first entry with this name
      if (typeof query_string[pair[0]] === "undefined") {
        query_string[pair[0]] = pair[1];
        // If second entry with this name
      } else if (typeof query_string[pair[0]] === "string") {
        var arr = [query_string[pair[0]], pair[1]];
        query_string[pair[0]] = arr;
        // If third or later entry with this name
      } else {
        query_string[pair[0]].push(pair[1]);
      }
    }
    return query_string;
  }

}
