import {Injectable, OnInit} from "@angular/core";

@Injectable({
  providedIn: 'root'
})

export class ExternalLinkGeneratorService implements OnInit {
  ngOnInit(): void {
  }

  public twitterUsername = "niklasweimann"
  public twitterLink = "https://twitter.com/" + this.twitterUsername;
  public githubUsername = "niklasweimann";
  public githubLink = "https://github.com/" + this.githubUsername;
  public linkedInUsername = "niklasweimann";
  public linkedInLink = "https://linkedin.com/in/" + this.linkedInUsername;
  public mailAddress = "niklas@weimann.io";
}
