import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ChatService } from 'src/app/shared/chat.service';
import { UserService } from 'src/app/shared/user.service';

@Component({
  selector: 'app-user-info',
  templateUrl: './user-info.component.html',
  styleUrls: ['./user-info.component.scss']
})
export class UserInfoComponent implements OnInit {
  user: any;
  loggedUserId: any;
  defaultChatroom: any;
  userAvatar = "assets/images/icons/user.svg";
  teacherIcon = "assets/images/icons/teacher.png";
  studentIcon = "assets/images/icons/student.png";

  constructor(private userService: UserService, private chatService: ChatService, private router: Router) { 
    this.user = JSON.parse(this.userService.getUser());
    this.loggedUserId = JSON.parse(this.userService.getUser()).id;
    this.userService.storeUpdatedUser().subscribe(res => {
      this.user.count_following = res.count_following;
      this.user.following_id = res.following_id;
      localStorage.setItem("user", JSON.stringify(this.user));
    })
  }

  ngOnInit(): void {
    this.chatService.getRooms(this.loggedUserId).valueChanges().subscribe((rooms: any) => {
      if(rooms.length > 0) {
        this.defaultChatroom = rooms[0].memberId;
      }else {
        this.defaultChatroom = undefined
      }
    })
  }

}
