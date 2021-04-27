import { AfterContentChecked, ViewEncapsulation } from '@angular/core';
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormControl, NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BsModalService } from 'ngx-bootstrap/modal';
import { UserService } from 'src/app/shared/user.service';
import { VideoProcessingService } from 'src/app/shared/video-processing.service';
import { ENTER } from '@angular/cdk/keycodes';
import {MatChipInputEvent} from '@angular/material/chips';
import {MatAutocompleteSelectedEvent} from '@angular/material/autocomplete';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/map';
import "bad-words"
var Filter = require('bad-words'), filter = new Filter();
declare var require: any

const COMMA = 188;

@Component({
  selector: 'app-my-profile',
  templateUrl: './my-profile.component.html',
  styleUrls: ['./my-profile.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class MyProfileComponent implements OnInit, AfterContentChecked {
  user: any;
  selectedImg: any;
  selectedVideo: any;
  imgThumb: any = "";
  videoThumb: any = "";
  modalRef: any;
  loggedUserId: any;
  myInbox: any;
  @ViewChild('timeline', {static: true}) timelineBlock: any;
  @ViewChild('createPost', {static: true}) createPost: any;
  loading = false;
  profilePath = "https://tanito.in/admin/assets/user-profile/";
  teacherVideoPath = "https://tanito.in/admin/assets/teacher-video/";
  userAvatar = "assets/images/icons/user_avatar.svg";
  teacherIcon = "assets/images/icons/teacher.png";
  studentIcon = "assets/images/icons/student.png";
  showFullText = false;

  visible: boolean = true;
  selectable: boolean = true;
  removable: boolean = true;
  addOnBlur: boolean = false;
  separatorKeysCodes = [ENTER, COMMA];
  subjectCtrl = new FormControl();
  filteredTags: any;
  @ViewChild('tagInput') tagInput: any;
  subjects: any = [];
  selectedTags: any = [];
  allTags: any = [];

  constructor(
    private userService: UserService, 
    private route: ActivatedRoute,
    private modalService: BsModalService,
    private videoService: VideoProcessingService,
    private router: Router ) 
  { 
    this.userService.storeUpdatedUser().subscribe(res => {
      this.user.user_post_data = res.user_post_data;
      localStorage.setItem("user", JSON.stringify(this.user));
    })

    this.userService.getSubjects().subscribe((res: any) => {
      res.data.subjects.forEach((item: any) => {
        this.subjects.push(item.subject);
      })
    })

    this.userService.getTags().subscribe((res: any) => {
      res.data.tags.forEach((item: any) => {
        this.allTags.push(item.tags);
      })
      this.filteredTags = this.subjectCtrl.valueChanges.startWith(null).map(contact => contact ? this.filterTag(contact) : this.allTags.slice());
    })
  }

  removeTag(tag: any): void {
    let index = this.selectedTags.indexOf(tag);
    if (index >= 0) {
      this.selectedTags.splice(index, 1);
    }
  }

  filterTag(name: string) {
    return this.allTags.filter((tag: any) =>
      tag.toLowerCase().indexOf(name.toLowerCase()) === 0);
  }

  selectedTag(event: MatAutocompleteSelectedEvent): any {
    if(this.selectedTags.some((item: any) => item == event.option.viewValue)) {
      alert("This tag is already selected!");
      return false;
    }
    this.selectedTags.push(event.option.viewValue);
  }

  get inbox(): any {
    return localStorage.getItem("inbox");
  }

  ngOnInit(): void {
    this.user = JSON.parse(this.userService.getUser());
    if(this.route.snapshot.queryParams.post) {
      this.openModal(this.createPost); 
    }

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

  onSelectImage(event: any) {
    this.selectedImg = event.target.files[0];
    if(!this.selectedImg.type.includes("image")) {
      alert("File type not supported!");
    }else {
      if (event.target.files && event.target.files[0]) {
        var reader = new FileReader();
        reader.readAsDataURL(event.target.files[0]);
        reader.onload = (event: any) => {
          this.imgThumb = event.target.result;
        }
      }
    }
  }

  removeImg() {
    this.selectedImg = null;
    this.imgThumb = "";
  }

  removeVideo() {
    this.selectedVideo = null;
    this.videoThumb = "";
  }

  onSelectVideo(event: any) {
    this.selectedVideo = event.target.files[0];
    this.videoService.generateThumbnail(this.selectedVideo, true).
    then(thumbnailData => {
      this.videoThumb = thumbnailData;
    }).catch(error => {
      alert(error);
    })
  }

  onCreatePost(form: NgForm) {
    if(filter.isProfane(form.value.body)) {
      alert("The post content contains offensive words!");
    }else {
      let post = new FormData();
      post.append("user_id", this.user.id);
      post.append("body", form.value.body);
      post.append("image", this.selectedImg);
      post.append("video", this.selectedVideo);
      post.append("subject", form.value.subject);
      post.append("tags", this.selectedTags.toString());
      this.loading = true;
      this.userService.createPost(post).subscribe(res => {
        if(res.status == "false") {
          this.loading = false;
          alert(res.msg);
        }else {
          this.loading = false;
          form.reset();
          this.imgThumb = "";
          this.videoThumb = "";
          this.userService.updateUser();
          this.router.navigate(['/myProfile']);
          this.modalRef.hide();
          this.timelineBlock.nativeElement.scrollIntoView({behavior:'smooth'});
        }
      })
    }
  }
  
  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, Object.assign({}, { class: 'tanito' }));
  }
  
}
