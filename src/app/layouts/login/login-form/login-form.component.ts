import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';
import { BsModalService } from 'ngx-bootstrap/modal';
import { AngularFireAuth } from '@angular/fire/auth';
import { SocialAuthService } from "angularx-social-login";
import { FacebookLoginProvider, GoogleLoginProvider } from "angularx-social-login";
import { response } from 'express';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss']
})
export class LoginFormComponent implements OnInit {

  loading = false;
  showForgotModal = false;
  modalRef: any;
  @ViewChild("otpVerify") otpVerifyModal: any;
  @ViewChild("resetPwd") resetPwdModal: any;
  @ViewChild("signInAsGoogle") signInAsGoogle: any;
  @ViewChild("signInAsFacebook") signInAsFacebook: any;
  showPwd = false;
  showConfirmPwd = false;
  mobile = "";

  constructor(private authService: AuthService, 
   private socialAuthService: SocialAuthService,
   private router: Router,
   private modalService: BsModalService) 
   { }

  ngOnInit(): void {
  }

  onLogIn(form: NgForm) {
    this.loading = true;
    let credentials: FormData = new FormData;
    credentials.append("mobile", form.value.phone);
    credentials.append("password", form.value.password);
    this.authService.login(credentials).subscribe((res: any) => {
      if(res.status == false) {
        this.loading = false;
        alert(res.msg);
      }else {
        this.loading = false;
        this.authService.storeUser(res.data);
      }
    })
  }

  onForgotPwd(form: NgForm) {
    let mobile = new FormData;
    mobile.append("mobile", form.value.phone);
    this.mobile = form.value.phone;
    this.loading = true;
    this.authService.forgotPwd(mobile).subscribe(res => {
      if(res.status == "false") {
        this.loading = false;
        alert(res.msg);
      }else {
        this.loading = false;
        this.modalRef.hide();
        this.openModal(this.otpVerifyModal);
      }
    })
  }

  backToLogin() {
    this.modalRef.hide();
  }

  goToNext(el: HTMLElement) {
    let nextEl = el.nextSibling as HTMLElement;
    let input = el as HTMLInputElement;
    if(nextEl && input.value.length > 0) {
      nextEl.focus();
    }
  }
  
  goToPrev(el: HTMLElement, event: any) {
    let key = event.key; 
    let prevEl = el.previousSibling as HTMLElement;
    let input = el as HTMLInputElement;
    if (key === "Backspace" || key === "Delete") { 
      if(prevEl && input.value == "") {
        prevEl.focus();
      }
    } 
  }

  onVerifyOtp(digit1: string,  digit2: string, digit3: string, digit4: string) {
    let otp: any = new FormData();
    otp.append("mobile", this.mobile);
    otp.append("otp", +(digit1+digit2+digit3+digit4));
    this.loading = true;
    this.authService.verifyOtp(otp).subscribe(res=> {
      if(res.status == "false") {
        this.loading = false;
        alert(res.msg);
      }else {
        this.loading = false;
        this.modalRef.hide();
        this.openModal(this.resetPwdModal);
      }
    })
  }

  onResetPwd(form: NgForm) {
    let newPwd = new FormData;
    newPwd.append("password", form.value.password);
    newPwd.append("cpassword", form.value.cpassword);
    newPwd.append("mobile", this.mobile);
    this.loading = true;
    this.authService.resetPwd(newPwd).subscribe(res => {
      if(res.status == "false") {
        this.loading = false;
        alert(res.msg)
      }else {
        this.loading = false;
        alert(res.msg);
        this.modalRef.hide();
      }
    })
  }

  togglePwd() {
    this.showPwd = !this.showPwd;
  }

  toggleConfirmPwd() {
    this.showConfirmPwd = !this.showConfirmPwd;
  }

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, Object.assign({}, { class: 'tanito' }));
  }

  // Social login
  signInWithGoogle(): void {
    this.socialAuthService.signIn(GoogleLoginProvider.PROVIDER_ID).then(res => {
      let user = new FormData();
      user.append("username", res.name);
      user.append("email", res.email);
      user.append("profile_img", res.photoUrl);
      user.append("social_id", res.id);
      // user.append("usertype", usertype);
      user.append("register_from", "G");
      // this.modalRef.hide();
      this.authService.socialRegister(user).subscribe((response: any) => {
        if(response.status == false) {
          this.router.navigate(['/register']);
        }else {
          this.authService.storeUser(response.data);
        }
      })
    })
  }

  signInWithFacebook(): void {
    this.socialAuthService.signIn(FacebookLoginProvider.PROVIDER_ID).then(res => {
      let user = new FormData();
      user.append("username", res.name);
      user.append("email", res.email);
      user.append("profile_img", res.response.picture.data.url);
      user.append("social_id", res.id);
      // user.append("usertype", usertype);
      user.append("register_from", "F");
      // console.log(res.response.picture.data.url);
      // this.modalRef.hide();
      this.authService.socialRegister(user).subscribe((response: any) => {
        if(response.status == false) {
          this.router.navigate(['/register']);
        }else {
          this.authService.storeUser(response.data);
        }
      })
    })
  }

}
