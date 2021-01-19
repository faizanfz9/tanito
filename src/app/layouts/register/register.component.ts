import { Component, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

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

  constructor(private authService: AuthService, private router: Router, private modalService: BsModalService) { }

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
    this.authService.register(user).subscribe(res => {
      if(res.status == "false") {
        this.loading = false;
        alert(res.msg);
      }else {
        this.loading = false;
        this.openModal(this.otpVerifyModal);
      }
    }, error => {
      console.log(error);
    })
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
        this.authService.sendVerifiedUser(this.mobile);
        this.router.navigate(['/profile-setup']);
      }
    })
  }

  openModal(template: TemplateRef<any>) {
    this.otpVerifyModal = this.modalService.show(template, Object.assign({}, { class: 'tanito' }));
  }
}
