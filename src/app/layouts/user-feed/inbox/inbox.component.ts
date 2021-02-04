import { AfterContentChecked, AfterContentInit, AfterViewChecked, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
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
  chatRoomId: any;
  chatMember: any;
  chatRooms: any = [];
  loggedUserId: any;
  isFetched = false;
  profilePath = "http://demo.mbrcables.com/tanito/assets/user-profile/";
  teacherIcon = "assets/images/icons/teacher.png";
  studentIcon = "assets/images/icons/student.png";

  constructor(private chatService: ChatService, private userService: UserService, private route: ActivatedRoute) { 
    this.loggedUserId = JSON.parse(this.userService.getUser()).id;
   this.chatRoomId = this.route.snapshot.params.id;
   this.route.params.subscribe(res => {
      this.chatRoomId = res.id;
      let memberId = new FormData();
      memberId.append("id", this.chatRoomId);
      this.userService.getUserById(memberId).subscribe(res => {
        this.isFetched = true;
        this.chatMember = res.data.results;
      })
      this.getFeeds();
   })
  }

  ngOnInit(): void {
    this.getFeeds();
    this.chatService.getRooms().valueChanges().subscribe(res => {
      this.chatRooms = res;
    })
  }

  getFeeds() {
    this.chatService.getMessages(this.chatRoomId).valueChanges().subscribe(res => {
      this.feeds = res;
    });
  }

  onSendMsg() {
    this.chatService.sendMessage(this.message, this.chatRoomId);
    this.message = "";
  }

}
