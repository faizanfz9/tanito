import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/shared/user.service';

@Component({
  selector: 'app-my-profile',
  templateUrl: './my-profile.component.html',
  styleUrls: ['./my-profile.component.scss']
})
export class MyProfileComponent implements OnInit {
  user: any;
  userAvatar = "assets/images/icons/user_avatar.svg";
  teacherIcon = "assets/images/icons/teacher.png";
  studentIcon = "assets/images/icons/student.png";

  constructor(private userService: UserService) { }

  ngOnInit(): void {
    this.user = JSON.parse(this.userService.getUser());
  }

}
