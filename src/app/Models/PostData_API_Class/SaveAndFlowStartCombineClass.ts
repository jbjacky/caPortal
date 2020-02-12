// Generated by https://quicktype.io

export interface SaveAndFlowStartCombineClass {
    AttendUnusualFlowApp: AttendUnusualFlowApp | null;
    CardFlowApp:          CardFlowApp | null;
    FlowDynamic:          FlowDynamic;
    ErrorState:           string;
}

export interface AttendUnusualFlowApp {
    FlowApps: AttendUnusualFlowAppFlowApp[];
    EmpID:    string;
    EmpCode:  string;
    EmpNameC: string;
    State:    string;
}

export interface AttendUnusualFlowAppFlowApp {
    EmpID:                 string;
    EmpCode:               string;
    EmpNameC:              string;
    Date:                  string;
    RoteDateTimeB:         string;
    RoteDateTimeE:         string;
    CardDateTimeB:         string;
    CardDateTimeE:         string;
    EliminateLate:         boolean;
    EliminateEarly:        boolean;
    EliminateAbsent:       boolean;
    EliminateOnBefore:     boolean;
    EliminateOffAfter:     boolean;
    CauseID:               number;
    CauseName:             string;
    Note:                  string;
    Info:                  string;
    MailBody:              string;
    State:                 string;
    UploadFile:            any[];
    ExceptionalCode:       string;
    ExceptionalName:       string;
    ExceptionalCodeCancel: string;
    ExceptionalNameCancel: string;
    RoteID:                number;
    RoteNameC:             string;
    ErrorStateCode:        string;
    ErrorStateName:        string;
}

export interface CardFlowApp {
    FlowApps: CardFlowAppFlowApp[];
    EmpID:    string;
    EmpCode:  string;
    EmpNameC: string;
    State:    string;
}

export interface CardFlowAppFlowApp {
    EmpID:                 string;
    EmpCode:               string;
    EmpNameC:              string;
    Date:                  string;
    RoteDateTimeB:         string;
    RoteDateTimeE:         string;
    CardDateTimeB:         string;
    CardDateTimeE:         string;
    DateB:                 string;
    DateE:                 string;
    TimeB:                 string;
    TimeE:                 string;
    DateTimeB:             string;
    DateTimeE:             string;
    CauseID1:              number;
    CauseName1:            string;
    CauseID2:              number;
    CauseName2:            string;
    Info:                  string;
    MailBody:              string;
    State:                 string;
    Note:                  string;
    UploadFile:            any[];
    ExceptionalCode:       string;
    ExceptionalName:       string;
    ExceptionalCodeCancel: string;
    ExceptionalNameCancel: string;
    ErrorStateCode:        string;
    ErrorStateName:        string;
}

export interface FlowDynamic {
    FlowNode: string;
    RoleID:   string;
    EmpID:    string;
    DeptID:   string;
    PosID:    string;
}
