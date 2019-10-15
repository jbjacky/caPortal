import { Component, OnInit, Inject } from '@angular/core';
import { MAT_SNACK_BAR_DATA, MatSnackBarRef } from '@angular/material';

@Component({
  selector: 'app-error-approve-snack',
  templateUrl: './error-approve-snack.component.html',
  styleUrls: ['./error-approve-snack.component.css']
})
export class ErrorApproveSnackComponent implements OnInit {

  constructor(
    public snackBarRef: MatSnackBarRef<ErrorApproveSnackComponent>,
    @Inject(MAT_SNACK_BAR_DATA) public data: any) { }

  ngOnInit() {
  }

}
