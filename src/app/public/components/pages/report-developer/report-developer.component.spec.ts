import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportDeveloperComponent } from './report-developer.component';

describe('ReportDeveloperComponent', () => {
  let component: ReportDeveloperComponent;
  let fixture: ComponentFixture<ReportDeveloperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ReportDeveloperComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReportDeveloperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
