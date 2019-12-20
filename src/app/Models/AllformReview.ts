
export  class AllformReview 
{
  EmpCode: string;
  EmpNameC: string;
  EmpNameE: string;
  Count: string;
  FlowSignForm:FlowSignForm[]
  PosID: string;
  PosName: string;
  RoleEmp: string;
  RoleID:string;
  DeptName: string;
  BatchSign: boolean;
}

// class reviewform{
//   vaform:reviewformCount
//   delform:reviewformCount
//   changeform:reviewformCount
//   forgetform:reviewformCount
// }
export class FlowSignForm{
  Count:string;
  FormCode:string;
  FormName:string;
  FlowTreeID:string;
  FlowSign:FlowSign[];
}
export class FlowSign{
  ProcessFlowID: string;
  FlowTreeID:string
  FlowNodeID:string
  ProcessApParmAuto:string
  EmpCode:string;
  EmpNameC:string;
  EmpNameE:string;
  Note:string;
  isApproved: boolean
  isSendback: boolean
  isPutForward: boolean
}

export class vaFlowSign{
  uiCheckBoxID:number;
  uiCheckBox:boolean;
  uiHolidayName:Array<any>;
  uiProcessFlowID:string;
  ProcessFlowID: string;
  FlowTreeID:string
  FlowNodeID:string
  ProcessApParmAuto:string
  EmpCode:string;
  EmpNameC:string;
  EmpNameE:string;
  isApproved: boolean;
  isSendback: boolean;
  isPutForward: boolean;
  
  WriteEmpCode:string;
  WriteEmpNameC:string;
  // AbsFlowAppsDetail:any;
  // HoliDayID:string;
  DateB:string;
  DateE:string;
  TimeB:string;
  TimeE:string;
  // Use:string;
  day:string;
  hour:string;
  minute:string;
  numberOfVaData:string;

  checkProxy:boolean
  Appointment:boolean //是否為預排假單

}

export class forgetFlowSign{

  uiProcessFlowID:string;
  ProcessFlowID: string;
  FlowTreeID:string
  FlowNodeID:string
  ProcessApParmAuto:string
  EmpCode:string;
  EmpNameC:string;
  EmpNameE:string;
  isApproved: boolean
  isSendback: boolean
  isPutForward: boolean

  ActualRote_calCrossDay:boolean
  AttendCard_calCrossDay:boolean
  WriteRote_calCrossDay:boolean
  
  checkProxy:boolean
  WriteEmpCode:string;
  WriteEmpNameC:string;
  
  // State:string;
  isForgetCard:boolean
  isEarlyMins:boolean
  isLateMins:boolean

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
export class delFlowSign{
  
  uiHolidayName:Array<any>;
  uiProcessFlowID:string;
  ProcessFlowID: string;
  FlowTreeID:string;
  FlowNodeID:string;
  ProcessApParmAuto:string;
  EmpCode:string;
  EmpNameC:string;
  EmpNameE:string;
  Note:string;
  isApproved: boolean;
  isSendback: boolean;
  isPutForward: boolean;
  
  WriteEmpCode:string;
  WriteEmpNameC:string;
  
  YearAndDate:YearAndDateClass[];
  dateArray:any[];
  day:string;
  hour:string;
  minute:string;
  numberOfVaData:string;

  checkProxy:boolean
}
export class changeFlowSign{
  
  uiProcessFlowID:string;
  ProcessFlowID: string;
  FlowTreeID:string;
  FlowNodeID:string;
  ProcessApParmAuto:string;
  EmpID1: string
  EmpCode1: string
  EmpNameC1: string
  EmpID2: string
  EmpCode2: string
  EmpNameC2: string
  isApproved: boolean;
  isSendback: boolean;
  isPutForward: boolean;
  Note:string;
  
  WriteEmpCode:string;
  WriteEmpNameC:string;
  
  YearAndDate:YearAndDateClass[];
  dateArray:Array<string>;
  isDR:boolean;
  isRR:boolean;
  isRZ:boolean;
  numberOfVaData:string;

  checkProxy:boolean
}
export class YearAndDateClass{
  OneYear:string
  YearofDate:Array<any>
}


export class dateArrayClass{
  DateB:string;
  DateE:string;
}


export class CardPatchFlowSign{

  uiProcessFlowID:string;
  ProcessFlowID: string;
  FlowTreeID:string
  FlowNodeID:string
  ProcessApParmAuto:string
  EmpCode:string;
  EmpNameC:string;
  EmpNameE:string;
  isApproved: boolean
  isSendback: boolean
  isPutForward: boolean

  ActualRote_calCrossDay:boolean
  AttendCard_calCrossDay:boolean
  WriteRote_calCrossDay:boolean
  
  checkProxy:boolean
  WriteEmpCode:string;
  WriteEmpNameC:string;
  
  // State:string;
  isForgetCard:boolean
  isEarlyMins:boolean
  isLateMins:boolean

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
export class AttendUnusualFlowSign {
  uiProcessFlowID:       number;
  ProcessFlowID:         string;
  FlowTreeID:            string;
  FlowNodeID:            string;
  ProcessApParmAuto:     string;
  EmpCode:               string;
  EmpNameC:              string;
  EmpNameE:              string;
  isApproved:            boolean;
  isSendback:            boolean;
  isPutForward:          boolean;
  WriteEmpCode:          string;
  WriteEmpNameC:         string;
  checkProxy:            boolean;
  ExceptionalCode:       string;
  ExceptionalName:       string;
  ExceptionalCancelCode: string;
  ExceptionalCancelName: string;
  Date:                  string;
  RoteCode:              string;
  EliminateLate:         boolean;
  EliminateEarly:        boolean;
  EliminateOnBefore:     boolean;
  EliminateOffAfter:     boolean;
  EliminateAbsent:       boolean;
}
