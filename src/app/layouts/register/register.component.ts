import { Component, ElementRef, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { AngularFireAuth } from '@angular/fire/auth';
// import firebase from 'firebase/app';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  userType = 2;
  loading = false;
  username = "";
  mobile = "";
  @ViewChild("otpVerify") otpVerifyModal: any;

  constructor(private authService: AuthService, private router: Router, private modalService: BsModalService, 
    public firebaseAuth: AngularFireAuth
    ) { 
    }

  ngOnInit(): void {
    console.log(this.userType);
  }

  toggleUserType(type: number) {
    this.userType = type;
    // console.log(this.userType);
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
        this.openModal(this.otpVerifyModal);
        console.log(res);
        // this.firebaseRegister(form.value.email, form.value.password);
      }
    }, error => {
      console.log(error);
    })
  }

  // firebaseRegister(email: any, pwd: any) {
  //   return this.firebaseAuth.createUserWithEmailAndPassword(email, pwd)
  //   .then((result: any) => {
  //     console.log(result);
  //   }).catch((error: any) => {
  //     console.log(error);
  //   })
  // }

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
        this.otpVerifyModal.hide();
        this.authService.sendVerifiedUser(this.mobile, this.userType);
        this.router.navigate(['/profile-setup']);
      }
    })
  }

  openModal(template: TemplateRef<any>) {
    this.otpVerifyModal = this.modalService.show(template, Object.assign({}, { class: 'tanito' }));
  }
}
