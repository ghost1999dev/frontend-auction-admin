import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditProjectsComponent } from './add-edit-projects.component';

describe('AddEditProjectsComponent', () => {
  let component: AddEditProjectsComponent;
  let fixture: ComponentFixture<AddEditProjectsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddEditProjectsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddEditProjectsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
