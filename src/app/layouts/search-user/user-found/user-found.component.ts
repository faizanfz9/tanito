import { importExpr } from '@angular/compiler/src/output/output_ast';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NotificationService } from 'src/app/shared/notification.service';
import { UserService } from 'src/app/shared/user.service';

@Component({
  selector: 'app-user-found',
  templateUrl: './user-found.component.html',
  styleUrls: ['./user-found.component.scss']
})
export class UserFoundComponent implements OnInit {
  users: any = [];
  path: any;
  loading = false;
  isFollowed = false;
  loggedUser: any;
  query: any;
  userAvatar = "assets/images/icons/user_avatar.svg";
  teacherIcon = "assets/images/icons/teacher.png";
  studentIcon = "assets/images/icons/student.png";

  constructor(private userService: UserService, private route: ActivatedRoute, private notificationService: NotificationService) { 
    this.loggedUser = JSON.parse(this.userService.getUser());
    this.route.queryParams.subscribe(res => {
      this.query = res.query;
      this.userFound();
    })
    
  }

  onFollowUser(followId: any, index: number) {
    this.loading = true;
    let followMatch = new FormData();
    followMatch.append("user_id", this.userService.loggedUserId())
    followMatch.append("follow_id", followId);
    this.userService.followUser(followMatch).subscribe((res: any) => {
      this.loading = false;
      this.userService.updateUser();
      this.users[index].followed = !this.users[index].followed;
      if(res.followed == "true") {
        this.notificationService.sendNotification(followId, this.loggedUser.profile_img, this.loggedUser.username + " has started following you!");
      }
    })
  }

  ngOnInit() {
    this.query = this.route.snapshot.queryParams.query;
    this.userFound();
  }

  userFound() {
    let queryRequest = new FormData();
    queryRequest.append("query", this.query);
    this.loading = true;
    this.userService.searchUser(queryRequest).subscribe((res: any) => {
      this.loading = false;
      this.users = res.users.filter((item: any) => item.data.profile_img !== null );
      this.path = res.urlkey;
    })
  }
}
