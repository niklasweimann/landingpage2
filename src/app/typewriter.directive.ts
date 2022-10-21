import {AfterViewInit, Directive, ElementRef, Input} from '@angular/core';

@Directive({ selector: '[appTypewriter]' })
export class TypewriterDirective implements AfterViewInit {
  private loopNumber = 0;
  private isDeleting = true;
  private displayText = '';

  private _toType = [];
  private _startDelay = 0;
  private _delay = 2000;
  private _speed = 150;
  private _includePipe = false;
  private _fastDelete = false;

  @Input() set toType(value: any) {
    if (typeof value === 'string') {
      this._toType = JSON.parse(value);
    } else {
      this._toType = value;
    }
  }
  @Input() set startDelay(value: number) {
    this._startDelay = value;
  }
  @Input() set delay(value: number) {
    this._delay = value;
  }
  @Input() set speed(value: number) {
    this._speed = value;
  }
  @Input() set includePipe(value: boolean) {
    this._includePipe = value;
  }
  @Input() set fastDelete(value: boolean) {
    this._fastDelete = value;
  }
  constructor(private element: ElementRef) { }

  public ngAfterViewInit(): void {
    if (this._includePipe) {
      this.element.nativeElement.textContent = '|';
    }
    setTimeout(() => {
      this.type();
    }, this._startDelay);
  }

  private type(): void {
    const start = this.loopNumber % this._toType.length;
    const fullText: string = this._toType[start];

    if (this.isDeleting) {
      this.displayText = fullText.substring(0, this.displayText.length - 1);
    } else {
      this.displayText = fullText.substring(0, this.displayText.length + 1);
    }

    this.element.nativeElement.textContent = this._includePipe ? this.displayText + '|' : this.displayText;

    const that = this;
    let keySpeed = this._speed;

    if (this._fastDelete && this.isDeleting) {
      keySpeed /= 2;
    }

    if (!this.isDeleting && this.displayText === fullText) {
      keySpeed = this._delay;
      this.isDeleting = true;
    } else if (this.isDeleting && this.displayText === '') {
      this.isDeleting = false;
      this.loopNumber++;
      keySpeed = 500;
    }

    setTimeout(() => {
      that.type();
      this.isDeleting = false;
    }, keySpeed);
  }
}
