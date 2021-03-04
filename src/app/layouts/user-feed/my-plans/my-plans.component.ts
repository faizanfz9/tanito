import { Component, OnInit } from '@angular/core';
import { NotificationService } from 'src/app/shared/notification.service';
import { UserService } from 'src/app/shared/user.service';

@Component({
  selector: 'app-my-plans',
  templateUrl: './my-plans.component.html',
  styleUrls: ['./my-plans.component.scss']
})
export class MyPlansComponent implements OnInit {
  activePlan: any;
  loggedUser: any;

  constructor(private userService: UserService, private notification: NotificationService) { 
    this.loggedUser = JSON.parse(this.userService.getUser());
  }

  ngOnInit(): void {
    this.activePlan = this.loggedUser.plan_subcription[0];
  }

}
