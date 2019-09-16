import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { pagechange } from 'src/app/Models/pagechange';
import { fromEvent } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
declare let $: any;


@Component({
  selector: 'app-reviewform-phone',
  templateUrl: './reviewform-phone.component.html',
  styleUrls: ['./reviewform-phone.component.css']
})
export class ReviewformPhoneComponent implements OnInit, AfterViewInit, OnDestroy {
  SwitchReview: SwitchReview[] = [];
  SwitchReview_apidata = ['經理 王美花(6)', '李大仁(173)', '值班經理 何晶晶(2)', '林美琪(3)', '張小美(262)', '郭大俠(452)', '張蘋果(6)', '陳香蕉(6)', '李濤(6)', '林曉(6)', '雄大(6)']
  Review: string = '李大仁';
  getclickSwitchReview_num: number = 0;
  pagechange:pagechange;//頁面切換按鈕動作
  
  constructor() { }
  
  ngOnInit() {
    this.pagechange = new pagechange();
    if (window.scrollY > 0) {
      document.getElementById("phonetopdiv").style.top = 66 + 'px';
    }
    document.getElementById("content-body").style.margin = '0px 0px';
    document.getElementById("content-body").style.backgroundColor = '#fff';

    this.SwitchReview_value();
    this.Review = this.SwitchReview[2].name;
  }
  ngOnDestroy(): void {
    this.formEvent_TopDivGoTop.unsubscribe();
    this.formEvent_WindowResize.unsubscribe();
    this.formEvent_BtClickNav.unsubscribe();
    
    document.getElementById("content-body").style.margin = '0px 0px';
    document.getElementById("content-body").style.backgroundColor = 'rgba(255, 255, 255, 0)';
  }

  SwitchReview_value() {
    for (let i = 0; i < this.SwitchReview_apidata.length; i++) {
      this.SwitchReview.push({ id_name: 'id' + i, name: this.SwitchReview_apidata[i] });
    }
  }

  ngAfterViewInit(): void {
    $('#' + this.SwitchReview[2].id_name).addClass('clicked');
    this.getclickSwitchReview_num = 2;

    for (let i = 0; i < this.SwitchReview.length; i++) {
      fromEvent(document.getElementById(this.SwitchReview[i].id_name), 'click')
        .pipe(debounceTime(10))
        .subscribe((event) => {
          for (let i = 0; i < this.SwitchReview.length; i++) {
            $('#' + this.SwitchReview[i].id_name).removeClass('clicked');
          }
          $('#' + this.SwitchReview[i].id_name).addClass('clicked');
          this.Review = $('#' + this.SwitchReview[i].id_name).text();
          this.getclickSwitchReview_num = i;

        })
    }
    this.formEvent_TopDivGoTop;
    this.TopresizeNav();
    this.formEvent_WindowResize;
    this.formEvent_BtClickNav;
  }
  TopresizeNav() {
  //修正width:800~1024的phonediv寬度及位置
    if (window.innerWidth > 800 && window.innerWidth < 1024) {
      if ($("body").hasClass("offcanvas-active")) {
        document.getElementById('phonetopdiv').style.left = '0px';
        document.getElementById('phonetopdiv').style.width = '100%';
      } else {
        document.getElementById('phonetopdiv').style.left = '220px';
        var rightwidth = window.innerWidth - 220;
        document.getElementById('phonetopdiv').style.width = rightwidth + 'px';
      }
    } else if (window.innerWidth < 800) {
      document.getElementById('phonetopdiv').style.left = '0px';
      document.getElementById('phonetopdiv').style.width = '100%';
    }
  }


  formEvent_BtClickNav = fromEvent(document.getElementsByClassName('btn-main-nav'), 'click')
  //點擊收合導覽按鈕時，修正width:800~1024的phonediv寬度及位置
    .pipe(debounceTime(50))
    .subscribe((event) => {
      this.TopresizeNav();
    })

