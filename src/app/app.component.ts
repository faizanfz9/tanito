import { Component } from '@angular/core';
import { Location } from '@angular/common';
import { NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'tanito';

  constructor(private router: Router, private location: Location) {
    let currentPath = this.location.path();
    if(localStorage.getItem("user") && !currentPath.includes("post")) {
      this.router.navigate(['/feed']);
    }

    this.router.events.subscribe((evt) => {
        if (!(evt instanceof NavigationEnd)) {
            return;
        }
        // window.scrollTo(0, 0)
    });
  }
}
