import { Component, OnInit } from '@angular/core';
import { ChatService } from 'src/app/shared/chat.service';
import { UserService } from 'src/app/shared/user.service';

@Component({
  selector: 'app-inbox',
  templateUrl: './inbox.component.html',
  styleUrls: ['./inbox.component.scss']
})
export class InboxComponent implements OnInit {
  feeds: any = [];
  message: any = "";
  profiePath: any;
  chatMembers: any;

  constructor(private chatService: ChatService, private userService: UserService) { 
  }

  ngOnInit(): void {
    this.chatService.getMessages().valueChanges().subscribe(res => {
      this.feeds = res;
      console.log(this.feeds);
    });
    this.userService.fetchAllUser().subscribe((res: any) => {
      this.profiePath = res.urlkey;
      this.chatMembers = res.users;
    })
  }

  onSendMsg() {
    this.chatService.sendMessage(this.message);
    this.message = "";
  }

}
