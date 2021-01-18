import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

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

  mobile = "";

  constructor(private authService: AuthService, private router: Router, private modalService: BsModalService) { }

  ngOnInit(): void {
  }

  onLogIn(form: NgForm) {
    this.loading = true;
    let credentials: FormData = new FormData;
    credentials.append("mobile", form.value.phone);
    credentials.append("password", form.value.password);
    this.authService.login(credentials).subscribe(res => {
      if(res.status == "false") {
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

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, Object.assign({}, { class: 'tanito' }));
  }


}
