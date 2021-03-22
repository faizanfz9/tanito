import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { UserService } from 'src/app/shared/user.service';

@Component({
  selector: 'app-contact-us',
  templateUrl: './contact-us.component.html',
  styleUrls: ['./contact-us.component.scss']
})
export class ContactUsComponent implements OnInit {

  constructor(private userService: UserService) { }

  ngOnInit(): void {
  }

  onSubmit(form: NgForm) {
    let userQuery = new FormData();
    userQuery.append('name', form.value.name);
    userQuery.append('email', form.value.email);
    userQuery.append('mobile', form.value.phone);
    userQuery.append('message', form.value.message);
    this.userService.sendQuery(userQuery).subscribe((res: any) => {
      if(res.status == false) {
        alert(res.msg)
      }else {
        alert('Thanks for submitting your query, we will get back to you!');
        form.reset();
      }
    })
  }
}
