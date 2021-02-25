import { Component, OnInit } from '@angular/core';
import { NotificationService } from 'src/app/shared/notification.service';
import { UserService } from 'src/app/shared/user.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {
  users: any;
  path: any;
  loading = false;
  isFollowed = false;
  loggedUser: any;
  userAvatar = "assets/images/icons/user_avatar.svg";
  teacherIcon = "assets/images/icons/teacher.png";
  studentIcon = "assets/images/icons/student.png";

  constructor(private userService: UserService, private notificationService: NotificationService) { 
    this.loggedUser = JSON.parse(this.userService.getUser());
    this.userService.fetchAllUser().subscribe(res => {
      this.users = res.users;
      this.path = res.urlkey;
    })
  }

  onFollowUser(followId: any, userPic: any, index: number) {
    this.loading = true;
    let followMatch = new FormData();
    followMatch.append("user_id", this.userService.loggedUserId())
    followMatch.append("follow_id", followId);
    this.userService.followUser(followMatch).subscribe((res: any) => {
      this.loading = false;
      this.userService.updateUser();
      this.users[index].followed = !this.users[index].followed;
      console.log(res);
      if(res.followed == "true") {
        this.notificationService.sendNotification(followId, userPic, this.loggedUser.username + " has started following you!");
      }
    })
  }

  ngOnInit(): void {
  }

}
