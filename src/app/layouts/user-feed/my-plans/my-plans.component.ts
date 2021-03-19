import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/shared/user.service';

@Component({
  selector: 'app-my-plans',
  templateUrl: './my-plans.component.html',
  styleUrls: ['./my-plans.component.scss']
})
export class MyPlansComponent implements OnInit {
  activePlan: any;
  loggedUser: any;

  constructor(private userService: UserService) { 
    this.loggedUser = JSON.parse(this.userService.getUser());
  }

  ngOnInit(): void {
    this.activePlan = this.loggedUser.plan_subcription[this.loggedUser.plan_subcription.length - 1];
  }

}
