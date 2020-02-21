export function isInDateArray(LDate: Array<SEDate>, IDate: SEDate) {
    var ReturnDateData: ReturnDateDataClass = new ReturnDateDataClass();
    for (let L of LDate) {
        if (IDate.startDateTime <= L.endDateTime && IDate.endDateTime >= L.startDateTime) {
            ReturnDateData = {
                isIn: true,
                startDateTimeL: L.startDateTime,
                endDateTimeL: L.endDateTime,
                startDateTimeI: IDate.startDateTime,
                endDateTimeI: IDate.endDateTime
            }
        }
    }
    return ReturnDateData;
}
class ReturnDateDataClass {
    constructor() {
        this.isIn = false
    }
    isIn: boolean;
    startDateTimeL: Date;
    endDateTimeL: Date;
    startDateTimeI: Date;
    endDateTimeI: Date;
}
export class SEDate {
    startDateTime: Date;
    endDateTime: Date;
}

export class RTestDateClass {
    constructor() { }
    GetTestData(): Array<SEDate> {
        var data: Array<SEDate> = [{
            startDateTime: new Date('2000/01/01'),
            endDateTime: new Date('2000/03/01')
        },
        {
            startDateTime: new Date('2000/03/05 01:00'),
            endDateTime: new Date('2000/03/07 03:00')
        }]
        return data
    }
}