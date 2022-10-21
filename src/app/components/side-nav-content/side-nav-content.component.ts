import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {Router} from '@angular/router';

@Component({
  selector: 'app-side-nav-content',
  templateUrl: './side-nav-content.component.html',
  styleUrls: ['./side-nav-content.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SideNavContentComponent implements OnInit {

  navItems = [
    {label: 'Main', route: '/'},
    {label: 'Gallery', route: '/gallery'}
  ];

  constructor(private router: Router) {
  }

  ngOnInit(): void {
  }

  onNavigationSelection(navItem: any): void {
    this.router.navigate([navItem.route]);
  }

}
