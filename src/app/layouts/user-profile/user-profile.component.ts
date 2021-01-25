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
  path: any;
  follower: any;
  following: any;
  userAvatar = "assets/images/icons/user_avatar.svg";
  teacherIcon = "assets/images/icons/teacher.png";
  studentIcon = "assets/images/icons/student.png";

  constructor(private userService: UserService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    let userId = new FormData();
    this.id = this.route.snapshot.params.id;
    userId.append("id", this.id);
    this.userService.getUserById(userId).subscribe(res => {
      this.user = res.data.results;
      this.path = res.data.urlkey;
      this.follower = res.data.count_follower;
      this.following = res.data.count_following;
    })
  }

}
