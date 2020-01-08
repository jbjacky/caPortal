export class Attendance {

    EmpID: string;
    EmpCode: string;
    EmpName: string;
    DeptName: string;
    AttendDate: string;
    RoteNameC: string;
    OnTime: any;
    OffTime: any;
    OnTime_calCrossDay:boolean;
    OffTime_calCrossDay:boolean;

    OnCardTime: string;
    OffCardTime: string;
    OnCardTime_calCrossDay:boolean;
    OffCardTime_calCrossDay:boolean;

    IsAbnormal:boolean;

    AttendAbsInfo: null;
  
    Ride: boolean;//搭車
    Behind: boolean;//車誤
    FlexibleMinute: number;//彈性
  
    LateMins: number;//遲到
    EarlyMins: number; //早退
    IsAbsent: boolean;//未刷卡
  
    EarlyarriveMins: number;//早到
    LateleaveMins: number; //晚退
    
    ForgetCard: number;//忘刷次數

    ActualRote:any
    
    DayOfweek: string;
    
    EliminateLate:         boolean;
    EliminateEarly:        boolean;
    EliminateOnBefore:     boolean;
    EliminateOffAfter:     boolean;
    EliminateAbsent:       boolean;
  }