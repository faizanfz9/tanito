import { Component, OnInit } from '@angular/core';
import { ContentService } from 'src/app/shared/content.service';

@Component({
  selector: 'app-terms-and-condition',
  templateUrl: './terms-and-condition.component.html',
  styleUrls: ['./terms-and-condition.component.scss']
})
export class TermsAndConditionComponent implements OnInit {
  body: any;

  constructor(private contentService: ContentService) { }

  ngOnInit(): void {
    this.contentService.termsAndConditionContent().subscribe((res: any) => this.body = res.data.result[0].termcondition);
  }

}
