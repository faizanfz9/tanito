import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { UserService } from 'src/app/shared/user.service';

@Component({
  selector: 'app-chatroom',
  templateUrl: './chatroom.component.html',
  styleUrls: ['./chatroom.component.scss']
})
export class ChatroomComponent implements OnInit {
  @Input() chatFeeds: any;
  @Input() events: any;
  loggedUserId: any;
  imgRegex = new RegExp(/\.(gif|jpe?g|tiff?|png|webp|bmp)/g);
  vdoRegex = new RegExp(/\.(mp4|avi|mov|wmv|webm|mkv|flv)/g);
  teacherIcon = "assets/images/icons/teacher.png";
  studentIcon = "assets/images/icons/student.png";

  constructor(private userService: UserService) {
    this.loggedUserId = JSON.parse(this.userService.getUser()).id;
  }

  ngOnInit(): void {
    // this.events.subscribe(() => this.scrollToBottom());
  }

  scrollToBottom() {
    // let chatBodyel = this.chatBody.nativeElement;
    // let innerChatBody = chatBodyel.children[0]; 
    // chatBodyel.scrollTop = 80 + innerChatBody.offsetHeight;
  }

}
