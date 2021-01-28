import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from 'src/app/shared/user.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {
  user: any;
  id: any;
  loggedUser: any;
  followed: any;
  loading = false;
  userAvatar = "assets/images/icons/user_avatar.svg";
  teacherIcon = "assets/images/icons/teacher.png";
  studentIcon = "assets/images/icons/student.png";

  constructor(private userService: UserService, private route: ActivatedRoute) { 
    this.loggedUser = JSON.parse(this.userService.getUser());
    this.userService.storeUpdatedUser().subscribe(res => {
      this.loggedUser.count_following = res.count_following;
      this.loggedUser.following_id = res.following_id;
      localStorage.setItem("user", JSON.stringify(this.loggedUser));
      this.getUserProfile();
    })
  }

  onFollowUser() {
    let followMatch = new FormData();
    followMatch.append("user_id", this.userService.loggedUserId())
    followMatch.append("follow_id", this.id);
    this.userService.followUser(followMatch).subscribe(res => {
      this.userService.updateUser();
    })
  }

  getUserProfile() {
    let userId = new FormData();
    this.id = this.route.snapshot.params.id;
    userId.append("id", this.id);
    this.loading = true;
    this.userService.getUserById(userId).subscribe(res => {
      this.loading = false;
      this.user = res;
      this.followed = this.loggedUser.following_id.some((user: any) => user.follower == this.id);
    })
  }

  ngOnInit(): void {
    this.getUserProfile();
  }

}
