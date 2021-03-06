import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { GetApiDataServiceService } from './get-api-data-service.service';
import { GetAttendClass } from '../Models/PostData_API_Class/GetAttendClass';
import { doFormatDate, timeZone_tw } from '../UseVoid/void_doFormatDate';
import { GetAttendInfoClass } from '../Models/PostData_API_Class/GetAttendInfoClass';
import { showAttendClass } from '../Models/showAttendClass';
import { chinesenum } from '../UseVoid/void_chinesenumber';
import { GetBaseInfoDetailClass } from '../Models/GetBaseInfoDetailClass';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { CaUserClass } from '../Models/CaUserClass';

@Injectable({
  providedIn: 'root'
})
export class GetApiUserService {

  startTimeDropper:any
  endTimeDropper:any
  
  private store$: BehaviorSubject<GetBaseInfoDetailClass> = new BehaviorSubject<any>(0);
  counter$: Observable<GetBaseInfoDetailClass> = this.store$;
  //選擇當前操作人員、部門。

  private AllOneBaseDetail$: BehaviorSubject<GetBaseInfoDetailClass[]> = new BehaviorSubject<GetBaseInfoDetailClass[]>([]);
  AllOneBaseDetailcounter$: Observable<GetBaseInfoDetailClass[]> = this.AllOneBaseDetail$;
  //這個人員所有兼職多角色切換。
  // 634438
  // ReallyEmpID = ''//第一次登入系統的id
  secondTitle  = null
  constructor(private GetApiDataServiceService: GetApiDataServiceService, private router: Router,
    private LoadingPage: NgxSpinnerService) {
    // console.log(this.ReallyEmpID)
    // this.store$.next({ EmpCode: '051005', Name: '王O懿', Dept: '會計行政部', RoteNameC: '常日班', WorkHours: 8 })
    
    // if (localStorage.getItem('NowLoginUserID')) {
    //   this.GetApiDataServiceService.getWebApiData_GetBaseInfoDetail(localStorage.getItem('NowLoginUserID'))
    //     .subscribe(
    //       (GetBaseInfoDetail: GetBaseInfoDetailClass[]) => {
    //         // this.LoadingPage.show()
    //         // console.log(GetBaseInfoDetail)
    //         this.AllOneBaseDetail$.next(GetBaseInfoDetail)

    //         for (let BaseInfoDetail of GetBaseInfoDetail) {
    //           if (BaseInfoDetail.PosType == 'M') {
    //             this.store$.next(BaseInfoDetail)
    //           }
    //         }
    //       },
    //       error => {
    //         alert('與api連線異常，getWebApiData_GetBaseInfoDetail')
    //         // this.router.navigate(['ErrorPageComponent']);
    //         // this.LoadingPage.hide()
    //       }
    //     )
    // }
  }

  onChange(event) {
    //切換人員
    this.store$.next(event);
  }

  onAllChange(event) {
    //主要給切換部門的下拉選單用
    this.AllOneBaseDetail$.next(event);
  }




}