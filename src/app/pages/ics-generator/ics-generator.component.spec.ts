import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IcsGeneratorComponent } from './ics-generator.component';

describe('IcsGeneratorComponent', () => {
  let component: IcsGeneratorComponent;
  let fixture: ComponentFixture<IcsGeneratorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IcsGeneratorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IcsGeneratorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
