import { Component, OnInit, OnDestroy } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { GetSelectBaseClass } from 'src/app/Models/GetSelectBaseClass';


@Component({
  selector: 'app-edit-page',
  templateUrl: './edit-page.component.html',
  styleUrls: ['./edit-page.component.css']
})
export class EditPageComponent implements OnInit{
  ngOnInit(): void {
  }
}
class reviewCardPatchDetailDataClass{
  uiProcessFlowID:string;
  ProcessFlowID: string;
  EmpCode:string;
  EmpName:string;
  ActualRote_calCrossDay:boolean
  AttendCard_calCrossDay:boolean
  WriteRote_calCrossDay:boolean
  checkProxy:boolean
  WriteEmpCode:string;
  WriteEmpNameC:string;
  ExceptionalName:   string;
  ErrorStateCode:    string;
  ErrorStateName:    string;
  isForgetCard:boolean
  isEarlyMins:boolean
  isLateMins:boolean
  isNormal:boolean
  isOnBeforeMins:boolean
  isOffAfterMins:boolean
  isForgetCardOld:boolean
  isEarlyMinsOld:boolean
  isLateMinsOld:boolean
  isNormalOld:boolean
  isOnBeforeMinsOld:boolean
  isOffAfterMinsOld:boolean
  Date:string;
  RoteCode:string;
  RoteTimeB:string
  RoteTimeE:string
  writeDateB:string;
  writeTimeB:string;
  writeDateE:string;
  writeTimeE:string;
  cardTimeB:string;
  cardTimeE:string;
  CauseID1:string;
  CauseName1:string;
  Note:string;
}
