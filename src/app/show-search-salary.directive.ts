import { Directive, OnInit, AfterViewInit } from '@angular/core';
import { ViewportScroller } from '@angular/common';
import { GetApiUserService } from './Service/get-api-user.service';

declare let $: any; //use jquery
@Directive({
  selector: '[appShowSearchSalary]'
})
export class ShowSearchSalaryDirective implements OnInit, AfterViewInit {
  ngAfterViewInit(): void {
    this.GetApiUserService.scrollTo()
  }
  ngOnInit(): void {
  }

  constructor(
    private GetApiUserService: GetApiUserService) { }

}

