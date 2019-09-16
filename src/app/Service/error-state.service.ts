import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ErrorStateService {

  errorState:number = 0
  constructor() { }
}
