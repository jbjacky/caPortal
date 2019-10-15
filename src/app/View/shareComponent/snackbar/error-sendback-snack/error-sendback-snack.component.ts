import { Component, OnInit, Inject } from '@angular/core';
import { MatSnackBarRef, MAT_SNACK_BAR_DATA } from '@angular/material';

@Component({
  selector: 'app-error-sendback-snack',
  templateUrl: './error-sendback-snack.component.html',
  styleUrls: ['./error-sendback-snack.component.css']
})
export class ErrorSendbackSnackComponent implements OnInit {

  constructor(
    public snackBarRef: MatSnackBarRef<ErrorSendbackSnackComponent>,
    @Inject(MAT_SNACK_BAR_DATA) public data: any) { }

  ngOnInit() {
  }

}
