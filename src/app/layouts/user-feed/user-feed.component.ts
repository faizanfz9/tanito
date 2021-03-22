import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';
import { ChatService } from 'src/app/shared/chat.service';
import { NotificationService } from 'src/app/shared/notification.service';
import { UserService } from 'src/app/shared/user.service';

@Component({
  selector: 'app-user-feed',
  templateUrl: './user-feed.component.html',
  styleUrls: ['./user-feed.component.scss']
})
export class UserFeedComponent implements OnInit {
  loggedUserId: any;
  loggedUser: any;
  activePlan: any;

  constructor(private userService: UserService, 
    private chatService: ChatService, 
    private notification: NotificationService,
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

  ngOnInit(): void {
    if(new Date().setHours(0,0,0,0) > this.loggedTime) {
      this.authService.logout();
    }
  }

}
