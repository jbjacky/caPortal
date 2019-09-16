
export class AbscFlowHandlerSaveAndFlowStartClass {
    FlowApp: AbscFlowHandler_FlowApp
    FlowDynamic: AbscFlowHandler_FlowDynamic
}
class AbscFlowHandler_FlowApp {
    Day: number
    HoliDayID: number
    FlowApps: AbscFlowHandler_FlowApps[]
    EmpID: string
    EmpCode: string
    EmpNameC: string
    State: string
}

export class AbscFlowHandler_FlowApps {
    EmpID: string
    EmpCode: string
    EmpNameC: string
    DateB: string
    TimeB: string
    TimeE: string
    DateTimeB: string
    DateTimeE: string
    HoliDayID: number
    HoliDayNameC: string
    Use: number
    Day: number
    HoliDayUnitName: string
    Note: string
    Info: string
    MailBody: string
    State: string
    AgentNobr1:string
    AgentName1:string
    AbsentMinusDetailId:number
}
class AbscFlowHandler_FlowDynamic {
    FlowNode: string
    RoleID: string
    EmpID: string
    DeptID: string
    PosID: string
}