
/**
 * @todo 驗證日期是否合法
 * @param dateString '2018/01/05'
 * @returns true:合法 , false:不合法
 * @author jacky
 */
export function isValidDate(dateString) {
    // First check for the pattern
    if (!/^\d{4}\/\d{1,2}\/\d{1,2}$/.test(dateString))
        return false;

    // Parse the date parts to integers
    var parts = dateString.split("/");
    var day = parseInt(parts[2], 10);
    var month = parseInt(parts[1], 10);
    var year = parseInt(parts[0], 10);

    // Check the ranges of month and year
    if (year < 1000 || year > 3000 || month == 0 || month > 12)
        return false;

    var monthLength = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

    // Adjust for leap years
    if (year % 400 == 0 || (year % 100 != 0 && year % 4 == 0))
        monthLength[1] = 29;

    // Check the range of the day
    return day > 0 && day <= monthLength[month - 1];
};

/**
 * @todo 驗證時間是否合法 (24小時制)
 * @param dateString '17:59'
 * @returns true:合法 , false:不合法
 * @author jacky
 */
export function isValidTime(timeString) {
    if(!timeString || timeString.toString().length<0){
        return false
        
    }
    // Parse the date parts to integers
    var parts = timeString.split(":");
    var hour = parseInt(parts[0], 10);
    var minute = parseInt(parts[1], 10);

    if (parts[0].substring(0, 1) == '_' || parts[0].substring(1, 2) == '_')
        return false
    if (parts[1].substring(0, 1) == '_' || parts[1].substring(1, 2) == '_')
        return false
        
    if (hour > 24 ) {
        return false
    }

    if (minute > 59) {
        return false
    }
    return true;
};