import {Component, Input, OnInit, ViewEncapsulation} from '@angular/core';
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

  @Input() duration = 0.25;
  @Input() navWidth: number = window.innerWidth;
  @Input() direction: SideNavDirection = SideNavDirection.Left;

  constructor(private navService: NavigationService) {
    this.showSideNav = new Observable<boolean>();
  }

  ngOnInit(): void {
    this.showSideNav = this.navService.getShowNav();
  }

  closeSidebar(): void {
    this.navService.setShowNav(false);
  }

  getSideNavBarStyle(showNav: boolean | null): INavigationBarStyle {
    return {
      [this.direction]: (showNav ? 0 : (this.navWidth * -1)) + 'px',
      transition: this.direction + ' ' + this.duration + 's, visibility ' + this.duration + 's',
      width: this.navWidth + 'px'
    };
  }
}

interface INavigationBarStyle {
  transition: string,
  width: string,

  [direction: string]: string
}
