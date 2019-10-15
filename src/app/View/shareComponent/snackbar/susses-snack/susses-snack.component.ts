import { Component, OnInit, Inject } from '@angular/core';
import { MatSnackBarRef, MAT_SNACK_BAR_DATA } from '@angular/material';

@Component({
  selector: 'app-susses-snack',
  templateUrl: './susses-snack.component.html',
  styleUrls: ['./susses-snack.component.css']
})
export class SussesSnackComponent implements OnInit {

  constructor(
    public snackBarRef: MatSnackBarRef<SussesSnackComponent>,
    @Inject(MAT_SNACK_BAR_DATA) public data: any) { }

  ngOnInit() {
  }

}
