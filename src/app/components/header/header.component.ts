import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {faBars} from '@fortawesome/free-solid-svg-icons';
import {NavigationService} from '../../services/navigation.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class HeaderComponent implements OnInit {
  public fabar = faBars;

  constructor(private navService: NavigationService) {
  }

  ngOnInit(): void {
  }

  toggleSideNav() {
    this.navService.setShowNav(true);
  }

}
