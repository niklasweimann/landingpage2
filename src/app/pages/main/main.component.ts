import {Component, ElementRef, OnInit, ViewChildren} from '@angular/core';
import {fromEvent, Subscription} from "rxjs";
import {debounceTime} from "rxjs/operators";
import {faArrowCircleDown, faArrowCircleUp, faCircle} from "@fortawesome/free-solid-svg-icons";
import {IconDefinition} from "@fortawesome/free-brands-svg-icons";
import {FirstSectionComponent} from "./main-component/first-section.component";
import {SocialMediaComponentComponent} from "./social-media-component/social-media-component.component";

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {
  @ViewChildren('section') private sections: any;
  private subscriptions: Subscription[] = [];
  private isFirefox = false;
  private currentSlideIndex = 0;
  private slidesCount: number = 0;
  private isDownScrolling: boolean = false;
  public isTicking = false;

  public pages = [
    {component: FirstSectionComponent},
    {component: SocialMediaComponentComponent}
  ];

  public ngOnDestroy(): void {
    this.subscriptions.forEach(x => x.unsubscribe());
  }

  public ngOnInit(): void {
    const userAgent = navigator.userAgent;
    this.isFirefox = /Firefox/i.test(userAgent);
    this.subscriptions.push(fromEvent<any>(window, 'touchstart').pipe(debounceTime(100)).subscribe((event) => {
      const firstTouch = event.touches[0];
      this.xDown = firstTouch.clientX;
      this.yDown = firstTouch.clientY;
    }));
    this.subscriptions.push(fromEvent<any>(window, 'touchmove').pipe(debounceTime(100)).subscribe((event) => {
      this.handleTouchMove(event);
      event.preventDefault();
    }));
    this.subscriptions.push(
      fromEvent<any>(window, this.isFirefox ? 'DOMMouseScroll' : 'wheel')
        .pipe(debounceTime(10)).subscribe((event) => {
        this.handleScrollEvent(event);
        event.preventDefault();
      })
    );
  }

  private xDown: number | null = null;
  private yDown: number | null = null;

  private handleTouchMove(evt: TouchEvent) {
    this.slidesCount = this.sections.toArray().length;
    if (!this.xDown || !this.yDown) {
      return;
    }

    const xUp = evt.touches[0].clientX;
    const yUp = evt.touches[0].clientY;

    const xDiff = this.xDown - xUp;
    const yDiff = this.yDown - yUp;

    if (!this.isTicking) {
      if (Math.abs(xDiff) <= Math.abs(yDiff)) {
        if (yDiff > 0) {
          this.scrollDown();
        } else {
          this.scrollUp();
        }
      }
    }

    this.xDown = null;
    this.yDown = null;
  };

  public handleScrollEvent(event: WheelEvent): void {
    this.slidesCount = this.sections.toArray().length;
    let delta: number;
    const deltaLimit = 1;
    if (this.isFirefox) {
      delta = event.detail * (-120);
    } else {
      delta = -event.deltaY;
    }

    if (!this.isTicking) {
      if (delta <= -deltaLimit) {
        this.scrollDown();
      }
      if (delta >= deltaLimit) {
        this.scrollUp();
      }
    }
  }

  private scrollDown(): void {
    this.isTicking = true;
    this.isDownScrolling = true;
    if (this.currentSlideIndex !== this.slidesCount - 1) {
      this.currentSlideIndex++;
      this.nextItem();
    }
    this.slideDurationTimeout();
  }

  private scrollUp(): void {
    this.isTicking = true;
    this.isDownScrolling = false;
    if (this.currentSlideIndex !== 0) {
      this.currentSlideIndex--;
    }
    this.previousItem();
    this.slideDurationTimeout();
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

  public navigateUsingArrow(): void {
    if (this.isTicking) {
      return;
    }
    if (this.currentSlideIndex == 0) {
      this.scrollDown();
      return;
    }
    if (this.currentSlideIndex === this.sections.length - 1) {
      this.scrollUp()
      return;
    }
    if (this.isDownScrolling) {
      this.scrollDown();
      return;
    }
    if (!this.isDownScrolling) {
      this.scrollUp();
      return;
    }
  }

  public getArrow(): IconDefinition {
    if (this.isTicking) {
      return faCircle;
    }
    if (this.currentSlideIndex == 0) {
      return faArrowCircleDown;
    }
    if (this.currentSlideIndex === this.sections.length - 1) {
      return faArrowCircleUp;
    }
    if (this.isDownScrolling) {
      return faArrowCircleDown;
    }
    if (!this.isDownScrolling) {
      return faArrowCircleUp;
    }
    return faCircle;
  }

  private slideDurationTimeout(): void {
    setTimeout(() => {
      this.isTicking = false;
    }, 400);
  }

}
