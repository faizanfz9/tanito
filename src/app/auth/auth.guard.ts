import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { UserService } from '../shared/user.service';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  isLoggedIn = false;

  constructor(private router: Router, private authService: AuthService, private userService: UserService) {
    this.authService.user.subscribe(res => {
      this.isLoggedIn = res.isLoggedIn;
    })
    let user = JSON.parse(this.userService.getUser());
    if(user.mobile) {
      if(user.mobile == localStorage.getItem("mobile")) {
        this.isLoggedIn = true;
      }
    }
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if(this.isLoggedIn) {
      return true;
    }else {
      this.router.navigate(['/login']);
      return false;
    }
  }
  
}