  formEvent_WindowResize = fromEvent(window, 'resize')
  //視窗大小改變時，修正width:800~1024的phonediv寬度及位置
    .pipe(debounceTime(500))
    .subscribe((event) => {
      this.TopresizeNav();
      if (window.scrollY > 0) {
        document.getElementById("phonetopdiv").style.top = 66 + 'px';
      }
    })
  
  formEvent_TopDivGoTop = fromEvent(window, 'scroll')
  //scroll向下拖拉把藍色區塊副標題蓋住
    .pipe(debounceTime(10)) //當使用者在0.01秒內沒動作就執行
    .subscribe((event) => { //66~138
      var _wYnow = 0;
      if (window.scrollY > 71) {
        document.getElementById("phonetopdiv").style.top = '66px';
      } else {
        _wYnow = window.scrollY;
        var divtop = 138 - _wYnow;
        document.getElementById("phonetopdiv").style.top = divtop + 'px';
        //div隨著scroll拖拉上下移動
      }
      this.TopresizeNav();
    })

    bt_next() {
      //切換審核人員下一個人
      if (this.SwitchReview.length - 1 != this.getclickSwitchReview_num) {
        $('#' + this.SwitchReview[this.getclickSwitchReview_num + 1].id_name).addClass('clicked');
        $('#' + this.SwitchReview[this.getclickSwitchReview_num].id_name).removeClass('clicked');
        this.getclickSwitchReview_num = this.getclickSwitchReview_num + 1;
        this.Review = $('#' + this.SwitchReview[this.getclickSwitchReview_num].id_name).text();
      }
    }
    bt_pre() {
      //切換審核人員上一個人
      if (this.getclickSwitchReview_num != 0) {
        $('#' + this.SwitchReview[this.getclickSwitchReview_num - 1].id_name).addClass('clicked');
        $('#' + this.SwitchReview[this.getclickSwitchReview_num].id_name).removeClass('clicked');
        this.getclickSwitchReview_num = this.getclickSwitchReview_num - 1;
        this.Review = $('#' + this.SwitchReview[this.getclickSwitchReview_num].id_name).text();
      }
    }

    
  //0-呈核，1-核准，2-呈核&核准
  allvaformpeoele: vaform[] = [
    {
      id: 1,
      jobnumber: '612341',
      name: '張大名',
      division: '資訊管理處/計劃發展部',
      startdate: '2018/08/01',
      starttime: '08:30',
      enddate: '2018/08/02',
      endtime: '20:30',
      category: '事假',
      cause: '請假原因請假原因請假原因請假原因請假原因請假原因請假原因請假原因請假原因請假原因請假原因請假原因請假原因請假原因請假原因請假原因請假原因請假原因請假原因請假原因請假原因請假原因請假原因請假原因請假原因請假原因請假原因請假原因請假原因請假原因請假原因請假原因請假原因請假原因請假原因請假原因請假原因請假原因請假原因請假原因請假原因請假原因請假原因請假原因請假原因請假原因請假原因請假原因請假原因請假原因請假原因請假原因請假原因請假原因請假原因請假原因請假原因請假原因請假原因請假原因請假原因請假原因請假原因',
      message: [
        {
          man_name: '一級主管/李小龍',
          man_message: '呈核情況說明呈核情況說明呈核情況說明呈核情況說明呈核情況說明呈核情況說明呈核情況說明呈核情況說明呈核情況說明呈核情況說明呈核情況說明呈核情況說明呈核情況說明呈核情況說明呈核情況說明呈核情況說明呈核情況說明呈核情況說明呈核情況說明呈核情況說明呈核情況說明呈核情況說明呈核情況說明呈核情況說明呈核情況說明呈核情況說明呈核情況說明呈核情況說明呈核情況說明呈核情況說明呈核情況說明呈核情況說明呈核情況說明呈核情況說明呈核情況說明呈核情況說明呈核情況說明呈核情況說明呈核情況說明呈核情況說明',
          man_time: '2018/08/03'
        },
        {
          man_name: '二級主管/姚蓮舟',
          man_message: '呈核情況說明呈核情況說明呈核情況說明呈核情況說明呈核情況說明呈核情況說明呈核情況說明呈核情況說明呈核情況說明呈核情況說明呈核情況說明呈核情況說明呈核情況說明呈核情況說明呈核情況說明呈核情況說明呈核情況說明呈核情況說明呈核情況說明呈核情況說明呈核情況說明呈核情況說明呈核情況說明呈核情況說明呈核情況說明呈核情況說明呈核情況說明呈核情況說明呈核情況說明呈',
          man_time: '2018/08/03'
        }
      ],
      sendstate: 2,
      checkedstate: false
    },
    {
      id: 2,
      jobnumber: '123213',
      name: '陳小一',
      division: '修復工廠/物料採購部',
      startdate: '2018/08/19',
      starttime: '08:30',
      enddate: '2018/08/20',
      endtime: '20:30',
      category: '特休',
      cause: '請假原因',
      message: [
        {
          man_name: '一級主管/李小龍',
          man_message: '呈核情況說明呈核情況說明呈核情況說明呈核情況說明呈核情況說明呈核情況說明呈核情況說明呈核情況說明呈核情況說明呈核情況說明呈核情況說明呈核情況說明呈核情況說明呈核情況說明呈核情況說明呈核情況說明呈核情況說明呈核情況說明呈核情況說明呈核情況說明呈核情況說明呈核情況說明呈核情況說明呈核情況說明呈核情況說明呈核情況說明呈核情況說明呈核情況說明呈核情況說明呈核情況說明呈核情況說明呈核情況說明呈核情況說明呈核情況說明呈核情況說明呈核情況說明呈核情況說明呈核情況說明呈核情況說明呈核情況說明',
          man_time: '2018/08/03'
        },
        {
          man_name: '二級主管/姚蓮舟',
          man_message: '呈核情況說明呈核情況說明呈核情況說明呈核情況說明呈核情況說明呈核情況說明呈核情況說明呈核情況說明呈核情況說明呈核情況說明呈核情況說明呈核情況說明呈核情況說明呈核情況說明呈核情況說明呈核情況說明呈核情況說明呈核情況說明呈核情況說明呈核情況說明呈核情況說明呈核情況說明呈核情況說明呈核情況說明呈核情況說明呈核情況說明呈核情況說明呈核情況說明呈核情況說明呈',
          man_time: '2018/08/03'
        }
      ],
      sendstate: 0,
      checkedstate: false
    },
    {
      id: 3,
      jobnumber: '223213',
      name: '陳小二',
      division: '資訊管理處/計劃發展部',
      startdate: '2018/08/19',
      starttime: '08:30',
      enddate: '2018/08/20',
      endtime: '20:30',
      category: '家庭照顧假',
      cause: '請假原因',
      message: [
        {
          man_name: '一級主管/李小龍',
          man_message: '呈核情況說明呈核情況說明呈核情況說明呈核情況說明呈核情況說明呈核情況說明呈核情況說明呈核情況說明呈核情況說明呈核情況說明呈核情況說明呈核情況說明呈核情況說明呈核情況說明呈核情況說明呈核情況說明呈核情況說明呈核情況說明呈核情況說明呈核情況說明呈核情況說明呈核情況說明呈核情況說明呈核情況說明呈核情況說明呈核情況說明呈核情況說明呈核情況說明呈核情況說明呈核情況說明呈核情況說明呈核情況說明呈核情況說明呈核情況說明呈核情況說明呈核情況說明呈核情況說明呈核情況說明呈核情況說明呈核情況說明',
          man_time: '2018/08/03'
        },
        {
          man_name: '二級主管/姚蓮舟',
          man_message: '呈核情況說明呈核情況說明呈核情況說明呈核情況說明呈核情況說明呈核情況說明呈核情況說明呈核情況說明呈核情況說明呈核情況說明呈核情況說明呈核情況說明呈核情況說明呈核情況說明呈核情況說明呈核情況說明呈核情況說明呈核情況說明呈核情況說明呈核情況說明呈核情況說明呈核情況說明呈核情況說明呈核情況說明呈核情況說明呈核情況說明呈核情況說明呈核情況說明呈核情況說明呈',
          man_time: '2018/08/03'
        }
      ],
      sendstate: 1,
      checkedstate: false
    },
    {
      id: 4,
      jobnumber: '323213',
      name: '陳小三',
      division: '資訊管理處/計劃發展部',
      startdate: '2018/08/19',
      starttime: '08:30',
      enddate: '2018/08/20',
      endtime: '20:30',
      category: '產假',
      cause: '請假原因',
      message: [
        {
          man_name: '一級主管/李小龍',
          man_message: '呈核情況說明呈核情況說明呈核情況說明呈核情況說明呈核情況說明呈核情況說明呈核情況說明呈核情況說明呈核情況說明呈核情況說明呈核情況說明呈核情況說明呈核情況說明呈核情況說明呈核情況說明呈核情況說明呈核情況說明呈核情況說明呈核情況說明呈核情況說明呈核情況說明呈核情況說明呈核情況說明呈核情況說明呈核情況說明呈核情況說明呈核情況說明呈核情況說明呈核情況說明呈核情況說明呈核情況說明呈核情況說明呈核情況說明呈核情況說明呈核情況說明呈核情況說明呈核情況說明呈核情況說明呈核情況說明呈核情況說明',
          man_time: '2018/08/03'
        },
        {
          man_name: '二級主管/姚蓮舟',
          man_message: '呈核情況說明呈核情況說明呈核情況說明呈核情況說明呈核情況說明呈核情況說明呈核情況說明呈核情況說明呈核情況說明呈核情況說明呈核情況說明呈核情況說明呈核情況說明呈核情況說明呈核情況說明呈核情況說明呈核情況說明呈核情況說明呈核情況說明呈核情況說明呈核情況說明呈核情況說明呈核情況說明呈核情況說明呈核情況說明呈核情況說明呈核情況說明呈核情況說明呈核情況說明呈',
          man_time: '2018/08/03'
        }
      ],
      sendstate: 2,
      checkedstate: false
    },
    {
      id: 5,
      jobnumber: '423213',
      name: '陳小四',
      division: '資訊管理處/計劃發展部',
      startdate: '2018/08/19',
      starttime: '08:30',
      enddate: '2018/08/20',
      endtime: '20:30',
      category: '病假',
      cause: '請假原因',
      message: [
        {
          man_name: '一級主管/李小龍',
          man_message: '呈核情況說明呈核情況說明呈核情況說明呈核情況說明呈核情況說明呈核情況說明呈核情況說明呈核情況說明呈核情況說明呈核情況說明呈核情況說明呈核情況說明呈核情況說明呈核情況說明呈核情況說明呈核情況說明呈核情況說明呈核情況說明呈核情況說明呈核情況說明呈核情況說明呈核情況說明呈核情況說明呈核情況說明呈核情況說明呈核情況說明呈核情況說明呈核情況說明呈核情況說明呈核情況說明呈核情況說明呈核情況說明呈核情況說明呈核情況說明呈核情況說明呈核情況說明呈核情況說明呈核情況說明呈核情況說明呈核情況說明',
          man_time: '2018/08/03'
        },
        {
          man_name: '二級主管/姚蓮舟',
          man_message: '呈核情況說明呈核情況說明呈核情況說明呈核情況說明呈核情況說明呈核情況說明呈核情況說明呈核情況說明呈核情況說明呈核情況說明呈核情況說明呈核情況說明呈核情況說明呈核情況說明呈核情況說明呈核情況說明呈核情況說明呈核情況說明呈核情況說明呈核情況說明呈核情況說明呈核情況說明呈核情況說明呈核情況說明呈核情況說明呈核情況說明呈核情況說明呈核情況說明呈核情況說明呈',
          man_time: '2018/08/03'
        }
      ],
      sendstate: 1,
      checkedstate: false
    },
    {
      id: 6,
      jobnumber: '523213',
      name: '陳小五',
      division: '資訊管理處/計劃發展部',
      startdate: '2018/08/19',
      starttime: '08:30',
      enddate: '2018/08/20',
      endtime: '20:30',
      category: '病假',
      cause: '請假原因',
      message: [
        {
          man_name: '一級主管/李小龍',
          man_message: '呈核情況說明呈核情況說明呈核情況說明呈核情況說明呈核情況說明呈核情況說明呈核情況說明呈核情況說明呈核情況說明呈核情況說明呈核情況說明呈核情況說明呈核情況說明呈核情況說明呈核情況說明呈核情況說明呈核情況說明呈核情況說明呈核情況說明呈核情況說明呈核情況說明呈核情況說明呈核情況說明呈核情況說明呈核情況說明呈核情況說明呈核情況說明呈核情況說明呈核情況說明呈核情況說明呈核情況說明呈核情況說明呈核情況說明呈核情況說明呈核情況說明呈核情況說明呈核情況說明呈核情況說明呈核情況說明呈核情況說明',
          man_time: '2018/08/03'
        },
        {
          man_name: '二級主管/姚蓮舟',
          man_message: '呈核情況說明呈核情況說明呈核情況說明呈核情況說明呈核情況說明呈核情況說明呈核情況說明呈核情況說明呈核情況說明呈核情況說明呈核情況說明呈核情況說明呈核情況說明呈核情況說明呈核情況說明呈核情況說明呈核情況說明呈核情況說明呈核情況說明呈核情況說明呈核情況說明呈核情況說明呈核情況說明呈核情況說明呈核情況說明呈核情況說明呈核情況說明呈核情況說明呈核情況說明呈',
          man_time: '2018/08/03'
        }
      ],
      sendstate: 0,
      checkedstate: false
    },
    {
      id: 7,
      jobnumber: '843213',
      name: '陳小六',
      division: '資訊管理處/計劃發展部',
      startdate: '2018/08/19',
      starttime: '08:30',
      enddate: '2018/08/20',
      endtime: '20:30',
      category: '病假',
      cause: '請假原因',
      message: [
        {
          man_name: '一級主管/李小龍',
          man_message: '呈核情況說明呈核情況說明呈核情況說明呈核情況說明呈核情況說明呈核情況說明呈核情況說明呈核情況說明呈核情況說明呈核情況說明呈核情況說明呈核情況說明呈核情況說明呈核情況說明呈核情況說明呈核情況說明呈核情況說明呈核情況說明呈核情況說明呈核情況說明呈核情況說明呈核情況說明呈核情況說明呈核情況說明呈核情況說明呈核情況說明呈核情況說明呈核情況說明呈核情況說明呈核情況說明呈核情況說明呈核情況說明呈核情況說明呈核情況說明呈核情況說明呈核情況說明呈核情況說明呈核情況說明呈核情況說明呈核情況說明',
          man_time: '2018/08/03'
        },
        {
          man_name: '二級主管/姚蓮舟',
          man_message: '呈核情況說明呈核情況說明呈核情況說明呈核情況說明呈核情況說明呈核情況說明呈核情況說明呈核情況說明呈核情況說明呈核情況說明呈核情況說明呈核情況說明呈核情況說明呈核情況說明呈核情況說明呈核情況說明呈核情況說明呈核情況說明呈核情況說明呈核情況說明呈核情況說明呈核情況說明呈核情況說明呈核情況說明呈核情況說明呈核情況說明呈核情況說明呈核情況說明呈核情況說明呈',
          man_time: '2018/08/05'
        }
      ],
      sendstate: 1,
      checkedstate: false
    }
  ]//請假單



}

class vaform {
  id: number;
  jobnumber: string;
  name: string;
  division: string;
  startdate: string;
  starttime: string;
  enddate: string;
  endtime: string;
  category: string;
  cause: string;
  message: mangemessage[] = [];
  sendstate: number;
  checkedstate: boolean;

}
class mangemessage {
  man_name: string;
  man_message: string;
  man_time: string;
}

class SwitchReview {
  id_name: string;
  name: string;
}
