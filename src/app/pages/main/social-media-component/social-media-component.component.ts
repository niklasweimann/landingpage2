import {Component, OnInit} from '@angular/core';
import {faGithub, faLinkedin, faTwitter} from '@fortawesome/free-brands-svg-icons';
import {faAt, faKey} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-social-media-component',
  templateUrl: './social-media-component.component.html',
  styleUrls: ['./social-media-component.component.scss']
})
export class SocialMediaComponentComponent implements OnInit {

  public twitterIcon = faTwitter;
  public githubIcon = faGithub;
  public linkedInIcon = faLinkedin;
  public keyIcon = faKey;
  public atIcon = faAt;

  constructor() {
  }


  public ngOnInit(): void {
  }

}
