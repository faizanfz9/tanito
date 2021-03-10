import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ChatService } from 'src/app/shared/chat.service';
import { UserService } from 'src/app/shared/user.service';
import { BsModalService } from 'ngx-bootstrap/modal';
import { AngularFireStorage } from '@angular/fire/storage'
import { VideoProcessingService } from 'src/app/shared/video-processing.service';

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
  @ViewChild("buyPremium") buyPremium: any;
  @ViewChild("chatBox", {static: true}) chatBox: any;
  @ViewChild("fileInput") fileInput: any;
  isFetched = false;
  loading = false;
  showRooms = false;
  file: any;
  fileUrl: any = "";
  vdoRegex = new RegExp(/\.(mp4|avi|mov|wmv|webm|mkv|flv)/g);

  isPlanActive = false;
  profilePath = "https://demo.mbrcables.com/tanito/assets/user-profile/";
  teacherIcon = "assets/images/icons/teacher.png";
  studentIcon = "assets/images/icons/student.png";

  constructor(private chatService: ChatService, 
    private userService: UserService, 
    private storage: AngularFireStorage,
    private videoService: VideoProcessingService,
    private route: ActivatedRoute, 
    private modalService: BsModalService) { 
    this.loggedUserId = JSON.parse(this.userService.getUser()).id;
    this.route.params.subscribe(res => {
      let paramId: any;
      this.showRooms = false;
      paramId = res.id;
        if(paramId) {
          let memberId = new FormData();
          memberId.append("id", paramId);
          this.userService.getUserById(memberId).subscribe(res => {
            this.isFetched = true;
            this.receiver = res.data.results;
          })
          this.loading = true;
          this.onMsgRead(paramId);
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
    let loggedUser = JSON.parse(this.userService.getUser());
    let purchasedPlan = loggedUser.plan_subcription[loggedUser.plan_subcription.length - 1];
    if(purchasedPlan) {
      let planEndDate = new Date(purchasedPlan.end_date);
      let currDate = new Date();
      if(currDate > planEndDate) {
        this.isPlanActive = false;
      }else {
        this.isPlanActive = true;
      }
    }
  }

  onMsgRead(member_id: any) {
    this.chatService.readNewMsg(member_id);
  }

  getFeeds() {
    this.chatService.getMessages(this.chatRoomId).valueChanges().subscribe(res => {
      this.loading = false;  
      this.feeds = res;
      this.scrollToBottom();
    });
  }

  onSendMsg() {
    if(!this.isPlanActive) {
      if(this.chatRooms.length < 5 || this.isRoomFound) {
        if(this.message.length > 0 || this.fileUrl.length > 0) {
          this.chatService.sendMessage(this.message, this.fileUrl, this.chatRoomId);
          this.chatService.createRoom(this.receiver);
          this.message = "";
          this.fileReset();
        }
      }else {
        this.openModal(this.buyPremium);
      }
    }else {
      if(this.message.length > 0 || this.fileUrl.length > 0) {
        this.chatService.sendMessage(this.message, this.fileUrl, this.chatRoomId);
        this.chatService.createRoom(this.receiver);
        this.message = "";
        this.fileReset();
      }
    }
  }

  scrollToBottom() {
    let chatBodyel = this.chatBox.nativeElement.querySelector(".chat_box_body");
    let innerChatBody = chatBodyel.querySelector(".inner-wrap");
    chatBodyel.scrollTop = innerChatBody.offsetHeight;
  }

  openModal(template: TemplateRef<any>) {
    this.modalService.show(template, Object.assign({}, { class: 'tanito' }));
  }

  toggleRooms() {
    this.showRooms = !this.showRooms;
  }

  onSelectFile(event: any) {
    this.file = event.target.files[0];
    if(this.file.name.search(this.vdoRegex) !== -1) {
      this.videoService.generateThumbnail(this.file, false).
      then(res => {
        this.loading = true;
        this.storage.upload(this.file.name, this.file).then(res => {
          res.ref.getDownloadURL().then(url => {
            this.loading = false;
            this.fileUrl = url;
          });
        });
      })
      .catch(error => {
        alert(error);
        this.fileReset();
      })
    }else {
      this.loading = true;
      this.storage.upload(this.file.name, this.file).then(res => {
        res.ref.getDownloadURL().then(url => {
          this.loading = false;
          this.fileUrl = url;
        });
      });
    }
  }

  fileReset() {
    this.file = null;
    this.fileInput.nativeElement.value = "";
    this.fileUrl = "";
  }

}
