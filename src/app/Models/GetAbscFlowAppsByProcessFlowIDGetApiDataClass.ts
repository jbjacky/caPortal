// Generated by https://quicktype.io

export interface GetAbscFlowAppsByProcessFlowIDGetApiDataClass {
    Day:              number;
    HoliDayID:        number;
    FlowApps:         any;
    FlowAppsExtend:   FlowAppsExtend[];
    UseDayHourMinute: UseDayHourMinute;
    EmpID:            any;
    EmpCode:          any;
    EmpNameC:         any;
    State:            any;
    Cond1:            any;
    Cond2:            any;
    Cond3:            any;
    Cond4:            any;
    Cond5:            any;
    Cond6:            any;
}

export interface FlowAppsExtend {
    ProcessID:           number;
    HoliDayName:         string;
    DateB:               string;
    DateTimeB:           string;
    DateTimeE:           string;
    EmpID:               string;
    EmpCode:             string;
    EmpNameC:            string;
    TimeB:               string;
    TimeE:               string;
    HoliDayID:           number;
    HoliDayNameC:        string;
    Use:                 number;
    UseDayHourMinute:    any;
    BaseHour:            number;
    Day:                 number;
    HoliDayUnitName:     any;
    Note:                string;
    Info:                any;
    MailBody:            any;
    State:               string;
    DeptName:            string;
    JobName:             string;
    AgentNobr1:          any;
    AgentName1:          any;
    AbsentMinusDetailId: number;
}

export interface UseDayHourMinute {
    Day:    number;
    Hour:   number;
    Minute: number;
}
