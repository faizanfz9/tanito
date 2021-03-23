import { Component, OnInit } from '@angular/core';
import { MyPlanService } from 'src/app/shared/my-plan.service';

@Component({
  selector: 'app-my-plans',
  templateUrl: './my-plans.component.html',
  styleUrls: ['./my-plans.component.scss']
})
export class MyPlansComponent implements OnInit {
  currentPlan: any;
  isExpired = false;

  constructor(private myPlanService: MyPlanService) { 
  }

  ngOnInit(): void {
    this.currentPlan = this.myPlanService.getCurrentPlan();
    this.isExpired = this.myPlanService.isPlanExpired();
  }

}
