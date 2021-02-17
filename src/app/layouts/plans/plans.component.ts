import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { PlanService } from 'src/app/shared/plan.service';

@Component({
  selector: 'app-plans',
  templateUrl: './plans.component.html',
  styleUrls: ['./plans.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class PlansComponent implements OnInit {
  plans: any;

  constructor(private planService: PlanService) { }

  ngOnInit(): void {
    this.planService.getPlans().subscribe((res: any) => {
      this.plans = res.data.results;
    })
  }

}
