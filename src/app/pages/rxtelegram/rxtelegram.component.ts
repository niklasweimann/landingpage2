import {Component, OnInit} from '@angular/core';
import {faGithub} from "@fortawesome/free-brands-svg-icons";
import {faCube, faGlobe} from "@fortawesome/free-solid-svg-icons";

@Component({
  selector: 'app-rxtelegram',
  templateUrl: './rxtelegram.component.html',
  styleUrls: ['./rxtelegram.component.scss']
})
export class RxtelegramComponent implements OnInit {

  constructor() {
  }

  ngOnInit(): void {
  }

  protected readonly faGithub = faGithub;
  protected readonly faCubeIcon = faCube;
  protected readonly faWebsite = faGlobe
}
