import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
 const router= inject(Router);
 const token = document.cookie.match(new RegExp('(^| )token=([^;]+)'));
 if(token){
  return true;
 }
 else{
  router.navigate(['/login']);
  return false;
 }
};
