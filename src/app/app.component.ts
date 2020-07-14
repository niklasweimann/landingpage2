import {
  Component, ElementRef,
  OnDestroy,
  OnInit, QueryList,
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
  private subscription = new Subscription();
  private isFirefox = false;
  private currentSlideIndex = 0;
  private slidesCount: number;
  private ticking = false;

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  public ngOnInit(): void {
    this.isFirefox = (/Firefox/i.test(navigator.userAgent));
    const eventName = this.isFirefox ? 'DOMMouseScroll' : 'wheel';
    this.subscription = fromEvent<any>(window, eventName).pipe(debounceTime(100)).subscribe((event) => {
      this.handleScrollEvent(event);
      event.preventDefault();
    });
  }

  public handleScrollEvent(event: WheelEvent): void {
    this.slidesCount = this.sections.toArray().length;
    let delta: number;
    if (this.isFirefox) {
      delta = event.detail * (-120);
    } else {
      delta = -event.deltaY;
    }

    if (!this.ticking) {
      if (delta <= -30) {
        // Down scroll
        this.ticking = true;
        if (this.currentSlideIndex !== this.slidesCount - 1) {
          this.currentSlideIndex++;
          this.nextItem();
        }
        this.slideDurationTimeout();
      }
      if (delta >= 30) {
        // Up scroll
        this.ticking = true;
        if (this.currentSlideIndex !== 0) {
          this.currentSlideIndex--;
        }
        this.previousItem();
        this.slideDurationTimeout();
      }
    }
  }

  private nextItem(): void {
    const ps = this.sections.toArray()[this.currentSlideIndex - 1];
    ps.nativeElement.classList.remove('up-scroll');
    ps.nativeElement.classList.add('down-scroll');
  }

  private previousItem(): void {
    const cs: ElementRef<HTMLElement> = this.sections.toArray()[this.currentSlideIndex];
    cs.nativeElement.classList.remove('down-scroll');
    cs.nativeElement.classList.add('up-scroll');
  }

  private slideDurationTimeout(): void {
    setTimeout(() => {
      this.ticking = false;
    }, 600);
  }
}
