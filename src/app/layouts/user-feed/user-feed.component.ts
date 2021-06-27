import { AfterViewInit, Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { BsModalService } from 'ngx-bootstrap/modal';
import { AuthService } from 'src/app/auth/auth.service';
import { ChatService } from 'src/app/shared/chat.service';
import { NotificationService } from 'src/app/shared/notification.service';
import { UserService } from 'src/app/shared/user.service';

@Component({
  selector: 'app-user-feed',
  templateUrl: './user-feed.component.html',
  styleUrls: ['./user-feed.component.scss']
})
export class UserFeedComponent implements OnInit, AfterViewInit {
  loggedUserId: any;
  loggedUser: any;
  activePlan: any;
  profileAlert = false;
  modalRef: any;
  @ViewChild('profileAlertModal') profileAlertModal: any;

  constructor(private userService: UserService, 
    private chatService: ChatService, 
    private notification: NotificationService,
    private modalService: BsModalService,
    private router: Router,
    private authService: AuthService
    ) { 
    this.loggedUserId = JSON.parse(this.userService.getUser()).id;
    this.chatService.getRooms(this.loggedUserId).valueChanges().subscribe((rooms: any) => {
      let inbox = {
        defaultChatroom: rooms.length > 0 ? +rooms[0].memberId : 0,
        newMsgs: rooms.length > 0 ? rooms.filter((room: any) => room.msgSeen == false).length : 0
      }
      localStorage.setItem("inbox",  JSON.stringify(inbox))
    })

    this.loggedUser = JSON.parse(this.userService.getUser());
    if(this.loggedUser.plan_subcription.length > 0) {
      this.activePlan = this.loggedUser.plan_subcription[0];
      let planEndDate: any = new Date(this.activePlan.end_date);
      let currDate: any = new Date();
      let timeBetween = Math.abs(planEndDate - currDate);
      let dayBetween = Math.ceil(timeBetween / (1000 * 60 * 60 * 24));
      if(dayBetween == 3) {
        this.notification.sendNotification(this.loggedUser.id,  this.loggedUser.profile_img, "Your plan is about to expire in " + dayBetween + " days");
      }
      if(dayBetween == 2) {
        this.notification.sendNotification(this.loggedUser.id,  this.loggedUser.profile_img, "Your plan is about to expire in " + dayBetween + " days");
      }
      if(dayBetween == 1) {
        this.notification.sendNotification(this.loggedUser.id,  this.loggedUser.profile_img, "Your plan is about to expire in " + dayBetween + " days");
      }
    }
  }

  get loggedTime(): any {
    return localStorage.getItem('loggedTime');
  }

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, Object.assign({}, { class: 'tanito' }));
  }

  profileCompleteAlert() {
    let currentTime = new Date().getMinutes();

    if(currentTime > +this.loggedTime + 5) {
      localStorage.setItem("profileAlert", "1");
      this.openModal(this.profileAlertModal);
    } 
  }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    let isAlertShown: any = localStorage.getItem("profileAlert");
    if(!+isAlertShown && !this.loggedUser.gender) {
      this.profileCompleteAlert();
    } 
  }

  initUpdateProfile() {
    this.modalRef.hide();
    this.router.navigate(['/profile-setup']);
  }

}
