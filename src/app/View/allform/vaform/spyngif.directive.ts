import { Directive, OnDestroy, OnInit } from '@angular/core';
import { GetApiUserService } from 'src/app/Service/get-api-user.service';
declare let $: any; //use jquery
@Directive({
  selector: '[appSpyngif]',
})
export class SpyngifDirective implements OnInit, OnDestroy {

  constructor(
    private GetApiUserService: GetApiUserService,) { }

  ngOnInit(){
    var currentYear = new Date().getFullYear();

    // $( "#id_bt_startday" ).change(function() {
    //   $("#id_ipt_startday").val($("#id_bt_startday").val()) 
    //   $("#id_ipt_endday").val($("#id_bt_startday").val())
    // });
    // $( "#id_bt_endday" ).change(function() {
    //   $("#id_ipt_endday").val($("#id_bt_endday").val()) 
    // });
    // $( "#id_bt_starttime" ).change(function() {
    //   $("#id_ipt_starttime").val($("#id_bt_starttime").val());
    // });
    // $( "#id_bt_endtime" ).change(function() {
    //   $("#id_ipt_endtime").val($("#id_bt_endtime").val());
    // });
    
    // $('#id_bt_startday').dateDropper({    
    //   format: "Y/m/d",
    //   lang:'zh',
    //   large:true,
    //   minYear:currentYear-1,
    //   maxYear:currentYear+1,
    //   large_class:'picker-lg',
    //   bt_large:false
    // });
    // $('#id_bt_endday').dateDropper({
    //   format: "Y/m/d",
    //   lang:'zh',
    //   large:true,
    //   minYear:currentYear-1,
    //   maxYear:currentYear+1,
    //   large_class:'picker-lg',
    //   bt_large:false
    // });  
    //綁定顯示時間選擇器
    // $("#id_bt_starttime").val('08:00');
    this.GetApiUserService.startTimeDropper = $("#id_bt_starttime").timeDropper({
      format: 'HH:mm',
      autoswitch: false,
      mousewheel: true,
      setCurrentTime:false
    });
    // $("#id_bt_endtime").val('17:00');
    this.GetApiUserService.endTimeDropper = $("#id_bt_endtime").timeDropper({
      format: 'HH:mm',
      autoswitch: false,
      mousewheel: true,
      setCurrentTime:false
    });
  }

  ngOnDestroy() { 
    // console.log('ngOnDestroy')
   }

}

