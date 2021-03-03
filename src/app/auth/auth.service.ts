import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { BehaviorSubject, Subject } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private url = "https://demo.mbrcables.com/tanito/Api";
  // isLoggedIn = new Subject<boolean>();
  user = new BehaviorSubject<any>({});

  constructor(private http: HttpClient, private router: Router) { }  

  // User Registration
  register(user: any) {
    return this.http.post<{status: string, msg: string}>(this.url + "/register", user)
  }

  verifyOtp(otp: any) {
    return this.http.post<{status: string, msg: string}>(this.url + "/otp_verification", otp);
  }

  sendVerifiedUser(mobile: string, userType: any) {
   localStorage.setItem("verifiedUser", JSON.stringify({mobile: mobile, userType: userType}));
  }

  getVerifiedUser(): any {
    return localStorage.getItem("verifiedUser");
  }

  saveUserInfo(info: any) {
    return this.http.post<{status: string, msg: string, data: any}>(this.url + "/set_your_profile", info);
  }

  // User Login
  login(credentials: any) {
    return this.http.post<{status: string, msg: string, data: any}>(this.url + "/signin", credentials);
  }

  forgotPwd(mobile: any) {
    return this.http.post<{status: string, msg: string}>(this.url + "/forget_password", mobile);
  }

  resetPwd(newPwd: any) {
    return this.http.post<{status: string, msg: string}>(this.url + "/set_new_password", newPwd);
  }

  storeUser(user: any) {
    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("mobile", user.mobile);
    this.router.navigate(['/feed']);
    this.user.next({
      isLoggedIn: true,
      data: user
    })
  }

  authUser() {
    return this.user.asObservable();
  }
  
  logout() {
    localStorage.clear();
    this.router.navigate(['/']);
    this.user.next({
      isLoggedIn: false,
      data: null
    });
  }

}
