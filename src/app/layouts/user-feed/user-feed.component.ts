import { Component, OnInit } from '@angular/core';
import { ChatService } from 'src/app/shared/chat.service';
import { UserService } from 'src/app/shared/user.service';

@Component({
  selector: 'app-user-feed',
  templateUrl: './user-feed.component.html',
  styleUrls: ['./user-feed.component.scss']
})
export class UserFeedComponent implements OnInit {
  loggedUserId: any;

  constructor(private userService: UserService, private chatService: ChatService) { 
    this.loggedUserId = JSON.parse(this.userService.getUser()).id;
    this.chatService.getRooms(this.loggedUserId).valueChanges().subscribe((rooms: any) => {
      let inbox = {
        defaultChatroom: rooms.length > 0 ? +rooms[0].memberId : 0,
        newMsgs: rooms.length > 0 ? rooms.filter((room: any) => room.msgSeen == false).length : 0
      }
      localStorage.setItem("inbox",  JSON.stringify(inbox))
    })
  }

  ngOnInit(): void {
  }

}
