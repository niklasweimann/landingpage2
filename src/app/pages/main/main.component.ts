import {Component, ElementRef, OnInit, ViewChildren} from '@angular/core';
import {fromEvent, Subscription} from "rxjs";
import {debounceTime} from "rxjs/operators";
import {Title} from "@angular/platform-browser";

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
  private ticking = false;

  constructor(private titleService: Title) {
    this.titleService.setTitle("Niklas Weimann")
  }

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
        .pipe(debounceTime(100)).subscribe((event) => {
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

    if (Math.abs(xDiff) <= Math.abs(yDiff)) {
      if (yDiff > 0) {
        this.scrollDown();
      } else {
        this.scrollUp();
      }
    }

    this.xDown = null;
    this.yDown = null;
  };

  public handleScrollEvent(event: WheelEvent): void {
    this.slidesCount = this.sections.toArray().length;
    let delta: number;
    const deltaLimit = 30;
    if (this.isFirefox) {
      delta = event.detail * (-120);
    } else {
      delta = -event.deltaY;
    }

    if (!this.ticking) {
      if (delta <= -deltaLimit) {
        this.scrollDown();
      }
      if (delta >= deltaLimit) {
        this.scrollUp();
      }
    }
  }

  private scrollDown(): void {
    this.ticking = true;
    if (this.currentSlideIndex !== this.slidesCount - 1) {
      this.currentSlideIndex++;
      this.nextItem();
    }
    this.slideDurationTimeout();
  }

  private scrollUp(): void {
    this.ticking = true;
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

  private slideDurationTimeout(): void {
    setTimeout(() => {
      this.ticking = false;
    }, 600);
  }

}
