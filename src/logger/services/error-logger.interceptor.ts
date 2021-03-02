import { ErrorHandler, Injectable } from "@angular/core";
import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest
} from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { catchError } from "rxjs/operators";
import { Logger } from "../model";
import { ErrorLogItem } from "../model/class/logger-types";

@Injectable()
export class ErrorLogger implements HttpInterceptor, ErrorHandler {
  public intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        const logItemClass = new ErrorLogItem(
          error.message,
          error.name,
          Logger.getRootConfig()
        );
        this.handleError(logItemClass);
        return throwError(error);
      })
    );
  }

  public handleError(error: ErrorLogItem | Error): Promise<any> {
    return Logger.error(error);
  }
}
