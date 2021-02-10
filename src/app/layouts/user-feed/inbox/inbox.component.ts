import { AfterContentChecked, AfterContentInit, AfterViewChecked, Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { ChatService } from 'src/app/shared/chat.service';
import { UserService } from 'src/app/shared/user.service';

@Component({
  selector: 'app-inbox',
  templateUrl: './inbox.component.html',
  styleUrls: ['./inbox.component.scss']
})
export class InboxComponent implements OnInit{
  feeds: any = [];
  message: any = "";
  profiePath: any;
  chatRoomId: any;
  receiver: any;
  chatRooms: any = [];
  isRoomFound: any;
  loggedUserId: any;
  isFetched = false;
  loading = false;
  profilePath = "https://demo.mbrcables.com/tanito/assets/user-profile/";
  teacherIcon = "assets/images/icons/teacher.png";
  studentIcon = "assets/images/icons/student.png";
  eventsSubject: Subject<void> = new Subject<void>();

  constructor(private chatService: ChatService, private userService: UserService, private route: ActivatedRoute, private router: Router) { 
    this.loggedUserId = JSON.parse(this.userService.getUser()).id;
    this.route.params.subscribe(res => {
      let paramId: any;
      paramId = res.id;
        if(paramId) {
          let memberId = new FormData();
          memberId.append("id", paramId);
          this.userService.getUserById(memberId).subscribe(res => {
            this.isFetched = true;
            this.receiver = res.data.results;
          })
          this.loading = true;
          this.chatService.getRooms(this.loggedUserId).valueChanges().subscribe(res => {
            this.chatRooms = res;
            this.isRoomFound = this.chatRooms.some((item: any) => item.memberId == paramId);
            if(this.isRoomFound) {
              let chatRoom = this.chatRooms.find((item: any) => item.memberId == paramId);
              this.chatRoomId = chatRoom.chatId;
            }else {
              this.chatRoomId = paramId + "&" + this.loggedUserId;
            }
            this.getFeeds();
          })
        } 
    })
  }

  ngOnInit(): void { 
  }

  onMsgRead(member_id: any) {
    this.chatService.readNewMsg(member_id);
  }

  getFeeds() {
    this.chatService.getMessages(this.chatRoomId).valueChanges().subscribe(res => {
      this.loading = false;  
      this.feeds = res;
      this.eventsSubject.next();
    });
  }

  onSendMsg() {
    if(this.chatRooms.length < 5 || this.isRoomFound) {
      if(this.message.length > 0) {
        this.chatService.sendMessage(this.message, this.chatRoomId);
        this.chatService.createRoom(this.receiver);
        this.message = "";
      }
    }else {
      alert("You have used your free message credit limit. Now explore our premium plans!");
    }
  }

}
