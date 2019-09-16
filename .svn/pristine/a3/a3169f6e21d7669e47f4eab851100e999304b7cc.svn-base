import { Component, OnInit } from '@angular/core';
import { SearchMan } from 'src/app/Models/CalendarClass';

@Component({
  selector: 'app-personnel-search-treeview',
  templateUrl: './personnel-search-treeview.component.html',
  styleUrls: ['./personnel-search-treeview.component.css']
})
export class PersonnelSearchTreeviewComponent implements OnInit {

  nodes = [
    {
      name: '董事長'
    },
    {
      name: '資深副總(VF)辦公室',
      children: [
        {
          name: '個資管理專案小組',
        }
      ]
    },
    {
      name: '資深副總室(VW)',
      children: [
        {name: '資深副總(VW)辦公室',children:[]},
        {
          name: '空服處',
          children: [
            { name: '會計組'},
            { name: '行政組', children:[
              { name:'人事暨行政組',children:[
                { name: '行政組',children:[
                  {name:'作業小組',children:[
                  ]}
                ] },
              ]}
            ]}
          ]
        }
      ]
    }
  ];
  options = {}
  constructor() { }
  SearchMan:SearchMan = new SearchMan();
  ngOnInit() {
  }

  onSelect(e){
      // console.log(e.node.data)
      // this.SearchMan.jobID = e.node.data.id
      this.SearchMan.name = e.node.data.name

  }


}
