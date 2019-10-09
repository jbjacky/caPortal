import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { FormSign } from '../../allform/reviewform/reviewform-detail-delform/reviewform-detail-delform.component';
import { GetApiDataServiceService } from 'src/app/Service/get-api-data-service.service';
import { takeWhile } from 'rxjs/operators';
import { formatDateTime, getapi_formatTimetoString } from 'src/app/UseVoid/void_doFormatDate';

declare let $: any; //use jquery

@Component({
  selector: 'app-from-sign',
  templateUrl: './from-sign.component.html',
  styleUrls: ['./from-sign.component.css']
})
export class FromSignComponent implements OnInit , OnDestroy {
  ngOnDestroy(): void {
    // throw new Error("Method not implemented.");
    this.api_subscribe = false;
  }
  api_subscribe = true; //ngOnDestroy時要取消訂閱api的subscribe
  
  @Input() getProcessFlowID:number
  constructor(
    private GetApiDataServiceService: GetApiDataServiceService) { }

  showFormSign: FormSign[] = [];
  ngOnInit() {
    //歷程主管意見多筆資料
    this.GetApiDataServiceService.getWebApiData_GetFormSign(this.getProcessFlowID)
      .pipe(takeWhile(() => this.api_subscribe))
      .subscribe(
        (x_GetFormSigns: FormSign[]) => {
          this.showFormSign = []
          // console.log(x_GetFormSigns)
          for (let x_GetFormSign of x_GetFormSigns) {
            this.showFormSign.push({
              DeptNameC: x_GetFormSign.DeptNameC,
              EmpCode: x_GetFormSign.EmpCode,
              EmpID: x_GetFormSign.EmpID,
              EmpNameC: x_GetFormSign.EmpNameC,
              JobName: x_GetFormSign.JobName,
              Key1: x_GetFormSign.Key1,
              Key2: x_GetFormSign.Key2,
              NodeName: x_GetFormSign.NodeName,
              Note: x_GetFormSign.Note,
              ProcessFlowID: x_GetFormSign.ProcessFlowID,
              SignDate: formatDateTime(x_GetFormSign.SignDate).getDate + ' ' + getapi_formatTimetoString(formatDateTime(x_GetFormSign.SignDate).getTime),
              ToEmpID: x_GetFormSign.ToEmpID,
              ToEmpCode: x_GetFormSign.ToEmpCode,
              ToEmpNameC: x_GetFormSign.ToEmpNameC,
              ToDeptNameC: x_GetFormSign.ToDeptNameC,
              ToJobName: x_GetFormSign.ToJobName,
            })
          }
        },
        (error) => {
          // alert('與api取得資料錯誤，GetFormSign')
          // console.log(error)
        }
      )
  }

  onCheckCollapseInpostOpinions() {
    //確認是否收合歷程主管簽核意見
    if (!$('#' + 'mangText').hasClass('collapse in')) {
      $('#' + 'mangText' + '_text').text('收合')
      $('#' + 'mangText' + '_img').css({ "transition": "transform 0.5s" });
      $('#' + 'mangText' + '_img').css({ "transform": "rotate(-180deg)" });

    } else {
      $('#' + 'mangText' + '_text').text('展開')
      $('#' + 'mangText' + '_img').css({ "transition": "transform 0.5s" });
      $('#' + 'mangText' + '_img').css({ "transform": "rotate(0deg)" });
    }
  }

}
