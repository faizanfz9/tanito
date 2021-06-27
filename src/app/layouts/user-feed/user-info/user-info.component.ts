import { AfterContentChecked, Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { BsModalService } from 'ngx-bootstrap/modal';
import { NotificationService } from 'src/app/shared/notification.service';
import { UserService } from 'src/app/shared/user.service';

@Component({
  selector: 'app-user-info',
  templateUrl: './user-info.component.html',
  styleUrls: ['./user-info.component.scss']
})
export class UserInfoComponent implements OnInit, AfterContentChecked {
  user: any;
  loggedUserId: any;
  myInbox: any;
  subjects: any = [];
  showAll = false;
  profilePath = "https://tanito.in/admin/assets/user-profile/"
  userAvatar = "assets/images/icons/user_avatar.svg";
  teacherIcon = "assets/images/icons/teacher.png";
  studentIcon = "assets/images/icons/student.png";
  @ViewChild('createSession') createSessionModal: any;
  modalRef: any;
  loading = false;

  constructor(private userService: UserService, 
    private router: Router,
    private modalService: BsModalService,
    private notiService: NotificationService) { 
    this.user = JSON.parse(this.userService.getUser());
    this.loggedUserId = JSON.parse(this.userService.getUser()).id;
    this.userService.storeUpdatedUser().subscribe(res => {
      this.user.count_following = res.count_following;
      this.user.following_id = res.following_id;
      localStorage.setItem("user", JSON.stringify(this.user));
    })
  }

  get inbox(): any {
    return localStorage.getItem("inbox");
  }

  ngOnInit(): void {
    this.userService.getSubjects().subscribe((res: any) => {
      res.data.subjects.forEach((item: any) => {
        this.subjects.push(item.subject);
      })
    })
  }

  ngAfterContentChecked() {
    if(this.inbox) {
      this.myInbox = JSON.parse(this.inbox);
    }else {
      this.myInbox = {
        defaultChatroom: 0,
        newMsgs: 0
      };
    }
  }

  initSession() {
    this.openModal(this.createSessionModal);
  }

  onCreateSession(form: NgForm) {
    let session = new FormData;
    session.append("user_id", this.loggedUserId); 
    session.append("title", form.value.title);
    session.append("member_id", form.value.member); 
    session.append("date", form.value.date);
    session.append("start_time", form.value["start-time"]); 
    session.append("end_time", form.value["end-time"]);
    
    let currentDate = new Date();
    let sessionDate = new Date(form.value.date + " " + form.value["start-time"]);
    if(sessionDate < currentDate) {
      alert("Please select future date and time!")
    }else {
      this.userService.createSession(session).subscribe((res: any) => {
        if(res.status == false) {
          this.loading = false;
          alert(res.msg)
        }else {
          this.notiService.sendNotification(form.value.member, this.user.profile_img, 
            this.user.username + " has invited you in a session: " + form.value.title), 
          this.userService.updateUser()
          this.modalRef.hide();
          this.router.navigate(["/feed/sessions"]);
        }
      })  
    }
  }

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, Object.assign({}, { class: 'tanito' }));
  }

}
