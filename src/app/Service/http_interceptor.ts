import {
    HttpEvent,
    HttpInterceptor,
    HttpHandler,
    HttpRequest,
    HttpResponse,
    HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { ErrorHandler } from './error_handler';

@Injectable()
export class RequestInterceptor implements HttpInterceptor {

    constructor(
        public errorHandler: ErrorHandler,
    ) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(request)
            .pipe(
                catchError((error: HttpErrorResponse) => {
                    this.errorHandler.handleError(request,error);
                    return throwError(error);
                })
            )
    }
}