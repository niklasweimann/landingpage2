import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SideNavContentComponent } from './side-nav-content.component';

describe('SideNavContentComponent', () => {
  let component: SideNavContentComponent;
  let fixture: ComponentFixture<SideNavContentComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SideNavContentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SideNavContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
