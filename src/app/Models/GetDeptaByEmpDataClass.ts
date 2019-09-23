// Generated by https://quicktype.io

export interface GetDeptaByEmpDataClass {
    Level: number;
    Dept:  Dept[];
}

export interface Dept {
    DeptID:     number;
    DeptNameC:  string;
    ParentID:   number | null;
    ParentName: null | string;
    PathName:   null | string;
    Tree:       null | string;
    Level:      number;
    Manage:     null;
    Base:       Base[] | null;
}

export interface Base {
    EmpID:           string;
    EmpCode:         string;
    EmpNameC:        string;
    EmpNameE:        string;
    JobID:           number;
    JobName:         string;
    ChiefCode:       string;
    EffectDate:      string;
    DeptaID:         number;
    DeptaName:       string;
    ParentDeptaName: string;
    PosType:         string;
}
