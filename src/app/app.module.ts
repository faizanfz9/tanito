import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from "@angular/common/http";
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LandingComponent } from './layouts/landing/landing.component';
import { HeaderComponent } from './layouts/include/header/header.component';
import { FooterComponent } from './layouts/include/footer/footer.component';
import { LoginComponent } from './layouts/login/login.component';
import { RegisterComponent } from './layouts/register/register.component';
import { UserTimelineComponent } from './layouts/user-timeline/user-timeline.component';
import { NetworkComponent } from './layouts/user-timeline/network/network.component';
import { TimelineComponent } from './layouts/user-timeline/timeline/timeline.component';
import { InboxComponent } from './layouts/user-timeline/inbox/inbox.component';
import { FollowingComponent } from './layouts/user-timeline/network/following/following.component';
import { FollowersComponent } from './layouts/user-timeline/network/followers/followers.component';

@NgModule({
  declarations: [
    AppComponent,
    LandingComponent,
    HeaderComponent,
    FooterComponent,
    LoginComponent,
    RegisterComponent,
    UserTimelineComponent,
    NetworkComponent,
    TimelineComponent,
    InboxComponent,
    FollowingComponent,
    FollowersComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
