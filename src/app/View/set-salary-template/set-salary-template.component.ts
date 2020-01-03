import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-set-salary-template',
  templateUrl: './set-salary-template.component.html',
  styleUrls: ['./set-salary-template.component.css']
})
export class SetSalaryTemplateComponent implements OnInit {

  constructor() { }

  chooseRadio: string = 'A';
  ngOnInit() {
    this.changeRadio();
  }

  setTemplate = new TemplateClass();

  changeRadio() {
    this.setTemplate = new TemplateClass();
    this.setTemplate.template = this.chooseRadio.toString()
    this.setTemplate.blockDetail = []
    if (this.chooseRadio.toString() == 'A') {
      for (let i = 1; i <= 8; i++) {
        this.setTemplate.blockDetail.push({
          order: i,
          code: ''
        })
      }
    }else if (this.chooseRadio.toString() == 'B') {
      for (let i = 1; i <= 4; i++) {
        this.setTemplate.blockDetail.push({
          order: i,
          code: ''
        })
      }
    }else if (this.chooseRadio.toString() == 'C') {
      for (let i = 1; i <= 2; i++) {
        this.setTemplate.blockDetail.push({
          order: i,
          code: ''
        })
      }
    }
    console.log(this.setTemplate)

  }

}
class TemplateClass {
  template: string
  blockDetail: Array<blockDetailClass>
}
class blockDetailClass {
  order: number
  code: string
}
