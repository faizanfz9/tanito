import { AfterContentChecked, Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/shared/user.service';

@Component({
  selector: 'app-user-info',
  templateUrl: './user-info.component.html',
  styleUrls: ['./user-info.component.scss']
})
export class UserInfoComponent implements OnInit, AfterContentChecked {
  user: any;
  loggedUserId: any;
  myInbox: any;
  subjects: any = [];
  userAvatar = "assets/images/icons/user.svg";
  teacherIcon = "assets/images/icons/teacher.png";
  studentIcon = "assets/images/icons/student.png";

  constructor(private userService: UserService) { 
    this.user = JSON.parse(this.userService.getUser());
    this.loggedUserId = JSON.parse(this.userService.getUser()).id;
    this.userService.storeUpdatedUser().subscribe(res => {
      this.user.count_following = res.count_following;
      this.user.following_id = res.following_id;
      localStorage.setItem("user", JSON.stringify(this.user));
    })
  }

  get inbox(): any {
    return localStorage.getItem("inbox");
  }

  ngOnInit(): void {
    this.userService.getSubjects().subscribe((res: any) => {
      res.data.subjects.forEach((item: any) => {
        this.subjects.push(item.subject);
      })
    })
  }

  ngAfterContentChecked() {
    if(this.inbox) {
      this.myInbox = JSON.parse(this.inbox);
    }else {
      this.myInbox = {
        defaultChatroom: 0,
        newMsgs: 0
      };
    }
  }

}
