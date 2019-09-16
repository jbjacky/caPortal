import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { GetApiUserService } from '../Service/get-api-user.service';

@Injectable()
export class TestGuard implements CanActivate {

    constructor(private router: Router,
        private GetApiUserService: GetApiUserService, ) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        // this.GetApiUserService.counter$.subscribe(x => {
        //     if (x.EmpCode != '051005') {
        //         this.router.navigate(["nav/"]);
        //         return false
        //     }
        // })



        // if(this.GetApiUserService.NowUseEmpID == '051005'){
        //     alert('沒有權限')
        //     this.router.navigate(["nav/"]);
        //     return true;
        // }else{
        //     return false;
        // }

        return false
    }
}