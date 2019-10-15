import { Component, OnInit, Inject } from '@angular/core';
import { MatSnackBarRef, MAT_SNACK_BAR_DATA } from '@angular/material';

@Component({
  selector: 'app-susses-approve-snack',
  templateUrl: './susses-approve-snack.component.html',
  styleUrls: ['./susses-approve-snack.component.css']
})
export class SussesApproveSnackComponent implements OnInit {

  constructor(
    public snackBarRef: MatSnackBarRef<SussesApproveSnackComponent>,
    @Inject(MAT_SNACK_BAR_DATA) public data: any) { }

  ngOnInit() {
  }

}
