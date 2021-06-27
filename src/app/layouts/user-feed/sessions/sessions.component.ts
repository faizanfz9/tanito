import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/shared/user.service';

@Component({
  selector: 'app-sessions',
  templateUrl: './sessions.component.html',
  styleUrls: ['./sessions.component.scss']
})
export class SessionsComponent implements OnInit {
  sessions: any;

  constructor(private userService: UserService, private router: Router) { }

  ngOnInit(): void {
    let loggedUserId: any = this.userService.loggedUserId();

    let userId = new FormData();
    userId.append("user_id", loggedUserId);
    this.userService.getSessions(userId).subscribe((res: any) => {
      this.sessions = res.data;
    })
  }

  startSession(session: any) {
    let sessionStartTime = new Date(session.date + " " + session.start_time);
    let sessionEndTime = new Date(session.date + " " + session.end_time);
    let currentTime = new Date();
    if(currentTime > sessionStartTime && currentTime < sessionEndTime) {
      this.router.navigate(['/feed/inbox/' + session.member_id]);
    }else if(currentTime > sessionEndTime) {
      alert("Session has been expired!")
    }else {
      alert("Session has not been started yet!")
    }
  }

}
