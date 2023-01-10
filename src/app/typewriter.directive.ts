import {AfterViewInit, Directive, ElementRef, Input} from '@angular/core';

@Directive({selector: '[appTypewriter]'})
export class TypewriterDirective implements AfterViewInit {
  private loopNumber = 0;
  private isDeleting = true;
  private displayText = '';

  constructor(private element: ElementRef) {
  }

  private _toType: string | string[] = [];

  @Input() set toType(value: string | string[]) {
    if (typeof value === 'string') {
      this._toType = JSON.parse(value);
    } else {
      this._toType = value;
    }
  }

  private _startDelay = 0;

  @Input() set startDelay(value: number) {
    this._startDelay = value;
  }

  private _delay = 2000;

  @Input() set delay(value: number) {
    this._delay = value;
  }

  private _speed = 150;

  @Input() set speed(value: number) {
    this._speed = value;
  }

  private _includePipe = false;

  @Input() set includePipe(value: boolean) {
    this._includePipe = value;
  }

  private _fastDelete = false;

  @Input() set fastDelete(value: boolean) {
    this._fastDelete = value;
  }

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
