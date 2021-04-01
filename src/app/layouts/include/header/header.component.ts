import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';
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
  announcements: any = [];
  newNotifications: any = [];
  newAnnouncements: any = [];
  isRead: any = false;
  profilePath = "https://demo.mbrcables.com/tanito/assets/user-profile/"
  userAvatar = "assets/images/icons/user_avatar.svg";
  teacherIcon = "assets/images/icons/teacher.png";
  studentIcon = "assets/images/icons/student.png";

  constructor(private router: Router, 
    private authService: AuthService,
    private userService: UserService,
    private notificationService: NotificationService) {
    this.authService.user.subscribe(res => {
      this.isLoggedIn = res.isLoggedIn ? res.isLoggedIn : false;
      this.user = res.data;
      this.notificationService.getNotification(this.user == null ? 0 : this.user.id).valueChanges().subscribe(res => {
        this.notifications = res.reverse();
        this.newNotifications = res.filter((item: any) => item.isRead == false);
      })
      this.fetchAnnouncement();
    })
    this.user = JSON.parse(this.userService.getUser());
    this.notificationService.getNotification(this.user == null ? 0 : this.user.id).valueChanges().subscribe(res => {
      this.notifications = res.reverse();
      this.newNotifications = res.filter((item: any) => item.isRead == false);
    })
  }

  ngOnInit(): any {
    let user = JSON.parse(this.userService.getUser());
    if(user) {
      if(user.mobile) {
        this.isLoggedIn = user.mobile == localStorage.getItem("mobile") ? true : false;
      }
      this.fetchAnnouncement();
    }
  }

  fetchAnnouncement() {
    this.notificationService.getAnnouncement().subscribe((res: any) => {
      if(this.user) {
        if(this.user.usertype == 3) {
          this.announcements = res.data.result.reverse().filter((item: any) => item.share == 'S' || item.share == 'A');
        }else {
          this.announcements = res.data.result.reverse().filter((item: any) => item.share == 'T' || item.share == 'A');
        }
        this.newAnnouncements = this.announcements.filter((item: any) => !item.readBy.includes(this.user.id));
      }
    });
  }

  onCheckAnnouncement() {
    let annIdArr: any = [];
    this.newAnnouncements.forEach((item: any) => {
      annIdArr.push(item.id);
    })
    let annUrlArr = this.notificationService.announcementUrlArr(annIdArr, this.user.id);
    setTimeout(()=> {
      forkJoin(annUrlArr).subscribe(results => {
        this.fetchAnnouncement();
      })
    }, 2000)
  }

  onSearchUser(query: any) {
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
