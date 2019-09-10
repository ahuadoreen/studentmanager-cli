import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GradeCourseComponent } from './grade-course.component';

describe('GradeCourseComponent', () => {
  let component: GradeCourseComponent;
  let fixture: ComponentFixture<GradeCourseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GradeCourseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GradeCourseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
