import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  isLoggedIn = false;

  constructor(private router: Router, private authService: AuthService) {
    this.authService.authUser().subscribe(res => {
      this.isLoggedIn = res;
    })
  }

  ngOnInit(): void {
    if(localStorage.getItem("user")) {
      this.isLoggedIn = true;
    }
  }

  onLogOut(event: Event) {
    event.preventDefault()
    this.authService.logout();
  }

}
