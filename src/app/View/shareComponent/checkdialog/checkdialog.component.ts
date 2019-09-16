import { Component, OnInit, Input } from '@angular/core';
import {ViewportScroller} from '@angular/common';
@Component({
  selector: 'app-checkdialog',
  templateUrl: './checkdialog.component.html',
  styleUrls: ['./checkdialog.component.css']
})
export class CheckdialogComponent implements OnInit {

  // @Input() iputSendSussesTitleText;
  @Input() iputSendSussesContentText;
  @Input() iputrouterlink;
  _routerlink='/home';
  _iputSendSussesTitleText='送出完成';
  constructor(private viewScroller: ViewportScroller) { }
  goTop(){
    window.scroll(0, 0);
  }
  ngOnInit() {
    // if(this.iputSendSussesTitleText!=null){
    //   this._iputSendSussesTitleText = this.iputSendSussesTitleText;
    // }
    if(this.iputSendSussesContentText!=null){
      this.iputSendSussesContentText = this.iputSendSussesContentText;
    }


    if(this.iputrouterlink!=null){
      this._routerlink = this.iputrouterlink;
    }
  }

}
