import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { uploadFileClass } from 'src/app/Models/uploadFileClass';
import { GetSelectBaseClass } from 'src/app/Models/GetSelectBaseClass';
import { BehaviorSubject, Observable } from 'rxjs';
import { AttendCard } from 'src/app/Models/AttendCard';
import { GetApiDataServiceService } from 'src/app/Service/get-api-data-service.service';
import { takeWhile } from 'rxjs/operators';
import { ExampleHeader } from 'src/app/Service/datepickerHeader';
import { doFormatDate } from 'src/app/UseVoid/void_doFormatDate';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-rm-card-form-temp',
  templateUrl: './rm-card-form-temp.component.html',
  styleUrls: ['./rm-card-form-temp.component.css']
})
export class RmCardFormTempComponent implements OnInit , OnDestroy {
  exampleHeader = ExampleHeader //日期套件header
  ngOnDestroy(): void {
    this.api_subscribe = false;
  }
  api_subscribe = true; //ngOnDestroy時要取消訂閱api的subscribe
  @Input() getAttendCard: AttendCard;
   profileForm:FormGroup
  constructor(private GetApiDataServiceService: GetApiDataServiceService,) {
    this.profileForm = new FormGroup({
      'firstCardDate': new FormControl(),
      'firstCardTime': new FormControl(),
      'secondCardDate': new FormControl(),
      'secondCardTime': new FormControl(),
      'Cause': new FormControl(''),
      'UploadData': new FormControl(),
      'Note': new FormControl(),
      'Signer': new FormControl('')
    });
     
   }
  selectOnWorkArray = []
  selectOffWorkArray = []
  Cause = []
  UploadFile: uploadFileClass[] = []
  FlowDynamic_Base: GetSelectBaseClass;
  private Sub_onChangeSignMan$: BehaviorSubject<any> = new BehaviorSubject(0)
  onChangeSingMan$: Observable<any> = this.Sub_onChangeSignMan$; //切換選擇簽核人員使用
  chooseBase(GetSelectBase: GetSelectBaseClass) {
    this.FlowDynamic_Base = GetSelectBase
  }
  onSaveFile(event) {
    this.UploadFile = event
    // console.log(this.UploadFile)

  }
  ngOnInit() {
    this.Sub_onChangeSignMan$.next(this.getAttendCard.forget_man_code)
    this.GetApiDataServiceService.getWebApiData_GetCauseByForm()
      .pipe(takeWhile(() => this.api_subscribe))
      .subscribe(
        (data: any) => {
          // console.log(this.getAttendCard)
          for (let x of data) {
            this.Cause.push({ CauseID: x.CauseID, CauseNameC: x.CauseNameC })
          }

          this.selectOnWorkArray = []

          var calonDate = new Date(this.getAttendCard.AttendDate)
          this.selectOnWorkArray.push(doFormatDate(calonDate))
          calonDate.setDate(calonDate.getDate() - 1)
          this.selectOnWorkArray.push(doFormatDate(calonDate))

          var caloffDate = new Date(this.getAttendCard.AttendDate)
          this.selectOffWorkArray.push(doFormatDate(caloffDate))
          caloffDate.setDate(caloffDate.getDate() + 1)
          this.selectOffWorkArray.push(doFormatDate(caloffDate))

        }
      )
  }

}
