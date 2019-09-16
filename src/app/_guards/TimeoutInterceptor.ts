import { Inject, Injectable, InjectionToken } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { timeout } from 'rxjs/operators';
declare var TimeOut
// export const DEFAULT_TIMEOUT = new InjectionToken<number>('defaultTimeout');

@Injectable()
export class TimeoutInterceptor implements HttpInterceptor {
    // constructor(@Inject(DEFAULT_TIMEOUT) protected defaultTimeout: number) {
    // }  
    defaultTimeout: number
    constructor() {
    }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        this.defaultTimeout = TimeOut
        const timeoutValue = Number(req.headers.get('timeout')) || this.defaultTimeout;
        // console.log(this.defaultTimeout)
        return next.handle(req).pipe(timeout(timeoutValue));
    }
}