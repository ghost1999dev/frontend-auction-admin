import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditReportDeveloperComponent } from './add-edit-report-developer.component';

describe('AddEditReportDeveloperComponent', () => {
  let component: AddEditReportDeveloperComponent;
  let fixture: ComponentFixture<AddEditReportDeveloperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddEditReportDeveloperComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddEditReportDeveloperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
