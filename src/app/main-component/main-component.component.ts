import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-main-component',
  templateUrl: './main-component.component.html',
  styleUrls: ['./main-component.component.scss']
})
export class MainComponentComponent implements OnInit {
  public typewriterText = ['Hey, I\'m Niklas.'];
  public age = 0;

  constructor() {
  }

  public ngOnInit(): void {
    const birthday = new Date(1998, 6, 1);
    this.age = this.diffYears(new Date(), birthday);
  }

  private diffYears(dt2, dt1): number {
    let diff = (dt2.getTime() - dt1.getTime()) / 1000;
    diff /= (60 * 60 * 24);
    return Math.abs(Math.round(diff / 365.25));

  }
}
