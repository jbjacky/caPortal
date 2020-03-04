// Generated by https://quicktype.io

export interface OTSaveAndFlowStartGetApiClass {
    FlowApp:     EFlowApp;
    FlowDynamic: FlowDynamic;
}

export interface EFlowApp {
    FlowApps: FlowAppElement[];
    EmpID:    string;
    EmpCode:  string;
    EmpNameC: string;
    State:    string;
}

export interface FlowAppElement {
    EmpID:     string;
    EmpNameC:  string;
    OtCat:     string;
    DateB:     string;
    DateE:     string;
    TimeB:     string;
    TimeE:     string;
    DateTimeB: string;
    DateTimeE: string;
    Amount:    number;
    CauseID:   string;
    RoteID:    string;
    DeptcID:   string;
    Note:      string;
    KeyMan:    string;
    Serno:     string;
    UploadFile: any[],
    MailBody:  string;
    State:     string;
}

export interface FlowDynamic {
    FlowNode: string;
    RoleID:   string;
    EmpID:    string;
    DeptID:   string;
    PosID:    string;
}