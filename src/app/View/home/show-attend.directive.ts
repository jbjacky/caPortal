import { Directive, OnInit, AfterViewInit } from '@angular/core';

declare var $: any;
@Directive({
  selector: '[appShowAttend]'
})
export class ShowAttendDirective implements OnInit,AfterViewInit{
  ngAfterViewInit(): void {
    this.windowSize()
  }
  ngOnInit(): void {
  }

  constructor() { }

  windowSize() {
    if (window.innerWidth > 1860) {
      $('.slick-next.slick-arrow').css({ "display": "none" });
      $('.slick-prev.slick-arrow').css({ "display": "none" });
      $('.slick-dots').css({ "display": "none" });

    } else {
      $('.slick-next.slick-arrow').css({ "display": "block" });
      $('.slick-prev.slick-arrow').css({ "display": "block" });
      $('.slick-dots').css({ "display": "block" });
    }
  }
}
