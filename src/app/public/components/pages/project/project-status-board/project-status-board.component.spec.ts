import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectStatusBoardComponent } from './project-status-board.component';

describe('ProjectStatusBoardComponent', () => {
  let component: ProjectStatusBoardComponent;
  let fixture: ComponentFixture<ProjectStatusBoardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProjectStatusBoardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProjectStatusBoardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
