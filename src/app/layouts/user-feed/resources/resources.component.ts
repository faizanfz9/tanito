import { Component, OnInit } from '@angular/core';
import { MyPlanService } from 'src/app/shared/my-plan.service';
import { UserService } from 'src/app/shared/user.service';

@Component({
  selector: 'app-resources',
  templateUrl: './resources.component.html',
  styleUrls: ['./resources.component.scss']
})
export class ResourcesComponent implements OnInit {
  path: any;
  resources: any;
  isPlanActive = false;

  constructor(private userService: UserService, private myPlanService: MyPlanService) { }

  ngOnInit(): void {
    // checking if plan is active
    if(this.myPlanService.getCurrentPlan() && !this.myPlanService.isPlanExpired()) {
      this.isPlanActive = true;
    }

    if(this.isPlanActive) {
      this.userService.getResources().subscribe((res: any) => {
        this.resources = res.data.results;
        this.path = res.data.urlkey;
      })
    }
  }

}
