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
  receiver: any;
  chatRooms: any = [];
  loggedUserId: any;
  isFetched = false;
  loading = false;
  profilePath = "http://demo.mbrcables.com/tanito/assets/user-profile/";
  teacherIcon = "assets/images/icons/teacher.png";
  studentIcon = "assets/images/icons/student.png";

  constructor(private chatService: ChatService, private userService: UserService, private route: ActivatedRoute) { 
    this.loggedUserId = JSON.parse(this.userService.getUser()).id;
   this.route.params.subscribe(res => {
      let paramId = res.id;
      let memberId = new FormData();
      memberId.append("id", paramId);
      this.userService.getUserById(memberId).subscribe(res => {
        this.isFetched = true;
        this.receiver = res.data.results;
      })
      this.loading = true;
      this.chatService.getRooms(this.loggedUserId).valueChanges().subscribe(res => {
        this.chatRooms = res;
        let isRoomFound = this.chatRooms.some((item: any) => item.memberId == paramId)
        if(isRoomFound) {
          this.chatRoomId = this.chatRooms.find((item: any) => item.memberId == paramId).chatId
          this.getFeeds();
        }else {
          this.loading = false; 
        }
      })
   })
  }

  ngOnInit(): void {
  }

  getFeeds() {
    this.chatService.getMessages(this.chatRoomId).valueChanges().subscribe(res => {
      this.loading = false;  
      this.feeds = res;
    });
  }

  onSendMsg() {
    this.chatService.sendMessage(this.message, this.chatRoomId);
    this.message = "";
    this.chatService.createRoom(this.receiver);
  }

}
