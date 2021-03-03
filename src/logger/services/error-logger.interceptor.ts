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
import { ErrorLogItem } from "../model/class/logger-types";
import { LoggerFactory } from "../logger.class";

@Injectable()
export class ErrorLogger implements HttpInterceptor, ErrorHandler {
  public intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        const config = LoggerFactory.getGlobalConfig();
        const logItemClass = new ErrorLogItem(
          error.message,
          error.name,
          config
        );
        this.handleError(logItemClass);
        return throwError(error);
      })
    );
  }

  public handleError(error: ErrorLogItem | Error): Promise<any> {
    return LoggerFactory.error(error);
  }
}
