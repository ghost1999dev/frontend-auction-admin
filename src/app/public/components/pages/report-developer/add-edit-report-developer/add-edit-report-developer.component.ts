import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AdminService } from 'src/app/core/services/admin.service';
import { NotificationService } from 'src/app/core/services/notification.service';
import { Report } from 'src/app/core/models/admin';

@Component({
  selector: 'app-add-edit-report-developer',
  templateUrl: './add-edit-report-developer.component.html',
  styleUrls: ['./add-edit-report-developer.component.scss']
})
export class AddEditReportDeveloperComponent implements OnInit {
  @Input() reportId?: any;
  @Input() report?: any;
  @Output() saved = new EventEmitter<void>();
  @Output() cancelled = new EventEmitter<void>();

  reportForm: FormGroup;
  loading = false;
  currentReport?: Report;

  statusOptions = [
    { label: 'Resuelto', value: 'Resuelto' },
    { label: 'Rechazado', value: 'Rechazado' }
  ];

  constructor(
    private fb: FormBuilder,
    private adminService: AdminService,
    private notificationService: NotificationService
  ) {
    this.reportForm = this.fb.group({
      responseMessage: ['', Validators.required],
      newStatus: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    if (this.reportId) {
      this.loadReport(this.reportId);
    } else if (this.report) {
      this.currentReport = this.report;
      this.patchFormValues();
    }
  }

  loadReport(id: number): void {
    this.loading = true;
    this.adminService.getReportById(id).subscribe({
      next: (response) => {
        this.currentReport = response;
        this.patchFormValues();
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.onCancel();
      }
    });
  }

  patchFormValues(): void {
    if (this.currentReport) {
      this.reportForm.patchValue({
        responseMessage: this.currentReport.admin_response || '',
        newStatus: this.currentReport.status === 'Pendiente' ? '' : this.currentReport.status
      });
    }
  }

  onSubmit(): void {
    if (this.reportForm.invalid || !this.currentReport) {
      this.notificationService.showErrorCustom('Por favor complete todos los campos requeridos');
      return;
    }

    this.loading = true;
    const { responseMessage, newStatus } = this.reportForm.value;

    this.adminService.respondToReport(this.currentReport.id, responseMessage, newStatus).subscribe({
      next: () => {
        this.notificationService.showSuccessCustom('Reporte actualizado correctamente');
        this.saved.emit();
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  onCancel(): void {
    this.cancelled.emit();
  }
}