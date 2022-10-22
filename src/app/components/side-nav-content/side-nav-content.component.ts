import {Component, OnDestroy, ViewEncapsulation} from '@angular/core';
import {Router, NavigationEnd} from '@angular/router';
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
    new RouteMap('Main', ''),
    //new RouteMap('Gallery', 'gallery')
  ];
  private subscriptions: Subscription[] = [];
  constructor(private router: Router) {
    this.subscriptions.push(
      this.router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe(event => {
        const currentRoute = (event as NavigationEnd).url;
        this.navItems.forEach(rm => rm.Active = false);
        const index = this.navItems.findIndex(rm => rm.Route === currentRoute.substring(1))
        if(index >= 0){
          this.navItems[index].Active = true;
        }
        console.log(currentRoute)
      }));
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  onNavigationSelection(navItem: RouteMap): void {
    this.router.navigate([navItem.Route]);
  }
}
