import { Component, OnInit, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ENTER } from '@angular/cdk/keycodes';
import { FormControl } from '@angular/forms';
import {MatAutocompleteSelectedEvent} from '@angular/material/autocomplete';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/map';
import { AuthService } from 'src/app/auth/auth.service';
import { Router } from '@angular/router';
import { UserService } from 'src/app/shared/user.service';
import { VideoProcessingService } from 'src/app/shared/video-processing.service';
import { BsModalService } from 'ngx-bootstrap/modal';

const COMMA = 188;

@Component({
  selector: 'app-profile-setup',
  templateUrl: './profile-setup.component.html',
  styleUrls: ['./profile-setup.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ProfileSetupComponent implements OnInit {
  visible: boolean = true;
  selectable: boolean = true;
  removable: boolean = true;
  addOnBlur: boolean = false;
  loading = false;
  separatorKeysCodes = [ENTER, COMMA];
  subjectCtrl = new FormControl();
  filteredsubjects: any;
  subjects: any = [];
  modalRef: any;

  mobile: any;
  userType: any;
  user: any;
  selectedImg: any = new File([], "", undefined);
  selectedVideo: any = new File([], "", undefined);
  imgSrc: any = "assets/images/svg/file-upload.svg";
  profilePath = "https://demo.mbrcables.com/tanito/assets/user-profile/"
  userAvatar = "assets/images/icons/user_avatar.svg";
  teacherIcon = "assets/images/icons/teacher.png";
  studentIcon = "assets/images/icons/student.png";
  @ViewChild("signUpAlert") signUpAlert: any;

  allsubjects: any = [];
  @ViewChild('subjectInput') subjectInput: any;

  constructor(private authService: AuthService, 
    private userService: UserService, 
    private router: Router, 
    private videoService: VideoProcessingService,
    private modalService: BsModalService
    ) {
    this.userService.getSubjects().subscribe((res: any) => {
      res.data.subjects.forEach((item: any) => {
        this.allsubjects.push(item.subject);
      })
      // this.subjects.push({name : this.allsubjects[0]})
      this.filteredsubjects = this.subjectCtrl.valueChanges
      .startWith(null)
      .map(contact => contact ? this.filter(contact) : this.allsubjects.slice());
    })
  }

  remove(subject: any): void {
    let index = this.subjects.indexOf(subject);
    if (index >= 0) {
      this.subjects.splice(index, 1);
    }
  }

  filter(name: string) {
    return this.allsubjects.filter((subject: any) =>
      subject.toLowerCase().indexOf(name.toLowerCase()) === 0);
  }

  selected(event: MatAutocompleteSelectedEvent): any {
    if(this.subjects.some((item: any) => item.name == event.option.viewValue)) {
      alert("This subject is already selected!");
      this.subjectInput.nativeElement.blur();
      return false;
    }
    this.subjects.push({ name: event.option.viewValue });
    this.subjectInput.nativeElement.blur();
    this.subjectInput.nativeElement.value = '';
  }

  ngOnInit() {
    this.user = JSON.parse(this.userService.getUser());
    if(this.user) {
      this.imgSrc = this.user.profile_img.length > 0 ? this.profilePath + this.user.profile_img : "assets/images/svg/file-upload.svg";
      this.mobile = this.user.mobile;
      this.userType = this.user.usertype;
      let subjects: any = [];
      let subjectsSplitedArr = this.user.subjects.split(",");
      subjectsSplitedArr.forEach(function(item: any, index: number){
        subjects.push({name: item});
      })
      this.subjects = subjects;
    }else {
      this.mobile = JSON.parse(this.authService.getVerifiedUser()).mobile;
      this.userType = JSON.parse(this.authService.getVerifiedUser()).userType;
    }
  }

  onSelectProfile(event: any) {
    this.selectedImg = event.target.files[0];
    if (event.target.files && event.target.files[0]) {
      var reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]);
      reader.onload = (event: any) => {
        this.imgSrc = event.target.result;
      }
    }
  }

  onSelectVideo(event: any, el: any) {
    this.selectedVideo = event.target.files[0];
    this.videoService.generateThumbnail(this.selectedVideo).
    then(thumbnailData => {
    }).catch(error => {
      alert(error);
      el.value = "";
    })
  }

  onDetailSave(form: NgForm) {
    let filledSubjects: any = [];
    this.subjects.forEach(function(item: any){
      filledSubjects.push(item.name);
    })
    
    let userInfo: FormData = new FormData();
    userInfo.append("qualification", form.value.qualification);
    userInfo.append("experience", form.value.experience);
    userInfo.append("university", form.value.university);
    userInfo.append("gender", form.value.gender);
    userInfo.append("subjects", filledSubjects.toString());
    userInfo.append("profile", this.selectedImg);
    userInfo.append("mobile", this.mobile);
    userInfo.append("video", this.selectedVideo);
    this.loading = true;
    this.authService.saveUserInfo(userInfo).subscribe((res: any) => {
      if(res.status == "false") {
        this.loading = false;
        alert(res.msg);
      }else {
        var r = confirm("Do you want to save?");
        if (r == true) {
          this.loading = false;
          if(res.data.status == 0) {
            this.openModal(this.signUpAlert);
          }else {
            this.authService.storeUser(res.data);
            this.router.navigate(['/feed']);
          }
        }else {
          this.loading = false;
        }
      }
    })
  }

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, Object.assign({}, { class: 'tanito' }));
  }

  goToHomepage() {
    this.modalRef.hide();
    this.router.navigate(['/']);
  }
}
