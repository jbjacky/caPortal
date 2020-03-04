import { Component, OnInit, OnDestroy } from '@angular/core';
import { GetApiDataServiceService } from 'src/app/Service/get-api-data-service.service';
import { takeWhile } from 'rxjs/operators';
import { OTCheckListGetApiDataClass } from 'src/app/Models/OTCheckListGetApiDataClass';
import { MidifyPassWordGetApiClass } from 'src/app/Models/PostData_API_Class/MidifyPassWordGetApiClass';
import { Router } from '@angular/router';

declare let $: any; //use jquery
@Component({
  selector: 'app-edit-password',
  templateUrl: './edit-password.component.html',
  styleUrls: ['./edit-password.component.css']
})
export class EditPasswordComponent implements OnInit, OnDestroy {
  ngOnDestroy(): void {
    // throw new Error("Method not implemented.");
    this.api_subscribe = false;
  }
  api_subscribe = true; //ngOnDestroy時要取消訂閱api的subscribe
  oldPassword:string;
  newPassword:string;
  checknewPassword:string;
  constructor(private router: Router,
    private GetApiDataServiceService: GetApiDataServiceService,) { }

  ngOnInit() {
  }
  
  MidifyPassWord(){
    var MidifyPassWordGetApi:MidifyPassWordGetApiClass={
      "OldPassWord"  : this.oldPassword ,
      "NewPassWord"  : this.newPassword  
    }
    this.GetApiDataServiceService.getWebApiData_MidifyPassWord(MidifyPassWordGetApi)
      .pipe(takeWhile(() => this.api_subscribe))
      .subscribe(
        (x: OTCheckListGetApiDataClass) => {
          if (!x.isOK) {
            var e = ''
            for (let err of x.ErrorMsg) {
              e = e + err
            }
            alert(e);
          }else{
            alert('密碼修改成功! 請重新登入。');
            this.signOut();
          }
        }
      )
  }
  signOut() {
    this.router.navigateByUrl('/LoginComponent')
    localStorage.removeItem('API_Token')
    // this.GetApiDataServiceService.getWebApiData_DeleteAuthToken()
    //   .pipe(takeWhile(() => this.api_subscribe))
    //   .subscribe(
    //     x => {
    //       void_LogoutPage()
    //     }
    //   )
  }

  checkMidifyPassWord(){
    if(!this.oldPassword){
      alert('請輸入密碼')
    }else if(!this.newPassword){
      alert('請輸入新密碼')
    }else if(this.newPassword != this.checknewPassword){
      alert('新密碼與確認密碼不相同')
    }else{
      $("#checksenddialog").modal('show')
    }
  }

}
