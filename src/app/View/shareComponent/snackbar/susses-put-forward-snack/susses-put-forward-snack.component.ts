import { Component, OnInit, Inject } from '@angular/core';
import { MatSnackBarRef, MAT_SNACK_BAR_DATA } from '@angular/material';

@Component({
  selector: 'app-susses-put-forward-snack',
  templateUrl: './susses-put-forward-snack.component.html',
  styleUrls: ['./susses-put-forward-snack.component.css']
})
export class SussesPutForwardSnackComponent implements OnInit {

  constructor(
    public snackBarRef: MatSnackBarRef<SussesPutForwardSnackComponent>,
    @Inject(MAT_SNACK_BAR_DATA) public data: any) { }

  ngOnInit() {
  }

}
