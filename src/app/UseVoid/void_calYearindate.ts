import { YearAndDateClass } from "../Models/AllformReview";
/**
 * @todo 將日期陣列按照年份分類
 * @param dateArray ['2018/10/20','2019/01/01','2018/03/02'...]
 * @returns [
 * {OneYear:'2018',YearofDate:['10/20','03/02']},
 * {OneYear:'2019',YearofDate:['01/01']}
 * ]
 * @author jacky
 */
export function calYearindate(dateArray: string[]) {
    var Year_Date:YearAndDateClass[] = []
    for (let date of dateArray) {
        var words = date.split('/')
        var cal_Year = words[0]
        var cal_Date = words[1] + '/' + words[2]
        var isHaveYear = Year_Date.filter(YD => YD.OneYear == cal_Year)
        if (isHaveYear.length == 0) {
            Year_Date.push({ OneYear: cal_Year, YearofDate: [cal_Date] })
        } else {
            Year_Date.map(x => {
                if (x.OneYear == cal_Year) {
                    x.YearofDate.push(cal_Date)
                }
            })
        }
    }
    // console.log(Year_Date)
    return Year_Date
}