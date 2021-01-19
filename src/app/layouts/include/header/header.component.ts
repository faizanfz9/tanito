import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';
import { UserService } from 'src/app/shared/user.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  isLoggedIn = false;
  userPic = "";

  constructor(private router: Router, private authService: AuthService, private userService: UserService) {
    this.authService.authUser().subscribe(res => {
      this.isLoggedIn = res;
    })
    this.userPic = JSON.parse(this.userService.getUser()).profile_img
  }

  ngOnInit(): void {
    if(localStorage.getItem("user")) {
      this.isLoggedIn = true;
    }
  }

  onLogOut(event: Event) {
    var r = confirm("Do you want to logout?");
      if (r == true) {
        event.preventDefault()
      this.authService.logout();
      }
  }

}
