import { HttpInterceptorFn } from '@angular/common/http';

export const requestsInterceptorInterceptor: HttpInterceptorFn = (req, next) => {
  console.log(req);
  return next(req);
};
