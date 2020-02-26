export class AbsSaveAndFlowStartClass {
    FlowApp: FlowAppClass;
    FlowDynamic: FlowDynamicClass;
}
class FlowAppClass {
    Day: number
    FlowApps: FlowAppsClass[]
    EmpID: string
    EmpCode: string
    EmpNameC: string
    State: string
}
export class FlowAppsClass {
    EmpID: string
    EmpCode: string
    EmpNameC: string
    RoteID: string
    DateB: string
    DateE: string
    TimeB: string
    TimeE: string
    DateTimeB: string
    DateTimeE: string
    HoliDayID: number
    HoliDayNameC: string
    Use: number
    Day:number
    Balance: number
    HoliDayUnitName: string
    AgentNobr1: string
    AgentName1: string
    AgentNote: string
    Note: string
    Info: string
    KeyName: string
    EventDate: string
    AbsFlowAppsDetail: AbsFlowAppsDetailClass[]
    UploadFile: any[]
    MailBody: string
    State: string
    Today:boolean
    Circulate: boolean
    Appointment: boolean
}
class FlowDynamicClass {
    FlowNode: string
    RoleID: string
    EmpID: string
    DeptID: string
    PosID: string
}
export class AbsFlowAppsDetailClass {
    EmpID: string
    HoliDayID: number
    DateB: string
    TimeB: string
    TimeE: string
    DateTimeB: string
    DateTimeE: string
    Use: number
    AbsFlowAppsTrans:AbsFlowAppsTransClass[]
    RoteRestList:RoteRestListClass[]
}
export class AbsFlowAppsTransClass{
    AbsPlusDateB: string
    AbsPlusDateE: string
    EventDate: string
    DateTimeB: string
    DateTimeE: string
    DateB:string
    AbsPlusKey: string
    AbsPlusTimeB: string
    AbsPlusTimeE: string
    AbsPlusHcode: string
    KeyName: string
    AbsPlusMax: number
    AbsPlusUse: number
    AbsPlusBalance: number
    TimeB: string
    TimeE: string
    HoliDayID: number
    Use: number
    Balance: number
}
 class RoteRestListClass{
    RoteID: number
    Seq: number
    TimeB: string
    TimeE: string
    Minute: number
    IsNormalAbs: boolean
    IsNormalOt: boolean
    IsHoliDayAbs: boolean
    IsHoliDayOt: boolean
}