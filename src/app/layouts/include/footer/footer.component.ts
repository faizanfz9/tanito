import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';
import { UserService } from 'src/app/shared/user.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {
  isLoggedIn: any;

  constructor(private userService: UserService, private authService: AuthService) { 
    this.authService.user.subscribe(res => {
      this.isLoggedIn = res.isLoggedIn ? res.isLoggedIn : false;
    })
  }

  ngOnInit(): void {
    let user = JSON.parse(this.userService.getUser());
    if(user) {
      if(user.mobile) {
        this.isLoggedIn = user.mobile == localStorage.getItem("mobile") ? true : false;
      }
    }
  }

}
