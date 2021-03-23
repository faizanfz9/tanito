import { Injectable } from '@angular/core';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class MyPlanService {
  loggedUser: any;
  currentPlan: any;

  constructor(private userService: UserService) { 
    this.loggedUser = JSON.parse(this.userService.getUser());
    this.currentPlan = this.loggedUser.plan_subcription[this.loggedUser.plan_subcription.length - 1];
  }

  getCurrentPlan() {
    return this.currentPlan;
  }

  isPlanExpired() {
    let currentDate = new Date();
    let planEndDate = new Date(this.currentPlan.end_date);
    if(currentDate > planEndDate) {
     return true;
    }else {
      return false;
    }
  }
}
