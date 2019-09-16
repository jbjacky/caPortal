
export class showVaDetail {
    FlowID: string;
    FlowCode: string;
    FlowState: string;
    isApproved: boolean;
    isSendback: boolean;
    isPutForward: boolean;
    EmpCode: string;
    EmpNameC: string;
    EmpNameE: string;
    LeaveTime: string;
    LeaveArray: LeaveArray[]
    showAllSigningOpinions: showAllSigningOpinions[]
}
class LeaveArray {
    starttime: string;
    endtime: string;
    proxyEmpCode: string;
    proxyEmpNameC: string;
    proxyEmpNameE: string;
    LeaveTime: string;
    vacategrory: { HoliDayID: 0, HoliDayNameC: '', HoliDayKindID: '' }
    cause: string;
    Fileupload: any[];
    EveryDayDetail: EveryDayDetail[]
}
class EveryDayDetail {
    date: string;
    time: string;
    restTime: string;
    leavetime: string;
}
class showAllSigningOpinions {
    signJobTitle: string;
    signEmpCode: string;
    signEmpNameC: string;
    signEmpNameE: string;
    signDateTime: string;
    signState: string;
    singOpinions: string;
}