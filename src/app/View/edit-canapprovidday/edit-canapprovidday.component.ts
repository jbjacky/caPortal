import { Component, OnInit, NgZone, OnDestroy } from '@angular/core';
import { GetApiDataServiceService } from 'src/app/Service/get-api-data-service.service';
import { FormControl, Validators } from '@angular/forms';
import { SaveHoliDayFlowConditionClass } from 'src/app/Models/PostData_API_Class/SaveHoliDayFlowConditionClass';
import { GetApiUserService } from 'src/app/Service/get-api-user.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { takeWhile } from 'rxjs/operators';

@Component({
  selector: 'app-edit-canapprovidday',
  templateUrl: './edit-canapprovidday.component.html',
  styleUrls: ['./edit-canapprovidday.component.css']
})
export class EditCanapproviddayComponent implements OnInit , OnDestroy {
  ngOnDestroy(): void {
    this.api_subscribe = false;

  }

  api_subscribe = true; //ngOnDestroy時要取消

  bt_Edit = true;

  ngZone: NgZone = new NgZone({ enableLongStackTrace: true });
  constructor(
    private GetApiDataServiceService: GetApiDataServiceService,
    private GetApiUserService: GetApiUserService,
    private LoadingPage: NgxSpinnerService) { }

  HoliDayFlowConditionView: View[] = []

  NgxBaseSelectBox = [];

  SaveHoliDayFlowCondition: SaveHoliDayFlowConditionClass =
    {
      HoliDayCode: '',
      Tree: 1,
      AbsUseDay: 0,
      Note: "",
      KeyMan: ''
    };
  public selectControl = new FormControl();
  ngOnInit() {

    this.GetApiUserService.counter$.subscribe(x => {
      this.SaveHoliDayFlowCondition.KeyMan = x.EmpCode;
    })

    this.selectControl.valueChanges
      .subscribe((subscriptionTypeId: string) => {
        this.SaveHoliDayFlowCondition.HoliDayCode = subscriptionTypeId
        this.editDayShow()
      });
    this.LoadingPage.show()
    this.GetApiDataServiceService.getWebApiData_GetHoliDayFlowConditionView()
    .pipe(takeWhile(() => this.api_subscribe))
    .subscribe(
      (x: any) => {
        this.HoliDayFlowConditionView = x;
        this.LoadingPage.hide()
      },
      error => {
        // alert('與api連線異常，getWebApiData_GetHoliDayFlowConditionView')
        this.LoadingPage.hide()
      }
    )

    this.GetApiDataServiceService.getWebApiData_GetHoliDayByForm()
    .pipe(takeWhile(() => this.api_subscribe))
    .subscribe(
      (x: any) => {
        for (let y of x) {
          this.NgxBaseSelectBox.push({ HoliDayCode: y.HoliDayCode, HoliDayNameC: y.HoliDayCode + ' ' + y.HoliDayNameC });
        }
        this.NgxBaseSelectBox.sort((a,b)=>{
          
          return a.HoliDayCode - b.HoliDayCode
        })
        this.LoadingPage.hide()
      },
      error => {
        // alert('與api連線異常，getWebApiData_GetHoliDayByForm')
        this.LoadingPage.hide()
      }
    )
  }

  onSubmit() {
    if (this.SaveHoliDayFlowCondition.HoliDayCode) {
      this.LoadingPage.show()
      this.GetApiDataServiceService.getWebApiData_SaveHoliDayFlowCondition(this.SaveHoliDayFlowCondition)
      .pipe(takeWhile(() => this.api_subscribe))
      .subscribe(
        x => {
          // alert('修改完成\n' + JSON.stringify(this.SaveHoliDayFlowCondition, null, '\t'))
          this.LoadingPage.hide()
          this.GetApiDataServiceService.getWebApiData_GetHoliDayFlowConditionView()
          .pipe(takeWhile(() => this.api_subscribe))
          .subscribe(
            (x: any) => {
              this.HoliDayFlowConditionView = x;
      
              this.ngZone.run(() => { });
            }
          )
        },
        error => {
          // alert('與api連線異常，getWebApiData_SaveHoliDayFlowCondition')
          this.LoadingPage.hide()
        }
      )
    }
  }

  selectLevel(event) {
    this.SaveHoliDayFlowCondition.Tree = parseInt(event.target.value);
    this.editDayShow()
  }



  editDayShow() {
    for (let HoliDayFlowConditionView of this.HoliDayFlowConditionView) {
      if (this.SaveHoliDayFlowCondition.HoliDayCode == HoliDayFlowConditionView.HoliDayCode) {
        if (this.SaveHoliDayFlowCondition.Tree == 1) {
          this.SaveHoliDayFlowCondition.AbsUseDay = HoliDayFlowConditionView.Max1
          this.bt_Edit = true
          return
        } else if (this.SaveHoliDayFlowCondition.Tree == 2) {
          this.SaveHoliDayFlowCondition.AbsUseDay = HoliDayFlowConditionView.Max2
          this.bt_Edit = true
          return
        } else if (this.SaveHoliDayFlowCondition.Tree == 3) {
          this.SaveHoliDayFlowCondition.AbsUseDay = HoliDayFlowConditionView.Max3
          this.bt_Edit = true
          return
        }
      } else {
        this.SaveHoliDayFlowCondition.AbsUseDay = 0
        this.bt_Edit = false
      }
    }
  }

}
class View {
  HoliDayCode: string
  HoliDayNameC: string
  Max1: number
  Max2: number
  Max3: number
}

