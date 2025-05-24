import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditProjectApplicationComponent } from './add-edit-project-application.component';

describe('AddEditProjectApplicationComponent', () => {
  let component: AddEditProjectApplicationComponent;
  let fixture: ComponentFixture<AddEditProjectApplicationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddEditProjectApplicationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddEditProjectApplicationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
