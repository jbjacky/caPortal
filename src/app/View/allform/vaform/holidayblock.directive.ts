import { Directive, OnInit, OnDestroy } from '@angular/core';

@Directive({
  selector: '[appHolidayblock]'
})
export class HolidayblockDirective  implements OnInit, OnDestroy{
  ngOnDestroy(): void {
  }
  ngOnInit(): void {
  }

  constructor() { }

}
