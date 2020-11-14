import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IntroLogoComponent } from './intro-logo.component';

describe('IntroLogoComponent', () => {
  let component: IntroLogoComponent;
  let fixture: ComponentFixture<IntroLogoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IntroLogoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IntroLogoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
