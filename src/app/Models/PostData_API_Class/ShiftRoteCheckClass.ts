
export interface ShiftRoteCheckClass {
    EmpID1:        string;
    EmpID2:        string;
    ShiftRoteDate: ShiftRoteDate[];
    IsDifferShift: boolean
}

export interface ShiftRoteDate {
    ShiftDate: string;
    RoteID1:   number;
    RoteID2:   number;
}
