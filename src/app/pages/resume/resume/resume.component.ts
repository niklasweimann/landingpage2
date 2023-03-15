import { Component, OnInit } from '@angular/core';
import {faGithub, faLinkedin, faTwitter} from "@fortawesome/free-brands-svg-icons";
import {ExternalLinkGeneratorService} from "../../../services/external-link-generator.service";
import {faEnvelope, faHomeLg} from "@fortawesome/free-solid-svg-icons";

@Component({
  selector: 'app-resume',
  templateUrl: './resume.component.html',
  styleUrls: ['./resume.component.scss']
})
export class ResumeComponent implements OnInit {
  public twitterIcon = faTwitter;
  public linkedInIcon = faLinkedin;
  public githubIcon = faGithub;
  public homeIcon = faHomeLg;
  public mailIcon = faEnvelope;

  public externalLinkService: ExternalLinkGeneratorService;

  constructor(externalLinkService: ExternalLinkGeneratorService) {
    this.externalLinkService = externalLinkService;
  }

  ngOnInit(): void {
  }

}
