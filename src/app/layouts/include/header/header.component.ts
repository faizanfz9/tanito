import { Component, OnInit, ViewChild } from '@angular/core';
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
  @ViewChild("query") query: any;
  user: any;

  constructor(private router: Router, private authService: AuthService, private userService: UserService) {
    this.authService.authUser().subscribe(res => {
      this.isLoggedIn = res;
      this.user = JSON.parse(this.userService.getUser());
    })
    this.user = JSON.parse(this.userService.getUser());
  }

  ngOnInit(): void {
    if(localStorage.getItem("user")) {
      this.isLoggedIn = true;
    }
  }

  onSearchUser() {
    let query = this.query.nativeElement.value;
    if(query.length > 0) {
      this.router.navigate(['/search-user'], { queryParams: { query: query}});
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
