import { Injectable, OnDestroy } from '@angular/core';
import { twonav } from '../View/nav/navmore';
import { GetBaseInfoDetailClass } from '../Models/GetBaseInfoDetailClass';

@Injectable({
  providedIn: 'root'
})
export class SwitchUserService {
  
  two_nav: twonav[] =[]

  constructor() {
  }
  

  getTwo_navMenu(){
    return this.two_nav
  }

  setTwo_navMenu(two_nav:twonav[]){
    this.two_nav = JSON.parse(JSON.stringify(two_nav));
  }

}
