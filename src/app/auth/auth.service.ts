import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Subject } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private url = "https://demo.mbrcables.com/tanito/Api";
  private verifiedUser = new Subject<any>();
  private isLoggedIn = new Subject<boolean>();

  constructor(private http: HttpClient, private router: Router) { }  

  register(user: any) {
    return this.http.post<{status: string, msg: string}>(this.url + "/register", user)
  }

  verifyOtp(otp: any) {
    return this.http.post<{status: string, msg: string}>(this.url + "/otp_verification", otp);
  }

  sendVerifiedUser(username: string, mobile: string) {
    this.verifiedUser.next({ username: username, mobile: mobile });
  }

  getVerifiedUser() {
    return this.verifiedUser.asObservable();
  }

  saveUserInfo(info: any) {
    return this.http.post<{status: string, msg: string, data: any}>(this.url + "/set_your_profile", info);
  }

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
    this.router.navigate(['/userTimeline']);
    this.isLoggedIn.next(true);
  }

  authUser() {
    return this.isLoggedIn.asObservable();
  }
  
  logout() {
    localStorage.clear();
    this.router.navigate(['/']);
    this.isLoggedIn.next(false);
  }

}
