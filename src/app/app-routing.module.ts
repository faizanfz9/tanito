import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './auth/auth.guard';
import { LandingComponent } from './layouts/landing/landing.component';
import { LoginComponent } from './layouts/login/login.component';
import { MyProfileComponent } from './layouts/my-profile/my-profile.component';
import { PrivacyPolicyComponent } from './layouts/privacy-policy/privacy-policy.component';
import { ProfileSetupComponent } from './layouts/profile-setup/profile-setup.component';
import { RegisterComponent } from './layouts/register/register.component';
import { TermsAndConditionComponent } from './layouts/terms-and-condition/terms-and-condition.component';
import { UserProfileComponent } from './layouts/user-profile/user-profile.component';
import { InboxComponent } from './layouts/user-feed/inbox/inbox.component';
import { FollowersComponent } from './layouts/user-feed/network/followers/followers.component';
import { FollowingComponent } from './layouts/user-feed/network/following/following.component';
import { NetworkComponent } from './layouts/user-feed/network/network.component';
import { FeedComponent } from './layouts/user-feed/feed/feed.component';
import { UserFeedComponent } from './layouts/user-feed/user-feed.component';
import { SearchUserComponent } from './layouts/search-user/search-user.component';
import { PlansComponent } from './layouts/plans/plans.component';
import { MyPlansComponent } from './layouts/user-feed/my-plans/my-plans.component';
import { PostComponent } from './layouts/post/post.component';
import { AboutUsComponent } from './layouts/about-us/about-us.component';

const routes: Routes = [
  { path: "", pathMatch: "full", component: LandingComponent },
  { path: "login", component: LoginComponent },
  { path: "register", component: RegisterComponent },
  { path: "profile-setup", component: ProfileSetupComponent},
  { path: "feed", component: UserFeedComponent, canActivate: [AuthGuard],
    children: [
      {
        path: "", pathMatch: "full", component: FeedComponent
      },
      {
        path: "network", component: NetworkComponent, 
        children: [
          {
            path: "", pathMatch: "full", component: FollowingComponent
          },
          {
            path: "followers", component: FollowersComponent
          }
        ]
      },
      {
        path: "inbox", component: InboxComponent
      },
      {
        path: "inbox/:id", component: InboxComponent
      },
      {
        path: "my-plans", component: MyPlansComponent
      },
    ] 
  },
  { path: "myProfile", component: MyProfileComponent, canActivate: [AuthGuard] },
  { path: "user/:id", component: UserProfileComponent, canActivate: [AuthGuard]},
  { path: "search-user", component: SearchUserComponent, canActivate: [AuthGuard]},
  { path: "plans", component: PlansComponent, canActivate: [AuthGuard]},
  { path: "post/:id", component: PostComponent},
  { path: "terms-and-condition", component: TermsAndConditionComponent },
  { path: "privacy-policy", component: PrivacyPolicyComponent },
  { path: "about-us", component: AboutUsComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
