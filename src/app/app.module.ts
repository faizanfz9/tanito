import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { HttpClientModule } from "@angular/common/http";
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { NgxLoadingModule } from 'ngx-loading';
import { ModalModule } from 'ngx-bootstrap/modal';
import { PlyrModule } from 'ngx-plyr';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';

import { MatChipsModule } from '@angular/material/chips';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { AngularFireModule } from "@angular/fire";
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { ShareButtonsModule } from 'ngx-sharebuttons/buttons';
import { ShareIconsModule } from 'ngx-sharebuttons/icons';
import { LocationStrategy, HashLocationStrategy } from "@angular/common"

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LandingComponent } from './layouts/landing/landing.component';
import { HeaderComponent } from './layouts/include/header/header.component';
import { FooterComponent } from './layouts/include/footer/footer.component';
import { LoginComponent } from './layouts/login/login.component';
import { RegisterComponent } from './layouts/register/register.component';
import { UserFeedComponent } from './layouts/user-feed/user-feed.component';
import { NetworkComponent } from './layouts/user-feed/network/network.component';
import { FeedComponent } from './layouts/user-feed/feed/feed.component';
import { InboxComponent } from './layouts/user-feed/inbox/inbox.component';
import { FollowingComponent } from './layouts/user-feed/network/following/following.component';
import { FollowersComponent } from './layouts/user-feed/network/followers/followers.component';
import { ProfileSetupComponent } from './layouts/profile-setup/profile-setup.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { TermsAndConditionComponent } from './layouts/terms-and-condition/terms-and-condition.component';
import { PrivacyPolicyComponent } from './layouts/privacy-policy/privacy-policy.component';
import { LoginFormComponent } from './layouts/login/login-form/login-form.component';
import { UsersComponent } from './layouts/user-feed/users/users.component';
import { UserProfileComponent } from './layouts/user-profile/user-profile.component';
import { UserInfoComponent } from './layouts/user-feed/user-info/user-info.component';
import { DatePipe } from './pipes/date.pipe';
import { MyProfileComponent } from './layouts/my-profile/my-profile.component';
import { TimelineComponent } from './layouts/my-profile/timeline/timeline.component';
import { RecentPostPipe } from './pipes/recent-post.pipe';
import { PostCratedPipe } from './pipes/post-created.pipe';
import { UserTimelineComponent } from './layouts/user-profile/user-timeline/user-timeline.component';
import { ShuffleFeedsPipe } from './pipes/shuffle-feeds.pipe';
import { CountLikePipe } from './pipes/count-like.pipe';
import { SearchUserComponent } from './layouts/search-user/search-user.component';
import { UserFoundComponent } from './layouts/search-user/user-found/user-found.component';
import { environment } from 'src/environments/environment';
import { ChatroomComponent } from './layouts/user-feed/inbox/chatroom/chatroom.component';
import { PlansComponent } from './layouts/plans/plans.component';
import { MyPlansComponent } from './layouts/user-feed/my-plans/my-plans.component';
import { ShowMenuDirective } from './directives/show-menu.directive';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { PostComponent } from './layouts/post/post.component';
import { AboutUsComponent } from './layouts/about-us/about-us.component';
import { PageNotFoundComponent } from './layouts/page-not-found/page-not-found.component';
import { ChatTimePipe } from './pipes/chat-time.pipe';
import { ShowCommentBoxDirective } from './directives/show-comment-box.directive';
import { ContactUsComponent } from './layouts/contact-us/contact-us.component';
import { TruncatePipe } from './pipes/truncate.pipe';

@NgModule({
  declarations: [
    AppComponent,
    LandingComponent,
    HeaderComponent,
    FooterComponent,
    LoginComponent,
    RegisterComponent,
    UserFeedComponent,
    NetworkComponent,
    FeedComponent,
    InboxComponent,
    FollowingComponent,
    FollowersComponent,
    ProfileSetupComponent,
    TermsAndConditionComponent,
    PrivacyPolicyComponent,
    LoginFormComponent,
    UsersComponent,
    UserProfileComponent,
    UserInfoComponent,
    DatePipe,
    MyProfileComponent,
    TimelineComponent,
    RecentPostPipe,
    PostCratedPipe,
    UserTimelineComponent,
    ShuffleFeedsPipe,
    CountLikePipe,
    SearchUserComponent,
    UserFoundComponent,
    ChatroomComponent,
    PlansComponent,
    MyPlansComponent,
    ShowMenuDirective,
    PostComponent,
    AboutUsComponent,
    PageNotFoundComponent,
    ChatTimePipe,
    ShowCommentBoxDirective,
    ContactUsComponent,
    TruncatePipe
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    NoopAnimationsModule,
    MatChipsModule,
    MatAutocompleteModule,
    MatInputModule,
    MatIconModule,
    MatTabsModule,
    PlyrModule,
    ModalModule.forRoot(),
    NgxLoadingModule.forRoot({}),
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    AngularFireStorageModule,
    CarouselModule,
    ShareButtonsModule,
    ShareIconsModule,
    ScrollingModule,
    InfiniteScrollModule,
    NgbModule
  ],
  providers: [
    {provide: LocationStrategy, useClass: HashLocationStrategy}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
