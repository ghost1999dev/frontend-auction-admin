import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectApplicationComponent } from './project-application.component';

describe('ProjectApplicationComponent', () => {
  let component: ProjectApplicationComponent;
  let fixture: ComponentFixture<ProjectApplicationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProjectApplicationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProjectApplicationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
