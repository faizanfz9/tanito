import { Component, ElementRef, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { AngularFireAuth } from '@angular/fire/auth';
import { FacebookLoginProvider, GoogleLoginProvider, SocialAuthService } from 'angularx-social-login';
// import firebase from 'firebase/app';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  userType = 3;
  loading = false;
  username = "";
  mobile = "";
  @ViewChild("otpVerify") otpVerifyModal: any;
  @ViewChild("socialAuth") socialAuthModal: any;
  @ViewChild("socialVerify") socialVerifyModal: any;

  socialId: any;
  socialMobile: any;
  socialUser = new FormData();
  modalRef: any;

  constructor(private authService: AuthService, 
    private router: Router, 
    private modalService: BsModalService, 
    private socialAuthService: SocialAuthService,
    public firebaseAuth: AngularFireAuth
    ) { 
    }

  ngOnInit(): void {
  }

  toggleUserType(type: number) {
    this.userType = type;
  }

  onSignUp(form: NgForm) {
    let user: any = new FormData();
    user.append("username", form.value.name);
    user.append("mobile", form.value.phone);
    user.append("email", form.value.email);
    user.append("password", form.value.password);
    user.append("cpassword", form.value.confirmPwd);
    user.append("usertype", this.userType);
    this.username = form.value.name;
    this.mobile = form.value.phone;
    this.loading = true;
    this.authService.register(user).subscribe((res: any) => {
      if(res.status == false) {
        this.loading = false;
        alert(res.msg);
      }else {
        this.loading = false;
        localStorage.setItem('userId', res.data.user_id);
        console.log(res);
        this.openModal(this.otpVerifyModal);
      }
    }, error => {
      console.log(error);
    })
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
        this.authService.sendVerifiedUser(this.mobile, this.userType);
        this.router.navigate(['/profile-setup']);
      }
    })
  }

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, Object.assign({}, { class: 'tanito' }));
  }

  // Social register
  onSocialVerify(digit1: string,  digit2: string, digit3: string, digit4: string) {
    let otp: any = new FormData();
    otp.append("mobile", this.socialMobile);
    otp.append("otp", +(digit1+digit2+digit3+digit4));
    this.loading = true;
    this.authService.verifyOtp(otp).subscribe(res=> {
      if(res.status == "false") {
        this.loading = false;
        alert(res.msg);
      }else {
        this.loading = false;
        this.modalRef.hide();
        this.authService.socialRegister(this.socialUser).subscribe((response: any) => {
          this.authService.storeUser(response.data);
        })
      }
    })
  }

  onSocialAuth(form: NgForm) {
    let mobile = new FormData();
    mobile.append("mobile", form.value.phone);
    mobile.append("social_id", this.socialId);
    this.socialMobile = form.value.phone;

    this.loading = true;
    this.authService.socialAuth(mobile).subscribe((res: any) => {
      this.loading = false;
      if(res.status == false) {
        this.loading = false;
        alert(res.msg);
      }else {
        this.loading = false;
        this.modalRef.hide();
        this.openModal(this.socialVerifyModal);
      }
    })
  }

  signInWithGoogle(): void {
    this.socialAuthService.signIn(GoogleLoginProvider.PROVIDER_ID).then(res => {
      // let user = new FormData();
      this.socialUser.append("username", res.name);
      this.socialUser.append("email", res.email);
      this.socialUser.append("profile_img", res.photoUrl);
      this.socialUser.append("social_id", res.id);
      this.socialUser.append("usertype", this.userType.toString());
      this.socialUser.append("register_from", "G");
      
      this.socialId = res.id;
      this.authService.socialRegister(this.socialUser).subscribe((response: any) => {
        if(response.status == false) {
          this.openModal(this.socialAuthModal);
        }else {
          this.authService.storeUser(response.data);
        }
      })
    })
  }

  signInWithFacebook(): void {
    this.socialAuthService.signIn(FacebookLoginProvider.PROVIDER_ID).then(res => {
      // let user = new FormData();
      this.socialUser.append("username", res.name);
      this.socialUser.append("email", res.email);
      this.socialUser.append("profile_img", res.response.picture.data.url);
      this.socialUser.append("social_id", res.id);
      this.socialUser.append("usertype", this.userType.toString());
      this.socialUser.append("register_from", "F");
      this.socialId = res.id;
      this.authService.socialRegister(this.socialUser).subscribe((response: any) => {
        if(response.status == false) {
          this.openModal(this.socialAuthModal);
        }else {
          this.authService.storeUser(response.data);
        }
      })
    })
  }
}
