import { MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from "@angular/material";

export const SnackSetting:SnackSettingClass = {
    verticalPosition: 'bottom',
    horizontalPosition: 'right',
    duration: 2000
};
class SnackSettingClass{
    verticalPosition: MatSnackBarVerticalPosition;
    horizontalPosition:   MatSnackBarHorizontalPosition;
    duration: number
}