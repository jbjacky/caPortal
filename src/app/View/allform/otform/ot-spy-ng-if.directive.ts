import { Directive, OnInit, OnDestroy, AfterViewInit } from '@angular/core';


declare let $: any; //use jquery
@Directive({
  selector: '[appOtSpyNgIf]'
})
export class OtSpyNgIfDirective implements OnInit,AfterViewInit, OnDestroy {
  ngAfterViewInit(): void {
    $("#id_bt_starttime").timeDropper({
      format: 'HH:mm',
      autoswitch: false,
      mousewheel: true,
      setCurrentTime: false
    });
    $("#id_bt_endtime").timeDropper({
      format: 'HH:mm',
      autoswitch: false,
      mousewheel: true,
      setCurrentTime: false
    });
    $( "#id_bt_starttime" ).change(function() {
      $("#id_ipt_starttime").val($("#id_bt_starttime").val());
    });
    $( "#id_bt_endtime" ).change(function() {
      $("#id_ipt_endtime").val($("#id_bt_endtime").val());
    });
  }
  ngOnInit(): void {
    // throw new Error("Method not implemented.");
  }
  ngOnDestroy(): void {
    // throw new Error("Method not implemented.");
    $( "#id_bt_endtime").unbind( "change" );
    $( "#id_bt_starttime").unbind( "change" );
  }

  constructor() { }

}
