import { Component, Input, OnInit } from '@angular/core';
import { UserService } from 'src/app/shared/user.service';

@Component({
  selector: 'app-chatroom',
  templateUrl: './chatroom.component.html',
  styleUrls: ['./chatroom.component.scss']
})
export class ChatroomComponent implements OnInit {
  @Input() chatFeeds: any;
  loggedUserId: any;

  constructor(private userService: UserService) {
    this.loggedUserId = JSON.parse(this.userService.getUser()).id;
    console.log(this.loggedUserId);
  }

  ngOnInit(): void {
  }

}
