import { Component, OnInit, Inject } from '@angular/core';
import { MatSnackBarRef, MAT_SNACK_BAR_DATA } from '@angular/material';

@Component({
  selector: 'app-error-put-forward-snack',
  templateUrl: './error-put-forward-snack.component.html',
  styleUrls: ['./error-put-forward-snack.component.css']
})
export class ErrorPutForwardSnackComponent implements OnInit {

  constructor(
    public snackBarRef: MatSnackBarRef<ErrorPutForwardSnackComponent>,
    @Inject(MAT_SNACK_BAR_DATA) public data: any) { }

  ngOnInit() {
  }

}
