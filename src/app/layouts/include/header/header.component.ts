import { Component, OnInit, ViewChild } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
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
  newNotifications: any = [];
  isRead: any = false;

  constructor(private router: Router, 
    private authService: AuthService, 
    private afAuth: AngularFireAuth,
    private userService: UserService,
    private notificationService: NotificationService) {
    this.authService.user.subscribe(res => {
      this.isLoggedIn = res.isLoggedIn;
      this.user = res.data;
      this.afAuth.authState.subscribe(auth => {
        if(auth !== undefined && auth !== null) {
           this.notificationService.getNotification(this.user == null ? 0 : this.user.id).valueChanges().subscribe(res => {
            this.notifications = res.reverse();
            this.newNotifications = res.filter((item: any) => item.isRead == false);
          })
        }
      })
    })
    this.user = JSON.parse(this.userService.getUser());
  }

  ngOnInit(): any {
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

  onCheckNotification() {
    setTimeout(()=> {
      this.notificationService.readNotification();
    }, 2000)
  }

  toggleMenu() {
    this.showMenu = !this.showMenu; 
  }

}
