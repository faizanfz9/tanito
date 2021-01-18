import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Subject } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private verifiedUser = new Subject<any>();
  private isLoggedIn = new Subject<boolean>();

  constructor(private http: HttpClient, private router: Router) { }  

  register(user: any) {
    return this.http.post<{status: string, msg: string}>("https://demo.mbrcables.com/tanito/Api/register", user)
  }

  verifyOtp(otp: any) {
    return this.http.post<{status: string, msg: string}>("http://demo.mbrcables.com/tanito/Api/otp_verification", otp);
  }

  sendVerifiedUser(username: string, mobile: string) {
    this.verifiedUser.next({ username: username, mobile: mobile });
  }

  getVerifiedUser() {
    return this.verifiedUser.asObservable();
  }

  saveUserInfo(info: any) {
    return this.http.post<{status: string, msg: string, data: any}>("http://demo.mbrcables.com/tanito/Api/set_your_profile", info);
  }

  login(credentials: any) {
    return this.http.post<{status: string, msg: string, data: any}>("http://demo.mbrcables.com/tanito/Api/signin", credentials);
  }

  forgotPwd(mobile: any) {
    return this.http.post<{status: string, msg: string}>("http://demo.mbrcables.com/tanito/Api/forget_password", mobile);
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
