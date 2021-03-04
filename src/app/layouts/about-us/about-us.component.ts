import { Component, OnInit } from '@angular/core';
import { ContentService } from 'src/app/shared/content.service';

@Component({
  selector: 'app-about-us',
  templateUrl: './about-us.component.html',
  styleUrls: ['./about-us.component.scss']
})
export class AboutUsComponent implements OnInit {
  body: any;

  constructor(private contentService: ContentService) { }

  ngOnInit(): void {
    this.contentService.aboutUsContent().subscribe((res: any) => this.body = res.data.result[0].aboutus);
  }

}
