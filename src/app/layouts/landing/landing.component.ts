import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/shared/user.service';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss']
})
export class LandingComponent implements OnInit {
  count: any = [];

  constructor(private userService: UserService) { }

  ngOnInit(): void {
    this.userService.getTotalData().subscribe((res: any) => this.count = res.data);
  }

}
