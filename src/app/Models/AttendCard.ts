
export class AttendCard {
  forget_man_code: string;
  forget_man_name: string;
  write_man_code: string;
  write_man_name: string;
  AttendDate: string;
  LateMins: boolean;
  EarlyMins: boolean;
  IsAbsent: boolean;
  OnBeforeMins: boolean;
  OffAfterMins: boolean;
  EliminateLate: boolean;
  EliminateEarly: boolean;
  EliminateOnBefore: boolean;
  EliminateOffAfter: boolean;
  EliminateAbsent: boolean;
  RoteID: number;
  RoteCode: string;
  RoteNameC: string;
  ActualRote_OnDateTime: string
  ActualRote_OffDateTime: string
  ActualRote_OnTime: string
  ActualRote_OffTime: string
  AttendCard_OnTime: string
  AttendCard_OffTime: string
  AttendCard_OnDateTime: string
  AttendCard_OffDateTime: string
  ActualRote_calCrossDay: boolean
  AttendCard_OnTime_calCrossDay: boolean
  AttendCard_OffTime_calCrossDay: boolean
}
