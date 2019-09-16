

var CnineseNumbermap = new Map([
    [1, '一'],
    [2, '二'],
    [3, '三'],
    [4, '四'],
    [5, '五'],
    [6, '六'],
    [7, '七'],
    [8, '八'],
    [9, '九'],
    [10, '十']
]);
/**
 * @todo 傳入阿拉伯數字轉成中文數字
 * @param {number} en_num :阿拉伯數字
 * @author jacky
 * @returns 一、二、三、四、五、六、七、八、九、十、十一、十二
 */
export function chinesenum(en_num:number) {
    if (en_num > 10) {
        var tennum = Math.floor(en_num / 10);
        if (tennum == 1) {
            tennum = 10
        }
        var digits = en_num % 10;
        if (en_num % 10 == 0) {
            digits = 10
        }
        return CnineseNumbermap.get(tennum) + CnineseNumbermap.get(digits)
    } else {
        return CnineseNumbermap.get(en_num)
    }
}