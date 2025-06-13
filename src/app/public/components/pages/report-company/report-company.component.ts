import { Component, OnInit, ViewChild } from '@angular/core';
import { Table } from 'primeng/table';
import { Report } from 'src/app/core/models/reports';
import { AdminService } from 'src/app/core/services/admin.service';
import { NotificationService } from 'src/app/core/services/notification.service';

@Component({
  selector: 'app-report-company',
  templateUrl: './report-company.component.html',
  styleUrls: ['./report-company.component.scss']
})
export class ReportCompanyComponent implements OnInit {
  @ViewChild('dt') dt: Table | undefined;
  
  reports: Report[] = [];
  selectedReports: Report[] = [];
  report: Report = {} as Report;

  showAddEditDialog = false;
  currentReportId?: number;

  loading: boolean = false;
  statuses = [
    { label: 'Pendiente', value: 'Pendiente' },
    { label: 'Resuelto', value: 'Resuelto' },
    { label: 'Rechazado', value: 'Rechazado' }
  ];

  constructor(
    private adminService: AdminService,
  ) { }

  ngOnInit(): void {
    this.loadReports();
  }

  loadReports(): void {
    this.loading = true;

    const Filter: any = {
      //status: 'Desactivado',
      user_role: 1,
/*       page: 1,
      limit: 100, */
    }

    this.adminService.getAllUserReports('', '1').subscribe({
      next: (response: any) => {
        this.reports = response.data;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  respondToReport(report: Report): void {
    this.report = { ...report };
    this.currentReportId = report.id;
    this.showAddEditDialog = true;
  }

  onReportResponded(): void {
    this.showAddEditDialog = false;
    this.loadReports();
  }

  onGlobalFilter(table: Table, event: Event): void {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  getSeverity(status: any): any {
    switch (status.toLowerCase()) {
        case 'pendiente':
            return 'warning';
        case 'resuelto':
            return 'success';
        case 'rechazado':
            return 'danger';
        default:
            return 'info';
    }
}
}