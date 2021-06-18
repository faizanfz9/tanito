import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/shared/user.service';

@Component({
  selector: 'app-resources',
  templateUrl: './resources.component.html',
  styleUrls: ['./resources.component.scss']
})
export class ResourcesComponent implements OnInit {
  path: any;
  resources: any;

  constructor(private userService: UserService) { }

  ngOnInit(): void {
    this.userService.getResources().subscribe((res: any) => {
      this.resources = res.data.results;
      this.path = res.data.urlkey;
      console.log(res);
    })
  }

}
