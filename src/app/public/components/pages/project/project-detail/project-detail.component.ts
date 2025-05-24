import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProjectStatusUpdate } from 'src/app/core/models/admin';
import { Project } from 'src/app/core/models/projects';
import { AdminService } from 'src/app/core/services/admin.service';
import { NotificationService } from 'src/app/core/services/notification.service';
import { ProjectsService } from 'src/app/core/services/projects.service';

@Component({
  selector: 'app-project-detail',
  templateUrl: './project-detail.component.html',
  styleUrls: ['./project-detail.component.scss']
})
export class ProjectDetailComponent implements OnInit {
  project: Project | null = null;
  isLoading: boolean = true;
  error: string | null = null;

  statusOptions = [
    { label: 'Pendiente', value: 0 },
    { label: 'Activo', value: 1 },
    //{ label: 'Inactivo', value: 2 },
    { label: 'Rechazado', value: 3 },
    { label: 'Completado', value: 4 }
  ];

  selectedStatus!: number;


  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private adminServices: AdminService,
    private notificationService: NotificationService,
    private projectService: ProjectsService,
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    
    this.projectService.getProjectById(id)
    .subscribe({
      next: (project) => {
        this.project = project;
        this.selectedStatus = project.status; // Inicializa con el estado actual
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'Failed to load project details';
        this.isLoading = false;
        console.error(err);
      }
    });
  }

// Método para actualizar el estado
updateStatus(): void {
  if (this.project && this.selectedStatus !== undefined) {
    this.updateProjectStatus(this.project.id, this.selectedStatus);
  }
}

// Método cuando cambia la selección (opcional)
onStatusChange(): void {
  // Puedes agregar lógica adicional aquí si necesitas
}

private updateProjectStatus(projectId: number, newStatus: number): void {
  const statusUpdate: ProjectStatusUpdate = { newStatus };
  
  this.adminServices.updateProjectStatus(projectId, statusUpdate).subscribe({
    next: () => {
      this.notificationService.showSuccessCustom('Project status updated');
      // Actualiza el estado local del proyecto
      if (this.project) {
        this.project.status = newStatus;
        this.router.navigate(['/main/projects'])
      }
    },
    error: () => {
      this.notificationService.showErrorCustom('Failed to update project status');
      // Revertir la selección si falla
      if (this.project) {
        this.selectedStatus = this.project.status;
      }
    }
  });
}

  getStatusText(status: number): string {
    switch (status) {
      case 0:
        return "Inactivo";
      case 1:
        return "Activo";
      case 2:
        return "Pendiente";
      case 4:
        return "Completado";
      case 3:
        return "Rechazado";
      default:
        return "Desconocido";
    }
  }

  formatDate(dateString?: string): string {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  }}