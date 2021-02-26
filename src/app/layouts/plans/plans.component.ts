import { Component, NgZone, OnInit, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { PlanService } from 'src/app/shared/plan.service';
import { ICustomWindow, WindowRefService } from 'src/app/shared/window-ref.service';
import { BsModalService } from 'ngx-bootstrap/modal';
import { UserService } from 'src/app/shared/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-plans',
  templateUrl: './plans.component.html',
  styleUrls: ['./plans.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class PlansComponent implements OnInit {
  plans: any;
  selectedPlanId: any;
  loggedUser: any;
  @ViewChild("confirmationBox") confirmationBox: any;
  
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
    private modalService: BsModalService,
    private userService: UserService,
    private router: Router,
    private winRef: WindowRefService) { 
    this.loggedUser = JSON.parse(this.userService.getUser());  
    this._window = this.winRef.nativeWindow;

    this.userService.storeUpdatedUser().subscribe(res => {
      this.loggedUser.plan_subcription = res.plan_subcription;
      localStorage.setItem("user", JSON.stringify(this.loggedUser));
    })
  }

  ngOnInit(): void {
    this.planService.getPlans().subscribe((res: any) => {
      this.plans = res.data.results;
    })
  }

  initPay(plan: any, planId: any, planAmt: any): void {
    this.selectedPlanId = planId;
    if(this.loggedUser.plan_subcription.some((item: any) => item.id == planId)) {
      alert("You have already subscribed this plan!")
    }else {
      this.options.description = plan;
      this.options.amount = planAmt * 100;
      this.rzp = new this.winRef.nativeWindow["Razorpay"](this.options);
      this.rzp.open();
    }
    
  }

  paymentHandler(res: any) {
    this.zone.run(() => {
      // add API call here
      let planInfo = new FormData();
      planInfo.append("plan_id", this.selectedPlanId);
      planInfo.append("user_id", this.loggedUser.id);
      this.planService.buyPlan(planInfo).subscribe((res: any) => {
        this.openModal(this.confirmationBox);
        this.userService.updateUser();
      })
    });
  }

  openModal(template: TemplateRef<any>) {
    this.modalService.show(template, Object.assign({}, { class: 'tanito' }));
  }

  navigateToPlans() {
    this.modalService.hide();
    this.router.navigate(['/feed/my-plans']);
  }

}
