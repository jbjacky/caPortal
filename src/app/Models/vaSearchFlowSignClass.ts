
export class vaSearchFlowSignClass {
    ProcessFlowID: number
    showProcessFlowID: number
    EmpCode: string
    EmpNameC: string
    AppDeptName: string
    State: string
    ManageEmpName: string
    HoliDayID: number
    HoliDayNameC: number
    Take: boolean
    TransSign:boolean

    checkProxy: boolean //是否為代填表單
    WriteEmpCode: string //填寫人
    WriteEmpNameC: string //填寫人
  
    DateB: string
    DateE: string
    TimeB: string
    TimeE: string
    numberOfVaData: number
  
    day: string
    hour: string
    minute: string
  
  }