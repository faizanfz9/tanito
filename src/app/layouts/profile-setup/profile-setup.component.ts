import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ENTER } from '@angular/cdk/keycodes';
import { FormControl } from '@angular/forms';
import {MatChipInputEvent} from '@angular/material/chips';
import {MatAutocompleteSelectedEvent} from '@angular/material/autocomplete';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/map';
import { AuthService } from 'src/app/auth/auth.service';
import { Router } from '@angular/router';
import { UserService } from 'src/app/shared/user.service';

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

  verifiedUser = "";
  user: any;
  selectedImg: any = null;
  profilePath = "https://demo.mbrcables.com/tanito/assets/user-profile/";
  imgSrc: any = "assets/images/svg/file-upload.svg";

  allsubjects: any = [];
  @ViewChild('subjectInput') subjectInput: any;

  constructor(private authService: AuthService, private userService: UserService, private router: Router) {
    this.userService.getSubjects().subscribe((res: any) => {
      res.data.subjects.forEach((item: any) => {
        this.allsubjects.push(item.subject);
      })
      this.subjects.push({name : this.allsubjects[0]})
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
    this.verifiedUser =  this.authService.getVerifiedUser();
    this.user = JSON.parse(this.userService.getUser());
    if(this.user) {
      this.imgSrc = this.user.user.profile_img.length > 0 ? this.profilePath + this.user.user.profile_img : "assets/images/svg/file-upload.svg";
      this.verifiedUser = this.user.user.mobile;
      let subjects: any = [];
      let subjectsSplitedArr = this.user.user.subjects.split(",");
      subjectsSplitedArr.forEach(function(item: any, index: number){
        subjects.push({name: item});
      })
      this.subjects = subjects;
    }
  }

  onSelectFile(event: any) {
    this.selectedImg = event.target.files[0];
    console.log(this.selectedImg);
    if (event.target.files && event.target.files[0]) {
      var reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]);
      reader.onload = (event: any) => {
        this.imgSrc = event.target.result;
      }
    }
  }

  resetProfilePic() {
    this.imgSrc = "assets/images/svg/file-upload.svg";
    this.selectedImg = new File([], "", undefined);
  }

  
  onDetailSave(form: NgForm) {
    let filledSubjects: any = [];
    this.subjects.forEach(function(item: any){
      filledSubjects.push(item.name);
    })
    let userInfo: FormData = new FormData();
    console.log(this.selectedImg);
    userInfo.append("qualification", form.value.qualification);
    userInfo.append("experience", form.value.experience);
    userInfo.append("university", form.value.university);
    userInfo.append("gender", form.value.gender);
    userInfo.append("subjects", filledSubjects.toString());
    userInfo.append("profile", this.selectedImg);
    userInfo.append("mobile", this.verifiedUser);
    this.loading = true;
    this.authService.saveUserInfo(userInfo).subscribe(res => {
      if(res.status == "false") {
        this.loading = false;
        alert(res.msg);
      }else {
        var r = confirm("Do you want to save?");
        if (r == true) {
          this.loading = false;
          this.authService.storeUser(res.data);
          this.router.navigate(['/feed']);
        }else {
          this.loading = false;
        }
      }
    })
  }
}
