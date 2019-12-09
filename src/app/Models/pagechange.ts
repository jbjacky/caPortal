export class pagechange{
    pageIndex: number = 0;
    pageSize: number = 5;
    lowValue: number = 0;
    highValue: number = 5;
    pageEvent: any;
    getPaginatorData(event) {
      if (event.pageIndex == this.pageIndex + 1) {
        this.lowValue = this.lowValue + this.pageSize;
        this.highValue = this.highValue + this.pageSize;
      }
      else if (event.pageIndex == this.pageIndex - 1) {
        this.lowValue = this.lowValue - this.pageSize;
        this.highValue = this.highValue - this.pageSize;
      }
      this.pageIndex = event.pageIndex;
      // console.log(this.pageIndex)
      // console.log(this.lowValue)
      // console.log(this.highValue)
    }
}