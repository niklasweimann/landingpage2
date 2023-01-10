import {Component, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import {SideNavDirection} from "./side-nav-direction";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AppComponent implements OnInit, OnDestroy {
  sidebarDirection: SideNavDirection = SideNavDirection.Left;

  ngOnDestroy(): void {
  }

  ngOnInit(): void {
  }

}
