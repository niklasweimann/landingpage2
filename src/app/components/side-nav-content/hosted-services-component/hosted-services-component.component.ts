import {Component, OnInit} from '@angular/core';
import {faGitlab, faWordpress} from "@fortawesome/free-brands-svg-icons";
import {faBook, faCloud} from "@fortawesome/free-solid-svg-icons";

@Component({
  selector: 'hosted-services-component',
  templateUrl: './hosted-services-component.component.html',
  styleUrls: ['./hosted-services-component.component.scss']
})
export class HostedServicesComponentComponent implements OnInit {
  fagitlab = faGitlab;
  faboook = faBook;
  faCloud = faCloud;
  faWordpress = faWordpress;

  ngOnInit() {
  }

}
