import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'first-section-component',
  templateUrl: './first-section.component.html',
  styleUrls: ['./first-section.component.scss']
})
export class FirstSectionComponent implements OnInit {
  public typewriterText = ['Hey, I\'m Niklas.'];
  public age = 0;

  constructor() {
  }

  public ngOnInit(): void {
    const birthday = new Date(1998, 6, 1);
    this.age = this.diffYears(new Date(), birthday);
  }

  private diffYears(dt2: Date, dt1: Date): number {
    let diff = (dt2.getTime() - dt1.getTime()) / 1000;
    diff /= (60 * 60 * 24);
    return Math.abs(Math.round(diff / 365.25));

  }
}
