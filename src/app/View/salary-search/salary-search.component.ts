import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { interval } from 'rxjs';
import { map, takeWhile, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-salary-search',
  templateUrl: './salary-search.component.html',
  styleUrls: ['./salary-search.component.css']
})
export class SalarySearchComponent implements OnInit {

  constructor() { }

  time = 5
  get getTime() { return this.time }
  resetTime() {
    this.time = 5
  }
  time_subscribe = true;
  ngOnInit() {
    interval(1000)
    .pipe(
      map((x) => {
        if(this.time>1){
          this.time = this.time - 1
        }else if(this.time == 1){
          this.time = this.time - 1
          console.log('執行')
        }
      })
    ).toPromise();
  }

  firstPwFromGroup: FormGroup = new FormGroup({
    empID: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required),
    checkPassword: new FormControl('', Validators.required)
  })
  submit() {
    console.log()
  }
}
