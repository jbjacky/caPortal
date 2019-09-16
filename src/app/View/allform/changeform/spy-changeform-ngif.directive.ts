import { Directive, OnInit, AfterContentInit, AfterViewChecked, } from '@angular/core';

declare let $: any; //use jquery

@Directive({
  selector: '[appSpyChangeformNgif]'
})
export class SpyChangeformNgifDirective implements OnInit, AfterContentInit, AfterViewChecked {
  ngAfterViewChecked(): void {
    if (window.innerWidth >768) {
      this.ChangeHeight();
      this.ChangeHeightViewTwo()
    } else {
      $('#oneEmp').css('height', '100%')
      $('#twoEmp').css('height', '100%')
      for (let i = 0; i < 7; i++) {
        $('#oneCheckHeight' + i).css('height', '100%')
      }
      for (let i = 0; i < 7; i++) {
        $('#twoCheckHeight' + i).css('height', '100%')
      }

      $('#oneEmp_View2').css('height', '100%')
      $('#twoEmp_View2').css('height', '100%')
      for (let i = 0; i < 7; i++) {
        $('#oneCheckHeight_View2' + i).css('height', '100%')
        $('#oneCheckHeight_View2_isCheck' + i).css('height', '100%')
      }
      for (let i = 0; i < 7; i++) {
        $('#twoCheckHeight_View2' + i).css('height', '100%')
        $('#twoCheckHeight_View2_isCheck' + i).css('height', '100%')
      }

      
    }

  }
  ngAfterContentInit(): void {
  }
  ChangeHeight() {

    // var oneNumArray = [];
    // var twoNumArray = [];

    // for (let i = 0; i < 7; i++) {
    //   oneNumArray.push($("#oneCheckHeight" + i).height())
    //   twoNumArray.push($("#twoCheckHeight" + i).height())
    // }

    // oneNumArray.push($("#oneEmp").height())
    // twoNumArray.push($("#twoEmp").height())

    // var setoneCheckHeight = Math.max.apply(null, oneNumArray) //最大的高度
    // var settwoCheckHeight = Math.max.apply(null, twoNumArray) //最大的高度

    // for (let i = 0; i < 7; i++) {
    //   $('#oneCheckHeight' + i).css('height', setoneCheckHeight.toString())
    //   $('#twoCheckHeight' + i).css('height', settwoCheckHeight.toString())
    // }

    // $('#oneEmp').css('height', setoneCheckHeight.toString())
    // $('#twoEmp').css('height', settwoCheckHeight.toString())

    // if (setoneCheckHeight > 22) {
    //   $('#onePadding').css('padding', '21px 0px')
    // } else {
    //   $('#onePadding').css('padding', '10px 0px')
    // }
    // if (settwoCheckHeight > 22) {
    //   $('#twoPadding').css('padding', '21px 0px')
    // } else {
    //   $('#twoPadding').css('padding', '10px 0px')
    // }

    var oneNumArray = [];
    var twoNumArray = [];

    for (let i = 0; i < 7; i++) {
      oneNumArray.push($("#oneCheckHeight" + i).height())
      twoNumArray.push($("#twoCheckHeight" + i).height())
    }


    var setoneCheckHeight = Math.max.apply(null, oneNumArray) //最大的高度
    var settwoCheckHeight = Math.max.apply(null, twoNumArray) //最大的高度


    if (setoneCheckHeight >= 22) {
      $('#onePadding').css('padding', '21px 0px')
      $('#oneEmp').css('height', (setoneCheckHeight + 21).toString())
      for (let i = 0; i < 7; i++) {
        $('#oneCheckHeight' + i).css('height', setoneCheckHeight.toString())
      }
    } else {
      $('#onePadding').css('padding', '10px 0px')
      // $('#oneEmp').css('height','44px')
    }

    if (settwoCheckHeight >= 22) {
      $('#twoPadding').css('padding', '21px 0px')
      $('#twoEmp').css('height', (settwoCheckHeight + 21).toString())
      for (let i = 0; i < 7; i++) {
        $('#twoCheckHeight' + i).css('height', settwoCheckHeight.toString())
      }
    } else {
      $('#twoPadding').css('padding', '10px 0px')
    }
  }

  ChangeHeightViewTwo() {

    var oneNumArray = [];
    var twoNumArray = [];

    for (let i = 0; i < 7; i++) {
      oneNumArray.push($("#oneCheckHeight_View2" + i).height())
      twoNumArray.push($("#twoCheckHeight_View2" + i).height())

      oneNumArray.push($("#twoCheckHeight_View2" + i).height())
      twoNumArray.push($("#oneCheckHeight_View2" + i).height())
    }


    var setoneCheckHeight = Math.max.apply(null, oneNumArray) //最大的高度
    var settwoCheckHeight = Math.max.apply(null, twoNumArray) //最大的高度


    if (setoneCheckHeight >= 22) {
      $('#onePadding_View2').css('padding', '21px 0px')
      $('#oneEmp_View2').css('height', (setoneCheckHeight + 21).toString())
      for (let i = 0; i < 7; i++) {
        $('#oneCheckHeight_View2' + i).css('height', setoneCheckHeight.toString())
        $('#oneCheckHeight_View2_isCheck' + i).css('height', setoneCheckHeight.toString())
      }
    } else {
      $('#onePadding_View2').css('padding', '10px 0px')
      // $('#oneEmp_View2').css('height','44px')
    }

    if (settwoCheckHeight >= 22) {
      $('#twoPadding_View2').css('padding', '21px 0px')
      $('#twoEmp_View2').css('height', (settwoCheckHeight + 21).toString())
      for (let i = 0; i < 7; i++) {
        $('#twoCheckHeight_View2' + i).css('height', settwoCheckHeight.toString())
        $('#twoCheckHeight_View2_isCheck' + i).css('height', settwoCheckHeight.toString())
      }
    } else {
      $('#twoPadding_View2').css('padding', '10px 0px')
    }
  }
  ngOnInit(): void {
  }

  constructor() { }

}
