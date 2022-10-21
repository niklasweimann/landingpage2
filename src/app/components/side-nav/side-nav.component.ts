import {Component, OnInit, ViewEncapsulation, Input} from '@angular/core';
import {Observable} from 'rxjs';
import {NavigationService} from '../../services/navigation.service';
import {SideNavDirection} from '../../side-nav-direction';
import {faTimes} from "@fortawesome/free-solid-svg-icons";

@Component({
  selector: 'app-side-nav',
  templateUrl: './side-nav.component.html',
  styleUrls: ['./side-nav.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SideNavComponent implements OnInit {
  fatimes = faTimes
  showSideNav: Observable<boolean | null>;

  @Input() sidenavTemplateRef: any;
  @Input() duration = 0.25;
  @Input() navWidth: number = window.innerWidth;
  @Input() direction: SideNavDirection = SideNavDirection.Left;

  constructor(private navService: NavigationService) {
    this.showSideNav = new Observable<boolean>();
  }

  ngOnInit(): void {
    this.showSideNav = this.navService.getShowNav();
  }

  onSidebarClose(): void {
    this.navService.setShowNav(false);
  }

  getSideNavBarStyle(showNav: boolean | null): {} {
    const navBarStyle: any = {};

    navBarStyle.transition = this.direction + ' ' + this.duration + 's, visibility ' + this.duration + 's';
    navBarStyle.width = this.navWidth + 'px';
    navBarStyle[this.direction] = (showNav ? 0 : (this.navWidth * -1)) + 'px';

    return navBarStyle;
  }
}
