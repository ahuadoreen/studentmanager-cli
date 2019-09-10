import { Injectable } from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class LoginGuard implements CanActivate {
  constructor(private router: Router) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    let isLogin: boolean;
    // 判断用户是否登入
    const token = sessionStorage.getItem('token');
    if (!token) {
      isLogin = false;
      // 未登入跳转到登入界面
      this.router.navigateByUrl('/login');
    } else {
      isLogin = true;
    }
    return isLogin;
  }
}
