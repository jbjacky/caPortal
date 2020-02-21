import { Directive, Input } from '@angular/core';
import { NG_ASYNC_VALIDATORS, AbstractControl, AsyncValidator, ValidationErrors, AsyncValidatorFn } from '@angular/forms';
import { Observable, timer } from 'rxjs';
import { switchMap, map, take } from 'rxjs/operators';
import { GetBaseInfoDetailClass } from '../Models/GetBaseInfoDetailClass';
import { GetApiDataServiceService } from '../Service/get-api-data-service.service';
import { GetApiUserService } from '../Service/get-api-user.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Directive({
  selector: '[appAsyncValidEmpID]',
  providers: [{ provide: NG_ASYNC_VALIDATORS, useExisting: AsyncValidEmpIDDirective, multi: true }],
  exportAs: 'AsyncValidEmpNameDirective'
})

/**
 * @todo 異步驗證input的工號是否正確 (Template-driven forms)
 * @author jacky
 */
export class AsyncValidEmpIDDirective implements AsyncValidator {
  public EmpName: string;
  constructor(private GetApiDataServiceService: GetApiDataServiceService,
    private GetApiUserService: GetApiUserService,
    private LoadingPage: NgxSpinnerService, ) { }

  validate(
    control: AbstractControl
  ): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> {
    let debounceTime = 1500; //milliseconds
    return this.getEmpIDAsyncValidator(debounceTime, control)
  }

  private getEmpIDAsyncValidator(debounceTime: number, control: AbstractControl): Promise<ValidationErrors> | Observable<ValidationErrors> {
    return timer(debounceTime).pipe(switchMap(() => {
      this.LoadingPage.show();
      var req
      if (!control.value) { 
        return { errorEmpNull: true };
      } else {
        req = this.GetApiDataServiceService.getWebApiData_GetBaseInfoDetail(control.value)
          .pipe(map((serviceResponse: GetBaseInfoDetailClass[]) => {
            this.LoadingPage.hide();
            if (serviceResponse.length > 0) {
              this.EmpName = serviceResponse[0].EmpNameC
              return null;
            }
            else {
              this.EmpName = ''
              return { errorEmpID: true };
            }
          }));
      }
      return req;
    }));
  }


}
