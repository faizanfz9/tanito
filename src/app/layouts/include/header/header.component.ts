import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';
import { NotificationService } from 'src/app/shared/notification.service';
import { UserService } from 'src/app/shared/user.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  isLoggedIn = false;
  showMenu = false;
  @ViewChild("query") query: any;
  user: any;
  notifications: any = [];
  showNotification = false;
  showDropdown = false;

  constructor(private router: Router, 
    private authService: AuthService, 
    private userService: UserService,
    private notificationService: NotificationService) {
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

    let loggedUserId = JSON.parse(this.userService.getUser()).id;
    this.notificationService.getNotification(loggedUserId).valueChanges().subscribe(res => {
      this.notifications = res;
    })
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
      this.showDropdown = false;
      }
  }

  toggleMenu() {
    this.showMenu = !this.showMenu; 
  }

}
