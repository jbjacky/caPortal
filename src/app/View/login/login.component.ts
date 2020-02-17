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
import { Path, Group, Text } from '@progress/kendo-drawing';
// declare var OAuthPath
// declare var _client_id
// declare var _redirect_uri_LinkOuthpage

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit, OnDestroy {
  public seriesData: number[] = [8.7, 1.4, 3.0, 2.5, 2.1,8.7, 1.4, 3.0, 2.5, 2.1, 2.1];
    public categories: string[] = ['生產部', '設備部', '品質部', '銷售部', '行政部','工藝部', '技術部', '人力資源部', '財務部', '採購部','總經辦'];
  public labels = {
    visible: true
  };
  public line = {
    width: 0
  };

  public majorGridLines = {
    visible: false
  }
  changeType:string = "column"
  show = false;
  saqe(){
    var average  = 0
    this.seriesData.forEach((x)=>{
      average += x
    })
    average  = average / this.seriesData.length
    console.log(average)
    this.plotValue = this.formatFloat(average,2)
    this.show  = true
  }
   formatFloat(num, pos)
  {
    var size = Math.pow(10, pos);
    return Math.round(num * size) / size;
  }
  
  public crosshair: any = {
      visible: true,
      tooltip: {
          visible: true,
          format: '#.##'
      }
  };
  private plotValue: number = 3;

  public onRender = (args: any): void => {
      const chart = args.sender;

      // get the axes
      const valueAxis = chart.findAxisByName("valueAxis");
      const categoryAxis = chart.findAxisByName("categoryAxis");

      // get the coordinates of the value at which the plot band will be rendered
      const valueSlot = valueAxis.slot(this.plotValue);

      // get the coordinates of the entire category axis range
      const range = categoryAxis.range();
      const categorySlot = categoryAxis.slot(range.min, range.max);

      // draw the plot band based on the found coordinates
      const line = new Path({
        stroke: {
          color: "red",
          width: 1,
          dashType:"dash"
        }
      }).moveTo(valueSlot.origin)
      .lineTo(categorySlot.topRight().x, valueSlot.origin.y);

      const label = new Text(`平均值${this.plotValue.toString()}`, [0, 0], {
        fill: {
          color: "red"
        },
        font: "14px sans"
      });
      const bbox = label.bbox();
      label.position([ categorySlot.topRight().x - bbox.size.width, valueSlot.origin.y - bbox.size.height ]);

      const group = new Group();
      group.append(line, label);

      // Draw on the Chart surface to overlay the series
      chart.surface.draw(group);
      
      // Or as a first element in the pane to appear behind the series
      // chart.findPaneByIndex(0).visual.insert(0, group);
  }




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
  // @ViewChild('user_password') user_password: ElementRef;
  get account() { return this.loginFromGroup.get('account') }
  get accountError_required() { return this.loginFromGroup.get('account').hasError('required'); }
  get password() { return this.loginFromGroup.get('password') }
  get passwordError_required() { return this.loginFromGroup.get('password').hasError('required'); }

  showLogin: boolean = false
  ngOnInit() {
    // this.user_password.nativeElement.addEventListener('keyup', function(event) {
    //   if (event.getModifierState("CapsLock")) {
    //     console.log('大寫')
    //   } else {
    //     console.log('小寫')
    //   }
    // });

    this.LoadingPage.show()
    if (localStorage.getItem('API_Token')) {
      // this.route.navigate(['/CheckLoginPageComponent']);
      this.route.navigate(['/nav']);
    } else {
      this.LoadingPage.hide()
      this.showLogin = true
    }
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
              localStorage.setItem('API_Token', jbLoginData.Token)
              this.route.navigateByUrl('/nav')
            } else {
              alert(jbLoginData.message)
              this.LoadingPage.hide()
            }
          }, errors => {
            this.LoadingPage.hide()
            alert('api連線錯誤')
            // alert(JSON.parse(JSON.stringify(userLogin)).toString())
            // alert(JSON.parse(JSON.stringify(errors)).toString())
          }
        )
    }
  }

}
