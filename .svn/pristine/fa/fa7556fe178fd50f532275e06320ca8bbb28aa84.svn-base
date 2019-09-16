
import {MatPaginatorIntl} from '@angular/material';
export class MatPaginatorIntlCro extends MatPaginatorIntl {
  nextPageLabel     = ''; //下一頁的tooltip不顯示
  previousPageLabel = '';//上一頁的tooltip不顯示

  getRangeLabel = function (page, pageSize, length) {
    if (length === 0 || pageSize === 0) {
      return  length+'筆資料';
    }
    length = Math.max(length, 0);
    const startIndex = page * pageSize;
    // If the start index exceeds the list length, do not try and fix the end index to the end.
    const endIndex = startIndex < length ?
      Math.min(startIndex + pageSize, length) :
      startIndex + pageSize;
    return '第'+(startIndex + 1) + '-' + endIndex + '筆，共' + length +'筆';
  };

}