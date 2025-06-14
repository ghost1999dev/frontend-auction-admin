import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditReportCompanyComponent } from './add-edit-report-company.component';

describe('AddEditReportCompanyComponent', () => {
  let component: AddEditReportCompanyComponent;
  let fixture: ComponentFixture<AddEditReportCompanyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddEditReportCompanyComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddEditReportCompanyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
