export class  GetDeptaByEmpToJson{
    Dept: Dept[]
    Level: 1
}
class Dept {
    DeptID: 0
    DeptCode: ""
    DeptNameC: ""
    ParentID: 0
    Tree: ""
    DateA: ""
    DateD: ""
    Manage: ""
    ManageMail: ""
    Path: ""
    Level: 0
    ChildDept: ChildDept[]
    Base: Base[]
}
class Base {
    EmpID: ""
    EmpCode: ""
    EmpNameC: ""
    EmpNameE: ""
    Email: ""
    Birthday: ""
    Sex: null
    IDNo: null
    PassWord: null
    Ttscode: null
    EffectDate: ""
    DateOut: ""
    DeptcID: 0
    DeptcName: null
    DeptID: 0
    DeptName: null
    DeptaID: 14
    DeptaName: null
    JobID: 0
    JobName: null
    JoblCode: null
    JoblName: null
    JoboCode: null
    JoboName: null
    JobsCode: null
    JobsName: null
    DI: null
    HoliCode: null
    CompID: 0
    CompName: null
    Saladr: null
    Mang: false
    Mang1: false
    DateIn: "0001-01-01T00:00:00"
    EmpcdCode: null
    EmpcdName: null
    WorkID: 0
    WorkName: null
    AgentNobr1: null
    AgentNobr2: null
    GroupID: null
}
class ChildDept {
    DeptID: 38
    DeptCode: "H31"
    DeptNameC: "零件組"
    ParentID: 24
    Tree: "30"
    DateA: "1979-01-01T00:00:00"
    DateD: "9999-12-31T00:00:00"
    Manage: "27"
    ManageMail: ""
    Path: "/1/12/24/38/"
    Level: 4
    ChildDept: ChildDept[]
    Base: Base[]
}