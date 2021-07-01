import { AfterContentChecked, Component, OnInit, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BsModalService } from 'ngx-bootstrap/modal';
import { NotificationService } from 'src/app/shared/notification.service';
import { UserService } from 'src/app/shared/user.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class UserProfileComponent implements OnInit, AfterContentChecked {
  user: any;
  id: any;
  loggedUser: any;
  followed: any;
  myInbox: any;
  loading = false;
  modalRef: any;
  reportReason = ["Pretending to be someone", "Fake account", "Posting inappropriate things", "Harassment or bullying", "Something else, specify in comment"];
  selectedReason = "";
  specifiedReason = "";
  @ViewChild("reportProfile") reportProfile: any;
  profilePath = "https://tanito.in/admin/assets/user-profile/"
  teacherVideoPath = "https://tanito.in/admin/assets/teacher-video/";
  userAvatar = "assets/images/icons/user_avatar.svg";
  teacherIcon = "assets/images/icons/teacher.png";
  studentIcon = "assets/images/icons/student.png";
  showFullText = false;

  constructor(private userService: UserService, 
    private route: ActivatedRoute, 
    private router: Router, 
    private modalService: BsModalService,
    private notificationService: NotificationService) { 
    this.loggedUser = JSON.parse(this.userService.getUser());
    this.userService.storeUpdatedUser().subscribe(res => {
      this.loggedUser.count_following = res.count_following;
      this.loggedUser.following_id = res.following_id;
      localStorage.setItem("user", JSON.stringify(this.loggedUser));
      this.getUserProfile();
    })
  }

  onFollowUser() {
    let followMatch = new FormData();
    followMatch.append("user_id", this.userService.loggedUserId())
    followMatch.append("follow_id", this.id);
    this.userService.followUser(followMatch).subscribe((res: any) => {
      this.userService.updateUser();
      if(res.followed == "true") {
        this.notificationService.sendNotification(this.id, this.loggedUser.profile_img, this.loggedUser.username + " has started following you!");
      }
    })
  }

  getUserProfile() {
    let userId = new FormData();
    this.id = this.route.snapshot.params.id;
    userId.append("id", this.id);
    this.loading = true;
    this.userService.getUserById(userId).subscribe(res => {
      this.loading = false;
      this.user = res;
      this.followed = this.loggedUser.following_id.some((user: any) => user.follower == this.id);
    })
  }

  goToRoom() {
    let member = this.user.data.results;
    let memberId = member.user_id;
    this.router.navigate(['/feed/inbox/' + memberId]);
  }

  get inbox(): any {
    return localStorage.getItem("inbox");
  }

  ngOnInit(): void {
    this.route.params.subscribe(res => {
      this.getUserProfile();
    })
    this.myInbox = JSON.parse(this.inbox);
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

  reportModal() {
    this.openModal(this.reportProfile);
  }

  onReportProfile() {
    this.selectedReason = this.selectedReason == this.reportReason[this.reportReason.length - 1] ? this.specifiedReason : this.selectedReason;
    if(this.selectedReason.length > 0) {
      let reportCriteria = new FormData();
      reportCriteria.append("from_id", this.loggedUser.id);
      reportCriteria.append("to_id", this.id);
      reportCriteria.append("reason", this.selectedReason);
      this.userService.reportUser(reportCriteria).subscribe((res: any) => {
        if(res.status == false) {
          alert(res.msg);
        }
        alert(res.msg);
        this.modalRef.hide();
      })
    }else {
      if(this.specifiedReason.length == 0) {
        alert("Please specify in comment!");
      }else {
        alert("Please select a reason!");
      }
    }
  }

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, Object.assign({}, { class: 'tanito' }));
  }

}
