import {
  Component,
  OnDestroy,
  OnInit,
  ViewChildren,
  ViewEncapsulation
} from '@angular/core';
import {fromEvent, Subscription} from 'rxjs';
import {debounceTime} from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AppComponent implements OnInit, OnDestroy {
  @ViewChildren('section') private sections;
  private sectionElements: any;
  private subscription = new Subscription();
  private currentIndex = 0;
  private delta: number;
  private animating = false;

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  public ngOnInit(): void {
    this.subscription = fromEvent<any>(window, 'wheel').pipe(debounceTime(100)).subscribe((event) => {
      this.handleScrollEvent(event);
    });
  }

  public handleScrollEvent(event: WheelEvent): void {
    this.sectionElements = this.sections.toArray();
    this.delta = event.deltaY ? event.deltaY : -event.detail;
    const targetIndex = this.currentIndex + (this.delta > 0 ? 1 : -1);

    if (this.animating || targetIndex < 0 || targetIndex > this.sectionElements.length - 1) {
      return;
    }
    const children = this.sectionElements[this.currentIndex];
    this.animating = true;
    this.subscription.add(fromEvent<any>(children[0], 'transitionend').subscribe(() => {
      this.animating = false;
    }));

    const translateY = 'translateY(-' + targetIndex * 100 + '%)';
    children.nativeElement.css = {
      transform: translateY,
      '-webkit-transform': translateY
    };

    this.currentIndex = targetIndex;
  }
}
