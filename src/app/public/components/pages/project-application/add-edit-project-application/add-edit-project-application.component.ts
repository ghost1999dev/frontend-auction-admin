import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Application } from 'src/app/core/models/applications_projects';
import { NotificationService } from 'src/app/core/services/notification.service';
import { ProjectApplicationsService } from 'src/app/core/services/project-applications.service';
import { ProjectsService } from 'src/app/core/services/projects.service';
import { DeveloperService } from 'src/app/core/services/developer.service';
import { Project } from 'src/app/core/models/projects';
import { getDeveloper } from 'src/app/core/models/developer';

@Component({
  selector: 'app-add-edit-project-application',
  templateUrl: './add-edit-project-application.component.html',
  styleUrls: ['./add-edit-project-application.component.scss']
})
export class AddEditProjectApplicationComponent implements OnInit {
  @Input() applicationId?: number;
  @Output() saved = new EventEmitter<void>();
  @Output() cancelled = new EventEmitter<void>();

  applicationForm: FormGroup;
  loading = false;
  submitted = false;

  statusOptions = [
    { label: 'Pendiente', value: 0 },
    { label: 'Aceptado', value: 1 },
    { label: 'Rechazado', value: 2 }
  ];

  projects: Project[] = [];
  developers: getDeveloper[] = [];

  constructor(
    private fb: FormBuilder,
    private applicationsService: ProjectApplicationsService,
    private projectsService: ProjectsService,
    private developerService: DeveloperService,
    private notificationService: NotificationService,
  ) {
    this.applicationForm = this.fb.group({
      project_id: ['', Validators.required],
      developer_id: ['', Validators.required],
      status: [0, Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadProjects();
    this.loadDevelopers();

    if (this.applicationId) {
      this.loadApplication(this.applicationId);
    }
  }

  loadProjects(): void {
    this.projectsService.getAllProjects().subscribe({
      next: (projects) => {
        this.projects = projects;
      },
      error: (error) => {
        this.notificationService.showErrorCustom('Error al cargar proyectos');
      }
    });
  }

  loadDevelopers(): void {
    this.developerService.getAllDevelopers().subscribe({
      next: (developers) => {
        this.developers = developers;
      },
      error: (error) => {
        this.notificationService.showErrorCustom('Error al cargar desarrolladores');
      }
    });
  }

  loadApplication(id: number): void {
    this.loading = true;
    this.applicationsService.getApplicationById(id).subscribe({
      next: (application: any) => {
        this.applicationForm.patchValue({
          project_id: application.project_id,
          developer_id: application.developer_id,
          status: application.status
        });
        this.loading = false;
      },
      error: (error) => {
        this.notificationService.showErrorCustom(error.error?.message || 'Error al cargar la solicitud');
        this.loading = false;
      }
    });
  }

  onSubmit(): void {
    this.submitted = true;

    if (this.applicationForm.invalid) {
      return;
    }

    this.loading = true;
    const formData = this.applicationForm.value;

    if (this.applicationId) {
      // Actualizar solicitud
      this.applicationsService.updateApplication(this.applicationId, formData).subscribe({
        next: () => {
          this.notificationService.showSuccessCustom('Solicitud actualizada correctamente');
          this.saved.emit();
        },
        error: (error) => {
          this.notificationService.showErrorCustom(error.error?.message || 'Error al actualizar la solicitud');
          this.loading = false;
        }
      });
    } else {
      // Crear solicitud
      this.applicationsService.createApplication(formData).subscribe({
        next: () => {
          this.notificationService.showSuccessCustom('Solicitud creada correctamente');
          this.saved.emit();
        },
        error: (error) => {
          this.notificationService.showErrorCustom(error.error?.message || 'Error al crear la solicitud');
          this.loading = false;
        }
      });
    }
  }

  onCancel(): void {
    this.cancelled.emit();
  }

  get f() { return this.applicationForm.controls; }
}