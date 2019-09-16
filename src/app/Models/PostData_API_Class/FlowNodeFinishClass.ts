
export class FlowNodeFinishClass{
    ProcessFlowID: number
    ProcessApParmAuto: number
    State: string
    FlowTreeID: string
    FlowNodeID: string
    Note: string
    NodeName: string
    CheckEmpID: string
    ManInfo: {
        EmpName: string
        DeptID: string
        DeptName: string
        DeptPath: string
        PosID: string
        PosName: string
        Auth: boolean,
        Email: string
        MainMan: boolean,
        ChiefCode: string
        RoleEmp: string
        RoleID: string
        EmpID: string
    }
    FlowDynamic: {
        FlowNode: string
        RoleID: string
        EmpID: string
        DeptID: string
        PosID: string
    }
  }