import { Component, NgZone, OnInit, ViewEncapsulation } from '@angular/core';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { PlanService } from 'src/app/shared/plan.service';
import { ICustomWindow, WindowRefService } from 'src/app/shared/window-ref.service';

@Component({
  selector: 'app-plans',
  templateUrl: './plans.component.html',
  styleUrls: ['./plans.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class PlansComponent implements OnInit {
  plans: any;

  private _window: ICustomWindow;
  public rzp: any;

  public options: any = {
    key: 'rzp_test_hTt9ODldtNfwN7', // add razorpay key here\
    name: 'Tanito Learning Platform',
    description: '',
    amount: 0, // razorpay takes amount in paisa
    order_id: '',
    prefill: {
      name: 'Tanito Learning Platform',
      email: '', // add your email id
    },
    notes: {},
    theme: {
      color: '#3880FF'
    },
    handler: this.paymentHandler.bind(this),
    modal: {
      ondismiss: (() => {
        this.zone.run(() => {
          // add current page routing if payment fails
        })
      })
    }
  };

  constructor(private planService: PlanService,
    private zone: NgZone,
    private winRef: WindowRefService) { 
    this._window = this.winRef.nativeWindow;
  }

  ngOnInit(): void {
    this.planService.getPlans().subscribe((res: any) => {
      this.plans = res.data.results;
    })
  }

  initPay(plan: any, planAmt: any): void {
    this.options.description = plan;
    this.options.amount = planAmt * 100
    this.rzp = new this.winRef.nativeWindow["Razorpay"](this.options);
    this.rzp.open();
  }

  paymentHandler(res: any) {
    this.zone.run(() => {
      // add API call here
      alert("payment success!");
    });
  }

}
