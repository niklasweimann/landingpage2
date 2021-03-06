import { Component, OnInit } from '@angular/core';
import {faGithub, faInstagram, faTwitter, faXing} from '@fortawesome/free-brands-svg-icons';
import {faAt} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-social-media-component',
  templateUrl: './social-media-component.component.html',
  styleUrls: ['./social-media-component.component.scss']
})
export class SocialMediaComponentComponent implements OnInit {

  public twitterIcon = faTwitter;
  public instagramIcon = faInstagram;
  public githubIcon = faGithub;
  public xingIcon = faXing;
  public atIcon = faAt;
  constructor() {}



  public ngOnInit(): void {
  }

}
