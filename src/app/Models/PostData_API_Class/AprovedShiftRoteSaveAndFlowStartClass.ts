
export class AprovedShiftRoteSaveAndFlowStartClass {
    FlowApp: ShiftRote_FlowAppClass
    FlowDynamic: ShiftRote_FlowDynamicClass
}
class ShiftRote_FlowDynamicClass {
    FlowNode: string
    RoleID: string
    EmpID: string
    DeptID: string
    PosID: string
}
class ShiftRote_FlowAppClass {
    ShiftRoteType: string
    ShiftRoteName: string
    DifferShift: boolean
    FlowApps: ShiftRote_FlowApp_FlowAppsArrayClass[]
    EmpID: string
    EmpCode: string
    EmpNameC: string
    State: string
    Cond5:string
}

class ShiftRote_FlowApp_FlowAppsArrayClass {
    EmpID1: string
    EmpCode1: string
    EmpNameC1: string
    EmpID2: string
    EmpCode2: string
    EmpNameC2: string
    Note: string
    Info: string
    MailBody: string
    State: string
    ShiftRoteFlowAppsDetail: ShiftRoteFlowAppsDetailArrayClass[]
}
class ShiftRoteFlowAppsDetailArrayClass {
    ShiftRoteDate: string
    RoteID1: number
    RoteCode1: string
    RoteName1: string
    RoteID2: number
    RoteCode2: string
    RoteName2: string
}

