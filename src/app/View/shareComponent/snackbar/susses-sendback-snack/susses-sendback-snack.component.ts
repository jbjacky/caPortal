import { Component, OnInit, Inject } from '@angular/core';
import { MatSnackBarRef, MAT_SNACK_BAR_DATA } from '@angular/material';

@Component({
  selector: 'app-susses-sendback-snack',
  templateUrl: './susses-sendback-snack.component.html',
  styleUrls: ['./susses-sendback-snack.component.css']
})
export class SussesSendbackSnackComponent implements OnInit {

  constructor(
    public snackBarRef: MatSnackBarRef<SussesSendbackSnackComponent>,
    @Inject(MAT_SNACK_BAR_DATA) public data: any) { }

  ngOnInit() {
  }

}
