import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  userType = 3;
  isSuccess = false;
  username = "";
  mobile = "";

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
  }

  toggleUserType(type: number) {
    this.userType = type;
  }

  onSignUp(form: NgForm) {
    let user: any = new FormData();
    user.append("username", form.value.name);
    user.append("mobile", form.value.phone);
    user.append("password", form.value.password);
    user.append("cpassword", form.value.confirmPwd);
    user.append("usertype", this.userType);
    this.username = form.value.name;
    this.mobile = form.value.phone;
    this.authService.register(user).subscribe(res => {
      if(res.status == "false") {
        alert(res.msg);
      }else {
        this.isSuccess = true;
      }
    }, error => {
      console.log(error);
    })
  }
  
  onVerifyOtp(digit1: string,  digit2: string, digit3: string, digit4: string) {
    let otp: any = new FormData();
    otp.append("mobile", this.mobile);
    otp.append("otp", +(digit1+digit2+digit3+digit4));
    this.authService.verifyOtp(otp).subscribe(res=> {
      if(res.status == "false") {
        alert(res.msg);
      }else {
        this.authService.sendVerifiedUser(this.username, this.mobile);
        this.router.navigate(['/profile-setup']);
      }
    })
  }
}
