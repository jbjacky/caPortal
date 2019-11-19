import { Component, OnInit, OnChanges, SimpleChanges, AfterViewInit, NgZone, ViewChild, ElementRef, DoCheck, OnDestroy } from '@angular/core';
import { FormBuilder, Validators, FormControl, ValidatorFn, AbstractControl, AsyncValidatorFn, ValidationErrors, FormGroup } from '@angular/forms';
import { GetApiDataServiceService } from 'src/app/Service/get-api-data-service.service';
import { Observable, timer } from 'rxjs';
import { map, debounceTime, switchMap } from 'rxjs/operators';
import { resolve, reject } from 'q';
import { jbUserLoginClass, jbLoginDataClass } from 'src/app/Models/PostData_API_Class/jbUserLoginClass';


declare let $: any; //use jquery

@Component({
  selector: 'app-otform',
  templateUrl: './otform.component.html',
  styleUrls: ['./otform.component.css']
})
export class OtformComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild('Tname') Tnam: FormControl

  password
  otForm: FormGroup = new FormGroup({
    name: new FormControl('0004420', Validators.required, [this.getValidatorFn()]),
    address: new FormControl('', Validators.required),
  });
  otFormArray: Array<otFormClass>;

  get name() { return this.otForm.get('name'); }

  constructor(private GetApiDataServiceService: GetApiDataServiceService,
    private formBuilder: FormBuilder) {
      this.name.setValue('0001111')
  }
  ngAfterViewInit(): void {
  }
  ngOnDestroy(): void {
  }
  ngOnInit(): void {
  }
  onSubmit() {
    console.log(this.otForm.value)
  }
  resetFormGroup(){
    this.otForm.reset()
  }
  login() {
    var checkData = this.otForm.value
    var jbUserLogin: jbUserLoginClass = {
      Account: checkData.name,
      Password: checkData.address
    }
    this.GetApiDataServiceService.getWebApiData_jbLoggin(jbUserLogin)
    .subscribe(
      (x:jbLoginDataClass)=>{
        if(x.Pass){
         alert('pass') 
        }else{
          this.name.setErrors({
            errorEmpID:true
          })
        }
      }
    )
  }
  getValidatorFn(): AsyncValidatorFn {
    return (control: AbstractControl): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> => {
      let debounceTime = 1500; //milliseconds
      return timer(debounceTime).pipe(
        switchMap(() => {
          var req = this.GetApiDataServiceService.getWebApiData_GetBaseInfoDetail(control.value)
            .pipe(
              map(
                (serviceResponse: any[]) => {
                  console.log(serviceResponse)
                  if (serviceResponse.length > 0) {
                    return null
                  } else {
                    return { errorEmpID: 'errorEmpIDS' }
                  }
                })
            )
          console.log(req)
          return req
        })
      )
    };
  }

  checkUpdate() {
    if (this.Tnam.valid) {
      return false
    } else {
      return true
    }
  }
}

interface otFormClass {
  EmpID: string
  Note: string
}
export function forbiddenNameValidator(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    console.log(control.value)
    if (control.value == '644488') {
      return null
    } else {
      return { 'forbiddenName': control.value }
    }
  };
}

