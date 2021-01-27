import { Component, OnInit } from '@angular/core';
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

  constructor(private userService: UserService) { 
    this.loggedUser = JSON.parse(this.userService.getUser());
    this.userService.fetchAllUser().subscribe(res => {
      this.users = res.users;
      this.path = res.urlkey;
    })
  }

  onFollowUser(followId: any, index: number) {
    this.loading = true;
    let followMatch = new FormData();
    followMatch.append("user_id", this.userService.loggedUserId())
    followMatch.append("follow_id", followId);
    this.userService.followUser(followMatch).subscribe(res => {
      this.loading = false;
      this.userService.updateUser();
      this.users[index].followed = !this.users[index].followed;
    })
  }

  ngOnInit(): void {
  }

}
