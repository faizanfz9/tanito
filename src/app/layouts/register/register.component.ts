import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  userType = 3;

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
  }

  toggleUserType(type: number) {
    this.userType = type;
  }

  onSignUp(form: NgForm) {
    let user = {
      username: form.value.name,
      phone: form.value.phone,
      password: form.value.password,
      cpassword: form.value.confirmPwd,
      usertype: this.userType
    }
    this.authService.register(user).subscribe(res => {
      console.log(res.msg);
    }, error => {
      console.log(error);
    })
  }
}
