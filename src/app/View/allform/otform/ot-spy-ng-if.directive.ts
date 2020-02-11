import { Directive, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { GetApiUserService } from 'src/app/Service/get-api-user.service';


declare let $: any; //use jquery
@Directive({
  selector: '[appOtSpyNgIf]'
})
export class OtSpyNgIfDirective implements OnInit, AfterViewInit, OnDestroy {
  ngAfterViewInit(): void {
    this.GetApiUserService.startTimeDropper = $("#id_bt_starttime").timeDropper({
      format: 'HH:mm',
      autoswitch: false,
      mousewheel: true,
      setCurrentTime: false
    });
    // $("#id_bt_endtime").val('17:00');
    this.GetApiUserService.endTimeDropper = $("#id_bt_endtime").timeDropper({
      format: 'HH:mm',
      autoswitch: false,
      mousewheel: true,
      setCurrentTime: false
    });
  }
  ngOnInit(): void {
  }
  ngOnDestroy(): void {
  }
  constructor(
    private GetApiUserService: GetApiUserService, ) { }

}
