import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { UserService } from 'src/app/shared/user.service';
import { TemplateRef } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { ActivatedRoute } from '@angular/router';
import { NotificationService } from 'src/app/shared/notification.service';

@Component({
  selector: 'app-feed',
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class FeedComponent implements OnInit {
  feeds: any = [];
  filteredFeeds: any = [];
  loggedUser: any;
  likeType: any;
  currPostId: any;
  loading = false;
  modalRef: any;
  query: any;
  host: any;
  totalUserReaction: any;
  okUserReaction: any;
  innUserReaction: any;
  clapUserReaction: any;
  goodUserReaction: any;
  reactionFetched = false;
  catChanged = false;
  reportReason = ["Violence", "Harassment", "False Information", "Span", "Something else, specify in comment"];
  selectedReason = "";
  specifiedReason = "";
  selectedPost: any;
  @ViewChild("reportPost") reportPost: any;
  @ViewChild("viewReactions") viewReactions: any;
  profilePath = "https://demo.mbrcables.com/tanito/assets/user-profile/"
  imageDirPath = "https://demo.mbrcables.com/tanito/assets/user-post-media/image/";
  videoDirPath = "https://demo.mbrcables.com/tanito/assets/user-post-media/video/";
  userAvatar = "assets/images/icons/user_avatar.svg";
  teacherIcon = "assets/images/icons/teacher.png";
  studentIcon = "assets/images/icons/student.png";
  @ViewChild("feedBlock") feedBlock: any;

  constructor(private userService: UserService, 
    private modalService: BsModalService, 
    public route: ActivatedRoute,
    private notificationService: NotificationService
    ) {
    this.loggedUser = JSON.parse(this.userService.getUser());
    this.route.queryParams.subscribe(query => {
      if(this.catChanged) {
        this.feedBlock.nativeElement.scrollIntoView({behavior:'smooth'});
      }else {
        this.catChanged = true;
      }
      this.query = query.cat;
      this.getFeeds();
    })
  } 

  ngOnInit(): void {
    this.getFeeds();
    this.host = window.location.host;
  }

  getFeeds() {
    this.loading = true;
    this.userService.getAllPost().subscribe((res: any) => {
      this.loading = false;
      if(this.query) {
        this.feeds = res.data.user_post.filter((item: any) => item.subject == this.query);
      }else {
        this.feeds = res.data.user_post;
      }
    })
  }
  
  onLikePost(postId: any, likeType: any, el: HTMLElement, feed: any) {
    let postInfo = new FormData();
    postInfo.append("user_id", this.loggedUser.id);
    postInfo.append("post_id", postId);
    postInfo.append("like_type", likeType);

    this.userService.likePost(postInfo).subscribe((res: any) => {
      let parentEl = el.parentElement;
      let likesEl = parentEl?.nextSibling as HTMLElement;
      let totalLikes = +likesEl.innerHTML as any;
      let likeTypeEl = el.firstChild as HTMLElement;
      console.log(res);
      switch(likeType) {
        case 1:
          likeTypeEl.setAttribute("src", "assets/images/icons/lightbulb.png");
          break;
        case 2:
          likeTypeEl.setAttribute("src", "assets/images/icons/clap.png");
          break; 
        case 3:
        likeTypeEl.setAttribute("src", "assets/images/icons/like.png");
        break;  
        default:
          likeTypeEl.setAttribute("src", "assets/images/icons/like_icon.png");
      }
      if(res.likeStatus == 1) {
        el.classList.add("liked");
        totalLikes += 1
        likesEl.innerHTML = totalLikes;
        this.likeType = likeType;
        this.notificationService.sendNotification(feed.userId, this.loggedUser.profile_img, this.loggedUser.username + " has liked your post: " + feed.body);
      }else if(res.likeStatus == 0) {
        el.classList.remove("liked");
        totalLikes -= 1
        likesEl.innerHTML = totalLikes;
        likeTypeEl.setAttribute("src", "assets/images/icons/like_icon.png");
        this.likeType = 0;
      }else {
        this.likeType = likeType;
      }
    })
  }

  onViewReaction(post_id: any) {
    let postId = new FormData();
    postId.append("post_id", post_id);
    this.openModal(this.viewReactions);
    this.userService.viewReaction(postId).subscribe((res: any) => {
      this.reactionFetched = true;
      let reactions = res.data.my_post;
      this.totalUserReaction = reactions;
      this.okUserReaction = reactions.filter((item: any) => {
        return item.like_type == 0
      });
      this.innUserReaction = reactions.filter((item: any) => {
        return item.like_type == 1
      });
      this.clapUserReaction = reactions.filter((item: any) => {
        return item.like_type == 2
      });
      this.goodUserReaction = reactions.filter((item: any) => {
        return item.like_type == 3
      });
    })
  }

  isPostLiked(likes: any) {
    return likes.some((item: any) => item.user_id == this.loggedUser.id)
  }

  checkLikeType(likes: any): any {
    let myLike = likes.find((item: any) => item.user_id == this.loggedUser.id);
    if(myLike) {
      if(myLike.like_type == 1) {
        return "assets/images/icons/lightbulb.png"
      }else if(myLike.like_type == 2) {
        return "assets/images/icons/clap.png"
      }else if(myLike.like_type == 3) {
        return "assets/images/icons/like.png"
      }else {
        return "assets/images/icons/like_icon.png"
      }
    }else {
      return "assets/images/icons/like_icon.png"
    }
  }

  getLikeType(likes: any): any {
    let myLike = likes.find((item: any) => item.user_id == this.loggedUser.id);
    if(myLike) {
      return +myLike.like_type;
    }else {
      return 0;
    }
  }

  changeTabs(el: HTMLElement) {
    let reactionBlock: any = document.getElementsByClassName("reactions");
    reactionBlock.classList.remove("active");
    el.classList.add("active");
  }

  reportModal(postId: any) {
    this.selectedPost = postId;
    this.openModal(this.reportPost);
  }

  onReportProfile() {
    this.selectedReason = this.selectedReason == this.reportReason[this.reportReason.length - 1] ? this.specifiedReason : this.selectedReason;
    if(this.selectedReason.length > 0) {
      let reportCriteria = new FormData();
      reportCriteria.append("from_id", this.loggedUser.id);
      reportCriteria.append("post_id", this.selectedPost);
      reportCriteria.append("reason", this.selectedReason);
      this.userService.reportPost(reportCriteria).subscribe((res: any) => {
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
    this.modalRef = this.modalService.show(template, Object.assign({}, { class: 'reaction_modal' }));
  }

  toggleShareGroup(el: any) {
    let shareBtnGroup = el.previousSibling;
    if(shareBtnGroup.classList.contains("show")) {
      shareBtnGroup.classList.remove("show");
    }else {
      shareBtnGroup.classList.add("show");
    }
  }
}
