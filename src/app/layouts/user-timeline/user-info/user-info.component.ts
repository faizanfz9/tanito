import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/shared/user.service';

@Component({
  selector: 'app-user-info',
  templateUrl: './user-info.component.html',
  styleUrls: ['./user-info.component.scss']
})
export class UserInfoComponent implements OnInit {
  user: any;
  userAvatar = "assets/images/icons/user.svg";
  teacherIcon = "assets/images/icons/teacher.png";
  studentIcon = "assets/images/icons/student.png";

  constructor(private userService: UserService) { 
    this.user = JSON.parse(this.userService.getUser());
    this.userService.storeUpdatedUser().subscribe(res => {
      this.user.count_following = res.count_following;
      this.user.following_id = res.following_id;
      localStorage.setItem("user", JSON.stringify(this.user));
    })
  }

  ngOnInit(): void {
  }

}
