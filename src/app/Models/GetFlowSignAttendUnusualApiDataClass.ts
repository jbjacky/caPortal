export interface GetFlowSignAttendUnusualApiDataClass {
    ProcessFlowID:         number;
    FlowTreeID:            string;
    FlowNodeID:            string;
    ProcessApParmAuto:     number;
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

