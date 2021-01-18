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

  separatorKeysCodes = [ENTER, COMMA];

  subjectCtrl = new FormControl();

  filteredsubjects: Observable<any[]>;

  subjects = [
    { name: 'Mathematics' },
  ];

  verifiedUser: any = {};
  selectedImg: any = null;
  imgSrc: any = "assets/images/svg/file-upload.svg";


  allsubjects = [
    'Mathematics',
    'Polynomials',
    'Statistics',
    'Science',
    'Social Science',
    'English',
  ];

  @ViewChild('subjectInput') subjectInput: any;

  constructor(private authService: AuthService, private router: Router) {
    this.filteredsubjects = this.subjectCtrl.valueChanges
      .startWith(null)
      .map(contact => contact ? this.filter(contact) : this.allsubjects.slice());
  }

  add(event: MatChipInputEvent): void {
    let input = event.input;
    let value = event.value;

    // Add our person
    if ((value || '').trim()) {
      this.subjects.push({ name: value.trim() });
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }
  }

  remove(subject: any): void {
    let index = this.subjects.indexOf(subject);
    if (index >= 0) {
      this.subjects.splice(index, 1);
    }
  }

  filter(name: string) {
    return this.allsubjects.filter(subject =>
      subject.toLowerCase().indexOf(name.toLowerCase()) === 0);
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    this.subjects.push({ name: event.option.viewValue });
    this.subjectInput.nativeElement.value = '';
  }

  ngOnInit() {
    this.authService.getVerifiedUser().subscribe(res => {
      this.verifiedUser = res.mobile;
    })
  }

  onSelectFile(event: any) {
    this.selectedImg = event.target.files[0];
    if (event.target.files && event.target.files[0]) {
      var reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]);
      reader.onload = (event: any) => {
        this.imgSrc = event.target.result;
      }
    }
  }

  onDetailSave(form: NgForm) {
    let filledSubjects: any = [];
    this.subjects.forEach(function(item, index){
      filledSubjects.push(item.name);
    })
    
    let userInfo: FormData = new FormData();
    userInfo.append("qualification", form.value.qualification);
    userInfo.append("experience", form.value.experience);
    userInfo.append("university", form.value.university);
    userInfo.append("gender", form.value.gender);
    userInfo.append("subjects", filledSubjects.toString());
    userInfo.append("profile", this.selectedImg);
    userInfo.append("mobile", this.verifiedUser);
    this.authService.saveUserInfo(userInfo).subscribe(res => {
      if(res.status == "false") {
        alert(res.msg);
      }else {
        var r = confirm("Do you want to save?");
        if (r == true) {
          localStorage.setItem("user", JSON.stringify(res.data));
          this.router.navigate(['/userTimeline']);
        }
      }
    })
  }
}
