import { Component, OnInit } from '@angular/core';
import { ContentService } from 'src/app/shared/content.service';

@Component({
  selector: 'app-privacy-policy',
  templateUrl: './privacy-policy.component.html',
  styleUrls: ['./privacy-policy.component.scss']
})
export class PrivacyPolicyComponent implements OnInit {
  body: any;

  constructor(private contentService: ContentService) { }

  ngOnInit(): void {
    this.contentService.privacyPolicyContent().subscribe((res: any) => this.body = res.data.result[0].privacypolicy);
  }

}
