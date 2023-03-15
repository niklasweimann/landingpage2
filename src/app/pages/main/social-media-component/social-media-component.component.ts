import {Component, OnInit} from '@angular/core';
import {faGithub, faLinkedin, faTwitter} from '@fortawesome/free-brands-svg-icons';
import {faAt, faKey} from '@fortawesome/free-solid-svg-icons';
import {ExternalLinkGeneratorService} from "../../../services/external-link-generator.service";

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

  public externalLinkGeneratorService: ExternalLinkGeneratorService;

  constructor(externalLinkGeneratorService: ExternalLinkGeneratorService) {
    this.externalLinkGeneratorService = externalLinkGeneratorService;
  }


  public ngOnInit(): void {
  }

}
