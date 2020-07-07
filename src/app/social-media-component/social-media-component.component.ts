import { Component, OnInit } from '@angular/core';
import {faTwitter} from '@fortawesome/free-brands-svg-icons';

@Component({
  selector: 'app-social-media-component',
  templateUrl: './social-media-component.component.html',
  styleUrls: ['./social-media-component.component.scss']
})
export class SocialMediaComponentComponent implements OnInit {

  twitterIcon = faTwitter;
  constructor() {}



  public ngOnInit(): void {
  }

}
