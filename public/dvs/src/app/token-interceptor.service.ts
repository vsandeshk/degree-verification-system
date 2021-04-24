import { Injectable, Injector } from '@angular/core';
import { HttpInterceptor } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class TokenInterceptorService implements HttpInterceptor {

  constructor(private injector: Injector) { }

  intercept(req, next) {
  //  let authService = this.injector.get(AuthService);

  let token = localStorage.getItem("token");

    let tokenizedRequest = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    return next.handle(tokenizedRequest);
  }

}
