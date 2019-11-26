
export class GetAttendUnusualFlowAppsByProcessFlowIDDataClass {
    ProcessID:             number;
    Date:                  string;
    RoteDateTimeB:         string;
    RoteDateTimeE:         string;
    CardDateTimeB:         string;
    CardDateTimeE:         string;
    EmpID:                 string;
    EmpCode:               string;
    EmpNameC:              string;
    EliminateLate:         boolean;
    EliminateEarly:        boolean;
    EliminateOnBefore:     boolean;
    EliminateOffAfter:     boolean;
    EliminateAbsent:       boolean;
    RoteID:                number;
    RoteNameC:             string;
    CauseID:               string;
    CauseName:             string;
    Note:                  string;
    Info:                  any;
    UploadFile:            UploadFile[];
    MailBody:              any;
    State:                 string;
    ExceptionalCode:       string;
    ExceptionalName:       string;
    ExceptionalCancelCode: any;
    ExceptionalCancelName: any;
    DeptName:              string;
    JobName:               string;
}

export interface UploadFile {
    UploadID:    number;
    UploadName:  string;
    ServerName:  string;
    Description: string;
    Blob:        any;
    Type:        string;
    Size:        number;
}
