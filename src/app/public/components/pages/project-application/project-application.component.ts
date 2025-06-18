import { Component, OnInit, ViewChild } from '@angular/core';
import { Table } from 'primeng/table';
import { forkJoin } from 'rxjs';
import { Application } from 'src/app/core/models/applications_projects';
import { NotificationService } from 'src/app/core/services/notification.service';
import { ProjectApplicationsService } from 'src/app/core/services/project-applications.service';

@Component({
  selector: 'app-project-application',
  templateUrl: './project-application.component.html',
  styleUrls: ['./project-application.component.scss']
})
export class ProjectApplicationComponent implements OnInit {
  @ViewChild('dt') dt: Table | undefined;
  
  applications: any[] = [];
  selectedApplications: any[] = [];
  application: any = {} as any;

  showAddEditDialog = false;
  currentApplicationId?: number;

  deleteApplicationDialog: boolean = false;
  deleteApplicationsDialog: boolean = false;

  submitted: boolean = false;
  loading: boolean = false;

  statusOptions = [
    { label: 'Activo', value: 0 },
    { label: 'Ganado', value: 1 },
    { label: 'Rechazado', value: 2 }
  ];

  constructor(
    private applicationsService: ProjectApplicationsService,
    private notificationService: NotificationService,
  ) { }

  ngOnInit(): void {
    this.loadApplications();
  }

  loadApplications(): void {
    this.loading = true;
    this.applicationsService.getAllApplications().subscribe({
      next: (applications: any) => {
        this.applications = applications;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  deleteApplication(application: Application): void {
    this.application = { ...application };
    this.deleteApplicationDialog = true;
  }

  confirmDelete(): void {
    this.deleteApplicationDialog = false;
    this.applicationsService.deleteApplication(this.application.id).subscribe({
      next: () => {
        this.notificationService.showSuccessCustom('Application deleted successfully');
        this.loadApplications();
        this.application = {} as Application;
      }
    });
  }

  confirmDeleteSelected(): void {
    this.deleteApplicationsDialog = false;
    if (!this.selectedApplications || this.selectedApplications.length === 0) {
      this.notificationService.showErrorCustom('No applications selected');
      return;
    }

    const deleteOperations = this.selectedApplications.map(app => 
      this.applicationsService.deleteApplication(app.id)
    );

    forkJoin(deleteOperations).subscribe({
      next: () => {
        this.notificationService.showSuccessCustom(`${this.selectedApplications.length} applications deleted`);
        this.loadApplications();
        this.selectedApplications = [];
      }
    });
  }

  onGlobalFilter(table: Table, event: Event): void {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  openNew(): void {
    this.currentApplicationId = undefined;
    this.showAddEditDialog = true;
  }

  editApplication(application: Application): void {
    this.application = { ...application };
    this.currentApplicationId = application.id;
    this.showAddEditDialog = true;
  }

  onApplicationSaved(): void {
    this.showAddEditDialog = false;
    this.loadApplications();
  }

  getStatusLabel(status: number): string {
    return this.statusOptions.find(opt => opt.value === status)?.label || 'Unknown';
  }

  getStatusSeverity(status: any): any {
    switch(status) {
      case 0: return 'success';
      case 1: return 'warning';
      case 2: return 'danger';
      default: return 'info';
    }
  }
}