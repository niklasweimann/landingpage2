import {Component, EventEmitter, OnDestroy, Output, ViewEncapsulation} from '@angular/core';
import {NavigationEnd, Router} from '@angular/router';
import {filter, Subscription} from "rxjs";
import {RouteMap} from './route-map.model';

@Component({
  selector: 'app-side-nav-content',
  templateUrl: './side-nav-content.component.html',
  styleUrls: ['./side-nav-content.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SideNavContentComponent implements OnDestroy {
  public navItems: RouteMap[] = [
    new RouteMap('Home', ''),
    new RouteMap('Resume', 'resume'),
    new RouteMap('Projekte', '', [
      new RouteMap('RxTelegram', 'rxtelegram'),
      new RouteMap('DotAid', 'dotaid')
    ]),
    new RouteMap('Tools', '', [
      new RouteMap('Wallpaper', 'wha'),
      new RouteMap('Terraform Plan Analyzer', 'terraform')
    ])
    //new RouteMap('Gallery', 'gallery')
  ];
  @Output("onNavigationSelected") parentFun: EventEmitter<boolean> = new EventEmitter();
  private subscriptions: Subscription[] = [];

  constructor(private router: Router) {
    this.subscriptions.push(
      this.router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe(event => {
        const currentRoute = (event as NavigationEnd).url;
        this.navItems.forEach(rm => {
          rm.Active = false;
          if (rm.SubItems) {
            rm.SubItems.forEach(sub => sub.Active = false);
            // Check if any submenu item matches current route
            const subIndex = rm.SubItems.findIndex(sub => sub.Route === currentRoute.substring(1));
            if (subIndex >= 0) {
              rm.SubItems[subIndex].Active = true;
              rm.IsExpanded = true; // Auto-expand parent menu
            }
          }
        });
        const index = this.navItems.findIndex(rm => rm.Route === currentRoute.substring(1))
        if (index >= 0) {
          this.navItems[index].Active = true;
        }
        console.log(currentRoute)
      }));
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  onNavigationSelection(navItem: RouteMap): void {
    if (navItem.SubItems && navItem.SubItems.length > 0) {
      // Toggle submenu expansion
      navItem.IsExpanded = !navItem.IsExpanded;
    } else {
      // Navigate to route
      this.parentFun.emit(true)
      this.router.navigate([navItem.Route]).then(r => r);
    }
  }

  onSubItemSelection(subItem: RouteMap): void {
    this.parentFun.emit(true)
    this.router.navigate([subItem.Route]).then(r => r);
  }
}
