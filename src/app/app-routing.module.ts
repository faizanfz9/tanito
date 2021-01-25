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
import { InboxComponent } from './layouts/user-timeline/inbox/inbox.component';
import { FollowersComponent } from './layouts/user-timeline/network/followers/followers.component';
import { FollowingComponent } from './layouts/user-timeline/network/following/following.component';
import { NetworkComponent } from './layouts/user-timeline/network/network.component';
import { TimelineComponent } from './layouts/user-timeline/timeline/timeline.component';
import { UserTimelineComponent } from './layouts/user-timeline/user-timeline.component';
import { UsersComponent } from './layouts/user-timeline/users/users.component';

const routes: Routes = [
  { path: "", pathMatch: "full", component: LandingComponent },
  { path: "login", component: LoginComponent },
  { path: "register", component: RegisterComponent },
  { path: "profile-setup", component: ProfileSetupComponent },
  { path: "userTimeline", component: UserTimelineComponent, canActivate: [AuthGuard],
    children: [
      {
        path: "", pathMatch: "full", component: UsersComponent
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
      }
    ] 
  },
  { path: "myProfile", component: MyProfileComponent },
  { path: "user/:id", component: UserProfileComponent},
  { path: "terms-and-condition", component: TermsAndConditionComponent },
  { path: "privacy-policy", component: PrivacyPolicyComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
