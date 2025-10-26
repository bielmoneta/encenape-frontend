import { HttpEvent, HttpHandlerFn, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service'; // Ajuste o caminho se necessário

// É uma função constante agora
export const jwtInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>, 
  next: HttpHandlerFn 
): Observable<HttpEvent<unknown>> => {

  const authService = inject(AuthService); 
  const token = authService.getToken();
  const isApiUrl = req.url.startsWith('http://localhost:8080/api');

  if (token && isApiUrl) {
    req = req.clone({
      setHeaders: { Authorization: `Bearer ${token}` }
    });
  }
  return next(req);
};