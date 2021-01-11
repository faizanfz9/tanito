import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LandingComponent } from './layouts/landing/landing.component';
import { LoginComponent } from './layouts/login/login.component';
import { RegisterComponent } from './layouts/register/register.component';
import { InboxComponent } from './layouts/user-timeline/inbox/inbox.component';
import { FollowersComponent } from './layouts/user-timeline/network/followers/followers.component';
import { FollowingComponent } from './layouts/user-timeline/network/following/following.component';
import { NetworkComponent } from './layouts/user-timeline/network/network.component';
import { TimelineComponent } from './layouts/user-timeline/timeline/timeline.component';
import { UserTimelineComponent } from './layouts/user-timeline/user-timeline.component';

const routes: Routes = [
  { path: "", pathMatch: "full", component: LandingComponent },
  { path: "login", component: LoginComponent },
  { path: "register", component: RegisterComponent },
  { path: "userTimeline", component: UserTimelineComponent, 
    children: [
      {
        path: "", pathMatch: "full", component: TimelineComponent
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
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
